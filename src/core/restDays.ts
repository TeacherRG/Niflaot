/**
 * Дни отдыха: Шабат, праздники диаспоры и 9 ава — без учёбы (цикл Пророков и Писаний, src/core/tanakhCycle.ts) и без
 * разрыва учебной серии (src/core/habit.ts). Отдельный маленький модуль: главной не нужен список книг Танаха.
 */
const heb = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Еврейская дата для `YYYY-MM-DD` (календарь браузера / Node, Intl). */
export function hebrewParts(iso: string) {
  const parts = heb.formatToParts(new Date(`${iso}T12:00:00Z`));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { year: Number(get('year')), month: get('month'), day: Number(get('day')) };
}

export const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();
export const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

const HOLIDAYS: Record<string, number[]> = { Tishri: [1, 2, 10, 15, 16, 22, 23], Nisan: [15, 16, 21, 22], Sivan: [6, 7] };

/** Почему в этот день нет чтения: 'shabbat', 'holiday', 'tishaBeAv' — или null (учебный день). */
export function restReason(iso: string): 'shabbat' | 'holiday' | 'tishaBeAv' | null {
  if (weekday(iso) === 6) return 'shabbat';
  const h = hebrewParts(iso);
  if (HOLIDAYS[h.month]?.includes(h.day)) return 'holiday';
  // 9 ава; когда оно в Шабат, пост — в воскресенье, 10 ава
  if (h.month === 'Av' && (h.day === 9 || (h.day === 10 && weekday(iso) === 0))) return 'tishaBeAv';
  return null;
}
