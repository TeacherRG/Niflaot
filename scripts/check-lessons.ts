/**
 * Checks every lesson's data and texts:  npm run check
 *  - the coach of every numeric step ends exactly at the step's answer
 *  - every option value (v) equals the real gematria of the option
 *  - every footnote mark points to one of the riddle's sources, every source has a mark (ru and en)
 *  - every source exists in src/sources/sefaria.json; non-Torah sources have a Russian translation;
 *    every source has a German one (Sefaria's or the project's, src/sources/de.ts);
 *    the project's English (src/sources/en.ts) has as many segments as the original
 *  - every lesson has texts in every language of src/i18n/config.ts
 *  - «Собери смысл»: every riddle and the lesson have a puzzle of 3–6 distinct pieces, the same count in every language;
 *    a `commentary` lesson (separate remarks, e.g. Baal HaTurim) has none
 *  - word cards don't show the answer of a choice or «Собери слово» step
 *  - letter steps: the letters the rule takes make the answer; «Найди букву» points at a real letter
 *  - every step has an estimate: average time 5–600 s and difficulty 1–3
 *  - Memo: 12 pairs, a picture memo/NN.png for each, every gematria (a = b = v) and letter hint (ר״ת, ס״ת, אותיות)
 *    computed from the real words, a source in sefaria.json, distinct word cards; texts in every language,
 *    picture explanations (caption) ≤ 45 characters, a `note` for a number without equal words
 *  - «Карточки» of a «Нифлаот Ребе» lesson: 12 pairs, every verse once (one explanation per verse), the card words
 *    in the verse's Hebrew, the explanation card ≤ 70 characters, a poem of 4–6 lines, texts in every language
 *  - every text edit of src/content/overrides.json (made on the site, #/admin) names an existing text
 *  - «Знаете ли вы?» (#/facts): every Hebrew word of the feed has a translation in the lesson glossary of every language,
 *    and every fact links to its place in the lesson (a riddle or a Memo pair)
 *  - texts rendered as HTML (lessons, UI, sources) carry no scripts, event handlers or javascript: links
 */
import { LESSONS } from '../src/lessons';
import { staleOverrides } from '../src/content';
import { gematria, gematriaMilui } from '../src/core/gematria';
import { coachResult } from '../src/core/coach';
import { letterStepError, plainWord, tapStepError } from '../src/core/letterPuzzle';
import { SOURCES } from '../src/sources';
import { PROJECT_RU } from '../src/sources/ru';
import { PROJECT_DE } from '../src/sources/de';
import { PROJECT_EN } from '../src/sources/en';
import { LOCALES } from '../src/i18n/config';
import { displayNames } from '../src/core/names';
import { collectFacts, factHebrew } from '../src/core/facts';
import type { PuzzleText } from '../src/lessons/types';
import { existsSync, readdirSync } from 'node:fs';
import ruUi from '../src/i18n/locales/ru';
import enUi from '../src/i18n/locales/en';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

function checkPuzzle(where: string, all: [string, PuzzleText | undefined][], commentary: boolean) {
  // a commentary lesson (separate remarks, e.g. Baal HaTurim) has nothing to chain: no puzzles at all
  if (commentary) {
    for (const [lang, p] of all) if (p) err(`${where} [${lang}]: a commentary lesson has no «Собери смысл» puzzle`);
    return;
  }
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
  if (!Number.isInteger(lesson.age) || lesson.age < 5 || lesson.age > 18)
    err(`${lesson.slug}: age needs the recommended minimum age, 5–18 (shown as «N+», open upward)`);
  for (const [lang, tx] of Object.entries(lesson.texts)) {
    if (tx && !tx.audience?.trim()) err(`${lesson.slug} [${lang}]: audience — who the lesson suits and why`);
  }
  lesson.riddles.forEach((r, ri) => {
    const where = (i?: number) => `${lesson.slug} · riddle ${ri + 1}${i === undefined ? '' : ` · step ${i + 1}`}`;
    r.steps.forEach((s, i) => {
      if (!(s.est.sec >= 5 && s.est.sec <= 600) || ![1, 2, 3].includes(s.est.level))
        err(`${where(i)}: est needs sec 5–600 and level 1–3 (average time and difficulty of the step)`);
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
      } else if (s.t === 'lt') {
        const e = letterStepError(s.from, s.take, s.a);
        if (e) err(`${where(i)}: ${e}`);
      } else if (s.t === 'tap') {
        const e = tapStepError(s.word, s.a, s.written);
        if (e) err(`${where(i)}: ${e}`);
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
      if (src && PROJECT_EN[id] && PROJECT_EN[id].length !== src.he.length)
        err(`${where()}: ${id} — ${PROJECT_EN[id].length} English segments for ${src.he.length} original ones`);
    }
    r.steps.forEach((s, i) => {
      if (s.t === 'ch' && r.words.includes(s.opts[s.c].h)) err(`${where(i)}: the answer ${s.opts[s.c].h} is shown on a word card`);
      if (s.t === 'lt' && r.words.some((w) => plainWord(w) === plainWord(s.a))) err(`${where(i)}: the answer ${s.a} is shown on a word card`);
    });
    checkPuzzle(where(), Object.entries(lesson.texts).map(([l, tx]) => [l, tx!.riddles[ri].puzzle]), lesson.kind === 'commentary');
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

for (const lesson of LESSONS)
  checkPuzzle(`${lesson.slug} · final`, Object.entries(lesson.texts).map(([l, tx]) => [l, tx!.puzzle]), lesson.kind === 'commentary');

// Memo: every number and letter hint is computed, every pair has its picture
for (const lesson of LESSONS) {
  const m = lesson.memo;
  if (!m) continue;
  const where = (k: number) => `${lesson.slug} · memo ${k + 1}`;
  if (m.items.length !== 12) err(`${lesson.slug} · memo: ${m.items.length} pairs, 12 expected`);
  const dir = readdirSync('src/lessons').find((d) => d.endsWith(`-${lesson.slug}`));
  m.items.forEach((it, k) => {
    const pic = `src/lessons/${dir}/memo/${String(k + 1).padStart(2, '0')}.png`;
    if (!existsSync(pic)) err(`${where(k)}: no picture ${pic}`);
    for (const g of it.gematria ?? []) {
      if (gematria(g.a) !== g.v) err(`${where(k)}: ${g.a} = ${gematria(g.a)}, not ${g.v}`);
      if (g.b && gematria(g.b) !== g.v) err(`${where(k)}: ${g.b} = ${gematria(g.b)}, not ${g.v}`);
    }
    for (const l of it.letters ?? []) {
      const e = letterStepError(l.from, l.take, l.word);
      if (e) err(`${where(k)}: ${l.kind} ${l.from} → ${l.word}: ${e}`);
    }
    if (!SOURCES[it.source]) err(`${where(k)}: source ${it.source} is not in sefaria.json`);
    if (![it.verse, it.quote].every((x) => x.trim())) err(`${where(k)}: empty Hebrew words or quote`);
    for (const [lang, tx] of Object.entries(lesson.texts)) {
      const mt = tx?.memo?.items[k];
      if (!mt) continue;
      if (![mt.title, mt.caption, mt.verse, mt.quote, mt.explain, mt.moral].every((x) => x.trim())) err(`${where(k)} [${lang}]: empty text`);
      if (mt.caption.length > 45) err(`${where(k)} [${lang}]: the picture explanation (caption) is longer than 45 characters`);
      if (it.gematria?.some((g) => !g.b) && !mt.note?.trim()) err(`${where(k)} [${lang}]: a number without equal words needs \`note\` — what it stands for`);
    }
  });
  for (const [lang, tx] of Object.entries(lesson.texts)) {
    if (!tx?.memo) err(`${lesson.slug} · memo [${lang}]: no texts (memo in i18n/${lang}.ts)`);
    else if (tx.memo.items.length !== m.items.length) err(`${lesson.slug} · memo [${lang}]: ${tx.memo.items.length} texts for ${m.items.length} pairs`);
  }
  if (new Set(m.items.map((it) => it.verse)).size !== m.items.length) err(`${lesson.slug} · memo: two word cards are the same`);
}

// «Карточки» of a «Нифлаот Ребе» lesson: 12 verses, each once, each in its Sefaria verse; texts in every language
for (const lesson of LESSONS) {
  const c = lesson.cards;
  if (!c) continue;
  const where = (k: number) => `${lesson.slug} · cards ${k + 1}`;
  if (c.items.length !== 12) err(`${lesson.slug} · cards: ${c.items.length} pairs, 12 expected`);
  const plain = (x: string) => x.replace(/[\u0591-\u05C7]/g, '').replace(/[^א-ת׳ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  c.items.forEach((it, k) => {
    const src = SOURCES[it.source];
    if (!src) err(`${where(k)}: source ${it.source} is not in sefaria.json`);
    else if (!plain(src.he.join(' ')).includes(plain(displayNames(it.verse)))) err(`${where(k)}: «${it.verse}» is not in ${src.ref}`);
    if (!(it.ls.vol > 0 && it.ls.sicha > 0)) err(`${where(k)}: Likkutei Sichos volume and talk needed`);
    for (const [lang, tx] of Object.entries(lesson.texts)) {
      const ct = tx?.cards?.items[k];
      if (!ct) continue;
      if (![ct.title, ct.verse, ct.card, ct.explain, ct.horaah].every((x) => x.trim())) err(`${where(k)} [${lang}]: empty text`);
      if (!(ct.poem?.length >= 4 && ct.poem.length <= 6) || ct.poem.some((x) => !x.trim() || /[<>]/.test(x)))
        err(`${where(k)} [${lang}]: the poem («Запомнить в стихах») needs 4–6 non-empty plain lines`);
      if (ct.card.length > 70) err(`${where(k)} [${lang}]: the explanation card is longer than 70 characters (${ct.card.length})`);
    }
  });
  // one explanation per verse: every verse once
  if (new Set(c.items.map((it) => it.source)).size !== c.items.length) err(`${lesson.slug} · cards: a verse has two explanations — keep one`);
  for (const [lang, tx] of Object.entries(lesson.texts)) {
    if (!tx?.cards) err(`${lesson.slug} · cards [${lang}]: no texts (cards in i18n/${lang}.ts)`);
    else if (tx.cards.items.length !== c.items.length) err(`${lesson.slug} · cards [${lang}]: ${tx.cards.items.length} texts for ${c.items.length} pairs`);
  }
}

// a «Нифлаот Ребе» talk has no gematria calculator and no word cards to count
for (const lesson of LESSONS) {
  if (lesson.series === 'rebbe' && lesson.kind !== 'sicha') err(`${lesson.slug}: a «Нифлаот Ребе» lesson is kind: 'sicha'`);
  if (lesson.kind === 'sicha' && lesson.riddles.some((r) => r.words.length)) err(`${lesson.slug}: a talk of the Rebbe has no gematria word cards`);
}

// HTML strings go to dangerouslySetInnerHTML: allow inline markup only
const UNSAFE = /<\s*(script|iframe|object|embed|style|form|link|meta|base)\b|\son[a-z]+\s*=|(href|src)\s*=\s*["']?\s*(javascript|data|vbscript):/i;
function checkHtml(where: string, v: unknown): void {
  if (typeof v === 'string') {
    if (UNSAFE.test(v)) err(`${where}: unsafe HTML (script, event handler or javascript: link)`);
  } else if (Array.isArray(v)) v.forEach((x, i) => checkHtml(`${where}[${i}]`, x));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) checkHtml(`${where}.${k}`, x);
}
for (const lesson of LESSONS) checkHtml(lesson.slug, lesson.texts);
for (const lesson of LESSONS) checkHtml(`${lesson.slug}.memo`, lesson.memo);
for (const lesson of LESSONS) checkHtml(`${lesson.slug}.cards`, lesson.cards);
checkHtml('ui.ru', ruUi);
checkHtml('ui.en', enUi);
checkHtml('sources', SOURCES);
checkHtml('sources.ru', PROJECT_RU);
checkHtml('sources.de', PROJECT_DE);
checkHtml('sources.en', PROJECT_EN);

// text edits made on the site must still name a text of the source files
for (const k of staleOverrides) err(`src/content/overrides.json: ${k} — no such text (the source changed); remove the edit`);

// «Знаете ли вы?»: the feed shows no explanations, so every Hebrew word in it carries its translation
const facts = collectFacts(LESSONS);
if (!facts.length) err('facts: the feed «Знаете ли вы?» is empty');
for (const f of facts) if (f.ri === undefined && f.mi === undefined) err(`${f.lesson.slug}: facts — «${f.kind === 'eq' ? f.q : f.from}» has no place in the lesson to link to`);
for (const f of facts)
  for (const loc of Object.keys(LOCALES) as (keyof typeof LOCALES)[]) {
    const g = f.lesson.texts[loc]?.glossary ?? {};
    for (const h of factHebrew(f)) if (!g[h]) err(`${f.lesson.slug}: facts — «${h}» has no translation in glossary (${loc})`);
  }

if (errors.length) {
  console.error(errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${LESSONS.length} lessons checked: coaches, option values, footnotes, sources, puzzles, memo, ${facts.length} facts, safe HTML`);
