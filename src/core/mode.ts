/**
 * The site's mode — who is learning, chosen on the first visit (ModePicker.tsx) and changeable any time in the account window:
 *   kids   — «Дети и семья»: games and riddles on the Torah portions (ages 8+, no Hebrew needed);
 *   adults — «Подростки и взрослые»: the Torah lessons to read, the Prophets and Writings every day.
 * The mode shapes the home page, the menu and «Академия» — not the access: any link opens in any mode.
 * Stored in this browser (`niflaot:mode`) and synced with the account (src/core/sync.ts).
 */
import { useEffect, useState } from 'react';

export type Mode = 'kids' | 'adults';
export const MODES: Mode[] = ['kids', 'adults'];

export const MODE_KEY = 'niflaot:mode';
/** fired on this page when the mode changes */
export const MODE_EVENT = 'niflaot:mode';
const EVENT = MODE_EVENT;

/** The chosen mode, or null when it was never chosen. */
export function savedMode(): Mode | null {
  try {
    const v = localStorage.getItem(MODE_KEY);
    return MODES.includes(v as Mode) ? (v as Mode) : null;
  } catch {
    return null;
  }
}

/** The mode in effect: before a choice — the children's site (as it always was). */
export const currentMode = (): Mode => savedMode() ?? 'kids';

export function setMode(mode: Mode | null) {
  try {
    if (mode) localStorage.setItem(MODE_KEY, mode);
    else localStorage.removeItem(MODE_KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** The saved mode (null — not chosen yet); every component using it re-renders when it changes. */
export function useSavedMode(): Mode | null {
  const [mode, set] = useState(savedMode);
  useEffect(() => {
    const on = () => set(savedMode());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return mode;
}

export const useMode = (): Mode => useSavedMode() ?? 'kids';

/**
 * A page opened by a machine, not a person: the browser's «listen to this page» (Google-Read-Aloud), search engines,
 * previews. It gets the page itself — no mode question, no «How to play» on top of it.
 */
export const isReader = () =>
  typeof navigator !== 'undefined' &&
  (navigator.webdriver || /Google-Read-Aloud|bot\b|crawler|spider|Headless|Lighthouse|Google-InspectionTool/i.test(navigator.userAgent));
