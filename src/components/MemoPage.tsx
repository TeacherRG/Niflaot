import { useEffect } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, MemoData } from '../lessons/types';
import { TopBar } from './TopBar';
import { Memo } from './Memo';
import { Colophon } from './Colophon';

/** `#/<slug>/memo` — the Memo game of a lesson, next to its gematria game. */
/** `at` — the pair (1-based) a link points to (`#/<slug>/memo/<n>`): the Memo opens on «Изучите пары» at that pair. */
export function MemoPage({ lesson, memo, at }: { lesson: Lesson; memo: MemoData; at?: number }) {
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
        {text.memo && <Memo lesson={lesson} memo={memo} text={text.memo} at={at} />}
      </div>
      <Colophon source={text.source} />
    </>
  );
}
