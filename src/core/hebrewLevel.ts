/**
 * How well the player knows Hebrew — asked once, at the top of «Как играть» on the first visit, changeable any time
 * («Мой иврит» in the menu). It only changes the help around the letters, never the riddles or the score:
 *   none    — doesn't know the letters: letter names under the tiles, transliteration on word cards, hints name the letters;
 *   letters — knows the letters (the default, also when the question was skipped): names on a long press / hover;
 *   reads   — reads Hebrew: no extra help.
 * Stored only in this browser.
 */
import { useEffect, useState } from 'react';

export type HebrewLevel = 'none' | 'letters' | 'reads';
export const HEBREW_LEVELS: HebrewLevel[] = ['none', 'letters', 'reads'];

const KEY = 'niflaot:hebrew';
const EVENT = 'niflaot:hebrew-level';

/** The answer given, or null when the question was never answered. */
export function savedHebrewLevel(): HebrewLevel | null {
  try {
    const v = localStorage.getItem(KEY);
    return HEBREW_LEVELS.includes(v as HebrewLevel) ? (v as HebrewLevel) : null;
  } catch {
    return null;
  }
}

export const hebrewLevel = (): HebrewLevel => savedHebrewLevel() ?? 'letters';

export function setHebrewLevel(level: HebrewLevel) {
  try {
    localStorage.setItem(KEY, level);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** The current level; every component using it re-renders when the player changes it. */
export function useHebrewLevel(): HebrewLevel {
  const [level, setLevel] = useState(hebrewLevel);
  useEffect(() => {
    const on = () => setLevel(hebrewLevel());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return level;
}
