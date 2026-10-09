import type { Locale } from '../i18n';

/**
 * Torah portions that group the lessons in the menu and the catalog, in Torah order.
 * To add a portion: add it here and set `parsha` on its lessons. `shabbat` — the Shabbat the portion is read
 * (YYYY-MM-DD; the printouts show it as the civil and the Jewish date).
 */
export const PARSHIOT = {
  bereshit: { he: 'בראשית', name: { ru: 'Берейшит', en: 'Bereshit', de: 'Bereschit' }, year: 5787, heYear: 'ה׳תשפ״ז', shabbat: '2026-10-10' },
} satisfies Record<
  string,
  { he: string; name: Partial<Record<Locale, string>> & { ru: string }; year: number; heYear: string; shabbat: string }
>;

export type ParshaId = keyof typeof PARSHIOT;
