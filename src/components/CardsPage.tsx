import { useEffect } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, RebbeCardsData } from '../lessons/types';
import { TopBar } from './TopBar';
import { LessonTabs } from './LessonTabs';
import { RebbeCards } from './RebbeCards';
import { Colophon } from './Colophon';

/** `#/<slug>/cards` — «Карточки» of a «Нифлаот Ребе» lesson, next to its investigation. */
export function CardsPage({ lesson, cards }: { lesson: Lesson; cards: RebbeCardsData }) {
  const { t, pick, locale } = useI18n();
  const { value: text, locale: textLocale } = pick(lesson.texts);

  useEffect(() => {
    document.title = `${t('cards.tab')} · ${text.title} · ${t('app.title')}`;
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
        <LessonTabs lesson={lesson} active="second" />
        {text.cards && <RebbeCards lesson={lesson} cards={cards} text={text.cards} />}
      </div>
      <Colophon source={text.source} />
    </>
  );
}
