/**
 * The store of «Святой язык — уроки» (`niflaot:lashon`) — apart from the course itself (src/core/lashon.ts), so that
 * «Мои слова» and «Слова Торы» can write their answers into it without loading the course (owner, 02.11.2026: «синхронизация
 * святой язык уроки и мои слова»): a word remembered on a card — answered right in the course today, forgotten — one miss more.
 */
import { localToday } from './tanakh';

export const LASHON_KEY = 'niflaot:lashon';
export const LASHON_EVENT = 'niflaot:lashon';
export interface CourseStore {
  /** items met in the course: the day (days since 1970-01-01) it was last answered right; 1 — met, before the days were kept */
  s: Record<string, number>;
  /** reviews of a unit done */
  r: Record<string, number>;
  xp: Record<string, number>;
  /** «Трудные»: missed lately — 1–3 (a mistake +1, a right first answer −1, 0 — gone) */
  w: Record<string, number>;
}
const obj = (x: unknown) => (x && typeof x === 'object' ? (x as Record<string, number>) : {});
export function readCourse(): CourseStore {
  try {
    const raw = JSON.parse(localStorage.getItem(LASHON_KEY) ?? 'null');
    return { s: obj(raw?.s), r: obj(raw?.r), xp: obj(raw?.xp), w: obj(raw?.w) };
  } catch {
    return { s: {}, r: {}, xp: {}, w: {} };
  }
}
export function writeCourse(s: CourseStore) {
  try {
    localStorage.setItem(LASHON_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(LASHON_EVENT));
}

/** today as a day number (days since 1970-01-01, local) */
export const dayNo = (iso = localToday()) => Math.round(Date.parse(`${iso}T00:00:00Z`) / 864e5);
/** a mistake counts up to this */
export const WEAK_MAX = 3;

/** the first answers: item key → right */
export type Answers = Record<string, boolean>;
/** the answers into the store: right — answered today, one miss less; wrong — one miss more */
export function remember(s: CourseStore, answers: Answers, today = dayNo()) {
  for (const [k, right] of Object.entries(answers)) {
    const w = Number(s.w[k]) || 0;
    if (right) {
      s.s[k] = Math.max(Number(s.s[k]) || 0, today);
      if (w > 1) s.w[k] = w - 1;
      else delete s.w[k];
    } else {
      s.s[k] = Math.max(Number(s.s[k]) || 0, 1);
      s.w[k] = Math.min(WEAK_MAX, w + 1);
    }
  }
}

/** An answer given outside the course («Мои слова», «Слова Торы») — into the course too (no points: those are for lessons). */
export function noteAnswer(key: string, right: boolean) {
  const s = readCourse();
  remember(s, { [key]: right });
  writeCourse(s);
}
