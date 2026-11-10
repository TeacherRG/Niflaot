/**
 * «אנגלית דרך התנ״ך» — English for Hebrew speakers (`#/english`, EnglishCoursePage.tsx; owner, 10.11.2026: «для ивритоязычных —
 * обратная связь: учить английский на основе нашего приложения»). The reverse of «Святой язык»: the learner knows the Hebrew word
 * and learns the English one. Two tracks:
 *  - «האותיות האנגליות» — the 26 Latin letters in 4 units: the letter, its name in Hebrew letters, how it sounds and a first word
 *    (`LETTERS`);
 *  - «מילים» — the words of the Prophets and Writings by frequency, levels of 50 (as «Мои слова» and «Святой язык»), each with
 *    the project's English translation (src/tanakh/words/en.json); a word whose translation is not a plain word («(marks the
 *    direct object)») is left out.
 * A lesson: up to 5 new items (a card with the word and its sound — the browser's English voice), then exercises: Hebrew → English,
 * English → Hebrew, pairs, spell the English word from letters, «what did you hear?», and arrange an English verse (JPS 1985,
 * the example verse of «Мои слова») — a nearly right order counts, as in «Святой язык».
 * Progress — `niflaot:en-course` = {s: {<item>: day of the last right answer}, xp: {<date>: points}}, on this device only
 * (the page is open without signing in). Checked by scripts/check-en-course.ts.
 *
 * The same course teaches **Russian and German** too (`Target`; `#/russian`, `#/german`): the alphabet of the language (`ALPHABETS`),
 * the project's translations of the words (src/tanakh/words/ru.json, de.json), the verse — the project's own translation only, the
 * browser's voice of that language; progress — `niflaot:ru-course`, `niflaot:de-course`.
 */
import { localToday } from './tanakh';
import { markStudied } from './habit';

export type Target = 'en' | 'ru' | 'de';
export const TARGETS: Target[] = ['en', 'ru', 'de'];
/** the browser voice of each language */
export const VOICE: Record<Target, string> = { en: 'en-US', ru: 'ru-RU', de: 'de-DE' };

export interface EnItem {
  /** `abc:A` or the Strong number */
  key: string;
  /** Hebrew: the word with nikkud, or the letter's name in Hebrew letters */
  he: string;
  /** English: the letter «A a» or the whole translation («to say, speak») */
  en: string;
  /** what is spoken, spelled and offered: the letter or the first meaning («say») */
  main: string;
  /** a letter: how it sounds (Hebrew letters) and a first word with its Hebrew */
  sound?: string;
  word?: [string, string];
}
export interface EnUnit {
  id: string;
  track: 'abc' | 'words';
  /** number of the level in its track, from 1 */
  n: number;
  items: EnItem[];
  /** for words: their ranks by frequency */
  from?: number;
  to?: number;
}

type Row = [string, string, string, string, string];
/** [letter, name in Hebrew letters, sounds like, a word, its Hebrew] */
export const LETTERS: Row[] = [
  ['A', 'אֵי', 'אַ / אֵי', 'apple', 'תַּפּוּחַ'],
  ['B', 'בִּי', 'בּ', 'bread', 'לֶחֶם'],
  ['C', 'סִי', 'ק / ס', 'city', 'עִיר'],
  ['D', 'דִּי', 'ד', 'day', 'יוֹם'],
  ['E', 'אִי', 'אֶ / אִי', 'earth', 'אֶרֶץ'],
  ['F', 'אֶף', 'פ', 'fire', 'אֵשׁ'],
  ['G', 'גִ׳י', 'ג / ג׳', 'gold', 'זָהָב'],
  ['H', 'אֵייץ׳', 'ה', 'house', 'בַּיִת'],
  ['I', 'אַי', 'אִ / אַי', 'island', 'אִי'],
  ['J', 'גֵ׳י', 'ג׳', 'joy', 'שִׂמְחָה'],
  ['K', 'קֵי', 'ק', 'king', 'מֶלֶךְ'],
  ['L', 'אֶל', 'ל', 'light', 'אוֹר'],
  ['M', 'אֶם', 'מ', 'man', 'אִישׁ'],
  ['N', 'אֶן', 'נ', 'night', 'לַיְלָה'],
  ['O', 'אוֹ', 'אוֹ / אָ', 'olive', 'זַיִת'],
  ['P', 'פִּי', 'פּ', 'peace', 'שָׁלוֹם'],
  ['Q', 'קְיוּ', 'ק (qu — קְו)', 'queen', 'מַלְכָּה'],
  ['R', 'אָר', 'ר', 'river', 'נָהָר'],
  ['S', 'אֶס', 'ס', 'sun', 'שֶׁמֶשׁ'],
  ['T', 'טִי', 'ט / ת', 'tree', 'עֵץ'],
  ['U', 'יוּ', 'אַ / יוּ', 'up', 'לְמַעְלָה'],
  ['V', 'וִי', 'ו', 'voice', 'קוֹל'],
  ['W', 'דַּאבֶּל־יוּ', 'וו (כמו בְּ־ווֹ)', 'water', 'מַיִם'],
  ['X', 'אֶקְס', 'קס', 'box', 'תֵּבָה'],
  ['Y', 'וַוי', 'י', 'year', 'שָׁנָה'],
  ['Z', 'זִי', 'ז', 'zebra', 'זֶבְּרָה'],
];
/** the Russian alphabet: 33 letters */
const RU: Row[] = [
  ['А', 'אָ', 'אַ', 'ангел', 'מַלְאָךְ'],
  ['Б', 'בֶּה', 'בּ', 'брат', 'אָח'],
  ['В', 'וֶה', 'ו', 'вода', 'מַיִם'],
  ['Г', 'גֶה', 'ג', 'гора', 'הַר'],
  ['Д', 'דֶה', 'ד', 'день', 'יוֹם'],
  ['Е', 'יֶה', 'יֶ / אֶ', 'еда', 'אֹכֶל'],
  ['Ё', 'יוֹ', 'יוֹ', 'ёж', 'קִפּוֹד'],
  ['Ж', 'ז׳ֶה', 'ז׳', 'жена', 'אִשָּׁה'],
  ['З', 'זֶה', 'ז', 'земля', 'אֶרֶץ'],
  ['И', 'אִי', 'אִי', 'имя', 'שֵׁם'],
  ['Й', 'אִי קָצָר', 'י', 'мой', 'שֶׁלִּי'],
  ['К', 'קָא', 'ק', 'книга', 'סֵפֶר'],
  ['Л', 'אֶל', 'ל', 'лев', 'אַרְיֵה'],
  ['М', 'אֶם', 'מ', 'мир', 'שָׁלוֹם'],
  ['Н', 'אֶן', 'נ', 'небо', 'שָׁמַיִם'],
  ['О', 'אוֹ', 'אוֹ', 'огонь', 'אֵשׁ'],
  ['П', 'פֶּה', 'פּ', 'песня', 'שִׁיר'],
  ['Р', 'אֶר', 'ר', 'рука', 'יָד'],
  ['С', 'אֶס', 'ס', 'солнце', 'שֶׁמֶשׁ'],
  ['Т', 'טֶה', 'ט / ת', 'Тора', 'תּוֹרָה'],
  ['У', 'אוּ', 'אוּ', 'утро', 'בֹּקֶר'],
  ['Ф', 'אֶף', 'פ', 'фрукт', 'פְּרִי'],
  ['Х', 'חָא', 'ח', 'хлеб', 'לֶחֶם'],
  ['Ц', 'צֶה', 'צ', 'царь', 'מֶלֶךְ'],
  ['Ч', 'צ׳ֶה', 'צ׳', 'человек', 'אָדָם'],
  ['Ш', 'שָׁא', 'שׁ', 'Шабат', 'שַׁבָּת'],
  ['Щ', 'שְׁצָ׳א', 'שְׁצ׳ רכה', 'щит', 'מָגֵן'],
  ['Ъ', 'סִימָן קָשֶׁה', 'לא נשמעת — מפרידה', 'подъём', 'עֲלִיָּה'],
  ['Ы', 'אִי עָבָה', 'אִי עמוקה', 'сын', 'בֵּן'],
  ['Ь', 'סִימָן רַךְ', 'לא נשמעת — מרככת', 'соль', 'מֶלַח'],
  ['Э', 'אֶה', 'אֶ', 'эхо', 'הֵד'],
  ['Ю', 'יוּ', 'יוּ', 'юг', 'דָּרוֹם'],
  ['Я', 'יָא', 'יָ', 'яблоко', 'תַּפּוּחַ'],
];
/** the German alphabet: 26 letters, the umlauts and ß */
const DE: Row[] = [
  ['A', 'אָא', 'אַ', 'Apfel', 'תַּפּוּחַ'],
  ['B', 'בֶּה', 'בּ', 'Brot', 'לֶחֶם'],
  ['C', 'צֶה', 'ק / צ', 'Licht', 'אוֹר'],
  ['D', 'דֶה', 'ד', 'Dorf', 'כְּפָר'],
  ['E', 'אֶה', 'אֶ', 'Erde', 'אֶרֶץ'],
  ['F', 'אֶף', 'פ', 'Feuer', 'אֵשׁ'],
  ['G', 'גֶה', 'ג', 'Gold', 'זָהָב'],
  ['H', 'הָא', 'ה', 'Haus', 'בַּיִת'],
  ['I', 'אִי', 'אִ', 'Insel', 'אִי'],
  ['J', 'יוֹט', 'י', 'Jahr', 'שָׁנָה'],
  ['K', 'קָא', 'ק', 'König', 'מֶלֶךְ'],
  ['L', 'אֶל', 'ל', 'Löwe', 'אַרְיֵה'],
  ['M', 'אֶם', 'מ', 'Mann', 'אִישׁ'],
  ['N', 'אֶן', 'נ', 'Nacht', 'לַיְלָה'],
  ['O', 'אוֹ', 'אוֹ', 'Olive', 'זַיִת'],
  ['P', 'פֶּה', 'פּ', 'Pferd', 'סוּס'],
  ['Q', 'קוּ', 'קו', 'Quelle', 'מַעְיָן'],
  ['R', 'אֶר', 'ר', 'Regen', 'גֶּשֶׁם'],
  ['S', 'אֶס', 'ז / ס', 'Sonne', 'שֶׁמֶשׁ'],
  ['T', 'טֶה', 'ט / ת', 'Tora', 'תּוֹרָה'],
  ['U', 'אוּ', 'אוּ', 'Uhr', 'שָׁעוֹן'],
  ['V', 'פָאוּ', 'פ', 'Vater', 'אָב'],
  ['W', 'וֶה', 'ו', 'Wasser', 'מַיִם'],
  ['X', 'אִיקְס', 'קס', 'Text', 'טֶקְסְט'],
  ['Y', 'אִיפְּסִילוֹן', 'אִי (כמו Ü)', 'Pyramide', 'פִּירָמִידָה'],
  ['Z', 'צֶט', 'צ', 'Zelt', 'אֹהֶל'],
  ['Ä', 'אַ־אוּמְלָאוּט', 'אֶ', 'Äpfel', 'תַּפּוּחִים'],
  ['Ö', 'אוֹ־אוּמְלָאוּט', 'אֶ בשפתיים עגולות', 'Öl', 'שֶׁמֶן'],
  ['Ü', 'אוּ־אוּמְלָאוּט', 'אִי בשפתיים עגולות', 'Tür', 'דֶּלֶת'],
  ['ß', 'אֶס־צֶט', 'ס', 'groß', 'גָּדוֹל'],
];
export const ALPHABETS: Record<Target, Row[]> = { en: LETTERS, ru: RU, de: DE };
const ABC_SPLIT: Record<Target, number[]> = { en: [7, 7, 6, 6], ru: [9, 8, 8, 8], de: [8, 8, 7, 7] };
export function abcUnits(target: Target = 'en'): EnUnit[] {
  const items: EnItem[] = ALPHABETS[target].map(([l, name, sound, w, wHe]) => ({ key: `abc:${l}`, he: name, en: l === 'ß' ? l : `${l} ${l.toLowerCase()}`, main: l, sound, word: [w, wHe] }));
  let at = 0;
  return ABC_SPLIT[target].map((n, i) => {
    const u: EnUnit = { id: `abc-${i + 1}`, track: 'abc', n: i + 1, items: items.slice(at, at + n) };
    at += n;
    return u;
  });
}

/** the first meaning, as a plain English word or phrase: «to say, speak» → «say»; null — not a plain word */
export function mainMeaning(tr: string): string | null {
  const first = tr.split(/[;,]/)[0].replace(/\([^)]*\)/g, '').replace(/^\s*to\s+/i, '').replace(/\s+/g, ' ').trim();
  return /^\p{L}[\p{L}' -]{0,22}$/u.test(first) && !/[\u0590-\u05FF]/.test(first) ? first : null;
}

export const WORD_LEVEL = 50;
/** levels of the word track (50 dictionary words each, by frequency); words without a plain English meaning are skipped */
export function wordUnits(words: { id: string; he: string }[], tr: Record<string, string>): EnUnit[] {
  const units: EnUnit[] = [];
  for (let at = 0; at < words.length; at += WORD_LEVEL) {
    const slice = words.slice(at, at + WORD_LEVEL);
    const items: EnItem[] = [];
    for (const w of slice) {
      const en = tr[w.id];
      const main = en && mainMeaning(en);
      if (main && !items.some((x) => x.main.toLowerCase() === main.toLowerCase())) items.push({ key: w.id, he: w.he, en, main });
    }
    if (items.length >= 4) units.push({ id: `w-${units.length + 1}`, track: 'words', n: units.length + 1, items, from: at + 1, to: at + slice.length });
  }
  return units;
}

// ───── the lesson ─────

export interface EnVerse {
  he: string;
  /** the English verse in words */
  words: string[];
  ref: string;
}
export type EnExercise =
  | { t: 'intro'; item: EnItem }
  /** `he` — show Hebrew, pick English; `en` — show English, pick Hebrew; `hear` — hear English, pick Hebrew */
  | { t: 'pick'; ask: 'he' | 'en' | 'hear'; item: EnItem; options: EnItem[] }
  | { t: 'pairs'; items: EnItem[] }
  | { t: 'spell'; item: EnItem; tiles: string[] }
  | { t: 'verse'; item: EnItem; verse: EnVerse; tiles: string[] };

export const NEW_PER_LESSON = 5;
export const PAIRS = 4;
/** a verse to arrange — no longer than this */
export const VERSE_WORDS = 10;
export const XP = 10;
export const XP_PERFECT = 15;
export const GOAL = 20;

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
/** seeded shuffle — the same lesson gives the same order (tests), a new seed — a new order */
export function shuffle<T>(xs: T[], seed: number): T[] {
  const a = [...xs];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 4 options: the item and 3 others of the pool, none looking the same as it */
export function optionsFor(item: EnItem, pool: EnItem[], seed: number, n = 4): EnItem[] {
  const others = shuffle(
    pool.filter((x) => x.key !== item.key && x.main.toLowerCase() !== item.main.toLowerCase() && x.he !== item.he),
    seed,
  ).slice(0, n - 1);
  return shuffle([item, ...others], seed + 7);
}

/** a word to spell: a single English word of 2–9 letters */
export const spellable = (it: EnItem) => /^\p{L}{2,9}$/u.test(it.main);
const COMMON: Record<Target, string> = { en: 'etaoinshrdlu', ru: 'оеаинтсрвлк', de: 'enisratdhulg' };
export function spellTiles(item: EnItem, seed: number, target: Target = 'en'): string[] {
  const letters = [...item.main.toLowerCase()];
  const extra = shuffle([...COMMON[target]].filter((c) => !letters.includes(c)), seed).slice(0, 2);
  return shuffle([...letters, ...extra], seed + 3);
}
/** the English verse cut into tiles: words without the end marks; the tiles — the words and one or two more of the lesson */
export function verseWords(en: string): string[] {
  return en
    .replace(/[“”"„«»—–…]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}'-]+|[^\p{L}'-]+$/gu, ''))
    .filter(Boolean);
}
export const verseOk = (v: EnVerse | undefined): v is EnVerse => !!v && v.words.length >= 3 && v.words.length <= VERSE_WORDS;

const norm = (w: string) => w.toLowerCase();
/** right: the words in order; «nearly»: the same words, at least half in order (as «Святой язык») */
export function verseRight(want: string[], got: string[]): boolean {
  return want.length === got.length && want.every((w, i) => norm(w) === norm(got[i]));
}
export function verseNearly(want: string[], got: string[]): boolean {
  if (want.length !== got.length) return false;
  const a = want.map(norm).sort().join(' ');
  if (a !== got.map(norm).sort().join(' ')) return false;
  // the longest common subsequence
  const m = want.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= m; j++) dp[i][j] = norm(want[i - 1]) === norm(got[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][m] >= Math.ceil(m / 2);
}

/**
 * A lesson of a unit: the new items (`fresh`, up to 5) introduced and asked at once, then the items met before (`old`) asked
 * again; `pool` — the whole unit, for the options. `verse` — the example verse of a word, if there is one. `hear` — the
 * browser can speak English.
 */
export function makeLesson(
  unit: EnUnit,
  fresh: EnItem[],
  old: EnItem[],
  seed: number,
  opts: { verse?: (it: EnItem) => EnVerse | undefined; hear?: boolean; target?: Target } = {},
): EnExercise[] {
  const pool = unit.items;
  const out: EnExercise[] = [];
  const asks = (it: EnItem, k: number): EnExercise => {
    const s = seed + hash(it.key) + k;
    if (unit.track === 'words' && k % 4 === 2 && spellable(it)) return { t: 'spell', item: it, tiles: spellTiles(it, s, opts.target) };
    const ask: 'he' | 'en' | 'hear' = k % 3 === 0 ? 'he' : k % 3 === 1 ? 'en' : opts.hear ? 'hear' : 'he';
    return { t: 'pick', ask, item: it, options: optionsFor(it, pool, s) };
  };
  fresh.forEach((it, k) => {
    out.push({ t: 'intro', item: it });
    out.push({ t: 'pick', ask: 'he', item: it, options: optionsFor(it, pool, seed + k) });
  });
  const again = shuffle([...fresh, ...old], seed + 11).slice(0, 6);
  again.forEach((it, k) => out.push(asks(it, k + 1)));
  const met = [...fresh, ...old];
  if (met.length >= PAIRS) out.push({ t: 'pairs', items: shuffle(met, seed + 5).slice(0, PAIRS) });
  if (unit.track === 'words' && opts.verse) {
    const it = shuffle(met, seed + 13).find((x) => verseOk(opts.verse!(x)));
    const v = it && opts.verse(it);
    if (it && v) out.push({ t: 'verse', item: it, verse: v, tiles: shuffle(v.words, seed + 17) });
  }
  return out;
}

// ───── progress ─────

export const EN_KEY = 'niflaot:en-course';
const storeKey = (t: Target) => (t === 'en' ? EN_KEY : `niflaot:${t}-course`);
export interface EnStore {
  s: Record<string, number>;
  xp: Record<string, number>;
}
export const dayNo = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
export function readEn(target: Target = 'en'): EnStore {
  try {
    const v = JSON.parse(localStorage.getItem(storeKey(target)) || '{}') as Partial<EnStore>;
    return { s: v.s && typeof v.s === 'object' ? v.s : {}, xp: v.xp && typeof v.xp === 'object' ? v.xp : {} };
  } catch {
    return { s: {}, xp: {} };
  }
}
function save(s: EnStore, target: Target) {
  try {
    localStorage.setItem(storeKey(target), JSON.stringify(s));
  } catch {}
}
export const seen = (s: EnStore, it: EnItem) => !!s.s[it.key];
export const freshOf = (u: EnUnit, s: EnStore) => u.items.filter((it) => !seen(s, it));
export const isDone = (u: EnUnit, s: EnStore) => !freshOf(u, s).length;
export const metCount = (u: EnUnit, s: EnStore) => u.items.length - freshOf(u, s).length;
/** a unit is open when it is the first of its track or the one before is done */
export const isOpen = (units: EnUnit[], i: number, s: EnStore) => i === 0 || units[i - 1].track !== units[i].track || isDone(units[i - 1], s);
export const xpToday = (s: EnStore) => Number(s.xp[localToday()]) || 0;
export const xpTotal = (s: EnStore) => Object.values(s.xp).reduce((a, n) => a + (Number(n) || 0), 0);

/** the end of a lesson: the items answered right are met today; the points of the day */
export function finishLesson(right: string[], xp: number, target: Target = 'en') {
  const s = readEn(target);
  const d = dayNo();
  for (const k of right) s.s[k] = d;
  const t = localToday();
  s.xp[t] = (Number(s.xp[t]) || 0) + xp;
  save(s, target);
  markStudied();
}

/** the English voice of the browser (no permission: speechSynthesis only speaks) */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
export function speak(text: string, target: Target = 'en') {
  if (!canSpeak()) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VOICE[target];
    u.rate = 0.85;
    const v = speechSynthesis.getVoices().find((x) => x.lang?.toLowerCase().startsWith(target));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch {}
}
