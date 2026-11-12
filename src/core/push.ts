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
import { ZIP_KEY, zipReminder } from './zipReminder';
import { STUDY_EVENT, streakForReminder } from './habit';

const STORE = 'niflaot:push';
/**
 * «Напоминание было включено» — synced with the account (src/core/sync.ts), unlike STORE (the subscription of this
 * device): `{on: 1 | 0, hour, anchor?, t}`. After the app is reinstalled (the subscription and STORE are gone) the site
 * knows the reminder was on: with the permission still granted it turns it back on by itself, otherwise it offers
 * «Включить снова». The later change wins (`mergePushWant`).
 */
export const WANT = 'niflaot:push-want';
const SYNCED = 'niflaot:push-sync';
const DECLINED = 'niflaot:push-no';
const RESYNC_MS = 12 * 3600_000;
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
  /** `again` — the reminder was on (here before a reinstall, or on another device of the account): «Включить снова» */
  | { kind: 'off'; again?: { hour: number; anchor?: Anchor } }
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

type Want = { on: 0 | 1; hour: number; anchor?: string; t: number };
const want = (): Want | null => {
  try {
    const w = JSON.parse(localStorage.getItem(WANT) ?? 'null');
    return w && (w.on === 0 || w.on === 1) && PUSH_HOURS.includes(w.hour) ? w : null;
  } catch {
    return null;
  }
};
const setWant = (on: boolean, hour: number, anchor?: string) => {
  try {
    localStorage.setItem(WANT, JSON.stringify({ on: on ? 1 : 0, hour, ...(anchor ? { anchor } : {}), t: Date.now() }));
  } catch {}
};
const declined = () => {
  try {
    return localStorage.getItem(DECLINED) === '1';
  } catch {
    return false;
  }
};

/** what should be on here: this device's subscription, or the account's «было включено» (not after «Не напоминать» here) */
const plan = (): { hour: number; anchor?: Anchor } | null => {
  const s = saved();
  if (s && PUSH_HOURS.includes(s.hour as never)) return { hour: s.hour, anchor: isAnchor(s.anchor) ? s.anchor : undefined };
  const w = want();
  return w?.on && !declined() ? { hour: w.hour, anchor: isAnchor(w.anchor) ? w.anchor : undefined } : null;
};

/** the self-repair of this page load (`syncPush`): pushState waits for it, so the block doesn't show «off» for a moment */
let healing: Promise<unknown> | null = null;

export async function pushState(): Promise<PushState> {
  if (!supported()) return ios() ? { kind: 'ios' } : { kind: 'unsupported' };
  if (healing) await timeout(healing, 8000).catch(() => {});
  if (Notification.permission === 'denied') return { kind: 'denied' };
  const p = plan();
  // not «granted» (e.g. reset by a reinstall): nothing can be shown, whatever the subscription says
  if (Notification.permission !== 'granted') return p ? { kind: 'off', again: p } : { kind: 'off' };
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  const s = saved();
  if (sub && s && s.endpoint === sub.endpoint) return { kind: 'on', hour: s.hour, anchor: isAnchor(s.anchor) ? s.anchor : undefined };
  return p ? { kind: 'off', again: p } : { kind: 'off' };
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
 * mode gets the passage of the day of the Prophets and Writings (src/core/dailyMessage.ts); `study` — the streak
 * (src/core/habit.ts): the first line of the message — «✓ вы уже учились сегодня», «🔥 N дней подряд — не прервите» or a motto
 */
async function savePrefs(lang: Locale) {
  const c = await caches.open('niflaot-prefs');
  // hour, tz, api, key — for «pushsubscriptionchange» in public/sw.js: the browser replaced the subscription → the worker tells the server itself
  const s = saved();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  await c.put(PREFS, new Response(JSON.stringify({ lang, hour: s?.hour, tz, api: ASSISTANT_URL, key: serverKey, mode: currentMode(), wordsDue: wordsDue(), wordsKnownDue: wordsDue(true), zip: zipReminder(localStorage.getItem(ZIP_KEY)), anchor: saved()?.anchor, study: streakForReminder() }), { headers: { 'Content-Type': 'application/json' } }));
}

/**
 * «Мои слова» (src/core/words.ts): the review days of the words in the reader's list — the service worker counts
 * those already due on the day of the message and adds «Слова: повторить N» to the adults' message. Read straight
 * from localStorage (the words module and its dictionary stay out of this bundle).
 */
function wordsDue(known = false): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem('niflaot:words') ?? '{}') ?? {};
    // «учу» (коробки 1–2) — `wordsDue`, «знаю» (3+) — `wordsKnownDue`: их в день не больше 25 (`DAILY_KNOWN` в words.ts)
    return Object.values(raw)
      .map(normWord)
      .filter((e) => (known ? e[1] >= 3 : e[1] > 0 && e[1] < 3))
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

let serverKey = '';

/** subscribe this browser (the permission is already granted — no question) and tell the server the hour */
async function subscribeHere(hour: number, lang: Locale, anchor?: string): Promise<PushState> {
  const reg = await timeout(navigator.serviceWorker.ready);
  serverKey = (await (await fetch(`${ASSISTANT_URL}/push/key`)).json()).key;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await timeout(reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(serverKey) }));
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // the server keeps one row per address (ON CONFLICT … UPDATE): sending it again is harmless
  await api('subscribe', { subscription: sub.toJSON(), tz, hour, lang });
  localStorage.setItem(STORE, JSON.stringify({ hour, endpoint: sub.endpoint, anchor }));
  localStorage.setItem(SYNCED, String(Date.now()));
  await savePrefs(lang);
  return { kind: 'on', hour, anchor: isAnchor(anchor) ? anchor : undefined };
}

/** Ask once (the player tapped the button), subscribe, tell the server the hour; returns the new state. */
export async function enablePush(hour: number, lang: Locale, anchor?: Anchor): Promise<PushState> {
  if (!supported()) return ios() ? { kind: 'ios' } : { kind: 'unsupported' };
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission === 'denied' ? { kind: 'denied' } : { kind: 'off' };
  const next = await subscribeHere(hour, lang, anchor);
  setWant(true, hour, anchor);
  return next;
}

/**
 * Once a page load (from `pushLanguage`), without asking anything: the reminder should be on here (this device, or the
 * account after a reinstall) and the browser still allows notifications → make sure the subscription exists and the
 * server knows it. Repairs a subscription the browser replaced or the server dropped; the server is told again at most
 * every 12 hours, or at once when the address changed. The permission is never requested here.
 */
async function syncPush(lang: Locale) {
  if (!supported() || Notification.permission !== 'granted') return;
  const p = plan();
  if (!p) return;
  const reg = await navigator.serviceWorker.getRegistration();
  // no service worker yet (the first load after an install, or `npm run dev`): next time, or «Включить снова»
  if (!reg) return;
  const s = saved();
  const sub = await reg.pushManager.getSubscription();
  const fresh = Date.now() - Number(localStorage.getItem(SYNCED) ?? 0) < RESYNC_MS;
  if (sub && s && s.endpoint === sub.endpoint && fresh) return;
  await subscribeHere(p.hour, lang, p.anchor);
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
  setWant(false, saved()?.hour ?? want()?.hour ?? DEFAULT_HOUR);
  localStorage.removeItem(STORE);
  return { kind: 'off' };
}

/** The language changed on the site (and on every visit): the next messages in this language and mode. */
let lastLang: Locale | null = null;
export async function pushLanguage(lang: Locale) {
  const first = !lastLang;
  lastLang = lang;
  if (first && typeof window !== 'undefined') healing = syncPush(lang).catch(() => {});
  if (saved()) await savePrefs(lang).catch(() => {});
}

// the mode changed («Режим · сменить»), or the words of «Мои слова» did: the next messages know it
if (typeof window !== 'undefined')
  for (const ev of [MODE_EVENT, 'niflaot:words', ZIP_KEY, STUDY_EVENT])
    window.addEventListener(ev, () => {
      if (lastLang) void pushLanguage(lastLang);
    });
