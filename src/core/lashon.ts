/**
 * «Святой язык — уроки» (`#/lashon`, LashonPage.tsx): курс иврита по шагам, как в Duolingo. Путь из юнитов: сначала
 * «Буквы» (22 буквы и 5 конечных по 5–6), потом слова — детям слова Торы из уроков (src/core/torahWords.ts, по главам,
 * по 6), взрослым — слова Танаха по частоте (src/core/words.ts, только переведённые, по 5; уровни по 50).
 * У юнита три урока (★): 1 — знакомство (новое слово → выбрать перевод) и пары; 2 — вперемешку: перевод, наоборот,
 * пары, собери из букв, порядок слов фразы, пропущенная буква, значение / звучание буквы; 3 — то же, труднее (больше
 * «наоборот» и сборки, у взрослых — корень). Урок — 10–14 заданий; ошибку задание повторяется в конце (один раз).
 * За урок — 10 очков опыта, без ошибок — 15; цель дня — `GOAL` очков. Юнит открыт, если у предыдущего юнита той же
 * части есть хотя бы ★ (первый юнит части — всегда).
 *
 * localStorage `niflaot:lashon` = { u: { <юнит>: ★ 0–3 }, xp: { <дата>: очки } } — синхронизируется (src/core/sync.ts:
 * у юнита и у дня — больше из двух).
 */
import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/config';
import type { TorahWord } from './torahWords';
import type { Dict } from './words';
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
}
export type Track = 'abc' | 'words';
export interface Unit {
  id: string;
  track: Track;
  /** для «слов» — глава Торы (дети) или уровень по 50 (взрослые) */
  group: string;
  /** номер юнита внутри группы, с 1 */
  n: number;
  items: Item[];
  /** откуда брать неверные варианты (сначала — из юнита) */
  pool: Item[];
}

export const LEVELS = 3;
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

/** split into units of about `size`, as even as possible (13 → 7 + 6) */
function chunks<T>(xs: T[], size: number): T[][] {
  const k = Math.max(1, Math.ceil(xs.length / size));
  const out: T[][] = [];
  for (let i = 0; i < k; i++) out.push(xs.slice(Math.round((i * xs.length) / k), Math.round(((i + 1) * xs.length) / k)));
  return out.filter((c) => c.length);
}

// ——— the letters ———

const ABC_UNITS = [[...'אבגדהו'], [...'זחטיכ'], [...'למנסע'], [...'פצקרשת'], FINAL_FORMS];
const letterItem = (c: string, locale: Locale): Item => ({ key: c, he: c, tr: letterName(c, locale), value: VALUES[c], sound: letterSound(c, locale) });

export function abcUnits(locale: Locale): Unit[] {
  const all = [...ALEPH_BET, ...FINAL_FORMS].map((c) => letterItem(c, locale));
  return ABC_UNITS.map((ls, i) => ({
    id: `abc-${i + 1}`,
    track: 'abc',
    group: 'abc',
    n: i + 1,
    items: ls.map((c) => all.find((x) => x.key === c)!),
    pool: all,
  }));
}

// ——— the words ———

/** children: the Torah words of the lessons, by portion, units of up to 6 */
export function torahUnits(words: TorahWord[]): Unit[] {
  const items = words.map((w): Item & { parsha: string } => ({ key: w.key, he: w.he, tr: w.tr, translit: w.translit, img: w.img, parsha: w.parsha }));
  const out: Unit[] = [];
  for (const p of [...new Set(items.map((w) => w.parsha))]) {
    const ws = items.filter((w) => w.parsha === p);
    chunks(ws, 6).forEach((c, i) => out.push({ id: `tw-${p}-${i + 1}`, track: 'words', group: p, n: i + 1, items: c, pool: [...ws, ...items] }));
  }
  return out;
}

export const TANAKH_UNIT = 5;
export const TANAKH_GROUP = 50;
/** adults: the translated words of Tanakh by frequency, units of 5; a group («уровень») — 50 words */
export function tanakhUnits(dict: Dict): Unit[] {
  const items = dict.words.filter((w) => dict.tr[w.id]).map((w): Item => ({ key: w.id, he: w.he, tr: dict.tr[w.id], root: w.root }));
  const out: Unit[] = [];
  for (let i = 0; i * TANAKH_UNIT < items.length; i++) {
    const g = Math.floor((i * TANAKH_UNIT) / TANAKH_GROUP);
    const group = items.slice(g * TANAKH_GROUP, (g + 1) * TANAKH_GROUP);
    out.push({
      id: `w-${i + 1}`,
      track: 'words',
      group: String(g + 1),
      n: (i % (TANAKH_GROUP / TANAKH_UNIT)) + 1,
      items: items.slice(i * TANAKH_UNIT, (i + 1) * TANAKH_UNIT),
      pool: [...group, ...items.slice(0, (g + 2) * TANAKH_GROUP)],
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
  /** put the letters (or the words of a phrase) in order; `tiles` — shuffled, with one or two extra */
  | { t: 'build'; item: Item; words: boolean; answer: string[]; tiles: string[] }
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

/**
 * One lesson of a unit at `level` (1–3). Level 1 introduces every item and asks it once, with the pairs in the middle and
 * at the end; levels 2 and 3 mix every kind of exercise (3 — more «the other way» and building).
 */
export function makeLesson(unit: Unit, level: number): Exercise[] {
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
        (it) => (hard ? build(it, unit) : gap(it)),
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
  u: Record<string, number>;
  xp: Record<string, number>;
}
export function readCourse(): CourseStore {
  try {
    const raw = JSON.parse(localStorage.getItem(LASHON_KEY) ?? 'null');
    return { u: raw?.u && typeof raw.u === 'object' ? raw.u : {}, xp: raw?.xp && typeof raw.xp === 'object' ? raw.xp : {} };
  } catch {
    return { u: {}, xp: {} };
  }
}
export const levelOf = (s: CourseStore, id: string) => Math.min(LEVELS, Number(s.u[id]) || 0);
export const xpToday = (s: CourseStore) => Number(s.xp[localToday()]) || 0;
export const xpTotal = (s: CourseStore) => Object.values(s.xp).reduce((a, n) => a + (Number(n) || 0), 0);

/** A lesson finished: the unit gets its ★ (never fewer), today — the points. */
export function finishLesson(unit: string, level: number, xp: number) {
  const s = readCourse();
  s.u[unit] = Math.max(levelOf(s, unit), Math.min(LEVELS, level));
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

/** a unit is open when it's the first of its track or the one before it (same track) has a ★ */
export function isOpen(units: Unit[], i: number, s: CourseStore) {
  const prev = units[i - 1];
  return !prev || prev.track !== units[i].track || levelOf(s, prev.id) > 0;
}

/** the unit to go on with: the first open one of the track with fewer than 3 ★ */
export const nextUnit = (units: Unit[], s: CourseStore) => units.find((u, i) => isOpen(units, i, s) && levelOf(s, u.id) < LEVELS);
