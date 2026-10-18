/**
 * «Академия» и «Вопросы к отрывку» (часть npm run check):
 *  - src/tanakh/quiz/<дата>.json: дата — учебный день цикла; у каждого раздела 3–4 вопроса; вопрос — на стих этого
 *    раздела этого дня (`ref`: «joshua 2:18»); 3–4 варианта, верный — первый, варианты разные; тексты на ru, en, de;
 *    Имена — Б-г, Г-сподь, G-d, L-rd, G-tt; английский и немецкий — по docs/TRANSLATION-GUIDE.md (scripts/style-rules.ts);
 *  - главы Торы (src/lessons/parshiot.ts) — из списка TORAH_BOOKS (src/core/academy.ts), у каждой — книга;
 *  - правила сертификатов: PASS, книга открывается последней главой, результат дня считается лучшим; Пророки и
 *    Писания — 100 % прочитанных отрывков («Я прочитал(а)»), с баллами — если ещё и тесты ≥ PASS;
 *  - «Проверь себя» на страницах чтения (src/core/readCheck.ts): у каждого урока со страницей чтения ≥ 3 вопроса,
 *    у вопроса-карточки — 4 разных стиха и верный среди них, тексты на всех языках; сертификат Торы — и за чтение.
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
  type DoneStore,
  type QuizStore,
} from '../src/core/academy';
import { styleErrors } from './style-rules';
import { readQuestions, readScore, type ReadStore } from '../src/core/readCheck';
import { mergeSnapshots } from '../src/core/sync';
import { bookRoadmap, pctMilestones, stepCount, tanakhBookMilestones } from '../src/core/milestones';
import cycleJson from '../src/tanakh/cycle.json';
import { HEMSHECH, hsProgress } from '../src/core/hemshech';

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
const allRead: DoneStore = Object.fromEntries(days.map((d, i) => [`${d.date}:neviim`, 1_790_000_000 + i]));
// the certificate is for reading 100 % of the book's passages; with points — when the quizzes are passed too
const tp = (q: QuizStore, ready: (d: string) => boolean, r: DoneStore = allRead) => tanakhProgress(cert, q, ready, r);
if (!tp({}, () => false).earned || tp({}, () => false).scored) err('academy: все отрывки прочитаны — сертификат без баллов должен быть');
if (!tp(all(3), () => true).scored) err('academy: всё прочитано, 3 из 4 во всех днях — сертификат с баллами');
if (tp(all(2), () => true).scored || !tp(all(2), () => true).earned) err('academy: 2 из 4 — сертификат без баллов, не с баллами');
if (tp(all(4), (d) => d !== days[1].date).scored) err('academy: не все тесты книги готовы — баллов в сертификате быть не должно');
if (tp(all(4), () => true, {}).earned || tp(all(4), () => true, {}).scored) err('academy: ничего не прочитано — сертификата быть не должно, даже за тесты');
const missing = all(4);
delete missing[`${days[0].date}:neviim`];
if (tp(missing, () => true).scored) err('academy: пропущенный тест — баллов в сертификате быть не должно');
const oneLeft = { ...allRead, [`${days.at(-1)!.date}:neviim`]: -1_790_000_100 };
if (tp(all(4), () => true, oneLeft).earned) err('academy: прочитано меньше 100 % (галочку сняли) — сертификата быть не должно');
const rd = JSON.parse(
  mergeSnapshots(
    { 'niflaot:tanakh-done': JSON.stringify({ a: 100, b: -300, c: 5 }) },
    { 'niflaot:tanakh-done': JSON.stringify({ a: -50, b: 200, d: 7 }) },
  )['niflaot:tanakh-done'] ?? '{}',
);
if (rd.a !== 100 || rd.b !== -300 || rd.c !== 5 || rd.d !== 7) err('sync: «Я прочитал(а)» — с обоих устройств, у одного отрывка — более поздняя отметка');

/* «Мой путь по книгам»: the milestones in the account */
{
  // the books are the milestones: the roadmap of a section — every book once, in order, each with days
  for (const sec of ['neviim', 'ketuvim'] as Section[]) {
    const road = bookRoadmap(sec, {}, cycle, cycle[0].date);
    if (road.length !== BOOKS.filter((b) => b.section === sec).length || road.some((r) => !r.days.length)) err(`вехи-книги ${sec}: у каждой книги — дни цикла`);
    if (road[0].status !== 'now' || road.slice(1).some((r) => r.status !== 'next')) err(`вехи-книги ${sec}: в первый день читается первая книга, остальные впереди`);
  }
  const road = bookRoadmap('neviim', allRead, cycle, cycle[0].date);
  if (road[0].status !== 'done' || road[0].finishedAt !== Math.max(...Object.values(allRead))) err('вехи-книги: прочитанная книга — с датой последней отметки');
  if (bookRoadmap('neviim', { [`${days[3].date}:neviim`]: 5 }, cycle, '2020-01-01')[0].status !== 'now') err('вехи-книги: начатая книга — текущая');
  const half: DoneStore = Object.fromEntries(days.slice(0, stepCount(50, days.length)).map((d, i) => [`${d.date}:neviim`, 100 + i]));
  const bm = tanakhBookMilestones(half, days, 'neviim');
  if (bm[0].at === undefined || bm[1].at !== 100 + stepCount(50, days.length) - 1 || bm[2].at !== undefined) err('вехи книги: 50 % — дата отметки нужного по счёту отрывка');
  if (tanakhBookMilestones(allRead, days, 'neviim').some((m) => m.at === undefined)) err('вехи книги: всё прочитано — все вехи');
  if (pctMilestones(74).filter((m) => m.at !== undefined).length !== 2) err('вехи книги Торы: 74 % — две вехи');
}

/* «Проверь себя»: the reader's way to a Torah certificate */
let readQs = 0;
for (const l of LESSONS) {
  if (l.kind === 'sicha' && !l.cards) continue;
  const qs = readQuestions(l);
  readQs += qs.length;
  if (qs.length < 3) err(`${l.slug}: «Проверь себя» — меньше 3 вопросов (${qs.length}): сертификат за чтение будет слишком лёгким`);
  if (new Set(qs.map((q) => q.key)).size !== qs.length) err(`${l.slug}: «Проверь себя» — повторяются ключи вопросов`);
  // the right option must not always stand in one place
  if (qs.length >= 4 && new Set(qs.map((q) => q.c)).size < 2) err(`${l.slug}: «Проверь себя» — верный вариант всегда на одном месте`);
  for (const q of qs) {
    if (q.card !== undefined) {
      const o = q.opts;
      if (o.length !== 4 || new Set(o).size !== 4 || o[q.c] !== q.card) err(`${l.slug} ${q.key}: варианты карточки — 4 разных стиха, верный среди них`);
      for (const lang of LANGS) {
        const it = l.texts[lang]?.cards?.items;
        if (!it?.[q.card]?.card || o.some((x) => !it[x]?.verse)) err(`${l.slug} ${q.key}: нет текста карточки (${lang})`);
      }
    } else {
      const step = l.riddles[q.ri!].steps[q.si!];
      if (step.t !== 'ch' || q.opts[q.c] !== step.c || [...q.opts].sort().join() !== step.opts.map((_, i) => i).join())
        err(`${l.slug} ${q.key}: вопрос — не шаг-выбор загадки или варианты перепутаны`);
      for (const lang of LANGS) if (!l.texts[lang]?.riddles[q.ri!]?.steps[q.si!]?.q) err(`${l.slug} ${q.key}: нет текста вопроса (${lang})`);
    }
  }
}
const readAll = (right: number): ReadStore =>
  Object.fromEntries(LESSONS.map((l) => [l.slug, Object.fromEntries(readQuestions(l).map((q, i) => [q.key, i < right * readQuestions(l).length ? q.c : q.c === 0 ? 1 : 0]))]));
for (const c of certs) {
  const zero = () => 0;
  if (!torahProgress(c, zero, true, (l) => readScore(l, readAll(1))).earned) err(`${c.id}: всё прочитано и отвечено верно — сертификат должен быть`);
  if (torahProgress(c, zero, true, (l) => readScore(l, readAll(0.5))).earned) err(`${c.id}: верных 50 % — сертификата за чтение быть не должно`);
  if (torahProgress(c, zero, false, (l) => readScore(l, readAll(1))).earned) err(`${c.id}: книга не вся на сайте — сертификата быть не должно`);
  const part = readAll(1);
  const first = readQuestions(c.lessons[0])[0];
  if (first) delete part[c.lessons[0].slug][first.key];
  if (torahProgress(c, zero, true, (l) => readScore(l, part)).earned) err(`${c.id}: не все вопросы отвечены — сертификата быть не должно`);
}
const rm = JSON.parse(
  mergeSnapshots({ 'niflaot:torah-read': JSON.stringify({ a: { x: 1 }, b: { y: 0 } }) }, { 'niflaot:torah-read': JSON.stringify({ a: { x: 2, z: 0 } }) })['niflaot:torah-read'] ?? '{}',
);
if (rm.a?.x !== 2 || rm.a?.z !== 0 || rm.b?.y !== 0) err('sync: ответы «Проверь себя» с обоих устройств должны сохраниться (ответ аккаунта — первый)');

// «Хасидут»: сертификат маамара — все отрывки прочитаны; с баллами — и вопросы всех отрывков ≥ PASS
{
  const m = HEMSHECH.maamarim[0];
  const ids = m.passages.map((p) => p.id);
  const all = Object.fromEntries(ids.map((id) => [id, 100]));
  const quiz = Object.fromEntries(ids.map((id) => [id, { p: [], best: 3, n: 4 }]));
  if (hsProgress(m, {}, { ...all, [ids[0]]: -200 }).earned) err('hemshech: не все отрывки прочитаны — сертификата быть не должно');
  const r = hsProgress(m, {}, all);
  if (!r.earned || r.scored) err('hemshech: все отрывки прочитаны — сертификат без баллов');
  if (!hsProgress(m, quiz, all).scored) err('hemshech: прочитано и вопросы ≥ 70 % — сертификат с баллами');
  if (hsProgress(m, Object.fromEntries(ids.map((id) => [id, { p: [], best: 1, n: 4 }])), all).scored) err('hemshech: вопросы < 70 % — без баллов');
}

if (errors.length) {
  console.error(`✗ Академия: ${errors.length} ошибок\n  ${errors.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Академия: ${certs.length} сертификатов Торы (за игру или чтение, «Проверь себя» — ${readQs} вопросов), вопросы к отрывкам — ${files.length} дней, ${questions} вопросов`);
