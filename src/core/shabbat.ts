import { placeOf, type Place } from './places';
import { shabbatTimes } from './zmanim';

/**
 * The site rests on Shabbat: from an hour before sunset on Friday to an hour after sunset on Saturday, for the place
 * of the device's time zone (src/core/places.ts, no geolocation prompt; src/core/zmanim.ts). A zone not in the list,
 * or no sunset there (far north) → fixed hours with a wide margin: Friday 14:00 – Saturday 23:00 by the device clock.
 */
export const FIXED_FROM = 14; // Friday, hour
export const FIXED_TO = 23; // Saturday, hour

export interface ShabbatWindow {
  from: Date;
  to: Date;
  /** the city the times are for; null — fixed hours */
  place: Place | null;
}

/** The Shabbat of the week of `d`: from Friday to Saturday (Sunday–Thursday: the coming one). */
export function shabbatWindow(d = new Date(), place: Place | null = placeOf()): ShabbatWindow {
  const friday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + ((5 - d.getDay() + 7) % 7) - (d.getDay() === 6 ? 7 : 0));
  const times = place ? shabbatTimes(friday, place.lat, place.lon) : null;
  if (times) return { ...times, place };
  const from = new Date(friday);
  from.setHours(FIXED_FROM, 0, 0, 0);
  const to = new Date(friday.getFullYear(), friday.getMonth(), friday.getDate() + 1, FIXED_TO);
  return { from, to, place: null };
}

export function isShabbatRest(d = new Date(), place: Place | null = placeOf()): boolean {
  const w = shabbatWindow(d, place);
  return d >= w.from && d < w.to;
}

/**
 * Search engines' crawlers (not people, not «read aloud»): the server gives them the pages on Shabbat anyway — the rest is
 * drawn by the page — so they get the page, not the Shabbat screen, else «Шабат шалом» would be indexed instead of a lesson
 * (Googlebot renders the page; Friday 14:00 – Saturday 23:00 is a fifth of the week).
 */
export const isSearchBot = () =>
  typeof navigator !== 'undefined' &&
  /Googlebot|Google-InspectionTool|Storebot-Google|bingbot|BingPreview|YandexBot|YandexRenderResolver|DuckDuckBot|Baiduspider|Applebot|OAI-SearchBot|PerplexityBot|Claude-SearchBot|Slurp/i.test(
    navigator.userAgent,
  );

/** `?shabbat=preview` shows the Shabbat screen at any time (to check it). */
export const shabbatPreview = () => {
  try {
    return new URLSearchParams(location.search).get('shabbat') === 'preview';
  } catch {
    return false;
  }
};
