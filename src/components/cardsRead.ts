import type { Lesson } from '../lessons/types';

export type CardsReadMode = 'talk' | 'read' | 'poem';

/**
 * The tabs of the page: «Беседа» only when the lesson has an investigation (riddles), the pairs only when it has cards;
 * «Запомнить в стихах» — only in the children's mode (owner, 16.11.2026: «стихи по карточкам Ребе — только в детском режиме»).
 */
export const cardsReadModes = (lesson: Lesson, adults = false): CardsReadMode[] => [
  ...(lesson.riddles.length ? (['talk'] as const) : []),
  ...(lesson.cards ? (adults ? (['read'] as const) : (['read', 'poem'] as const)) : []),
];

/** The address of a tab: the first one is `#/<slug>/read`, the others `#/<slug>/read/cards`, `/read/poem`. */
export const cardsReadHref = (lesson: Lesson, m: CardsReadMode) =>
  `#/${lesson.slug}/read${m === cardsReadModes(lesson)[0] ? '' : m === 'read' ? '/cards' : `/${m}`}`;
