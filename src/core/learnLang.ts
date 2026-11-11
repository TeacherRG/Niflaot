import { useEffect, useState } from 'react';

/**
 * «Какой язык вы будете учить?» (owner, 11.11.2026) — one question in the account settings: the Holy Tongue (Hebrew — the
 * site's own course, `#/lashon`) or, for Hebrew speakers, English, Russian or German through Tanakh (`#/english`…).
 * The «Hebrew» tab of the bottom bar leads to the chosen course. Only on this device (`niflaot:learn-lang`).
 */
export type LearnLang = 'he' | 'en' | 'ru' | 'de';
export const LEARN_LANGS: LearnLang[] = ['he', 'en', 'ru', 'de'];
export const LEARN_ROUTE: Record<LearnLang, string> = { he: 'lashon', en: 'english', ru: 'russian', de: 'german' };
const KEY = 'niflaot:learn-lang';
const EVENT = 'niflaot:learn-lang';

export function savedLearnLang(): LearnLang | null {
  try {
    const v = localStorage.getItem(KEY);
    return (LEARN_LANGS as string[]).includes(v ?? '') ? (v as LearnLang) : null;
  } catch {
    return null;
  }
}

export function setLearnLang(l: LearnLang) {
  try {
    localStorage.setItem(KEY, l);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useLearnLang(): LearnLang | null {
  const [l, set] = useState(savedLearnLang);
  useEffect(() => {
    const on = () => set(savedLearnLang());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return l;
}
