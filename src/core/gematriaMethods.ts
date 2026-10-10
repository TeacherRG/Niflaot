/**
 * The ways of counting a word (שיטות הגימטריא) used by the commentators — Baal HaTurim, the Arizal, Chassidut.
 * Every method is a rule for one letter (its value, or the letter it is swapped for); the word is the sum.
 * Described for lesson authors in docs/GEMATRIA-RULES.md; checked by `npm run check`
 * (the examples in METHOD_EXAMPLES must come out exactly).
 */
import { LETTER_NAMES, VALUES, gematria, letters } from './gematria';

export type Method =
  | 'standard' // מספר הכרחי — the usual value, final letters as regular ones
  | 'gadol' // מספר גדול — final letters ך ם ן ף ץ are 500–900
  | 'katan' // מספר קטן — the value without zeros: י = 1, ק = 1, ת = 4
  | 'siduri' // מספר סידורי — the place in the alphabet: א = 1 … ת = 22
  | 'kadmi' // מספר הכדמי — the sum of all values from א up to the letter: ב = 1 + 2 = 3
  | 'milui' // מילוי — every letter spelled out in full: א = אלף = 111
  | 'neelam' // נעלם — the hidden part of the full spelling: אלף without its own א = 110
  | 'atbash' // א״ת ב״ש — the letter is swapped with its mirror in the alphabet: א ↔ ת, ב ↔ ש
  | 'albam'; // א״ל ב״ם — the alphabet in two halves: א ↔ ל, ב ↔ מ

const ALEF_BET = [...'אבגדהוזחטיכלמנסעפצקרשת'];
const FINAL_TO_REGULAR: Record<string, string> = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const regular = (c: string) => FINAL_TO_REGULAR[c] ?? c;
const place = (c: string) => ALEF_BET.indexOf(regular(c));

const GADOL: Record<string, number> = { 'ך': 500, 'ם': 600, 'ן': 700, 'ף': 800, 'ץ': 900 };
const zeros = (v: number) => (v >= 100 ? v / 100 : v >= 10 ? v / 10 : v);

/** The letter a substitution method puts instead of `c` (regular forms). */
export function swapLetter(method: 'atbash' | 'albam', c: string): string {
  const i = place(c);
  return method === 'atbash' ? ALEF_BET[21 - i] : ALEF_BET[(i + 11) % 22];
}

/** Methods that swap letters: the word is first rewritten, then counted in the usual way. */
export const SWAPS = new Set<Method>(['atbash', 'albam']);

/** The value one letter has in a method. */
export function letterValue(method: Method, c: string): number {
  switch (method) {
    case 'standard':
      return VALUES[c] ?? 0;
    case 'gadol':
      return GADOL[c] ?? VALUES[c] ?? 0;
    case 'katan':
      return zeros(VALUES[c] ?? 0);
    case 'siduri':
      return place(c) + 1;
    case 'kadmi':
      return ALEF_BET.slice(0, place(c) + 1).reduce((a, x) => a + VALUES[x], 0);
    case 'milui':
      return gematria(LETTER_NAMES[c]);
    case 'neelam':
      return gematria(LETTER_NAMES[c]) - (VALUES[c] ?? 0);
    case 'atbash':
    case 'albam':
      return VALUES[swapLetter(method, c)];
  }
}

/** The word rewritten by a substitution method (שרה → בגצ in א״ת ב״ש); other methods leave it as is. */
export const swapWord = (method: Method, s: string) =>
  SWAPS.has(method) ? letters(s).map((c) => swapLetter(method as 'atbash' | 'albam', c)).join('') : letters(s).join('');

/** The value of a word (or phrase) in a method. */
export const gematriaBy = (method: Method, s: string) => letters(s).reduce((a, c) => a + letterValue(method, c), 0);

/** עם הכולל — «with the whole»: the word itself counts as one more (+1), or + the number of words / letters. */
export const withKolel = (s: string, by: 'one' | 'words' | 'letters' = 'one') =>
  gematria(s) + (by === 'one' ? 1 : by === 'words' ? s.split(/\s+/).filter((w) => letters(w).length).length : letters(s).length);

/** מספר קטן מספרי — the digits of the value added up until one digit is left: אמת = 441 → 4 + 4 + 1 = 9. */
export const katanMispari = (n: number): number => (n < 10 ? n : katanMispari([...String(n)].reduce((a, d) => a + Number(d), 0)));

/** ריבוע — «square»: the sums of the word's growing beginnings: אמת = א + אמ + אמת = 1 + 41 + 441 = 483. */
export const riboa = (s: string) => letters(s).reduce((a, _, i, ls) => a + gematria(ls.slice(0, i + 1).join('')), 0);

/** נוטריקון: the letters of the word begin the words of the phrase, in order (בראשית ← בראשונה ראה אלקים שיקבלו ישראל תורה). */
export function isNotarikon(word: string, phrase: string): boolean {
  const plain = (s: string) => letters(s).map(regular).join('');
  const firsts = phrase.split(/\s+/).filter((w) => letters(w).length).map((w) => regular(letters(w)[0])).join('');
  return firsts === plain(word);
}

/** The first letters of the words of a phrase, for showing a notarikon: «ב · ר · א · ש · י · ת». */
export const firstLetters = (phrase: string) =>
  phrase.split(/\s+/).filter((w) => letters(w).length).map((w) => regular(letters(w)[0])).join(' · ');

/**
 * Worked examples of every method, checked by `npm run check` (docs/GEMATRIA-RULES.md shows the same).
 * `v` is the value of `word`; `eq`, when given, is an expression of the same value in the usual count.
 */
export const METHOD_EXAMPLES: { method: Method | 'kolel' | 'katanMispari' | 'riboa'; word: string; v: number; eq?: string }[] = [
  { method: 'standard', word: 'חמס', v: 108, eq: 'מי נח' },
  { method: 'gadol', word: 'אדם', v: 605 },
  { method: 'katan', word: 'נח', v: 13 },
  { method: 'siduri', word: 'נח', v: 22 },
  { method: 'kadmi', word: 'אב', v: 4 },
  { method: 'milui', word: 'אש', v: 471 },
  { method: 'neelam', word: 'אש', v: 170 },
  { method: 'atbash', word: 'שרה', v: 95, eq: 'יסכה' },
  { method: 'albam', word: 'אב', v: 70 },
  { method: 'kolel', word: 'שפה אחת', v: 795, eq: 'לשון הקדש' },
  { method: 'katanMispari', word: 'אמת', v: 9 },
  { method: 'riboa', word: 'אמת', v: 483 },
];

/** The value of an example in its method. */
export function exampleValue(e: (typeof METHOD_EXAMPLES)[number]): number {
  if (e.method === 'kolel') return withKolel(e.word);
  if (e.method === 'katanMispari') return katanMispari(gematria(e.word));
  if (e.method === 'riboa') return riboa(e.word);
  return gematriaBy(e.method, e.word);
}
