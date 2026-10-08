import type { Locale } from '../i18n';
import type { ParshaId } from './parshiot';
import type { CoachAction } from '../core/coach';

/* ───────────── language-independent lesson data ───────────── */

/** Average time and difficulty of a step, shown above it (a methodical estimate, see docs/LESSON-GUIDE.md). */
export interface StepEstimate {
  /** average time to complete the step, in seconds */
  sec: number;
  /** 1 easy · 2 medium · 3 hard */
  level: 1 | 2 | 3;
}

export interface NumStep {
  t: 'num';
  est: StepEstimate;
  /** correct numeric answer */
  a: number;
  /** a counting task (e.g. «how many words»): no arithmetic, so no coach */
  count?: boolean;
  /**
   * Step-by-step help («Посчитать вместе»): Hebrew words and numbers for the coach module, e.g.
   * [{ word: 'זנב' }, { word: 'תאוה' }, { add: ['$1', '$2'] }]. The last result must equal `a`.
   */
  coach?: CoachAction[];
}

export interface ChoiceStep {
  t: 'ch';
  est: StepEstimate;
  /** Hebrew option + optional gematria value shown after a pick */
  opts: { h: string; v?: number }[];
  /** index of the correct option */
  c: number;
  /** option values are gematria «במילוי» (letters spelled out in full) */
  milui?: boolean;
}

/**
 * «Собери слово» — a letter puzzle in the manner of the Baal HaTurim: the player taps letters of the
 * phrase `from` to build the word `a` from its first letters, last letters or all its letters.
 */
export interface LettersStep {
  t: 'lt';
  est: StepEstimate;
  /** the phrase whose letters are tapped (real spelling of Divine Names; shown respectfully) */
  from: string;
  /** which letters make the word: first letters of the words, last letters, or all letters */
  take: 'first' | 'last' | 'all';
  /** the word to build */
  a: string;
}

/**
 * «Найди букву»: the player taps one letter of `word` — e.g. the letter the Torah leaves out
 * (`written` is the Torah's spelling without it) or the one it doubles.
 */
export interface TapStep {
  t: 'tap';
  est: StepEstimate;
  /** the word shown as letter tiles */
  word: string;
  /** index of the right letter (0 = first letter of the word) */
  a: number;
  /** the word as written in the Torah without that letter (checked by `npm run check`) */
  written?: string;
}

export type StepData = NumStep | ChoiceStep | LettersStep | TapStep;

export interface RiddleData {
  /** Hebrew word cards shown above the steps */
  words: string[];
  /** optional "scales": pan k lights up when step k is solved */
  balance?: { expr: string; value: number }[];
  steps: StepData[];
  /** equations shown on solve; Hebrew runs are auto-styled */
  equations: string[];
  /** primary sources quoted in this riddle’s lesson (ids in src/sources/sefaria.json) */
  sources?: string[];
}

/* ───────────── per-language lesson texts ───────────── */
/* Strings marked HTML may contain inline markup (<p>, <em>, <span class="he">, …). */

export interface StepText {
  /** HTML */
  q: string;
  hint?: string;
  /** glosses for choice options, same order as StepData.opts */
  opts?: string[];
}

/**
 * «Собери смысл»: key terms of a riddle (or of the whole lesson) to put in order, like jigsaw pieces.
 * The order must follow from the lesson itself, and `q` names the principle of the order
 * (in order of the text, from the root to the meaning, from outer to inner…).
 */
export interface PuzzleText {
  /** the ordering principle shown to the player; plain text */
  q: string;
  /** 3–6 key terms in the correct order; plain text, Hebrew is auto-styled */
  pieces: string[];
  /** the meaning the assembled chain spells out, shown when it is complete; plain text */
  meaning: string;
}

export interface RiddleText {
  title: string;
  /** HTML; a quoted source is marked with <sup data-src="ID"></sup> right after the quote (footnote) */
  cond: string;
  steps: StepText[];
  reveal: { h: string; p: string };
  /** expandable lesson sections; `b` is HTML */
  lessons: { h: string; b: string }[];
  reflection: string;
  /** short bullet points for the summary («конспект») on the final screen; plain text, Hebrew is auto-styled */
  takeaways?: string[];
  /** «Собери смысл» after the lesson sections; none in a `commentary` lesson */
  puzzle?: PuzzleText;
}

export interface ShareParams {
  score: number;
  max: number;
  time: string;
  grid: string;
  allSolved: boolean;
  /** site host, e.g. niflaot.mychitas.app */
  site: string;
}

export interface LessonText {
  /** short title, e.g. "Тикун парцуф-занав" */
  title: string;
  hero: {
    /** HTML */
    heading: string;
    author: string;
    intro: string;
  };
  /** catalog card blurb */
  summary: string;
  /** translations for Hebrew word cards */
  glossary: Record<string, string>;
  riddles: RiddleText[];
  final: { title: string; allSolved: string };
  /** final «Собери смысл»: the path of the whole lesson; none in a `commentary` lesson */
  puzzle?: PuzzleText;
  /** who the lesson suits and why (a methodical note next to the age, one short sentence); plain text */
  audience: string;
  /** «Ораа ле-поаль»: one concrete practical conclusion of the lesson */
  practice: string;
  /** caption of the share card under the highlighted equation */
  highlight: string;
  share: (p: ShareParams) => string;
  /** fine print in the footer */
  source: string;
}

/* ───────────── Memo game (end of a commentary lesson) ───────────── */

/** A gematria the commentary itself gives: `a` = `b` = `v`; the sums are computed and shown by the code. */
export interface MemoGematria {
  /** real spelling (Divine Names in full; shown respectfully) */
  a: string;
  /** the word(s) of equal value, if the commentary names them */
  b?: string;
  v: number;
  /** what the number stands for, when it is not a word (e.g. «כ״ד קישוטים»); Hebrew */
  note?: string;
}

/** A letter hint of the commentary: ראשי / סופי תיבות, נוטריקון, the same letters rearranged. */
export interface MemoLetters {
  /** the phrase whose letters are taken (real spelling) */
  from: string;
  take: 'first' | 'last' | 'all';
  /** the word they make (checked by `npm run check`) */
  word: string;
  /** name of the device in Hebrew: ר״ת, ס״ת, נוטריקון, אותיות… */
  kind: string;
}

/**
 * One pair of Memo cards: a picture card (`memo/NN.png` next to the lesson, portrait 3:4) and a word card with `verse`.
 * All texts are in Hebrew — the Memo is played in Hebrew; Divine Names in real spelling, shown respectfully.
 */
export interface MemoItem {
  /** short title */
  title: string;
  /** the Torah words the comment is on — the word card of the pair */
  verse: string;
  /** the commentary's own words */
  quote: string;
  /** «הידעת?» — a simple explanation in modern Hebrew for ages 10–15 */
  explain: string;
  gematria?: MemoGematria[];
  letters?: MemoLetters[];
  /** «מה לומדים מזה?» — a short conclusion (the project's, not the commentator's) */
  moral: string;
  /** id in src/sources/sefaria.json */
  source: string;
}

export interface MemoData {
  /** portion name in Latin letters, as on the pictures */
  parsha: string;
  /** exactly 12 pairs; item k is drawn in `memo/NN.png` (NN = k + 1) next to the lesson */
  items: MemoItem[];
}

export interface Lesson {
  /** stable id used in URLs and storage */
  slug: string;
  number: number;
  /** Torah portion the lesson belongs to (groups lessons in the menu and catalog) */
  parsha: ParshaId;
  hebrewTitle: string;
  /** e.g. "ה׳תשפ״ז · 5787" */
  year: string;
  /**
   * `article` (default) — one connected article (Rav Ginzburgh): its ideas follow from one another,
   * so every riddle and the lesson end with «Собери смысл»;
   * `commentary` — separate remarks of a commentator (Baal HaTurim…) not linked into one chain: no puzzles.
   */
  kind?: 'article' | 'commentary';
  /** recommended minimum age; the range is open upward (adults too), shown as «8+» */
  age: number;
  /** two large decorative letters in the hero background */
  heroLetters: [string, string];
  riddles: RiddleData[];
  /** the lesson’s key equation for the share card: lines of tokens (Hebrew words, numbers, signs) */
  highlight: string[][];
  calculator: {
    /** extra words/phrases recognised by the calculator besides the cards */
    words: string[];
    /** gematria value → index of the riddle that must be solved before it is revealed */
    secrets: Record<number, number>;
  };
  texts: Partial<Record<Locale, LessonText>>;
  /** author of the text the lesson retells (SEO); Rabbi Yitzchak Ginsburgh when omitted */
  author?: { name: string; alternateName: string };
  /** Memo game at the very end of the lesson (commentary lessons): 12 pairs of cards */
  memo?: MemoData;
  /** localStorage key used by the old single-file version, migrated once */
  legacyStorageKey?: string;
}
