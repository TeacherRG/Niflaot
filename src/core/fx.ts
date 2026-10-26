import confetti from 'canvas-confetti';

/**
 * The feedback of the word games («Святой язык — уроки», «Слова Торы», «Мои слова»), as in the best language apps:
 * a short sound (Web Audio, no files), a short vibration (Android; iPhone has no `navigator.vibrate`) and confetti.
 * All of it only after a tap; the sound and the vibration can be turned off (on this device only),
 * the confetti keeps quiet for «reduce motion».
 */

const SOUND_KEY = 'niflaot:lashon-sound';
const VIBE_KEY = 'niflaot:lashon-vibe';
const get = (k: string) => {
  try {
    return localStorage.getItem(k) !== '0';
  } catch {
    return true;
  }
};
const set = (k: string, on: boolean) => {
  try {
    localStorage.setItem(k, on ? '1' : '0');
  } catch {}
};
export const soundOn = () => get(SOUND_KEY);
export const setSound = (on: boolean) => set(SOUND_KEY, on);
export const vibeOn = () => get(VIBE_KEY);
export const setVibe = (on: boolean) => set(VIBE_KEY, on);
/** the device can vibrate at all (no button otherwise) */
export const canVibe = () => typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

export type Fx = 'right' | 'wrong' | 'pair' | 'combo' | 'finish' | 'perfect' | 'goal';

/** the notes of each sound: [Hz, start s, length s] */
const NOTES: Record<Fx, [number, number, number][]> = {
  right: [
    [660, 0, 0.16],
    [880, 0.1, 0.2],
  ],
  wrong: [
    [330, 0, 0.16],
    [247, 0.12, 0.24],
  ],
  pair: [[784, 0, 0.14]],
  combo: [
    [660, 0, 0.12],
    [880, 0.08, 0.12],
    [1175, 0.16, 0.22],
  ],
  finish: [
    [523, 0, 0.18],
    [659, 0.12, 0.18],
    [784, 0.24, 0.18],
    [1047, 0.36, 0.4],
  ],
  perfect: [
    [523, 0, 0.16],
    [659, 0.1, 0.16],
    [784, 0.2, 0.16],
    [1047, 0.3, 0.16],
    [1319, 0.42, 0.5],
  ],
  goal: [
    [784, 0, 0.16],
    [988, 0.12, 0.16],
    [1175, 0.24, 0.16],
    [1568, 0.36, 0.5],
  ],
};

const VIBES: Record<Fx, number | number[]> = {
  right: 18,
  wrong: [60, 50, 60],
  pair: 12,
  combo: [20, 40, 20],
  finish: [30, 60, 30, 60, 90],
  perfect: [30, 50, 30, 50, 30, 50, 120],
  goal: [40, 60, 40, 60, 140],
};

let audio: AudioContext | null = null;
function play(fx: Fx, pitch = 1) {
  try {
    audio ??= new AudioContext();
    const a = audio;
    const now = a.currentTime;
    for (const [f, at, len] of NOTES[fx]) {
      const o = a.createOscillator();
      const g = a.createGain();
      o.frequency.value = f * pitch;
      o.type = fx === 'wrong' ? 'triangle' : 'sine';
      g.gain.setValueAtTime(0.0001, now + at);
      g.gain.exponentialRampToValueAtTime(0.14, now + at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + at + len);
      o.connect(g).connect(a.destination);
      o.start(now + at);
      o.stop(now + at + len + 0.02);
    }
  } catch {}
}

/**
 * The sound and the vibration of an event. `streak` — the right answers in a row: each one a semitone higher
 * (up to 8), as Duolingo does.
 */
export function feedback(fx: Fx, streak = 0) {
  if (soundOn()) play(fx, fx === 'right' ? 2 ** (Math.min(8, Math.max(0, streak - 1)) / 12) : 1);
  if (vibeOn() && canVibe()) {
    try {
      navigator.vibrate(VIBES[fx]);
    } catch {}
  }
}

// without a worker: the site's CSP allows no blob: workers
let shoot: confetti.CreateTypes | null = null;
const fire = (o: confetti.Options) => {
  shoot ??= confetti.create(undefined, { resize: true, useWorker: false });
  shoot({ disableForReducedMotion: true, zIndex: 200, ...o });
};
const KIDS = ['#D8B565', '#A47C2F', '#2B4F95', '#2A7448', '#E0663A', '#7B5BB6'];
const BOOK = ['#D8B565', '#A47C2F', '#2B4F95', '#6F8FC9'];

/**
 * Confetti: `small` — a burst from the bottom (a combo of 5, 10…), `big` — the end of a lesson,
 * `grand` — no mistakes / the exam / the goal of the day: two sides and a second wave. The adults — fewer and quieter colors.
 */
export function celebrate(size: 'small' | 'big' | 'grand', adults = false) {
  const colors = adults ? BOOK : KIDS;
  const k = adults ? 0.6 : 1;
  if (size === 'small') return fire({ particleCount: Math.round(40 * k), spread: 70, startVelocity: 35, origin: { y: 0.85 }, colors, scalar: 0.8 });
  fire({ particleCount: Math.round(120 * k), spread: 100, startVelocity: 45, origin: { y: 0.6 }, colors });
  if (size === 'grand') {
    setTimeout(() => {
      fire({ particleCount: Math.round(70 * k), angle: 60, spread: 60, startVelocity: 55, origin: { x: 0, y: 0.7 }, colors });
      fire({ particleCount: Math.round(70 * k), angle: 120, spread: 60, startVelocity: 55, origin: { x: 1, y: 0.7 }, colors });
    }, 350);
  }
}
