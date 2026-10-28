/**
 * «Святое чтение» — беглое чтение Теґилим (`#/reading[/<глава>]`, src/components/ReadingPage.tsx).
 * Текст — public/reading/tehillim/<глава>.json (`python3 scripts/fetch-reading.py`: огласовки и знаки кантилляции, кери,
 * Имена — как во всём проекте). Записи чтения — только на этом устройстве:
 *   `niflaot:reading` = {"<глава>": {best, last — слов в минуту; n — попыток}};
 *   `niflaot:reading-view` = {taamim, big};
 *   `niflaot:reading-times:<глава>` — разметка аудио учителем (начало каждого слова, с).
 */
import { hebrewParts } from './restDays';

export const CHAPTERS = 150;

/** Tehillim for the current day of the Hebrew month. */
export function chapterForDate(iso: string): number {
  return hebrewParts(iso).day;
}

export function dailyChapter(): number {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return chapterForDate(iso);
}

// the site's root, as in src/core/tanakh.ts (not imported from there: it carries the whole cycle)
const up = '..';
const root = () => (import.meta.env.DEV ? import.meta.env.BASE_URL : new URL(up, import.meta.url).href);

export interface ReadingIndex {
  book: string;
  he: string;
  version: { title: string; license: string; source: string };
  /** words in every chapter (through a space and a maqaf, without the paseq) */
  words: number[];
  /** recordings of chapters, when there are: «<глава>» → audio file (from the site's root or a full address) and word start times */
  audio?: Record<string, { src: string; times?: number[]; credit?: { name: string; url: string } }>;
}

let index: Promise<ReadingIndex> | undefined;
const chapters = new Map<number, Promise<string[]>>();

export function loadIndex(): Promise<ReadingIndex> {
  index ??= fetch(`${root()}reading/tehillim/index.json`).then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  });
  index.catch(() => (index = undefined));
  return index;
}

export function loadChapter(c: number): Promise<string[]> {
  let p = chapters.get(c);
  if (!p) {
    p = fetch(`${root()}reading/tehillim/${c}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d: { v: string[] }) => d.v);
    p.catch(() => chapters.delete(c));
    chapters.set(c, p);
  }
  return p;
}

/** the cantillation marks (and meteg, paseq) — off when the reader turns them off */
const TAAMIM = /[֑-ֽ֯׀]/g;
export const stripTaamim = (s: string) => s.replace(TAAMIM, '');

export interface Token {
  /** as written (one chunk between spaces: words joined by a maqaf stay together) */
  s: string;
  /** words in it for counting (0 — the paseq «׀») */
  w: number;
}

/** A verse — chunks between spaces; the words are counted through the maqaf too, as in index.json. */
export function tokens(verse: string): Token[] {
  return verse
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => ({ s, w: s.split('־').filter((x) => /[א-ת]/.test(x)).length }));
}

/** words per minute; null — too short to count (under 5 s) */
export function wpm(words: number, ms: number): number | null {
  if (ms < 5000 || words <= 0) return null;
  return Math.round(words / (ms / 60000));
}

/** faster than this nobody reads aloud — the attempt is not counted */
export const MAX_WPM = 400;

export interface Record_ {
  best: number;
  last: number;
  n: number;
}

const KEY = 'niflaot:reading';
const read = <T,>(k: string, d: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? 'null') ?? d;
  } catch {
    return d;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* private mode */
  }
};

export const records = (): Record<string, Record_> => read(KEY, {});

/** saves an attempt; true — a new record */
export function saveAttempt(c: number, value: number): boolean {
  const all = records();
  const r = all[c];
  const best = !r || value > r.best;
  all[c] = { best: Math.max(value, r?.best ?? 0), last: value, n: (r?.n ?? 0) + 1 };
  write(KEY, all);
  return best;
}

export interface View {
  taamim: boolean;
  big: boolean;
}
export const loadView = (): View => ({ taamim: false, big: false, ...read<Partial<View>>('niflaot:reading-view', {}) });
export const saveView = (v: View) => write('niflaot:reading-view', v);

const TIMES = (c: number) => `niflaot:reading-times:${c}`;
export const markedTimes = (c: number): number[] | null => read<number[] | null>(TIMES(c), null);
export const saveTimes = (c: number, t: number[]) => write(TIMES(c), t);

/**
 * When each token starts in a recording of `duration` s: the marked times (one per counted word-chunk), else an
 * estimate — in proportion to the letters, so a long word takes longer (that is why the highlight may lag or hurry).
 */
export function startTimes(toks: Token[], duration: number, times?: number[] | null): number[] {
  const words = toks.map((x, i) => (x.w ? i : -1)).filter((i) => i >= 0);
  const out = new Array<number>(toks.length).fill(0);
  if (times && times.length === words.length) {
    words.forEach((i, k) => (out[i] = times[k]));
  } else {
    const len = toks.map((x) => (x.w ? x.s.replace(/[^א-ת]/g, '').length + 1 : 0));
    const total = len.reduce((a, b) => a + b, 0) || 1;
    let t = 0;
    toks.forEach((_, i) => {
      out[i] = (t / total) * duration;
      t += len[i];
    });
  }
  // the paseq — at the time of the word before it
  for (let i = 1; i < toks.length; i++) if (!toks[i].w) out[i] = out[i - 1];
  return out;
}
