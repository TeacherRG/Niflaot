/**
 * «Сегодня» — the adults' daily study in one place: the passages of the day of the Prophets and Writings (books and verses,
 * ✓ «Я прочитал(а)», reading time with Metzudat David), today's passage of Chassidut, «Мои слова» (to review today) and the
 * book of the Prophets being read now (for the next certificate). Used by the adults' home (the plan of the day) and the
 * menu («Учить сегодня»); both load this module only when shown (the cycle's data is not in the main bundle).
 */
import { CYCLE, cycleDayFor, loadDay, localToday, readingMinutes } from './tanakh';
import { rangeLabel, type Section } from './tanakhCycle';
import { isDone, type DoneStore } from './academy';
import { readDoneStore } from './tanakhDone';
import { allPassages, hsIsDone, hsLang, passageDate, passageMinutes, readHsDone, todayIndex } from './hemshech';
import { dueWords, inDeck, isKnown, readWordStore } from './words';
import { bookRoadmap } from './milestones';
import { civilDate } from './hebrewDate';
import type { Course, Pace } from './courses';

export interface TodayPassage {
  /** the day of the cycle of this passage: today's (with the Academy) or the first one not read (at one's own pace) */
  date: string;
  range: string;
  done: boolean;
  /** ≈ minutes with Metzudat David — known once the day's text is loaded */
  min?: number;
}

export interface TodayStudy {
  /** the day of the cycle (YYYY-MM-DD): today, or the nearest study day */
  date: string;
  neviim: TodayPassage;
  ketuvim: TodayPassage;
  /** today's passage of Chassidut; before the study starts — the day it opens */
  hs: { id: string; title: string; done: boolean; min: number } | { starts: string };
  words: { due: number; known: number; any: boolean };
  /** the book of the Prophets being read now: passages read of all its days */
  book?: { name: string; done: number; parts: number };
}

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');

/**
 * The passage of a section to read now: with the Academy (`cycle`) — the passage of the day; at one's own pace (`own`) —
 * the first one of the cycle not read yet, whatever its date (all read — the last one).
 */
export function nextIndex(sec: Section, pace: Pace, done: DoneStore, today: string): number {
  if (pace === 'cycle') return cycleDayFor(today).index;
  const i = CYCLE.findIndex((d) => !isDone(done, d.date, sec));
  return i < 0 ? CYCLE.length - 1 : i;
}

/**
 * The passage of Chassidut to read now (-1 — not started): today's; at one's own pace — the first one already open and not
 * read (a passage opens on its day, so one can only be behind, never ahead).
 */
export function hsNextIndex(pace: Pace, read: Record<string, number>, today: string): number {
  const open = todayIndex(today);
  if (pace === 'cycle' || open < 0) return open;
  const k = allPassages()
    .slice(0, open + 1)
    .findIndex((x) => !hsIsDone(read, x.p.id));
  return k < 0 ? open : k;
}

/** Everything that this browser's marks give at once (no network). */
export function todayStudy(locale: string, pace: Pace = 'cycle'): TodayStudy {
  const lang = langOf(locale);
  const today = localToday();
  const day = CYCLE[cycleDayFor(today).index];
  const done = readDoneStore();
  const passage = (sec: Section): TodayPassage => {
    const d = CYCLE[nextIndex(sec, pace, done, today)];
    return { date: d.date, range: rangeLabel(sec, d[sec], lang), done: isDone(done, d.date, sec) };
  };
  const k = hsNextIndex(pace, readHsDone(), today);
  const p = k >= 0 ? allPassages()[k].p : undefined;
  const s = readWordStore();
  const ids = Object.keys(s);
  const book = bookRoadmap('neviim', done, CYCLE, today).find((b) => b.status === 'now');
  return {
    date: day.date,
    neviim: passage('neviim'),
    ketuvim: passage('ketuvim'),
    hs: p ? { id: p.id, title: p.title[hsLang(locale)], done: hsIsDone(readHsDone(), p.id), min: passageMinutes(p, hsLang(locale)) } : { starts: civilDate(passageDate(0), lang) },
    words: { due: dueWords(s).length, known: ids.filter((id) => isKnown(s, id)).length, any: ids.some((id) => inDeck(s, id)) },
    book: book && { name: book.book.name[lang], done: book.done, parts: book.days.length },
  };
}

/** The same, with the reading time of each passage (loads the day's text: public/tanakh/<date>.json). */
export async function withMinutes(t: TodayStudy, locale: string): Promise<TodayStudy> {
  const lang = langOf(locale);
  // at one's own pace the two sections may be on different days
  const min = async (sec: Section) => {
    const c = await loadDay(t[sec].date);
    if (!c) return undefined;
    // the translation shown by default: Russian / German when the whole day is translated, else English (as the passage page)
    const tr = lang !== 'en' && c.neviim.verses.every((v) => v[lang]) ? lang : 'en';
    return readingMinutes(c[sec].verses, true, tr, { md: true, rashi: false }) || undefined;
  };
  const [n, k] = await Promise.all([min('neviim'), min('ketuvim')]);
  return { ...t, neviim: { ...t.neviim, min: n }, ketuvim: { ...t.ketuvim, min: k } };
}

/** How many of the day's things are done, of how many (Chassidut counts once it has started); only the courses chosen (src/core/courses.ts). */
export function todayCount(t: TodayStudy, courses: Course[] = ['neviim', 'ketuvim', 'hemshech', 'lashon']) {
  const has = (c: Course) => courses.includes(c);
  const items = [
    ...(has('neviim') ? [t.neviim.done] : []),
    ...(has('ketuvim') ? [t.ketuvim.done] : []),
    ...(has('hemshech') && 'title' in t.hs ? [t.hs.done] : []),
    ...(has('lashon') ? [t.words.any && !t.words.due] : []),
  ];
  return { done: items.filter(Boolean).length, total: items.length };
}
