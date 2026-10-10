import type { Lesson } from './types';
import { PARSHIOT, type ParshaId } from './parshiot';
import baalHaturimBereshit from './01-baal-haturim-bereshit';
import tikunPartzufZanav from './02-tikun-partzuf-zanav';
import yikavuHamayim from './03-yikavu-hamayim';
import shaloshShaot from './04-shalosh-shaot';
import baalHaturimNoach from './05-baal-haturim-noach';
import { installOverrides } from '../content';

/**
 * Registry of all lessons, in order. To add a lesson:
 *   1. copy the last lesson folder to `NN-<slug>/` and fill in data + i18n,
 *   2. import it here and put it into the list (its position = its place in the menu).
 * A «Нифлаот Ребе» lesson (`series: 'rebbe'`) is listed under «Нифлаот Ребе» of its portion, numbered within it.
 */
export const LESSONS: Lesson[] = [baalHaturimBereshit, tikunPartzufZanav, yikavuHamayim, shaloshShaot, baalHaturimNoach];

// text edits made on the site by the admin (src/content/overrides.json)
installOverrides(LESSONS);

export const findLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);

/** Lessons grouped by Torah portion, portions in Torah order; «Нифлаот Ребе» lessons go to `rebbe` of their portion. */
export const LESSON_GROUPS = (Object.keys(PARSHIOT) as ParshaId[])
  .map((id) => ({
    id,
    ...PARSHIOT[id],
    lessons: LESSONS.filter((l) => l.parsha === id && !l.series),
    rebbe: LESSONS.filter((l) => l.parsha === id && l.series === 'rebbe'),
  }))
  .filter((g) => g.lessons.length + g.rebbe.length > 0);

/** «Нифлаот Ребе» lessons of a portion, in order. */
export const rebbeLessons = (parsha: ParshaId) => LESSONS.filter((l) => l.parsha === parsha && l.series === 'rebbe');

export type { Lesson } from './types';
export { PARSHIOT, type ParshaId } from './parshiot';
