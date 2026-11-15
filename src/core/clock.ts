/**
 * «Часы» (`#/clock`, ClockPage.tsx): the times of the day for the reader's city and the alarm that keeps quiet on Shabbat
 * and the festivals. Pure rules — no storage, no DOM (scripts/check-clock.ts runs them); the ringing — src/core/alarm.ts.
 *
 * Times: the end of the time of Shma and of the morning prayer — by the Alter Rebbe (src/core/hebcal.ts `dayTimes`),
 * Mincha — until sunset. A «latest» time is rounded down to the minute: never later than the real one.
 *
 * The alarm rests on a day of rest — Shabbat, Yom Tov, Yom Kippur — from candle lighting (18 min before the sunset of
 * the eve) to its end (50 min after its sunset), as in the «Календарь»; where the sun does not set — from 14:00 of the
 * eve to 23:00 of the day (as the site's own Shabbat rest). Chol HaMoed — by the reader's choice.
 */
import { dayTimes, festivalKind } from './hebcal';

const DAY = 86_400_000;
const MIN = 60_000;
export const CANDLE_MIN = 18;
export const END_MIN = 50;

export interface Spot {
  lat: number;
  lon: number;
  /** the time zone the times are for */
  zone: string;
  /** the calendar of the Land of Israel: one day of Yom Tov */
  il: boolean;
}

const IL_ZONES = new Set(['Asia/Jerusalem', 'Asia/Tel_Aviv', 'Asia/Hebron', 'Asia/Gaza', 'Israel']);
export const inIsrael = (zone: string) => IL_ZONES.has(zone);

/** the calendar day (`YYYY-MM-DD`) of a moment in a time zone */
export function isoIn(at: Date, zone: string): string {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(at);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * DAY).toISOString().slice(0, 10);
const weekdayOf = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();
const floorMin = (d: Date | null) => (d ? new Date(Math.floor(d.getTime() / MIN) * MIN) : null);

/** the moment of a wall-clock time `h:m` on the calendar day `iso` in a time zone */
export function wallTime(iso: string, h: number, m: number, zone: string): Date {
  const guess = Date.parse(`${iso}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`);
  const shown = (t: number) => {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(t));
    const g = (k: string) => Number(p.find((x) => x.type === k)?.value);
    return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'));
  };
  // twice: the offset at the guess may differ from the offset at the answer (the night the clocks change)
  let t = guess - (shown(guess) - guess);
  t = guess - (shown(t) - t);
  return new Date(t);
}

/** The times of the day the clock can show, in the order of the day; `mincha` — the end of its time, sunset. */
export type TimeId = 'sunrise' | 'shma' | 'tefila' | 'chatzot' | 'minchaGedola' | 'plag' | 'mincha' | 'tzeit';
export const TIME_IDS: TimeId[] = ['sunrise', 'shma', 'tefila', 'chatzot', 'minchaGedola', 'plag', 'mincha', 'tzeit'];
/** «no later than»: rounded down to the minute; the rest — «from»: rounded up */
export const DEADLINES: TimeId[] = ['shma', 'tefila', 'mincha'];
/** what the face shows until the reader chooses */
export const DEFAULT_MARKS: TimeId[] = ['shma', 'tefila', 'mincha'];
/** `sunset` — the exact moment (the Jewish day turns there) */
export type Times = Record<TimeId, Date | null> & { sunset: Date | null };

const ceilMin = (d: Date | null) => (d ? new Date(Math.ceil(d.getTime() / MIN) * MIN) : null);

/** The times of a calendar day: a «latest» time is rounded down to the minute, an «earliest» one — up. */
export function timesOf(iso: string, s: Spot): Times {
  const d = dayTimes(iso, s.lat, s.lon, s.zone);
  return {
    sunrise: floorMin(d.sunrise), // as the «Календарь» shows it
    shma: floorMin(d.shma),
    tefila: floorMin(d.tefila),
    chatzot: ceilMin(d.chatzot),
    minchaGedola: ceilMin(d.minchaGedola),
    plag: ceilMin(d.plag),
    mincha: floorMin(d.sunset),
    tzeit: ceilMin(d.tzeit),
    sunset: d.sunset,
  };
}

/** The reader's choice of marks made safe: known ids, each once, in the order of the day. */
export const cleanMarks = (v: unknown): TimeId[] => (Array.isArray(v) ? TIME_IDS.filter((id) => v.includes(id)) : DEFAULT_MARKS);

/** The day whose times the clock shows: today until sunset, after it — tomorrow's. */
export function shownDay(now: Date, s: Spot): { iso: string; tomorrow: boolean; times: Times } {
  const today = isoIn(now, s.zone);
  const t = timesOf(today, s);
  if (t.sunset && now >= t.sunset) {
    const next = addDays(today, 1);
    return { iso: next, tomorrow: true, times: timesOf(next, s) };
  }
  return { iso: today, tomorrow: false, times: t };
}

export type Rest = 'shabbat' | 'chag' | 'cholHamoed';

/** What kind of day the calendar day is (its daytime): Shabbat, Yom Tov / Yom Kippur, Chol HaMoed — or an ordinary one. */
export function dayKind(iso: string, il: boolean): Rest | null {
  const f = festivalKind(iso, il);
  if (f === 'chag') return 'chag';
  if (weekdayOf(iso) === 6) return 'shabbat';
  return f;
}

/** From when to when the Jewish day of the calendar day `iso` keeps the alarm quiet (with the margins of the calendar). */
function restSpan(iso: string, s: Spot): [number, number] {
  const eve = dayTimes(addDays(iso, -1), s.lat, s.lon, s.zone).sunset;
  const end = dayTimes(iso, s.lat, s.lon, s.zone).sunset;
  return [
    eve ? eve.getTime() - CANDLE_MIN * MIN : wallTime(addDays(iso, -1), 14, 0, s.zone).getTime(),
    end ? end.getTime() + END_MIN * MIN : wallTime(iso, 23, 0, s.zone).getTime(),
  ];
}

/**
 * Why the alarm keeps quiet at this moment — or null (it rings). Shabbat and Yom Tov — always; `chm` — also on Chol HaMoed.
 * A day of rest right after another (Yom Tov after Shabbat) has no gap: each span starts before the other ends.
 */
export function restAt(at: Date, s: Spot, chm = false): Rest | null {
  const today = isoIn(at, s.zone);
  let found: Rest | null = null;
  for (const n of [-1, 0, 1]) {
    const iso = addDays(today, n);
    const kind = dayKind(iso, s.il);
    if (!kind || (kind === 'cholHamoed' && !chm)) continue;
    const [from, to] = restSpan(iso, s);
    if (at.getTime() >= from && at.getTime() < to && (!found || kind !== 'cholHamoed')) found = kind;
  }
  return found;
}

export interface Alarm {
  on: boolean;
  /** `clock` — at h:m; `shma` — `before` minutes before the end of the time of Shma */
  mode: 'clock' | 'shma';
  h: number;
  m: number;
  before: number;
  /** the days of the week it rings on: 0 — Sunday … 6 — Saturday (a Saturday alarm rings only after Shabbat is out) */
  days: number[];
  /** keep quiet on Chol HaMoed too */
  chm: boolean;
}
export const BEFORE = [15, 30, 45, 60, 90, 120];
export const DEFAULT_ALARM: Alarm = { on: false, mode: 'clock', h: 6, m: 30, before: 60, days: [0, 1, 2, 3, 4, 5], chm: false };
/** the alarm of Torah study — «время учить Тору»: in the evening, always by the clock */
export const DEFAULT_STUDY: Alarm = { ...DEFAULT_ALARM, h: 20, m: 0 };
/** `wake` — the alarm clock; `study` — the alarm of Torah study, its ring leads to the passage of the day of the Prophets and Writings */
export type AlarmKind = 'wake' | 'study';
export const ALARM_KINDS: AlarmKind[] = ['wake', 'study'];

/** A stored alarm made safe: wrong or missing fields — the defaults. */
export function cleanAlarm(v: unknown, def: Alarm = DEFAULT_ALARM): Alarm {
  const a = (v && typeof v === 'object' ? v : {}) as Partial<Alarm>;
  const int = (x: unknown, lo: number, hi: number, d: number) => (typeof x === 'number' && Number.isInteger(x) && x >= lo && x <= hi ? x : d);
  const days = Array.isArray(a.days) ? [...new Set(a.days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort() : def.days;
  return {
    on: a.on === true,
    mode: a.mode === 'shma' ? 'shma' : 'clock',
    h: int(a.h, 0, 23, def.h),
    m: int(a.m, 0, 59, def.m),
    before: BEFORE.includes(a.before as number) ? (a.before as number) : def.before,
    days,
    chm: a.chm === true,
  };
}

/** When the alarm would ring on the calendar day `iso` (its weekday and the days of rest aside); null — no Shma time there. */
export function ringOn(a: Alarm, iso: string, s: Spot): Date | null {
  if (a.mode === 'clock') return wallTime(iso, a.h, a.m, s.zone);
  const shma = timesOf(iso, s).shma;
  return shma && new Date(shma.getTime() - a.before * MIN);
}

export interface Skip {
  at: Date;
  why: Rest;
}

/**
 * The first ring at `from` or later, and the rings before it that the days of rest cancel (`skipped`).
 * Null — no day chosen, or nothing within `span` days.
 */
export function nextRing(a: Alarm, from: Date, s: Spot, span = 21): { at: Date; skipped: Skip[] } | null {
  if (!a.days.length) return null;
  const skipped: Skip[] = [];
  const start = isoIn(from, s.zone);
  for (let n = 0; n <= span; n++) {
    const iso = addDays(start, n);
    if (!a.days.includes(weekdayOf(iso))) continue;
    const at = ringOn(a, iso, s);
    if (!at || at < from) continue;
    const why = restAt(at, s, a.chm);
    if (why) skipped.push({ at, why });
    else return { at, skipped };
  }
  return null;
}
