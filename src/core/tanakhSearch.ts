/**
 * «Поиск по Пророкам и Писаниям» (`#/search`, src/components/TanakhSearchPage.tsx). Индекс — `tanakh/search/<язык>.json`
 * (scripts/tanakh-search-index.ts): `{neviim, ketuvim}` — тексты стихов раздела в порядке `track()`.
 * Иврит ищется без огласовок и знаков кантилляции (конечные буквы = обычные, макаф = пробел); перевод — без регистра
 * и диакритики (ё = е, ґ = г, ä = a). Все слова запроса должны быть в стихе, в любом порядке, и в любом месте слова
 * (ивритские приставки: «מלך» находит и «והמלך»).
 */
import { root } from './tanakh';
import { BOOKS, SECTIONS, track, type Section, type TanakhBook } from './tanakhCycle';

export type SearchLang = 'he' | 'en' | 'ru' | 'de';
export type SearchIndex = Record<Section, string[]>;

const loaded = new Map<SearchLang, Promise<SearchIndex | null>>();
/** Индекс языка; null — не загрузился (следующий вызов пробует снова). */
export function loadIndex(lang: SearchLang): Promise<SearchIndex | null> {
  let p = loaded.get(lang);
  if (!p) {
    const again = () => (loaded.delete(lang), null);
    p = fetch(`${root()}tanakh/search/${lang}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<SearchIndex>) : again()))
      .catch(again);
    loaded.set(lang, p);
  }
  return p;
}

const FINALS: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };
/** Один знак текста — в форму для поиска: '' — знак не считается (огласовка, ударение, кантилляция). */
function foldChar(ch: string): string {
  const code = ch.charCodeAt(0);
  if (code >= 0x0591 && code <= 0x05c7) return code === 0x05be ? ' ' : ''; // огласовки и кантилляция; макаф — пробел
  if (code === 0x200d || code === 0x200c) return '';
  if (FINALS[ch]) return FINALS[ch];
  if (code >= 0x05d0 && code <= 0x05ea) return ch;
  if (ch === 'ё' || ch === 'Ё') return 'е';
  if (ch === 'ґ' || ch === 'Ґ') return 'г';
  if (ch === '’' || ch === 'ʼ' || ch === '‘') return "'";
  return ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export const fold = (s: string) => Array.from(s, foldChar).join('');

/** Слова запроса в форме для поиска (без знаков препинания по краям). */
export function terms(query: string): string[] {
  return fold(query)
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(Boolean);
}

export const isHebrew = (s: string) => /[א-ת]/.test(s);
export const isCyrillic = (s: string) => /[Ѐ-ӿ]/.test(s);

const folded = new WeakMap<string[], string[]>();
function foldedOf(texts: string[]): string[] {
  let f = folded.get(texts);
  if (!f) {
    f = texts.map(fold);
    folded.set(texts, f);
  }
  return f;
}

export interface Hit {
  section: Section;
  /** номер стиха в разделе */
  i: number;
  book: TanakhBook;
  chapter: number;
  verse: number;
}

/** Стихи, где есть все слова запроса, в порядке Танаха. */
export function search(index: SearchIndex, words: string[]): Hit[] {
  if (!words.length) return [];
  const out: Hit[] = [];
  for (const section of SECTIONS) {
    const texts = foldedOf(index[section]);
    const refs = track(section);
    texts.forEach((t, i) => {
      if (t && words.every((w) => t.includes(w))) out.push({ section, i, book: refs[i].book, chapter: refs[i].chapter, verse: refs[i].verse });
    });
  }
  return out;
}

/**
 * Куски текста для показа с подсветкой: [текст, найдено ли]. Совпадения ищутся в форме для поиска, а показываются
 * в оригинале (с огласовками — до конца буквы со всеми её знаками).
 */
export function highlight(text: string, words: string[]): [string, boolean][] {
  const chars = Array.from(text);
  let f = '';
  const at: number[] = []; // знак формы для поиска → номер знака оригинала
  chars.forEach((ch, k) => {
    for (const c of foldChar(ch)) {
      f += c;
      at.push(k);
    }
  });
  const on = new Array<boolean>(chars.length).fill(false);
  for (const w of words) {
    if (!w) continue;
    for (let p = f.indexOf(w); p >= 0; p = f.indexOf(w, p + 1)) {
      const a = at[p];
      let z = at[p + w.length - 1];
      while (z + 1 < chars.length && foldChar(chars[z + 1]) === '') z++; // знаки последней буквы
      for (let k = a; k <= z; k++) on[k] = true;
    }
  }
  const parts: [string, boolean][] = [];
  chars.forEach((ch, k) => {
    const last = parts[parts.length - 1];
    if (last && last[1] === on[k]) last[0] += ch;
    else parts.push([ch, on[k]]);
  });
  return parts;
}

/**
 * Запрос — ссылка на место: «Теґилим 4:5», «Теилим 4 стих 5», «Tehillim 4,5», «Psalms 4», «תהלים ד ה», «Шмуэль 1 3:5»,
 * «Тег 4:5» → книга, глава, стих (стих — 1, если не указан; без главы — глава 1). Название — на любом языке сайта,
 * на иврите, как на Sefaria или привычное (Псалмы, Psalm); написание прощается (Теилим = Теґилим, Tehilim = Tehillim,
 * תהילים = תהלים), начало названия — если книга одна («Тег», «Jirm»). Номер главы и стиха — цифрами или буквами иврита.
 */
const NUMBERED = new Map([['i', '1'], ['ii', '2'], ['1', '1'], ['2', '2'], ['א', '1'], ['ב', '2']]);
const FILLER = new Set(['глава', 'гл', 'стих', 'ст', 'chapter', 'ch', 'verse', 'v', 'vers', 'kapitel', 'kap', 'פרק', 'פסוק', 'книга', 'book', 'buch', 'ספר']);
/** привычные названия, которыми книги тоже ищут */
const ALIASES: Record<string, string[]> = {
  joshua: ['Иисус Навин', 'Josua'],
  judges: ['Судьи', 'Richter'],
  'i-samuel': ['1 Царств', 'Samuel I'],
  'ii-samuel': ['2 Царств', 'Samuel II'],
  'i-kings': ['3 Царств', 'Könige I', 'Kings I'],
  'ii-kings': ['4 Царств', 'Könige II', 'Kings II'],
  isaiah: ['Исаия', 'Jesaja', 'Yeshayahu'],
  jeremiah: ['Иеремия', 'Jeremia', 'Yirmiyahu'],
  ezekiel: ['Иезекииль', 'Hesekiel', 'Yechezkel'],
  hosea: ['Осия', 'Hoshea'],
  obadiah: ['Авдий', 'Obadja', 'Ovadia'],
  jonah: ['Иона'],
  micah: ['Михей'],
  habakkuk: ['Аввакум', 'Habakuk', 'Chavakuk'],
  zephaniah: ['Софония', 'Zephanja', 'Tzefaniah'],
  haggai: ['Аггей', 'Haggai'],
  zechariah: ['Захария', 'Sacharja', 'Zecharia'],
  malachi: ['Малахия'],
  psalms: ['Псалмы', 'Псалом', 'Псалтирь', 'Psalm', 'Psalmen', 'Tehilim', 'Tehillim'],
  proverbs: ['Притчи', 'Sprüche', 'Mishlei'],
  job: ['Иов', 'Hiob', 'Iyov', 'Ijob'],
  'song-of-songs': ['Песнь песней', 'Hoheslied', 'Shir HaShirim'],
  lamentations: ['Плач Иеремии', 'Klagelieder', 'Eicha'],
  ecclesiastes: ['Екклесиаст', 'Prediger', 'Kohelet', 'Koheleth'],
  daniel: ['Даниил'],
  nehemiah: ['Неемия', 'Nehemia'],
  'i-chronicles': ['1 Паралипоменон', 'Chronik I', 'Chronicles I', 'Divrei HaYamim I'],
  'ii-chronicles': ['2 Паралипоменон', 'Chronik II', 'Chronicles II', 'Divrei HaYamim II'],
};

const tokens = (s: string) =>
  fold(s)
    .replace(/[״׳"]/g, '')
    .split(/[\s:,.;\-–—]+/)
    .filter((t) => t && !FILLER.has(t));
/** название в форме для сравнения: без пробелов, ґ / г / h, двойных букв, ивритских ו / י; номер книги (I, 2, ב) — в конце */
function looseName(parts: string[]): string {
  // номер книги — одно слово (I, 2, ב) в начале или в конце: «Млахим II 2» — не книга, а «Млахим II», глава 2
  const at = parts.length > 1 ? [0, parts.length - 1].find((k) => NUMBERED.has(parts[k])) : undefined;
  const num = at === undefined ? undefined : NUMBERED.get(parts[at]);
  const rest = at === undefined ? parts : parts.filter((_, k) => k !== at);
  if (rest.some((t) => NUMBERED.has(t) && /\d/.test(t))) return '';
  const w = rest
    .join('')
    .replace(/[гh'`]/g, '')
    .replace(/й/g, 'и')
    .replace(/э/g, 'е')
    .replace(/(?<=.)[וי]/g, '')
    .replace(/(.)\1+/g, '$1');
  return w + (num ?? '');
}
let names: [string, TanakhBook][] | null = null;
function bookNames(): [string, TanakhBook][] {
  return (names ??= BOOKS.flatMap((b) =>
    [b.name.ru, b.name.en, b.name.de, b.he, b.sefaria, b.slug.replace(/-/g, ' '), ...(ALIASES[b.slug] ?? [])].map((n) => [looseName(tokens(n)), b] as [string, TanakhBook]),
  ));
}
/** «23», «ד», «כג», «קיט» → число; иначе null */
function number(t: string): number | null {
  if (/^\d{1,3}$/.test(t)) return Number(t);
  if (!/^[א-ת]{1,3}$/.test(t)) return null;
  const V: Record<string, number> = { א: 1, ב: 2, ג: 3, ד: 4, ה: 5, ו: 6, ז: 7, ח: 8, ט: 9, י: 10, כ: 20, ל: 30, מ: 40, נ: 50, ס: 60, ע: 70, פ: 80, צ: 90, ק: 100, ר: 200, ש: 300, ת: 400 };
  return [...t].reduce((n, c) => n + (V[c] ?? 0), 0) || null;
}
function findBook(parts: string[]): TanakhBook | null {
  const key = looseName(parts);
  if (!key) return null;
  const all = bookNames();
  const exact = all.find(([n]) => n === key);
  if (exact) return exact[1];
  if (parts.join('').length < 3) return null;
  const starts = new Set(all.filter(([n]) => n.startsWith(key)).map(([, b]) => b));
  return starts.size === 1 ? [...starts][0] : null;
}

export function parseRef(query: string): { book: TanakhBook; chapter: number; verse: number } | null {
  const parts = tokens(query);
  // с конца — до двух чисел (глава, стих); название — всё, что до них (сначала самое длинное: «Шмуэль 1 3» — книга «Шмуэль 1»)
  for (let n = 0; n <= 2 && n < parts.length; n++) {
    const nums = parts.slice(parts.length - n).map(number);
    if (nums.some((x) => x === null)) break;
    const book = findBook(parts.slice(0, parts.length - n));
    if (!book) continue;
    const chapter = nums[0] ?? 1;
    const verse = nums[1] ?? 1;
    if (chapter < 1 || chapter > book.verses.length || verse < 1 || verse > book.verses[chapter - 1]) return null;
    return { book, chapter, verse };
  }
  return null;
}

/** два разных названия книг, совпавшие после упрощения (для проверки — check-tanakh.ts) */
export function bookCollisions(): string[] {
  const seen = new Map<string, TanakhBook>();
  const out: string[] = [];
  for (const [n, b] of bookNames()) {
    const was = seen.get(n);
    if (!n) out.push(`${b.slug}: пустое название`);
    else if (was && was !== b) out.push(`«${n}»: ${was.slug} и ${b.slug}`);
    else seen.set(n, b);
  }
  return out;
}
