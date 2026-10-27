/**
 * «Проверь себя» — the questions on the reading pages, so that a reader who doesn't play can earn the Torah
 * certificate of «Академия» too (src/core/academy.ts, `torahProgress`).
 *
 * Nothing new is written for them — they come from the lesson data, already checked by `npm run check`:
 * - a Baal HaTurim lesson («Читать», ReadPage.tsx): the choice steps of every riddle (`t: 'ch'`) — which word or
 *   phrase the commentator found; the answer is in the text of the chapter, no counting needed;
 * - a «Нифлаот Ребе» lesson («Прочитать», CardsReadPage.tsx): for every pair — «к какому стиху это объяснение?»:
 *   the Rebbe's explanation and four verses of the lesson's cards (the right one and three others);
 *   a «Нифлаот Ребе» lesson without cards yet — the choice steps of its investigation, collected at the end of «Беседа».
 *
 * Each question is answered once (like «Вопросы к отрывку»). Answers: localStorage `niflaot:torah-read`
 * = { [slug]: { [question key]: picked option } }, synced with the account (src/core/sync.ts).
 */
import type { Lesson } from '../lessons/types';
import { markStudied } from './habit';

export const READ_KEY = 'niflaot:torah-read';

export interface ReadQuestion {
  /** stable within the lesson: `r<riddle>s<step>` or `c<card>` */
  key: string;
  /** the riddle (chapter) a commentary question belongs to */
  ri?: number;
  /** the step of that riddle */
  si?: number;
  /** the card a «Нифлаот Ребе» question is about */
  card?: number;
  /** the options in the order shown: cards (a card question) or the step's options (a commentary question) */
  opts: number[];
  /** index of the right option in `opts` (a pick is saved as this index) */
  c: number;
}

/** A fixed shuffle of 0…n-1 from a string — the same on every device, so a saved pick keeps its meaning. */
function fixedOrder(n: number, seed: string): number[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const next = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 2 ** 32;
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Card k and three other cards spread over the lesson, in a fixed shuffled order. */
function cardOptions(slug: string, k: number, n: number): { opts: number[]; c: number } {
  const cards = [k, ...[1, 4, 7].map((d) => (k + d) % n)];
  const opts = fixedOrder(cards.length, `${slug}:c${k}`).map((i) => cards[i]);
  return { opts, c: opts.indexOf(k) };
}

/** The questions of a lesson's reading page; none when the lesson has nothing to ask. */
export function readQuestions(lesson: Lesson): ReadQuestion[] {
  if (lesson.cards) {
    const n = lesson.cards.items.length;
    if (n < 4) return [];
    return lesson.cards.items.map((_, k) => ({ key: `c${k}`, card: k, ...cardOptions(lesson.slug, k, n) }));
  }
  // a «Нифлаот Ребе» lesson without cards asks the choice steps of its investigation, like a gematria lesson
  const out: ReadQuestion[] = [];
  lesson.riddles.forEach((r, ri) =>
    r.steps.forEach((s, si) => {
      if (s.t !== 'ch') return;
      // the data keeps the right option first; on the page — a fixed shuffle
      const opts = fixedOrder(s.opts.length, `${lesson.slug}:r${ri}s${si}`);
      out.push({ key: `r${ri}s${si}`, ri, si, opts, c: opts.indexOf(s.c) });
    }),
  );
  return out;
}

export type ReadStore = Record<string, Record<string, number>>;

export function readStore(): ReadStore {
  try {
    const v = JSON.parse(localStorage.getItem(READ_KEY) ?? '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

const listeners = new Set<() => void>();
export const subscribeRead = (f: () => void) => {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
};

/** Keep the first answer of a question (it is answered once). */
export function answerRead(slug: string, key: string, pick: number) {
  const store = readStore();
  if (store[slug]?.[key] !== undefined) return;
  store[slug] = { ...store[slug], [key]: pick };
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(store));
  } catch {}
  markStudied();
  listeners.forEach((f) => f());
}

/** A lesson's reading check: questions answered, right answers, questions. */
export function readScore(lesson: Lesson, store: ReadStore = readStore()) {
  const qs = readQuestions(lesson);
  const a = store[lesson.slug] ?? {};
  let done = 0;
  let got = 0;
  for (const q of qs)
    if (a[q.key] !== undefined) {
      done++;
      if (a[q.key] === q.c) got++;
    }
  return { done, got, n: qs.length };
}
