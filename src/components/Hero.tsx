import { Html, useI18n } from '../i18n';
import type { Lesson, LessonText } from '../lessons/types';

export function Hero({ lesson, text }: { lesson: Lesson; text: LessonText }) {
  const { t } = useI18n();
  return (
    <header className="hero">
      <div className="hero-in" data-l1={lesson.heroLetters[0]} data-l2={lesson.heroLetters[1]}>
        <div className="year">{lesson.year}</div>
        <div className="heb gold-text">{lesson.hebrewTitle}</div>
        <Html as="h1" html={text.hero.heading} />
        <div className="author">{text.hero.author}</div>
        <p>{text.hero.intro}</p>
        <div className="rules">
          {(['rules.first', 'rules.next', 'rules.hint', 'rules.limit', 'rules.lesson'] as const).map((k) => (
            <Html key={k} html={t(k)} />
          ))}
        </div>
      </div>
    </header>
  );
}
