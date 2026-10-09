/**
 * Dates for the printouts: the civil date in the reader's language and the Jewish date in Hebrew letters
 * («כ״ט תשרי ה׳תשפ״ז»), computed by the browser's Hebrew calendar (Intl) — no tables to keep up to date.
 */
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

const MONTHS: Record<string, string> = {
  Tishri: 'תשרי', Heshvan: 'חשון', Kislev: 'כסלו', Tevet: 'טבת', Shevat: 'שבט', 'Adar I': 'אדר א׳', 'Adar II': 'אדר ב׳',
  Adar: 'אדר', Nisan: 'ניסן', Iyar: 'אייר', Sivan: 'סיון', Tamuz: 'תמוז', Av: 'אב', Elul: 'אלול',
};

/** «כ״ט תשרי ה׳תשפ״ז» for a date (`YYYY-MM-DD`, read as a calendar day). */
export function jewishDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const year = Number(get('year'));
  return `${hebrewNumber(Number(get('day')))} ${MONTHS[get('month')] ?? get('month')} ${hebrewNumber(Math.floor(year / 1000))}${hebrewNumber(year % 1000)}`;
}

/** «10 октября 2026» / «October 10, 2026» / «10. Oktober 2026». */
export const civilDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
