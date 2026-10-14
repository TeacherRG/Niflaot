/**
 * «Мой путь по книгам» в аккаунте (src/components/BookProgress.tsx): прогресс по книгам и вехи.
 * - Вехи чтения Пророков и Писаний — число отрывков, отмеченных «Я прочитал(а)» (src/core/tanakhDone.ts), за весь цикл:
 *   1-й, 10-й, 25-й… отрывок; дата вехи — когда отмечен этот по счёту отрывок (время отметки в `DoneStore`).
 * - Вехи книги — 25 / 50 / 75 / 100 % её отрывков (у книги Торы — её баллов); у Пророков и Писаний — с датой.
 * Чистые функции; проверяет `npm run check` (scripts/check-academy.ts).
 */
import { quizKey, type DoneStore } from './academy';
import type { CycleDay, Section } from './tanakhCycle';

/** вехи книги, % */
export const BOOK_STEPS = [25, 50, 75, 100] as const;
/** вехи чтения: N-й отрывок (последняя — все отрывки обоих разделов цикла) */
export const passageSteps = (total: number) => [1, 10, 25, 50, 100, 250, 500, 1000, total].filter((n, i, a) => n <= total && a.indexOf(n) === i);

export interface Milestone {
  /** отрывков (вехи чтения) или % (вехи книги) */
  step: number;
  /** когда достигнута (секунды, как в `DoneStore`); undefined — ещё нет; 0 — достигнута, дата неизвестна */
  at?: number;
}

/** Времена отметок «прочитано» по порядку — всех отрывков или только этих ключей. */
function marks(store: DoneStore, keys?: string[]): number[] {
  const v = keys ? keys.map((k) => store[k] ?? 0) : Object.values(store);
  return v.filter((x) => x > 0).sort((a, b) => a - b);
}

/** Вехи чтения всего цикла: `total` — отрывков в цикле (дни × 2 раздела). */
export function passageMilestones(store: DoneStore, total: number): Milestone[] {
  const m = marks(store);
  return passageSteps(total).map((step) => ({ step, at: m[step - 1] }));
}

/** Сколько отрывков нужно для вехи книги `step` % из `parts`. */
export const stepCount = (step: number, parts: number) => Math.max(1, Math.ceil((step / 100) * parts));

/** Вехи книги Пророков / Писаний: 25…100 % её отрывков, с датой. */
export function tanakhBookMilestones(store: DoneStore, days: CycleDay[], section: Section): Milestone[] {
  const m = marks(store, days.map((d) => quizKey(d.date, section)));
  return BOOK_STEPS.map((step) => ({ step, at: m[stepCount(step, days.length) - 1] }));
}

/** Вехи книги по проценту (книги Торы: баллы — без дат). */
export const pctMilestones = (pct: number): Milestone[] => BOOK_STEPS.map((step) => ({ step, at: pct >= step ? 0 : undefined }));

/** Дата отметки (секунды) — день на этом устройстве, `YYYY-MM-DD`. */
export function markDate(at: number): string {
  const d = new Date(at * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
