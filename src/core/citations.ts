/**
 * Ссылки ИИ-учителя на источники: в ответе стих пишется `[[Joshua 1:8]]` (название книги — как на Sefaria, по-английски;
 * так велит `SYSTEM` в assistant/src/index.ts). Чат (`Assistant.tsx`) показывает его названием на языке сайта и ссылкой:
 * Пророки и Писания — на день цикла с этим стихом на сайте (`#/verse/<книга>-<глава>-<стих>` → `VersePage`), Тора — на Sefaria.
 */
import { BOOKS, track, type Section } from './tanakhCycle';
import type { CycleDay } from './tanakhCycle';

const TORAH: Record<string, { ru: string; en: string; de: string }> = {
  genesis: { ru: 'Берешит', en: 'Bereishit', de: 'Bereschit' },
  exodus: { ru: 'Шмот', en: 'Shemot', de: 'Schemot' },
  leviticus: { ru: 'Ваикра', en: 'Vayikra', de: 'Wajikra' },
  numbers: { ru: 'Бемидбар', en: 'Bamidbar', de: 'Bamidbar' },
  deuteronomy: { ru: 'Дварим', en: 'Devarim', de: 'Dewarim' },
};

export interface Cite {
  label: string;
  href: string;
  external: boolean;
}

/** `[[…]]` в тексте ответа */
export const CITE = /\[\[([^\]\n]{2,60})\]\]/g;

/** «Joshua 1:8», «Psalms 16:7-9», «I Samuel 3:1», «Genesis 12:1» → ссылка; другое (не стих) — null: показывается текстом */
export function resolveCite(ref: string, locale: string): Cite | null {
  const m = ref.trim().match(/^(.+?)\s+(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/);
  if (!m) return null;
  const [, name, c, v, to] = m;
  const lang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const key = name.toLowerCase().replace(/\s+/g, ' ');
  const tail = `${c}:${v}${to ? `–${to}` : ''}`;
  const book = BOOKS.find((b) => b.sefaria.toLowerCase() === key || b.slug === key.replace(/ /g, '-'));
  if (book) {
    if (Number(c) > book.verses.length || Number(v) > book.verses[Number(c) - 1]) return null;
    return { label: `${book.name[lang]} ${tail}`, href: `#/verse/${book.slug}-${c}-${v}`, external: false };
  }
  const torah = TORAH[key];
  if (torah) return { label: `${torah[lang]} ${tail}`, href: `https://www.sefaria.org/${name.trim().replace(/\s+/g, '_')}.${c}.${v}${to ? `-${to}` : ''}?lang=bi`, external: true };
  return null;
}

/** день цикла и раздел, где читается стих Пророков или Писаний (`#/verse/…`) */
export function dayOfVerse(slug: string, chapter: number, verse: number, days: CycleDay[]): { section: Section; date: string } | null {
  const book = BOOKS.find((b) => b.slug === slug);
  if (!book) return null;
  const section = book.section;
  const i = track(section).findIndex((r) => r.book === book && r.chapter === chapter && r.verse === verse);
  if (i < 0) return null;
  const day = days.find((d) => d[section][0] <= i && i < d[section][1]);
  return day ? { section, date: day.date } : null;
}
