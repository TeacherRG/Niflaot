/**
 * «Что вы хотите учить?» — the courses the player chose (the third question of the onboarding, ModePicker.tsx; changed in
 * the account window). The weekly Torah portion — the Baal HaTurim and «Нифлаот Ребе» — is the same for everyone and is not
 * a course to choose; the courses are the rest: the Prophets, the Writings, Chassidut («Ґемшех»), the Holy Tongue and the
 * niggunim. The home page shows the chosen ones in the tile «Мои курсы» (CoursesCard.tsx) and the adults' plan of the day
 * only these.
 * The Prophets and the Writings go either at the player's own pace (`own`: from the beginning of the cycle, the first
 * passage not read yet, whatever the date) or with the Academy (`cycle`: the passage of the day); Chassidut at one's own
 * pace — the first passage already open and not read (a passage opens on its day).
 * Anyone may also just look around first and choose later: «Добавить в мои курсы» on each course's page (AddCourse.tsx)
 * and «+ курс» in the tile.
 * localStorage `niflaot:courses` = { c: [<course>…], pace: 'own' | 'cycle' }, synced with the account (src/core/sync.ts).
 */
import { useEffect, useState } from 'react';
import type { Mode } from './mode';

export type Course = 'neviim' | 'ketuvim' | 'hemshech' | 'lashon' | 'nigun';
export const COURSES: Course[] = ['neviim', 'ketuvim', 'hemshech', 'lashon', 'nigun'];
export type Pace = 'own' | 'cycle';
export const PACES: Pace[] = ['own', 'cycle'];

export const COURSES_KEY = 'niflaot:courses';
const EVENT = 'niflaot:courses';

export interface CourseChoice {
  c: Course[];
  pace: Pace;
}

/** The choice made, or null when the question was never answered. */
export function savedCourses(): CourseChoice | null {
  try {
    const v = JSON.parse(localStorage.getItem(COURSES_KEY) ?? 'null');
    if (!v || !Array.isArray(v.c)) return null;
    return { c: COURSES.filter((c) => v.c.includes(c)), pace: v.pace === 'cycle' ? 'cycle' : 'own' };
  } catch {
    return null;
  }
}

/** Before a choice — what the home page always showed: the adults' plan of the day (with the Academy), the children's courses. */
export const defaultCourses = (mode: Mode): CourseChoice =>
  mode === 'adults' ? { c: ['neviim', 'ketuvim', 'hemshech', 'lashon'], pace: 'cycle' } : { c: ['lashon', 'nigun'], pace: 'own' };

export const coursesOf = (mode: Mode): CourseChoice => savedCourses() ?? defaultCourses(mode);

export function setCourses(choice: CourseChoice) {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify({ c: COURSES.filter((c) => choice.c.includes(c)), pace: choice.pace }));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** The courses in effect for this mode; every component using it re-renders when they change. */
export function useCourses(mode: Mode): CourseChoice {
  const [v, set] = useState(() => coursesOf(mode));
  useEffect(() => {
    set(coursesOf(mode));
    const on = () => set(coursesOf(mode));
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, [mode]);
  return v;
}

/** Add a course to «Мои курсы» or remove it (from its page or the home tile); the first change starts from the mode's usual courses. */
export function toggleCourse(mode: Mode, course: Course, on: boolean) {
  const { c, pace } = coursesOf(mode);
  setCourses({ c: on ? [...c, course] : c.filter((x) => x !== course), pace });
}

/** Whether the question was answered (the account window opens it while it wasn't). */
export const coursesChosen = () => savedCourses() !== null;
