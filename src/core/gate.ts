/**
 * «Только по входу» (decided by the owner, 02.11.2026): the site opens after signing in by email (a 6-digit code,
 * src/core/account.ts); without it — only «Святое чтение», the Tehillim (`#/reading`, but not «Шнаим микра»).
 * Also open: what signing in itself needs — the account page, a parent's consent link, the privacy policy — and the
 * admin page (it has its own GitHub sign-in). Machines (`isReader`: «listen to this page», search engines, the PDF of
 * the Telegram posts) get the page itself; when the server can't send emails (`mail: false` — no server, offline),
 * nobody could sign in, so the site stays open.
 */
// `#/english` — the English course for Hebrew speakers: its whole page is in Hebrew, and the sign-in is not (yet)
const OPEN = new Set(['account', 'consent', 'privacy', 'admin', 'english']);

export const isOpenRoute = (slug: string, view?: string) => OPEN.has(slug) || (slug === 'reading' && view !== 'shnayim');

/**
 * «Месяц без входа» (owner, 02.11.2026; first 3 days, then a month): the first visit starts a trial on this device — for 30 days
 * everything is open, then sign in. Counted per browser (`niflaot:trial` — the start, ms; not synced), not per IP:
 * a class, a family or a mobile network share one IP, and an IP is personal data the site doesn't keep.
 * Clearing the browser starts a new trial — the gate is gentle on purpose. No storage at all — no trial.
 */
export const TRIAL_DAYS = 30;
const TRIAL_KEY = 'niflaot:trial';

/** When the trial of this device ends (ms); starts it on the first call. null — no storage. */
export function trialEnd(now = Date.now()): number | null {
  try {
    let start = Number(localStorage.getItem(TRIAL_KEY));
    if (!start || start > now) localStorage.setItem(TRIAL_KEY, String((start = now)));
    return start + TRIAL_DAYS * 864e5;
  } catch {
    return null;
  }
}

export const inTrial = (now = Date.now()) => (trialEnd(now) ?? 0) > now;
