import type { Locale } from '../i18n';

/**
 * Torah portions that group the lessons in the menu and the catalog, in Torah order.
 * To add a portion: add it here and set `parsha` on its lessons.
 */
export const PARSHIOT = {
  bereshit: { he: 'בראשית', name: { ru: 'Берейшит', en: 'Bereshit' } },
} satisfies Record<string, { he: string; name: Partial<Record<Locale, string>> & { ru: string } }>;

export type ParshaId = keyof typeof PARSHIOT;
