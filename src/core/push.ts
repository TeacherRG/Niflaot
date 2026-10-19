/**
 * «Напоминать каждый день» — the daily notification with the message of the day (src/core/dailyMessage.ts).
 * The one place where the site asks the browser for a permission (scripts/check-lessons.ts allows it only here),
 * and only when the player taps «Включить напоминание»; never by itself.
 *
 * How it works: the service worker (public/sw.js) subscribes to the browser's push service; the subscription,
 * the time zone, the hour and the language go to the assistant worker (assistant/, `/push/*`), which once an hour
 * sends an empty push to those whose hour has come — never on Shabbat (all Saturday, Friday from noon); the service
 * worker then shows today's message. «Проверить» sends one push right away.
 * On iPhone / iPad push works only for the site added to the Home Screen (Safari 16.4+).
 */
import { ASSISTANT_URL } from './assistant';
import type { Locale } from '../i18n';
import { currentMode, MODE_EVENT } from './mode';
import { normWord } from './sync';

const STORE = 'niflaot:push';
const PREFS = '/__niflaot/push-prefs';
/** the hours the player can pick (local time); Friday afternoon and Saturday are skipped by the server */
export const PUSH_HOURS = [7, 8, 13, 16, 17, 19] as const;
export const DEFAULT_HOUR = 17;

/**
 * «После чего вы будете учиться?» — привязка к тому, что человек и так делает каждый день («якорь» привычки): учёба
 * сразу после него легче становится постоянной. Якорь задаёт час по умолчанию и первую строку уведомления (public/sw.js).
 */
export const ANCHORS = { prayer: 7, breakfast: 8, lunch: 13, school: 16, work: 17, dinner: 19 } as const;
export type Anchor = keyof typeof ANCHORS;
export const isAnchor = (a: unknown): a is Anchor => typeof a === 'string' && a in ANCHORS;

export type PushState =
  | { kind: 'unsupported' }
  /** iPhone / iPad in Safari: push only after «На экран Домой» */
  | { kind: 'ios' }
  | { kind: 'denied' }
  | { kind: 'off' }
  | { kind: 'on'; hour: number; anchor?: Anchor };

const ios = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const supported = () => !!ASSISTANT_URL && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const saved = (): { hour: number; endpoint: string; anchor?: string } | null => {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? 'null');
  } catch {
    return null;
  }
};

export async function pushState(): Promise<PushState> {
  if (!supported()) return ios() ? { kind: 'ios' } : { kind: 'unsupported' };
  if (Notification.permission === 'denied') return { kind: 'denied' };
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  const s = saved();
  return sub && s && s.endpoint === sub.endpoint ? { kind: 'on', hour: s.hour, anchor: isAnchor(s.anchor) ? s.anchor : undefined } : { kind: 'off' };
}

async function api(path: string, body: object) {
  const res = await fetch(`${ASSISTANT_URL}/push/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw Object.assign(new Error(`push/${path}: ${res.status}`), { status: res.status });
  return res;
}

/**
 * the language and the mode of the message — for the service worker, which can't read localStorage: the adults'
 * mode gets the passage of the day of the Prophets and Writings (src/core/dailyMessage.ts)
 */
async function savePrefs(lang: Locale) {
  const c = await caches.open('niflaot-prefs');
  await c.put(PREFS, new Response(JSON.stringify({ lang, mode: currentMode(), wordsDue: wordsDue(), anchor: saved()?.anchor }), { headers: { 'Content-Type': 'application/json' } }));
}

/**
 * «Мои слова» (src/core/words.ts): the review days of the words in the reader's list — the service worker counts
 * those already due on the day of the message and adds «Слова: повторить N» to the adults' message. Read straight
 * from localStorage (the words module and its dictionary stay out of this bundle).
 */
function wordsDue(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem('niflaot:words') ?? '{}') ?? {};
    return Object.values(raw)
      .map(normWord)
      .filter((e) => e[1] > 0)
      .map((e) => e[2]);
  } catch {
    return [];
  }
}

/** a browser without a push service (e.g. Chromium without Google) never answers the subscription: give up */
const timeout = <T>(p: Promise<T>, ms = 20_000) =>
  Promise.race([p, new Promise<never>((_, no) => setTimeout(() => no(new Error('timeout')), ms))]);

const b64 = (s: string) => {
  const raw = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

/** Ask once (the player tapped the button), subscribe, tell the server the hour; returns the new state. */
export async function enablePush(hour: number, lang: Locale, anchor?: Anchor): Promise<PushState> {
  if (!supported()) return ios() ? { kind: 'ios' } : { kind: 'unsupported' };
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission === 'denied' ? { kind: 'denied' } : { kind: 'off' };
  const reg = await timeout(navigator.serviceWorker.ready);
  const { key } = await (await fetch(`${ASSISTANT_URL}/push/key`)).json();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await timeout(reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) }));
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  await api('subscribe', { subscription: sub.toJSON(), tz, hour, lang });
  localStorage.setItem(STORE, JSON.stringify({ hour, endpoint: sub.endpoint, anchor }));
  await savePrefs(lang);
  return { kind: 'on', hour, anchor };
}

/**
 * «Проверить»: one notification right away — the message of today. The push service no longer knows the
 * subscription (the server answers 410 or 404) → it is dropped here too: `gone`, the player turns it on again.
 */
export async function testPush(lang: Locale): Promise<'sent' | 'gone'> {
  const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
  if (!sub) {
    localStorage.removeItem(STORE);
    return 'gone';
  }
  await savePrefs(lang);
  try {
    await api('test', { endpoint: sub.endpoint });
    return 'sent';
  } catch (e) {
    if ((e as { status?: number }).status !== 410 && (e as { status?: number }).status !== 404) throw e;
    await sub.unsubscribe().catch(() => {});
    localStorage.removeItem(STORE);
    return 'gone';
  }
}

export async function disablePush(): Promise<PushState> {
  const sub = await (await navigator.serviceWorker.getRegistration())?.pushManager.getSubscription();
  if (sub) {
    await api('unsubscribe', { endpoint: sub.endpoint }).catch(() => {});
    await sub.unsubscribe();
  }
  localStorage.removeItem(STORE);
  return { kind: 'off' };
}

/** The language changed on the site (and on every visit): the next messages in this language and mode. */
let lastLang: Locale | null = null;
export async function pushLanguage(lang: Locale) {
  lastLang = lang;
  if (saved()) await savePrefs(lang).catch(() => {});
}

// the mode changed («Режим · сменить»), or the words of «Мои слова» did: the next messages know it
if (typeof window !== 'undefined')
  for (const ev of [MODE_EVENT, 'niflaot:words'])
    window.addEventListener(ev, () => {
      if (lastLang) void pushLanguage(lastLang);
    });
