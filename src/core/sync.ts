/**
 * What an account keeps for the player (src/core/account.ts): the same localStorage entries a guest has on one
 * device — the state of every lesson, «Гематрия дня», «Вопросы к отрывку», the Hebrew level, the language, the mental-math level —
 * and how two copies are merged (this device and the account) so that nothing solved is ever lost.
 * Pure functions on plain objects; `npm run check` checks the merge.
 */

/** the synced localStorage keys: exact names, and `niflaot:lesson:<slug>` */
export const SYNC_KEYS = ['niflaot:daily', 'niflaot:tanakh-quiz', 'niflaot:torah-read', 'niflaot:mode', 'niflaot:hebrew', 'niflaot:lang', 'niflaot:math-level'];
export const LESSON_PREFIX = 'niflaot:lesson:';
export const isSynced = (k: string) => SYNC_KEYS.includes(k) || k.startsWith(LESSON_PREFIX);

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

/**
 * Merge this device (`local`) with the account (`remote`). Progress is never lost: lessons, «Гематрия дня» and
 * «Вопросы к отрывку» keep the best of both; settings (Hebrew level, language, math level) — this device's choice when it has one.
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
    else if (k === 'niflaot:tanakh-quiz') out[k] = mergeQuiz(a, b);
    else if (k === 'niflaot:torah-read') out[k] = mergeRead(a, b);
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
