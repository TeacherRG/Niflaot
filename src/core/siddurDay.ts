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
  | 'havdalah' // Maariv at the end of Shabbat or Yom Tov — «Ata chonantanu»
  // outside the Amidah (owner, 25.11.2026: «распространить»)
  | 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' // the Song of the Day: Sunday … Friday
  | 'elul' // «לדוד ה׳ אורי» — from Rosh Chodesh Elul to Hoshana Rabba
  | 'tachanun' // a day Tachanun is said (Chabad custom; see `noTachanun`)
  | 'monthu' // Monday and Thursday additions to Tachanun
  | 'avinu' | 'taanit' // Avinu Malkenu: a public fast or the Ten Days; «זכרנו» / «ברך» — a fast outside the Ten Days
  | 'erechapayim' // «אל ארך אפים» before the Torah reading
  | 'tishabav' // the day of Tisha b'Av (any prayer)
  | 'motzash' | 'vihinoam'; // Maariv after Shabbat; «ויהי נועם» — not in a week with Yom Tov

const atNoon = (iso: string) => new Date(`${iso}T12:00:00`);
const addDays = (iso: string, n: number) => {
  const d = atNoon(iso);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const isLeapGregorian = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** days without Tachanun (Chabad custom, «Сефер ґа-минґагим»; not checked by a rabbi) — besides Shabbat and Yom Tov */
function noTachanun(hd: HDate, rc: boolean): boolean {
  const m = hd.getMonth();
  const day = hd.getDate();
  const leap = HDate.isLeapYear(hd.getFullYear());
  if (rc || m === months.NISAN) return true;
  if (m === months.TISHREI && day >= 9) return true; // Erev Yom Kippur to the end of Tishrei
  if (m === months.ELUL && day === 29) return true; // Erev Rosh Hashana
  if (m === months.SIVAN && day <= 12) return true;
  return festive(hd, leap);
}
/** a day without Tachanun whose eve (Mincha the day before) is also without it */
function festive(hd: HDate, leap = HDate.isLeapYear(hd.getFullYear())): boolean {
  const m = hd.getMonth();
  const day = hd.getDate();
  const kislev25 = new HDate(25, months.KISLEV, hd.getFullYear()).abs();
  if (hd.abs() - kislev25 >= 0 && hd.abs() - kislev25 <= 7) return true; // Chanukah
  if ((m === months.ADAR_I || (leap && m === months.ADAR_II)) && (day === 14 || day === 15)) return true; // Purim, Purim Katan
  return (
    (m === months.IYYAR && (day === 14 || day === 18)) || // Pesach Sheni, Lag BaOmer
    (m === months.AV && (day === 9 || day === 15)) ||
    (m === months.SHVAT && day === 15) ||
    (m === months.KISLEV && day === 19) ||
    (m === months.TAMUZ && (day === 12 || day === 13))
  );
}

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
    if (eve.getDay() === 6) {
      out.add('motzash');
      const chag = [0, 1, 2, 3, 4, 5].some((k) =>
        (HebrewCalendar.getHolidaysOnDate(new HDate(atNoon(addDays(iso, k))), il) ?? []).some((e) => e.getFlags() & flags.CHAG),
      );
      if (!chag) out.add('vihinoam');
    }
  }

  const dow = hd.getDay(); // 0 — Sunday
  if (dow <= 5) out.add(`day${dow + 1}` as SiddurCond);
  const elul = (hd.getMonth() === months.ELUL) || (hd.getMonth() === months.TISHREI && hd.getDate() <= 21);
  if (elul) out.add('elul');

  const av9 = desc.some((x) => x.startsWith("Tish'a B'Av"));
  if (av9) out.add('tishabav');
  const tomorrow = new HDate(atNoon(addDays(iso, 1)));
  const restDay = dow === 6 || has(flags.CHAG);
  const tachanun =
    !restDay && !noTachanun(hd, out.has('rc')) && !av9 && !(prayer === 'mincha' && (dow === 5 || festive(tomorrow)));
  if (tachanun && prayer !== 'maariv') out.add('tachanun');
  if (tachanun && prayer === 'shacharit' && (dow === 1 || dow === 4)) out.add('monthu');

  const publicFast = fast && !av9;
  const tenDays = out.has('aseret') && hd.getDate() >= 3 && hd.getDate() <= 8;
  if (out.has('tachanun') && (publicFast || tenDays)) out.add('avinu'); // not on a day without Tachanun (Mincha of Taanit Esther)
  if (publicFast && !out.has('aseret')) out.add('taanit');
  const purimDay = (hd.getMonth() === months.ADAR_I || hd.getMonth() === (HDate.isLeapYear(y) ? months.ADAR_II : months.ADAR_I)) &&
    (hd.getDate() === 14 || hd.getDate() === 15);
  const erevPesach = hd.getMonth() === months.NISAN && hd.getDate() === 14;
  if (!(out.has('rc') || out.has('chanukah') || purimDay || erevPesach || av9)) out.add('erechapayim');
  return out;
}

/** today's conditions for the reader */
export function todaysConds(prayer: Prayer, now = new Date()): Set<SiddurCond> {
  const { zone } = currentPlace();
  return siddurConds(prayer, prayerDay(prayer, now, zone), inIsrael(zone));
}
