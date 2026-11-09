/**
 * «Лоскуты гематрии» (`#/patches`, меню → «Разное»): a grid puzzle of the rectangle-division kind (owner, 09.11.2026).
 * The board is a square grid with clue cells. A clue may show a Hebrew letter-number — its gematria is the area of the
 * rectangle around it (ה = 5 cells, י״ב = 12) — and/or the shape (square, tall, wide, «any»); or neither — then the player
 * finds both. The rules (owner, 09.11.2026): fill the whole grid, shapes don't overlap, every shape holds exactly one clue
 * cell, every cell belongs to exactly one shape. So the player learns the values of the letters by counting cells.
 *
 * The level follows the player (owner: «когда проходит — усложнять, когда много раз ошибается — останавливаться или
 * снижать сложность»): solved with few mistakes and no hints — the next board is harder; with many mistakes or hints —
 * the same or easier. Every board has exactly one solution (the generator checks it with a solver).
 * `niflaot:patches` = {l: level 1–10, g: boards solved, b: {<level>: best seconds}, w: day of the last win} — synced with
 * the account (src/core/sync.ts, mergePatches: the copy with more boards leads).
 */

import { PATCHES_KEY } from './zipReminder';
export { PATCHES_KEY };

export type Shape = 'square' | 'tall' | 'wide' | 'any';

/**
 * level → grid side `n`, the biggest rectangle `max`, the smallest `min`, how many clues show their letter `letters` and
 * their shape `shapes` (0–1; more is revealed if the board would have two solutions) and whether the number is written
 * under the letter `num` (the first boards teach the values).
 */
export const LEVELS: { n: number; min: number; max: number; letters: number; shapes: number; num: boolean }[] = [
  { n: 4, min: 2, max: 6, letters: 1, shapes: 1, num: true },
  { n: 5, min: 2, max: 8, letters: 1, shapes: 0.8, num: true },
  { n: 5, min: 2, max: 10, letters: 1, shapes: 0.6, num: false },
  { n: 6, min: 2, max: 10, letters: 0.9, shapes: 0.5, num: false },
  { n: 6, min: 3, max: 12, letters: 0.85, shapes: 0.45, num: false },
  { n: 7, min: 3, max: 14, letters: 0.8, shapes: 0.4, num: false },
  { n: 7, min: 3, max: 16, letters: 0.75, shapes: 0.35, num: false },
  { n: 8, min: 3, max: 18, letters: 0.7, shapes: 0.3, num: false },
  { n: 8, min: 4, max: 20, letters: 0.65, shapes: 0.25, num: false },
  { n: 9, min: 4, max: 24, letters: 0.6, shapes: 0.2, num: false },
];
export const MAX_LEVEL = LEVELS.length;

/** a rectangle: top row, left column, height, width */
export interface Rect {
  r: number;
  c: number;
  h: number;
  w: number;
}
export interface Clue {
  cell: number;
  /** the area of its shape in the solution (the letter, when shown) */
  value: number;
  /** the letter is shown */
  letter: boolean;
  /** 'any' — the shape is not shown */
  shape: Shape;
}
export interface Board {
  n: number;
  clues: Clue[];
  /** the only solution: solution[i] — the rectangle of clue i */
  solution: Rect[];
}

export const area = (x: Rect) => x.h * x.w;
export const shapeOf = (x: Rect): Exclude<Shape, 'any'> => (x.h === x.w ? 'square' : x.h > x.w ? 'tall' : 'wide');
export const fits = (x: Rect, s: Shape) => s === 'any' || shapeOf(x) === s;
export const inside = (x: Rect, cell: number, n: number) => {
  const r = Math.floor(cell / n);
  const c = cell % n;
  return r >= x.r && r < x.r + x.h && c >= x.c && c < x.c + x.w;
};
export const cellsOf = (x: Rect, n: number) => {
  const out: number[] = [];
  for (let r = x.r; r < x.r + x.h; r++) for (let c = x.c; c < x.c + x.w; c++) out.push(r * n + c);
  return out;
};
export const overlaps = (a: Rect, b: Rect) => a.r < b.r + b.h && b.r < a.r + a.h && a.c < b.c + b.w && b.c < a.c + a.w;
export const sameRect = (a: Rect, b: Rect) => a.r === b.r && a.c === b.c && a.h === b.h && a.w === b.w;
/** the rectangle between two cells (both corners included) */
export function spanRect(a: number, b: number, n: number): Rect {
  const [ar, ac, br, bc] = [Math.floor(a / n), a % n, Math.floor(b / n), b % n];
  return { r: Math.min(ar, br), c: Math.min(ac, bc), h: Math.abs(ar - br) + 1, w: Math.abs(ac - bc) + 1 };
}

const UNITS = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const TENS = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
/** the value as the letters show it (1–99): 5 → ה, 12 → י״ב, 15 → ט״ו, 16 → ט״ז (no geresh after a single letter — a clue, not a date) */
export function letterOf(v: number): string {
  const s = v === 15 ? 'טו' : v === 16 ? 'טז' : TENS[Math.floor(v / 10) % 10] + UNITS[v % 10];
  return s.length === 1 ? s : `${s.slice(0, -1)}״${s.slice(-1)}`;
}
/** the letters of a value with their numbers: 12 → [['י', 10], ['ב', 2]] */
export function lettersOf(v: number): [string, number][] {
  const VAL: Record<string, number> = { א: 1, ב: 2, ג: 3, ד: 4, ה: 5, ו: 6, ז: 7, ח: 8, ט: 9, י: 10, כ: 20, ל: 30, מ: 40, נ: 50, ס: 60, ע: 70, פ: 80, צ: 90, ק: 100, ר: 200, ש: 300, ת: 400 };
  return [...letterOf(v).replace(/[׳״]/g, '')].map((ch) => [ch, VAL[ch]]);
}

/** a small seeded random (mulberry32): the same seed — the same board («Заново» keeps it) */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cut the grid into rectangles of area min…max: from the first free cell, a random rectangle that fits. */
function partition(n: number, min: number, max: number, rand: () => number): Rect[] | null {
  const used = new Array(n * n).fill(false);
  const out: Rect[] = [];
  for (let cell = 0; cell < n * n; cell++) {
    if (used[cell]) continue;
    const r = Math.floor(cell / n);
    const c = cell % n;
    const options: Rect[] = [];
    for (let h = 1; r + h <= n; h++) {
      for (let w = 1; c + w <= n; w++) {
        if (h * w > max) break;
        let free = true;
        for (let rr = r; rr < r + h && free; rr++) for (let cc = c; cc < c + w && free; cc++) if (used[rr * n + cc]) free = false;
        if (!free) break;
        if (h * w >= min) options.push({ r, c, h, w });
      }
    }
    // no room for a big enough piece — a smaller one if it isn't a single cell, else start again
    let pick: Rect | undefined;
    if (options.length) {
      // bigger pieces a bit more often — fewer, more interesting letters; long thin strips less often
      const weight = (x: Rect) => area(x) / Math.max(x.h / x.w, x.w / x.h) ** 0.7;
      const total = options.reduce((s, x) => s + weight(x), 0);
      let roll = rand() * total;
      pick = options.find((x) => (roll -= weight(x)) <= 0) ?? options[options.length - 1];
    } else {
      // only a piece smaller than min fits here: take the biggest one, if it isn't a single cell
      let best: Rect | undefined;
      for (let h = 1; r + h <= n; h++)
        for (let w = 1; c + w <= n; w++) {
          let free = true;
          for (let rr = r; rr < r + h && free; rr++) for (let cc = c; cc < c + w && free; cc++) if (used[rr * n + cc]) free = false;
          if (free && h * w <= max && (!best || h * w > area(best))) best = { r, c, h, w };
        }
      if (!best || area(best) < 2) return null;
      pick = best;
    }
    for (const x of cellsOf(pick, n)) used[x] = true;
    out.push(pick);
  }
  return out;
}

/** All rectangles a clue may stand for: its area and shape, around it, without another clue inside. */
export function candidates(board: Pick<Board, 'n' | 'clues'>, i: number): Rect[] {
  const { n, clues } = board;
  const k = clues[i];
  const out: Rect[] = [];
  const kr = Math.floor(k.cell / n);
  const kc = k.cell % n;
  const sizes: [number, number][] = [];
  for (let h = 1; h <= n; h++)
    for (let w = 1; w <= n; w++) if (k.letter ? h * w === k.value : true) sizes.push([h, w]);
  for (const [h, w] of sizes) {
    const x0: Rect = { r: 0, c: 0, h, w };
    if (!fits(x0, k.shape)) continue;
    for (let r = Math.max(0, kr - h + 1); r <= Math.min(kr, n - h); r++)
      for (let c = Math.max(0, kc - w + 1); c <= Math.min(kc, n - w); c++) {
        const x = { r, c, h, w };
        if (clues.every((o, j) => j === i || !inside(x, o.cell, n))) out.push(x);
      }
  }
  return out;
}

/**
 * How many solutions (up to `limit`): exact cover over the cells — the free cell with the fewest shapes that can still
 * cover it first (a cell nothing can cover ends the branch at once), every clue used once.
 */
export function countSolutions(board: Pick<Board, 'n' | 'clues'>, limit = 2): number {
  const { n, clues } = board;
  const N = n * n;
  // options: [clue, cells]; byCell[c] — the options covering cell c
  const opts: { k: number; cells: number[] }[] = [];
  clues.forEach((_, i) => candidates(board, i).forEach((x) => opts.push({ k: i, cells: cellsOf(x, n) })));
  const byCell: number[][] = Array.from({ length: N }, () => []);
  opts.forEach((o, j) => o.cells.forEach((c) => byCell[c].push(j)));
  const used = new Uint8Array(N);
  const done = new Uint8Array(clues.length);
  const live = (j: number) => !done[opts[j].k] && opts[j].cells.every((c) => !used[c]);
  let found = 0;
  const go = (free: number) => {
    if (found >= limit) return;
    if (!free) {
      if (done.every(Boolean)) found++;
      return;
    }
    let best: number[] | null = null;
    for (let c = 0; c < N; c++) {
      if (used[c]) continue;
      const o = byCell[c].filter(live);
      if (!o.length) return;
      if (!best || o.length < best.length) {
        best = o;
        if (o.length === 1) break;
      }
    }
    for (const j of best!) {
      const o = opts[j];
      done[o.k] = 1;
      for (const c of o.cells) used[c] = 1;
      go(free - o.cells.length);
      for (const c of o.cells) used[c] = 0;
      done[o.k] = 0;
      if (found >= limit) break;
    }
  };
  go(N);
  return found;
}

/** A board for a level and a seed: one solution only; shapes are revealed as needed for that. */
export function makeBoard(level: number, seed: number): Board {
  const L = LEVELS[Math.min(Math.max(level, 1), MAX_LEVEL) - 1];
  for (let attempt = 0; attempt < 400; attempt++) {
    const rand = rng(seed * 7919 + attempt * 104729 + level);
    const parts = partition(L.n, L.min, L.max, rand);
    if (!parts || parts.length < 3) continue;
    const clues: Clue[] = parts.map((x) => {
      const cs = cellsOf(x, L.n);
      return { cell: cs[Math.floor(rand() * cs.length)], value: area(x), letter: rand() < L.letters, shape: rand() < L.shapes ? shapeOf(x) : 'any' };
    });
    // reveal letters and shapes until the solution is the only one (a letter first: the game teaches the letters)
    const hidden: [number, 'letter' | 'shape'][] = [];
    clues.forEach((k, i) => {
      if (!k.letter) hidden.push([i, 'letter']);
      if (k.shape === 'any') hidden.push([i, 'shape']);
    });
    while (countSolutions({ n: L.n, clues }) > 1 && hidden.length) {
      const letters = hidden.filter(([, w]) => w === 'letter');
      const from = letters.length && rand() < 0.65 ? letters : hidden;
      const pick = from[Math.floor(rand() * from.length)];
      hidden.splice(hidden.indexOf(pick), 1);
      const [i, what] = pick;
      clues[i] = what === 'letter' ? { ...clues[i], letter: true } : { ...clues[i], shape: shapeOf(parts[i]) };
    }
    if (countSolutions({ n: L.n, clues }) !== 1) continue;
    return { n: L.n, clues, solution: parts };
  }
  throw new Error(`patches: no board for level ${level}, seed ${seed}`);
}

/** Why a drawn rectangle can't stay (or null — it may): no letter, two letters, wrong number of cells, wrong shape. */
export type Wrong = { why: 'none' } | { why: 'two' } | { why: 'area'; clue: Clue; got: number } | { why: 'shape'; clue: Clue };
export function check(board: Board, x: Rect): Wrong | null {
  const ins = board.clues.filter((k) => inside(x, k.cell, board.n));
  if (!ins.length) return { why: 'none' };
  if (ins.length > 1) return { why: 'two' };
  const k = ins[0];
  if (k.letter && area(x) !== k.value) return { why: 'area', clue: k, got: area(x) };
  if (!fits(x, k.shape)) return { why: 'shape', clue: k };
  return null;
}

/** All cells covered by allowed rectangles — solved (any such cover is right, and there is only one). */
export function solved(board: Board, rects: Rect[]) {
  const cover = new Array(board.n * board.n).fill(0);
  for (const x of rects) {
    if (check(board, x)) return false;
    for (const c of cellsOf(x, board.n)) cover[c]++;
  }
  return cover.every((v) => v === 1);
}

/**
 * The hint — the next step: a shape of the solution the player hasn't drawn yet; first one that a wrong shape of the
 * player stands on (that one has to go), else the clue with the fewest options (the easiest next step).
 */
export function hintRect(board: Board, rects: Rect[]): Rect | null {
  const missing = board.solution.map((x, i) => [x, i] as const).filter(([x]) => !rects.some((y) => sameRect(x, y)));
  if (!missing.length) return null;
  const wrong = rects.filter((y) => !board.solution.some((x) => sameRect(x, y)));
  const blocked = missing.find(([x]) => wrong.some((y) => overlaps(x, y)));
  if (blocked) return blocked[0];
  missing.sort((a, b) => candidates(board, a[1]).length - candidates(board, b[1]).length);
  return missing[0][0];
}

/**
 * The next level (owner: «когда проходит — усложнять, когда много ошибается — останавливаться или снижать»):
 * no hints and at most 1 mistake — up; 2+ hints or 5+ mistakes — down; otherwise the same level.
 */
export function nextLevel(level: number, mistakes: number, hints: number) {
  if (hints >= 2 || mistakes >= 5) return Math.max(1, level - 1);
  if (!hints && mistakes <= 1) return Math.min(MAX_LEVEL, level + 1);
  return level;
}
/** During a board — so many mistakes that the page offers an easier one */
export const TOO_MANY = 6;

export interface PatchesState {
  /** level of the next board */
  l: number;
  /** boards solved (also the seed of the next board) */
  g: number;
  /** best time per level, s */
  b: Record<string, number>;
  /** the day of the last win (YYYY-MM-DD) — for the «Игры» tile on the home page */
  w?: string;
}
export function loadPatches(): PatchesState {
  try {
    const s = JSON.parse(localStorage.getItem(PATCHES_KEY) || 'null');
    if (s && typeof s.l === 'number') return { l: Math.min(Math.max(1, s.l), MAX_LEVEL), g: s.g | 0, b: s.b ?? {}, ...(s.w ? { w: String(s.w) } : {}) };
  } catch {
    /* private mode */
  }
  return { l: 1, g: 0, b: {} };
}
export function savePatches(s: PatchesState) {
  try {
    localStorage.setItem(PATCHES_KEY, JSON.stringify(s));
  } catch {
    /* private mode */
  }
}
export function recordWin(s: PatchesState, level: number, sec: number, mistakes: number, hints: number, today?: string): PatchesState {
  const best = s.b[level];
  return {
    l: nextLevel(level, mistakes, hints),
    g: s.g + 1,
    b: !hints && (best === undefined || sec < best) ? { ...s.b, [level]: sec } : s.b,
    ...(today ?? s.w ? { w: today ?? s.w } : {}),
  };
}
