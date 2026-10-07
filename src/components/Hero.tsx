import { Html, useI18n } from '../i18n';
import type { Lesson, LessonText } from '../lessons/types';
import { Icon, useUI } from './ui';

export function Hero({ lesson, text }: { lesson: Lesson; text: LessonText }) {
  const { t } = useI18n();
  const { open } = useUI();
  return (
    <header className="hero hero-lesson">
      <div className="hero-in" data-l1={lesson.heroLetters[0]} data-l2={lesson.heroLetters[1]}>
        <div className="year">{lesson.year}</div>
        <div className="heb gold-text">{lesson.hebrewTitle}</div>
        <Html as="h1" html={text.hero.heading} />
        <div className="author">{text.hero.author}</div>
        <p className="hero-intro">{text.hero.intro}</p>
        <div className="hero-actions">
          <button className="btn ghost hero-help" onClick={() => open('help')}>
            <Icon name="help" size={18} />
            {t('hero.howTo')}
          </button>
          <a className="btn ghost hero-help" href={`#/${lesson.slug}/print`}>
            <Icon name="print" size={18} />
            {t('print.button')}
          </a>
        </div>
      </div>
    </header>
  );
}
