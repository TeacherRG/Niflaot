import data from './sefaria.json';
import { PROJECT_RU } from './ru';
import type { Locale } from '../i18n';

export interface Source {
  kind: { ru: string; en: string };
  title: { ru: string; en: string };
  ref: string;
  url: string;
  he: string[];
  en: string[];
  ru?: string[];
  versions: Record<'he' | 'en' | 'ru', { title: string; license: string; source: string } | undefined>;
}

export const SOURCES = data as unknown as Record<string, Source>;

/** Translation for the reader's language: Sefaria’s own if it exists, else the project's (ru), else English. */
export function translation(s: Source, id: string, locale: Locale): { lines: string[]; by: 'sefaria' | 'project'; version?: string; license?: string } {
  if (locale === 'ru') {
    if (s.ru) return { lines: s.ru, by: 'sefaria', version: s.versions.ru?.title, license: s.versions.ru?.license };
    if (PROJECT_RU[id]) return { lines: PROJECT_RU[id], by: 'project' };
  }
  return { lines: s.en, by: 'sefaria', version: s.versions.en?.title, license: s.versions.en?.license };
}
