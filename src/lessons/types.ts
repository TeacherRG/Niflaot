import type { Locale } from '../i18n';
import type { ParshaId } from './parshiot';

/* ───────────── language-independent lesson data ───────────── */

export interface NumStep {
  t: 'num';
  /** correct numeric answer */
  a: number;
}

export interface ChoiceStep {
  t: 'ch';
  /** Hebrew option + optional gematria value shown after a pick */
  opts: { h: string; v?: number }[];
  /** index of the correct option */
  c: number;
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

export interface RiddleText {
  title: string;
  /** HTML */
  cond: string;
  steps: StepText[];
  reveal: { h: string; p: string };
  /** expandable lesson sections; `b` is HTML */
  lessons: { h: string; b: string }[];
  reflection: string;
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
