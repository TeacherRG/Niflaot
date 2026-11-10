/**
 * «אנגלית דרך התנ״ך» (src/core/enCourse.ts, EnglishCoursePage.tsx): the letters — all 26, each with a name, a sound and a first
 * word; the word levels — from the project's English dictionary, the main meaning a plain English word, no two alike in a level;
 * every lesson of every level (new items, then again a review) — 4 different options with the right one, spelling tiles that make
 * the word, the verse tiles — the verse; the verse check (right, nearly, wrong); the page's Hebrew texts — Hebrew.
 */
import { readFileSync } from 'node:fs';
import words from '../src/tanakh/words.json';
import tr from '../src/tanakh/words/en.json';
import {
  abcUnits,
  freshOf,
  LETTERS,
  mainMeaning,
  makeLesson,
  NEW_PER_LESSON,
  verseNearly,
  verseOk,
  verseRight,
  verseWords,
  wordUnits,
  type EnStore,
  type EnUnit,
  type EnVerse,
} from '../src/core/enCourse';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

if (LETTERS.length !== 26 || new Set(LETTERS.map((l) => l[0])).size !== 26) err('LETTERS: not the 26 letters');
for (const [l, name, sound, w, wHe] of LETTERS) {
  if (!/[א-ת]/.test(name) || !/[א-ת]/.test(sound) || !/[א-ת]/.test(wHe)) err(`${l}: the name, sound and word need Hebrew`);
  if (!w.toLowerCase().includes(l.toLowerCase())) err(`${l}: the word «${w}» has no ${l}`);
}
const abc = abcUnits();
if (abc.reduce((a, u) => a + u.items.length, 0) !== 26) err('abcUnits: not 26 letters');

if (mainMeaning('to say, speak') !== 'say') err('mainMeaning: «to say, speak» → say');
if (mainMeaning('(marks the direct object)') !== null) err('mainMeaning: a note is not a word');

const W = (words as { words: { id: string; he: string }[] }).words;
const units = wordUnits(W, tr as Record<string, string>);
if (units.length < 50) err(`wordUnits: only ${units.length} levels`);
for (const u of units) {
  const mains = u.items.map((x) => x.main.toLowerCase());
  if (new Set(mains).size !== mains.length) err(`${u.id}: two words with the same meaning`);
  if (u !== units.at(-1) && u.items.length < 25) err(`${u.id}: only ${u.items.length} words`);
}

// a fake verse for every third word: the lesson must take it
const verse = (k: string): EnVerse | undefined => (Number(k) % 3 ? undefined : { he: 'בְּרֵאשִׁית בָּרָא', words: verseWords('In the beginning G-d created'), ref: 'test' });
let lessons = 0;
const play = (u: EnUnit) => {
  const s: EnStore = { s: {}, xp: {} };
  for (let round = 0; round < 30; round++) {
    const fresh = freshOf(u, s).slice(0, NEW_PER_LESSON);
    const old = u.items.filter((it) => s.s[it.key]);
    const ex = makeLesson(u, fresh, fresh.length ? old : u.items, round * 31 + 1, { verse: (it) => verse(it.key), hear: true });
    lessons++;
    if (ex.length < 4) err(`${u.id} lesson ${round}: only ${ex.length} exercises`);
    for (const e of ex) {
      if (e.t === 'pick') {
        if (e.options.length !== 4) err(`${u.id}: ${e.options.length} options`);
        if (!e.options.some((o) => o.key === e.item.key)) err(`${u.id}: the right option is missing`);
        if (new Set(e.options.map((o) => o.main.toLowerCase())).size !== 4) err(`${u.id}: options alike`);
      } else if (e.t === 'spell') {
        const left = [...e.tiles];
        for (const c of e.item.main.toLowerCase()) {
          const i = left.indexOf(c);
          if (i < 0) err(`${u.id}: «${e.item.main}» can't be spelled`);
          else left.splice(i, 1);
        }
      } else if (e.t === 'verse') {
        if (!verseOk(e.verse) || [...e.tiles].sort().join() !== [...e.verse.words].sort().join()) err(`${u.id}: the verse tiles`);
      } else if (e.t === 'pairs' && new Set(e.items.map((x) => x.key)).size !== e.items.length) err(`${u.id}: pairs twice`);
    }
    if (!fresh.length) break;
    for (const it of fresh) s.s[it.key] = 1;
  }
  if (freshOf(u, s).length) err(`${u.id}: the lessons never finish the level`);
};
for (const u of [...abc, ...units]) play(u);

const want = ['In', 'the', 'beginning', 'G-d', 'created'];
if (!verseRight(want, [...want])) err('verseRight');
if (!verseNearly(want, ['In', 'the', 'G-d', 'beginning', 'created'])) err('verseNearly: one swap is nearly right');
if (verseNearly(want, ['created', 'G-d', 'beginning', 'the', 'In'])) err('verseNearly: reversed is not');
if (verseWords('“Selah,” he said—to them.').join(' ') !== 'Selah he said to them') err(`verseWords: ${verseWords('“Selah,” he said—to them.').join(' ')}`);

// the page's own texts are Hebrew (no Russian, English or German leaked into the interface)
const page = readFileSync(new URL('../src/components/EnglishCoursePage.tsx', import.meta.url), 'utf8');
const he = page.slice(page.indexOf('export const HE'), page.indexOf('};', page.indexOf('export const HE')));
for (const m of he.matchAll(/^\s+(\w+):\s*(?:\([^)]*\)\s*=>\s*)?['`](.*)['`],?$/gm)) {
  if (m[1] === 'credit') continue;
  if (!/[א-ת]/.test(m[2]) || /[а-яё]/i.test(m[2])) err(`HE.${m[1]}: not Hebrew — ${m[2]}`);
}

if (errors.length) {
  console.error(`✗ Английский для ивритоязычных: ${errors.length} ошибок`);
  for (const e of [...new Set(errors)].slice(0, 30)) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ Английский для ивритоязычных: 26 букв, ${units.length} уровней слов (${units.reduce((a, u) => a + u.items.length, 0)} слов), ${lessons} уроков проверено`);
