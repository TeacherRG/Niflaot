/**
 * «Святой язык — уроки» (`#/lashon`, LashonPage.tsx): курс иврита по шагам, как в Duolingo. Путь из юнитов: «Буквы» —
 * два юнита (א–כ; ל–ת и конечные), потом слова — детям юнит на главу Торы (слова её уроков, src/core/torahWords.ts),
 * взрослым — уровень из 50 слов Танаха по частоте, как в «Моих словах» (src/core/words.ts, только переведённые).
 * Уроки юнита: сначала с новым (по 5–6 букв / слов: знакомство → выбрать перевод, пары, два вопроса по прошлым урокам) —
 * только с теми, что ещё не встречались: ни в курсе, ни в «Моих словах» (взрослые: слово в колоде, `inDeck`), ни в «Словах
 * Торы» (дети: у слова есть запись игры) — `known` на странице; знакомые слова идут в повторения и экзамен.
 * потом два «Повторения» вперемешку: перевод, наоборот, пары, собери из букв, порядок слов фразы, пропущенная буква,
 * число / звучание буквы, у взрослых во втором — корень. Урок — 10–15 заданий; ошибку задание повторяется в конце (один раз).
 * За урок — 10 очков опыта, без ошибок — 15; цель дня — `GOAL` очков. Юнит открыт, если в предыдущем юните той же
 * части не осталось новых (первый юнит части — всегда) — или сдан его «Экзамен» (`makeExam`: весь юнит сразу,
 * не больше `EXAM_LIVES` ошибок; сдан — юнит пройден целиком).
 *
 * localStorage `niflaot:lashon` = { s: { <буква / слово>: 1 — встречалось в курсе }, r: { <юнит>: пройдено повторений },
 * xp: { <дата>: очки } } — синхронизируется (src/core/sync.ts: всё из обоих, у юнита и у дня — больше из двух).
 */
import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/config';
import type { TorahWord } from './torahWords';
import type { Dict, Example } from './words';
import type { Lesson } from '../lessons/types';
import { BOOKS } from './tanakhCycle';
import { VALUES } from './gematria';
import { ALEPH_BET, FINAL_FORMS, FINALS, LOOKALIKES, letterName, letterSound } from './letterNames';
import { markStudied } from './habit';
import { localToday } from './tanakh';

/** Одно, что учим: буква или слово (фраза). */
export interface Item {
  key: string;
  he: string;
  tr: string;
  translit?: string;
  img?: string;
  root?: string;
  /** у буквы: её число и звучание */
  value?: number;
  sound?: string;
  /** короткий стих с этим словом — для «Составьте стих»: взрослым — Пророков / Писаний, детям — Торы из уроков главы */
  verse?: Verse;
}
export interface Verse {
  /** слова стиха на иврите (слова через макаф — одна плитка), без ׃ */
  words: string[];
  /** перевод стиха на языке сайта */
  tr: string;
  /** где — «Теґилим 2:5», «Берешит 1:3» (текстом: ссылка увела бы из урока) */
  ref: string;
}
/** «Составьте стих» — только короткие стихи */
export const VERSE_MAX = 8;
/** детям — стихи Торы до 10 слов: коротких в уроках главы мало */
export const VERSE_MAX_KIDS = 10;
export const VERSE_MIN = 3;
/** a verse for a word (scripts/fetch-words.py, examples-<lang>.json): short enough and translated into the site's language */
export function verseOf(ex: Example | undefined, lang: string): Verse | undefined {
  if (!ex || (ex.en && lang !== 'en')) return undefined;
  const words = ex.he.join('').replace(/[׃׀]/g, ' ').split(/\s+/).filter(Boolean);
  const [slug, cv] = ex.ref.split(' ');
  const book = BOOKS.find((b) => b.slug === slug);
  const ref = `${book ? book.name[lang === 'en' || lang === 'de' ? lang : 'ru'] : slug} ${cv}`;
  return words.length >= VERSE_MIN && words.length <= VERSE_MAX ? { words, tr: ex.tr, ref } : undefined;
}

/** a primary source of a lesson (src/sources/sefaria.json), as the page hands it: Torah or not, verses, translation lines */
export interface TorahSource {
  torah: boolean;
  /** «Genesis 2:21-22» */
  ref: string;
  /** «Берешит 2:21–22» */
  title: string;
  he: string[];
  tr: string[];
}
/**
 * Children: the short verses of the Torah quoted in a portion's lessons (the riddles' sources, the Rebbe's cards) — one
 * verse per line of the source, 3–10 words, with the translation in the site's language (`de` — «2,21»).
 */
export function torahVerses(lessons: Lesson[], source: (id: string) => TorahSource | undefined, lang: string): Map<string, Verse[]> {
  const out = new Map<string, Verse[]>();
  for (const l of lessons) {
    const ids = [...l.riddles.flatMap((r) => r.sources ?? []), ...(l.cards?.items.map((c) => c.source) ?? [])];
    for (const id of ids) {
      const s = source(id);
      const at = s?.ref.match(/(\d+):(\d+)/);
      if (!s?.torah || !at) continue;
      const book = s.title.replace(/\s[\d:,.–-]+$/, '');
      s.he.forEach((he, k) => {
        const words = he.replace(/[׃׀]/g, ' ').split(/\s+/).filter(Boolean);
        const tr = (s.tr[k] ?? '').replace(/<[^>]+>/g, '').trim();
        if (words.length < VERSE_MIN || words.length > VERSE_MAX_KIDS || !tr) return;
        const ref = `${book} ${at[1]}${lang === 'de' ? ',' : ':'}${Number(at[2]) + k}`;
        const list = out.get(l.parsha) ?? [];
        if (!list.some((v) => v.ref === ref)) list.push({ words, tr, ref });
        out.set(l.parsha, list);
      });
    }
  }
  return out;
}
export type Track = 'abc' | 'words';
export interface Unit {
  id: string;
  track: Track;
  /** номер юнита в своей части, с 1 (у детских слов — и глава Торы) */
  n: number;
  parsha?: string;
  items: Item[];
  /** сколько новых букв / слов в уроке */
  size: number;
  /** откуда брать неверные варианты (сначала — из юнита) */
  pool: Item[];
  /** дети: все короткие стихи Торы главы — и те, где нет слова колоды (для «Составьте стих» без подсказки) */
  verses?: Verse[];
}

/** после уроков с новым — два урока «Повторение» (вперемешку, второй труднее) */
export const REVIEWS = 2;
/** знакомо ли слово вне курса («Мои слова», «Слова Торы») */
export type Known = (key: string) => boolean;
export const GOAL = 20;
export const XP = 10;
export const XP_PERFECT = 15;

const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ——— the letters ———

/** two units: א–כ and ל–ת with the final forms; a lesson — 5–6 new letters */
const ABC_UNITS = [[...'אבגדהוזחטיכ'], [...'למנסעפצקרשת', ...FINAL_FORMS]];
const letterItem = (c: string, locale: Locale): Item => ({ key: c, he: c, tr: letterName(c, locale), value: VALUES[c], sound: letterSound(c, locale) });

export function abcUnits(locale: Locale): Unit[] {
  const all = [...ALEPH_BET, ...FINAL_FORMS].map((c) => letterItem(c, locale));
  return ABC_UNITS.map((ls, i) => {
    const items = ls.map((c) => all.find((x) => x.key === c)!);
    return { id: `abc-${i + 1}`, track: 'abc', n: i + 1, items, size: 6, pool: all };
  });
}

// ——— the words ———

/**
 * children: a unit — the Torah words of one portion's lessons; a lesson — up to 6 new words. `verses` — the portion's short
 * verses (`torahVerses`): each goes to a word of the unit that stands in it (the longest first), for «Составьте стих».
 */
export function torahUnits(words: TorahWord[], verses: Map<string, Verse[]> = new Map()): Unit[] {
  const items = words.map((w): Item & { parsha: string } => ({ key: w.key, he: w.he, tr: w.tr, translit: w.translit, img: w.img, parsha: w.parsha }));
  return [...new Set(items.map((w) => w.parsha))].map((p, i) => {
    const ws = items.filter((w) => w.parsha === p);
    const inVerse = (it: Item, v: Verse) => ` ${v.words.join(' ')} `.includes(` ${it.he} `);
    for (const v of verses.get(p) ?? []) {
      const it = [...ws].sort((a, b) => b.he.length - a.he.length).find((x) => !x.verse && inVerse(x, v));
      if (it) it.verse = v;
    }
    const all = verses.get(p) ?? [];
    return { id: `tw-${p}`, track: 'words', n: i + 1, parsha: p, items: ws, size: 6, pool: [...ws, ...items], verses: all };
  });
}

export const TANAKH_UNIT = 5;
export const TANAKH_GROUP = 50;
/**
 * adults: a unit («уровень») — 50 translated words of Tanakh by frequency, as in «Мои слова»; a lesson — 5 new words.
 * `verse` — the word's example verse (src/core/words.ts, `exampleOf`) for «Составьте стих».
 */
export function tanakhUnits(dict: Dict, verse: (id: string) => Verse | undefined = () => undefined): Unit[] {
  const items = dict.words.filter((w) => dict.tr[w.id]).map((w): Item => ({ key: w.id, he: w.he, tr: dict.tr[w.id], root: w.root, verse: verse(w.id) }));
  const out: Unit[] = [];
  for (let g = 0; g * TANAKH_GROUP < items.length; g++) {
    const level = items.slice(g * TANAKH_GROUP, (g + 1) * TANAKH_GROUP);
    out.push({
      id: `t-${g + 1}`,
      track: 'words',
      n: g + 1,
      items: level,
      size: TANAKH_UNIT,
      pool: [...level, ...items.slice(0, (g + 2) * TANAKH_GROUP)],
    });
  }
  return out;
}

// ——— the exercises ———

/** a translation or a word to compare: no quotes, brackets, punctuation, vowel points or case */
export const core = (x: string) =>
  x
    .toLowerCase()
    .replace(/[\u0591-\u05C7\u05F3\u05F4]/g, '')
    .replace(/[«»„“”"'’()\[\].,;:!?—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
/** the meanings of a translation: «сказать, говорить» → [сказать, говорить] */
const meanings = (tr: string) =>
  [core(tr), ...tr.split(/[,;/]|\(|\)/).map(core)].filter((m) => m.length >= 3 || m === core(tr));
/**
 * Two answers too alike to stand side by side: one translation holds a meaning of the other («сказать, говорить» and
 * «говорить, сказать»; «свет» and «"свет" (Б-г увидел свет)»), or the Hebrew is the same without the vowels (אֵל / אֶל).
 */
export function alike(a: { tr: string; he: string }, b: { tr: string; he: string }) {
  const [p, q] = [core(a.he), core(b.he)];
  if (p.includes(q) || q.includes(p)) return true;
  const [x, y] = [meanings(a.tr), meanings(b.tr)];
  return x.some((m) => y.some((n) => m.includes(n) || n.includes(m)));
}

export type Ask = 'tr' | 'he' | 'value' | 'sound';
export type Exercise =
  /** a new word or letter: just look (and «Дальше») */
  | { t: 'intro'; item: Item }
  /** pick one of four: `ask` — what the options are (tr — the translation / name, he — the Hebrew, value, sound) */
  | { t: 'pick'; item: Item; ask: Ask; options: Item[] }
  /** tap the pairs: Hebrew ↔ translation */
  | { t: 'match'; pairs: Item[] }
  /** put the letters (or the words of a phrase / of a verse — `verse`) in order; `tiles` — shuffled, with one or two extra */
  | { t: 'build'; item: Item; words: boolean; answer: string[]; tiles: string[]; verse?: Verse; word?: Item }
  /** one letter of the word hidden — pick it */
  | { t: 'gap'; item: Item; at: number; parts: string[]; options: string[] }
  /** adults: the root of the word */
  | { t: 'root'; item: Item; options: string[] };

/** the letters of a word with their vowel points: «בְּרֵאשִׁית» → בְּ רֵ א שִׁ י ת */
export const clusters = (he: string) => he.match(/[\u05D0-\u05EA][\u0591-\u05C7]*/g) ?? [];
/** a word whose letters can be tiles: one word, only letters and points (no Names with ׳ or -, no maqaf) */
const tileable = (he: string) => /^[\u05D0-\u05EA\u0591-\u05BD\u05BF-\u05C7]+$/.test(he) && clusters(he).length >= 2 && clusters(he).length <= 8;
const phrase = (he: string) => he.split(' ').filter(Boolean);

const label = (x: Item, ask: Ask) => (ask === 'tr' ? core(x.tr) : ask === 'he' ? core(x.he) : ask === 'value' ? String(x.value) : core(x.sound ?? ''));

function pick(item: Item, unit: Unit, ask: Ask): Exercise | null {
  const lbl = label(item, ask);
  const others: Item[] = [];
  // for a letter — the letters that look alike first: the exercise teaches the difference
  const near = unit.track === 'abc' ? (LOOKALIKES.find((g) => g.includes(item.key)) ?? []).map((c) => unit.pool.find((x) => x.key === c)).filter((x): x is Item => !!x) : [];
  for (const w of [...shuffle(near), ...shuffle(unit.items), ...shuffle(unit.pool)]) {
    if (others.length === 3) break;
    if (w.key === item.key || label(w, ask) === lbl || others.some((o) => o.key === w.key || label(o, ask) === label(w, ask))) continue;
    if (unit.track === 'words' && (alike(w, item) || others.some((o) => alike(o, w)))) continue;
    others.push(w);
  }
  return others.length === 3 ? { t: 'pick', item, ask, options: shuffle([item, ...others]) } : null;
}

function match(unit: Unit): Exercise | null {
  const pairs: Item[] = [];
  for (const w of shuffle(unit.items)) {
    if (pairs.length === 5) break;
    if (!pairs.some((p) => (unit.track === 'words' ? alike(p, w) : core(p.tr) === core(w.tr)))) pairs.push(w);
  }
  return pairs.length >= 3 ? { t: 'match', pairs } : null;
}

function build(item: Item, unit: Unit): Exercise | null {
  const words = phrase(item.he);
  if (words.length >= 2 && words.length <= 6) {
    const extra = shuffle(unit.pool.flatMap((w) => phrase(w.he)).filter((x) => !words.includes(x))).slice(0, words.length > 3 ? 1 : 2);
    return { t: 'build', item, words: true, answer: words, tiles: shuffle([...words, ...new Set(extra)]) };
  }
  if (!tileable(item.he)) return null;
  const answer = clusters(item.he);
  const bases = new Set(answer.map((c) => c[0]));
  const extra = [...new Set(shuffle(unit.pool.flatMap((w) => clusters(w.he))).filter((c) => !bases.has(c[0])))].slice(0, 2);
  return { t: 'build', item, words: false, answer, tiles: shuffle([...answer, ...extra]) };
}

/**
 * «Составьте стих»: the translation of a short verse of the Prophets or Writings with the word → its Hebrew words in order;
 * one or two extra words from the other verses of the unit.
 */
function verse(item: Item, unit: Unit): Exercise | null {
  return item.verse ? verseEx(item.verse, unit, item) : null;
}
function verseEx(v: Verse, unit: Unit, word?: Item): Exercise {
  const others = [...unit.items.flatMap((w) => w.verse ?? []), ...(unit.verses ?? [])].filter((x) => x !== v);
  const extra = [...new Set(shuffle(others.flatMap((x) => x.words)).filter((x) => !v.words.includes(x)))].slice(0, v.words.length > 5 ? 1 : 2);
  const item = word ?? { key: `verse:${v.ref}`, he: '', tr: '' };
  return { t: 'build', item: { ...item, he: v.words.join(' '), tr: v.tr }, words: true, answer: v.words, tiles: shuffle([...v.words, ...extra]), verse: v, word };
}
/**
 * Every lesson of a unit that has verses gets one «Составьте стих»: a verse with a word of `prefer` (the new words), else
 * with any word of the unit, else (children) any short verse of the portion — without a «word of the lesson» hint.
 */
function ensureVerse(ex: Exercise[], unit: Unit, prefer: Item[]) {
  if (ex.some((x) => x.t === 'build' && x.verse)) return ex;
  const it = shuffle(prefer).find((x) => x.verse) ?? shuffle(unit.items).find((x) => x.verse);
  const v = it ? verseEx(it.verse!, unit, it) : unit.verses?.length ? verseEx(shuffle(unit.verses)[0], unit) : null;
  if (v) ex.splice(Math.max(0, ex.length - 1), 0, v);
  return ex;
}

/** a letter that looks like `c` (or any other), keeping c's vowel points */
function gap(item: Item): Exercise | null {
  if (!tileable(item.he)) return null;
  const parts = clusters(item.he);
  const at = Math.floor(Math.random() * parts.length);
  const c = parts[at][0];
  const marks = parts[at].slice(1);
  const pool = FINALS[c] ? FINAL_FORMS : ALEPH_BET;
  const near = (LOOKALIKES.find((g) => g.includes(c)) ?? []).filter((x) => x !== c && pool.includes(x));
  const others = [...new Set([...shuffle(near), ...shuffle(pool.filter((x) => x !== c))])].slice(0, 3);
  return { t: 'gap', item, at, parts, options: shuffle([parts[at], ...others.map((x) => x + marks)]) };
}

function root(item: Item, unit: Unit): Exercise | null {
  if (!item.root) return null;
  const roots = shuffle([...new Set(unit.pool.map((w) => w.root).filter((r): r is string => !!r && r !== item.root))]).slice(0, 3);
  return roots.length === 3 ? { t: 'root', item, options: shuffle([item.root, ...roots]) } : null;
}

/** the next lesson of a unit: the new items (`size`, in the order of the unit) or none — then a review */
export function nextPart(unit: Unit, s: CourseStore, known: Known): Item[] {
  const left = newItems(unit, s, known);
  // no lesson of one or two: a short remainder joins this one
  return left.slice(0, left.length <= unit.size + 2 ? left.length : unit.size);
}

/**
 * A lesson of a unit. With `part` — the new items: each one introduced and asked, the pairs, and two questions on the
 * items met before. Without — «Повторение»: 6 items of the whole unit mixed with every kind of exercise (`hard` — the
 * second one, and a finished unit played again).
 */
export function makeLesson(unit: Unit, part: Item[] | null, hard = false): Exercise[] {
  if (part?.length) {
    const ex = drill({ ...unit, items: part }, 1);
    // one verse with a new word — unless the lesson is already long (a short remainder joined it)
    if (part.length <= unit.size) ensureVerse(ex, unit, part);
    const before = shuffle(unit.items.filter((it) => !part.includes(it))).slice(0, 2);
    before.forEach((it, i) => {
      const x = pick(it, unit, i ? 'he' : 'tr');
      if (x) ex.splice(ex.length - 1, 0, x);
    });
    return ex;
  }
  const items = shuffle(unit.items).slice(0, 6);
  return ensureVerse(drill({ ...unit, items }, hard ? 3 : 2), unit, items);
}

/** «Экзамен» за юнит: сразу весь юнит, чтобы открыть следующий — до `EXAM_ITEMS` его букв / слов вперемешку, трудные задания и пары. */
export const EXAM_ITEMS = 14;
/** ошибок можно сделать не больше (пары не считаются) */
export const EXAM_LIVES = 3;
export const XP_EXAM = 20;
export function makeExam(unit: Unit): Exercise[] {
  const items = shuffle(unit.items).slice(0, EXAM_ITEMS);
  return ensureVerse(drill({ ...unit, items }, 3), unit, items);
}

/** the exercises over `unit.items`: level 1 — introduce and ask each, the pairs; 2 and 3 — every kind mixed (3 — harder) */
function drill(unit: Unit, level: number): Exercise[] {
  const items = unit.items;
  const out: (Exercise | null)[] = [];
  const abc = unit.track === 'abc';
  if (level <= 1) {
    items.forEach((it, i) => {
      out.push({ t: 'intro', item: it }, pick(it, unit, 'tr'));
      if (i === 2) out.push(match(unit));
    });
    out.push(abc ? pick(items[items.length - 1], unit, 'he') : match(unit));
    return out.filter((x): x is Exercise => !!x);
  }
  const hard = level >= 3;
  const kinds: ((it: Item) => Exercise | null)[] = abc
    ? [(it) => pick(it, unit, 'tr'), (it) => pick(it, unit, 'he'), (it) => pick(it, unit, 'value'), (it) => pick(it, unit, 'sound')]
    : [
        (it) => pick(it, unit, 'tr'),
        (it) => pick(it, unit, 'he'),
        (it) => build(it, unit),
        (it) => (hard ? gap(it) ?? root(it, unit) : pick(it, unit, 'tr')),
        (it) => verse(it, unit) ?? (hard ? build(it, unit) : gap(it)),
        (it) => (hard ? root(it, unit) ?? pick(it, unit, 'he') : pick(it, unit, 'he')),
      ];
  let k = hard ? 1 : 0;
  for (const it of shuffle(items)) out.push(kinds[k++ % kinds.length](it) ?? pick(it, unit, 'tr'));
  // up to 12: the items again with another kind of exercise; the pairs in the middle and at the end
  for (const it of shuffle(items)) {
    if (out.length >= (abc ? 10 : 11)) break;
    out.push(kinds[k++ % kinds.length](it) ?? pick(it, unit, hard ? 'he' : 'tr'));
  }
  const ex = out.filter((x): x is Exercise => !!x);
  const m = match(unit);
  if (m) ex.splice(Math.floor(ex.length / 2), 0, m);
  return ex;
}

/** the answer of an exercise is right */
export function isRight(ex: Exercise, answer: string[] | string): boolean {
  switch (ex.t) {
    case 'intro':
    case 'match':
      return true;
    case 'pick':
      return answer === ex.item.key;
    case 'build':
      // a phrase: the same words; a word: the same letters (a letter twice — either tile)
      return Array.isArray(answer) && answer.join(' ') === ex.answer.join(' ');
    case 'gap':
      return answer === ex.parts[ex.at];
    case 'root':
      return answer === ex.item.root;
  }
}

// ——— the store ———

export const LASHON_KEY = 'niflaot:lashon';
const EVENT = 'niflaot:lashon';
export interface CourseStore {
  /** items met in the course */
  s: Record<string, number>;
  /** reviews of a unit done */
  r: Record<string, number>;
  xp: Record<string, number>;
}
const obj = (x: unknown) => (x && typeof x === 'object' ? (x as Record<string, number>) : {});
export function readCourse(): CourseStore {
  try {
    const raw = JSON.parse(localStorage.getItem(LASHON_KEY) ?? 'null');
    return { s: obj(raw?.s), r: obj(raw?.r), xp: obj(raw?.xp) };
  } catch {
    return { s: {}, r: {}, xp: {} };
  }
}
/** the items of a unit not met yet — neither in the course nor outside it */
export const newItems = (u: Unit, s: CourseStore, known: Known) => u.items.filter((it) => !s.s[it.key] && !known(it.key));
export const reviewsOf = (s: CourseStore, u: Unit) => Math.min(REVIEWS, Number(s.r[u.id]) || 0);
/** progress of a unit, 0–1: the items met (most of it) and the reviews */
export const progressOf = (u: Unit, s: CourseStore, known: Known) =>
  (0.8 * (u.items.length - newItems(u, s, known).length)) / u.items.length + (0.2 * reviewsOf(s, u)) / REVIEWS;
export const isDone = (u: Unit, s: CourseStore, known: Known) => !newItems(u, s, known).length && reviewsOf(s, u) >= REVIEWS;
export const xpToday = (s: CourseStore) => Number(s.xp[localToday()]) || 0;
export const xpTotal = (s: CourseStore) => Object.values(s.xp).reduce((a, n) => a + (Number(n) || 0), 0);

/** A lesson finished: its new items are met (or the unit has one more review), today — the points. */
export function finishLesson(unit: Unit, part: Item[] | null, xp: number) {
  const s = readCourse();
  if (part?.length) for (const it of part) s.s[it.key] = 1;
  else s.r[unit.id] = Math.min(REVIEWS, reviewsOf(s, unit) + 1);
  save(s, xp);
}

/** «Экзамен» сдан: все буквы / слова юнита — встречались, повторения — пройдены (следующий юнит открыт), сегодня — очки. */
export function passExam(unit: Unit) {
  const s = readCourse();
  for (const it of unit.items) s.s[it.key] = 1;
  s.r[unit.id] = REVIEWS;
  save(s, XP_EXAM);
}

function save(s: CourseStore, xp: number) {
  const d = localToday();
  s.xp[d] = (Number(s.xp[d]) || 0) + xp;
  try {
    localStorage.setItem(LASHON_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  markStudied();
}

export function useCourse(): CourseStore {
  const [s, set] = useState(readCourse);
  useEffect(() => {
    const on = () => set(readCourse());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

/** a unit is open when it's the first of its track or the one before it (same track) has no new items left */
export function isOpen(units: Unit[], i: number, s: CourseStore, known: Known) {
  const prev = units[i - 1];
  return !prev || prev.track !== units[i].track || !newItems(prev, s, known).length;
}

/** the unit to go on with: the first open one of the track not finished */
export const nextUnit = (units: Unit[], s: CourseStore, known: Known) => units.find((u, i) => isOpen(units, i, s, known) && !isDone(u, s, known));
