/**
 * «Мои курсы» — the progress of each course the player chose (src/core/courses.ts), for the tile on the home page
 * (CoursesCard.tsx): how much is done of the whole course, what to open next and its link. Loaded only by the tile
 * (the cycle's data and the Chassidut texts are not in the main bundle).
 */
import { CYCLE, localToday } from './tanakh';
import { rangeLabel, type Section } from './tanakhCycle';
import { isDone } from './academy';
import { readDoneStore } from './tanakhDone';
import { allPassages, hsIsDone, hsLang, passageDate, readHsDone } from './hemshech';
import { GOAL, readCourse, xpToday } from './lashon';
import { NIGUNIM } from '../nigun';
import { nigunCertificates, readNigunStore } from './nigunGame';
import { bookRoadmap } from './milestones';
import { civilDate } from './hebrewDate';
import { hsNextIndex, nextIndex } from './todayStudy';
import type { Course, Pace } from './courses';

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
  /** the Chassidut has not started yet: the day it opens */
  starts?: string;
  href: string;
}

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');

function tanakh(sec: Section, pace: Pace, lang: Lang, today: string): CourseRow {
  const store = readDoneStore();
  const i = nextIndex(sec, pace, store, today);
  const day = CYCLE[i];
  const book = bookRoadmap(sec, store, CYCLE, today).find((b) => b.days.some((d) => d.date === day.date));
  return {
    id: sec,
    done: CYCLE.filter((d) => isDone(store, d.date, sec)).length,
    total: CYCLE.length,
    next: rangeLabel(sec, day[sec], lang),
    book: book && { name: book.book.name[lang], done: book.done, parts: book.days.length },
    finished: isDone(store, day.date, sec),
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
  return { id: 'hemshech', done, total: all.length, next: p.title[hsLang(locale)], finished: hsIsDone(read, p.id), href: `#/hemshech/${p.id}` };
}

function lashon(): CourseRow {
  const s = readCourse();
  const xp = xpToday(s);
  return { id: 'lashon', done: Math.min(xp, GOAL), total: GOAL, next: String(Object.keys(s.s).length), finished: xp >= GOAL, href: '#/lashon' };
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

/** The rows of the chosen courses, in the order of COURSES. */
export function myCourses(courses: Course[], pace: Pace, locale: string): CourseRow[] {
  const lang = langOf(locale);
  const today = localToday();
  return courses.map((c) =>
    c === 'neviim' || c === 'ketuvim' ? tanakh(c, pace, lang, today) : c === 'hemshech' ? hemshech(pace, locale, lang, today) : c === 'lashon' ? lashon() : nigun(locale),
  );
}
