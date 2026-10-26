/**
 * How good is a niggun's reference of notes (public/nigun/<id>.pitch.json, scripts/nigun-pitch.py)? There is no score
 * to compare with, but a song repeats itself: lines with the same words are sung to the same tune. The share of notes
 * on which the repeats of a line agree (octave aside, a semitone and a half, the best small shift) — the closer the
 * reference to the melody a singer sings, the higher; a choir or an accordion in it lowers it. Also: how much of the
 * recording has a note at all.
 *
 *   npx tsx scripts/nigun-repeats.ts [--old <dir with the previous *.pitch.json>]   → a Markdown table (for the PR)
 */
import { existsSync, readFileSync } from 'node:fs';
import { NIGUNIM, type Nigun } from '../src/nigun';
import { pitchDistance } from '../src/core/singing';

const POINTS = 40;
const SHIFT = 4;

/** the same words: no punctuation, no case */
const words = (s: string) => s.toLocaleLowerCase().replace(/[^\p{L}\p{M}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

export function repeats(n: Nigun, p: number[], hop: number): { agree: number; voiced: number } {
  const end = p.length * hop;
  // a line as POINTS notes over its time
  const shape = (k: number) => {
    const a = n.times[k] / hop;
    const z = (n.times[k + 1] ?? end) / hop;
    return Array.from({ length: POINTS }, (_, i) => p[Math.round(a + ((i + 0.5) * (z - a)) / POINTS)] || 0);
  };
  const groups = new Map<string, number[]>();
  n.lines.forEach((l, k) => groups.set(words(l.text), [...(groups.get(words(l.text)) ?? []), k]));
  let both = 0;
  let met = 0;
  for (const ks of groups.values())
    for (let i = 0; i < ks.length; i++)
      for (let j = i + 1; j < ks.length; j++) {
        const [A, B] = [shape(ks[i]), shape(ks[j])];
        let best = { met: 0, both: 0 };
        for (let d = -SHIFT; d <= SHIFT; d++) {
          let c = 0;
          let m = 0;
          for (let x = 0; x < POINTS; x++) {
            const b = B[x + d];
            if (!A[x] || !b) continue;
            c++;
            if (pitchDistance(A[x], b) <= 1.5) m++;
          }
          if (c && m / c > (best.both ? best.met / best.both : -1)) best = { met: m, both: c };
        }
        both += best.both;
        met += best.met;
      }
  return { agree: both ? Math.round((100 * met) / both) : 0, voiced: Math.round((100 * p.filter(Boolean).length) / p.length) };
}

const read = (file: string) => (existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as { hop: number; p: number[] }) : null);

if (import.meta.url === `file://${process.argv[1]}`) {
  const at = process.argv.indexOf('--old');
  const oldDir = at > 0 ? process.argv[at + 1] : null;
  const rows = ['| Нигун | Ноты в записи | Повторы строк совпадают |', '|---|---|---|'];
  for (const n of NIGUNIM) {
    const cur = read(`public/${n.audio.replace(/\.mp3$/, '.pitch.json')}`);
    if (!cur) continue;
    const now = repeats(n, cur.p, cur.hop);
    const prev = oldDir ? read(`${oldDir}/${n.id}.pitch.json`) : null;
    const was = prev ? repeats(n, prev.p, prev.hop) : null;
    rows.push(
      `| ${n.title.ru} | ${was ? `${was.voiced} % → ` : ''}${now.voiced} % | ${was ? `${was.agree} % → ` : ''}**${now.agree} %** |`,
    );
  }
  console.log(rows.join('\n'));
}
