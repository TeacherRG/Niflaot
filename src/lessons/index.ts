import type { Lesson } from './types';
import tikunPartzufZanav from './01-tikun-partzuf-zanav';
import yikavuHamayim from './02-yikavu-hamayim';

/**
 * Registry of all lessons, in order. To add lesson #2:
 *   1. copy `01-tikun-partzuf-zanav/` to `02-<slug>/` and fill in data + i18n,
 *   2. import it here and append it to the list.
 */
export const LESSONS: Lesson[] = [tikunPartzufZanav, yikavuHamayim];

export const findLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);

export type { Lesson } from './types';
