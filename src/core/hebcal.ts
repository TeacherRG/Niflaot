/**
 * Jewish calendar from the open-source @hebcal/core (MIT), computed in the browser and in scripts —
 * no requests, no dependence on the browser's Intl Hebrew calendar. Date, weekly portion (Torah reading) and
 * astronomical sun times for a place.
 */
import { flags, HDate, HebrewCalendar, Location, months, Sedra, Zmanim } from '@hebcal/core';

const atNoon = (iso: string) => new Date(`${iso}T12:00:00`);

/** Jewish date of a calendar day (`YYYY-MM-DD`) in Hebrew letters with niqqud, e.g. «ט״ז חֶשְׁוָן ה׳תשפ״ז». */
export const hebrewDateText = (iso: string) =>
  new HDate(atNoon(iso)).renderGematriya().replace(/ ([^ ]+)$/, ' ה׳$1');

/** Jewish date as numbers: year, month name (hebcal, English) and day. */
export function hebrewDateParts(iso: string): { year: number; month: string; day: number } {
  const h = new HDate(atNoon(iso));
  return { year: h.getFullYear(), month: h.getMonthName(), day: h.getDate() };
}

/** Months as hebcal names them (`getMonthName`) → the name to write after the day number, in the language of the page. */
const MONTH_NAMES: Record<'ru' | 'en' | 'de' | 'he', Record<string, string>> = {
  ru: { Nisan: 'нисана', Iyyar: 'ияра', Sivan: 'сивана', Tamuz: 'тамуза', Av: 'ава', Elul: 'элула', Tishrei: 'тишрея', Cheshvan: 'хешвана', Kislev: 'кислева', Tevet: 'тевета', "Sh'vat": 'швата', Adar: 'адара', 'Adar I': 'адара I', 'Adar II': 'адара II' },
  en: { Nisan: 'Nisan', Iyyar: 'Iyar', Sivan: 'Sivan', Tamuz: 'Tammuz', Av: 'Av', Elul: 'Elul', Tishrei: 'Tishrei', Cheshvan: 'Cheshvan', Kislev: 'Kislev', Tevet: 'Tevet', "Sh'vat": 'Shevat', Adar: 'Adar', 'Adar I': 'Adar I', 'Adar II': 'Adar II' },
  de: { Nisan: 'Nissan', Iyyar: 'Ijar', Sivan: 'Siwan', Tamuz: 'Tammus', Av: 'Aw', Elul: 'Elul', Tishrei: 'Tischri', Cheshvan: 'Cheschwan', Kislev: 'Kislew', Tevet: 'Tewet', "Sh'vat": 'Schwat', Adar: 'Adar', 'Adar I': 'Adar I', 'Adar II': 'Adar II' },
  he: { Nisan: 'בניסן', Iyyar: 'באייר', Sivan: 'בסיון', Tamuz: 'בתמוז', Av: 'באב', Elul: 'באלול', Tishrei: 'בתשרי', Cheshvan: 'בחשוון', Kislev: 'בכסלו', Tevet: 'בטבת', "Sh'vat": 'בשבט', Adar: 'באדר', 'Adar I': 'באדר א׳', 'Adar II': 'באדר ב׳' },
};

/**
 * The Jewish day and month with the day as an ordinary number (owner, 17.11.2026: «не все знают гематрию — день обычным числом»):
 * «6 кислева», «6 Kislev», «6. Kislew», «6 בכסלו»; and the year, «5787».
 */
export function hebrewDayMonth(iso: string, lang: string): { day: number; month: string; year: number } {
  const p = hebrewDateParts(iso);
  const names = MONTH_NAMES[(lang in MONTH_NAMES ? lang : 'en') as keyof typeof MONTH_NAMES];
  return { day: p.day, month: names[p.month] ?? p.month, year: p.year };
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
 * calendars and in the app «Пеле Шаон» (its `ZmanimService`, KosherJava 3.1; synced 24.11.2026): the day runs from the «true»
 * sunrise to the «true» sunset (the sun 1.583° below the horizon), an hour of the day is a twelfth of it; the end of the time
 * of Shma — 3 such hours, of the morning prayer — 4, Mincha Ketana — 9½, the burning of chametz — 5. Midday — halfway between
 * the true sunrise and sunset. Dawn — the sun 16.9° below; a summer night where it never gets that low — the lowest point of
 * the night (solar midnight). Misheyakir — 10.2°, nightfall — 6°, the end of Shabbat and Yom Tov — 8.5°.
 * Null where the sun does not rise, set or reach the angle — never a made-up time.
 */
export function dayTimes(iso: string, lat: number, lon: number, tzid: string) {
  const loc = new Location(lat, lon, false, tzid);
  const z = new Zmanim(loc, atNoon(iso), false);
  const ok = (d: Date) => (Number.isNaN(d.getTime()) ? null : d);
  const trueRise = ok(z.timeAtAngle(1.583, true));
  const trueSet = ok(z.timeAtAngle(1.583, false));
  const hour = trueRise && trueSet && trueSet > trueRise ? (trueSet.getTime() - trueRise.getTime()) / 12 : null;
  const at = (hours: number) => (trueRise && hour ? new Date(trueRise.getTime() + hours * hour) : null);
  const sunrise = ok(z.sunrise());
  let alot = ok(z.alosBaalHatanya());
  if (!alot && sunrise) {
    // a summer night that never gets 16.9° dark: dawn is the darkest moment of the night before — solar midnight
    const y = new Zmanim(loc, new Date(atNoon(iso).getTime() - 86_400_000), false);
    const noonY = ok(y.chatzot());
    const midnight = noonY && new Date(noonY.getTime() + 12 * 3_600_000);
    if (midnight && midnight < sunrise) alot = midnight;
  }
  return {
    alot,
    misheyakir: ok(z.timeAtAngle(10.2, true)),
    sunrise,
    shma: ok(z.sofZmanShmaBaalHatanya()),
    tefila: ok(z.sofZmanTfilaBaalHatanya()),
    biurChametz: at(5),
    chatzot: at(6),
    minchaGedola: ok(z.minchaGedolaBaalHatanya()),
    minchaKetana: ok(z.minchaKetanaBaalHatanya()),
    plag: ok(z.plagHaminchaBaalHatanya()),
    sunset: ok(z.sunset()),
    tzeit: ok(z.tzaisBaalHatanya()),
    shabbatEnd: ok(z.timeAtAngle(8.5, false)),
  };
}

/** Is the calendar day `iso` Erev Pesach (14 Nisan) — the day the time of burning chametz is shown. */
export function isErevPesach(iso: string): boolean {
  const d = new HDate(atNoon(iso));
  return d.getMonth() === months.NISAN && d.getDate() === 14;
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
