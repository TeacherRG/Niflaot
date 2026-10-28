/**
 * «Святое чтение» (src/core/reading.ts): в public/reading/tehillim — все 150 глав, число слов совпадает с index.json,
 * читается кери (нет ктива в скобках), Имена — как во всём проекте (нет יהוה и אלהים).
 */
import { existsSync, readFileSync } from 'node:fs';
import { CHAPTERS, chapterForDate, stripTaamim, tokens } from '../src/core/reading';

const dir = new URL('../public/reading/tehillim/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir), 'utf8'));
const errors: string[] = [];
if (index.words.length !== CHAPTERS) errors.push(`index.json: ${index.words.length} глав вместо ${CHAPTERS}`);
if (index.version?.license !== 'Public Domain') errors.push(`текст — не общественное достояние: ${index.version?.license}`);
for (const [chapter, audio] of Object.entries(index.audio ?? {})) {
  if (!/^(?:[1-9]|[1-9]\d|1[0-4]\d|150)$/.test(chapter)) errors.push(`index.json: неверная глава аудио ${chapter}`);
  if (!audio.src) errors.push(`index.json: нет пути аудио для главы ${chapter}`);
  else if (!/^https?:/.test(audio.src) && !existsSync(new URL(`../public/${audio.src}`, import.meta.url))) {
    errors.push(`index.json: нет аудио главы ${chapter}: ${audio.src}`);
  }
}
if (chapterForDate('2026-10-27') !== 16 || chapterForDate('2026-10-28') !== 17) {
  errors.push('еврейский календарь: 27–28.10.2026 должны открывать главы 16–17');
}
let total = 0;
for (let c = 1; c <= CHAPTERS; c++) {
  const v: string[] = JSON.parse(readFileSync(new URL(`${c}.json`, dir), 'utf8')).v;
  const n = v.flatMap(tokens).reduce((a, x) => a + x.w, 0);
  total += n;
  if (n !== index.words[c - 1]) errors.push(`глава ${c}: ${n} слов, в index.json — ${index.words[c - 1]}`);
  v.forEach((s, i) => {
    const plain = stripTaamim(s).replace(/[ְ-ׇ]/g, '');
    if (/[[\]()]/.test(s)) errors.push(`${c}:${i + 1}: скобки (ктив / кери)`);
    if (/יהוה|(^|[\s־])[והבכלמש]*אלהים/.test(plain)) errors.push(`${c}:${i + 1}: Имя не заменено`);
  });
}
if (errors.length) {
  console.error(errors.slice(0, 20).join('\n'));
  process.exit(1);
}
console.log(`✓ Святое чтение: Теґилим — ${CHAPTERS} глав, ${total} слов, кери, Имена`);
