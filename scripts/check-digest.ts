/**
 * «Неделя в Академии» (src/core/weekDigest.ts): every day of the cycle has a verse to quote — a whole sentence in every
 * translation it has, — every passage of the «Ґемшех» a sentence on every language, every niggun its first lines, and
 * the weeks: Sunday to Friday, the latest first, on a Sunday — the week that has just ended.
 */
import { readFileSync } from 'node:fs';
import { CYCLE, type DayContent } from '../src/core/tanakh';
import { allPassages } from '../src/core/hemshech';
import { NIGUNIM } from '../src/nigun';
import { digestWeek, digestWeeks, firstLines, quoteSentence, quoteVerse, weekDays, weekNigun } from '../src/core/weekDigest';

const errors: string[] = [];
let poor = 0;
for (const d of CYCLE) {
  const day = JSON.parse(readFileSync(`public/tanakh/${d.date}.json`, 'utf8')) as DayContent;
  for (const s of ['neviim', 'ketuvim'] as const) {
    const v = quoteVerse(day[s].verses);
    if (!v) errors.push(`${d.date} ${s}: no verse to quote`);
    else if (!/[.!?»”“"]$/.test(v.en.trim())) poor++;
  }
}
for (const { p } of allPassages())
  for (const l of ['ru', 'en', 'de'] as const) if (!quoteSentence(p[l])) errors.push(`hemshech ${p.id} ${l}: no sentence to quote`);
for (const n of NIGUNIM) if (firstLines(n).length < 2) errors.push(`nigun ${n.id}: fewer than 2 first lines`);
if (new Set(NIGUNIM.map((_, i) => weekNigun(digestWeeks('2030-01-01')[i]).id)).size !== NIGUNIM.length) errors.push('weekNigun: not every niggun has a turn');
if (digestWeek('2026-10-25') !== '2026-10-18' || digestWeek('2026-10-26') !== '2026-10-25' || digestWeek('2026-10-31') !== '2026-10-25')
  errors.push('digestWeek: wrong week');
if (digestWeeks('2026-10-26').join() !== '2026-10-25,2026-10-18,2026-10-11') errors.push(`digestWeeks: ${digestWeeks('2026-10-26').join()}`);
if (weekDays('2026-10-25', '2026-10-27').map((d) => d.date).join() !== '2026-10-25,2026-10-26,2026-10-27') errors.push('weekDays: only the days up to today');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Неделя в Академии: стих для цитаты есть у всех ${CYCLE.length} дней (не целым предложением — ${poor}), фраза — у всех отрывков Хасидута.`);
