/**
 * «Святая музыка» (src/nigun/index.ts): each niggun has its recording, a line time for every line (increasing, inside
 * the recording), the words read and translated on the other languages, the texts on ru/en/de and the link to its
 * source (the condition of the permission of m770.org).
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { NIGUNIM } from '../src/nigun';
import { gaps } from '../src/core/nigunGame';
import { SING_POINTS, linePoints, lineStars, pitchDistance, type PitchTrack } from '../src/core/singing';

const LOCALES = ['ru', 'en', 'de'] as const;

/**
 * «Петь»: the scoring is fair on this recording. A singer who sings its melody — exactly, 0.8 s late (a phone's speaker,
 * Bluetooth headphones), with the microphone hearing a quarter of the moments, a semitone off — gets ≥ 90 % and every
 * line a star; one note held through the song or random notes stay far under the certificate's 70 %.
 */
function calibrate(tr: PitchTrack, times: number[], at: (s: string) => void) {
  const L = tr.p.length;
  // the melody a singer sings: in a 0.6 s window, the note most of its neighbours agree with (no stray harmonics)
  const melody = new Float32Array(L);
  for (let f = 0; f < L; f++) {
    if (!tr.p[f]) continue;
    const w = tr.p.slice(Math.max(0, f - 6), f + 7).filter(Boolean);
    let best = w[0];
    let most = -1;
    for (const a of w) {
      const c = w.filter((b) => pitchDistance(a, b) <= 1).length;
      if (c > most) [most, best] = [c, a];
    }
    melody[f] = best;
  }
  let seed = 1;
  const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const late = (v: Float32Array, s: number) => v.map((_, f) => v[f - Math.round(s / tr.hop)] ?? 0);
  const deaf = (v: Float32Array, keep: number) => v.map((x) => (rand() < keep ? x : 0));
  const notes = tr.p.filter(Boolean).sort((a, b) => a - b);
  const score = (v: Float32Array) => {
    const p = times.map((t, k) => linePoints(tr, v, t, times[k + 1] ?? L * tr.hop));
    return { pct: (100 * p.reduce((a, b) => a + b, 0)) / (p.length * SING_POINTS), starless: p.filter((x) => !lineStars(x)).length };
  };
  const good: [string, Float32Array][] = [
    ['exactly', melody],
    ['0.8 s late', late(melody, 0.8)],
    ['the microphone hearing 25 %', deaf(melody, 0.25)],
    ['a semitone off, 0.5 s late, heard 40 %', late(deaf(melody.map((x) => (x ? x + 1 : 0)), 0.4), 0.5)],
  ];
  for (const [what, v] of good) {
    const r = score(v);
    if (r.pct < 90 || r.starless) at(`singing ${what} scores ${Math.round(r.pct)} %, ${r.starless} lines without a star`);
  }
  const bad: [string, Float32Array][] = [
    ['one note', new Float32Array(L).fill(notes[notes.length >> 1])],
    ['random notes', new Float32Array(L).map(() => 48 + 24 * rand())],
  ];
  for (const [what, v] of bad) {
    const r = score(v);
    if (r.pct > 40) at(`singing ${what} scores ${Math.round(r.pct)} % — too lenient`);
  }
}
const errors: string[] = [];
const ids = new Set<string>();
for (const n of NIGUNIM) {
  const at = (s: string) => errors.push(`nigun ${n.id}: ${s}`);
  if (ids.has(n.id)) at('the id repeats');
  ids.add(n.id);
  if (!/^[a-z0-9-]+$/.test(n.id)) at('the id must be a slug');
  const file = `public/${n.audio}`;
  if (!existsSync(file)) at(`no recording ${file}`);
  else if (statSync(file).size > 8e6) at('the recording is larger than 8 MB');
  // «Петь»: the notes of the recording (scripts/nigun-pitch.py), as long as the recording's lines
  const pitchFile = file.replace(/\.mp3$/, '.pitch.json');
  if (!existsSync(pitchFile)) at(`no notes of the recording: python3 scripts/nigun-pitch.py ${n.id}`);
  else {
    const tr = JSON.parse(readFileSync(pitchFile, 'utf8')) as { hop: number; p: number[] };
    const len = tr.p.length * tr.hop;
    if (!(tr.hop > 0) || tr.p.some((x) => typeof x !== 'number')) at('the notes of the recording are broken');
    if (n.times[n.times.length - 1] >= len) at('the last line starts after the notes of the recording end');
    if (tr.p.filter(Boolean).length < tr.p.length / 3) at('the recording has too few clear notes to sing along');
    else calibrate(tr, n.times, at);
  }
  for (const l of LOCALES) {
    if (!n.title[l]?.trim()) at(`no title (${l})`);
    if (!n.about[l]?.trim()) at(`no text about the niggun (${l})`);
  }
  if (!/^https:\/\//.test(n.source.url) || !n.source.name) at('no link to the source');
  if (n.times.length !== n.lines.length) at(`${n.times.length} times for ${n.lines.length} lines`);
  n.times.forEach((t, k) => {
    if (!(t >= 0) || (k > 0 && t <= n.times[k - 1])) at(`the time of line ${k + 1} must be after the one before`);
  });
  // «Игра на баллы»: every gap has three different words, the right one among them, not always in one place
  const gs = gaps(n);
  const places = new Set<number>();
  gs.forEach((g, k) => {
    if (!g) return;
    const low = g.opts.map((o) => o.toLocaleLowerCase());
    if (low.length !== 3 || new Set(low).size !== 3) at(`line ${k + 1}: the game needs three different words (${g.opts})`);
    const i = low.indexOf(g.word.toLocaleLowerCase());
    if (i < 0) at(`line ${k + 1}: the right word is not among the options`);
    places.add(i);
    if (`${g.before}${g.word}${g.after}` !== n.lines[k].text) at(`line ${k + 1}: the gap does not rebuild the line`);
  });
  if (gs.filter(Boolean).length < 3) at('the game needs at least 3 lines with a gap');
  if (places.size < 2) at('the right word is always in the same place');
  n.lines.forEach((line, k) => {
    if (!line.text.trim()) at(`line ${k + 1} is empty`);
    for (const l of LOCALES)
      if (l !== n.lang && (!line.read?.[l]?.trim() || !line.tr?.[l]?.trim())) at(`line ${k + 1}: no reading or translation (${l})`);
  });
}
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`✓ Святая музыка: ${NIGUNIM.length} нигун(ов) — записи, время строк, тексты ru/en/de, игра на баллы, ноты для пения, ссылка на источник`);
