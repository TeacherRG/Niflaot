/**
 * «Святое чтение» — ежедневная порция Теґилим по еврейскому числу месяца (`#/reading[/day/<число>]`).
 * `#/reading/<глава>` остаётся прямым чтением одной главы, `#/reading/haazinu` — «Песнь Аазину» (Дварим 32).
 * Текст — public/reading/tehillim/<глава>.json (`python3 scripts/fetch-reading.py`: огласовки и знаки кантилляции, кери,
 * Имена — как во всём проекте). «Песнь Аазину» — public/reading/torah/haazinu.json (Sefaria, Deuteronomy 32).
 * Записи чтения — только на этом устройстве:
 *   `niflaot:reading` = {"<ключ чтения>": {best, last — слов в минуту; n — попыток}};
 *   `niflaot:reading-view` = {taamim, big};
 *   `niflaot:reading-times:<ключ чтения>` — разметка аудио учителем (начало каждого слова, с).
 */
import { addDays, hebrewParts } from './restDays';

export const CHAPTERS = 150;

export interface PsalmPortion {
  chapter: number;
  fromVerse?: number;
  toVerse?: number;
}

export interface PsalmAudioTrack {
  chapter: number;
  src: string;
  markId: string;
}

export interface PersonalPsalm {
  chapter: number;
  name: string;
}

const PERSONAL_PSALMS_KEY = 'niflaot:reading-my-psalms';

export function personalPsalms(): PersonalPsalm[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(PERSONAL_PSALMS_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item): item is PersonalPsalm =>
        item !== null &&
        typeof item === 'object' &&
        Number.isInteger(item.chapter) &&
        item.chapter >= 1 &&
        item.chapter <= CHAPTERS &&
        typeof item.name === 'string',
    );
  } catch {
    return [];
  }
}

export function savePersonalPsalms(psalms: PersonalPsalm[]): boolean {
  try {
    localStorage.setItem(PERSONAL_PSALMS_KEY, JSON.stringify(psalms));
    return true;
  } catch {
    return false;
  }
}

const WEEKLY_PORTIONS: [number, number][] = [
  [1, 29],
  [30, 50],
  [51, 72],
  [73, 89],
  [90, 106],
  [107, 119],
  [120, 150],
];

export function weekdayPsalms(iso: string): number[] {
  const date = new Date(`${iso}T12:00:00`);
  const [from, to] = WEEKLY_PORTIONS[date.getDay()];
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/** день недели (1 — воскресенье … 7 — Шабат) для даты */
export const weekdayOf = (iso: string) => new Date(`${iso}T12:00:00`).getDay() + 1;

/** порция Теґилим по дням недели: 1 — воскресенье (1–29) … 7 — Шабат (120–150) */
export function weekdayPortion(n: number): PsalmPortion[] {
  const p = WEEKLY_PORTIONS[n - 1];
  return p ? splitLong(psalms(p[0], p[1])) : [];
}

/** глава 119 целиком — две записи (119.mp3 — стихи 1–96, 119.2.mp3 — 97–176), поэтому и две части текста */
export const splitLong = (ps: PsalmPortion[]): PsalmPortion[] =>
  ps.flatMap((p) =>
    p.chapter === 119 && p.fromVerse === undefined
      ? [{ chapter: 119, fromVerse: 1, toVerse: 96 }, { chapter: 119, fromVerse: 97, toVerse: 176 }]
      : [p],
  );

const psalms = (from: number, to: number): PsalmPortion[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ chapter: from + i }));

const MONTHLY_PORTIONS: PsalmPortion[][] = [
  psalms(1, 9), psalms(10, 17), psalms(18, 22), psalms(23, 28), psalms(29, 34),
  psalms(35, 38), psalms(39, 43), psalms(44, 48), psalms(49, 54), psalms(55, 59),
  psalms(60, 65), psalms(66, 68), psalms(69, 71), psalms(72, 76), psalms(77, 78),
  psalms(79, 82), psalms(83, 87), psalms(88, 89), psalms(90, 96), psalms(97, 103),
  psalms(104, 105), psalms(106, 107), psalms(108, 112), psalms(113, 118),
  [{ chapter: 119, fromVerse: 1, toVerse: 96 }],
  [{ chapter: 119, fromVerse: 97, toVerse: 176 }],
  psalms(120, 134), psalms(135, 139), psalms(140, 144), psalms(145, 150),
];

export function dailyPortion(day: number, combineLastDay = false): PsalmPortion[] {
  if (!Number.isInteger(day) || day < 1 || day > MONTHLY_PORTIONS.length) return [];
  const portion = MONTHLY_PORTIONS[day - 1];
  if (day === 29 && combineLastDay) return [...portion, ...MONTHLY_PORTIONS[29]].map((p) => ({ ...p }));
  return portion.map((p) => ({ ...p }));
}

/** Chapter recordings in public/reading/Audio — one per chapter (1–150), chapter 119 in two parts. */
export function chapterAudioTracks(portions: PsalmPortion[], readingId: ReadingId): PsalmAudioTrack[] {
  if (!portions.length || portions.some(({ chapter }) => chapter < 1 || chapter > CHAPTERS)) return [];
  return portions.map((portion) => {
    const secondHalf = portion.chapter === 119 && (portion.fromVerse ?? 1) > 96;
    const suffix = secondHalf ? '.2' : '';
    const part = portion.fromVerse ? `-${portion.fromVerse}` : '';
    return {
      chapter: portion.chapter,
      src: `reading/Audio/${portion.chapter}${suffix}.mp3`,
      markId: `${readingId}-${portion.chapter}${part}`,
    };
  });
}

/** Whether the current Hebrew month has 29 days, using the browser's Hebrew calendar. */
export function shortHebrewMonth(iso: string): boolean {
  const current = hebrewParts(iso);
  for (let offset = 1; offset <= 30; offset++) {
    const next = hebrewParts(addDays(iso, offset));
    if (next.year !== current.year || next.month !== current.month) return current.day + offset - 1 === 29;
  }
  return false;
}

/** Tehillim for the current day of the Hebrew month. */
export function hebrewDayForDate(iso: string): number {
  return hebrewParts(iso).day;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const currentHebrewDay = () => hebrewDayForDate(todayISO());

// the site's root, as in src/core/tanakh.ts (not imported from there: it carries the whole cycle)
const up = '..';
const root = () => (import.meta.env.DEV ? import.meta.env.BASE_URL : new URL(up, import.meta.url).href);

export interface ReadingIndex {
  book: string;
  he: string;
  version: { title: string; license: string; source: string };
  /** words in every chapter (through a space and a maqaf, without the paseq) */
  words: number[];
}

export interface HaazinuText {
  book: string;
  chapter: number;
  he: string;
  source: string;
  v: string[];
}

let index: Promise<ReadingIndex> | undefined;
let haazinu: Promise<HaazinuText> | undefined;
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

export function loadHaazinu(): Promise<HaazinuText> {
  haazinu ??= fetch(`${root()}reading/torah/haazinu.json`).then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  });
  haazinu.catch(() => (haazinu = undefined));
  return haazinu;
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
export type ReadingId = number | string;

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
export function saveAttempt(c: ReadingId, value: number): boolean {
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

const TIMES = (c: ReadingId) => `niflaot:reading-times:${c}`;
export const markedTimes = (c: ReadingId): number[] | null => read<number[] | null>(TIMES(c), null);
export const saveTimes = (c: ReadingId, t: number[]) => write(TIMES(c), t);

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
