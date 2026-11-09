/**
 * «Бааль ґа-Турим на каждый день» — урок-комментарий, прочитанный за неделю главы, как отрывок дня Пророков и Писаний:
 * по два комментария в день с воскресенья по пятницу. У урока с `Lesson.daily` (Толдот и дальше) — его 12 пунктов с полными
 * комментариями и объяснениями; у прежних уроков — 12 пар Memo по порядку стихов (слова Бааль ґа-Турима из пары, её перевод,
 * объяснение и «Чему это учит?»), стих — `torah-<глава>-<стих>` (scripts/fetch-sources.py). День N (1 — воскресенье … 6 — пятница) —
 * `#/<slug>/day/N`, сегодняшний — `#/turim`. Дата дня — от Шабата главы (`PARSHIOT[…].shabbat`): воскресенье = Шабат − 6.
 * «Я прочитал(а)» — `niflaot:turim-done` = { `<slug>:<N>`: время отметки, с (снятая — со знаком минус) },
 * синхронизируется с аккаунтом (src/core/sync.ts), день отметки — день серии учёбы (src/core/habit.ts).
 */
import { useCallback, useEffect, useState } from 'react';
import { LESSONS, PARSHIOT } from '../lessons';
import type { Lesson } from '../lessons/types';
import { markStudied } from './habit';
import { addDays } from './restDays';

export const TURIM_DAYS = 6;
export const PER_DAY = 2;

export interface TurimDay {
  lesson: Lesson;
  /** 1 — воскресенье … 6 — пятница */
  n: number;
  /** YYYY-MM-DD */
  date: string;
}

/** The date of day n (1–6) of a lesson: Sunday … Friday of its portion's week. */
export const turimDate = (lesson: Lesson, n: number) => addDays(PARSHIOT[lesson.parsha].shabbat, n - 7);

/**
 * One comment of a day: the verse (id in sefaria.json) and either the commentator's passages (`quotes`, with the lesson's
 * explanation `text` — index in `LessonText.daily.items`) or a Memo pair (`memo` — its index: its Hebrew words, translation and explanation).
 */
export interface DayEntry {
  verse: string;
  /** chapter:verse */
  ref: string;
  quotes?: string[];
  text?: number;
  memo?: number;
}

/** chapter and verse of a Baal HaTurim source id: 'bht-24-60-1' → [24, 60] */
const cv = (id: string) => id.split('-').slice(1, 3).map(Number) as [number, number];

/** The 12 comments of a lesson, in order: its own `daily`, else its Memo pairs in the order of the verses. */
export function dailyEntries(lesson: Lesson): DayEntry[] {
  if (lesson.daily?.length)
    return lesson.daily.map((d, k) => {
      const [c, v] = cv(d.quotes[0].split(':')[0]);
      return { verse: d.verse, ref: `${c}:${v}`, quotes: d.quotes, text: k };
    });
  if (lesson.kind !== 'commentary' || lesson.memo?.items.length !== TURIM_DAYS * PER_DAY) return [];
  return lesson.memo.items
    .map((it, k) => ({ k, cv: cv(it.source) }))
    .sort((a, b) => a.cv[0] - b.cv[0] || a.cv[1] - b.cv[1] || a.k - b.k)
    .map(({ k, cv: [c, v] }) => ({ verse: `torah-${c}-${v}`, ref: `${c}:${v}`, memo: k }));
}

/** The lesson is read day by day (a commentary lesson with its own `daily` or 12 Memo pairs). */
export const hasDaily = (lesson: Lesson) => dailyEntries(lesson).length === TURIM_DAYS * PER_DAY;

/** All days of all lessons read day by day, in order of date. */
export function turimDays(): TurimDay[] {
  return LESSONS.filter(hasDaily)
    .flatMap((lesson) => Array.from({ length: TURIM_DAYS }, (_, k) => ({ lesson, n: k + 1, date: turimDate(lesson, k + 1) })))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The comments of day n (two). */
export const dayEntries = (lesson: Lesson, n: number) => dailyEntries(lesson).slice((n - 1) * PER_DAY, n * PER_DAY);

/** The lesson of the week of a portion read day by day. */
export const parshaDaily = (parsha: string) => LESSONS.find((l) => l.parsha === parsha && hasDaily(l));

/**
 * The day to open for a date: that very day; on Shabbat or between portions — the next day ahead
 * (on Shabbat the site rests anyway), after the last — the last one.
 */
export function turimDayFor(today: string): TurimDay | undefined {
  const all = turimDays();
  return all.find((d) => d.date === today) ?? all.find((d) => d.date > today) ?? all[all.length - 1];
}

export const doneKey = (lesson: Lesson, n: number) => `${lesson.slug}:${n}`;

const KEY = 'niflaot:turim-done';
const EVENT = 'niflaot:turim-done';

export function readTurimDone(): Record<string, number> {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}

export const turimIsDone = (s: Record<string, number>, key: string) => (s[key] ?? 0) > 0;

/** «Я прочитал(а)» of the days — and the update when the check (this page) or the account (another tab) changes them. */
export function useTurimDone(): [Record<string, number>, (key: string, on: boolean) => void] {
  const [s, set] = useState(readTurimDone);
  useEffect(() => {
    const on = () => set(readTurimDone());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  const mark = useCallback((key: string, on: boolean) => {
    const x = readTurimDone();
    const now = Math.floor(Date.now() / 1000);
    x[key] = on ? now : -now;
    try {
      localStorage.setItem(KEY, JSON.stringify(x));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
    if (on) markStudied();
  }, []);
  return [s, mark];
}
