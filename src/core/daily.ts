/**
 * «Гиматрия дня» (#/daily): every day one word of the lessons — the player adds the values of its letters in the
 * head, in up to three tries, and shares the result without the answer (🟥🟩 · 0:42), like Wordle.
 * The words are the Hebrew of the «Знаете ли вы?» facts (checked, with a translation in every language and a place
 * in a lesson). Everyone gets the same word on the same (local) date; a new lesson adds words to the cycle by itself.
 */
import { gematria, letters } from './gematria';
import { plainWord } from './letterPuzzle';
import { displayNames } from './names';
import { collectFacts, factHebrew } from './facts';
import type { Lesson } from '../lessons/types';

/** the date of «Гиматрия дня №1» */
export const DAILY_START = '2026-10-11';
export const MAX_TRIES = 3;

export interface DailyWord {
  he: string;
  v: number;
  lesson: Lesson;
  /** riddle (0-based) that explains the word, else the Memo pair */
  ri?: number;
  mi?: number;
}

const hash = (s: string) => {
  let h = 5381;
  for (const c of s) h = ((h * 33) ^ c.codePointAt(0)!) >>> 0;
  return h;
};

/** All words of the game in a fixed order (by a hash of the word: a new word doesn't move the others much). */
export function dailyPool(lessons: Lesson[]): DailyWord[] {
  const seen = new Set<string>();
  const out: DailyWord[] = [];
  for (const f of collectFacts(lessons))
    for (const he of factHebrew(f)) {
      const key = plainWord(he);
      // a Name of G-d is shown changed (אלקים) — its letters on screen would not add up to its value
      if (seen.has(key) || letters(he).length < 2 || displayNames(he) !== he) continue;
      seen.add(key);
      out.push({ he, v: gematria(he), lesson: f.lesson, ri: f.ri, mi: f.mi });
    }
  return out.sort((a, b) => hash(plainWord(a.he)) - hash(plainWord(b.he)) || (a.he < b.he ? -1 : 1));
}

const dayIndex = (d: Date) => Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.parse(DAILY_START)) / 864e5);

/** Number of the day's word (№1 on DAILY_START) by the device's own date. */
export const dailyNumber = (d = new Date()) => dayIndex(d) + 1;

export const dailyWord = (pool: DailyWord[], n: number) => pool[(((n - 1) % pool.length) + pool.length) % pool.length];

/* ───── the player's results, in this browser ───── */

export interface DailyResult {
  /** the wrong answers, in order */
  wrong: number[];
  hint?: boolean;
  /** when the player started counting (first keystroke) and finished */
  start?: number;
  end?: number;
  done?: 'win' | 'lose';
}

const KEY = 'niflaot:daily';

export function loadResults(): Record<number, DailyResult> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

export function saveResult(n: number, r: DailyResult) {
  try {
    const all = loadResults();
    all[n] = r;
    // keep a year of days
    for (const k of Object.keys(all)) if (Number(k) < n - 366) delete all[Number(k)];
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

/** Days solved in a row up to today (or yesterday, while today is not played yet); Shabbat doesn't break it. */
export function streak(all: Record<number, DailyResult>, today: number, now = new Date()) {
  let n = all[today]?.done === 'win' ? today : today - 1;
  let count = 0;
  for (;;) {
    const d = new Date(now);
    d.setDate(d.getDate() - (today - n));
    if (all[n]?.done === 'win') count++;
    else if (d.getDay() !== 6) break; // the site rests on Shabbat: a missed Saturday is no break
    n--;
    if (n < today - 400) break;
  }
  return count;
}

/** 🟥🟥🟩 — wrong tries, then 🟩 (no hint) / 🟨 (with the letter values) */
export const grid = (r: DailyResult) =>
  '🟥'.repeat(r.wrong.length) + (r.done === 'win' ? (r.hint ? '🟨' : '🟩') : '');
