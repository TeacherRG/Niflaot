/**
 * «Неделя в Академии» — the digest of a week (`#/digest[/<воскресенье>]`, WeekDigest.tsx): what the Academy learnt from
 * Sunday to Friday besides the weekly portion (that is the Friday sheet «К шабатнему столу»), told briefly with small
 * quotes — each day's Prophets and Writings retold in a sentence or two (the project's retelling, src/tanakh/retell.json,
 * written a week ahead with the translation) and a verse of it, each passage of the «Ґемшех» — its «Коротко» and a
 * sentence of it, and the niggun of the week with its first lines. Only days up to today.
 */
import { CYCLE } from './tanakh';
import type { DayVerse } from './tanakh';
import { addDays } from './tanakhCycle';
import { allPassages, passageDate } from './hemshech';
import { NIGUNIM, type Nigun } from '../nigun';
import retellJson from '../tanakh/retell.json';
import type { Section } from './tanakhCycle';

type Retell = Record<string, Record<Section, Record<'ru' | 'en' | 'de', string>>>;
export const RETELL = retellJson as Retell;
/** The retelling of a day's passage of a section in a language; '' — not written yet (the page shows only the quote). */
export const retell = (date: string, section: Section, lang: 'ru' | 'en' | 'de') => RETELL[date]?.[section]?.[lang] ?? '';

/** The Sunday of the week of a date (YYYY-MM-DD). */
export const weekStart = (date: string) => addDays(date, -new Date(`${date}T12:00:00Z`).getUTCDay());

/** The week the digest opens on: this week — on a Sunday the week that has just ended (today hardly anything is learnt yet). */
export const digestWeek = (today: string) => weekStart(new Date(`${today}T12:00:00Z`).getUTCDay() === 0 ? addDays(today, -1) : today);

/** The weeks that have a digest, the latest first: from the start of the cycle to the week of today. */
export function digestWeeks(today: string): string[] {
  const out: string[] = [];
  for (let w = digestWeek(today); w >= weekStart(CYCLE[0].date); w = addDays(w, -7)) out.push(w);
  return out;
}

/** The study days of the week (Sunday–Friday) that have come by today. */
export const weekDays = (sunday: string, today: string) => CYCLE.filter((d) => d.date >= sunday && d.date < addDays(sunday, 7) && d.date <= today);

/** The passages of the «Ґемшех» learnt in the week by today, with their day. */
export const weekPassages = (sunday: string, today: string) =>
  allPassages()
    .map((x, i) => ({ ...x, date: passageDate(i) }))
    .filter(({ date }) => date >= sunday && date < addDays(sunday, 7) && date <= today);

const count = (s: string, c: string) => s.split(c).length - 1;
/** No quotation cut in the middle: as many opening marks as closing ones (« », “ ” in English, „ “ in German). */
export const balanced = (s: string) =>
  count(s, '«') === count(s, '»') && (s.includes('„') ? count(s, '„') === count(s, '“') : count(s, '“') === count(s, '”')) && count(s, '"') % 2 === 0;
const heWords = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/[\s־]+/).filter(Boolean).length;
const commLength = (v: DayVerse) => (v.md?.he ?? []).join(' ').length;
/** Short enough to quote, long enough to say something: 7–16 words of Hebrew. */
export const QUOTE_WORDS = [7, 16] as const;
/** The translation is a whole sentence: not «G-d said to Joshua:» or a verse that runs on into the next. */
const whole = (v: DayVerse) =>
  [v.en, v.ru, v.de].every((tr) => {
    const s = tr?.replace(/<[^>]+>/g, '').trim();
    return s === undefined || (/[.!?»”“"]$/.test(s) && !/^[a-zа-яäöü]/.test(s) && balanced(s));
  });

/**
 * The verse to quote from a day's passage: a short one (QUOTE_WORDS) that Metzudat David explains the most — the verse
 * the passage turns on rather than a list of names — and a whole sentence; none such — the shortest whole sentence.
 */
export function quoteVerse(verses: DayVerse[]): DayVerse | null {
  const short = verses.filter((v) => heWords(v.he) >= QUOTE_WORDS[0] && heWords(v.he) <= QUOTE_WORDS[1] && whole(v));
  if (short.length) return short.reduce((a, b) => (commLength(b) > commLength(a) ? b : a));
  const rest = verses.filter(whole);
  return (rest.length ? rest : verses).reduce<DayVerse | null>((a, b) => (!a || heWords(b.he) < heWords(a.he) ? b : a), null);
}

/** A sentence from a passage of the «Ґемшех» short enough to quote: 60–240 letters, one with a quotation first. */
export function quoteSentence(paragraphs: string[]): string {
  const sentences = paragraphs
    .flatMap((p) => p.replace(/<[^>]+>/g, '').match(/[^.!?]+[.!?]+(?:[»“”"’)]+)?/g) ?? [])
    .map((s) => s.trim())
    .filter((s) => s.length >= 60 && s.length <= 240 && !/^[a-zа-яäöü]/.test(s) && balanced(s));
  return sentences.find((s) => /[«„“"]/.test(s)) ?? sentences[0] ?? '';
}

/** The first sentence of a text — the shortest beginning that ends a sentence with its quotes closed; the whole text if none. */
export function firstSentence(text: string): string {
  for (const m of text.matchAll(/[.!?…]+[»”“"]?(?=\s)/g)) {
    const head = text.slice(0, m.index + m[0].length);
    if (balanced(head)) return head;
  }
  return text;
}

/** The first `n` sentences of a text (as `firstSentence` finds them). */
export function firstSentences(text: string, n: number): string {
  let head = '';
  let rest = text;
  for (let i = 0; i < n && rest; i++) {
    const one = firstSentence(rest);
    head += one;
    rest = rest.slice(one.length);
  }
  return head.trim();
}

/** How much of the «Коротко» of a passage of the «Ґемшех» the digest tells: its first two sentences. */
export const HS_SENTENCES = 2;

/** The niggun of the week: the niggunim by turns, a week each. */
export const weekNigun = (sunday: string): Nigun =>
  NIGUNIM[Math.round((Date.parse(sunday) - Date.parse(weekStart(CYCLE[0].date))) / (7 * 864e5)) % NIGUNIM.length];

/** The first lines of a niggun up to the first repeat, at most `n`. */
export function firstLines(nigun: Nigun, n = 4) {
  const out: Nigun['lines'] = [];
  for (const l of nigun.lines) {
    if (out.length >= n || out.some((o) => o.text === l.text)) break;
    out.push(l);
  }
  return out;
}
