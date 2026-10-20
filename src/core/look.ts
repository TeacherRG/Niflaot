/**
 * The reader's look — chosen in the account («Мои настройки» → «Вид»): the theme (light — by default — or dark), the
 * background (each page's own, or one for all: light — white, cream, sepia; dark — black) and the text size (3 steps).
 * localStorage `niflaot:look` = {theme, bg, size}; only this device (a phone and a computer may want different ones).
 * public/look.js applies it before the page is drawn; here — the same rules, the change and a hook for the settings.
 */
import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
export type Bg = 'auto' | 'white' | 'cream' | 'sepia' | 'black';
export type Size = 1 | 2 | 3;
export interface Look {
  theme: Theme;
  bg: Bg;
  size: Size;
}

export const LOOK_KEY = 'niflaot:look';
const EVENT = 'niflaot:look';
export const THEMES: Theme[] = ['light', 'dark'];
export const SIZES: Size[] = [1, 2, 3];
/** the backgrounds of each theme; «auto» — each page's own (the children's home is warm, the adults' — white) */
export const BGS: Record<Theme, Bg[]> = { light: ['auto', 'white', 'cream', 'sepia'], dark: ['auto', 'black'] };
export const DEFAULT_LOOK: Look = { theme: 'light', bg: 'auto', size: 1 };

/** The saved look, with anything unknown replaced by the default (a background of the other theme — «auto»). */
export function readLook(): Look {
  let raw: Partial<Look> = {};
  try {
    raw = JSON.parse(localStorage.getItem(LOOK_KEY) ?? 'null') ?? {};
  } catch {}
  const theme: Theme = raw.theme === 'dark' ? 'dark' : 'light';
  const bg: Bg = BGS[theme].includes(raw.bg as Bg) ? (raw.bg as Bg) : 'auto';
  const size: Size = SIZES.includes(raw.size as Size) ? (raw.size as Size) : 1;
  return { theme, bg, size };
}

/** Put the look on the page: html[data-theme], html[data-bg], html[data-size] (styles.css, «the look»). */
export function applyLook(l: Look = readLook()) {
  const h = document.documentElement;
  const set = (name: string, value: string | null) => (value ? h.setAttribute(name, value) : h.removeAttribute(name));
  set('data-theme', l.theme === 'dark' ? 'dark' : null);
  set('data-bg', l.bg === 'auto' ? null : l.bg);
  set('data-size', l.size > 1 ? String(l.size) : null);
  // the browser's bars follow the page
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', l.theme === 'dark' ? '#0E1222' : '#141A33');
}

/** Change part of the look; a new theme keeps the background only if that theme has it. */
export function setLook(change: Partial<Look>) {
  const next = { ...readLook(), ...change };
  if (!BGS[next.theme].includes(next.bg)) next.bg = 'auto';
  try {
    localStorage.setItem(LOOK_KEY, JSON.stringify(next));
  } catch {}
  applyLook(next);
  window.dispatchEvent(new Event(EVENT));
}

let cached: Look | null = null;
const snapshot = () => {
  const l = readLook();
  if (!cached || cached.theme !== l.theme || cached.bg !== l.bg || cached.size !== l.size) cached = l;
  return cached;
};
const subscribe = (on: () => void) => {
  window.addEventListener(EVENT, on);
  window.addEventListener('storage', on);
  return () => {
    window.removeEventListener(EVENT, on);
    window.removeEventListener('storage', on);
  };
};

/** The look for the settings (updates when it changes here or in another tab). */
export const useLook = () => useSyncExternalStore(subscribe, snapshot, () => DEFAULT_LOOK);
