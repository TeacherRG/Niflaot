/**
 * What an account keeps for the player (src/core/account.ts): the same localStorage entries a guest has on one
 * device — the state of every lesson, «Гематрия дня», «Вопросы к отрывку», the passages read, the Hebrew level, the language, the mental-math level —
 * and how two copies are merged (this device and the account) so that nothing solved is ever lost.
 * Pure functions on plain objects; `npm run check` checks the merge.
 */

/** the synced localStorage keys: exact names, and `niflaot:lesson:<slug>` */
export const SYNC_KEYS = ['niflaot:daily', 'niflaot:tanakh-quiz', 'niflaot:hemshech', 'niflaot:nigun', 'niflaot:hemshech-done', 'niflaot:tanakh-done', 'niflaot:turim-done', 'niflaot:words', 'niflaot:notes', 'niflaot:torah-words', 'niflaot:torah-read', 'niflaot:lashon', 'niflaot:zip', 'niflaot:patches', 'niflaot:study-days', 'niflaot:coins', 'niflaot:push-want', 'niflaot:mode', 'niflaot:courses', 'niflaot:hebrew', 'niflaot:lang', 'niflaot:math-level'];
export const LESSON_PREFIX = 'niflaot:lesson:';
export const isSynced = (k: string) => SYNC_KEYS.includes(k) || k.startsWith(LESSON_PREFIX);

import { mergeCoinStores, normCoins } from './coinsRules';

/** key → the raw localStorage string */
export type Snapshot = Record<string, string>;

const parse = (s: string | undefined): any => {
  try {
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

/** a lesson: the copy with more riddles solved, then more points, then more steps tried; the best earlier score of both */
function mergeLesson(a: string, b: string): string {
  const x = parse(a);
  const y = parse(b);
  if (!x?.st) return b;
  if (!y?.st) return a;
  const rank = (s: any) => [s.done?.length ?? 0, s.score ?? 0, Object.keys(s.st ?? {}).length];
  const [ra, rb] = [rank(x), rank(y)];
  let win = a;
  for (let i = 0; i < ra.length; i++)
    if (ra[i] !== rb[i]) {
      win = ra[i] > rb[i] ? a : b;
      break;
    }
  // «Начать заново» keeps the best earlier score (the certificates of «Академия»): it is not lost with the other copy
  const best = Math.max(Number(x.best) || 0, Number(y.best) || 0);
  const w = win === a ? x : y;
  if (best > (Number(w.best) || 0)) return JSON.stringify({ ...w, best });
  return win;
}

/** «Гематрия дня»: every day from both; the same day — the finished one, then the one with more tries */
function mergeDaily(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const out: Record<string, any> = { ...y };
  for (const [day, r] of Object.entries<any>(x)) {
    const o = out[day];
    if (!o) out[day] = r;
    else if (!!r?.done !== !!o?.done) out[day] = r?.done ? r : o;
    else if ((r?.wrong?.length ?? 0) + (r?.done ? 1 : 0) >= (o?.wrong?.length ?? 0) + (o?.done ? 1 : 0)) out[day] = r;
  }
  return JSON.stringify(out);
}

/**
 * «Вопросы к отрывку» (src/core/academy.ts, QuizStore): every day from both; the same day — the better result,
 * then the one with more questions answered.
 */
function mergeQuiz(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const out: Record<string, any> = { ...y };
  const answered = (r: any) => (Array.isArray(r?.p) ? r.p.filter((p: number) => p >= 0).length : 0);
  for (const [day, r] of Object.entries<any>(x)) {
    const o = out[day];
    if (!o || (r?.best ?? -1) > (o?.best ?? -1) || ((r?.best ?? -1) === (o?.best ?? -1) && answered(r) >= answered(o))) out[day] = r;
  }
  return JSON.stringify(out);
}

/** «Проверь себя» на страницах чтения (src/core/readCheck.ts): every answer from both; a question is answered once, so the account's stays. */
function mergeRead(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const out: Record<string, any> = {};
  for (const slug of new Set([...Object.keys(x), ...Object.keys(y)])) out[slug] = { ...x[slug], ...y[slug] };
  return JSON.stringify(out);
}

/** «Я прочитал(а)» (src/core/tanakhDone.ts, «Хасидут» — src/core/hemshech.ts): every passage from both; the same one — the later mark (read or unmarked). */
function mergeDone(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const out: Record<string, number> = {};
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
    const [p, q] = [Number(x[k]) || 0, Number(y[k]) || 0];
    out[k] = Math.abs(p) >= Math.abs(q) ? p : q;
  }
  return JSON.stringify(out);
}

/**
 * «Мои слова» (src/core/words.ts): a word's entry is [time of the change, s; box 0–5; day of the next review]. An early
 * entry (only «Знаю») was a number: time — known, minus time — unmarked; it reads as box 3 (known) or 0 (removed).
 */
export type WordEntry = [number, number, number];
export function normWord(v: unknown): WordEntry {
  if (Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'number')) return v as WordEntry;
  const n = Number(v) || 0;
  return n > 0 ? [n, 3, Math.floor(n / 86400) + 7] : [-n, 0, 0];
}
/** every word from both; the same word — the later change (also the children's «Слова Торы», src/core/torahWords.ts) */
function mergeWords(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const out: Record<string, WordEntry> = {};
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
    const [p, q] = [normWord(x[k]), normWord(y[k])];
    out[k] = p[0] >= q[0] ? p : q;
  }
  return JSON.stringify(out);
}

/** «Мои закладки» (src/core/notes.ts): every verse from both; the same verse — the later change (an unmarked one stays, so the removal reaches the other device) */
function mergeNotes(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const out: Record<string, unknown> = {};
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
    const [p, q] = [x[k], y[k]];
    out[k] = (Number(p?.t) || 0) >= (Number(q?.t) || 0) ? (p ?? q) : q;
  }
  return JSON.stringify(out);
}

/** «Святой язык — уроки» (src/core/lashon.ts): every item met, unit and day from both — the more reviews / points */
function mergeCourse(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const max = (p: Record<string, unknown> = {}, q: Record<string, unknown> = {}) =>
    Object.fromEntries([...new Set([...Object.keys(p), ...Object.keys(q)])].map((k) => [k, Math.max(Number(p[k]) || 0, Number(q[k]) || 0)]));
  return JSON.stringify({ s: max(x.s, y.s), r: max(x.r, y.r), xp: max(x.xp, y.xp), w: max(x.w, y.w) });
}

/** «Zip — стих Торы» (src/core/zip.ts): every solved verse from both (the higher level), the higher level; the current verse — this device's */
function mergeZip(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const d: Record<string, any> = { ...(y.d ?? {}) };
  for (const [k, v] of Object.entries<any>(x.d ?? {})) if (!d[k] || (Number(v?.[1]) || 0) >= (Number(d[k]?.[1]) || 0)) d[k] = v;
  return JSON.stringify({ l: Math.max(Number(x.l) || 1, Number(y.l) || 1), d, ...(x.c || y.c ? { c: x.c ?? y.c } : {}) });
}

/**
 * «Лоскуты гематрии» (src/core/patches.ts): the copy with more boards solved leads (its level and day of the last win);
 * the best time of each level — the faster of the two.
 */
function mergePatches(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const [hi, lo] = (Number(x.g) || 0) >= (Number(y.g) || 0) ? [x, y] : [y, x];
  const best: Record<string, number> = { ...(lo.b ?? {}) };
  for (const [k, v] of Object.entries<any>(hi.b ?? {})) if (!(best[k] <= Number(v))) best[k] = Number(v);
  return JSON.stringify({ l: Number(hi.l) || 1, g: Number(hi.g) || 0, b: best, ...(hi.w || lo.w ? { w: hi.w ?? lo.w } : {}) });
}

/** «Учёба каждый день» (src/core/habit.ts): every day of study from both; a day studied (1) wins over one made up (2) */
function mergeStudy(a: string, b: string): string {
  const x = parse(a) ?? {};
  const y = parse(b) ?? {};
  const keys = [...new Set([...Object.keys(x), ...Object.keys(y)])].sort();
  return JSON.stringify(Object.fromEntries(keys.map((k) => [k, x[k] === 1 || y[k] === 1 ? 1 : 2])));
}

/** «Pelecoin» (src/core/coinsRules.ts): every reward, gift and purchase of both, each once */
const mergeCoins = (a: string, b: string) => JSON.stringify(mergeCoinStores(normCoins(parse(a)), normCoins(parse(b))));

/** «Напоминание было включено» (src/core/push.ts, WANT): the later change — on another device or before a reinstall — wins */
function mergePushWant(a: string, b: string): string {
  const x = parse(a);
  const y = parse(b);
  return (Number(y?.t) || 0) > (Number(x?.t) || 0) ? b : a;
}

/**
 * Merge this device (`local`) with the account (`remote`). Progress is never lost: lessons, «Гематрия дня» and
 * «Вопросы к отрывку» keep the best of both; settings (mode, courses, Hebrew level, language, math level) — this device's choice when it has one.
 */
export function mergeSnapshots(local: Snapshot, remote: Snapshot): Snapshot {
  const out: Snapshot = {};
  for (const k of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    if (!isSynced(k)) continue;
    const a = local[k];
    const b = remote[k];
    if (a === undefined) out[k] = b;
    else if (b === undefined) out[k] = a;
    else if (k.startsWith(LESSON_PREFIX)) out[k] = mergeLesson(a, b);
    else if (k === 'niflaot:daily') out[k] = mergeDaily(a, b);
    else if (k === 'niflaot:tanakh-quiz' || k === 'niflaot:hemshech' || k === 'niflaot:nigun') out[k] = mergeQuiz(a, b);
    else if (k === 'niflaot:torah-read') out[k] = mergeRead(a, b);
    else if (k === 'niflaot:words' || k === 'niflaot:torah-words') out[k] = mergeWords(a, b);
    else if (k === 'niflaot:notes') out[k] = mergeNotes(a, b);
    else if (k === 'niflaot:study-days') out[k] = mergeStudy(a, b);
    else if (k === 'niflaot:lashon') out[k] = mergeCourse(a, b);
    else if (k === 'niflaot:zip') out[k] = mergeZip(a, b);
    else if (k === 'niflaot:patches') out[k] = mergePatches(a, b);
    else if (k === 'niflaot:coins') out[k] = mergeCoins(a, b);
    else if (k === 'niflaot:push-want') out[k] = mergePushWant(a, b);
    else if (k === 'niflaot:tanakh-done' || k === 'niflaot:hemshech-done' || k === 'niflaot:turim-done') out[k] = mergeDone(a, b);
    else out[k] = a;
  }
  return out;
}

/** What the leaderboard and the teacher see — counted from the snapshot. */
export interface Summary {
  points: number;
  solved: number;
  /** «Гематрия дня» solved */
  days: number;
  streak: number;
  /** lesson slug → riddles solved */
  lessons: Record<string, number>;
}

export function summarize(s: Snapshot, streak: number): Summary {
  const lessons: Record<string, number> = {};
  let points = 0;
  let solved = 0;
  for (const [k, v] of Object.entries(s)) {
    if (!k.startsWith(LESSON_PREFIX)) continue;
    const st = parse(v);
    const done = Array.isArray(st?.done) ? st.done.length : 0;
    lessons[k.slice(LESSON_PREFIX.length)] = done;
    solved += done;
    points += Number.isFinite(st?.score) ? Math.max(0, st.score) : 0;
  }
  const days = Object.values<any>(parse(s['niflaot:daily']) ?? {}).filter((r) => r?.done === 'win').length;
  return { points, solved, days, streak, lessons };
}
