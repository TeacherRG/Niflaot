/**
 * «Неделя в Академии» (src/core/weekDigest.ts): every day of the cycle has a verse to quote — a whole sentence in every
 * translation it has, — every passage of the «Ґемшех» a sentence on every language, every niggun its first lines, and
 * the weeks: Sunday to Friday, the latest first, on a Sunday — the week that has just ended. The retelling of the days
 * (src/tanakh/retell.json): only days of the cycle, both sections on ru/en/de, the Names (Б-г, Г-сподь; G-d; G-tt) and
 * the house style, a first sentence short enough for the Wednesday post; every translated day has one — and a warning
 * when less than a week ahead is ready.
 */
import { readFileSync } from 'node:fs';
import { CYCLE, type DayContent } from '../src/core/tanakh';
import { allPassages } from '../src/core/hemshech';
import { NIGUNIM } from '../src/nigun';
import { styleErrors } from './style-rules';
import { RETELL, digestWeek, digestWeeks, firstLines, firstSentence, quoteSentence, quoteVerse, weekDays, weekNigun } from '../src/core/weekDigest';

const errors: string[] = [];
let poor = 0;
let readyTo = '';
const NAMES_RU = /(?<![-\w])(Бог|Бога|Богу|Богом|Боже|Господ\w*)(?![-\w])/;
const dates = new Set(CYCLE.map((d) => d.date));
for (const [date, day] of Object.entries(RETELL)) {
  if (!dates.has(date)) errors.push(`retell ${date}: not a day of the cycle`);
  for (const s of ['neviim', 'ketuvim'] as const)
    for (const l of ['ru', 'en', 'de'] as const) {
      const text = day[s]?.[l];
      if (!text?.trim()) {
        errors.push(`retell ${date} ${s} ${l}: missing`);
        continue;
      }
      if (/<|>/.test(text)) errors.push(`retell ${date} ${s} ${l}: no HTML`);
      if (l === 'ru' && NAMES_RU.test(text)) errors.push(`retell ${date} ${s} ru: «${text.match(NAMES_RU)![0]}» → Б-г, Г-сподь`);
      if (l !== 'ru') for (const e of styleErrors(l, text)) errors.push(`retell ${date} ${s} ${l}: ${e}`);
      if (firstSentence(text).length > 240) errors.push(`retell ${date} ${s} ${l}: the first sentence (the Wednesday post) is over 240 letters`);
    }
}
for (const d of CYCLE) {
  const day = JSON.parse(readFileSync(`public/tanakh/${d.date}.json`, 'utf8')) as DayContent;
  // a day translated into Russian (the whole day, as the page shows it) is retold too
  const translated = (['neviim', 'ketuvim'] as const).every((s) => day[s].verses.every((v) => v.ru));
  if (translated && !RETELL[d.date]) errors.push(`retell ${d.date}: the day is translated but not retold (src/tanakh/retell.json)`);
  if (RETELL[d.date] && (!readyTo || d.date > readyTo)) readyTo = d.date;
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
console.log(`Неделя в Академии: стих для цитаты есть у всех ${CYCLE.length} дней (не целым предложением — ${poor}), фраза — у всех отрывков Хасидута; пересказ дней готов до ${readyTo}.`);
const ahead = CYCLE.filter((d) => d.date > new Date().toISOString().slice(0, 10) && d.date <= readyTo).length;
if (ahead < 6) console.warn(`⚠ Пересказ дней готов только на ${ahead} учебных дней вперёд (до ${readyTo}) — пора писать следующую неделю (src/tanakh/retell.json).`);
