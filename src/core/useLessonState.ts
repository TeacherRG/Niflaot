import { useCallback, useEffect, useState } from 'react';
import type { Lesson } from '../lessons/types';

export interface StepState {
  tries: number;
  hint: boolean;
  ok: boolean;
  /** picked option indices (choice steps) */
  pick: number[];
  /** answer revealed after running out of tries */
  fail?: boolean;
  pts?: number;
  last?: 'ok' | 'no';
}

export interface GameState {
  /** current riddle index; === riddles.length means the summary screen */
  lvl: number;
  score: number;
  done: number[];
  /** key `${riddle}-${step}` */
  st: Record<string, StepState>;
  /** word cards with letter tiles open, key `${riddle}:${word}` */
  open: Record<string, boolean>;
  time: number[];
  started: boolean[];
  /** shuffled option order per choice step, key `${riddle}-${step}` */
  ord: Record<string, number[]>;
  notes: Record<number, string>;
}

export const MAX_WRONG = { num: 3, ch: 2 } as const;

export const storageKey = (lesson: Lesson) => `niflaot:lesson:${lesson.slug}`;

const shuffle = (n: number) => {
  const a = [...Array(n).keys()];
  for (let j = n - 1; j > 0; j--) {
    const r = Math.floor(Math.random() * (j + 1));
    [a[j], a[r]] = [a[r], a[j]];
  }
  return a;
};

export const stepState = (S: GameState, ri: number, i: number): StepState =>
  S.st[`${ri}-${i}`] ?? { tries: 0, hint: false, ok: false, pick: [] };

/** Returns the mutable step state inside a draft, creating it if needed. */
export const draftStep = (S: GameState, ri: number, i: number): StepState =>
  (S.st[`${ri}-${i}`] ??= { tries: 0, hint: false, ok: false, pick: [] });

function emptyState(lesson: Lesson): GameState {
  const n = lesson.riddles.length;
  return { lvl: 0, score: 0, done: [], st: {}, open: {}, time: Array(n).fill(0), started: [], ord: {}, notes: {} };
}

/** Fills missing fields and pre-generates the option order for every choice step. */
function normalize(lesson: Lesson, raw: Partial<GameState> & Record<string, unknown>): GameState {
  const S = { ...emptyState(lesson), ...raw } as GameState;
  S.open ??= {};
  // old single-file version kept word toggles inside `st` under keys like "w0פרצוף"
  for (const k of Object.keys(S.st)) {
    const v = S.st[k] as unknown;
    if (typeof v === 'boolean') {
      const m = /^w(\d+)(.+)$/.exec(k);
      if (m && v) S.open[`${m[1]}:${m[2]}`] = true;
      delete S.st[k];
    }
  }
  while (S.time.length < lesson.riddles.length) S.time.push(0);
  S.lvl = Math.min(Math.max(0, S.lvl | 0), lesson.riddles.length);
  lesson.riddles.forEach((r, ri) =>
    r.steps.forEach((s, i) => {
      const k = `${ri}-${i}`;
      if (s.t === 'ch' && S.ord[k]?.length !== s.opts.length) S.ord[k] = shuffle(s.opts.length);
    }),
  );
  return S;
}

function load(lesson: Lesson): GameState {
  for (const key of [storageKey(lesson), lesson.legacyStorageKey]) {
    if (!key) continue;
    try {
      const s = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (s && s.st) return normalize(lesson, s);
    } catch {}
  }
  return normalize(lesson, {});
}

export function useLessonState(lesson: Lesson) {
  const [state, setState] = useState(() => load(lesson));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(lesson), JSON.stringify(state));
    } catch {}
  }, [lesson, state]);

  /** Immer-style update: mutate a deep copy of the state. */
  const update = useCallback((fn: (draft: GameState) => void) => {
    setState((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  }, []);

  const reset = useCallback(() => setState(normalize(lesson, {})), [lesson]);

  return [state, update, reset] as const;
}

/** Points for a correct answer: 10 / 5 / 2 by attempt, at most 3 after a hint. */
export function award(x: StepState) {
  let p = [10, 5, 2][x.tries - 1] ?? 0;
  if (x.hint) p = Math.min(p, 3);
  return p;
}
