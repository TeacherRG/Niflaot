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

export type StepData = NumStep | ChoiceStep;

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
  /** «Собери смысл» after the lesson sections */
  puzzle: PuzzleText;
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
  /** final «Собери смысл»: the path of the whole lesson */
  puzzle: PuzzleText;
  /** «Ораа ле-поаль»: one concrete practical conclusion of the lesson */
  practice: string;
  /** caption of the share card under the highlighted equation */
  highlight: string;
  share: (p: ShareParams) => string;
  /** fine print in the footer */
  source: string;
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
  /** localStorage key used by the old single-file version, migrated once */
  legacyStorageKey?: string;
}
