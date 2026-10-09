/**
 * «Знаете ли вы?» — a feed of every equality and letter hint of the lessons, without explanations:
 * a question («чему равно …?», «какое слово спрятано …?»), the answer on a tap and links to the lesson.
 * Everything is taken from the lesson data and checked here by code: an equation of a riddle is used only when
 * every part of it is a Hebrew word (its gematria) or a plain sum of numbers and all parts are equal;
 * letter hints come from the checked «Собери слово» steps and Memo pairs. A new lesson gets into the feed by itself.
 */
import { gematria, letters } from './gematria';
import { asWord, letterStepError, plainWord } from './letterPuzzle';
import { displayNames } from './names';
import type { Lesson } from '../lessons/types';

export type Take = 'first' | 'last' | 'all';

/** Where the fact is in the lesson (0-based): the riddle that explains it and / or the Memo pair. */
export interface Place {
  ri?: number;
  mi?: number;
}

export type Fact =
  | ({
      kind: 'eq';
      /** id for the page (anchor, React key) */
      id: string;
      lesson: Lesson;
      /** the Hebrew the question is about, e.g. 'פרצוף + גאוה' */
      q: string;
      /** the other parts of the equality in their order: Hebrew, numbers or sums of numbers */
      rest: string[];
      v: number;
    } & Place)
  | ({
      kind: 'lt';
      id: string;
      lesson: Lesson;
      from: string;
      take: Take;
      word: string;
    } & Place);

const HEB = /^[א-ת״׳"' ]+$/;
/** A part made only of numbers, e.g. «456 + 15». */
export const NUMS = /^\d+( \+ \d+)*$/;

/** Value of one part of an equation: Hebrew words (optionally added with +) or a sum of numbers; null — not plain. */
function partValue(p: string): { v: number; heb: boolean } | null {
  if (NUMS.test(p)) return { v: p.split(' + ').reduce((a, n) => a + Number(n), 0), heb: false };
  const terms = p.split(' + ');
  if (terms.every((x) => HEB.test(x) && letters(x).length)) return { v: terms.reduce((a, x) => a + gematria(x), 0), heb: true };
  return null;
}

/** A riddle equation as a fact, or null when it is not a plain checked equality of gematria. */
export function parseEquation(e: string): { q: string; rest: string[]; v: number } | null {
  const parts = e.split(' = ').map((p) => p.trim());
  if (parts.length < 2) return null;
  const vals = parts.map(partValue);
  if (vals.some((x) => !x)) return null;
  const v = vals[0]!.v;
  if (vals.some((x) => x!.v !== v)) return null;
  const qi = vals.findIndex((x) => x!.heb);
  if (qi < 0) return null;
  return { q: parts[qi], rest: [...parts.slice(0, qi), ...parts.slice(qi + 1)], v };
}

const key = (s: string) => plainWord(s.replace(/ \+ /g, ' '));

/** Hebrew parts of an equality fact (each term of a sum separately) — every one needs a gloss on the page. */
export const hebrewParts = (f: Extract<Fact, { kind: 'eq' }>) =>
  [f.q, ...f.rest].filter((p) => !NUMS.test(p)).flatMap((p) => p.split(' + '));

/** The riddle whose equations or «Собери слово» steps contain the fact's words, if any. */
function riddleOf(l: Lesson, f: Fact): number | undefined {
  const want = key(f.kind === 'eq' ? f.q.split(' + ')[0] : f.from);
  const ri = l.riddles.findIndex(
    (r) =>
      r.equations.some((e) => e.split(/\s*(?:=|→|\+|×|:|\(|\))\s*/).some((p) => p && key(p) === want)) ||
      r.steps.some((s) => s.t === 'lt' && key(s.from) === want),
  );
  if (ri >= 0) return ri;
  // else the riddle whose lesson text quotes these words
  const he = f.kind === 'eq' ? f.q : f.from;
  const text = l.texts.ru ?? Object.values(l.texts)[0];
  const k = text?.riddles.findIndex((rt) =>
    [rt.cond, rt.reveal.p, ...rt.lessons.map((x) => x.b)].some((h) => h.includes(he) || h.includes(displayNames(he))),
  );
  return k === undefined || k < 0 ? undefined : k;
}

/** All facts of the lessons with gematria (not «Нифлаот Ребе»), newest lesson first, without repeats. */
export function collectFacts(lessons: Lesson[]): Fact[] {
  const out: Fact[] = [];
  const seen = new Set<string>(); // Hebrew parts already shown in an equality
  const seenLt = new Set<string>();
  for (const l of [...lessons].reverse()) {
    if (l.kind === 'sicha') continue;
    const addEq = (q: string, rest: string[], v: number, at: Place) => {
      const heb = [q, ...rest].filter((p) => !NUMS.test(p)).map(key);
      if (seen.has(key(q)) || heb.every((h) => seen.has(h))) return;
      heb.forEach((h) => seen.add(h));
      out.push({ kind: 'eq', id: `${l.slug}-${out.length + 1}`, lesson: l, q, rest, v, ...at });
    };
    const addLt = (from: string, take: Take, word: string, at: Place) => {
      const k = `${key(from)}>${key(word)}`;
      if (seenLt.has(k) || letterStepError(from, take, word)) return;
      // «the same letters» is already told by the equality of the two words
      if (take === 'all' && seen.has(key(from)) && seen.has(key(word))) return;
      seenLt.add(k);
      out.push({ kind: 'lt', id: `${l.slug}-${out.length + 1}`, lesson: l, from, take, word: asWord(word), ...at });
    };
    // Memo pairs first: they carry the commentary's own equalities
    const first = out.length;
    l.memo?.items.forEach((it, mi) => {
      // a number alone is a teaser only for the Torah words of the pair (not e.g. «תריג = 613»)
      for (const g of it.gematria ?? [])
        if (gematria(g.a) === g.v && (!g.b || gematria(g.b) === g.v) && (g.b || g.a === it.verse)) addEq(g.a, [String(g.v), ...(g.b ? [g.b] : [])], g.v, { mi });
      for (const x of it.letters ?? []) addLt(x.from, x.take, x.word, { mi });
    });
    l.riddles.forEach((r, ri) => {
      for (const e of r.equations) {
        const f = parseEquation(e);
        if (f) addEq(f.q, f.rest, f.v, { ri });
      }
      for (const s of r.steps) if (s.t === 'lt') addLt(s.from, s.take, s.a, { ri });
    });
    // a Memo pair is also explained in a riddle of the lesson: link there too
    for (const f of out.slice(first)) if (f.ri === undefined) f.ri = riddleOf(l, f);
  }
  return out;
}

/** The Hebrew strings of a fact that need a translation on the page. */
export const factHebrew = (f: Fact) => (f.kind === 'eq' ? hebrewParts(f) : [f.from, f.word]);
