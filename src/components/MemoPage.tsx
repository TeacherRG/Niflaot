import { useEffect } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, MemoData } from '../lessons/types';
import { TopBar } from './TopBar';
import { LessonTabs } from './LessonTabs';
import { Memo } from './Memo';
import { Colophon } from './Colophon';

/** `#/<slug>/memo` — the Memo game of a lesson, next to its gematria game. */
export function MemoPage({ lesson, memo }: { lesson: Lesson; memo: MemoData }) {
  const { t, pick, locale } = useI18n();
  const { value: text, locale: textLocale } = pick(lesson.texts);

  useEffect(() => {
    document.title = `${t('memo.tabMemo')} · ${text.title} · ${t('app.title')}`;
  }, [text.title, t]);

  return (
    <>
      <TopBar title={text.title} />
      <div className="wrap">
        {textLocale !== locale && <div className="fallback-note">{t('catalog.fallback')}</div>}
        <div className="memo-page-head">
          <div className="heb gold-text">{lesson.hebrewTitle}</div>
          <h1>{text.title}</h1>
        </div>
        <LessonTabs lesson={lesson} active="memo" />
        {text.memo && <Memo lesson={lesson} memo={memo} text={text.memo} />}
      </div>
      <Colophon source={text.source} />
    </>
  );
}
