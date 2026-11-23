/**
 * «Мишне Тора — глава в день» (the one-chapter-a-day Rambam cycle, about three years): the chapter of a date, its text,
 * the slides of the explanation and the project's dictionary of its words. Data — scripts/fetch-rambam.py:
 * public/rambam/text/<id>.json (Hebrew «Torat Emet 363», PD; English — E. Touger, Moznaim, CC BY-NC),
 * public/rambam/slides/<id>/slides.json + NN.webp (the project's presentations; the images may live elsewhere —
 * VITE_RAMBAM_SLIDES, Cloudflare R2), public/rambam/words/ru.json (the project's translation of each word form).
 * The cycle goes every day, Shabbat too (the site rests then — the chapter is reachable by the date bar).
 * «Я прочитал(а)» — localStorage `niflaot:rambam-done` = {<id>: time in s, unchecked — negative}, synced (as tanakh-done).
 */
import { useCallback, useEffect, useState } from 'react';
import books from '../rambam/books.json';
import { root, localToday } from './tanakh';
import { markStudied } from './habit';
import { earn } from './coins';

export interface RambamBook {
  id: string;
  en: string;
  ch: number;
  path: string | null;
  he?: string;
  ru?: string;
}
export const BOOKS = books as RambamBook[];
const CYCLE = BOOKS.reduce((a, b) => a + b.ch, 0); // 1017
/** Sunday, 27 Nisan 5744 — the start of the cycle */
const START = Date.UTC(1984, 3, 29);

const dayNo = (iso: string) => Math.round((Date.parse(`${iso}T00:00:00Z`) - START) / 864e5);
export const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);

export interface RambamDay {
  date: string;
  book: RambamBook;
  perek: number;
  id: string;
}
/** the chapter of this date */
export function chapterOn(date: string): RambamDay {
  let n = ((dayNo(date) % CYCLE) + CYCLE) % CYCLE;
  for (const book of BOOKS) {
    if (n < book.ch) return { date, book, perek: n + 1, id: `${book.id}-${n + 1}` };
    n -= book.ch;
  }
  throw new Error('rambam: the cycle');
}
export const todayChapter = () => chapterOn(localToday());
export const isDate = (s?: string): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

export interface RambamText {
  id: string;
  book: string;
  perek: number;
  title: { he: string; en: string };
  he: string[];
  en: string[];
}
export interface Slide {
  img: string;
  w: number;
  h: number;
  /** the halachot it explains, [first, last]; null — the title or the summary */
  hl: [number, number] | null;
  title: string;
  text: string;
}
/** {word key: [translation, base form?]} */
export type RambamDict = Record<string, [string, string?]>;

const loads = new Map<string, Promise<unknown>>();
function load<T>(path: string): Promise<T | null> {
  if (!loads.has(path))
    loads.set(
      path,
      fetch(root() + path).then(
        (r) => (r.ok ? r.json() : null),
        () => (loads.delete(path), null),
      ),
    );
  return loads.get(path) as Promise<T | null>;
}
export const loadText = (id: string) => load<RambamText>(`rambam/text/${id}.json`);
export const loadSlides = (id: string) => load<{ slides: Slide[] }>(`rambam/slides/${id}/slides.json`).then((x) => x?.slides ?? null);
export const loadDict = () => load<RambamDict>('rambam/words/ru.json');
/** where the slide images are: Cloudflare R2 when VITE_RAMBAM_SLIDES is set, else next to slides.json */
export const slideSrc = (id: string, img: string) => `${import.meta.env.VITE_RAMBAM_SLIDES || root() + 'rambam/slides/'}${id}/${img}`;

/** a word of the text → its key in the dictionary (as `key` in scripts/fetch-rambam.py) */
export function wordKey(w: string) {
  const k = w.replace(/[֑-ׇ]/g, '').replace(/[^א-ת״׳]/g, '');
  return /[א-ת]׳$/.test(k) ? k : k.replace(/^׳+|׳+$/g, '');
}

/** the halacha numbers in Hebrew letters (1 → א, 15 → טו, 16 → טז) */
export function heNum(n: number) {
  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  if (n === 15) return 'טו';
  if (n === 16) return 'טז';
  return tens[Math.floor(n / 10) % 10] + ones[n % 10];
}

export const DONE_KEY = 'niflaot:rambam-done';
const DONE_EVENT = 'niflaot:rambam-done';
export function readRambamDone(): Record<string, number> {
  try {
    const s = JSON.parse(localStorage.getItem(DONE_KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}
export function useRambamDone(): [Record<string, number>, (id: string, on: boolean) => void] {
  const [s, set] = useState(readRambamDone);
  useEffect(() => {
    const on = () => set(readRambamDone());
    window.addEventListener(DONE_EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(DONE_EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  const mark = useCallback((id: string, on: boolean) => {
    const x = readRambamDone();
    const now = Math.floor(Date.now() / 1000);
    x[id] = on ? now : -now;
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(x));
    } catch {}
    window.dispatchEvent(new Event(DONE_EVENT));
    if (on) (markStudied(), earn('read', `rm:${id}`));
  }, []);
  return [s, mark];
}
