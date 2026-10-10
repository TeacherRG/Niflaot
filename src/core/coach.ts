/**
 * Coach module — step-by-step help for one concrete calculation, usable anywhere
 * (riddle hints, the gematria calculator, the mental-math trainer).
 *
 * Pass numbers or Hebrew words — never pre-written arithmetic strings:
 *   [{ word: 'היתה' }]                                  → ה 5 + י 10 + ת 400 + ה 5
 *   [{ word: 'מקוה' }, { word: 'קו' }, { word: 'תקוה' },
 *    { add: ['$1', '$2', '$3'] }, { div: ['$4', 3] }]    → average of three words
 *   [{ div: [3068, 52] }]                               → division by chunks
 *   [{ word: 'שרה', method: 'atbash' }]               → בגצ: ב 2 + ג 3 + צ 90 (another way of counting, docs/GEMATRIA-RULES.md)
 *   [{ word: 'שפה אחת' }, { add: ['$1', 1] }]           → «с колелем»: the word itself counts as one more
 * '$k' stands for the result of the k-th action (1-based).
 */
import { letters } from './gematria';
import { SWAPS, letterValue, swapLetter, swapWord, type Method } from './gematriaMethods';
import { SIGN, type Expr } from './mentalMath';

export type CoachNum = number | `$${number}`;
export type CoachAction =
  | { word: string; method?: Method }
  | { add: CoachNum[] }
  | { sub: [CoachNum, CoachNum] }
  | { mul: [CoachNum, CoachNum] }
  | { div: [CoachNum, CoachNum] };

export interface CoachPart {
  /** the Hebrew word (or phrase) when the action is a gematria sum */
  word?: string;
  /** the method of counting, when not the usual one */
  method?: Method;
  /** for a swapping method (א״ת ב״ש…) — the rewritten word, whose letters are counted */
  swapped?: string;
  /** its letters with values (for a swapping method — the new letters) */
  letters?: [string, number][];
  expr: Expr;
  result: number;
}

const compute = (e: Expr) =>
  e.op === 'add'
    ? e.terms.reduce((x, y) => x + y, 0)
    : e.op === 'sub'
      ? e.terms[0] - e.terms[1]
      : e.op === 'mul'
        ? e.terms[0] * e.terms[1]
        : e.terms[0] / e.terms[1];

/** Resolves '$k' references, spells words into letter values and computes every action. */
export function buildCoach(actions: CoachAction[]): CoachPart[] {
  const parts: CoachPart[] = [];
  const num = (n: CoachNum) => {
    if (typeof n === 'number') return n;
    const v = parts[Number(n.slice(1)) - 1]?.result;
    if (v === undefined) throw new Error(`coach: ${n} refers to a later or missing action`);
    return v;
  };
  for (const a of actions) {
    let part: CoachPart;
    if ('word' in a) {
      const m = a.method ?? 'standard';
      const ls = letters(a.word).map(
        (c) => [SWAPS.has(m) ? swapLetter(m as 'atbash' | 'albam', c) : c, letterValue(m, c)] as [string, number],
      );
      const terms = ls.map(([, v]) => v);
      part = { word: a.word, ...(a.method && a.method !== 'standard' ? { method: a.method } : {}), ...(SWAPS.has(m) ? { swapped: swapWord(m, a.word) } : {}), letters: ls, expr: { op: 'add', terms, text: terms.join(' + ') }, result: 0 };
    } else {
      const op = Object.keys(a)[0] as 'add' | 'sub' | 'mul' | 'div';
      const terms = (a as Record<string, CoachNum[]>)[op].map(num);
      if (op === 'div' && terms[0] % terms[1] !== 0) throw new Error(`coach: ${terms[0]} : ${terms[1]} is not whole`);
      if (op === 'sub' && terms[0] < terms[1]) throw new Error(`coach: ${terms[0]} − ${terms[1]} is negative`);
      part = { expr: { op, terms, text: terms.join(` ${SIGN[op]} `) }, result: 0 };
    }
    part.result = compute(part.expr);
    parts.push(part);
  }
  return parts;
}

/** Final result of a coach (used to check lesson data: it must equal the step's answer). */
export const coachResult = (actions: CoachAction[]) => buildCoach(actions).at(-1)!.result;
