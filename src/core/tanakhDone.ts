/**
 * «Я прочитал(а)» — галочка под отрывком дня Пророков / Писаний (TanakhPage.tsx) и трекер прочитанных отрывков.
 * localStorage `niflaot:tanakh-done` = { `${дата}:${раздел}`: время отметки, с (снятая — со знаком минус) },
 * синхронизируется с аккаунтом (src/core/sync.ts). Из отметок — сертификаты книг (src/core/academy.ts: 100 % отрывков).
 */
import { useCallback, useEffect, useState } from 'react';
import type { Section } from './tanakhCycle';
import { isDone, quizKey, type DoneStore } from './academy';
import { markStudied } from './habit';

export const DONE_KEY = 'niflaot:tanakh-done';
const EVENT = 'niflaot:tanakh-done';

export function readDoneStore(): DoneStore {
  try {
    const s = JSON.parse(localStorage.getItem(DONE_KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}

/** Отметить / снять отметку «прочитано» у отрывка раздела этого дня. */
export function setDone(date: string, section: Section, on: boolean) {
  const s = readDoneStore();
  const now = Math.floor(Date.now() / 1000);
  s[quizKey(date, section)] = on ? now : -now;
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (on) markStudied();
}

/** Все отметки — и обновление, когда их меняет галочка (на этой странице) или вход в аккаунт (другая вкладка). */
export function useDoneStore(): DoneStore {
  const [s, set] = useState(readDoneStore);
  useEffect(() => {
    const on = () => set(readDoneStore());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

/** Галочка одного отрывка. */
export function useDone(date: string, section: Section): [boolean, (on: boolean) => void] {
  const s = useDoneStore();
  return [isDone(s, date, section), useCallback((on: boolean) => setDone(date, section, on), [date, section])];
}
