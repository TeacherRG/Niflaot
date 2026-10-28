/**
 * «Святое чтение» (src/core/reading.ts): в public/reading/tehillim — все 150 глав, число слов совпадает с index.json,
 * читается кери (нет ктива в скобках), Имена — как во всём проекте (нет יהוה и אלהים).
 */
import { existsSync, readFileSync } from 'node:fs';
import { CHAPTERS, chapterAudioTracks, dailyPortion, hebrewDayForDate, shortHebrewMonth, stripTaamim, tokens } from '../src/core/reading';

const dir = new URL('../public/reading/tehillim/', import.meta.url);
const audioDir = new URL('../public/reading/Audio/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir), 'utf8'));
const errors: string[] = [];
if (index.words.length !== CHAPTERS) errors.push(`index.json: ${index.words.length} глав вместо ${CHAPTERS}`);
if (index.version?.license !== 'Public Domain') errors.push(`текст — не общественное достояние: ${index.version?.license}`);
for (let c = 59; c <= CHAPTERS; c++) {
  const file = `${c}.mp3`;
  if (!existsSync(new URL(file, audioDir))) errors.push(`нет аудио главы ${c}: ${file}`);
}
if (!existsSync(new URL('119.2.mp3', audioDir))) errors.push('нет аудио второй части главы 119: 119.2.mp3');
if (hebrewDayForDate('2026-10-28') !== 17) errors.push('еврейский календарь: 28.10.2026 должен открывать порцию 17-го дня');
const day17 = dailyPortion(17).map((p) => p.chapter);
if (day17.join(',') !== '83,84,85,86,87') errors.push(`порция 17-го дня: ожидались главы 83–87, получены ${day17.join(',')}`);
const day18Tracks = chapterAudioTracks(dailyPortion(18), 'day-18').map((track) => track.src);
if (day18Tracks.join(',') !== 'reading/Audio/88.mp3,reading/Audio/89.mp3') {
  errors.push(`аудио 18-го дня: ожидались главы 88 и 89, получено ${day18Tracks.join(',')}`);
}
if (chapterAudioTracks(dailyPortion(10), 'day-10').length) {
  errors.push('аудио 10-го дня не должно показываться без записей всех глав порции');
}
const day19Tracks = chapterAudioTracks(dailyPortion(19), 'day-19').map((track) => track.src);
if (day19Tracks.join(',') !== 'reading/Audio/90.mp3,reading/Audio/91.mp3,reading/Audio/92.mp3,reading/Audio/93.mp3,reading/Audio/94.mp3,reading/Audio/95.mp3,reading/Audio/96.mp3') {
  errors.push(`аудио 19-го дня: ожидались главы 90–96, получено ${day19Tracks.join(',')}`);
}
if (dailyPortion(25)[0]?.chapter !== 119 || dailyPortion(25)[0]?.fromVerse !== 1 || dailyPortion(25)[0]?.toVerse !== 96) {
  errors.push('порция 25-го дня: ожидались Теилимы 119:1–96');
}
if (chapterAudioTracks(dailyPortion(25), 'day-25')[0]?.src !== 'reading/Audio/119.mp3') {
  errors.push('аудио 25-го дня должно использовать первую часть Теилима 119');
}
if (dailyPortion(26)[0]?.chapter !== 119 || dailyPortion(26)[0]?.fromVerse !== 97 || dailyPortion(26)[0]?.toVerse !== 176) {
  errors.push('порция 26-го дня: ожидались Теилимы 119:97–176');
}
if (chapterAudioTracks(dailyPortion(26), 'day-26')[0]?.src !== 'reading/Audio/119.2.mp3') {
  errors.push('аудио 26-го дня должно использовать вторую часть Теилима 119');
}
if (dailyPortion(29, true).map((p) => p.chapter).join(',') !== '140,141,142,143,144,145,146,147,148,149,150') {
  errors.push('в месяце из 29 дней порции 29-го и 30-го дней должны объединяться');
}
const coverage = Array.from({ length: 30 }, (_, i) => dailyPortion(i + 1))
  .flat()
  .reduce<Record<number, number>>((counts, p) => ((counts[p.chapter] = (counts[p.chapter] ?? 0) + 1), counts), {});
for (let c = 1; c <= CHAPTERS; c++) {
  const expected = c === 119 ? 2 : 1;
  if (coverage[c] !== expected) errors.push(`месячная таблица: глава ${c} распределена ${coverage[c] ?? 0} раз вместо ${expected}`);
}
if (!shortHebrewMonth('2027-01-08') || shortHebrewMonth('2027-01-09')) {
  errors.push('еврейский календарь: Тевет 5787 должен длиться 29 дней');
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
