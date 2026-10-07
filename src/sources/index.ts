import data from './sefaria.json';
import { PROJECT_RU } from './ru';
import { PROJECT_DE } from './de';
import type { Locale } from '../i18n';

/** Languages a source can carry besides Hebrew; English is always there. */
type Lang = 'en' | 'ru' | 'de';

export interface Source {
  kind: Record<'ru' | 'en', string> & Partial<Record<Lang, string>>;
  title: Record<'ru' | 'en', string> & Partial<Record<Lang, string>>;
  ref: string;
  url: string;
  he: string[];
  en: string[];
  ru?: string[];
  de?: string[];
  versions: Partial<Record<'he' | Lang, { title: string; license: string; source: string }>>;
}

export const SOURCES = data as unknown as Record<string, Source>;

/** The project's own translations for passages Sefaria has no version of in that language. */
export const PROJECT: Partial<Record<Locale, Record<string, string[]>>> = { ru: PROJECT_RU, de: PROJECT_DE };

/** Kind and title of a source in the reader's language (English if there is none). */
export const sourceLabel = (s: Source, locale: Locale) => ({
  kind: s.kind[locale as Lang] ?? s.kind.en,
  title: s.title[locale as Lang] ?? s.title.en,
});

/** Translation for the reader's language: Sefaria’s own if it exists, else the project's, else English. */
export function translation(s: Source, id: string, locale: Locale): { lines: string[]; by: 'sefaria' | 'project'; version?: string; license?: string } {
  if (locale !== 'en') {
    const own = s[locale as Lang];
    if (own) return { lines: own, by: 'sefaria', version: s.versions[locale as Lang]?.title, license: s.versions[locale as Lang]?.license };
    const project = PROJECT[locale]?.[id];
    if (project) return { lines: project, by: 'project' };
  }
  return { lines: s.en, by: 'sefaria', version: s.versions.en?.title, license: s.versions.en?.license };
}
