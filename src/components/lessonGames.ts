import type { Lesson } from '../lessons/types';
import { cardsOnly } from '../lessons';

/**
 * The games of a lesson for the menu and the catalog cards; none when the lesson has only one.
 * A gematria lesson also has «Читать»: the whole lesson with ready answers and calculations;
 * a «Нифлаот Ребе» lesson — «Прочитать»: the verses with the Rebbe's explanations, also as poems to remember.
 */
export function lessonGames(lesson: Lesson) {
  if (lesson.cards)
    return [
      // a lesson that has only cards so far: no investigation
      ...(cardsOnly(lesson) ? [] : [{ href: `#/${lesson.slug}`, icon: '🔎', label: 'cards.tabLesson' } as const]),
      { href: `#/${lesson.slug}/cards`, icon: '🃏', label: 'cards.tab' },
      { href: `#/${lesson.slug}/read`, icon: '📖', label: 'cards.tabRead' },
    ] as const;
  const read = { href: `#/${lesson.slug}/read`, icon: '📖', label: 'read.tab' } as const;
  if (lesson.memo)
    return [
      { href: `#/${lesson.slug}`, icon: '🔢', label: 'memo.tabGematria' },
      { href: `#/${lesson.slug}/memo`, icon: '🃏', label: 'memo.tabMemo' },
      read,
    ] as const;
  // a «Нифлаот Ребе» lesson without cards yet: the investigation and «Прочитать» (the talk)
  if (lesson.kind === 'sicha')
    return [
      { href: `#/${lesson.slug}`, icon: '🔎', label: 'cards.tabLesson' },
      { href: `#/${lesson.slug}/read`, icon: '📖', label: 'cards.tabRead' },
    ] as const;
  return [{ href: `#/${lesson.slug}`, icon: '🔢', label: 'memo.tabGematria' }, read] as const;
}
