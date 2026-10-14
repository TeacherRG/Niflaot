import type { Lesson } from '../lessons/types';

export type CardsReadMode = 'talk' | 'read' | 'poem';

/** The tabs of the page: «Беседа» only when the lesson has an investigation (riddles). */
export const cardsReadModes = (lesson: Lesson): CardsReadMode[] => (lesson.riddles.length ? ['talk', 'read', 'poem'] : ['read', 'poem']);

/** The address of a tab: the first one is `#/<slug>/read`, the others `#/<slug>/read/cards`, `/read/poem`. */
export const cardsReadHref = (lesson: Lesson, m: CardsReadMode) =>
  `#/${lesson.slug}/read${m === cardsReadModes(lesson)[0] ? '' : m === 'read' ? '/cards' : `/${m}`}`;
