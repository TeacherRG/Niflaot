/**
 * Checks every lesson's data and texts:  npm run check
 *  - the coach of every numeric step ends exactly at the step's answer
 *  - every option value (v) equals the real gematria of the option
 *  - every footnote mark points to one of the riddle's sources, every source has a mark (ru and en)
 *  - every source exists in src/sources/sefaria.json; non-Torah sources have a Russian translation;
 *    every source has a German one (Sefaria's or the project's, src/sources/de.ts)
 *  - every lesson has texts in every language of src/i18n/config.ts
 *  - «Собери смысл»: every riddle and the lesson have a puzzle of 3–6 distinct pieces, the same count in every language
 *  - word cards don't show the answer of a choice step
 */
import { LESSONS } from '../src/lessons';
import { gematria, gematriaMilui } from '../src/core/gematria';
import { coachResult } from '../src/core/coach';
import { SOURCES } from '../src/sources';
import { PROJECT_RU } from '../src/sources/ru';
import { PROJECT_DE } from '../src/sources/de';
import { LOCALES } from '../src/i18n/config';
import type { PuzzleText } from '../src/lessons/types';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

function checkPuzzle(where: string, all: [string, PuzzleText | undefined][]) {
  const counts = new Set<number>();
  for (const [lang, p] of all) {
    if (!p) { err(`${where} [${lang}]: no puzzle («Собери смысл»)`); continue; }
    const n = p.pieces.length;
    counts.add(n);
    if (n < 3 || n > 6) err(`${where} [${lang}]: puzzle has ${n} pieces, 3–6 expected`);
    if (new Set(p.pieces).size !== n) err(`${where} [${lang}]: puzzle pieces repeat`);
    if (!p.q.trim() || !p.meaning.trim()) err(`${where} [${lang}]: puzzle needs the ordering principle (q) and the meaning`);
  }
  if (counts.size > 1) err(`${where}: puzzles have a different number of pieces in different languages`);
}

for (const lesson of LESSONS) {
  lesson.riddles.forEach((r, ri) => {
    const where = (i?: number) => `${lesson.slug} · riddle ${ri + 1}${i === undefined ? '' : ` · step ${i + 1}`}`;
    r.steps.forEach((s, i) => {
      if (s.t === 'num') {
        if (!s.coach) {
          if (!s.count) err(`${where(i)}: numeric step without coach (or mark a counting task with count: true)`);
        }
        else {
          try {
            const res = coachResult(s.coach);
            if (res !== s.a) err(`${where(i)}: coach ends at ${res}, answer is ${s.a}`);
          } catch (e) {
            err(`${where(i)}: ${(e as Error).message}`);
          }
        }
      } else {
        s.opts.forEach((o) => {
          if (o.v !== undefined && /[א-ת]/.test(o.h) && !/[+:×−]/.test(o.h)) {
            const g = s.milui ? gematriaMilui(o.h) : gematria(o.h);
            if (g !== o.v) err(`${where(i)}: option ${o.h} has v=${o.v}, gematria is ${g}`);
          }
        });
      }
    });
    for (const id of r.sources ?? []) {
      const src = SOURCES[id];
      if (!src) err(`${where()}: source ${id} missing in sefaria.json — run scripts/fetch-sources.py`);
      else if (!src.ru && !PROJECT_RU[id]) err(`${where()}: source ${id} has no Russian translation (src/sources/ru.ts)`);
      else if (!src.ru && PROJECT_RU[id].length !== src.he.length)
        err(`${where()}: ${id} — ${PROJECT_RU[id].length} Russian segments for ${src.he.length} original ones`);
      if (src && !src.de && !PROJECT_DE[id]) err(`${where()}: source ${id} has no German translation (src/sources/de.ts)`);
      else if (src && src.de && src.de.length !== src.he.length) err(`${where()}: ${id} — ${src.de.length} German segments for ${src.he.length} original ones`);
      else if (src && !src.de && PROJECT_DE[id].length !== src.he.length)
        err(`${where()}: ${id} — ${PROJECT_DE[id].length} German segments for ${src.he.length} original ones`);
    }
    r.steps.forEach((s, i) => {
      if (s.t === 'ch' && r.words.includes(s.opts[s.c].h)) err(`${where(i)}: the answer ${s.opts[s.c].h} is shown on a word card`);
    });
    checkPuzzle(where(), Object.entries(lesson.texts).map(([l, tx]) => [l, tx!.riddles[ri].puzzle]));
    for (const [lang, text] of Object.entries(lesson.texts)) {
      const rt = text!.riddles[ri];
      const html = [rt.cond, rt.reveal.p, ...rt.lessons.map((l) => l.b)].join('\n');
      const marks = new Set([...html.matchAll(/<sup data-src="([^"]+)"><\/sup>/g)].map((m) => m[1]));
      for (const id of marks) if (!(r.sources ?? []).includes(id)) err(`${where()} [${lang}]: footnote ${id} is not in the riddle's sources`);
      for (const id of r.sources ?? []) if (!marks.has(id)) err(`${where()} [${lang}]: source ${id} has no footnote in the text`);
    }
  });
}

for (const lesson of LESSONS)
  for (const l of Object.keys(LOCALES)) if (!(l in lesson.texts)) err(`${lesson.slug}: no texts in ${l} (src/lessons/<lesson>/i18n/${l}.ts)`);

for (const lesson of LESSONS) checkPuzzle(`${lesson.slug} · final`, Object.entries(lesson.texts).map(([l, tx]) => [l, tx!.puzzle]));

if (errors.length) {
  console.error(errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${LESSONS.length} lessons checked: coaches, option values, footnotes, sources, puzzles`);
