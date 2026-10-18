/**
 * «Мой путь по книгам» в аккаунте (src/components/BookProgress.tsx): прогресс по книгам и вехи.
 * - Главные вехи — сами книги: дорожная карта раздела (`bookRoadmap`) — книги цикла по порядку: прочитанная (дата —
 *   последняя отметка её отрывков), текущая (с прогрессом), следующие (с датой начала по циклу).
 * - Внутри книги — 25 / 50 / 75 / 100 % её отрывков, отмеченных «Я прочитал(а)» (src/core/tanakhDone.ts), с датой —
 *   когда отмечен нужный по счёту отрывок (время отметки в `DoneStore`); у книги Торы — её баллов, без дат.
 * Чистые функции; проверяет `npm run check` (scripts/check-academy.ts).
 */
import { bookDays, isDone, quizKey, type DoneStore } from './academy';
import { BOOKS, type CycleDay, type Section, type TanakhBook } from './tanakhCycle';

/** вехи книги, % */
export const BOOK_STEPS = [25, 50, 75, 100] as const;
export interface Milestone {
  /** % книги */
  step: number;
  /** когда достигнута (секунды, как в `DoneStore`); undefined — ещё нет; 0 — достигнута, дата неизвестна */
  at?: number;
}

/** Времена отметок «прочитано» по порядку — всех отрывков или только этих ключей. */
function marks(store: DoneStore, keys?: string[]): number[] {
  const v = keys ? keys.map((k) => store[k] ?? 0) : Object.values(store);
  return v.filter((x) => x > 0).sort((a, b) => a - b);
}

/** Сколько отрывков нужно для вехи книги `step` % из `parts`. */
export const stepCount = (step: number, parts: number) => Math.max(1, Math.ceil((step / 100) * parts));

/** Вехи книги Пророков / Писаний: 25…100 % её отрывков, с датой. */
export function tanakhBookMilestones(store: DoneStore, days: CycleDay[], section: Section): Milestone[] {
  const m = marks(store, days.map((d) => quizKey(d.date, section)));
  return BOOK_STEPS.map((step) => ({ step, at: m[stepCount(step, days.length) - 1] }));
}

/** Вехи по отметкам «Я прочитал(а)» этих ключей (маамар «Хасидута» — id его отрывков): 25…100 %, с датой. */
export function doneMilestones(store: DoneStore, keys: string[]): Milestone[] {
  const m = marks(store, keys);
  return BOOK_STEPS.map((step) => ({ step, at: m[stepCount(step, keys.length) - 1] }));
}

/** Вехи книги по проценту (книги Торы: баллы — без дат). */
export const pctMilestones = (pct: number): Milestone[] => BOOK_STEPS.map((step) => ({ step, at: pct >= step ? 0 : undefined }));

/** Дата отметки (секунды) — день на этом устройстве, `YYYY-MM-DD`. */
export function markDate(at: number): string {
  const d = new Date(at * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface RoadBook {
  book: TanakhBook;
  days: CycleDay[];
  /** отрывков прочитано */
  done: number;
  /** done — вся книга прочитана; now — читается (начата или по циклу идёт сейчас); next — впереди */
  status: 'done' | 'now' | 'next';
  /** когда дочитана (секунды) */
  finishedAt?: number;
  /** вехи 25…100 % */
  steps: Milestone[];
}

/** Дорожная карта раздела: книги цикла по порядку — вехи пути (`today` — дата устройства, `YYYY-MM-DD`). */
export function bookRoadmap(section: Section, store: DoneStore, cycle: CycleDay[], today: string): RoadBook[] {
  return BOOKS.filter((b) => b.section === section).map((book) => {
    const days = bookDays(book, cycle);
    const done = days.filter((d) => isDone(store, d.date, section)).length;
    const steps = tanakhBookMilestones(store, days, section);
    const all = days.length > 0 && done === days.length;
    const running = days.length > 0 && days[0].date <= today && today <= days[days.length - 1].date;
    return { book, days, done, steps, status: all ? 'done' : done > 0 || running ? 'now' : 'next', finishedAt: all ? steps[steps.length - 1].at : undefined };
  });
}
