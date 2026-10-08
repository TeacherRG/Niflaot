import { useI18n } from '../i18n';
import type { Lesson } from '../lessons';
import { lessonProgress } from '../core/progress';
import { lessonGames } from './lessonGames';
import { AgeBadge } from './AgeBadge';

/** A lesson in a list (a teacher's page): number, progress, title, blurb, age; links to both games when it has two. */
export function LessonCard({ lesson: l }: { lesson: Lesson }) {
  const { t, pick } = useI18n();
  const text = pick(l.texts).value;
  const done = lessonProgress(l.slug, l.legacyStorageKey);
  const total = l.riddles.length;
  const games = lessonGames(l);
  return (
    <div className="card-wrap">
      <a className="card" href={`#/${l.slug}`}>
        <span className="eyebrow">
          <span>{t('catalog.lesson', { n: l.number })}</span>
          <span>{done ? t('catalog.progress', { done, total }) : t('catalog.riddles', { n: total })}</span>
        </span>
        <span className="heb">{l.hebrewTitle}</span>
        <h3>{text.title}</h3>
        <p>{text.summary}</p>
        <AgeBadge age={l.age} />
      </a>
      {games && (
        <div className="card-games">
          {games.map((g) => (
            <a key={g.href} href={g.href}>
              {g.icon} {t(g.label)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
