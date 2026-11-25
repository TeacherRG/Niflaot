/**
 * Which insertions of the Amidah are said today (owner, 25.11.2026: «вставлять самим — у нас же есть календарь: зима, лето,
 * пост, Рош ходеш — и лишнее не показывать»). The siddur text marks them `⟦?усл⟧ … ⟦/⟧` (`scripts/build-siddur.py`); this
 * module answers each condition for a prayer on a day, by the Jewish calendar (@hebcal/core) and the reader's place
 * (Israel or the diaspora — by the time zone, `src/core/places.ts`).
 *
 * The day of a prayer: Shacharit and Mincha — today; Maariv — from noon on, the coming night, i.e. tomorrow's Jewish date
 * (before noon — a late Maariv of the night that already began).
 */
import { flags, HDate, HebrewCalendar, months } from '@hebcal/core';
import type { Prayer } from './siddur';
import { inIsrael, isoIn } from './clock';
import { currentPlace } from './places';

export type SiddurCond =
  | 'aseret' // Ten Days of Repentance: 1–10 Tishrei
  | 'tal' | 'geshem' // 2nd blessing: «מוריד הטל» in summer, «משיב הרוח ומוריד הגשם» from Shemini Atzeret to Pesach
  | 'bracha' | 'matar' // 9th blessing: «ותן ברכה» / «ותן טל ומטר לברכה»
  | 'fast' | 'av9' // a public fast (Aneinu at Mincha), Mincha of Tisha b'Av (Nachem)
  | 'rc' | 'pesach' | 'sukkot' | 'yaale' // Rosh Chodesh, Chol HaMoed — Yaale veYavo
  | 'chanukah' | 'purim' | 'hanisim' // Al HaNissim
  | 'havdalah'; // Maariv at the end of Shabbat or Yom Tov — «Ata chonantanu»

const atNoon = (iso: string) => new Date(`${iso}T12:00:00`);
const addDays = (iso: string, n: number) => {
  const d = atNoon(iso);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const isLeapGregorian = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** the calendar day whose Jewish date the prayer belongs to */
export function prayerDay(prayer: Prayer, now = new Date(), zone = currentPlace().zone): string {
  const today = isoIn(now, zone);
  if (prayer !== 'maariv') return today;
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', hourCycle: 'h23' }).format(now));
  return hour >= 12 ? addDays(today, 1) : today;
}

/**
 * The conditions true for `prayer` said on the day `iso` (see `prayerDay`); `il` — the Land of Israel. Chol HaMoed and
 * fasts by the calendar of the place; the start of «ותן טל ומטר» in the diaspora — the night of 4 December (5 December
 * when the next civil year is a leap year), in Israel — 7 Cheshvan.
 */
export function siddurConds(prayer: Prayer, iso: string, il = false): Set<SiddurCond> {
  const hd = new HDate(atNoon(iso));
  const y = hd.getFullYear();
  const at = (day: number, month: number) => new HDate(day, month, y).abs();
  const d = hd.abs();
  const out = new Set<SiddurCond>();

  if (hd.getMonth() === months.TISHREI && hd.getDate() <= 10) out.add('aseret');

  // «משיב הרוח» from Musaf of Shemini Atzeret (so Shacharit of 22 Tishrei — still «מוריד הטל») to Musaf of the 1st day of Pesach
  const shemini = at(22, months.TISHREI);
  const pesach = at(15, months.NISAN);
  const winter = (d > shemini || (d === shemini && prayer !== 'shacharit')) && (d < pesach || (d === pesach && prayer === 'shacharit'));
  out.add(winter ? 'geshem' : 'tal');

  // «ותן טל ומטר» until Pesach
  const rosh = new HDate(1, months.TISHREI, y).greg();
  const startIso = il
    ? null
    : `${rosh.getFullYear()}-12-${isLeapGregorian(rosh.getFullYear() + 1) ? '06' : '05'}`; // daytime after the night of 4/5 Dec
  const rain = d < pesach && (il ? d >= at(7, months.CHESHVAN) : iso >= (startIso as string));
  out.add(rain ? 'matar' : 'bracha');

  const events = HebrewCalendar.getHolidaysOnDate(hd, il) ?? [];
  const has = (f: number) => events.some((e) => e.getFlags() & f);
  const desc = events.map((e) => e.getDesc());
  if (has(flags.ROSH_CHODESH)) out.add('rc');
  if (has(flags.CHOL_HAMOED)) out.add(hd.getMonth() === months.NISAN ? 'pesach' : 'sukkot');
  if (out.has('rc') || out.has('pesach') || out.has('sukkot')) out.add('yaale');

  const fast = (has(flags.MINOR_FAST) || has(flags.MAJOR_FAST)) && !desc.some((x) => /Bechorot|Yom Kippur/.test(x));
  if (fast && prayer === 'mincha') out.add('fast');
  if (desc.some((x) => x.startsWith("Tish'a B'Av")) && prayer === 'mincha') out.add('av9');

  const chanukahDay = d - at(25, months.KISLEV);
  if (chanukahDay >= 0 && chanukahDay <= 7) out.add('chanukah');
  if (hd.getMonth() === (HDate.isLeapYear(y) ? months.ADAR_II : months.ADAR_I) && hd.getDate() === 14) out.add('purim');
  if (out.has('chanukah') || out.has('purim')) out.add('hanisim');

  if (prayer === 'maariv') {
    const eve = new HDate(atNoon(addDays(iso, -1)));
    const evEvents = HebrewCalendar.getHolidaysOnDate(eve, il) ?? [];
    if (eve.getDay() === 6 || evEvents.some((e) => e.getFlags() & flags.CHAG)) out.add('havdalah');
  }
  return out;
}

/** today's conditions for the reader */
export function todaysConds(prayer: Prayer, now = new Date()): Set<SiddurCond> {
  const { zone } = currentPlace();
  return siddurConds(prayer, prayerDay(prayer, now, zone), inIsrael(zone));
}
