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
  de: { label: 'Deutsch', short: 'DE', dir: 'ltr' },
} as const;

export type Locale = keyof typeof LOCALES;

/** Language of a missing translation (texts are written in Russian first). */
export const FALLBACK_LOCALE: Locale = 'ru';

/** Interface language for a browser in a language the site does not have (Hebrew, French…). */
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (v: unknown): v is Locale =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(LOCALES, v);

/**
 * Interface languages: the content languages and Hebrew. Hebrew is an interface only (owner, 11.11.2026: «перевод
 * интерфейса»): menus, buttons and pages in Hebrew, right to left; the content without a Hebrew version — lessons,
 * translations of the Prophets, Chassidut — comes in English (`CONTENT_OF`), and a missing Hebrew string falls back to
 * English (`UI_FALLBACK`).
 */
export const UI_LOCALES = {
  ...LOCALES,
  he: { label: 'עברית', short: 'HE', dir: 'rtl' },
} as const;

export type UiLocale = keyof typeof UI_LOCALES;

export const isUiLocale = (v: unknown): v is UiLocale =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(UI_LOCALES, v);

/** The content language of an interface language. */
export const CONTENT_OF: Record<UiLocale, Locale> = { ru: 'ru', en: 'en', de: 'de', he: 'en' };
