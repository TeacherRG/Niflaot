/**
 * Supported languages. To add a language:
 *   1. add it here,
 *   2. create `locales/<code>.ts` with the UI strings (type-checked against `ru`),
 *   3. optionally add lesson texts in `lessons/<lesson>/i18n/<code>.ts`
 *      (a lesson without a translation falls back to FALLBACK_LOCALE).
 */
export const LOCALES = {
  ru: { label: 'Русский', short: 'RU', dir: 'ltr' },
  en: { label: 'English', short: 'EN', dir: 'ltr' },
} as const;

export type Locale = keyof typeof LOCALES;

export const FALLBACK_LOCALE: Locale = 'ru';

export const isLocale = (v: unknown): v is Locale =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(LOCALES, v);
