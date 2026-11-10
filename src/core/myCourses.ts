/**
 * «Мои курсы» — the progress of each course the player chose (src/core/courses.ts), for the tile on the home page
 * (CoursesCard.tsx): how much is done of the whole course, what to open next and its link. Loaded only by the tile
 * (the cycle's data and the Chassidut texts are not in the main bundle).
 */
import { localToday, readingPlan } from './tanakh';
import { rangeLabel, type Section } from './tanakhCycle';
import { isDone } from './academy';
import { readDoneStore } from './tanakhDone';
import { allPassages, hsIsDone, hsLang, passageDate, readHsDone } from './hemshech';
import { GOAL, readCourse, xpToday } from './lashon';
import { inDeck, readWordStore, WORDS_ALL } from './words';
import { currentMode } from './mode';
import { NIGUNIM } from '../nigun';
import { nigunCertificates, readNigunStore } from './nigunGame';
import { bookRoadmap } from './milestones';
import { civilDate } from './hebrewDate';
import { hsNextIndex, nextIndex } from './todayStudy';
import { koeletProgress } from './koelet';
import type { Course, CourseChoice, Pace } from './courses';

export interface CourseRow {
  id: Course;
  /** done of the whole course */
  done: number;
  total: number;
  /** what comes next: the verses / the passage / the niggun; the book being read (Prophets, Writings) */
  next?: string;
  book?: { name: string; done: number; parts: number };
  /** the course is finished (or today's part of it is done) */
  finished?: boolean;
  /** today's part is done: the passage of the day read, or (at one's own pace) a passage marked today; «Святой язык» — the day's goal */
  today?: boolean;
  /** «Святой язык»: today's points and the day's goal (the bar is the whole course) */
  xp?: number;
  goal?: number;
  /** the Chassidut has not started yet: the day it opens */
  starts?: string;
  href: string;
}

type Lang = 'ru' | 'en' | 'de';

/** a mark («Я прочитал(а)», time in s; taken back — negative) was made on this local day */
const markedOn = (t: number, today: string) => {
  if (!(t > 0)) return false;
  const d = new Date(t * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === today;
};
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');

function tanakh(sec: Section, choice: CourseChoice, lang: Lang, today: string): CourseRow {
  const plan = readingPlan(choice);
  const cycle = plan.days;
  const store = readDoneStore(plan.id);
  const i = nextIndex(sec, choice.pace, store, today, cycle);
  const day = cycle[i];
  const book = bookRoadmap(sec, store, cycle, today).find((b) => b.days.some((d) => d.date === day.date));
  return {
    id: sec,
    done: cycle.filter((d) => isDone(store, d.date, sec)).length,
    total: cycle.length,
    next: rangeLabel(sec, day[sec], lang),
    book: book && { name: book.book.name[lang], done: book.done, parts: book.days.length },
    finished: isDone(store, day.date, sec),
    today: isDone(store, day.date, sec) || Object.entries(store).some(([k, v]) => k.endsWith(`:${sec}`) && markedOn(v, today)),
    href: `#/${sec}/${day.date}`,
  };
}

function hemshech(pace: Pace, locale: string, lang: Lang, today: string): CourseRow {
  const all = allPassages();
  const read = readHsDone();
  const done = all.filter((x) => hsIsDone(read, x.p.id)).length;
  const k = hsNextIndex(pace, read, today);
  if (k < 0) return { id: 'hemshech', done, total: all.length, starts: civilDate(passageDate(0), lang), href: '#/hemshech' };
  const p = all[k].p;
  const today_ = hsIsDone(read, p.id) || Object.values(read).some((v) => markedOn(v, today));
  return { id: 'hemshech', done, total: all.length, next: p.title[hsLang(locale)], finished: hsIsDone(read, p.id), today: today_, href: `#/hemshech/${p.id}` };
}

/**
 * «Святой язык». Adults: the bar — the words of Tanakh one has (met in the course's lessons or in «Мои слова», «Учу» or
 * «Знаю») of all of them (owner, 10.11.2026: «отметил 500 слов, что знаю, а прогресса нет» — the bar was today's points).
 * Children: the day's goal, as before (their course — letters and the words of the portions' lessons, not in this bundle).
 */
function lashon(): CourseRow {
  const s = readCourse();
  const xp = xpToday(s);
  const met = Object.keys(s.s).length;
  const base = { id: 'lashon' as const, next: String(met), xp: Math.min(xp, GOAL), goal: GOAL, today: xp >= GOAL, href: '#/lashon' };
  if (currentMode() !== 'adults') return { ...base, done: Math.min(xp, GOAL), total: GOAL, finished: xp >= GOAL };
  const deck = readWordStore();
  const words = new Set([...Object.keys(s.s).filter((k) => /^\d+$/.test(k)), ...Object.keys(deck).filter((id) => inDeck(deck, id))]);
  const done = Math.min(words.size, WORDS_ALL);
  return { ...base, next: String(Math.max(met, words.size)), done, total: WORDS_ALL, finished: done >= WORDS_ALL };
}

function nigun(locale: string): CourseRow {
  const certs = nigunCertificates(NIGUNIM, readNigunStore());
  const k = certs.findIndex((c) => !c.progress.earned);
  const n = NIGUNIM[k < 0 ? 0 : k];
  return {
    id: 'nigun',
    done: certs.length - certs.filter((c) => !c.progress.earned).length,
    total: certs.length,
    next: n.title[locale as Lang] ?? n.title.ru,
    finished: k < 0,
    href: k < 0 ? '#/nigun' : `#/nigun/${n.id}`,
  };
}

/** «Тайна Коэлета»: the worlds done of seven (the game's own progress in this browser, src/core/koelet.ts) */
function koelet(): CourseRow {
  const p = koeletProgress();
  return { id: 'koelet', done: p.done, total: p.total, finished: p.finished, href: '#/koelet' };
}

/** The rows of the chosen courses, in the order of COURSES. */
export function myCourses(courses: Course[], choice: CourseChoice, locale: string): CourseRow[] {
  const lang = langOf(locale);
  const today = localToday();
  return courses.map((c) =>
    c === 'neviim' || c === 'ketuvim' ? tanakh(c, choice, lang, today) : c === 'hemshech' ? hemshech(choice.pace, locale, lang, today) : c === 'lashon' ? lashon() : c === 'koelet' ? koelet() : nigun(locale),
  );
}
