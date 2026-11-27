/**
 * The twelve hours of the day (and of the night) and the twelve months — one table for the big face and the small
 * «kabbalistic» dial on «Часы» (owner, 27.11.2026: «Аризаль, по месяцам» on both).
 * Hour N ↔ month N counted from Nisan: its combination of the Name (the Arizal, «При эц хаим», Шаар Рош ходеш 3, brought
 * in «Бней Иссасхар»), its tribe (the order of the camps: Йеґуда, Иссахар, Звулун…) and its sign (Сефер Йецира 5).
 * Which combination belongs to which hour is not spelled out in the books — that choice is the project's, not checked by a rabbi.
 */
export type TribeId =
  | 'yehuda' | 'issachar' | 'zevulun' | 'reuven' | 'shimon' | 'gad'
  | 'ephraim' | 'menashe' | 'binyamin' | 'dan' | 'asher' | 'naftali';

export interface HourSign {
  /** hebcal's month name — the key of the month names in `hebcal.ts` */
  month: string;
  /** the month in Hebrew */
  monthHe: string;
  tribe: TribeId;
  tribeHe: string;
  /** the sign of the month (Unicode, text presentation) */
  sign: string;
  /** the combination of the Name, letters joined with hyphens: the Name is never written whole */
  tziruf: string;
}

const ROWS: [string, string, TribeId, string, string, string][] = [
  ['Nisan', 'ניסן', 'yehuda', 'יהודה', '♈', 'יהוה'],
  ['Iyyar', 'אייר', 'issachar', 'יששכר', '♉', 'יההו'],
  ['Sivan', 'סיון', 'zevulun', 'זבולון', '♊', 'יוהה'],
  ['Tamuz', 'תמוז', 'reuven', 'ראובן', '♋', 'הוהי'],
  ['Av', 'אב', 'shimon', 'שמעון', '♌', 'הויה'],
  ['Elul', 'אלול', 'gad', 'גד', '♍', 'ההוי'],
  ['Tishrei', 'תשרי', 'ephraim', 'אפרים', '♎', 'והיה'],
  ['Cheshvan', 'חשון', 'menashe', 'מנשה', '♏', 'וההי'],
  ['Kislev', 'כסלו', 'binyamin', 'בנימין', '♐', 'ויהה'],
  ['Tevet', 'טבת', 'dan', 'דן', '♑', 'היהו'],
  ["Sh'vat", 'שבט', 'asher', 'אשר', '♒', 'היוה'],
  ['Adar', 'אדר', 'naftali', 'נפתלי', '♓', 'ההיו'],
];

export const HOUR_SIGNS: HourSign[] = ROWS.map(([month, monthHe, tribe, tribeHe, sign, t]) => ({
  month,
  monthHe,
  tribe,
  tribeHe,
  sign: `${sign}︎`,
  tziruf: [...t].join('-'),
}));

/** the combinations, hour 1…12 → index 0…11 */
export const TZIRUFIM = HOUR_SIGNS.map((h) => h.tziruf);

/** the row of a halachic hour 1…12 */
export const hourSign = (hour: number) => HOUR_SIGNS[Math.min(12, Math.max(1, Math.round(hour))) - 1];

type Lang = 'ru' | 'en' | 'de';
const MONTHS: Record<Lang, string[]> = {
  ru: ['Нисан', 'Ияр', 'Сиван', 'Тамуз', 'Ав', 'Элул', 'Тишрей', 'Хешван', 'Кислев', 'Тевет', 'Шват', 'Адар'],
  en: ['Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul', 'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar'],
  de: ['Nissan', 'Ijar', 'Siwan', 'Tammus', 'Aw', 'Elul', 'Tischri', 'Cheschwan', 'Kislew', 'Tewet', 'Schwat', 'Adar'],
};
const TRIBES: Record<Lang, string[]> = {
  ru: ['Йеґуда', 'Иссахар', 'Звулун', 'Реувен', 'Шимон', 'Гад', 'Эфраим', 'Менаше', 'Биньямин', 'Дан', 'Ашер', 'Нафтали'],
  en: ['Yehudah', 'Yissachar', 'Zevulun', 'Reuven', 'Shimon', 'Gad', 'Ephraim', 'Menasheh', 'Binyamin', 'Dan', 'Asher', 'Naftali'],
  de: ['Jehuda', 'Jissachar', 'Swulun', 'Reuwen', 'Schimon', 'Gad', 'Efraim', 'Menasche', 'Binjamin', 'Dan', 'Ascher', 'Naftali'],
};
/** the month and the tribe of hour 1…12 in the language of the page (`he` — in Hebrew) */
export function hourNames(hour: number, ui: string): { month: string; tribe: string } {
  const h = hourSign(hour);
  const i = HOUR_SIGNS.indexOf(h);
  if (!(ui in MONTHS)) return ui === 'he' ? { month: h.monthHe, tribe: h.tribeHe } : { month: MONTHS.en[i], tribe: TRIBES.en[i] };
  return { month: MONTHS[ui as Lang][i], tribe: TRIBES[ui as Lang][i] };
}

export const KMINI_KEY = 'niflaot:clock-kmini';
export const loadKmini = (): boolean => {
  try {
    return localStorage.getItem(KMINI_KEY) !== '0';
  } catch {
    return true;
  }
};
