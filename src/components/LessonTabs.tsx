import { useI18n } from '../i18n';
import type { Lesson } from '../lessons/types';

/**
 * The two games of a lesson side by side: the riddles (gematria or, in a «Нифлаот Ребе» lesson, the investigation)
 * and the second game — the Memo of a commentary lesson or the «Карточки» of a «Нифлаот Ребе» lesson.
 */
export function LessonTabs({ lesson, active }: { lesson: Lesson; active: 'main' | 'second' }) {
  const { t } = useI18n();
  const tabs = lessonGames(lesson);
  if (!tabs) return null;
  return (
    <nav className="lesson-tabs" aria-label={t('memo.tabsLabel')}>
      {tabs.map((g, k) => (
        <a key={g.href} href={g.href} aria-current={active === (k ? 'second' : 'main') ? 'page' : undefined}>
          <span aria-hidden="true">{g.icon}</span> {t(g.label)}
        </a>
      ))}
    </nav>
  );
}

/** The two games of a lesson for tabs, menu and catalog cards; none when the lesson has only one. */
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
