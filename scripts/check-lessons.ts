/**
 * Checks every lesson's data and texts:  npm run check
 *  - the coach of every numeric step ends exactly at the step's answer
 *  - every option value (v) equals the real gematria of the option
 *  - every footnote mark points to one of the riddle's sources, every source has a mark (ru and en)
 *  - every source exists in src/sources/sefaria.json; non-Torah sources have a Russian translation
 */
import { LESSONS } from '../src/lessons';
import { gematria, gematriaMilui } from '../src/core/gematria';
import { coachResult } from '../src/core/coach';
import { SOURCES } from '../src/sources';
import { PROJECT_RU } from '../src/sources/ru';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

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
    }
    for (const [lang, text] of Object.entries(lesson.texts)) {
      const rt = text!.riddles[ri];
      const html = [rt.cond, rt.reveal.p, ...rt.lessons.map((l) => l.b)].join('\n');
      const marks = new Set([...html.matchAll(/<sup data-src="([^"]+)"><\/sup>/g)].map((m) => m[1]));
      for (const id of marks) if (!(r.sources ?? []).includes(id)) err(`${where()} [${lang}]: footnote ${id} is not in the riddle's sources`);
      for (const id of r.sources ?? []) if (!marks.has(id)) err(`${where()} [${lang}]: source ${id} has no footnote in the text`);
    }
  });
}

if (errors.length) {
  console.error(errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${LESSONS.length} lessons checked: coaches, option values, footnotes, sources`);
