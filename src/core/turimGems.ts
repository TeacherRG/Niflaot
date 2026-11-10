import { LESSONS } from '../lessons';
import type { Lesson, LessonText } from '../lessons/types';
import { NUMS, collectFacts, factMeaning, type Fact } from './facts';
import { plainWord } from './letterPuzzle';
import type { DayEntry } from './turimDaily';

/**
 * Маячки гематрий в «Тора с Бааль ґа-Турим» по дням — так же, как «Ключевое место» в Невиим (владелец, 10.11.2026: «у каждой
 * гематрии — очень кратко мысль, которая за ней стоит»). Равенства — те же, что в ленте «Знаете ли вы?» (`collectFacts`: каждое
 * проверено кодом), мысль — из урока (`factMeaning`: «Чему это учит?» пары Memo или вывод загадки), одним предложением.
 * Слова равенства подчёркнуты в стихе (`range`), а если их в стихе нет — маячок стоит в строке над словами комментатора.
 * Окно (GemPop): равенство с переводом слов, мысль и то же число в других уроках — сеть гематрий.
 */
export type EqFact = Extract<Fact, { kind: 'eq' }>;

let all: EqFact[] | undefined;
/** все равенства уроков (новые уроки — первыми) */
export const allEqFacts = () => (all ??= collectFacts(LESSONS).filter((f): f is EqFact => f.kind === 'eq'));

const words = (s: string) => s.split(/[\s־]+/).map(plainWord).filter(Boolean);
/** where the words stand in a text: [first, last] word index (split at spaces and maqaf, as HeVerse) */
export function phraseRange(text: string, phrase: string): [number, number] | null {
  const ws = text.split(/[ ־]+/).filter(Boolean).map(plainWord);
  const p = words(phrase);
  if (!p.length) return null;
  for (let i = 0; i + p.length <= ws.length; i++) if (p.every((x, j) => ws[i + j] === x)) return [i, i + p.length - 1];
  return null;
}
const inText = (text: string, phrase: string) => ` ${words(text).join(' ')} `.includes(` ${words(phrase).join(' ')} `);
/** the Hebrew the beacon marks: the first word group of the question (סלם in «סלם = סיני», והנה סלם…) */
export const gemPhrase = (f: EqFact) => f.q.split(' + ')[0];

/**
 * The equalities of each comment of a lesson's week: a Memo pair — its own; the lesson's own `daily` — the equalities whose
 * words stand in the comment's verse or in the commentator's words. Each equality — once, at its first comment.
 */
export function entryFacts(lesson: Lesson, entries: DayEntry[], texts: (e: DayEntry) => string[]): EqFact[][] {
  const facts = allEqFacts().filter((f) => f.lesson === lesson);
  const used = new Set<string>();
  return entries.map((e) =>
    facts.filter((f) => {
      if (used.has(f.id)) return false;
      const ok = e.memo !== undefined ? f.mi === e.memo : texts(e).some((t) => inText(t, gemPhrase(f)));
      if (ok) used.add(f.id);
      return ok;
    }),
  );
}

const plain = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
/** the thought behind the equality — one short sentence: «Чему это учит?» (or what the number tells) */
export function gemThought(f: EqFact, text: LessonText | undefined): string {
  if (!text) return '';
  const m = factMeaning(f, text);
  const s = plain(m.moral ?? m.text ?? '');
  const first = s.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? s;
  return first.length <= 140 ? first : `${first.slice(0, first.lastIndexOf(' ', 136))}…`;
}

/** the other equalities with the same number — in all the lessons */
export const sameNumber = (f: EqFact) => allEqFacts().filter((g) => g.v === f.v && g.id !== f.id);

/** the equality as one line: «וילך = 66 = בו ביום» */
export const gemLine = (f: EqFact) => [f.q, String(f.v), ...f.rest.filter((p) => !NUMS.test(p))].join(' = ');
