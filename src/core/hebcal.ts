/**
 * Jewish calendar from the open-source @hebcal/core (MIT), computed in the browser and in scripts —
 * no requests, no dependence on the browser's Intl Hebrew calendar. Date, weekly portion (Torah reading) and
 * astronomical sun times for a place.
 */
import { flags, HDate, HebrewCalendar, Location, Sedra, Zmanim } from '@hebcal/core';

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

/**
 * The times of the day for «Часы» (src/core/clock.ts) — by the opinion of the Alter Rebbe (Baal HaTanya), as in the Chabad
 * calendars: the day runs from the «true» sunrise to the «true» sunset (the sun 1.583° below the horizon), an hour of the
 * day is a twelfth of it; the end of the time of Shma — 3 such hours, of the morning prayer — 4. Mincha — until sunset.
 * Also for the face of the clock: sunrise, midday (chatzot), Mincha Gedola, Plag HaMincha and nightfall (the sun 6° below).
 * Null where the sun does not rise or set.
 */
export function dayTimes(iso: string, lat: number, lon: number, tzid: string) {
  const z = new Zmanim(new Location(lat, lon, false, tzid), atNoon(iso), false);
  const ok = (d: Date) => (Number.isNaN(d.getTime()) ? null : d);
  return {
    alot: ok(z.alotHaShachar()),
    sunrise: ok(z.sunrise()),
    shma: ok(z.sofZmanShmaBaalHatanya()),
    tefila: ok(z.sofZmanTfilaBaalHatanya()),
    chatzot: ok(z.chatzot()),
    minchaGedola: ok(z.minchaGedolaBaalHatanya()),
    plag: ok(z.plagHaminchaBaalHatanya()),
    sunset: ok(z.sunset()),
    tzeit: ok(z.tzaisBaalHatanya()),
  };
}

/**
 * A day when no work is done — Yom Tov and Yom Kippur («chag») — or Chol HaMoed, by the Jewish date of the calendar day
 * `iso` (its daytime). `il` — the calendar of the Land of Israel (one day of Yom Tov), else of the diaspora (two).
 */
export function festivalKind(iso: string, il = false): 'chag' | 'cholHamoed' | null {
  const events = HebrewCalendar.getHolidaysOnDate(new HDate(atNoon(iso)), il) ?? [];
  if (events.some((e) => e.getFlags() & flags.CHAG)) return 'chag';
  if (events.some((e) => e.getFlags() & flags.CHOL_HAMOED)) return 'cholHamoed';
  return null;
}
