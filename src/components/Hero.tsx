import { Html, useI18n } from '../i18n';
import type { Lesson, LessonText } from '../lessons/types';
import { PARSHIOT } from '../lessons/parshiot';
import { Icon, useUI } from './ui';
import { AgeBadge } from './AgeBadge';

/** `reading` — on the «Читать» page: the button leads back to the game instead. */
export function Hero({ lesson, text, reading }: { lesson: Lesson; text: LessonText; reading?: boolean }) {
  const { t } = useI18n();
  const { open } = useUI();
  return (
    <header className="hero hero-lesson">
      <div className="hero-in" data-l1={lesson.heroLetters[0]} data-l2={lesson.heroLetters[1]}>
        <div className="year">
          {PARSHIOT[lesson.parsha].year} · <span className="he">{PARSHIOT[lesson.parsha].heYear}</span>
        </div>
        <div className="heb gold-text">{lesson.hebrewTitle}</div>
        <Html as="h1" html={text.hero.heading} />
        <div className="author">{text.hero.author}</div>
        <p className="hero-age no-speak">
          <AgeBadge age={lesson.age} />
          <span className="hero-age-note">{text.audience}</span>
        </p>
        <p className="hero-intro">{text.hero.intro}</p>
        <div className="hero-actions no-speak">
          <button className="btn ghost hero-help" onClick={() => open('help')}>
            <Icon name="help" size={18} />
            {t('hero.howTo')}
          </button>
          {(lesson.kind !== 'sicha' || lesson.cards) && (
            <a className="btn ghost hero-help" href={reading ? `#/${lesson.slug}` : `#/${lesson.slug}/read`}>
              {reading ? <Icon name="hash" size={18} /> : <Icon name="book" size={18} />}
              {t(reading ? 'read.playBtn' : lesson.cards ? 'cards.tabRead' : 'read.tab')}
            </a>
          )}
          <a className="btn ghost hero-help" href={`#/${lesson.slug}/print`}>
            <Icon name="print" size={18} />
            {t('print.button')}
          </a>
        </div>
      </div>
    </header>
  );
}
