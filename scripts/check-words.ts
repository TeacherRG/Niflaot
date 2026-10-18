/**
 * «Слова отрывка» (часть npm run check; данные — python3 scripts/fetch-words.py build):
 *  - src/tanakh/words.json: номера слов разные, по убыванию частоты, `cov` растёт; основная форма — иврит с огласовками,
 *    Имена — как во всём проекте (אֱלֹקִים, אֵ-ל, אֲדֹ-נָי; без יהוה); корень — только буквы;
 *  - переводы src/tanakh/words/<ru|en|de>.json: одни и те же слова на всех языках, сплошным началом списка
 *    (не меньше 500), не пустые, Имена — Б-г, Г-сподь / G-d, L-rd / G-tt (английский и немецкий — scripts/style-rules.ts);
 *  - public/tanakh/words/<дата>.json — у каждого дня цикла, оба раздела; слова — из словаря, их не больше, чем слов отрывка.
 */
import { existsSync, readFileSync } from 'node:fs';
import cycleJson from '../src/tanakh/cycle.json';
import { styleErrors } from './style-rules';
import { LESSONS } from '../src/lessons';
import { makeRound, torahWords } from '../src/core/torahWords';

type Lang = 'ru' | 'en' | 'de';
const errors: string[] = [];
const err = (s: string) => errors.push(s);
const read = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));

// Имена Всевышнего среди слов: номер Стронга → как писать (אֵל «к» и אַל «не» — не Имена, поэтому по номерам)
const NAMES: Record<string, string> = { '430': 'אֱלֹקִים', '433': 'אֱלוֹקַּ', '410': 'אֵ-ל', '136': 'אֲדֹ-נָי', '7706': 'שַׁ-דַּי' };
const dict = read('../src/tanakh/words.json') as { words: { id: string; he: string; n: number; root?: string; cov: number }[] };
const ids = dict.words.map((w) => w.id);
if (new Set(ids).size !== ids.length) err('words.json: номера слов повторяются');
dict.words.forEach((w, i) => {
  const prev = dict.words[i - 1];
  if (prev && (w.n > prev.n || w.cov < prev.cov)) err(`words.json: ${w.id} — не по порядку частоты`);
  if (!/^[ְ-ׇא-ת׳-]+$/.test(w.he) || !/[ְ-ּ]/.test(w.he)) err(`words.json: ${w.id} «${w.he}» — не иврит с огласовками`);
  const plain = w.he.replace(/[֑-ׇ]/g, '');
  if (/יהוה|אלהים|אלוה(?!ק)/.test(plain) || (NAMES[w.id] && w.he !== NAMES[w.id])) err(`words.json: ${w.id} «${w.he}» — Имя не по правилам проекта`);
  if (w.root && !/^[א-ת]{2,4}$/.test(w.root)) err(`words.json: ${w.id} — корень «${w.root}»`);
});

const badName: Record<Lang, (s: string) => string[]> = {
  ru: (s) => (/(^|[^\p{L}-])(Бог|Господ|Бож|божеств)/u.test(s) ? ['Имена по-русски — Б-г, Г-сподь'] : []),
  en: (s) => [...(/\b(God|LORD|Lord)\b/.test(s) ? ['G-d / L-rd'] : []), ...styleErrors('en', s)],
  de: (s) => styleErrors('de', s),
};
const tr = {} as Record<Lang, Record<string, string>>;
for (const lang of ['ru', 'en', 'de'] as Lang[]) {
  tr[lang] = read(`../src/tanakh/words/${lang}.json`);
  const keys = Object.keys(tr[lang]);
  for (const id of keys) {
    if (!ids.includes(id)) err(`words/${lang}.json: слова ${id} нет в словаре`);
    const t = tr[lang][id];
    if (!t?.trim()) err(`words/${lang}.json: ${id} — пустой перевод`);
    for (const e of badName[lang](t ?? '')) err(`words/${lang}.json: ${id} «${t}» — ${e}`);
  }
  // переведено — начало списка без пропусков
  const n = keys.length;
  const holes = ids.slice(0, n).filter((id) => !(id in tr[lang]));
  if (holes.length) err(`words/${lang}.json: пропущены слова ${holes.slice(0, 10).join(', ')} (переводить по порядку частоты)`);
  if (n < 500) err(`words/${lang}.json: переведено ${n} слов, нужно не меньше 500`);
}
for (const id of Object.keys(tr.ru)) if (!(id in tr.en) || !(id in tr.de)) err(`слово ${id}: перевод не на всех языках`);

const known = new Set(ids);
for (const [date] of cycleJson.days as [string, ...number[]][]) {
  const url = new URL(`../public/tanakh/words/${date}.json`, import.meta.url);
  if (!existsSync(url)) {
    err(`public/tanakh/words/${date}.json: нет (python3 scripts/fetch-words.py build)`);
    continue;
  }
  const day = JSON.parse(readFileSync(url, 'utf8'));
  for (const s of ['neviim', 'ketuvim']) {
    const sec = day[s];
    if (!sec || typeof sec.n !== 'number') {
      err(`words/${date}.json: нет раздела ${s}`);
      continue;
    }
    let sum = 0;
    for (const [id, c] of Object.entries(sec.w as Record<string, number>)) {
      if (!known.has(id)) err(`words/${date}.json: слова ${id} нет в словаре`);
      sum += c;
    }
    if (sum > sec.n) err(`words/${date}.json (${s}): слов словаря больше, чем слов отрывка`);
  }
}

// «Слова Торы» — the children's deck from the lessons (src/core/torahWords.ts): every word translated on every language,
// Names as on the site, and a game always has four different answers
let deck = 0;
for (const lang of ['ru', 'en', 'de'] as Lang[]) {
  const all = torahWords(LESSONS, lang);
  deck = all.length;
  for (const w of all) {
    if (!w.tr.trim()) err(`Слова Торы (${lang}): «${w.key}» (${w.lesson}) — нет перевода`);
    if (/אלהים|יהוה/.test(w.he.replace(/[\u0591-\u05C7]/g, ''))) err(`Слова Торы: «${w.he}» — Имя не по правилам проекта`);
  }
  for (let k = 0; k < 50; k++) for (const q of makeRound(all, all, {})) if (q.options.length < 4) err(`Слова Торы (${lang}): у «${q.word.key}» меньше четырёх вариантов ответа`);
}
if (errors.length) {
  console.error(`✗ Слова отрывка: ${errors.length} ошибок\n  ${errors.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
const learn = Object.keys(tr.ru).length;
console.log(`✓ Слова отрывка: словарь ${ids.length} слов, переведено ${learn} (${dict.words[learn - 1].cov}% текста) на ru/en/de, файлы всех ${cycleJson.days.length} дней; «Слова Торы» для детей — ${deck} слов из уроков`);
