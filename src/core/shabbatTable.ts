/**
 * «К шабатнему столу» — the Friday sheet of a weekly portion (`#/shabbat-table[/<глава>]`, ShabbatTable.tsx): printed
 * before Shabbat, read aloud at the table. Everything comes from the lessons of the portion, nothing is written for it:
 * riddles of «Знаете ли вы?» for the children (gematria and letter hints, checked by src/core/facts.ts; the answers at
 * the foot of the sheet, upside down), the investigations of «Нифлаот Ребе» (only the question — the answer is the
 * lesson online), «Вопрос к себе» for the teenagers and adults, «Ґораа ле-поаль» of each lesson and the Memo games
 * to print with it. A new lesson gets onto the sheet by itself.
 */
import { LESSONS, PARSHIOT, type Lesson, type ParshaId } from '../lessons';
import { collectFacts, type Fact } from './facts';

/** How many of each kind fit on two pages of A4. */
export const TABLE_LIMITS = { facts: 4, rebbe: 2, reflections: 4 } as const;

export interface TableSheet {
  parsha: ParshaId;
  lessons: Lesson[];
  facts: Fact[];
  /** riddles of «Нифлаот Ребе»: lesson and riddle index (0-based) */
  rebbe: { lesson: Lesson; ri: number }[];
  reflections: { lesson: Lesson; ri: number }[];
  memo: Lesson[];
}

/** Round robin over the lessons, so each teacher gets a turn. */
function interleave<T>(lists: T[][], n: number): T[] {
  const out: T[] = [];
  for (let i = 0; out.length < n && lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length && out.length < n) out.push(l[i]);
  return out;
}

/** The sheet of a portion, or null when it has no lessons. */
export function tableSheet(parsha: ParshaId): TableSheet | null {
  if (!(parsha in PARSHIOT)) return null;
  const lessons = LESSONS.filter((l) => l.parsha === parsha);
  if (!lessons.length) return null;
  const facts = interleave(
    lessons.filter((l) => l.kind !== 'sicha').map((l) => collectFacts([l])),
    TABLE_LIMITS.facts,
  );
  // every other riddle of «Нифлаот Ребе»: the next riddle of a talk goes on from the one before it
  const rebbe = interleave(
    lessons
      .filter((l) => l.series === 'rebbe')
      .map((l) => l.riddles.map((_, ri) => ({ lesson: l, ri })).filter((_, ri) => ri % 2 === 0)),
    TABLE_LIMITS.rebbe,
  );
  const reflections = interleave(
    lessons.map((l) => l.riddles.map((_, ri) => ({ lesson: l, ri }))),
    TABLE_LIMITS.reflections,
  );
  return { parsha, lessons, facts, rebbe, reflections, memo: lessons.filter((l) => l.memo) };
}
