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
import type { Lesson, LessonText } from '../lessons/types';

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

/**
 * The answer as the feed shows it — no calculations: the value first, then the words equal to it
 * («האדם ? = 50 = אדמה»); sums of numbers («456 + 15») are dropped.
 */
export function answerParts(rest: string[], v: number): string[] {
  const heb = rest.filter((p) => !NUMS.test(p));
  return [String(v), ...heb];
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
  return { q: parts[qi], rest: answerParts([...parts.slice(0, qi), ...parts.slice(qi + 1)], v), v };
}

const key = (s: string) => plainWord(s.replace(/ \+ /g, ' '));

/** A short id that stays the same while the fact does (links `#/facts/<id>` from shared cards keep working). */
const stableId = (slug: string, s: string) => {
  let h = 5381;
  for (const c of s) h = ((h * 33) ^ c.codePointAt(0)!) >>> 0;
  return `${slug}-${h.toString(36)}`;
};

/** Hebrew parts of an equality fact (each term of a sum separately) — every one needs a gloss on the page. */
export const hebrewParts = (f: Extract<Fact, { kind: 'eq' }>) =>
  [f.q, ...f.rest].filter((p) => !NUMS.test(p)).flatMap((p) => p.split(' + '));

/** The words of `he` stand in `verse` as whole words (ויהיו in «ויהיו חיי שרה»). */
function inVerse(he: string, verse: string) {
  const w = verse.split(/[\s־]+/).map(plainWord).join(' ');
  return ` ${w} `.includes(` ${he.split(/[\s־+]+/).filter(Boolean).map(plainWord).join(' ')} `);
}

/** The Memo pair with the same gematria (value and words) or the same letter hint. */
function memoOf(l: Lesson, f: Fact): number | undefined {
  const he = f.kind === 'eq' ? f.q : f.from;
  const k = l.memo?.items.findIndex(
    (it) =>
      f.kind === 'eq'
        ? it.gematria?.some((g) => g.v === f.v && key(g.a) === key(he))
        : it.letters?.some((x) => key(x.from) === key(he)),
  );
  return k === undefined || k < 0 ? undefined : k;
}

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
      out.push({ kind: 'eq', id: stableId(l.slug, `eq:${key(q)}`), lesson: l, q, rest, v, ...at });
    };
    const addLt = (from: string, take: Take, word: string, at: Place) => {
      const k = `${key(from)}>${key(word)}`;
      if (seenLt.has(k) || letterStepError(from, take, word)) return;
      // «the same letters» is already told by the equality of the two words
      if (take === 'all' && seen.has(key(from)) && seen.has(key(word))) return;
      seenLt.add(k);
      out.push({ kind: 'lt', id: stableId(l.slug, `lt:${key(from)}>${key(word)}`), lesson: l, from, take, word: asWord(word), ...at });
    };
    // Memo pairs first: they carry the commentary's own equalities
    const first = out.length;
    l.memo?.items.forEach((it, mi) => {
      // a number alone is a teaser only for the Torah words of the pair (not e.g. «תריג = 613»)
      for (const g of it.gematria ?? [])
        if (gematria(g.a) === g.v && (!g.b || gematria(g.b) === g.v) && (g.b || inVerse(g.a, it.verse))) addEq(g.a, answerParts(g.b ? [g.b] : [], g.v), g.v, { mi });
      for (const x of it.letters ?? []) addLt(x.from, x.take, x.word, { mi });
    });
    l.riddles.forEach((r, ri) => {
      for (const e of r.equations) {
        const f = parseEquation(e);
        if (f) addEq(f.q, f.rest, f.v, { ri });
      }
      for (const s of r.steps) if (s.t === 'lt') addLt(s.from, s.take, s.a, { ri });
    });
    // two equalities of one riddle with the same value are one fact: «פרצוף + גאוה = 471 = זנב + תאוה»
    for (let i = first; i < out.length; i++) {
      const a = out[i];
      if (a.kind !== 'eq' || a.ri === undefined) continue;
      for (let j = i + 1; j < out.length; j++) {
        const b = out[j];
        if (b.kind === 'eq' && b.ri === a.ri && b.v === a.v) {
          a.rest.push(b.q, ...b.rest.filter((p) => !NUMS.test(p)));
          out.splice(j--, 1);
        }
      }
    }
        // a Memo pair is also explained in a riddle of the lesson: link there too
    for (const f of out.slice(first)) if (f.ri === undefined) f.ri = riddleOf(l, f);
    // a riddle fact whose words are those of a Memo pair: the pair tells what it means
    for (const f of out.slice(first)) if (f.mi === undefined) f.mi = memoOf(l, f);
  }
  return out;
}

/** The Hebrew strings of a fact that need a translation on the page. */
export const factHebrew = (f: Fact) => (f.kind === 'eq' ? hebrewParts(f) : [f.from, f.word]);

/** What a fact means, in the language of `text`: the Memo pair's explanation and lesson, else the riddle's conclusion. */
export interface Meaning {
  title?: string;
  /** what the number / the hidden word tells (plain text, Hebrew is auto-styled) */
  text?: string;
  /** «Чему это учит?» */
  moral?: string;
}

export function factMeaning(f: Fact, text: LessonText): Meaning {
  const memo = f.mi !== undefined ? text.memo?.items[f.mi] : undefined;
  if (memo) return { title: memo.title, text: memo.explain, moral: memo.moral };
  if (f.ri === undefined) return {};
  const r = text.riddles[f.ri];
  if (!r) return {};
  // the riddle's takeaway about these words: «ויהיו = 37 = 127 − 90: главные годы Сары — с рождения Ицхака»
  const he = plainWord(f.kind === 'eq' ? f.q : f.from);
  let best: string | undefined;
  let score = 0;
  for (const tk of r.takeaways ?? []) {
    if (!plainWord(tk).includes(he) || !tk.includes(': ')) continue;
    const sc = 1 + (f.kind === 'eq' && tk.includes(String(f.v)) ? 1 : 0) + (f.kind === 'lt' && plainWord(tk).includes(plainWord(f.word)) ? 1 : 0);
    if (sc > score) [best, score] = [tk, sc];
  }
  const said = best?.slice(best.indexOf(': ') + 2).trim();
  return { title: r.title, text: said && said[0].toLocaleUpperCase() + said.slice(1) };
}
