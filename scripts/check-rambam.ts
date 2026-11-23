/**
 * «Мишне Тора — глава в день» (src/core/rambam.ts, scripts/fetch-rambam.py): the cycle, the chapter texts, the slides,
 * the dictionary of the words. Also exports `rambamAhead` — till when chapters with text / words / slides are ready (ahead.ts).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { BOOKS, addDays, chapterOn, heNum, wordKey, type RambamText, type Slide } from '../src/core/rambam';

const PUB = new URL('../public/rambam/', import.meta.url);
const read = <T>(p: string): T | null => (existsSync(new URL(p, PUB)) ? JSON.parse(readFileSync(new URL(p, PUB), 'utf8')) : null);
const dict: Record<string, unknown> = read('words/ru.json') ?? {};

/** the last day (from `from`) up to which every day passes `ok` */
function upTo(from: string, ok: (d: string) => boolean) {
  let d = from;
  let last = '—';
  for (let i = 0; i < 400 && ok(d); i++, d = addDays(d, 1)) last = d;
  return last;
}
const hasText = (d: string) => !chapterOn(d).book.path || existsSync(new URL(`text/${chapterOn(d).id}.json`, PUB));
const hasWords = (d: string) => {
  const t = read<RambamText>(`text/${chapterOn(d).id}.json`);
  return !!t && t.he.every((h) => h.split(/\s+/).every((w) => !wordKey(w) || wordKey(w) in dict));
};
const hasSlides = (d: string) => existsSync(new URL(`slides/${chapterOn(d).id}/slides.json`, PUB));
export const rambamAhead = (today: string) => ({ text: upTo(today, hasText), words: upTo(today, hasWords), slides: upTo(today, hasSlides) });

const errors: string[] = [];
if (BOOKS.reduce((a, b) => a + b.ch, 0) !== 1017) errors.push('the cycle is not 1017 days');
// 13–14 Kislev 5787 — chapters 13 and 14 of Forbidden Foods (as chabad.org, hebcal)
if (chapterOn('2026-11-23').id !== 'forbidden-foods-13' || chapterOn('2026-11-24').id !== 'forbidden-foods-14') errors.push('the cycle: 23.11.2026 must be Forbidden Foods 13');
if (heNum(15) !== 'טו' || heNum(16) !== 'טז' || heNum(28) !== 'כח') errors.push('heNum');
for (const f of readdirSync(new URL('text/', PUB))) {
  const t = read<RambamText>(`text/${f}`)!;
  if (!t.he.length || t.he.length !== t.en.length) errors.push(`${f}: Hebrew ${t.he.length}, English ${t.en.length} halachot`);
  if (t.he.some((h) => /[a-zA-Z<>]/.test(h))) errors.push(`${f}: Latin letters or tags in the Hebrew`);
  if (t.he.some((h) => /יהוה|אלהים/.test(h.replace(/[֑-ׇ]/g, '')))) errors.push(`${f}: a Name in full spelling (ה׳, אלקים — as in the lessons)`);
}
if (existsSync(new URL('slides/', PUB)))
  for (const id of readdirSync(new URL('slides/', PUB))) {
    const t = read<RambamText>(`text/${id}.json`);
    const s = read<{ slides: Slide[] }>(`slides/${id}/slides.json`)?.slides ?? [];
    if (!t) errors.push(`slides ${id}: no text of the chapter`);
    let last = 0;
    s.forEach((x, k) => {
      const at = `slides ${id} #${k + 1}`;
      if (!x.title || !x.text) errors.push(`${at}: no title / text (the alt of the image, the AI teacher)`);
      if (!existsSync(new URL(`slides/${id}/${x.img}`, PUB)) && !process.env.VITE_RAMBAM_SLIDES) errors.push(`${at}: no image ${x.img}`);
      if (!x.hl) return;
      const [a, b] = x.hl;
      if (!(a >= 1 && b >= a && (!t || b <= t.he.length))) errors.push(`${at}: halachot ${a}–${b} outside the chapter`);
      if (a <= last) errors.push(`${at}: halachot ${a}–${b} overlap the slide before (to ${last})`);
      last = b;
    });
    if (t && last && last !== t.he.length) errors.push(`slides ${id}: the last slide ends at halacha ${last} of ${t.he.length}`);
  }
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
if (import.meta.url === `file://${process.argv[1]}`) console.log(`rambam: OK (${readdirSync(new URL('text/', PUB)).length} chapters, ${Object.keys(dict).length} words)`);
