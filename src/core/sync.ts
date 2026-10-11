/**
 * What an account keeps for the player (src/core/account.ts): the same localStorage entries a guest has on one
 * device — the state of every lesson, «Гиматрия дня», the Hebrew level, the language, the mental-math level —
 * and how two copies are merged (this device and the account) so that nothing solved is ever lost.
 * Pure functions on plain objects; `npm run check` checks the merge.
 */

/** the synced localStorage keys: exact names, and `niflaot:lesson:<slug>` */
export const SYNC_KEYS = ['niflaot:daily', 'niflaot:hebrew', 'niflaot:lang', 'niflaot:math-level'];
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

/** a lesson: the copy with more riddles solved, then more points, then more steps tried */
function mergeLesson(a: string, b: string): string {
  const x = parse(a);
  const y = parse(b);
  if (!x?.st) return b;
  if (!y?.st) return a;
  const rank = (s: any) => [s.done?.length ?? 0, s.score ?? 0, Object.keys(s.st ?? {}).length];
  const [ra, rb] = [rank(x), rank(y)];
  for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] > rb[i] ? a : b;
  return a;
}

/** «Гиматрия дня»: every day from both; the same day — the finished one, then the one with more tries */
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
 * Merge this device (`local`) with the account (`remote`). Progress is never lost: lessons and «Гиматрия дня»
 * keep the best of both; settings (Hebrew level, language, math level) — this device's choice when it has one.
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
    else out[k] = a;
  }
  return out;
}

/** What the leaderboard and the teacher see — counted from the snapshot. */
export interface Summary {
  points: number;
  solved: number;
  /** «Гиматрия дня» solved */
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
