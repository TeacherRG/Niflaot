import type { Lesson } from '../lessons/types';

/** The two games of a lesson for the menu and the catalog cards; none when the lesson has only one. */
export function lessonGames(lesson: Lesson) {
  if (lesson.cards)
    return [
      { href: `#/${lesson.slug}`, icon: '🔎', label: 'cards.tabLesson' },
      { href: `#/${lesson.slug}/cards`, icon: '🃏', label: 'cards.tab' },
    ] as const;
  if (lesson.memo)
    return [
      { href: `#/${lesson.slug}`, icon: '🔢', label: 'memo.tabGematria' },
      { href: `#/${lesson.slug}/memo`, icon: '🃏', label: 'memo.tabMemo' },
    ] as const;
  return null;
}
