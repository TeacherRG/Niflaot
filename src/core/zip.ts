/**
 * «Zip — стих Торы» (меню → «Разное»): a path puzzle on a verse of the Torah that Baal HaTurim comments on in our lessons.
 * The board is a square grid; the numbered circles are the verse's words (or groups of words) in order. The player draws
 * one line from 1 to the last number through every cell — the verse is "said" word by word along the way.
 *
 * Every visit — a verse the player has not solved yet (the portion of the week first), always another one; the level
 * (grid size and how many numbers help) remembers how they played: solved without hints → the next puzzle is harder,
 * with many hints → easier. `niflaot:zip` = {l: level 1–10, d: {<verse>: [date, level, seconds, hints]}, c: {d: date, v: verse}}
 * — synced with the account (src/core/sync.ts, mergeZip).
 */
import { SOURCES, translation } from '../sources';
import { lessonsByNearness } from '../lessons';
import type { Locale } from '../i18n';

export const ZIP_KEY = 'niflaot:zip';

/** level → grid side `n` and how many numbered circles `k` (fewer numbers on a bigger grid — harder) */
export const LEVELS: { n: number; k: number }[] = [
  { n: 4, k: 8 },
  { n: 5, k: 8 },
  { n: 5, k: 6 },
  { n: 6, k: 8 },
  { n: 6, k: 6 },
  { n: 7, k: 8 },
  { n: 7, k: 6 },
  { n: 8, k: 7 },
  { n: 8, k: 5 },
  { n: 9, k: 6 },
];
export const MAX_LEVEL = LEVELS.length;

export interface ZipVerse {
  /** 'Genesis 1:1' */
  ref: string;
  /** chapter and verse, for the title in the reader's language */
  ch: number;
  v: number;
  /** the source in sefaria.json and the line of the verse in it */
  src: string;
  line: number;
  /** Baal HaTurim on this verse (ids in sefaria.json) */
  bht: string[];
  /** where the lesson explains it: `#/<slug>/read/<n>` */
  link: string;
  words: string[];
}

const RANGE = /^Genesis (\d+):(\d+)(?:-(\d+))?$/;

/** All verses with Baal HaTurim in the lessons, the portion of the week first. */
export function zipPool(): ZipVerse[] {
  // the Torah verses we have the text of: 'Genesis 1:4' → [source, line]; a source of one verse wins over a range
  const text = new Map<string, [string, number, boolean]>();
  for (const [id, s] of Object.entries(SOURCES)) {
    const m = s.kind.en === 'Torah' ? RANGE.exec(s.ref) : null;
    if (!m) continue;
    const [ch, a, b] = [Number(m[1]), Number(m[2]), Number(m[3] || m[2])];
    if (s.he.length !== b - a + 1) continue;
    for (let v = a; v <= b; v++) {
      const key = `Genesis ${ch}:${v}`;
      const single = a === b;
      if (!text.has(key) || (single && !text.get(key)![2])) text.set(key, [id, v - a, single]);
    }
  }
  const out = new Map<string, ZipVerse>();
  for (const lesson of lessonsByNearness()) {
    if (lesson.kind !== 'commentary') continue;
    lesson.riddles.forEach((r, i) => {
      const ids = [...(r.sources ?? []), ...(r.quotes ?? []).flat().map((q) => q.split(':')[0])];
      for (const id of ids) {
        const m = id.startsWith('bht-') ? /Genesis (\d+):(\d+)/.exec(SOURCES[id]?.ref ?? '') : null;
        if (!m) continue;
        const ref = `Genesis ${m[1]}:${m[2]}`;
        const t = text.get(ref);
        if (!t) continue;
        const words = SOURCES[t[0]].he[t[1]].replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean);
        if (words.length < 4) continue;
        const have = out.get(ref);
        if (have) {
          if (!have.bht.includes(id)) have.bht.push(id);
          continue;
        }
        out.set(ref, { ref, ch: Number(m[1]), v: Number(m[2]), src: t[0], line: t[1], bht: [id], link: `#/${lesson.slug}/read/${i + 1}`, words });
      }
    });
  }
  return [...out.values()];
}

/** The verse's translation in the reader's language (Sefaria's, else English). */
export function verseTranslation(z: ZipVerse, locale: Locale): string {
  const s = SOURCES[z.src];
  const tr = translation(s, z.src, locale);
  const line = tr.lines.length === s.he.length ? tr.lines[z.line] : s.en[z.line];
  return (line ?? '').replace(/<[^>]+>/g, '');
}

// ——— the player's record ———

export interface ZipState {
  /** the level of the next puzzle, 1…MAX_LEVEL */
  l: number;
  /** solved verses: ref → [date, level, seconds, hints] */
  d: Record<string, [string, number, number, number]>;
  /** the verse of the current visit: date and ref */
  c?: { d: string; v: string };
}

export function loadZip(): ZipState {
  try {
    const x = JSON.parse(localStorage.getItem(ZIP_KEY) ?? 'null');
    if (x && typeof x === 'object') return { l: clampLevel(x.l), d: x.d && typeof x.d === 'object' ? x.d : {}, c: x.c };
  } catch {}
  return { l: 1, d: {} };
}

export function saveZip(s: ZipState) {
  try {
    localStorage.setItem(ZIP_KEY, JSON.stringify(s));
  } catch {}
}

const clampLevel = (l: unknown) => Math.min(MAX_LEVEL, Math.max(1, Math.round(Number(l) || 1)));

/**
 * The verse of this visit: the one chosen today if not solved yet; otherwise — the first verse of the pool
 * (the portion of the week first) not solved yet; when all are solved — the one solved longest ago.
 * Never the verse just played.
 */
export function pickVerse(pool: ZipVerse[], s: ZipState, today: string): ZipVerse | undefined {
  if (!pool.length) return undefined;
  const cur = s.c && pool.find((z) => z.ref === s.c!.v);
  if (cur && s.c!.d === today && !s.d[cur.ref]) return cur;
  const last = s.c?.v;
  const fresh = pool.find((z) => !s.d[z.ref] && z.ref !== last);
  if (fresh) return fresh;
  const old = pool.filter((z) => z.ref !== last).sort((a, b) => (s.d[a.ref]?.[0] ?? '').localeCompare(s.d[b.ref]?.[0] ?? ''));
  return old[0] ?? pool[0];
}

/** After a solved puzzle: the next level from how it went. No hints → one level up; 1–2 hints → the same; 3 and more → one down. */
export function nextLevel(level: number, hints: number): number {
  if (hints === 0) return clampLevel(level + 1);
  if (hints >= 3) return clampLevel(level - 1);
  return clampLevel(level);
}

export function recordWin(s: ZipState, ref: string, today: string, seconds: number, hints: number): ZipState {
  const level = clampLevel(s.l);
  const prev = s.d[ref];
  const best: [string, number, number, number] = [today, level, seconds, hints];
  return { l: nextLevel(level, hints), d: { ...s.d, [ref]: prev && prev[1] > level ? prev : best }, c: s.c };
}

// ——— the board ———

export type Cell = number; // r * n + c

export interface ZipBoard {
  n: number;
  /** the hidden solution: every cell once */
  path: Cell[];
  /** the numbered circles in order: cell and the words they say */
  nodes: { cell: Cell; words: string[] }[];
}

/** a small seeded random (mulberry32): the same verse and level — the same board («Заново») */
function random(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353), (h = (h << 13) | (h >>> 19));
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const neighbours = (cell: Cell, n: number): Cell[] => {
  const r = Math.floor(cell / n);
  const c = cell % n;
  const out: Cell[] = [];
  if (r > 0) out.push(cell - n);
  if (r < n - 1) out.push(cell + n);
  if (c > 0) out.push(cell - 1);
  if (c < n - 1) out.push(cell + 1);
  return out;
};

export const adjacent = (a: Cell, b: Cell, n: number) =>
  (Math.abs(a - b) === 1 && Math.floor(a / n) === Math.floor(b / n)) || Math.abs(a - b) === n;

/** A random path through every cell: a snake, then many "backbite" moves (each keeps it a path through all cells). */
export function randomPath(n: number, rnd: () => number): Cell[] {
  let path: Cell[] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) path.push(r * n + (r % 2 ? n - 1 - c : c));
  const steps = n * n * 40;
  for (let s = 0; s < steps; s++) {
    if (rnd() < 0.5) path.reverse();
    const head = path[0];
    const nb = neighbours(head, n).filter((x) => x !== path[1]);
    if (!nb.length) continue;
    const to = nb[Math.floor(rnd() * nb.length)];
    const i = path.indexOf(to);
    path = [...path.slice(0, i).reverse(), ...path.slice(i)];
  }
  return path;
}

/** The verse's words in `k` groups in order, as even as possible. */
export function groupWords(words: string[], k: number): string[][] {
  const g = Math.max(2, Math.min(k, words.length));
  return Array.from({ length: g }, (_, i) => words.slice(Math.round((i * words.length) / g), Math.round(((i + 1) * words.length) / g)));
}

export function makeBoard(z: ZipVerse, level: number): ZipBoard {
  const { n, k } = LEVELS[clampLevel(level) - 1];
  const rnd = random(`${z.ref}|${level}`);
  const path = randomPath(n, rnd);
  const groups = groupWords(z.words, k);
  const L = path.length;
  const g = groups.length;
  // circle i at an even place along the path, a little shaken; the first — at its start, the last — at its end
  const idx: number[] = [0];
  for (let i = 1; i < g - 1; i++) {
    const base = (i * (L - 1)) / (g - 1);
    const span = (L - 1) / (g - 1) / 3;
    let p = Math.round(base + (rnd() * 2 - 1) * span);
    p = Math.max(idx[i - 1] + 1, Math.min(L - 1 - (g - 1 - i), p));
    idx.push(p);
  }
  idx.push(L - 1);
  return { n, path, nodes: groups.map((words, i) => ({ cell: path[idx[i]], words })) };
}

/**
 * Can the line go on to `cell`? Next to its end, not on the line yet, and a numbered cell only when it is the next number.
 * `reached` — how many numbers the line has passed.
 */
export function canStep(b: ZipBoard, line: Cell[], cell: Cell): boolean {
  const head = line[line.length - 1];
  if (head === undefined || !adjacent(head, cell, b.n) || line.includes(cell)) return false;
  const node = b.nodes.findIndex((x) => x.cell === cell);
  return node < 0 || node === reachedCount(b, line);
}

export const reachedCount = (b: ZipBoard, line: Cell[]) => b.nodes.filter((x) => line.includes(x.cell)).length;

export const solved = (b: ZipBoard, line: Cell[]) => line.length === b.n * b.n && line[line.length - 1] === b.nodes[b.nodes.length - 1].cell;

/** A hint: the line up to where it agrees with the solution, and one more step of it. */
export function hintLine(b: ZipBoard, line: Cell[]): Cell[] {
  let i = 0;
  while (i < line.length && line[i] === b.path[i]) i++;
  return b.path.slice(0, Math.min(b.path.length, i + 1));
}
