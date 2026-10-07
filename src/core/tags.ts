import { FALLBACK_LOCALE, type Locale } from '../i18n/config';
import { GLOSSARY } from '../i18n/glossary';
import { LESSONS, type Lesson } from '../lessons';
import type { LessonText } from '../lessons/types';

/**
 * Tag cloud of the catalog: glossary terms that occur in the lessons (sized by how often)
 * and the Hebrew words of the riddle cards (with their translation).
 */
export interface Tag {
  id: string;
  label: string;
  /** Hebrew word (styled and set right-to-left) */
  he: boolean;
  /** explanation: the glossary definition or the word's translation */
  def: string;
  /** lessons where the tag occurs, in lesson order */
  lessons: Lesson[];
  /** size level 1–5 */
  size: number;
}

const stripTags = (html: string) => html.replace(/<[^>]+>/g, ' ');

/** All plain text of a lesson in one language. */
function lessonCorpus(text: LessonText): string {
  const parts = [text.title, text.summary, text.hero.intro, text.practice];
  for (const r of text.riddles) {
    parts.push(r.title, r.cond, r.reveal.h, r.reveal.p, r.reflection, ...(r.takeaways ?? []));
    for (const l of r.lessons) parts.push(l.h, l.b);
  }
  return stripTags(parts.join('\n'));
}

/** «Парцуф» — «облик…» → Парцуф; “Or chozer” — … → Or chozer */
const termLabel = (def: string) => def.split(' — ')[0].replace(/[«»“”"]/g, '').trim();

const textOf = (l: Lesson, locale: Locale) => l.texts[locale] ?? l.texts[FALLBACK_LOCALE];

export function buildTags(locale: Locale): Tag[] {
  const raw: Omit<Tag, 'size'>[] = [];
  const weight = new Map<string, number>();
  const corpora = LESSONS.map((l) => [l, lessonCorpus(textOf(l, locale)!)] as const);

  for (const term of GLOSSARY[locale] ?? GLOSSARY[FALLBACK_LOCALE] ?? []) {
    const re = new RegExp(`(^|[^\\p{L}])${term.re}`, 'giu');
    let count = 0;
    const lessons: Lesson[] = [];
    for (const [l, text] of corpora) {
      const n = text.match(re)?.length ?? 0;
      if (n) lessons.push(l);
      count += n;
    }
    if (!count) continue;
    const id = `t:${term.re}`;
    raw.push({ id, label: termLabel(term.def), he: false, def: term.def, lessons });
    weight.set(id, count);
  }

  const words = new Map<string, { def: string; lessons: Lesson[]; count: number }>();
  for (const l of LESSONS) {
    const glossary = textOf(l, locale)!.glossary;
    for (const w of l.riddles.flatMap((r) => r.words)) {
      const e = words.get(w) ?? { def: glossary[w] ?? '', lessons: [], count: 0 };
      if (!e.lessons.includes(l)) e.lessons.push(l);
      e.count++;
      words.set(w, e);
    }
  }
  const terms = raw.map((t) => ({ ...t, size: 0 }));
  // terms: size by rank of frequency, the top fifth is the largest
  [...terms]
    .sort((a, b) => weight.get(b.id)! - weight.get(a.id)!)
    .forEach((t, i, all) => (t.size = 5 - Math.floor((i * 5) / all.length)));
  // Hebrew words: by how many riddles show the card, a little smaller than the main terms
  const hebrew: Tag[] = [];
  for (const [w, e] of words)
    if (e.def) hebrew.push({ id: `w:${w}`, label: w, he: true, def: `${w} — ${e.def}`, lessons: e.lessons, size: Math.min(4, e.count + 1) });

  // a stable mix: Hebrew words spread evenly among the terms
  const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const byHash = (a: Tag, b: Tag) => hash(a.id) - hash(b.id);
  terms.sort(byHash);
  hebrew.sort(byHash);
  const out: Tag[] = [];
  const total = terms.length + hebrew.length;
  for (let i = 0, ti = 0, hi = 0; i < total; i++) {
    const wantHe = hi < hebrew.length && (ti >= terms.length || (hi + 1) / hebrew.length <= (ti + 1) / terms.length);
    out.push(wantHe ? hebrew[hi++] : terms[ti++]);
  }
  return out;
}
