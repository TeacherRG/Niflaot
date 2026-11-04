/**
 * «Святое чтение» (src/core/reading.ts): в public/reading/tehillim — все 150 глав, число слов совпадает с index.json,
 * читается кери (нет ктива в скобках), Имена — в полном написании, как на Sefaria (нет замен проекта ה׳, אלקים).
 */
import { existsSync, readFileSync } from 'node:fs';
import { ALIYOT, SHNAYIM, aliyahOfDay, shnayimParsha, type ShnayimText } from '../src/core/shnayim';
import { translitToken, translitTokens } from '../src/core/tehillimTranslit';
import { CHAPTERS, chapterAudioTracks, weekdayOf, weekdayPortion, dailyPortion, hebrewDayForDate, shortHebrewMonth, stripTaamim, tokens } from '../src/core/reading';

const dir = new URL('../public/reading/tehillim/', import.meta.url);
const torahDir = new URL('../public/reading/torah/', import.meta.url);
const audioDir = new URL('../public/reading/Audio/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir), 'utf8'));
const errors: string[] = [];
// Имена в тексте Танаха — как на Sefaria (יְהוָה, אֱלֹהִים, в Таргуме — יְיָ); замены проекта — ошибка
const SUBSTITUTED = /ה׳|(^|[^א-ת])[והבכלמש]*אלק(ים|יכם|יכן|ינו|יך|יו|יה|יהם|י)(?![א-ת])|צב-אות|אד-ני/;
if (index.words.length !== CHAPTERS) errors.push(`index.json: ${index.words.length} глав вместо ${CHAPTERS}`);
if (index.version?.license !== 'Public Domain') errors.push(`текст — не общественное достояние: ${index.version?.license}`);
for (let c = 1; c <= CHAPTERS; c++) {
  const file = `${c}.mp3`;
  if (!existsSync(new URL(file, audioDir))) errors.push(`нет аудио главы ${c}: ${file}`);
}
if (!existsSync(new URL('119.2.mp3', audioDir))) errors.push('нет аудио второй части главы 119: 119.2.mp3');
if (!existsSync(new URL('tora_53.mp3', audioDir))) errors.push('нет аудио «Песни Аазину»: tora_53.mp3');
if (hebrewDayForDate('2026-10-28') !== 17) errors.push('еврейский календарь: 28.10.2026 должен открывать порцию 17-го дня');
const day17 = dailyPortion(17).map((p) => p.chapter);
if (day17.join(',') !== '83,84,85,86,87') errors.push(`порция 17-го дня: ожидались главы 83–87, получены ${day17.join(',')}`);
const day18Tracks = chapterAudioTracks(dailyPortion(18), 'day-18').map((track) => track.src);
if (day18Tracks.join(',') !== 'reading/Audio/88.mp3,reading/Audio/89.mp3') {
  errors.push(`аудио 18-го дня: ожидались главы 88 и 89, получено ${day18Tracks.join(',')}`);
}
if (chapterAudioTracks(dailyPortion(10), 'day-10').map((track) => track.src).join(',') !== 'reading/Audio/55.mp3,reading/Audio/56.mp3,reading/Audio/57.mp3,reading/Audio/58.mp3,reading/Audio/59.mp3') {
  errors.push('аудио 10-го дня: ожидались главы 55–59');
}
// по дням недели: вс 1–29 … Шабат 120–150, вся книга ровно раз; глава 119 — двумя записями
const week = Array.from({ length: 7 }, (_, i) => weekdayPortion(i + 1));
const weekChapters = week.flat().filter((p) => p.fromVerse === undefined || p.fromVerse === 1).map((p) => p.chapter);
if (weekChapters.length !== CHAPTERS || weekChapters.some((c, i) => c !== i + 1)) errors.push('порции по дням недели: должны пройти главы 1–150 по одному разу');
if (week[0][0]?.chapter !== 1 || week[6][week[6].length - 1]?.chapter !== 150) errors.push('порции по дням недели: вс — с главы 1, Шабат — до 150');
const w119 = chapterAudioTracks(week[5], 'week-6').filter((x) => x.chapter === 119).map((x) => x.src);
if (w119.join(',') !== 'reading/Audio/119.mp3,reading/Audio/119.2.mp3') errors.push(`глава 119 в пятницу: ожидались две записи, получено ${w119.join(',')}`);
if (weekdayOf('2026-10-29') !== 5) errors.push('день недели: 29.10.2026 — четверг (5)');
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
    if (SUBSTITUTED.test(plain)) errors.push(`${c}:${i + 1}: Имя заменено — нужно полное написание, как на Sefaria`);
  });
}
const haazinu = JSON.parse(readFileSync(new URL('haazinu.json', torahDir), 'utf8')) as { chapter: number; source: string; v: string[] };
if (haazinu.chapter !== 32) errors.push(`Аазину: ожидалась глава 32, получено ${haazinu.chapter}`);
if (haazinu.v.length !== 52) errors.push(`Аазину: ожидалось 52 стиха, получено ${haazinu.v.length}`);
if (!/sefaria\.org\/Deuteronomy\.32/.test(haazinu.source ?? '')) errors.push('Аазину: неверная ссылка на источник');
haazinu.v.forEach((s, i) => {
  const plain = stripTaamim(s).replace(/[ְ-ׇ]/g, '');
  if (/[[\]()]/.test(s)) errors.push(`Аазину ${i + 1}: скобки (ктив / кери)`);
  if (SUBSTITUTED.test(plain)) errors.push(`Аазину ${i + 1}: Имя заменено — нужно полное написание, как на Sefaria`);
});
// «Шнаим микра»: у каждой главы — 7 отрывков стих за стихом, у стиха — Тора и Таргум, обе — общественное достояние, Имена
let shnVerses = 0;
for (const p of SHNAYIM) {
  const d = JSON.parse(readFileSync(new URL(`shnayim-${p}.json`, torahDir), 'utf8')) as ShnayimText;
  if (d.parsha !== p) errors.push(`шнаим ${p}: в файле глава ${d.parsha}`);
  if (d.aliyot.length !== ALIYOT) errors.push(`шнаим ${p}: ${d.aliyot.length} отрывков вместо ${ALIYOT}`);
  for (const lic of [d.torah.license, d.targum.license]) if (lic !== 'Public Domain') errors.push(`шнаим ${p}: лицензия ${lic}`);
  let last: [number, number] | null = null;
  d.aliyot.forEach((a, k) => {
    if (a.v[0]?.r !== a.from || a.v[a.v.length - 1]?.r !== a.to) errors.push(`шнаим ${p} ${k + 1}: стихи не совпадают с ${a.from}–${a.to}`);
    for (const v of a.v) {
      shnVerses++;
      const [c, n] = v.r.split(':').map(Number);
      if (last && !((c === last[0] && n === last[1] + 1) || (c === last[0] + 1 && n === 1))) errors.push(`шнаим ${p}: после ${last.join(':')} — ${v.r}`);
      last = [c, n];
      for (const s of [v.m, v.t]) {
        const plain = stripTaamim(s).replace(/[ְ-ׇ]/g, '');
        if (!plain.trim()) errors.push(`шнаим ${p} ${v.r}: пустой текст`);
        if (/[[\](){}<>]/.test(s)) errors.push(`шнаим ${p} ${v.r}: скобки или пометки издания`);
        if (SUBSTITUTED.test(plain)) errors.push(`шнаим ${p} ${v.r}: Имя заменено — нужно полное написание, как на Sefaria`);
      }
    }
  });
}
// транслит (tehillimTranslit.ts): у каждого слова Теґилим и «Аазину» на ru / en / de — непустой, без букв иврита,
// Имена — как их произносят, читая Теґилим (Адойной, Элоґим, Йо…): ни заменных форм (Адо-ной, Элоким, Ка), ни чтения יהוה по буквам;
// образцовые стихи — слово в слово
const LANGS = ['ru', 'en', 'de'] as const;
const BAD_NAME = /(^|[^a-zа-яёґ])(ado-no[ij]|адо-ной|elokim|элоким|keil|kejl|кейл|kah|ка(?=$)|sha-dai|scha-daj|ша-дай|yahweh|jahwe|ягве|yehovah?|jehowa|йеґова)([^a-zа-яёґ]|$)/i;
let trWords = 0;
const allVerses = [...Array.from({ length: CHAPTERS }, (_, k) => JSON.parse(readFileSync(new URL(`${k + 1}.json`, dir), 'utf8')).v as string[]).flat(), ...haazinu.v];
for (const verse of allVerses) {
  for (const x of tokens(verse)) {
    if (!x.w) continue;
    for (const lang of LANGS) {
      trWords++;
      const r = translitToken(x.s, lang);
      if (!r) errors.push(`транслит (${lang}): пусто у «${x.s}»`);
      else if (/[֐-׿]/.test(r)) errors.push(`транслит (${lang}): иврит в «${r}» (${x.s})`);
      else if (BAD_NAME.test(r)) errors.push(`транслит (${lang}): Имя не так, как произносят, в «${r}» (${x.s})`);
    }
  }
}
const SAMPLE: Record<string, [number, Record<(typeof LANGS)[number], string>]> = {
  'Теґилим 23:1': [23, { ru: 'Мизмойр ледовид Адойной ройи лой эхсор', en: 'Mizmor ledovid Adonoi ro\'i lo echsor', de: 'Mismor ledowid Adonoj ro\'i lo echsor' }],
  'Теґилим 150:1': [150, { ru: 'Ґалелу Йо ґалелу-Эйл бекодшой ґалелуґу биркиа узой', en: 'Halelu Yo halelu-Eil bekodsho haleluhu birkia uzo', de: 'Halelu Jo halelu-Ejl bekodscho haleluhu birkia uso' }],
  'Теґилим 113:1': [113, { ru: 'Ґалелу Йо ґалелу авдей Адойной ґалелу эс-шейм Адойной', en: 'Halelu Yo halelu avdei Adonoi halelu es-sheim Adonoi', de: 'Halelu Jo halelu awdej Adonoj halelu es-schejm Adonoj' }],
};
for (const [name, [c, want]] of Object.entries(SAMPLE)) {
  const first: string = JSON.parse(readFileSync(new URL(`${c}.json`, dir), 'utf8')).v[0];
  for (const lang of LANGS) {
    const got = translitTokens(tokens(first).map((x) => x.s), lang).filter(Boolean).join(' ');
    if (got !== want[lang]) errors.push(`транслит ${name} (${lang}): «${got}», а нужно «${want[lang]}»`);
  }
}
if (aliyahOfDay('2026-10-29') !== 5 || aliyahOfDay('2026-10-25') !== 1 || aliyahOfDay('2026-10-31') !== 7) errors.push('шнаим: отрывок дня — вс 1-й … Шабат 7-й');
if (shnayimParsha('2026-10-29') !== 'vayera') errors.push('шнаим: 29.10.2026 — глава Вайера');

// разметка записей по паузам чтеца (scripts/reading-times.py): по времени на кусок со словами, по порядку
const timesDir = new URL('../public/reading/times/', import.meta.url);
let timed = 0;
const audioText = (name: string): string[] => {
  if (name === 'tora_53') return haazinu.v;
  const [ch, part] = name.split('.');
  const v: string[] = JSON.parse(readFileSync(new URL(`${Number(ch)}.json`, dir), 'utf8')).v;
  return Number(ch) === 119 ? (part === '2' ? v.slice(96) : v.slice(0, 96)) : v;
};
for (const name of [...Array.from({ length: CHAPTERS }, (_, i) => String(i + 1)), '119.2', 'tora_53']) {
  const file = new URL(`${name}.json`, timesDir);
  if (!existsSync(file)) {
    errors.push(`нет разметки записи ${name}: python3 scripts/reading-times.py ${name}`);
    continue;
  }
  const times: number[] = JSON.parse(readFileSync(file, 'utf8'));
  const words = audioText(name).flatMap((v) => tokens(v)).filter((x) => x.w).length;
  if (times.length !== words) errors.push(`разметка ${name}: ${times.length} времён, а кусков со словами ${words} — python3 scripts/reading-times.py ${name}`);
  else if (times.some((x, i) => !Number.isFinite(x) || x < 0 || (i > 0 && x < times[i - 1]))) errors.push(`разметка ${name}: времена не по порядку`);
  else timed++;
}

if (errors.length) {
  console.error(errors.slice(0, 20).join('\n'));
  process.exit(1);
}
console.log(`✓ Святое чтение: Теґилим — ${CHAPTERS} глав, ${total} слов, кери, Имена; Аазину — ${haazinu.v.length} стихов; шнаим микра — ${SHNAYIM.length} гл., ${shnVerses} стихов; транслит — ${trWords} слов; разметка по паузам — ${timed} записей`);
