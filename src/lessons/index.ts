import type { Lesson } from './types';
import { PARSHIOT, type ParshaId } from './parshiot';
import baalHaturimBereshit from './01-baal-haturim-bereshit';
import tikunPartzufZanav from './02-tikun-partzuf-zanav';
import yikavuHamayim from './03-yikavu-hamayim';

/**
 * Registry of all lessons, in order. To add a lesson:
 *   1. copy the last lesson folder to `NN-<slug>/` and fill in data + i18n,
 *   2. import it here and put it into the list (its position = its place in the menu).
 */
export const LESSONS: Lesson[] = [baalHaturimBereshit, tikunPartzufZanav, yikavuHamayim];

export const findLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);

/** Lessons grouped by Torah portion, portions in Torah order. */
export const LESSON_GROUPS = (Object.keys(PARSHIOT) as ParshaId[])
  .map((id) => ({ id, ...PARSHIOT[id], lessons: LESSONS.filter((l) => l.parsha === id) }))
  .filter((g) => g.lessons.length > 0);

export type { Lesson } from './types';
export { PARSHIOT, type ParshaId } from './parshiot';
