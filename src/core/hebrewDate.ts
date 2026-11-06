/**
 * Dates for the printouts: the civil date in the reader's language and the Jewish date in Hebrew letters
 * («כ״ט תשרי ה׳תשפ״ז»), computed by the open-source @hebcal/core — no requests, no dependence on the browser.
 */
import { hebrewDateText } from './hebcal';

const UNITS = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const TENS = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
const HUNDREDS = ['', 'ק', 'ר', 'ש', 'ת'];

/** 29 → כ״ט, 15 → ט״ו, 787 → תשפ״ז, 5 → ה׳ (gershayim before the last letter, geresh after a single one). */
export function hebrewNumber(n: number): string {
  let s = '';
  let h = Math.floor(n / 100);
  while (h > 4) {
    s += 'ת';
    h -= 4;
  }
  s += HUNDREDS[h];
  const rest = n % 100;
  if (rest === 15) s += 'טו';
  else if (rest === 16) s += 'טז';
  else s += TENS[Math.floor(rest / 10)] + UNITS[rest % 10];
  return s.length === 1 ? `${s}׳` : `${s.slice(0, -1)}״${s.slice(-1)}`;
}

/** «כ״ט תשרי ה׳תשפ״ז» for a date (`YYYY-MM-DD`, read as a calendar day) — from @hebcal/core (src/core/hebcal.ts). */
export function jewishDate(iso: string): string {
  return hebrewDateText(iso).replace(/[\u0591-\u05C7]/g, '');
}

/** «10 октября 2026» / «October 10, 2026» / «10. Oktober 2026». */
export const civilDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
