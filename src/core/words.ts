/**
 * «Слова отрывка» — иврит по словам Танаха (TanakhWords.tsx под отрывком дня Пророков и Писаний).
 *
 * Словарь — src/tanakh/words.json (scripts/fetch-words.py): самые частые слова Пророков и Писаний в основной форме
 * (по разметке Open Scriptures Hebrew Bible, CC BY 4.0), без имён собственных, по порядку частоты; `cov` — сколько
 * процентов текста покрывают это слово и все более частые. Переводы — проекта: src/tanakh/words/<ru|en|de>.json;
 * учить можно только переведённые слова (начало списка). По дню — public/tanakh/words/<дата>.json: сколько слов в
 * отрывке раздела (`n`, без имён) и сколько раз в нём встречается каждое слово словаря (`w`).
 *
 * «Знаю» — localStorage `niflaot:words` = { номер слова: время отметки, с (снятая — со знаком минус) }, синхронизируется
 * с аккаунтом (src/core/sync.ts, слияние — как у «Я прочитал(а)»).
 */
import { useEffect, useState } from 'react';
import type { Section } from './tanakhCycle';
import { root } from './tanakh';

export interface Word {
  /** номер Стронга */
  id: string;
  /** основная форма с огласовками (Имена — как во всём проекте) */
  he: string;
  pos: string;
  /** сколько раз встречается в Пророках и Писаниях */
  n: number;
  /** корень (у глагола — он сам) */
  root?: string;
  /** арамейское слово (Даниэль, Эзра) */
  aram?: 1;
  /** % текста, который покрывают это слово и все более частые */
  cov: number;
}
export type WordLang = 'ru' | 'en' | 'de';
export interface Dict {
  words: Word[];
  /** номер слова → место по частоте (с 1) */
  rank: Map<string, number>;
  /** номер слова → перевод на языке сайта; только переведённые слова можно учить */
  tr: Record<string, string>;
}
export type DayWords = Record<Section, { n: number; w: Record<string, number> }>;

/** сколько слов отрывка предлагать в день */
export const PER_DAY = 5;

const dicts = new Map<WordLang, Promise<Dict>>();
/** Словарь и переводы — отдельным куском кода, только на странице отрывка. */
export function loadDict(lang: WordLang): Promise<Dict> {
  let p = dicts.get(lang);
  if (!p) {
    p = Promise.all([import('../tanakh/words.json'), import(`../tanakh/words/${lang}.json`)]).then(([w, tr]) => {
      const words = (w.default as { words: Word[] }).words;
      return { words, rank: new Map(words.map((x, i) => [x.id, i + 1])), tr: tr.default as Record<string, string> };
    });
    dicts.set(lang, p);
  }
  return p;
}

const days = new Map<string, Promise<DayWords | null>>();
export function loadDayWords(date: string): Promise<DayWords | null> {
  let p = days.get(date);
  if (!p) {
    p = fetch(`${root()}tanakh/words/${date}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<DayWords>) : null))
      .catch(() => null);
    days.set(date, p);
  }
  return p;
}

export const WORDS_KEY = 'niflaot:words';
const EVENT = 'niflaot:words';
export type WordStore = Record<string, number>;
export const isKnown = (s: WordStore, id: string) => (s[id] ?? 0) > 0;

export function readWordStore(): WordStore {
  try {
    const s = JSON.parse(localStorage.getItem(WORDS_KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}

export function setKnown(id: string, on: boolean) {
  const s = readWordStore();
  const now = Math.floor(Date.now() / 1000);
  s[id] = on ? now : -now;
  try {
    localStorage.setItem(WORDS_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useWordStore(): WordStore {
  const [s, set] = useState(readWordStore);
  useEffect(() => {
    const on = () => set(readWordStore());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

/** Слова дня: самые частые переведённые слова отрывка, которых игрок ещё не знает. */
export function pickWords(day: DayWords[Section], dict: Dict, known: WordStore, n = PER_DAY): Word[] {
  return Object.keys(day.w)
    .filter((id) => dict.tr[id] && !isKnown(known, id))
    .sort((a, b) => dict.rank.get(a)! - dict.rank.get(b)!)
    .slice(0, n)
    .map((id) => dict.words[dict.rank.get(id)! - 1]);
}

/** Сколько процентов слов отрывка игрок узнаёт (имена не считаются). */
export function coverage(day: DayWords[Section], known: WordStore): number {
  if (!day.n) return 100;
  let k = 0;
  for (const [id, c] of Object.entries(day.w)) if (isKnown(known, id)) k += c;
  return Math.round((k / day.n) * 100);
}

/** Сколько переведённых слов словаря игрок знает. */
export const knownCount = (dict: Dict, known: WordStore) => Object.keys(dict.tr).filter((id) => isKnown(known, id)).length;
