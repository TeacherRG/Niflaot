import { Html, useI18n } from '../i18n';
import type { Lesson, LessonText } from '../lessons/types';
import { PARSHIOT } from '../lessons/parshiot';
import { Icon, useUI } from './ui';
import { AgeBadge } from './AgeBadge';
import { lessonArt } from '../core/art';

/**
 * `reading` — on the «Читать» page, a neutral book header for every age: the lesson's title, no age badge,
 * no game intro or «how to play» (the invitation to play is at the end of the page).
 */
export function Hero({ lesson, text, reading }: { lesson: Lesson; text: LessonText; reading?: boolean }) {
  const { t } = useI18n();
  const { open } = useUI();
  const art = lessonArt(lesson, 'hero');
  return (
    <header className="hero hero-lesson">
      {art && <img className="hero-art" src={art} alt={text.hero.art ?? ''} width={1280} height={720} />}
      <div className="hero-in" data-l1={lesson.heroLetters[0]} data-l2={lesson.heroLetters[1]}>
        <div className="year">
          {PARSHIOT[lesson.parsha].year} · <span className="he">{PARSHIOT[lesson.parsha].heYear}</span>
        </div>
        <div className="heb gold-text">{lesson.hebrewTitle}</div>
        {reading ? <h1>{text.title}</h1> : <Html as="h1" html={text.hero.heading} />}
        <div className="author">{text.hero.author}</div>
        {!reading && (
          <>
            <p className="hero-age no-speak">
              <AgeBadge age={lesson.age} />
              <span className="hero-age-note">{text.audience}</span>
            </p>
            <p className="hero-intro">{text.hero.intro}</p>
          </>
        )}
        <div className="hero-actions no-speak">
          {!reading && (
            <button className="btn ghost hero-help" onClick={() => open('help')}>
              <Icon name="help" size={18} />
              {t('hero.howTo')}
            </button>
          )}
          {!reading && (
            <a className="btn ghost hero-help" href={`#/${lesson.slug}/read`}>
              <Icon name="book" size={18} />
              {t(lesson.kind === 'sicha' ? 'cards.tabRead' : 'read.tab')}
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
