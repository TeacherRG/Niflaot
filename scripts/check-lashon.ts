/**
 * «Святой язык — уроки» (src/core/lashon.ts; часть npm run check): на всех языках, у детей (буквы и слова Торы) и у
 * взрослых (буквы и слова Танаха) каждый урок каждого юнита на каждом уровне собирается много раз, и у каждого задания:
 *  - «выбрать» — 4 разных варианта, верный ровно один, у слов — без похожих (`alike`: один перевод не содержит другой);
 *  - «пары» — 3–5 пар, переводы и иврит разные;
 *  - «собери» — плитки содержат ответ, из ответа получается слово / фраза / стих («Составьте стих»: короткий, 3–8 слов, с переводом, со словом урока); у слова — без Имён через ׳ и -;
 *  - «пропущенная буква» — 4 разных варианта, верный — та самая буква слова;
 *  - «корень» — 4 разных корня, верный — корень слова;
 * уроки с новым — по порядку, без слов из «Моих слов» / «Слов Торы» и уже встреченных; экзамен за юнит — без знакомства, слова всего юнита; юнит — буквы (2), глава Торы, уровень из 50 слов Танаха; урок с новым знакомит со всеми своими словами; урок — от 6 до 20 заданий; слияние прогресса (src/core/sync.ts) — больше из двух.
 */
import { LESSONS } from '../src/lessons';
import { torahWords } from '../src/core/torahWords';
import { abcUnits, alike, clusters, core, isRight, finishLesson, isDone, isOpen, makeExam, makeLesson, newItems, nextPart, passExam, readCourse, EXAM_ITEMS, type CourseStore, torahVerses, verseOf, VERSE_MAX, VERSE_MAX_KIDS, VERSE_MIN, type Item, type Known, tanakhUnits, torahUnits, type Exercise, type Unit } from '../src/core/lashon';
import { exampleOf, type Dict, type Word } from '../src/core/words';
import { readFileSync } from 'node:fs';
import { mergeSnapshots } from '../src/core/sync';
import { SOURCES, translation } from '../src/sources';
import wordsJson from '../src/tanakh/words.json';
import trRu from '../src/tanakh/words/ru.json';
import trEn from '../src/tanakh/words/en.json';
import trDe from '../src/tanakh/words/de.json';

const errors = new Set<string>();
const err = (s: string) => errors.add(s);
const TRIES = 5;

function checkEx(u: Unit, ex: Exercise, where: string) {
  const w = u.track === 'words';
  switch (ex.t) {
    case 'intro':
      if (!ex.item.he || !ex.item.tr) err(`${where}: знакомство без иврита или перевода (${ex.item.key})`);
      return;
    case 'pick': {
      const keys = ex.options.map((o) => o.key);
      const lbl = ex.options.map((o) => (ex.ask === 'tr' ? core(o.tr) : ex.ask === 'he' ? core(o.he) : ex.ask === 'value' ? String(o.value) : o.sound));
      if (ex.options.length !== 4 || new Set(keys).size !== 4 || new Set(lbl).size !== 4) err(`${where}: «выбрать» (${ex.ask}) ${ex.item.he} — не 4 разных варианта: ${lbl.join(' | ')}`);
      if (keys.filter((k) => k === ex.item.key).length !== 1 || !isRight(ex, ex.item.key)) err(`${where}: «выбрать» ${ex.item.he} — верный не один`);
      if (w)
        for (const o of ex.options) if (o.key !== ex.item.key && alike(o, ex.item)) err(`${where}: «выбрать» ${ex.item.he} — похожий вариант ${o.he} «${o.tr}»`);
      return;
    }
    case 'match': {
      if (ex.pairs.length < 3 || ex.pairs.length > 5) err(`${where}: «пары» — ${ex.pairs.length}`);
      if (new Set(ex.pairs.map((p) => core(p.tr))).size !== ex.pairs.length || new Set(ex.pairs.map((p) => p.he)).size !== ex.pairs.length)
        err(`${where}: «пары» — одинаковые: ${ex.pairs.map((p) => `${p.he}=${p.tr}`).join(', ')}`);
      return;
    }
    case 'build': {
      const bag = [...ex.tiles];
      for (const a of ex.answer) {
        const k = bag.indexOf(a);
        if (k < 0) err(`${where}: «собери» ${ex.item.he} — нет плитки ${a}`);
        else bag.splice(k, 1);
      }
      const made = ex.words ? ex.answer.join(' ') : ex.answer.join('');
      if (made !== ex.item.he) err(`${where}: «собери» ${ex.item.he} — из ответа выходит ${made}`);
      if (!ex.words && /[׳\-־]/.test(ex.item.he)) err(`${where}: «собери» — Имя по буквам: ${ex.item.he}`);
      if (!isRight(ex, ex.answer)) err(`${where}: «собери» ${ex.item.he} — ответ не засчитан`);
      return;
    }
    case 'gap': {
      const right = ex.parts[ex.at];
      if (ex.parts.join('') !== ex.item.he) err(`${where}: «пропуск» ${ex.item.he} — части не те`);
      if (ex.options.length !== 4 || new Set(ex.options).size !== 4 || ex.options.filter((o) => o === right).length !== 1) err(`${where}: «пропуск» ${ex.item.he} — варианты ${ex.options.join(' ')}`);
      if (ex.options.some((o) => clusters(o).length !== 1)) err(`${where}: «пропуск» ${ex.item.he} — вариант не одна буква`);
      return;
    }
    case 'root':
      if (ex.options.length !== 4 || new Set(ex.options).size !== 4 || !ex.options.includes(ex.item.root!)) err(`${where}: «корень» ${ex.item.he} — варианты ${ex.options.join(' ')}`);
      return;
  }
}

function checkUnits(units: Unit[], who: string) {
  if (!units.length) err(`${who}: нет юнитов`);
  const ids = units.map((u) => u.id);
  if (new Set(ids).size !== ids.length) err(`${who}: id юнитов повторяются`);
  for (const u of units) {
    if (!u.items.length) err(`${who} ${u.id}: пустой юнит`);
    if (u.size < 1 || u.size > 6) err(`${who} ${u.id}: новых в уроке — ${u.size}`);
    for (let k = 0; k < TRIES; k++) {
      const exam = makeExam(u);
      const where = `${who} ${u.id} экзамен`;
      if (exam.length < 8 || exam.length > 20 || exam.some((x) => x.t === 'intro')) err(`${where}: заданий ${exam.length} или есть знакомство`);
      if (new Set(exam.flatMap((x) => ('item' in x ? [x.item.key] : []))).size < Math.min(EXAM_ITEMS, u.items.length) - 1) err(`${where}: спрошено мало слов`);
      for (const ex of exam) checkEx(u, ex, where);
    }
    // the lessons in order: each brings the next new items, until none are left; then the two reviews
    const parts: Item[][] = [];
    const met: CourseStore = { s: {}, r: {}, xp: {} };
    for (let p = nextPart(u, met, () => false); p.length; p = nextPart(u, met, () => false)) {
      if (p.length < 3 && u.items.length >= 3) err(`${who} ${u.id}: урок с новым — ${p.length}`);
      parts.push(p);
      for (const it of p) met.s[it.key] = 1;
    }
    const lessons: [Item[] | null, boolean][] = [...parts.map((p): [Item[], boolean] => [p, false]), [null, false], [null, true]];
    lessons.forEach(([part, hard], step) => {
      for (let k = 0; k < (u.track === 'abc' || !part ? TRIES : 2); k++) {
        const lesson = makeLesson(u, part, hard);
        const where = `${who} ${u.id} урок ${step + 1}`;
        if (lesson.length < 6 || lesson.length > 20) err(`${where}: заданий ${lesson.length}`);
        if (part && part.some((it) => !lesson.some((x) => x.t === 'intro' && x.item.key === it.key))) err(`${where}: не все новые слова представлены`);
        for (const ex of lesson) checkEx(u, ex, where);
      }
    });
  }
}

const TR = { ru: trRu, en: trEn, de: trDe } as Record<string, Record<string, string>>;
const words = (wordsJson as unknown as { words: Word[]; total: number }).words;
for (const locale of ['ru', 'en', 'de'] as const) {
  checkUnits(abcUnits(locale), `буквы ${locale}`);
  // children: «Составьте стих» — the short Torah verses of the lessons' sources, each with a word of the unit in it
  const source = (id: string) => {
    const x = SOURCES[id];
    const tr = x && translation(x, id, locale).lines;
    return x && { torah: x.kind.en === 'Torah', ref: x.ref, title: x.title[locale] ?? x.title.en, he: x.he, tr: locale !== 'en' && tr === x.en ? [] : tr! };
  };
  const twu = torahUnits(torahWords(LESSONS, locale), torahVerses(LESSONS, source, locale));
  const kidsVerse = twu.flatMap((u) => u.items).filter((it) => it.verse);
  if (kidsVerse.length < 8) err(`слова Торы ${locale}: стихов для «Составьте стих» — ${kidsVerse.length}`);
  for (const it of kidsVerse) {
    const v = it.verse!;
    if (v.words.length < VERSE_MIN || v.words.length > VERSE_MAX_KIDS || !v.tr.trim() || /</.test(v.tr) || !/\d[:,]\d/.test(v.ref))
      err(`слова Торы ${locale}: стих ${v.ref} к ${it.he} — не тот`);
    if (!` ${v.words.join(' ')} `.includes(` ${it.he} `)) err(`слова Торы ${locale}: в стихе ${v.ref} нет слова ${it.he}`);
  }
  // every lesson of a portion with verses — the new words', a review, the exam — has one «Составьте стих»
  const hasVerse = (l: Exercise[]) => l.some((x) => x.t === 'build' && x.verse);
  for (const u of twu) {
    if (!u.verses?.length) err(`слова Торы ${locale}: у ${u.id} нет коротких стихов Торы`);
    for (let k = 0; k < 5; k++)
      if (!hasVerse(makeLesson(u, u.items.slice(0, 6))) || !hasVerse(makeLesson(u, null)) || !hasVerse(makeExam(u)))
        err(`слова Торы ${locale}: в уроке ${u.id} нет «Составьте стих»`);
  }
  checkUnits(twu, `слова Торы ${locale}`);
  const dict: Dict = { words, total: 0, rank: new Map(words.map((w, i) => [w.id, i + 1])), tr: TR[locale] };
  // «Составьте стих»: the example verses of the words (public/tanakh/words/examples-<lang>.json)
  const ex = JSON.parse(readFileSync(`public/tanakh/words/examples-${locale}.json`, 'utf8'));
  const tu = tanakhUnits(dict, (id) => verseOf(exampleOf(ex, id), locale));
  const withVerse = tu.flatMap((u) => u.items).filter((it) => it.verse);
  if (withVerse.length < 200) err(`слова Танаха ${locale}: стихов для «Составьте стих» — ${withVerse.length}`);
  for (const it of withVerse) {
    const v = it.verse!;
    if (v.words.length < VERSE_MIN || v.words.length > VERSE_MAX || !v.tr.trim() || v.words.some((w) => /[׃׀]/.test(w)))
      err(`слова Танаха ${locale}: стих ${v.ref} к ${it.he} — не тот`);
    const word = exampleOf(ex, it.key)!.he[1];
    if (!v.words.join(' ').includes(word)) err(`слова Танаха ${locale}: в стихе ${v.ref} нет слова ${word}`);
  }
  let verses = 0;
  for (const u of tu.slice(0, 4)) for (let k = 0; k < 5; k++) verses += makeLesson(u, null, true).filter((x) => x.t === 'build' && x.verse).length;
  if (!verses) err(`слова Танаха ${locale}: в повторениях нет «Составьте стих»`);
  if (tu.reduce((a, u) => a + u.items.length, 0) !== Object.keys(TR[locale]).length) err(`слова Танаха ${locale}: не все переведённые слова в юнитах`);
  checkUnits(tu, `слова Танаха ${locale}`);
}

// «Экзамен» сдан: юнит пройден целиком — следующий открыт (localStorage и события — заглушки)
{
  const mem = new Map<string, string>();
  Object.assign(globalThis, {
    localStorage: { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) },
    window: { dispatchEvent: () => true },
  });
  const none: Known = () => false;
  const units = abcUnits('ru');
  if (isOpen(units, 1, readCourse(), none)) err('экзамен: второй юнит букв открыт до экзамена');
  passExam(units[0]);
  if (!isOpen(units, 1, readCourse(), none) || !isDone(units[0], readCourse(), none)) err('экзамен: после сдачи следующий юнит не открыт');

  // уроки по порядку: после урока его слова встречались, следующий урок — со следующими
  const tu = tanakhUnits({ words, total: 0, rank: new Map(), tr: trRu as Record<string, string> });
  const first = nextPart(tu[0], readCourse(), none);
  finishLesson(tu[0], first, 10);
  const second = nextPart(tu[0], readCourse(), none);
  if (first.length !== 5 || second.length !== 5 || second.some((x) => first.includes(x))) err('уроки: второй урок повторяет слова первого');

  // слова из «Моих слов» — не новые: уровень, где знакомы все слова, сразу открывает следующий
  const deck = new Set(tu[0].items.map((x) => x.key));
  const known: Known = (k) => deck.has(k);
  if (newItems(tu[0], readCourse(), known).length || !isOpen(tu, 1, readCourse(), known)) err('уроки: знакомые слова из «Моих слов» не учтены');
  if (makeLesson(tu[0], nextPart(tu[0], readCourse(), known)).some((x) => x.t === 'intro')) err('уроки: знакомые слова снова «Новое слово»');
  const half = new Set(tu[1].items.slice(0, 10).map((x) => x.key));
  const p = nextPart(tu[1], readCourse(), (k) => half.has(k));
  if (p.some((x) => half.has(x.key)) || p[0] !== tu[1].items[10]) err('уроки: урок с новым начинается не с первого незнакомого слова');
}

// sync: every item met, the more reviews and points of the two
const m = mergeSnapshots(
  { 'niflaot:lashon': JSON.stringify({ s: { 'א': 1 }, r: { 'abc-1': 2, 't-1': 1 }, xp: { '2026-10-25': 20 } }) },
  { 'niflaot:lashon': JSON.stringify({ s: { '559': 1 }, r: { 'abc-1': 1, 't-2': 2 }, xp: { '2026-10-25': 10, '2026-10-24': 15 } }) },
);
if (m['niflaot:lashon'] !== JSON.stringify({ s: { 'א': 1, '559': 1 }, r: { 'abc-1': 2, 't-1': 1, 't-2': 2 }, xp: { '2026-10-25': 20, '2026-10-24': 15 } })) err(`слияние «Святой язык»: ${m['niflaot:lashon']}`);

if (errors.size) {
  console.error(`Святой язык — уроки: ${errors.size} ошибок`);
  for (const e of [...errors].slice(0, 60)) console.error(' -', e);
  process.exit(1);
}
console.log('✓ «Святой язык — уроки»: юниты, задания и слияние прогресса');
