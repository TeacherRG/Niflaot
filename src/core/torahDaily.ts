/**
 * «Тора на каждый день» — the lessons of the week's portion (Baal HaTurim and the Rebbe's talk) learnt day by day, from Sunday
 * to Friday (owner, 03.11.2026: «перевести на ежедневное изучение с воскресенья по пятницу»), like the Chumash of Chitas.
 * A chapter = a riddle of the lesson. Baal HaTurim's chapters go from Sunday on, the Rebbe's end on Friday, both spread
 * evenly over the six days, so every day has something; a day left without a new chapter — the review of the lesson (Memo,
 * the cards). On Friday — also «К шабатнему столу». Shabbat — no new chapter.
 *
 * «Я прочитал(а) главу» — localStorage `niflaot:torah-done` = { `${slug}:${chapter index}`: time of the mark in s, a removed
 * mark — negative }, synced with the account (src/core/sync.ts, merged like `tanakh-done`). A chapter is also done when its
 * riddle is solved in the game or its «Проверь себя» questions are all answered.
 */
import { useEffect, useState } from 'react';
import { LESSON_GROUPS, cardsOnly, weekParsha, type Lesson } from '../lessons';
import { readQuestions, readStore, type ReadStore } from './readCheck';
import { markStudied, todayIso } from './habit';

export const STUDY_DAYS = 6;
/** Memo pairs of Baal HaTurim on a day without his chapter */
export const MAX_PAIRS = 3;
export const TORAH_DONE_KEY = 'niflaot:torah-done';
const EVENT = 'niflaot:torah-done';

export type Group = (typeof LESSON_GROUPS)[number];
export type DayPart =
  | { kind: 'chapter'; lesson: Lesson; ri: number }
  /** Baal HaTurim on a day without his chapter: pairs of the lesson's Memo (0-based) — his comments with the gematria and «Чему это учит?» */
  | { kind: 'pairs'; lesson: Lesson; pairs: number[] }
  /** a day without a new chapter of the lesson: its review (Memo, the cards, or the lesson again) */
  | { kind: 'review'; lesson: Lesson }
  /** Friday: the sheet for the Shabbat table */
  | { kind: 'table' };

/** The day (0 — Sunday … 5 — Friday) of chapter i of n: from Sunday on (`front`) or ending on Friday. */
export function dayOf(i: number, n: number, front: boolean): number {
  return front ? Math.floor((i * STUDY_DAYS) / n) : STUDY_DAYS - 1 - Math.floor(((n - 1 - i) * STUDY_DAYS) / n);
}

/** The week's plan of a portion: six days, each with its parts (chapters of each lesson in order). */
export function weekPlan(g: Group): DayPart[][] {
  const days: DayPart[][] = Array.from({ length: STUDY_DAYS }, () => []);
  const place = (l: Lesson, front: boolean) => {
    const n = cardsOnly(l) ? 0 : l.riddles.length;
    for (let i = 0; i < n; i++) days[dayOf(i, n, front)].push({ kind: 'chapter', lesson: l, ri: i });
  };
  g.lessons.forEach((l) => place(l, true));
  g.rebbe.forEach((l) => place(l, false));
  // Baal HaTurim every day (owner, 03.11.2026): a day without his chapter gets pairs of his Memo — first the comments the chapters
  // do not quote (new to the reader), else the pairs in order; up to MAX_PAIRS a day
  for (const l of g.lessons) {
    if (!l.memo) continue;
    const gaps = days.map((d, k) => (d.some((p) => p.kind === 'chapter' && p.lesson === l) ? -1 : k)).filter((k) => k >= 0);
    if (!gaps.length) continue;
    const quoted = new Set(l.riddles.flatMap((r) => [...(r.sources ?? []), ...(r.quotes ?? []).flat().map((q) => q.split(':')[0])]));
    const all = l.memo.items.map((_, i) => i);
    const fresh = all.filter((i) => !quoted.has(l.memo!.items[i].source));
    const pool = fresh.length >= gaps.length ? fresh : all;
    const per = Math.min(MAX_PAIRS, Math.ceil(pool.length / gaps.length));
    gaps.forEach((k, j) => {
      const pairs = pool.slice(j * per, (j + 1) * per);
      if (pairs.length) days[k].push({ kind: 'pairs', lesson: l, pairs });
    });
  }
  // in a day: Baal HaTurim first, then the Rebbe
  const rank = (p: DayPart) => (p.kind === 'table' ? 3 : p.kind === 'review' ? 2 : g.lessons.includes(p.lesson) ? 0 : 1);
  days.forEach((d) => d.sort((a, b) => rank(a) - rank(b)));
  // a day without a new chapter — the review of a lesson that has a game to repeat (Memo, the cards), else the first lesson
  const all = [...g.lessons, ...g.rebbe];
  const review = all.find((l) => l.memo) ?? all.find((l) => l.cards) ?? all[0];
  days.forEach((d) => {
    if (!d.length && review) d.push({ kind: 'review', lesson: review });
  });
  days[STUDY_DAYS - 1].push({ kind: 'table' });
  return days;
}

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
/** The civil date of day k (0 — Sunday) of the portion's week; 6 — its Shabbat. */
export const dayDate = (g: Group, k: number) => addDays(g.shabbat, k - 6);

/**
 * The day of the week's study for a date: 0–5 — Sunday…Friday of the portion's week, 6 — its Shabbat, -1 — before that week
 * (the lessons are already up), 7 — after it (no newer portion yet).
 */
export function studyDay(g: Group, date: string): number {
  if (date > g.shabbat) return 7;
  const sunday = dayDate(g, 0);
  if (date < sunday) return -1;
  return Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${sunday}T12:00:00Z`)) / 86400000);
}

export type DoneStore = Record<string, number>;

export function readTorahDone(): DoneStore {
  try {
    const s = JSON.parse(localStorage.getItem(TORAH_DONE_KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}

export function setTorahDone(slug: string, ri: number, on: boolean) {
  const s = readTorahDone();
  const now = Math.floor(Date.now() / 1000);
  s[`${slug}:${ri}`] = on ? now : -now;
  try {
    localStorage.setItem(TORAH_DONE_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (on) markStudied();
}

/** The riddles solved in the game (the lesson state in localStorage). */
function solved(l: Lesson): number[] {
  for (const key of [`niflaot:lesson:${l.slug}`, l.legacyStorageKey]) {
    if (!key) continue;
    try {
      const s = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (s && Array.isArray(s.done)) return s.done;
    } catch {}
  }
  return [];
}

/** Only the mark «Я прочитал(а) главу» (the checkbox). */
export const isMarked = (s: DoneStore, slug: string, ri: number) => (s[`${slug}:${ri}`] ?? 0) > 0;

/** A chapter is done: marked as read, or its riddle solved, or all its «Проверь себя» questions answered. */
export function chapterDone(l: Lesson, ri: number, s: DoneStore = readTorahDone(), read: ReadStore = readStore()): boolean {
  if (isMarked(s, l.slug, ri) || solved(l).includes(ri)) return true;
  const qs = readQuestions(l).filter((q) => q.ri === ri);
  const answered = read[l.slug] ?? {};
  return qs.length > 0 && qs.every((q) => q.key in answered);
}

export const partDone = (p: DayPart, s?: DoneStore, read?: ReadStore) => p.kind === 'chapter' && chapterDone(p.lesson, p.ri, s, read);

export interface TorahToday {
  group: Group;
  plan: DayPart[][];
  /** see `studyDay` */
  day: number;
  /** the day to show as today's: the day itself (Sunday…Friday); before the week — Sunday; on Shabbat and after the week —
   *  the first day with a chapter not done yet (-1 — all done) */
  show: number;
  /** today's chapters (the parts to count) and how many are done */
  chapters: Extract<DayPart, { kind: 'chapter' }>[];
  /** today's Memo pairs of Baal HaTurim (a day without his chapter) */
  pairs: Extract<DayPart, { kind: 'pairs' }>[];
  done: number;
}

export function torahToday(date = todayIso(), s: DoneStore = readTorahDone(), read: ReadStore = readStore()): TorahToday | undefined {
  const id = weekParsha(date);
  const group = LESSON_GROUPS.find((g) => g.id === id);
  if (!group) return undefined;
  const plan = weekPlan(group);
  const day = studyDay(group, date);
  const isCh = (p: DayPart): p is Extract<DayPart, { kind: 'chapter' }> => p.kind === 'chapter';
  const show = day >= 0 && day < STUDY_DAYS ? day : day < 0 ? 0 : plan.findIndex((d) => d.some((p) => isCh(p) && !partDone(p, s, read)));
  const chapters = show >= 0 ? plan[show].filter(isCh) : [];
  const pairs = show >= 0 ? plan[show].filter((p): p is Extract<DayPart, { kind: 'pairs' }> => p.kind === 'pairs') : [];
  return { group, plan, day, show, chapters, pairs, done: chapters.filter((p) => partDone(p, s, read)).length };
}

/** Where a part opens: the chapter — in «Читать» (adults; children — the riddle in the game), the review — its game. */
export function partHref(p: DayPart, adults: boolean): string {
  if (p.kind === 'table') return '#/shabbat-table';
  const l = p.lesson;
  if (p.kind === 'pairs') return `#/${l.slug}/memo/${p.pairs[0] + 1}`;
  if (p.kind === 'review') return adults ? `#/${l.slug}/read` : l.memo ? `#/${l.slug}/memo` : l.cards ? `#/${l.slug}/cards` : `#/${l.slug}`;
  return adults ? `#/${l.slug}/read/${p.ri + 1}` : `#/${l.slug}/r/${p.ri + 1}`;
}

/** The plan's day of a chapter (0 — Sunday …), -1 when the lesson is not in a week's plan. */
export function chapterDay(l: Lesson, ri: number): number {
  const g = LESSON_GROUPS.find((x) => x.id === l.parsha);
  if (!g) return -1;
  return weekPlan(g).findIndex((d) => d.some((p) => p.kind === 'chapter' && p.lesson === l && p.ri === ri));
}

/** The marks — and updates when the checkbox changes them (this page) or the account brings them (another tab). */
export function useTorahDone(): DoneStore {
  const [s, set] = useState(readTorahDone);
  useEffect(() => {
    const on = () => set(readTorahDone());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

/** The weekday's name in the site's language («воскресенье», «Sunday»). */
export const weekdayName = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

/** A date without the year («3 ноября», «November 3»). */
export const dayMonth = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
