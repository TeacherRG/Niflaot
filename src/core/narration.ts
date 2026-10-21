/**
 * «Слушать»: the text a lesson's read page is read aloud from (scripts/prerender.ts writes it to
 * dist/tts/<lang>/<slug>.json; the worker assistant/src/tts.ts records each part with Gemini TTS once).
 * The same order as the page: the title and the author, then chapter by chapter — the verse, the sections with
 * the commentator's words in translation (the Hebrew original is on the screen), the question to oneself; at the end —
 * «Ґораа ле-поаль». A part is a few paragraphs (≤ MAX_PART): the first one is short, so playback starts soon,
 * and a part is recorded in one go. Names of G-d are said as Chabad says them (`spoken`), never written out.
 */
import { quoteView, sectionQuotes } from './quotes';
import { group, NARRATION_VERSION, paragraphs, sentence, spoken, type Narration, type NarrationLang, type NarrationPart } from './speech';
import type { Lesson } from '../lessons/types';

export { MAX_PART, type Narration, type NarrationLang, type NarrationPart } from './speech';

/** UI words of the page, in the lesson's language */
export interface NarrationUi {
  chapter: (n: number, total: number) => string;
  reflection: string;
  practice: string;
}

/** `hashOf` — 16 hex of a part's text (sha-256 in scripts/prerender.ts) */
export function narration(lesson: Lesson, lang: NarrationLang, ui: NarrationUi, hashOf: (s: string) => string): Narration | null {
  const tx = lesson.texts[lang];
  if (!tx) return null;
  const parts: Omit<NarrationPart, 'h'>[] = [];
  const add = (label: string, paras: string[], ri?: number) =>
    group(paras.map((p) => spoken(p, lang)).filter(Boolean)).forEach((text) => parts.push({ label, text, ...(ri == null ? {} : { ri }) }));
  const heading = paragraphs(tx.hero.heading).join(' ');
  add(heading, [sentence(heading), sentence(paragraphs(tx.hero.author).join(' '))]);

  const sicha = lesson.kind === 'sicha';
  lesson.riddles.forEach((r, ri) => {
    const rt = tx.riddles[ri];
    const quotes = sectionQuotes(r, rt);
    const said = (qs: typeof quotes.cond) =>
      qs.flatMap((q) => {
        const v = quoteView(q, lang);
        return [sentence(v.title), ...v.segs.flatMap((s) => paragraphs(s.tr))];
      });
    const paras = [
      sentence(`${ui.chapter(ri + 1, lesson.riddles.length)}. ${rt.title}`),
      ...paragraphs(rt.cond),
      ...said(quotes.cond),
      ...(sicha ? [sentence(rt.reveal.h), ...paragraphs(rt.reveal.p)] : []),
      ...rt.lessons.flatMap((l, k) => [sentence(paragraphs(l.h).join(' ')), ...(sicha ? [] : said(quotes.lessons[k])), ...paragraphs(l.b)]),
      `${ui.reflection}: ${rt.reflection}`,
    ];
    add(rt.title, paras, ri);
  });

  // a lesson of cards only: the pairs «verse — the Rebbe's explanation»
  if (!lesson.riddles.length)
    (tx.cards?.items ?? []).forEach((c) => add(c.title, [sentence(c.title), ...paragraphs(c.verse), ...paragraphs(c.explain)]));

  add(ui.practice, [sentence(ui.practice.replace(/\s*·\s*/g, '. ')), ...paragraphs(tx.practice)]);
  return { v: NARRATION_VERSION, parts: parts.map((p) => ({ ...p, h: hashOf(`${NARRATION_VERSION}\n${lang}\n${p.text}`) })) };
}
