import type { Locale } from '../i18n';
import type { ParshaId } from './parshiot';
import type { CoachAction } from '../core/coach';
import type { Method } from '../core/gematriaMethods';

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
  /** how the option values are counted, when not the usual way (docs/GEMATRIA-RULES.md): 'milui', 'katan', 'atbash'… */
  method?: Method;
  /**
   * נוטריקון: the right option is the phrase whose words begin with the letters of this word, in order
   * (checked by `npm run check`: exactly one option does); after a pick each option shows its first letters
   */
  notarikon?: string;
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
  /** site host (niflaot.mychitas.app) on the page; the lesson's link with ?ref= in the text sent away */
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
  /** texts of the Memo game, when the lesson has one */
  memo?: MemoText;
  /** texts of the «Карточки» game of a «Нифлаот Ребе» lesson */
  cards?: RebbeCardsText;
  /** final «Собери смысл»: the path of the whole lesson; none in a `commentary` lesson */
  puzzle?: PuzzleText;
  /** who the lesson suits and why (a methodical note next to the age, one short sentence); plain text */
  audience: string;
  /** «Ґораа ле-поаль»: one concrete practical conclusion of the lesson */
  practice: string;
  /** caption of the share card under the highlighted equation */
  highlight: string;
  share: (p: ShareParams) => string;
  /** fine print in the footer */
  source: string;
}

/* ───────────── Memo game (the second game of a commentary lesson) ───────────── */

/** A gematria the commentary itself gives: `a` = `b` = `v`; the sums are computed and shown by the code. */
export interface MemoGematria {
  /** real spelling (Divine Names in full; shown respectfully) */
  a: string;
  /** the word(s) of equal value, if the commentary names them; otherwise the item text explains the number (`note`) */
  b?: string;
  v: number;
}

/** A letter hint of the commentary; `kind` names the device (its name and meaning are in the UI texts). */
export interface MemoLetters {
  /** the phrase whose letters are taken (real spelling) */
  from: string;
  take: 'first' | 'last' | 'all';
  /** the word they make (checked by `npm run check`) */
  word: string;
  /** ראשי תיבות · סופי תיבות · נוטריקון · the same letters rearranged */
  kind: 'rt' | 'st' | 'notarikon' | 'letters';
}

/**
 * One pair of Memo cards, language-independent: a picture card (`memo/NN.png` next to the lesson, portrait 3:4)
 * and a word card with the Torah words `verse`. The texts are in `LessonText.memo.items`, same order.
 */
export interface MemoItem {
  /** the Torah words the comment is on — the word card of the pair (real spelling) */
  verse: string;
  /** the commentary's own words in Hebrew (real spelling) */
  quote: string;
  gematria?: MemoGematria[];
  letters?: MemoLetters[];
  /** id in src/sources/sefaria.json */
  source: string;
}

export interface MemoData {
  /** exactly 12 pairs; item k is drawn in `memo/NN.png` (NN = k + 1) */
  items: MemoItem[];
}

/** Texts of one Memo pair; plain text, Hebrew is auto-styled. */
export interface MemoItemText {
  /** short title of the comment */
  title: string;
  /** what the picture shows and what it means (≤ 45 chars): in the list «Что на картинках» under the board — the key to the pair */
  caption: string;
  /** translation of the Torah words on the word card */
  verse: string;
  /** translation of the commentary's words */
  quote: string;
  /** «Знаете ли вы?» — a simple explanation for ages 8–15 */
  explain: string;
  /** what a number stands for when the gematria has no equal words (e.g. 52 havdalot a year) */
  note?: string;
  /** «Чему это учит?» — a short conclusion (the project's, not the commentator's) */
  moral: string;
}

export interface MemoText {
  /** one or two sentences above the game: what the pairs are */
  intro: string;
  items: MemoItemText[];
}

/* ───────────── «Карточки» (the second game of a «Нифлаот Ребе» lesson) ───────────── */

/**
 * One pair of cards, language-independent: a verse card (Torah words of the portion) and an explanation card —
 * one explanation of the Rebbe on that verse (Likkutei Sichot). One explanation per verse: every verse once.
 * The texts are in `LessonText.cards.items`, same order.
 */
export interface RebbeCard {
  /** the Torah words on the verse card, as written in the verse (real spelling of Divine Names) */
  verse: string;
  /** the verse in src/sources/sefaria.json (its Hebrew must contain `verse`) */
  source: string;
  /** where the talk is: Likkutei Sichot, volume and number of the talk in the portion */
  ls: { vol: number; sicha: number };
}

export interface RebbeCardsData {
  /** exactly 12 pairs, in the order of the verses */
  items: RebbeCard[];
}

/** Texts of one pair; plain text, Hebrew is auto-styled. */
export interface RebbeCardText {
  /** the theme of the talk, short */
  title: string;
  /** translation of the Torah words on the verse card */
  verse: string;
  /** the explanation card: the Rebbe's explanation in one short line (≤ 70 characters) */
  card: string;
  /** the Rebbe's explanation, a few sentences */
  explain: string;
  /** «Ґораа» — the practical lesson of the talk */
  horaah: string;
  /**
   * «Запомнить в стихах»: the pair as a short rhymed poem (4–6 lines) — the verse, the Rebbe's explanation and its lesson,
   * nothing added; plain text, one line per string
   */
  poem: string[];
}

export interface RebbeCardsText {
  /** one or two sentences above the game: what the pairs are */
  intro: string;
  items: RebbeCardText[];
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
   * `commentary` — separate remarks of a commentator (Baal HaTurim…) not linked into one chain: no puzzles;
   * `sicha` — a talk of the Lubavitcher Rebbe («Нифлаот Ребе»): an investigation without gematria — a question on
   * the verse, the Rebbe's answer, the lesson for life; connected, so with puzzles; no gematria calculator.
   */
  kind?: 'article' | 'commentary' | 'sicha';
  /** `rebbe` — the lesson belongs to «Нифлаот Ребе» of its portion (its own menu item and section), not to the main list */
  series?: 'rebbe';
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
  /** Memo game — the second game of a commentary lesson (#/<slug>/memo): 12 pairs of cards */
  memo?: MemoData;
  /** «Карточки» — the second game of a «Нифлаот Ребе» lesson (#/<slug>/cards): verse — the Rebbe's explanation */
  cards?: RebbeCardsData;
  /** localStorage key used by the old single-file version, migrated once */
  legacyStorageKey?: string;
}
