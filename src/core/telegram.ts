/**
 * Telegram Mini App: the same site, opened inside Telegram by the button under a channel post
 * (`https://t.me/<bot>/<app>?startapp=<param>` — a channel cannot have a `web_app` button, only such a link).
 * The app is registered in @BotFather (`/newapp`, address `https://niflaot.mychitas.app/?ref=tgapp`); the scripts
 * that post to the channels add the button when the variable `TELEGRAM_APP` (`<bot>/<app>`) is set.
 *
 * Telegram opens the address with its own data in the hash (`#tgWebAppData=…&tgWebAppPlatform=…`) and the start
 * parameter in the query (`?tgWebAppStartParam=…`). The site routes by the hash, so before anything reads the
 * address `initTelegram` turns it back into ours: `?lang=<lang>&ref=tgapp#/<route>`. The rest is the site as it is —
 * Shabbat, languages, progress (localStorage of Telegram's browser). No Telegram script: two events by hand.
 */

/** Route `neviim/2026-10-19` in language `ru` → `ru_neviim_2026-10-19` (Telegram allows only A–Z a–z 0–9 _ -, ≤ 64). */
export const startParam = (route: string, lang: string) => `${lang}_${route.replace(/\//g, '_')}`;

/** …and back; anything else (an old or a broken parameter) → null. */
export function fromStartParam(p: string | null | undefined): { lang: string; route: string } | null {
  const m = p?.match(/^([a-z]{2})_([A-Za-z0-9_-]*)$/);
  return m ? { lang: m[1], route: m[2].replace(/_/g, '/') } : null;
}

/** The button's link: `app` — `<bot>/<app>` from @BotFather. */
export const miniAppLink = (app: string, route: string, lang: string) => {
  const p = startParam(route, lang);
  if (p.length > 64 || !/^[A-Za-z0-9_-]+$/.test(p)) throw new Error(`startapp «${p}»: only A-Za-z0-9_-, at most 64`);
  return `https://t.me/${app.replace(/^@|^https:\/\/t\.me\//, '')}?startapp=${p}`;
};

const KEY = 'niflaot:tg';

/** The site is open inside Telegram (remembered for the tab: after the first route change the hash is ours). */
export function inTelegram(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** an event to the Telegram app: the phone's webview, the desktop app or the web version (an iframe) */
function postEvent(type: string, data: object = {}) {
  const w = window as { TelegramWebviewProxy?: { postEvent: (t: string, d: string) => void } };
  try {
    if (w.TelegramWebviewProxy) w.TelegramWebviewProxy.postEvent(type, JSON.stringify(data));
    else if (window.parent !== window) window.parent.postMessage(JSON.stringify({ eventType: type, eventData: data }), 'https://web.telegram.org');
  } catch {}
}

/** Before the first render: Telegram's address → ours; tell Telegram the page is ready, open it full height. */
export function initTelegram() {
  let url: URL;
  try {
    url = new URL(location.href);
  } catch {
    return;
  }
  const hash = new URLSearchParams(url.hash.slice(1));
  const fromTelegram = hash.has('tgWebAppData') || hash.has('tgWebAppPlatform') || url.searchParams.has('tgWebAppStartParam');
  if (!fromTelegram) {
    if (inTelegram()) postEvent('web_app_ready');
    return;
  }
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {}
  // the start parameter: in the query, in the hash or inside the init data
  let raw = url.searchParams.get('tgWebAppStartParam') ?? hash.get('tgWebAppStartParam');
  if (!raw) {
    try {
      raw = new URLSearchParams(hash.get('tgWebAppData') ?? '').get('start_param');
    } catch {}
  }
  const start = fromStartParam(raw);
  url.searchParams.delete('tgWebAppStartParam');
  if (start) url.searchParams.set('lang', start.lang);
  // GoatCounter: visits from the Mini App, even if the address in @BotFather has no ?ref=
  if (!url.searchParams.has('ref')) url.searchParams.set('ref', 'tgapp');
  url.hash = `#/${start?.route ?? ''}`;
  history.replaceState(history.state, '', url);
  postEvent('web_app_ready');
  postEvent('web_app_expand');
}
