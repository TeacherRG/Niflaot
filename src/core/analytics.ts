/**
 * Visit statistics — GoatCounter (https://niflaot.goatcounter.com): no cookies, no personal data,
 * countries and page counts. The site uses hash routing, so every route is counted by hand
 * (`#/<slug>/memo` → `/<slug>/memo`). Not counted: dev server, `#/admin`, the admin's own browser,
 * `?shabbat=preview`. The CSP allowing these hosts is in scripts/prerender.ts.
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
  return `/${route.replace(/\/+$/, '')}`;
}

let last = '';
function count() {
  const path = currentPath();
  if (path === last || path === '/admin' || path.startsWith('/admin/')) return;
  const gc = window.goatcounter;
  if (!gc?.count) return;
  last = path;
  gc.count({ path, title: document.title });
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
  s.addEventListener('load', later);
  document.head.appendChild(s);
  addEventListener('hashchange', later);
}
