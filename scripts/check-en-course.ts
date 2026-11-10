/**
 * «אנגלית דרך התנ״ך» (src/core/enCourse.ts, EnglishCoursePage.tsx): the letters — all 26, each with a name, a sound and a first
 * word; the word levels — from the project's English dictionary, the main meaning a plain English word, no two alike in a level;
 * every lesson of every level (new items, then again a review) — 4 different options with the right one, spelling tiles that make
 * the word, the verse tiles — the verse; the verse check (right, nearly, wrong); the page's Hebrew texts — Hebrew.
 */
import { readFileSync } from 'node:fs';
import words from '../src/tanakh/words.json';
import trEn from '../src/tanakh/words/en.json';
import trRu from '../src/tanakh/words/ru.json';
import trDe from '../src/tanakh/words/de.json';
import {
  abcUnits,
  freshOf,
  ALPHABETS,
  LETTERS,
  TARGETS,
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
  type Target,
} from '../src/core/enCourse';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

if (LETTERS.length !== 26 || new Set(LETTERS.map((l) => l[0])).size !== 26) err('LETTERS: not the 26 letters');
for (const [l, name, sound, w, wHe] of LETTERS) {
  if (!/[א-ת]/.test(name) || !/[א-ת]/.test(sound) || !/[א-ת]/.test(wHe)) err(`${l}: the name, sound and word need Hebrew`);
  if (!w.toLowerCase().includes(l.toLowerCase())) err(`${l}: the word «${w}» has no ${l}`);
}
const SIZE: Record<Target, number> = { en: 26, ru: 33, de: 30 };
for (const t of TARGETS) {
  const rows = ALPHABETS[t];
  if (rows.length !== SIZE[t] || new Set(rows.map((l) => l[0])).size !== rows.length) err(`${t}: not the ${SIZE[t]} letters`);
  for (const [l, name, sound, w, wHe] of rows) {
    if (!/[\u05D0-\u05EA]/.test(name) || !/[\u05D0-\u05EA]/.test(sound) || !/[\u05D0-\u05EA]/.test(wHe)) err(`${t} ${l}: the name, sound and word need Hebrew`);
    if (!w.toLowerCase().includes(l.toLowerCase())) err(`${t} ${l}: the word «${w}» has no ${l}`);
  }
  if (abcUnits(t).reduce((a, u) => a + u.items.length, 0) !== SIZE[t]) err(`${t} abcUnits: not all the letters`);
}

if (mainMeaning('to say, speak') !== 'say') err('mainMeaning: «to say, speak» → say');
if (mainMeaning('(marks the direct object)') !== null) err('mainMeaning: a note is not a word');

if (mainMeaning('сказать, говорить') !== 'сказать' || mainMeaning('sagen, sprechen') !== 'sagen') err('mainMeaning: ru / de');
const W = (words as { words: { id: string; he: string }[] }).words;
const TR: Record<Target, Record<string, string>> = { en: trEn, ru: trRu, de: trDe };
const byTarget = Object.fromEntries(TARGETS.map((t) => [t, wordUnits(W, TR[t])])) as Record<Target, EnUnit[]>;
const units = byTarget.en;
for (const t of TARGETS) {
  const us = byTarget[t];
  if (us.length < 50) err(`${t} wordUnits: only ${us.length} levels`);
  for (const u of us) {
    const mains = u.items.map((x) => x.main.toLowerCase());
    if (new Set(mains).size !== mains.length) err(`${t} ${u.id}: two words with the same meaning`);
    if (u !== us.at(-1) && u.items.length < 25) err(`${t} ${u.id}: only ${u.items.length} words`);
  }
}

// a fake verse for every third word: the lesson must take it
const verse = (k: string): EnVerse | undefined => (Number(k) % 3 ? undefined : { he: 'בְּרֵאשִׁית בָּרָא', words: verseWords('In the beginning G-d created'), ref: 'test' });
let lessons = 0;
const play = (u: EnUnit, target: Target) => {
  const s: EnStore = { s: {}, xp: {} };
  for (let round = 0; round < 30; round++) {
    const fresh = freshOf(u, s).slice(0, NEW_PER_LESSON);
    const old = u.items.filter((it) => s.s[it.key]);
    const ex = makeLesson(u, fresh, fresh.length ? old : u.items, round * 31 + 1, { verse: (it) => verse(it.key), hear: true, target });
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
for (const t of TARGETS) for (const u of [...abcUnits(t), ...byTarget[t]]) play(u, t);

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
  console.error(`✗ Языки для ивритоязычных: ${errors.length} ошибок`);
  for (const e of [...new Set(errors)].slice(0, 30)) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ Языки для ивритоязычных: ${TARGETS.map((t) => `${t} — ${SIZE[t]} букв, ${byTarget[t].length} уровней (${byTarget[t].reduce((a, u) => a + u.items.length, 0)} слов)`).join('; ')}; ${lessons} уроков проверено`);
