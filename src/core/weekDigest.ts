/**
 * «Неделя в Академии» — the digest of a week (`#/digest[/<воскресенье>]`, WeekDigest.tsx): what the Academy learnt from
 * Sunday to Friday besides the weekly portion (that is the Friday sheet «К шабатнему столу»), in short quotes — a verse
 * of each day's Prophets and Writings, a sentence of each day's passage of the «Ґемшех», and the niggun of the week with
 * its first lines. Nothing is written for it: it is picked from the texts of the days. Only days up to today.
 */
import { CYCLE } from './tanakh';
import type { DayVerse } from './tanakh';
import { addDays } from './tanakhCycle';
import { allPassages, passageDate } from './hemshech';
import { NIGUNIM, type Nigun } from '../nigun';

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
const balanced = (s: string) =>
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
