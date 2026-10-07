import type { Lesson } from './types';
import { PARSHIOT, type ParshaId } from './parshiot';
import tikunPartzufZanav from './01-tikun-partzuf-zanav';
import yikavuHamayim from './02-yikavu-hamayim';

/**
 * Registry of all lessons, in order. To add lesson #2:
 *   1. copy `01-tikun-partzuf-zanav/` to `02-<slug>/` and fill in data + i18n,
 *   2. import it here and append it to the list.
 */
export const LESSONS: Lesson[] = [tikunPartzufZanav, yikavuHamayim];

export const findLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);

/** Lessons grouped by Torah portion, portions in Torah order. */
export const LESSON_GROUPS = (Object.keys(PARSHIOT) as ParshaId[])
  .map((id) => ({ id, ...PARSHIOT[id], lessons: LESSONS.filter((l) => l.parsha === id) }))
  .filter((g) => g.lessons.length > 0);

export type { Lesson } from './types';
export { PARSHIOT, type ParshaId } from './parshiot';
