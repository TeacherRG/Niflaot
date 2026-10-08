import type { Lesson } from './types';

/**
 * The teachers of the site — each with his own genre of lesson (see «О проекте»): Rabbi Ginsburgh's articles are
 * gematria games, the Baal HaTurim's commentary is gematria and letters plus a Memo, the Rebbe's talks are
 * investigations plus cards. Each has a colour (lesson tiles on the home page) and a short name, UI string `teacher.<id>.short`.
 */
export const TEACHERS = {
  ginsburgh: { he: 'נ', color: 'gold' },
  'baal-haturim': { he: 'ט', color: 'tchelet' },
  rebbe: { he: 'ר', color: 'green' },
} as const;

export type TeacherId = keyof typeof TEACHERS;

/** Whose lesson it is: a «Нифлаот Ребе» talk, a commentary (Baal HaTurim), or an article of Rabbi Ginsburgh. */
export const teacherOf = (l: Lesson): TeacherId =>
  l.series === 'rebbe' ? 'rebbe' : l.kind === 'commentary' ? 'baal-haturim' : 'ginsburgh';
