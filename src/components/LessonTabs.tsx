import { useI18n } from '../i18n';
import type { Lesson } from '../lessons/types';

/** The two games of a commentary lesson side by side: the gematria riddles and the Memo. */
export function LessonTabs({ lesson, active }: { lesson: Lesson; active: 'gematria' | 'memo' }) {
  const { t } = useI18n();
  if (!lesson.memo) return null;
  return (
    <nav className="lesson-tabs" aria-label={t('memo.tabsLabel')}>
      <a href={`#/${lesson.slug}`} aria-current={active === 'gematria' ? 'page' : undefined}>
        <span aria-hidden="true">🔢</span> {t('memo.tabGematria')}
      </a>
      <a href={`#/${lesson.slug}/memo`} aria-current={active === 'memo' ? 'page' : undefined}>
        <span aria-hidden="true">🃏</span> {t('memo.tabMemo')}
      </a>
    </nav>
  );
}
