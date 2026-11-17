/**
 * The move from niflaot.mychitas.app to niflaot.app (17.11.2026).
 *
 * The browser keeps every site's progress apart, by address: on the new address a guest would start from nothing. So
 * the old address (redirect/src/index.ts, a Cloudflare worker) reads the progress there and sends the person here with
 * it in the fragment — `#nfmig=<base64url JSON {key: value}>&to=<the old #route>`. The fragment never reaches a server;
 * it is taken out of the address at once. Only what is not here yet is written: a second visit through an old link
 * (a QR code on paper) changes nothing that was learned on the new address.
 */

const PREFIX = '#nfmig=';

/** keys that may come: the site's and «Тайна Коэлета»'s (koelet/), never the login or the admin's token */
export const movable = (key: string) =>
  (key.startsWith('niflaot:') || key.startsWith('koelet-')) &&
  !['niflaot:account', 'niflaot:admin-token', 'niflaot:admin-draft'].includes(key);

function fromBase64Url(s: string) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Before anything reads localStorage (src/main.tsx). Returns the number of keys written. */
export function takeMovedProgress(): number {
  if (typeof location === 'undefined' || !location.hash.startsWith(PREFIX)) return 0;
  const params = new URLSearchParams(location.hash.slice(1));
  const to = params.get('to') || '';
  history.replaceState(null, '', location.pathname + location.search + (to.startsWith('#') ? to : ''));
  let n = 0;
  try {
    const data = JSON.parse(fromBase64Url(params.get('nfmig') || '')) as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (!movable(key) || typeof value !== 'string') continue;
      try {
        if (localStorage.getItem(key) !== null) continue;
        localStorage.setItem(key, value);
        n++;
      } catch {
        /* storage full or blocked — the rest still tries */
      }
    }
  } catch {
    /* a broken fragment: the page opens as usual */
  }
  return n;
}
