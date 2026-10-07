/** Standard gematria values; final letters have the same value as regular ones. */
export const VALUES: Record<string, number> = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
  'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50, 'ס': 60, 'ע': 70,
  'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400,
};

export const gematria = (s: string) => [...s].reduce((a, c) => a + (VALUES[c] ?? 0), 0);

export const letters = (s: string) => [...s].filter((c) => VALUES[c]);

export const KEYBOARD = [...'אבגדהוזחטיכלמנסעפצקרשת', 'ך', 'ם', 'ן', 'ף', 'ץ'];

/**
 * Letter names for gematria «במילוי» (full spelling): אש = אלף + שין = 111 + 360 = 471.
 * Common spellings; letters with several spellings use: ה → הא, ו → וו, פ → פא, צ → צדי.
 */
export const LETTER_NAMES: Record<string, string> = {
  'א': 'אלף', 'ב': 'בית', 'ג': 'גימל', 'ד': 'דלת', 'ה': 'הא', 'ו': 'וו', 'ז': 'זין', 'ח': 'חית', 'ט': 'טית',
  'י': 'יוד', 'כ': 'כף', 'ך': 'כף', 'ל': 'למד', 'מ': 'מם', 'ם': 'מם', 'נ': 'נון', 'ן': 'נון', 'ס': 'סמך',
  'ע': 'עין', 'פ': 'פא', 'ף': 'פא', 'צ': 'צדי', 'ץ': 'צדי', 'ק': 'קוף', 'ר': 'ריש', 'ש': 'שין', 'ת': 'תו',
};

/** Gematria of a word with every letter spelled out in full (מילוי). */
export const gematriaMilui = (s: string) => letters(s).reduce((a, c) => a + gematria(LETTER_NAMES[c]), 0);
