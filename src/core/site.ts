/** Public address of the site (also in public/CNAME). */
export const SITE_HOST = 'niflaot.mychitas.app';
export const SITE_URL = `https://${SITE_HOST}`;

/**
 * Where a shared link was sent from — `?ref=` in the address; GoatCounter shows it among the referrers
 * (https://niflaot.goatcounter.com), so we see which channel brings people.
 */
export type Ref = 'wa' | 'tg' | 'copy' | 'card' | 'qr' | 'rss' | 'channel';

/** Link to a lesson: its static page `/<slug>/` (own preview picture for messengers), marked with the channel. */
export const lessonLink = (slug: string, ref: Ref, lang?: string) =>
  `${SITE_URL}/${slug}/?${lang ? `lang=${lang}&` : ''}ref=${ref}`;

/** Link to a hash route of the app (`facts/<id>`), marked with the channel. */
export const routeLink = (route: string, ref: Ref, lang?: string) =>
  `${SITE_URL}/?${lang ? `lang=${lang}&` : ''}ref=${ref}#/${route}`;
