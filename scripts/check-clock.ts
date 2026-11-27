/**
 * «Часы» (src/core/clock.ts): the times of the day and the rules of the alarm — run by `npm run check`.
 */
import { addDays, cleanAlarm, cleanMarks, fracOf, halfOf, halfTimes, hourOf, TIME_IDS, dayKind, DEFAULT_ALARM, DEFAULT_STUDY, inIsrael, nextRing, restAt, shabbatSpan, shownDay, timesOf, candleMinutes, wallTime, type Alarm, type Spot } from '../src/core/clock';
import { dayTimes, hebrewDayMonth, isErevPesach } from '../src/core/hebcal';
import { HOUR_SIGNS, hourNames, NIGHT_TZIRUFIM, nameOfHour, TZIRUFIM, verseCode } from '../src/core/kabbalahHours';

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

// the face shows one half of the day — 12 halachic hours of the day or of the night (owner, 17.11.2026)
for (const [name, s] of [['Vienna', vienna], ['Jerusalem', jerusalem]] as const) {
  let iso = '2026-01-01';
  for (let n = 0; n < 366; n++, iso = addDays(iso, 1)) {
    for (const [h, m] of [[0, 30], [5, 0], [7, 0], [10, 0], [12, 0], [15, 30], [17, 0], [20, 0], [23, 59]] as const) {
      const now = wallTime(iso, h, m, s.zone);
      const half = halfOf(now, s);
      if (!half) { ok(false, `${name} ${iso} ${h}:${m}: no half`); continue; }
      const f = fracOf(now, half);
      ok(half.start <= now && now < half.end && f >= 0 && f < 1, `${name} ${iso} ${h}:${m}: «now» is not inside its half`);
      const len = (half.end.getTime() - half.start.getTime()) / 3600_000;
      ok(len > 6 && len < 18, `${name} ${iso} ${h}:${m}: a half of ${len.toFixed(1)} h`);
      ok(hourOf(now, half) >= 1 && hourOf(now, half) <= 12, `${name} ${iso}: hour of the half`);
      const t = halfTimes(half, s);
      for (const [id, at] of Object.entries(t)) ok(at! > half.start && at! <= half.end, `${name} ${iso} ${h}:${m}: ${id} outside the half`);
      if (half.day) ok(t.shma && t.tefila && t.chatzot && t.mincha && !t.sunrise && !t.tzeit, `${name} ${iso} ${h}:${m}: the day half — Shma, prayer, midday, sunset; not sunrise, not nightfall`);
      else ok(t.tzeit && t.sunrise && !t.mincha && !t.shma, `${name} ${iso} ${h}:${m}: the night half — nightfall and the next sunrise, not sunset`);
    }
  }
}
{
  // Vienna, 17.11.2026, 10:00 — the day; Shma at the end of the 3rd hour, so at 10:00 it is the 4th hour
  const now = wallTime('2026-11-17', 10, 0, vienna.zone);
  const half = halfOf(now, vienna)!;
  ok(half.day && hourOf(now, half) === 4, `Vienna 10:00 — the 4th hour of the day (got ${hourOf(now, half)})`);
  const t = halfTimes(half, vienna);
  ok(Math.abs(fracOf(t.shma!, half) - 0.25) < 0.02 && Math.abs(fracOf(t.chatzot!, half) - 0.5) < 0.01, 'Shma — at a quarter of the day, midday — at half');
  const night = halfOf(wallTime('2026-11-17', 22, 0, vienna.zone), vienna)!;
  ok(!night.day && night.alot && night.tzeit && night.tzeit > night.start && night.alot < night.end, 'the night: nightfall and dawn inside');
}
{
  const ru = hebrewDayMonth('2026-11-17', 'ru');
  ok(ru.day === 7 && ru.month === 'кислева' && ru.year === 5787, `the Jewish day as a number: ${ru.day} ${ru.month} ${ru.year}`);
  ok(hebrewDayMonth('2026-11-17', 'de').month === 'Kislew' && hebrewDayMonth('2026-11-17', 'he').month === 'בכסלו', 'month names de / he');
  // every month of a leap year (5787) has a name in every language
  let d = '2026-09-12';
  for (let n = 0; n < 390; n++, d = addDays(d, 1)) for (const l of ['ru', 'en', 'de', 'he']) ok(!/[A-Z]'?[a-z]+/.test(hebrewDayMonth(d, l).month) || l !== 'ru', `${d}: no Russian month name`);
}

{
  const near = (d: Date | null, want: string, by: number) => Math.abs(mins(hm(d, vienna.zone)) - mins(want)) <= by;
  // the Chabad profile of the app «Пеле Шаон» (synced 24.11.2026): dawn 16.9° (a white night — solar midnight), midday between the
  // true sunrise and sunset, nightfall 6°, the end of Shabbat 8.5° (after nightfall), candles by the city's custom
  ok(candleMinutes('Asia/Jerusalem') === 40 && candleMinutes('haifa') === 30 && candleMinutes('Asia/Tel_Aviv') === 22 && candleMinutes('Europe/Vienna') === 18 && candleMinutes() === 18, 'candle minutes by city');
  const v = dayTimes('2026-11-24', vienna.lat, vienna.lon, vienna.zone);
  ok(near(v.alot!, '05:30', 3) && near(v.misheyakir!, '06:12', 3) && near(v.chatzot!, '11:41', 2) && near(v.shabbatEnd!, '16:59', 3), `Vienna 24.11: alot ${hm(v.alot, vienna.zone)}, misheyakir ${hm(v.misheyakir, vienna.zone)}, chatzot ${hm(v.chatzot, vienna.zone)}, 8.5° ${hm(v.shabbatEnd, vienna.zone)}`);
  ok(v.tzeit! < v.shabbatEnd! && v.minchaGedola! < v.minchaKetana! && v.minchaKetana! < v.plag!, 'Vienna 24.11: the order of the times');
  const sh = shabbatSpan('2026-11-27', '2026-11-28', { ...jerusalem, candle: 40 });
  const js = dayTimes('2026-11-27', jerusalem.lat, jerusalem.lon, jerusalem.zone).sunset!;
  ok(sh.candles && js.getTime() - sh.candles.getTime() === 40 * 60_000 && sh.end, 'Jerusalem: candles 40 minutes before sunset');
  const spb: Spot = { lat: 59.94, lon: 30.31, zone: 'Europe/Moscow', il: false };
  const w = dayTimes('2026-06-20', spb.lat, spb.lon, spb.zone);
  ok(w.alot && w.alot < w.sunrise! && !w.shabbatEnd, 'St Petersburg, white night: dawn — solar midnight; no 8.5°');
  ok(restAt(wallTime('2026-06-20', 23, 30, spb.zone), spb) === 'shabbat' && !restAt(wallTime('2026-06-21', 3, 0, spb.zone), spb), 'St Petersburg, white night: quiet until solar midnight');
  ok(isErevPesach('2027-04-21') && !isErevPesach('2027-04-22'), 'Erev Pesach 5787');
  const b = dayTimes('2027-04-21', jerusalem.lat, jerusalem.lon, jerusalem.zone).biurChametz!;
  ok(b > timesOf('2027-04-21', jerusalem).tefila! && b < timesOf('2027-04-21', jerusalem).chatzot!, 'the burning of chametz: after the morning prayer, before midday');
}

// the kabbalistic dial and the big face: one table, the Arizal's months (owner, 27.11.2026)
{
  const perms = new Set(TZIRUFIM);
  ok(TZIRUFIM.length === 12 && perms.size === 12, 'twelve different combinations of the Name');
  ok(TZIRUFIM.every((z) => /^[יהו](-[יהו]){3}$/.test(z) && [...z.replace(/-/g, '')].sort().join('') === [...'יהוה'].sort().join('')), 'each combination — the letters of the Name, joined with hyphens');
  ok(TZIRUFIM[0] === 'י-ה-ו-ה' && TZIRUFIM[8] === 'ו-י-ה-ה' && TZIRUFIM[11] === 'ה-ה-י-ו', 'Nisan, Kislev, Adar — as the Arizal');
  ok(HOUR_SIGNS.map((h) => h.tribe).join() === 'yehuda,issachar,zevulun,reuven,shimon,gad,ephraim,menashe,binyamin,dan,asher,naftali', 'the tribes — in the order of the camps');
  ok(new Set(HOUR_SIGNS.map((h) => h.sign)).size === 12, 'twelve signs');
  ok(new Set(NIGHT_TZIRUFIM).size === 12 && NIGHT_TZIRUFIM.every((z) => [...z.replace(/-/g, '')].sort().join('') === [...'אדני'].sort().join('')), 'twelve combinations of the Name Adni');
  ok(nameOfHour(0, true) === 'י-ה-ו-ה' && nameOfHour(0, false) === 'א-ד-נ-י', 'by day Havayah, by night Adni');
  ok(HOUR_SIGNS.map((h) => h.letter).join('') === 'הוזחטילנסעצק', 'the letters of the months — Sefer Yetzirah 5');
  // the stone of the tribe on the breastplate (Rashi, Shemot 28:17–20)
  const STONES: Record<string, string> = { yehuda: 'נפך', issachar: 'ספיר', zevulun: 'יהלם', reuven: 'אדם', shimon: 'פטדה', gad: 'אחלמה', ephraim: 'שהם', menashe: 'שהם', binyamin: 'ישפה', dan: 'לשם', asher: 'תרשיש', naftali: 'שבו' };
  ok(HOUR_SIGNS.every((h) => STONES[h.tribe] === h.stoneHe), 'the stone of each tribe');
  for (const h of HOUR_SIGNS) {
    ok(verseCode(h).map((w) => w[1]).filter(Boolean).join('-') === h.tziruf, `the verse of ${h.month} spells its combination`);
    for (const l of [h.sense, h.organ, h.stone, h.gvul, h.sefirot, h.path, h.season, h.verseT, h.verseSrc]) ok(l.ru && l.en && l.de, `${h.month}: texts on ru/en/de`);
    ok(!/[א-ת]/.test(h.verseT.ru + h.verseT.en + h.verseT.de) && !/Господ|God\b|Lord\b|Gott\b/.test(h.verseT.ru + h.verseT.en + h.verseT.de), `${h.month}: the translation — Names as on the site`);
  }
  for (const ui of ['ru', 'en', 'de', 'he']) for (let n = 1; n <= 12; n++) {
    const x = hourNames(n, ui);
    ok(x.month && x.tribe, `kabbalistic dial: names of hour ${n} (${ui})`);
  }
}

if (failed) {
  console.error(`clock: ${failed} problem(s)`);
  process.exit(1);
}
console.log('✓ «Часы»: времена дня (Вена, Йерушалаим — каждый день года), половина суток на циферблате, еврейская дата числом, покой будильника в Шабат и праздники, следующий звонок');
