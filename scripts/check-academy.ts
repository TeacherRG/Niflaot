/**
 * «Академия» и «Вопросы к отрывку» (часть npm run check):
 *  - src/tanakh/quiz/<дата>.json: дата — учебный день цикла; у каждого раздела 3–4 вопроса; вопрос — на стих этого
 *    раздела этого дня (`ref`: «joshua 2:18»); 3–4 варианта, верный — первый, варианты разные; тексты на ru, en, de;
 *    Имена — Б-г, Г-сподь, G-d, L-rd, G-tt; английский и немецкий — по docs/TRANSLATION-GUIDE.md (scripts/style-rules.ts);
 *  - главы Торы (src/lessons/parshiot.ts) — из списка TORAH_BOOKS (src/core/academy.ts), у каждой — книга;
 *  - правила сертификатов: PASS, книга открывается последней главой, результат дня считается лучшим.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { PARSHIOT } from '../src/lessons/parshiot';
import { LESSONS } from '../src/lessons';
import { BOOKS, track, type Section } from '../src/core/tanakhCycle';
import {
  PASS,
  TORAH_BOOKS,
  bookDays,
  bookOfParsha,
  lessonMax,
  tanakhProgress,
  torahBookComplete,
  torahCertificates,
  torahProgress,
  type QuizStore,
} from '../src/core/academy';
import { styleErrors } from './style-rules';
import cycleJson from '../src/tanakh/cycle.json';

const errors: string[] = [];
const err = (m: string) => errors.push(m);
const LANGS = ['ru', 'en', 'de'] as const;
const badRuName = (s: string) => /(^|[^\p{L}-])(Бог|Господ|Бож)/u.test(s);

const cycle = (cycleJson.days as [string, number, number, number, number][]).map(([date, na, nz, ka, kz]) => ({
  date,
  neviim: [na, nz] as [number, number],
  ketuvim: [ka, kz] as [number, number],
}));
const byDate = new Map(cycle.map((d) => [d.date, d]));

// «Вопросы к отрывку»
const dir = new URL('../src/tanakh/quiz/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
let questions = 0;
for (const f of files) {
  const date = f.slice(0, -5);
  const day = byDate.get(date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !day) {
    err(`quiz/${f}: не учебный день цикла`);
    continue;
  }
  const quiz = JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
  for (const sec of ['neviim', 'ketuvim'] as Section[]) {
    const qs = quiz[sec];
    if (!Array.isArray(qs) || qs.length < 3 || qs.length > 4) {
      err(`quiz/${f} ${sec}: нужно 3–4 вопроса`);
      continue;
    }
    const t = track(sec);
    const [from, to] = day[sec];
    qs.forEach((q: any, i: number) => {
      const where = `quiz/${f} ${sec} #${i + 1}`;
      questions++;
      const m = /^([a-z-]+) (\d+):(\d+)$/.exec(q.ref ?? '');
      const k = m ? t.findIndex((v) => v.book.slug === m[1] && v.chapter === +m[2] && v.verse === +m[3]) : -1;
      if (k < from || k >= to) err(`${where}: ref «${q.ref}» — не стих этого отрывка`);
      if (!Array.isArray(q.o) || q.o.length < 3 || q.o.length > 4) err(`${where}: нужно 3–4 варианта`);
      for (const l of LANGS) {
        const texts = [q.q?.[l], ...(q.o ?? []).map((o: any) => o?.[l])];
        if (texts.some((x) => typeof x !== 'string' || !x.trim())) err(`${where}: нет текста на ${l}`);
        const opts = (q.o ?? []).map((o: any) => o?.[l]);
        if (new Set(opts).size !== opts.length) err(`${where}: одинаковые варианты на ${l}`);
        const all = texts.join(' ');
        if (l === 'ru' && badRuName(all)) err(`${where}: Имена по-русски — Б-г, Г-сподь`);
        if (l !== 'ru') for (const e of styleErrors(l, all)) err(`${where} (${l}): ${e}`);
        if (/<|javascript:/i.test(all)) err(`${where}: в тексте вопроса — только текст`);
      }
    });
  }
}

// главы Торы и книги
const known = TORAH_BOOKS.flatMap((b) => b.parshiot as readonly string[]);
if (known.length !== 54) err(`academy: в TORAH_BOOKS ${known.length} глав, а в Торе 54`);
if (new Set(known).size !== known.length) err('academy: главы в TORAH_BOOKS повторяются');
for (const id of Object.keys(PARSHIOT)) if (!bookOfParsha(id)) err(`academy: глава «${id}» не из списка TORAH_BOOKS (src/core/academy.ts)`);
if (bookOfParsha('vayakhel-pekudei') !== 'shemot' || bookOfParsha('noach') !== 'bereshit') err('academy: книга главы считается неверно');
if (torahBookComplete('bereshit', ['bereshit', 'noach']) || !torahBookComplete('bereshit', ['vayigash', 'vayechi'])) err('academy: книга открывается не последней главой');
if (!torahBookComplete('shemot', ['vayakhel-pekudei'])) err('academy: сдвоенная последняя глава не открывает книгу');

// правила сертификатов
const certs = torahCertificates(LESSONS);
for (const c of certs) {
  const max = c.lessons.reduce((a, l) => a + lessonMax(l), 0);
  const pass = Math.ceil(PASS * max);
  const full = torahProgress(c, (slug) => lessonMax(c.lessons.find((l) => l.slug === slug)!), true);
  if (!full.earned || full.got !== max) err(`academy ${c.id}: все очки — а сертификата нет`);
  if (torahProgress(c, () => 0, true).earned) err(`academy ${c.id}: сертификат без очков`);
  if (torahProgress(c, (slug) => lessonMax(c.lessons.find((l) => l.slug === slug)!), false).earned) err(`academy ${c.id}: сертификат до конца книги`);
  if (pass > max) err(`academy ${c.id}: порог больше максимума`);
}
const joshua = BOOKS.find((b) => b.slug === 'joshua')!;
const days = bookDays(joshua, cycle);
if (!days.length || days[0].date !== cycle[0].date) err('academy: дни книги Йеґошуа считаются неверно');
const all = (best: number): QuizStore => Object.fromEntries(days.map((d) => [`${d.date}:neviim`, { p: [0, 0, 0, 0], best, n: 4 }]));
const cert = { section: 'neviim' as Section, days };
if (!tanakhProgress(cert, all(3), () => true).earned) err('academy: 3 из 4 во всех днях — сертификат должен быть');
if (tanakhProgress(cert, all(2), () => true).earned) err('academy: 2 из 4 — сертификата быть не должно');
if (tanakhProgress(cert, all(4), (d) => d !== days[1].date).earned) err('academy: не все тесты книги готовы — сертификата быть не должно');
const missing = all(4);
delete missing[`${days[0].date}:neviim`];
if (tanakhProgress(cert, missing, () => true).earned) err('academy: пропущенный день — сертификата быть не должно');

if (errors.length) {
  console.error(`✗ Академия: ${errors.length} ошибок\n  ${errors.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Академия: ${certs.length} сертификатов Торы, вопросы к отрывкам — ${files.length} дней, ${questions} вопросов`);
