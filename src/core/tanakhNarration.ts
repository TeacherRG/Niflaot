/**
 * «Слушать» for the passage of the day of the Prophets / Writings (TanakhPage.tsx): the verses in translation, each
 * with Metzudat David's explanation, chapter by chapter. Built from the day's file public/tanakh/<date>.json — in the
 * browser (the page has it loaded) and in the worker (assistant/src/tts.ts fetches the same file from the site), so the
 * parts and their addresses (`partHash`) come out the same in both, and the worker speaks only the site's own text.
 * The Hebrew verse is not read aloud: the translation and the explanation are. The project's translation is read
 * where the whole day is translated (as on the page), otherwise English (JPS).
 */
import { BOOKS, type Section } from './tanakhCycle';
import { MAX_PART, NARRATION_VERSION, paragraphs, partHash, sentence, spoken, type Narration, type NarrationLang, type NarrationPart } from './speech';

/** what is read of a day's file (DayContent of src/core/tanakh.ts — not imported: that module is the browser's) */
interface DayVerse {
  b: string;
  c: number;
  v: number;
  en: string;
  ru?: string;
  de?: string;
  md?: { ru?: string[]; en?: string[]; de?: string[] };
}
export type SpokenDay = Record<Section, { verses: DayVerse[] }>;

const SECTION_NAME = {
  neviim: { ru: 'Пророки', en: 'The Prophets', de: 'Die Propheten' },
  ketuvim: { ru: 'Писания', en: 'The Writings', de: 'Die Schriften' },
} as const;
const CHAPTER = { ru: 'глава', en: 'chapter', de: 'Kapitel' } as const;
const MD = { ru: 'Мецудат Давид', en: 'Metzudat David', de: 'Metzudat David' } as const;

/** the slug of a day's section at the worker: `neviim-2026-10-22` */
export const tanakhSlug = (section: Section, date: string) => `${section}-${date}`;
export const parseTanakhSlug = (slug: string) => {
  const m = slug.match(/^(neviim|ketuvim)-(\d{4}-\d{2}-\d{2})$/);
  return m ? { section: m[1] as Section, date: m[2] } : null;
};

/** the language the day is read in: the project's translation where the whole day has it (both sections), else English */
export const tanakhLang = (day: SpokenDay, locale: string): NarrationLang => {
  const l = locale === 'ru' || locale === 'de' ? locale : 'en';
  if (l === 'en') return 'en';
  return (['neviim', 'ketuvim'] as const).every((s) => day[s].verses.every((v) => v[l])) ? l : 'en';
};

const verseText = (v: DayVerse, lang: NarrationLang) => (lang === 'en' ? v.en : v[lang]) ?? '';

/** the parts of one section of a day in `lang` (as `tanakhLang` chose it); null — nothing to read */
export async function tanakhNarration(day: SpokenDay, section: Section, lang: NarrationLang): Promise<Narration | null> {
  const verses = day[section]?.verses ?? [];
  if (!verses.length) return null;
  const name = (slug: string) => BOOKS.find((b) => b.slug === slug)?.name[lang] ?? slug;
  const parts: Omit<NarrationPart, 'h'>[] = [];
  let text = '';
  let first: DayVerse | null = null;
  let last: DayVerse | null = null;
  const label = () =>
    !first || !last ? '' : `${name(first.b)} ${first.c}:${first.v}${first === last ? '' : first.c === last.c ? `–${last.v}` : `–${last.c}:${last.v}`}`;
  const flush = () => {
    if (text) parts.push({ label: label(), text });
    text = '';
    first = last = null;
  };

  // the first part is short — the section and the range: playback starts at once
  const a = verses[0];
  const z = verses[verses.length - 1];
  parts.push({
    label: SECTION_NAME[section][lang],
    text: `${sentence(SECTION_NAME[section][lang])} ${sentence(`${name(a.b)} ${a.c}:${a.v}–${z.b === a.b ? '' : `${name(z.b)} `}${z.c}:${z.v}`)}`,
  });

  verses.forEach((v, i) => {
    const prev = verses[i - 1];
    const block = [
      ...(!prev || prev.b !== v.b || prev.c !== v.c ? [sentence(`${name(v.b)}, ${CHAPTER[lang]} ${v.c}`)] : []),
      ...paragraphs(verseText(v, lang)),
      ...(v.md?.[lang]?.length ? [`${MD[lang]}: ${v.md[lang]!.flatMap(paragraphs).join(' ')}`] : []),
    ]
      .map((p) => spoken(p, lang))
      .join('\n\n');
    if (text && text.length + block.length + 2 > MAX_PART) flush();
    text = text ? `${text}\n\n${block}` : block;
    first ??= v;
    last = v;
  });
  flush();
  return { v: NARRATION_VERSION, lang, parts: await Promise.all(parts.map(async (p) => ({ ...p, h: await partHash(lang, p.text) }))) };
}
