/**
 * «Караоке на баллы» (Karaoke.tsx, «Игра на баллы»): while the recording plays, one word of each line is missing —
 * the player picks the word they hear from three. The site asks for no microphone (see CLAUDE.md), so the points are
 * for listening and knowing the words, not for the voice. One answer per line, 10 points for the right word; the
 * certificate «Знаток нигуна» (`n-<id>`, src/components/AcademyPage.tsx) — at PASS (70 %) of the points.
 *
 * Results: `niflaot:nigun` = {<id>: {p: [chosen option per line, -1 — not answered], best: best right answers of a
 * finished game (-1 — none yet), n: gaps}} — the shape of «Вопросы к отрывку», merged the same way (src/core/sync.ts).
 */
import { PASS, type Certificate, type Progress } from './academy';
import type { Nigun } from '../nigun';

export const NIGUN_KEY = 'niflaot:nigun';
export const POINTS = 10;

export interface Gap {
  before: string;
  word: string;
  after: string;
  /** three words in lower case (a capital letter would give the answer away), the right one among them; the same order every time */
  opts: string[];
}

const strip = (w: string) => w.replace(/[^\p{L}\p{M}'’-]/gu, '');
const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();
/** the words of a line that can be missing: three letters and more */
const candidates = (text: string) => text.split(' ').map((w, i) => ({ i, w: strip(w) })).filter((x) => x.w.length >= 3);

/** A tiny steady hash: the choice of the missing word and of the order of the options never changes. */
const hash = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0)!, 16777619) >>> 0;
  return h;
};

/** The missing word of line k, or null — a line too short to have one («Эй!»). */
export function gapOf(n: Nigun, k: number): Gap | null {
  const text = n.lines[k].text;
  const cs = candidates(text);
  if (!cs.length) return null;
  const pick = cs[k % cs.length];
  const words = text.split(' ');
  const raw = words[pick.i];
  const at = raw.indexOf(pick.w);
  const before = words.slice(0, pick.i).map((w) => `${w} `).join('') + raw.slice(0, at);
  const after = raw.slice(at + pick.w.length) + words.slice(pick.i + 1).map((w) => ` ${w}`).join('');
  // the other words of the niggun, without the right one and without repeats
  const others: string[] = [];
  // (no word of this very line: it is on the screen next to the gap)
  n.lines.forEach((l) => {
    for (const c of candidates(l.text))
      if (!cs.some((x) => same(x.w, c.w)) && !others.some((o) => same(o, c.w))) others.push(c.w);
  });
  const h = hash(`${n.id}:${k}`);
  const wrong: string[] = [];
  for (let s = 0; wrong.length < 2 && s < others.length; s++) {
    const w = others[(h + s * 7) % others.length];
    if (!wrong.includes(w)) wrong.push(w);
  }
  const opts = [pick.w, ...wrong].map((w) => w.toLocaleLowerCase());
  const r = h % opts.length;
  return { before, word: pick.w, after, opts: [...opts.slice(r), ...opts.slice(0, r)] };
}

export const gaps = (n: Nigun) => n.lines.map((_, k) => gapOf(n, k));

export interface NigunResult {
  p: number[];
  best: number;
  n: number;
}

export function readNigunStore(): Record<string, NigunResult> {
  try {
    const v = JSON.parse(localStorage.getItem(NIGUN_KEY) ?? '{}');
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

export function saveNigunResult(id: string, r: NigunResult) {
  const all = readNigunStore();
  const old = all[id];
  all[id] = { ...r, best: Math.max(r.best, old?.best ?? -1) };
  try {
    localStorage.setItem(NIGUN_KEY, JSON.stringify(all));
  } catch {}
}

/** Right answers of one game: the chosen option is the right word. */
export const rightCount = (n: Nigun, p: number[]) =>
  gaps(n).reduce((a, g, k) => a + (g && p[k] >= 0 && same(g.opts[p[k]], g.word) ? 1 : 0), 0);

/** The certificates «Знаток нигуна» — one per niggun. */
export function nigunCertificates(list: Nigun[], store: Record<string, NigunResult>): (Certificate & { progress: Progress; href: string })[] {
  return list.map((n) => {
    const max = gaps(n).filter(Boolean).length;
    const best = Math.max(0, store[n.id]?.best ?? 0);
    const got = best * POINTS;
    return {
      id: `n-${n.id}`,
      kind: 'nigun' as const,
      book: { id: n.id, he: 'ניגון', name: n.title },
      href: `#/nigun/${n.id}`,
      progress: {
        got,
        max: max * POINTS,
        done: (store[n.id]?.best ?? -1) >= 0 ? 1 : 0,
        parts: 1,
        complete: true,
        earned: max > 0 && best >= PASS * max,
        scored: true,
      },
    };
  });
}
