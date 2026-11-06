/**
 * Jewish calendar from the open-source @hebcal/core (MIT), computed in the browser and in scripts —
 * no requests, no dependence on the browser's Intl Hebrew calendar. Date, weekly portion (Torah reading) and
 * astronomical sun times for a place.
 */
import { HDate, Location, Sedra, Zmanim } from '@hebcal/core';

const atNoon = (iso: string) => new Date(`${iso}T12:00:00`);

/** Jewish date of a calendar day (`YYYY-MM-DD`) in Hebrew letters with niqqud, e.g. «ט״ז חֶשְׁוָן ה׳תשפ״ז». */
export const hebrewDateText = (iso: string) =>
  new HDate(atNoon(iso)).renderGematriya().replace(/ ([^ ]+)$/, ' ה׳$1');

/** Jewish date as numbers: year, month name (hebcal, English) and day. */
export function hebrewDateParts(iso: string): { year: number; month: string; day: number } {
  const h = new HDate(atNoon(iso));
  return { year: h.getFullYear(), month: h.getMonthName(), day: h.getDate() };
}

/**
 * Weekly portion read on the Shabbat on or after `iso` (hebcal English names, e.g. «Vayera», «Vayakhel-Pekudei»
 * as two entries); null when that Shabbat is a festival with its own reading. `il` — Israel schedule.
 */
export function parshaOfShabbat(iso: string, il = false): string[] | null {
  const day = new HDate(atNoon(iso));
  const sat = day.onOrAfter(6);
  const r = new Sedra(sat.getFullYear(), il).lookup(sat);
  return r.chag ? null : r.parsha;
}

/** Sunrise and sunset (the sun's centre at the horizon, with refraction) on a calendar day for a place; null where the sun does not rise or set. */
export function sunTimes(iso: string, lat: number, lon: number, tzid: string): { sunrise: Date | null; sunset: Date | null } {
  const z = new Zmanim(new Location(lat, lon, false, tzid), atNoon(iso), false);
  const ok = (d: Date) => (Number.isNaN(d.getTime()) ? null : d);
  return { sunrise: ok(z.sunrise()), sunset: ok(z.sunset()) };
}
