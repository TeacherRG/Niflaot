/**
 * «Святой язык — уроки» (src/core/lashon.ts; часть npm run check): на всех языках, у детей (буквы и слова Торы) и у
 * взрослых (буквы и слова Танаха) каждый урок каждого юнита на каждом уровне собирается много раз, и у каждого задания:
 *  - «выбрать» — 4 разных варианта, верный ровно один, у слов — без похожих (`alike`: один перевод не содержит другой);
 *  - «пары» — 3–5 пар, переводы и иврит разные;
 *  - «собери» — плитки содержат ответ, из ответа получается слово / фраза; у слова — без Имён через ׳ и -;
 *  - «пропущенная буква» — 4 разных варианта, верный — та самая буква слова;
 *  - «корень» — 4 разных корня, верный — корень слова;
 * урок — от 6 до 20 заданий; слияние прогресса (src/core/sync.ts) — больше из двух.
 */
import { LESSONS } from '../src/lessons';
import { torahWords } from '../src/core/torahWords';
import { abcUnits, alike, clusters, core, isRight, makeLesson, tanakhUnits, torahUnits, type Exercise, type Unit } from '../src/core/lashon';
import type { Dict, Word } from '../src/core/words';
import { mergeSnapshots } from '../src/core/sync';
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
    for (let level = 1; level <= 3; level++)
      for (let k = 0; k < TRIES; k++) {
        const lesson = makeLesson(u, level);
        const where = `${who} ${u.id} ур. ${level}`;
        if (lesson.length < 6 || lesson.length > 20) err(`${where}: заданий ${lesson.length}`);
        if (level === 1 && u.items.some((it) => !lesson.some((x) => x.t === 'intro' && x.item.key === it.key))) err(`${where}: не все слова представлены`);
        if (level > 1 && u.items.some((it) => !lesson.some((x) => 'item' in x && x.item.key === it.key))) err(`${where}: не все слова спрошены`);
        for (const ex of lesson) checkEx(u, ex, where);
      }
  }
}

const TR = { ru: trRu, en: trEn, de: trDe } as Record<string, Record<string, string>>;
const words = (wordsJson as unknown as { words: Word[]; total: number }).words;
for (const locale of ['ru', 'en', 'de'] as const) {
  checkUnits(abcUnits(locale), `буквы ${locale}`);
  checkUnits(torahUnits(torahWords(LESSONS, locale)), `слова Торы ${locale}`);
  const dict: Dict = { words, total: 0, rank: new Map(words.map((w, i) => [w.id, i + 1])), tr: TR[locale] };
  const tu = tanakhUnits(dict);
  if (tu.reduce((a, u) => a + u.items.length, 0) !== Object.keys(TR[locale]).length) err(`слова Танаха ${locale}: не все переведённые слова в юнитах`);
  checkUnits(tu, `слова Танаха ${locale}`);
}

// sync: the more ★ and points of the two
const m = mergeSnapshots(
  { 'niflaot:lashon': JSON.stringify({ u: { 'abc-1': 3, 'w-1': 1 }, xp: { '2026-10-25': 20 } }) },
  { 'niflaot:lashon': JSON.stringify({ u: { 'abc-1': 1, 'w-2': 2 }, xp: { '2026-10-25': 10, '2026-10-24': 15 } }) },
);
if (m['niflaot:lashon'] !== JSON.stringify({ u: { 'abc-1': 3, 'w-1': 1, 'w-2': 2 }, xp: { '2026-10-25': 20, '2026-10-24': 15 } })) err(`слияние «Святой язык»: ${m['niflaot:lashon']}`);

if (errors.size) {
  console.error(`Святой язык — уроки: ${errors.size} ошибок`);
  for (const e of [...errors].slice(0, 60)) console.error(' -', e);
  process.exit(1);
}
console.log('✓ «Святой язык — уроки»: юниты, задания и слияние прогресса');
