/**
 * «Только по входу» (decided by the owner, 02.11.2026): the site opens after signing in by email (a 6-digit code,
 * src/core/account.ts); without it — only «Святое чтение», the Tehillim (`#/reading`, but not «Шнаим микра»).
 * Also open: what signing in itself needs — the account page, a parent's consent link, the privacy policy — and the
 * admin page (it has its own GitHub sign-in). Machines (`isReader`: «listen to this page», search engines, the PDF of
 * the Telegram posts) get the page itself; when the server can't send emails (`mail: false` — no server, offline),
 * nobody could sign in, so the site stays open.
 */
const OPEN = new Set(['account', 'consent', 'privacy', 'admin']);

export const isOpenRoute = (slug: string, view?: string) => OPEN.has(slug) || (slug === 'reading' && view !== 'shnayim');
