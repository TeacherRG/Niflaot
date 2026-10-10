/** Public address of the site (also in public/CNAME). */
export const SITE_HOST = 'niflaot.mychitas.app';
export const SITE_URL = `https://${SITE_HOST}`;

/**
 * Where a shared link was sent from — `?ref=` in the address; GoatCounter shows it among the referrers
 * (https://niflaot.goatcounter.com), so we see which channel brings people.
 */
export type Ref = 'wa' | 'tg' | 'copy' | 'card' | 'qr' | 'rss' | 'channel' | 'daily';

/** Link to a lesson: its static page `/<slug>/` (own preview picture for messengers), marked with the channel. */
export const lessonLink = (slug: string, ref: Ref, lang?: string) =>
  `${SITE_URL}/${slug}/?${lang ? `lang=${lang}&` : ''}ref=${ref}`;

/** Link to a hash route of the app (`facts/<id>`), marked with the channel. */
export const routeLink = (route: string, ref: Ref, lang?: string) =>
  `${SITE_URL}/?${lang ? `lang=${lang}&` : ''}ref=${ref}#/${route}`;

/** Static pages for search engines (scripts/prerender.ts): Russian at the root, other languages under /<lang>/. */
export type StaticPage = 'mental-math' | 'daily';
export const STATIC_PAGES: Record<StaticPage, string> = { 'mental-math': 'math/add', daily: 'daily' };
export const staticPath = (page: StaticPage, lang: string) => `/${lang === 'ru' ? '' : `${lang}/`}${page}/`;
export const pageLink = (page: StaticPage, lang: string, ref?: Ref) => `${SITE_URL}${staticPath(page, lang)}${ref ? `?ref=${ref}` : ''}`;
