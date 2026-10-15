/**
 * «Ґемшех Самех-Вав» — the Rebbe Rashab's continuum of discourses (5666), studied in passages of up to ~10 minutes.
 * Only the English is a source: the translation of Rabbi Amiram and Rabbi Yehudah Markel (© The Neirot Foundation,
 * used with permission — every passage ends with the credit and a link to neirot.com); Russian and German are the
 * project's translations from that English. No Hebrew original is shown. Data — src/hemshech/5666.json
 * (`npm run check`: scripts/check-hemshech.ts). Answers to the questions — `niflaot:hemshech` (synced with the account).
 * «Отрывок дня»: one passage a study day (the days of the Prophets-and-Writings cycle — no Shabbat, no festivals),
 * from HS_START; a passage opens on its day (the admin sees them all ahead).
 */
import { useCallback, useState } from 'react';
import data from '../hemshech/5666.json';
import type { QuizResult, QuizStore } from './academy';
import { CYCLE } from './tanakh';

export type HsLang = 'ru' | 'en' | 'de';
type T = Record<HsLang, string>;
export interface HsPassage {
  id: string;
  title: T;
  summary: T;
  /** paragraph for paragraph: the English source and the project's Russian and German */
  en: string[];
  ru: string[];
  de: string[];
  /** the right option first (shuffled on screen) */
  questions: { q: T; o: T[] }[];
}
export interface HsMaamar {
  id: string;
  title: T;
  date: T;
  passages: HsPassage[];
}
export interface HsBook {
  id: string;
  title: T;
  author: T;
  credit: T;
  creditUrl: string;
  maamarim: HsMaamar[];
}

export const HEMSHECH = data as HsBook;
export const hsLang = (locale: string): HsLang => (locale === 'en' || locale === 'de' ? locale : 'ru');
/** The study days from HS_START: passage i is learnt on STUDY[i]. */
export const HS_START = '2026-10-18';
const STUDY = CYCLE.map((d) => d.date).filter((d) => d >= HS_START);
export const allPassages = () => HEMSHECH.maamarim.flatMap((m) => m.passages.map((p) => ({ m, p })));
/** The day a passage is learnt (YYYY-MM-DD). */
export const passageDate = (index: number) => STUDY[index] ?? STUDY[STUDY.length - 1];
/** Index of today's passage (the last one already open; -1 — the study has not started yet). */
export function todayIndex(today: string) {
  let i = -1;
  allPassages().forEach((_, k) => {
    if (passageDate(k) <= today) i = k;
  });
  return i;
}

/** Dense Chassidic text: about 120 words a minute in the translation. */
export const passageMinutes = (p: HsPassage, lang: HsLang) =>
  Math.max(1, Math.round(p[lang].reduce((a, s) => a + s.split(/\s+/).length, 0) / 120));

const KEY = 'niflaot:hemshech';
export function readHsStore(): QuizStore {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}

/** The questions of one passage: one answer each, the best finished result kept («Пройти ещё раз»). */
export function useHsQuiz(id: string, n: number) {
  const fresh = (): QuizResult => ({ p: Array(n).fill(-1), best: -1, n });
  const [r, setR] = useState<QuizResult>(() => {
    const saved = readHsStore()[id];
    return saved && saved.n === n ? saved : fresh();
  });
  const save = (x: QuizResult) => {
    const s = readHsStore();
    s[id] = x;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
    setR(x);
  };
  const answer = useCallback(
    (i: number, k: number) => {
      if (r.p[i] >= 0) return;
      const p = r.p.map((x, j) => (j === i ? k : x));
      const right = p.filter((x) => x === 0).length;
      save({ p, n, best: p.every((x) => x >= 0) ? Math.max(r.best, right) : r.best });
    },
    [r, n, id],
  );
  const restart = useCallback(() => save({ ...r, p: Array(n).fill(-1) }), [r, n, id]);
  return { result: r, answer, restart };
}
