/**
 * The commentator's own words (Baal HaTurim, Rashi…) shown in the lesson sections — in «Читать», in «Урок открыт»
 * of the game, in print and on the static page: the original from sefaria.json with its translation.
 * Where they go: the riddle's `quotes` (one entry per section), else each commentary passage once,
 * in the section where it is first cited (or after the condition, if only there).
 */
import { SOURCES, parseQuote, sourceLabel, translation } from '../sources';
import type { Locale } from '../i18n';
import type { RiddleData, RiddleText } from '../lessons/types';

export interface QuoteRef {
  id: string;
  /** comments of the passage (0-based); all when absent */
  segs?: number[];
}

const marked = (html: string, ids: string[]) =>
  [...html.matchAll(/<sup data-src="([^"]+)"><\/sup>/g)].map((m) => m[1]).filter((id) => ids.includes(id) && SOURCES[id]?.kind.en === 'Commentary');

export function sectionQuotes(r: RiddleData, rt: RiddleText): { cond: QuoteRef[]; lessons: QuoteRef[][] } {
  if (r.quotes) return { cond: [], lessons: rt.lessons.map((_, k) => (r.quotes![k] ?? []).map(parseQuote)) };
  const ids = r.sources ?? [];
  const seen = new Set<string>();
  const first = (html: string) => marked(html, ids).filter((id) => !seen.has(id) && seen.add(id)).map((id) => ({ id }));
  return { cond: first(rt.cond), lessons: rt.lessons.map((l) => first(l.b)) };
}

/** A quote ready to show: title, link, the chosen comments (Hebrew + translation) and the corrected misprints. */
export function quoteView(q: QuoteRef, locale: Locale) {
  const s = SOURCES[q.id];
  const tr = translation(s, q.id, locale);
  const keep = (i: number) => !q.segs || q.segs.includes(i);
  const segs = s.he.map((he, i) => ({ he, tr: tr.lines[i] ?? '' })).filter((_, i) => keep(i));
  const fixes = (s.fixes ?? []).filter(([, to]) => s.he.some((h, i) => keep(i) && h.includes(to)));
  return { title: sourceLabel(s, locale).title, url: s.url, segs, fixes };
}
