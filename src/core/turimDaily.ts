/**
 * «Бааль ґа-Турим на каждый день» — урок-комментарий, прочитанный за неделю главы, как отрывок дня Пророков и Писаний:
 * по два комментария в день с воскресенья по пятницу (`Lesson.daily`, 12). День N (1 — воскресенье … 6 — пятница) —
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

/** All days of all lessons read day by day, in order of date. */
export function turimDays(): TurimDay[] {
  return LESSONS.filter((l) => l.daily?.length)
    .flatMap((lesson) => Array.from({ length: TURIM_DAYS }, (_, k) => ({ lesson, n: k + 1, date: turimDate(lesson, k + 1) })))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The items of day n (two comments). */
export const dayItems = (lesson: Lesson, n: number) => (lesson.daily ?? []).slice((n - 1) * PER_DAY, n * PER_DAY);

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
