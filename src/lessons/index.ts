import type { Lesson } from './types';
import { PARSHIOT, type ParshaId } from './parshiot';
import baalHaturimBereshit from './01-baal-haturim-bereshit';
import shaloshShaot from './04-shalosh-shaot';
import baalHaturimNoach from './05-baal-haturim-noach';
import rebbeNoach from './06-rebbe-noach';
import baalHaturimLechLecha from './07-baal-haturim-lech-lecha';
import { installOverrides } from '../content';

/**
 * Registry of all lessons, in order. To add a lesson:
 *   1. copy the last lesson folder to `NN-<slug>/` and fill in data + i18n,
 *   2. import it here and put it into the list (its position = its place in the menu).
 * A «Нифлаот Ребе» lesson (`series: 'rebbe'`) is listed under «Нифлаот Ребе» of its portion, numbered within it.
 */
export const LESSONS: Lesson[] = [baalHaturimBereshit, shaloshShaot, baalHaturimNoach, rebbeNoach, baalHaturimLechLecha];

// text edits made on the site by the admin (src/content/overrides.json)
installOverrides(LESSONS);

export const findLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);

/** A «Нифлаот Ребе» lesson that has only «Карточки» so far (no investigation): `#/<slug>` opens the cards. */
export const cardsOnly = (l: Lesson) => !!l.cards && !l.riddles.length;

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

/**
 * Lessons in order of nearness to the date (YYYY-MM-DD, the device's today by default): the portion of this week
 * first (the first whose Shabbat is that day or later), then the next portions, then the past ones from the most
 * recent back; within a portion — in list order. The review feeds («Знаете ли вы?») open on what is learnt now.
 */
export function lessonsByNearness(today = localDate()): Lesson[] {
  const ids = Object.keys(PARSHIOT) as ParshaId[];
  const rank = (l: Lesson) => {
    const i = ids.indexOf(l.parsha);
    const now = ids.findIndex((p) => PARSHIOT[p].shabbat >= today && LESSONS.some((x) => x.parsha === p));
    const cur = now < 0 ? ids.length : now;
    return i >= cur ? i - cur : ids.length + (cur - i);
  };
  return LESSONS.map((l, k) => ({ l, k, r: rank(l) }))
    .sort((a, b) => a.r - b.r || a.k - b.k)
    .map((x) => x.l);
}

const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export type { Lesson } from './types';
export { PARSHIOT, type ParshaId } from './parshiot';
