/**
 * «Учёба каждый день» — одна учебная серия по всем разделам сайта (идея «петли привычки»: сигнал — напоминание,
 * действие — ежедневный минимум, награда — ✓ дня и серия). День засчитан, если в этот день сделано хоть что-то:
 * загадка урока, «Гематрия дня», отрывок Пророков / Писаний или Хасидута, вопросы, «Проверь себя», слова.
 * Шабат, праздники и 9 ава серию не рвут (src/core/restDays.ts); учёба в такой день тоже засчитывается.
 *
 * localStorage `niflaot:study-days` = { "YYYY-MM-DD": 1 } (по дате устройства), синхронизируется с аккаунтом
 * (src/core/sync.ts, слияние — все дни обеих копий). Дни до появления журнала берутся из отметок с временем
 * («Я прочитал(а)», слова, «Гематрия дня»), так что серия не начинается с нуля.
 * Модуль без тяжёлых импортов: его вызывают все места, где игрок что-то сделал.
 */
import { useEffect, useState } from 'react';
import { addDays, restReason } from './restDays';

export const STUDY_KEY = 'niflaot:study-days';
const EVENT = 'niflaot:study';
/** «Гематрия дня» №1 (src/core/daily.ts) */
export const DAILY_START = '2026-10-11';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const todayIso = () => iso(new Date());

const parse = (k: string): any => {
  try {
    const v = JSON.parse(localStorage.getItem(k) ?? 'null');
    return v && typeof v === 'object' ? v : null;
  } catch {
    return null;
  }
};

/** Игрок что-то сделал сегодня (ответ, отметка, слово): день засчитан. */
export function markStudied() {
  const today = todayIso();
  const log: Record<string, number> = parse(STUDY_KEY) ?? {};
  if (log[today]) return;
  log[today] = 1;
  const old = addDays(today, -400);
  for (const k of Object.keys(log)) if (k < old) delete log[k];
  try {
    localStorage.setItem(STUDY_KEY, JSON.stringify(log));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** Все учебные дни: журнал и отметки с временем (с — секунды; снятая отметка — со знаком минус — не в счёт). */
export function studyDates(): Set<string> {
  const out = new Set(Object.keys(parse(STUDY_KEY) ?? {}));
  const at = (s: unknown) => {
    const n = Number(s);
    if (n > 0) out.add(iso(new Date(n * 1000)));
  };
  for (const k of ['niflaot:tanakh-done', 'niflaot:hemshech-done']) Object.values(parse(k) ?? {}).forEach(at);
  for (const k of ['niflaot:words', 'niflaot:torah-words'])
    for (const v of Object.values<any>(parse(k) ?? {})) at(Array.isArray(v) ? v[0] : v);
  for (const [n, r] of Object.entries<any>(parse('niflaot:daily') ?? {})) if (r?.done) out.add(addDays(DAILY_START, Number(n) - 1));
  return out;
}

const rest = new Map<string, boolean>();
const isRest = (d: string) => {
  let r = rest.get(d);
  if (r === undefined) rest.set(d, (r = restReason(d) !== null));
  return r;
};

export interface Habit {
  /** сегодня уже учились */
  today: boolean;
  /** дней подряд — до сегодня (или до вчера, пока сегодня ещё не учились) */
  streak: number;
  best: number;
  /** всего учебных дней */
  total: number;
  /** учились раньше, но серия прервалась — «С возвращением» */
  back: boolean;
}

/** Серия: учебный день без учёбы рвёт её, день отдыха — нет. */
export function habitStats(dates: Set<string>, today = todayIso()): Habit {
  const days = [...dates].filter((d) => d <= today).sort();
  const studied = dates.has(today);
  let best = 0;
  let run = 0;
  if (days.length)
    for (let d = days[0]; d <= today; d = addDays(d, 1)) {
      if (dates.has(d)) best = Math.max(best, ++run);
      else if (d !== today && !isRest(d)) run = 0;
    }
  // `run` — серия, дошедшая до сегодня (сегодня без учёбы её ещё не рвёт)
  return { today: studied, streak: run, best, total: days.length, back: !studied && run === 0 && days.length > 0 };
}

/** Серия и ✓ дня — и обновление, когда игрок что-то сделал (эта вкладка) или прогресс пришёл из аккаунта. */
export function useHabit(): Habit {
  const [h, set] = useState(() => habitStats(studyDates()));
  useEffect(() => {
    const on = () => set(habitStats(studyDates()));
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return h;
}
