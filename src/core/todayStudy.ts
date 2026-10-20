/**
 * «Сегодня» — the adults' daily study in one place: the passages of the day of the Prophets and Writings (books and verses,
 * ✓ «Я прочитал(а)», reading time with Metzudat David), today's passage of Chassidut, «Мои слова» (to review today) and the
 * book of the Prophets being read now (for the next certificate). Used by the adults' home (the plan of the day) and the
 * menu («Учить сегодня»); both load this module only when shown (the cycle's data is not in the main bundle).
 */
import { CYCLE, cycleDayFor, loadDay, localToday, readingMinutes } from './tanakh';
import { rangeLabel, type Section } from './tanakhCycle';
import { isDone } from './academy';
import { readDoneStore } from './tanakhDone';
import { allPassages, hsIsDone, hsLang, passageDate, passageMinutes, readHsDone, todayIndex } from './hemshech';
import { dueWords, inDeck, isKnown, readWordStore } from './words';
import { bookRoadmap } from './milestones';
import { civilDate } from './hebrewDate';

export interface TodayPassage {
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
  hs: { title: string; done: boolean; min: number } | { starts: string };
  words: { due: number; known: number; any: boolean };
  /** the book of the Prophets being read now: passages read of all its days */
  book?: { name: string; done: number; parts: number };
}

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');

/** Everything that this browser's marks give at once (no network). */
export function todayStudy(locale: string): TodayStudy {
  const lang = langOf(locale);
  const today = localToday();
  const day = CYCLE[cycleDayFor(today).index];
  const done = readDoneStore();
  const passage = (sec: Section): TodayPassage => ({ range: rangeLabel(sec, day[sec], lang), done: isDone(done, day.date, sec) });
  const k = todayIndex(today);
  const p = k >= 0 ? allPassages()[k].p : undefined;
  const s = readWordStore();
  const ids = Object.keys(s);
  const book = bookRoadmap('neviim', done, CYCLE, today).find((b) => b.status === 'now');
  return {
    date: day.date,
    neviim: passage('neviim'),
    ketuvim: passage('ketuvim'),
    hs: p ? { title: p.title[hsLang(locale)], done: hsIsDone(readHsDone(), p.id), min: passageMinutes(p, hsLang(locale)) } : { starts: civilDate(passageDate(0), lang) },
    words: { due: dueWords(s).length, known: ids.filter((id) => isKnown(s, id)).length, any: ids.some((id) => inDeck(s, id)) },
    book: book && { name: book.book.name[lang], done: book.done, parts: book.days.length },
  };
}

/** The same, with the reading time of each passage (loads the day's text: public/tanakh/<date>.json). */
export async function withMinutes(t: TodayStudy, locale: string): Promise<TodayStudy> {
  const lang = langOf(locale);
  const c = await loadDay(t.date);
  if (!c) return t;
  // the translation shown by default: Russian / German when the whole day is translated, else English (as the passage page)
  const tr = lang !== 'en' && c.neviim.verses.every((v) => v[lang]) ? lang : 'en';
  const min = (sec: Section) => readingMinutes(c[sec].verses, true, tr, { md: true, rashi: false }) || undefined;
  return { ...t, neviim: { ...t.neviim, min: min('neviim') }, ketuvim: { ...t.ketuvim, min: min('ketuvim') } };
}

/** How many of the day's things are done, of how many (Chassidut counts once it has started). */
export function todayCount(t: TodayStudy) {
  const items = [t.neviim.done, t.ketuvim.done, ...('title' in t.hs ? [t.hs.done] : []), t.words.any && !t.words.due];
  return { done: items.filter(Boolean).length, total: items.length };
}
