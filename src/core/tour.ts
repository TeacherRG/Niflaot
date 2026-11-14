/**
 * «Знакомство с сайтом» — the short tour after the onboarding (Tour.tsx): a few notes, one after another, each by the
 * control it explains. The steps name an element by a CSS selector; a step whose element is not on the screen
 * (another mode, a phone without the menu button) is skipped.
 * localStorage `niflaot:tour` = 'go' (start on the home page) | 'done'; this device only.
 */
import type { Mode } from './mode';

export const TOUR_KEY = 'niflaot:tour';
export const TOUR_EVENT = 'niflaot:tour';

export interface TourStep {
  id: string;
  /** the element the note stands by */
  sel: string;
  mode?: Mode;
}

export const TOUR_STEPS: TourStep[] = [
  { id: 'lesson', sel: '.k-go', mode: 'kids' },
  { id: 'tiles', sel: '.k-grid', mode: 'kids' },
  { id: 'parsha', sel: '.a-parsha', mode: 'adults' },
  { id: 'courses', sel: '.a-pair', mode: 'adults' },
  { id: 'coins', sel: '.top .coin-chip' },
  { id: 'account', sel: '.top .acc-chip' },
  { id: 'calendar', sel: '.top .hday' },
  { id: 'lang', sel: '.top .langpick:not(.sharepick)' },
  { id: 'ai', sel: '.ai-fab' },
  { id: 'menu', sel: '.tabbar .tab:last-child, .top .menu-btn' },
];

export const stepsFor = (mode: Mode) => TOUR_STEPS.filter((s) => !s.mode || s.mode === mode);

const read = () => {
  try {
    return localStorage.getItem(TOUR_KEY);
  } catch {
    return null;
  }
};
const write = (v: string) => {
  try {
    localStorage.setItem(TOUR_KEY, v);
  } catch {}
};
export const tourWaiting = () => read() === 'go';
export const endTour = () => write('done');
/** after the onboarding, or «Показать подсказки» in the account: the tour starts on the home page */
export function startTour() {
  write('go');
  if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
  window.dispatchEvent(new Event(TOUR_EVENT));
}
