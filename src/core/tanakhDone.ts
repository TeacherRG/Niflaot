/**
 * «Я прочитал(а)» — галочка под отрывком дня Пророков / Писаний (TanakhPage.tsx) и трекер прочитанных отрывков.
 * localStorage `niflaot:tanakh-done` = { `${дата}:${раздел}`: время отметки трёхлетнего цикла, `${личный план}|${дата}:${раздел}`:
 * время отметки годового плана (снятая — со знаком минус) },
 * синхронизируется с аккаунтом (src/core/sync.ts). Из отметок — сертификаты книг (src/core/academy.ts: 100 % отрывков).
 */
import { useCallback, useEffect, useState } from 'react';
import type { Section } from './tanakhCycle';
import { isDone, quizKey, type DoneStore } from './academy';
import { markStudied } from './habit';

export const DONE_KEY = 'niflaot:tanakh-done';
const EVENT = 'niflaot:tanakh-done';

export function readDoneStore(planId = 'three-year'): DoneStore {
  try {
    const s = JSON.parse(localStorage.getItem(DONE_KEY) ?? 'null');
    if (!s || typeof s !== 'object') return {};
    const entries = Object.entries(s) as [string, number][];
    if (planId === 'three-year') return Object.fromEntries(entries.filter(([k]) => !k.includes('|')));
    const prefix = `${planId}|`;
    return Object.fromEntries(entries.flatMap(([k, v]) => k.startsWith(prefix) ? [[k.slice(prefix.length), v] as const] : []));
  } catch {
    return {};
  }
}

/** Отметить / снять отметку «прочитано» у отрывка раздела этого дня. */
export function setDone(date: string, section: Section, on: boolean, planId = 'three-year') {
  let s: DoneStore;
  try {
    const all = JSON.parse(localStorage.getItem(DONE_KEY) ?? 'null');
    s = all && typeof all === 'object' ? all : {};
  } catch {
    s = {};
  }
  const now = Math.floor(Date.now() / 1000);
  const key = planId === 'three-year' ? quizKey(date, section) : `${planId}|${quizKey(date, section)}`;
  s[key] = on ? now : -now;
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (on) markStudied();
}

/** Все отметки — и обновление, когда их меняет галочка (на этой странице) или вход в аккаунт (другая вкладка). */
export function useDoneStore(planId = 'three-year'): DoneStore {
  const [s, set] = useState(() => readDoneStore(planId));
  useEffect(() => {
    set(readDoneStore(planId));
    const on = () => set(readDoneStore(planId));
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, [planId]);
  return s;
}

/** Галочка одного отрывка. */
export function useDone(date: string, section: Section, planId = 'three-year'): [boolean, (on: boolean) => void] {
  const s = useDoneStore(planId);
  return [isDone(s, date, section), useCallback((on: boolean) => setDone(date, section, on, planId), [date, section, planId])];
}
