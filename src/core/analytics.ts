/**
 * Visit statistics — GoatCounter (https://niflaot.goatcounter.com): no cookies, no personal data,
 * countries and page counts. The site uses hash routing, so every route is counted by hand
 * (`#/<slug>/memo` → `/<slug>/memo`). Not counted: dev server, `#/admin`, the admin's own browser,
 * `?shabbat=preview`. The CSP allowing these hosts is in scripts/prerender.ts.
 *
 * GoatCounter has no «users»: its «visitors» are sessions (a hash of IP + browser, ~8 hours), so one person
 * a week is counted several times. For people the site sends one event per device — `new-device` (title
 * «Новое устройство»), on its very first visit: in the dashboard it is a line among the pages, its count over a period
 * is how many new devices came (by country and source too). A device counts again after the browser's data is cleared.
 * Real people — the accounts: «Пользователи» in the admin (`#/admin/users`).
 */
import { isAdmin } from '../admin/github';
import { shabbatPreview } from './shabbat';

const ENDPOINT = 'https://niflaot.goatcounter.com/count';
const SCRIPT = 'https://gc.zgo.at/count.js';

interface GoatCounter {
  no_onload?: boolean;
  count?: (o: { path: string; title?: string; event?: boolean }) => void;
}
declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

/** The route as a path: from the hash, else the static `/<slug>/` page. */
function currentPath(): string {
  const route = location.hash
    ? location.hash.replace(/^#\/?/, '').split('?')[0]
    : location.pathname.split('/').filter(Boolean).pop() ?? '';
  // «Викторина вместе»: one path for every room, not one per room code
  return `/${route.replace(/\/+$/, '').replace(/^(quiz(?:\/host)?)\/[A-Z0-9]{5}$/, '$1/room')}`;
}

const SEEN_KEY = 'niflaot:gc-device';
/** the trial start (src/core/gate.ts) — set on the device's first visit; an older one means the device came before this event existed */
const TRIAL_KEY = 'niflaot:trial';
const FRESH_MS = 10 * 60_000;

/** Is this the device's first visit? Asked once: the answer is remembered. No storage — not counted. */
function newDevice(): boolean {
  try {
    if (localStorage.getItem(SEEN_KEY)) return false;
    localStorage.setItem(SEEN_KEY, String(Date.now()));
    const start = Number(localStorage.getItem(TRIAL_KEY));
    // devices that were here before this event: not new (else every old device would count once now)
    return !start || Date.now() - start < FRESH_MS;
  } catch {
    return false;
  }
}

let last = '';
let device: boolean | null = null;
function count() {
  const path = currentPath();
  if (path === last || path === '/admin' || path.startsWith('/admin/')) return;
  const gc = window.goatcounter;
  if (!gc?.count) return;
  last = path;
  gc.count({ path, title: document.title });
  device ??= newDevice();
  if (device) {
    device = false;
    gc.count({ path: 'new-device', title: 'Новое устройство', event: true });
  }
}

/* ───── product events (funnel) — one name each, count over a period = how many times ─────
 * signup · first_lesson · lesson_complete · return_next_day · streak_7 · notification_click · share.
 * No personal data: only the name. `once` — at most once per device (or per `key`, e.g. per lesson). */
const EVENT_TITLES: Record<string, string> = {
  signup: 'Регистрация',
  first_lesson: 'Первая учёба',
  lesson_complete: 'Урок закончен',
  return_next_day: 'Вернулся на следующий день',
  streak_7: 'Серия 7 дней',
  notification_click: 'Нажатие на уведомление',
  share: 'Поделились',
};
const EVENTS_KEY = 'niflaot:gc-events';
const queue: string[] = [];
let ready = false;

function sendEvent(name: string) {
  const gc = window.goatcounter;
  if (!gc?.count) return false;
  gc.count({ path: name, title: EVENT_TITLES[name] ?? name, event: true });
  return true;
}

export function track(name: keyof typeof EVENT_TITLES, opts: { once?: boolean; key?: string } = {}) {
  try {
    if (import.meta.env.DEV || isAdmin() || shabbatPreview()) return;
    if (opts.once || opts.key) {
      const done: string[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
      const id = opts.key ? `${name}:${opts.key}` : name;
      if (done.includes(id)) return;
      localStorage.setItem(EVENTS_KEY, JSON.stringify([...done, id].slice(-200)));
    }
  } catch {
    return;
  }
  if (ready && sendEvent(name)) return;
  queue.push(name);
}

function flush() {
  ready = true;
  for (const n of queue.splice(0)) sendEvent(n);
}

/** after React has rendered the page and set its title */
const later = () => setTimeout(count, 500);

export function installAnalytics() {
  try {
    if (import.meta.env.DEV || isAdmin() || shabbatPreview()) return;
  } catch {
    return;
  }
  window.goatcounter = { no_onload: true };
  const s = document.createElement('script');
  s.async = true;
  s.src = SCRIPT;
  s.dataset.goatcounter = ENDPOINT;
  s.addEventListener('load', () => {
    later();
    flush();
  });
  // the reminder's link is marked `?ref=push` (public/sw.js): one click per visit
  try {
    if (new URLSearchParams(location.search).get('ref') === 'push' && !sessionStorage.getItem('niflaot:gc-push')) {
      sessionStorage.setItem('niflaot:gc-push', '1');
      track('notification_click');
    }
  } catch {}
  document.head.appendChild(s);
  addEventListener('hashchange', later);
}
