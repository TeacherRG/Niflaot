import type { Lesson } from '../lessons/types';

/**
 * The games of a lesson for the menu and the catalog cards; none when the lesson has only one.
 * A gematria lesson also has «Читать»: the whole lesson with ready answers and calculations;
 * a «Нифлаот Ребе» lesson — «Прочитать»: the verses with the Rebbe's explanations, also as poems to remember.
 */
export function lessonGames(lesson: Lesson) {
  if (lesson.cards)
    return [
      { href: `#/${lesson.slug}`, icon: '🔎', label: 'cards.tabLesson' },
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
  if (lesson.kind === 'sicha') return null;
  return [{ href: `#/${lesson.slug}`, icon: '🔢', label: 'memo.tabGematria' }, read] as const;
}
