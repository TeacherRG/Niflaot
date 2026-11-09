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
 * Запрос — ссылка на место: «Йеґошуа 2:5», «Joshua 2», «Tehillim 23», «תהלים 23» → книга, глава, стих (стих — 1,
 * если не указан). Название — на любом языке сайта, на иврите или как на Sefaria.
 */
export function parseRef(query: string): { book: TanakhBook; chapter: number; verse: number } | null {
  const m = query.trim().match(/^(.+?)\s*(\d{1,3})(?:\s*[:.,]\s*(\d{1,3}))?$/);
  if (!m) return null;
  const name = fold(m[1]).replace(/[\s'-]+/g, '');
  if (!name) return null;
  const key = (s: string) => fold(s).replace(/[\s'-]+/g, '');
  const book = BOOKS.find((b) => [b.name.ru, b.name.en, b.name.de, b.he, b.sefaria, b.slug].some((n) => key(n) === name));
  if (!book) return null;
  const chapter = Number(m[2]);
  const verse = m[3] ? Number(m[3]) : 1;
  if (chapter < 1 || chapter > book.verses.length || verse < 1 || verse > book.verses[chapter - 1]) return null;
  return { book, chapter, verse };
}
