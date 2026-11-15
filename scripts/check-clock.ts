/**
 * «Часы» (src/core/clock.ts): the times of the day and the rules of the alarm — run by `npm run check`.
 */
import { addDays, cleanAlarm, cleanMarks, TIME_IDS, dayKind, DEFAULT_ALARM, DEFAULT_STUDY, inIsrael, nextRing, restAt, shownDay, timesOf, wallTime, type Alarm, type Spot } from '../src/core/clock';

let failed = 0;
const ok = (cond: unknown, what: string) => {
  if (!cond) {
    failed++;
    console.error(`✗ clock: ${what}`);
  }
};

const vienna: Spot = { lat: 48.21, lon: 16.37, zone: 'Europe/Vienna', il: false };
const jerusalem: Spot = { lat: 31.78, lon: 35.22, zone: 'Asia/Jerusalem', il: true };
const tromso: Spot = { lat: 69.65, lon: 18.96, zone: 'Europe/Oslo', il: false };
const hm = (d: Date | null, zone: string) => (d ? new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit' }).format(d) : '—');
const mins = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));

// the times: in order, whole minutes, and close to the equinox-day arithmetic (the day ≈ 12 h: Shma ≈ 9, the prayer ≈ 10 by the sun)
for (const [name, s] of [['Vienna', vienna], ['Jerusalem', jerusalem]] as const) {
  let iso = '2026-01-01';
  for (let n = 0; n < 366; n++, iso = addDays(iso, 1)) {
    const t = timesOf(iso, s);
    if (!t.sunrise || !t.shma || !t.tefila || !t.mincha || !t.sunset) {
      ok(false, `${name} ${iso}: a time is missing`);
      continue;
    }
    ok(TIME_IDS.every((id, i) => t[id] && (!i || t[TIME_IDS[i - 1]]! < t[id]!)), `${name} ${iso}: the times of the day are missing or not in order`);
    ok(TIME_IDS.every((id) => t[id]!.getTime() % 60_000 === 0), `${name} ${iso}: a time is not a whole minute`);
    ok([t.shma, t.tefila, t.mincha].every((d) => d.getTime() % 60_000 === 0), `${name} ${iso}: not whole minutes`);
    ok(t.mincha <= t.sunset && t.sunset.getTime() - t.mincha.getTime() < 60_000, `${name} ${iso}: Mincha ends after sunset`);
    // an hour of the day: the prayer − Shma; Shma = «true» sunrise + 3 of them, a few minutes before the ordinary sunrise + 3
    const hour = t.tefila.getTime() - t.shma.getTime();
    const gra = t.sunrise.getTime() + ((t.sunset.getTime() - t.sunrise.getTime()) / 12) * 3;
    ok(Math.abs(hour - (t.sunset.getTime() - t.sunrise.getTime()) / 12) < 3 * 60_000, `${name} ${iso}: the hour of the day is off`);
    ok(t.shma.getTime() <= gra + 60_000 && gra - t.shma.getTime() < 8 * 60_000, `${name} ${iso}: Shma is not just before sunrise + 3 hours (${hm(t.shma, s.zone)})`);
  }
}
// a known day: Vienna, 15.11.2026 — sunrise ≈ 7:02, sunset ≈ 16:17 (CET)
{
  const t = timesOf('2026-11-15', vienna);
  const near = (d: Date | null, want: string, by: number) => Math.abs(mins(hm(d, vienna.zone)) - mins(want)) <= by;
  ok(near(t.sunrise, '07:02', 3), `Vienna 15.11: sunrise ${hm(t.sunrise, vienna.zone)}`);
  ok(near(t.mincha, '16:17', 3), `Vienna 15.11: sunset ${hm(t.mincha, vienna.zone)}`);
  ok(near(t.shma, '09:19', 4), `Vienna 15.11: Shma ${hm(t.shma, vienna.zone)}`);
  ok(near(t.tefila, '10:05', 4), `Vienna 15.11: the prayer ${hm(t.tefila, vienna.zone)}`);
}
// the far north: no sunrise in December — no times, and nothing breaks
ok(timesOf('2026-12-21', tromso).shma === null, 'Tromsø, 21.12: a Shma time without a sunrise');

// the clock shows tomorrow's times after sunset
ok(!shownDay(wallTime('2026-11-15', 12, 0, vienna.zone), vienna).tomorrow, 'noon: not today');
ok(shownDay(wallTime('2026-11-15', 18, 0, vienna.zone), vienna).iso === '2026-11-16', 'evening: not tomorrow');

// wall time, also on the nights the clocks change
ok(wallTime('2026-11-15', 6, 30, 'Europe/Vienna').toISOString() === '2026-11-15T05:30:00.000Z', 'wallTime: winter');
ok(wallTime('2026-07-01', 6, 30, 'Europe/Vienna').toISOString() === '2026-07-01T04:30:00.000Z', 'wallTime: summer');
ok(wallTime('2026-10-25', 6, 30, 'Europe/Vienna').toISOString() === '2026-10-25T05:30:00.000Z', 'wallTime: the day the clocks go back');
ok(wallTime('2027-03-28', 6, 30, 'Europe/Vienna').toISOString() === '2027-03-28T04:30:00.000Z', 'wallTime: the day the clocks go forward');

// the days of 5787: Rosh HaShana 12–13.09.2026 (Sat–Sun), Yom Kippur 21.09, Sukkot 26–27.09, Shmini Atzeret 3.10, Simchat Torah 4.10
ok(dayKind('2026-09-13', false) === 'chag' && dayKind('2026-09-21', false) === 'chag', 'Rosh HaShana / Yom Kippur are not «chag»');
ok(dayKind('2026-09-27', false) === 'chag' && dayKind('2026-09-27', true) === 'cholHamoed', 'the second day of Sukkot: diaspora / Israel');
ok(dayKind('2026-09-29', false) === 'cholHamoed' && dayKind('2026-10-04', false) === 'chag' && dayKind('2026-10-04', true) === null, 'Chol HaMoed / Simchat Torah');
ok(dayKind('2026-11-21', false) === 'shabbat' && dayKind('2026-11-18', false) === null, 'Shabbat / a weekday');
ok(dayKind('2027-04-22', false) === 'chag' && dayKind('2027-04-28', false) === 'chag' && dayKind('2027-06-11', false) === 'chag', 'Pesach / Shavuot 5787');
ok(dayKind('2026-12-05', false) === 'shabbat' && dayKind('2026-12-07', false) === null && dayKind('2027-03-23', false) === null, 'Chanukah and Purim are ordinary days for the alarm');
ok(inIsrael('Asia/Jerusalem') && !inIsrael('Europe/Vienna'), 'inIsrael');

// the rest of the alarm: Friday before candle lighting rings, after it — no; Saturday night after Shabbat is out — rings
const at = (iso: string, h: number, m: number, s = vienna) => wallTime(iso, h, m, s.zone);
ok(restAt(at('2026-11-20', 15, 30), vienna) === null, 'Friday 15:30 (before candles) must ring'); // sunset ≈ 16:11
ok(restAt(at('2026-11-20', 16, 0), vienna) === 'shabbat', 'Friday 16:00 (after candles) must rest');
ok(restAt(at('2026-11-21', 6, 30), vienna) === 'shabbat', 'Shabbat morning must rest');
ok(restAt(at('2026-11-21', 16, 50), vienna) === 'shabbat', 'Shabbat, before it is out, must rest');
ok(restAt(at('2026-11-21', 17, 30), vienna) === null, 'Saturday night must ring');
ok(restAt(at('2026-09-21', 7, 0), vienna) === 'chag', 'Yom Kippur must rest');
ok(restAt(at('2026-09-20', 20, 0), vienna) === 'chag', 'the night of Yom Kippur must rest');
ok(restAt(at('2026-09-13', 21, 0), vienna) === null, 'the night after Rosh HaShana must ring');
ok(restAt(at('2026-09-12', 21, 0), vienna) === 'chag', 'Shabbat night into the second day of Rosh HaShana must rest');
ok(restAt(at('2026-09-29', 7, 0), vienna) === null && restAt(at('2026-09-29', 7, 0), vienna, true) === 'cholHamoed', 'Chol HaMoed — by choice');
ok(restAt(at('2026-09-27', 7, 0, jerusalem), jerusalem) === null && restAt(at('2026-09-27', 7, 0), vienna) === 'chag', 'the second day of Yom Tov: only in the diaspora');
ok(restAt(at('2026-12-19', 12, 0, tromso), tromso) === 'shabbat' && restAt(at('2026-12-18', 13, 0, tromso), tromso) === null, 'no sunset: fixed hours');

// the next ring
const daily: Alarm = { ...DEFAULT_ALARM, on: true, days: [0, 1, 2, 3, 4, 5, 6] };
{
  const r = nextRing(daily, at('2026-11-20', 7, 0), vienna); // Friday after the alarm: Shabbat is skipped → Sunday
  ok(r && r.at.getTime() === at('2026-11-22', 6, 30).getTime(), `after Friday's ring — Sunday, got ${r?.at.toISOString()}`);
  ok(r?.skipped.length === 1 && r.skipped[0].why === 'shabbat', 'the skipped Shabbat is not told');
}
{
  const r = nextRing(daily, at('2026-09-11', 7, 0), vienna); // Fri → Shabbat-Rosh HaShana, Sunday — the second day → Monday
  ok(r && r.at.getTime() === at('2026-09-14', 6, 30).getTime() && r.skipped.length === 2, `Rosh HaShana: Monday, got ${r?.at.toISOString()}`);
}
{
  const r = nextRing({ ...daily, days: [1] }, at('2026-11-15', 12, 0), vienna);
  ok(r && r.at.getTime() === at('2026-11-16', 6, 30).getTime(), 'only Mondays');
  ok(nextRing({ ...daily, days: [] }, at('2026-11-15', 12, 0), vienna) === null, 'no days — no ring');
}
{
  const shma: Alarm = { ...daily, mode: 'shma', before: 60 };
  const r = nextRing(shma, at('2026-11-15', 12, 0), vienna);
  const t = timesOf('2026-11-16', vienna).shma!;
  ok(r && r.at.getTime() === t.getTime() - 3_600_000, 'an hour before the end of the time of Shma');
  ok(nextRing(shma, at('2026-12-21', 12, 0, tromso), tromso, 5) === null, 'no Shma time — no ring');
}
{
  const r = nextRing(daily, at('2026-11-16', 6, 30), vienna);
  ok(r && r.at.getTime() === at('2026-11-16', 6, 30).getTime(), 'the ring of this very minute');
}
ok(JSON.stringify(cleanAlarm({ on: true, h: 99, m: -1, days: [7, 1, 1, 'x'], before: 7, mode: 'x' })) === JSON.stringify({ ...DEFAULT_ALARM, on: true, days: [1] }), 'cleanAlarm');
ok(cleanMarks(['tzeit', 'x', 'shma', 'shma']).join() === 'shma,tzeit' && cleanMarks(null).join() === 'shma,tefila,mincha' && cleanMarks([]).length === 0, 'cleanMarks');
ok(JSON.stringify(cleanAlarm(null)) === JSON.stringify(DEFAULT_ALARM), 'cleanAlarm(null)');
ok(cleanAlarm({ on: true }, DEFAULT_STUDY).h === 20 && cleanAlarm({ h: 7 }, DEFAULT_STUDY).h === 7, 'cleanAlarm: the defaults of the alarm of study');

if (failed) {
  console.error(`clock: ${failed} problem(s)`);
  process.exit(1);
}
console.log('✓ «Часы»: времена дня (Вена, Йерушалаим — каждый день года), покой будильника в Шабат и праздники, следующий звонок');
