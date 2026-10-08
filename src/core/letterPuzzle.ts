/**
 * Letter puzzles in the manner of the Baal HaTurim — no arithmetic, only letters:
 *  - «Собери слово» (step `lt`): the player taps letters of a phrase to build a word from its
 *    first letters (ראשי תיבות), last letters (סופי תיבות) or all its letters (a permutation);
 *  - «Найди букву» (step `tap`): the player taps one letter of a word, e.g. the letter the Torah
 *    leaves out (כתיב חסר) or the one it doubles (כתיב מלא).
 * Data lives in the lesson; `npm run check` verifies it with the functions below.
 */
import { letters } from './gematria';

const FINAL: Record<string, string> = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const TO_FINAL: Record<string, string> = Object.fromEntries(Object.entries(FINAL).map(([f, r]) => [r, f]));

/** Final forms → regular ones: ם and מ are the same letter. */
export const plainLetter = (c: string) => FINAL[c] ?? c;
export const plainWord = (s: string) => letters(s).map(plainLetter).join('');
/** Regular letters → a word, with the final form of its last letter (אמת, חותם, רכיל). */
export const asWord = (s: string) => {
  const a = letters(s).map(plainLetter);
  if (a.length > 1) a[a.length - 1] = TO_FINAL[a[a.length - 1]] ?? a[a.length - 1];
  return a.join('');
};

export type Take = 'first' | 'last' | 'all';

export interface Tile {
  /** index in the flat list of letters of the phrase */
  i: number;
  /** word index */
  w: number;
  c: string;
  first: boolean;
  last: boolean;
}

/** The phrase as tiles, word by word. */
export function phraseTiles(phrase: string): Tile[] {
  const out: Tile[] = [];
  phrase
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word, w) => {
      const ls = letters(word);
      ls.forEach((c, k) => out.push({ i: out.length, w, c, first: k === 0, last: k === ls.length - 1 }));
    });
  return out;
}

/** Tiles the rule takes: first letters, last letters or all of them. */
export const expectedTiles = (tiles: Tile[], take: Take) =>
  new Set(tiles.filter((t) => take === 'all' || (take === 'first' ? t.first : t.last)).map((t) => t.i));

/**
 * Checks the tiles picked in order: `ok` — the answer from the right letters;
 * `place` — the right word, but some letters were taken from the wrong place; `no` — another word.
 */
export function checkLetters(phrase: string, take: Take, answer: string, picked: number[]): 'ok' | 'place' | 'no' {
  const tiles = phraseTiles(phrase);
  if (picked.map((i) => plainLetter(tiles[i].c)).join('') !== plainWord(answer)) return 'no';
  const exp = expectedTiles(tiles, take);
  return picked.every((i) => exp.has(i)) && picked.length === exp.size ? 'ok' : 'place';
}

/** Data check: the letters the rule takes are exactly the letters of the answer (in any order). */
export function letterStepError(phrase: string, take: Take, answer: string): string | null {
  const tiles = phraseTiles(phrase);
  const exp = [...expectedTiles(tiles, take)].map((i) => plainLetter(tiles[i].c)).sort().join('');
  const ans = [...plainWord(answer)].sort().join('');
  return exp === ans ? null : `the ${take} letters of «${phrase}» are ${exp}, the answer «${answer}» needs ${ans}`;
}

/** Data check for «Найди букву»: without the tapped letter the word is spelled as `written`. */
export function tapStepError(word: string, a: number, written?: string): string | null {
  const ls = letters(word);
  if (a < 0 || a >= ls.length) return `letter ${a} is outside «${word}»`;
  if (written !== undefined && ls.filter((_, k) => k !== a).join('') !== letters(written).join(''))
    return `«${word}» without letter ${a + 1} is not «${written}»`;
  return null;
}
