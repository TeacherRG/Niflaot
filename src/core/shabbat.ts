import { placeOf, type Place } from './places';
import { shabbatTimes } from './zmanim';

/**
 * The site rests on Shabbat: from candle lighting on Friday to the end of Shabbat on Saturday, for the place of the
 * device's time zone (src/core/places.ts, no geolocation prompt). A zone not in the list, or no sunset there (far
 * north) → fixed hours: Friday 21:00 – Saturday 21:00 by the device clock.
 */
export const FIXED_FROM = 21; // Friday, hour
export const FIXED_TO = 21; // Saturday, hour

export interface ShabbatWindow {
  from: Date;
  to: Date;
  /** the city the times are for; null — fixed hours */
  place: Place | null;
}

/** The Shabbat of the week of `d`: from Friday to Saturday (Sunday–Thursday: the coming one). */
export function shabbatWindow(d = new Date(), place: Place | null = placeOf()): ShabbatWindow {
  const friday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + ((5 - d.getDay() + 7) % 7) - (d.getDay() === 6 ? 7 : 0));
  const times = place ? shabbatTimes(friday, place.lat, place.lon, place.candles) : null;
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

/** `?shabbat=preview` shows the Shabbat screen at any time (to check it). */
export const shabbatPreview = () => {
  try {
    return new URLSearchParams(location.search).get('shabbat') === 'preview';
  } catch {
    return false;
  }
};
