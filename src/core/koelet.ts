/**
 * «Тайна Коэлета» (koelet/, `#/koelet`): what the site knows of the game — only what the game itself keeps in this browser,
 * localStorage `koelet-game-v1` (koelet/game.js): the seven worlds done (`done`), the sparks, the hero. Not synced with the
 * account: the game promises that nothing leaves the device (own answers, the mirror). Read by «Мои курсы»
 * (src/core/myCourses.ts) and the «Академия» (the faculty «Тайна Коэлета»: the game's certificate after the seven worlds).
 */
export const KOELET_KEY = 'koelet-game-v1';
export const KOELET_WORLDS = 7;

export interface KoeletState {
  done: number[];
  sparks: number;
  screen?: string;
  /** the prologue's step and the world being played */
  w: number;
  hero?: { name?: string; age?: string | null; g?: string | null };
}

export function readKoelet(): KoeletState | null {
  try {
    const v = JSON.parse(localStorage.getItem(KOELET_KEY) ?? 'null');
    if (!v || v.v !== 1) return null;
    return { done: Array.isArray(v.done) ? v.done : [], sparks: Number(v.sparks) || 0, screen: v.screen, w: Number(v.w) || 0, hero: v.hero };
  } catch {
    return null;
  }
}

/** worlds done of seven; started — the hero was made (age and address chosen) */
export function koeletProgress(s = readKoelet()) {
  const done = s ? s.done.filter(Boolean).length : 0;
  return { done, total: KOELET_WORLDS, started: !!s?.hero?.age, finished: done >= KOELET_WORLDS, sparks: s?.sparks ?? 0 };
}
