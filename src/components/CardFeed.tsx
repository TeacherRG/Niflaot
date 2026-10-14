import { useState, type ReactNode } from 'react';
import { memoImages } from '../core/memo';
import { displayNames } from '../core/names';
import { useI18n } from '../i18n';
import { teacherOf } from '../lessons/teachers';
import type { Lesson } from '../lessons/types';

function FeedCard({
  label,
  source,
  front,
  back,
  href,
}: {
  label: string;
  source: string;
  front: ReactNode;
  back: ReactNode;
  href: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <article className="facts-card">
      <div className="facts-card-src">
        <span>{label}</span>
        <span>{source}</span>
      </div>
      <div className="facts-card-front">{front}</div>
      {open && <div className="facts-card-back">{back}</div>}
      <div className="facts-card-actions">
        <button className="btn ghost" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? t('facts.hideCard') : t('facts.revealCard')}
        </button>
        <a href={href}>{t('facts.openGame')} →</a>
      </div>
    </article>
  );
}

/** A review feed of the matching pairs from Memo games and the Rebbe's verse cards. */
export function CardFeed({ lessons }: { lessons: Lesson[] }) {
  const { t, pick } = useI18n();

  return (
    <main className="facts facts-cards">
      {lessons.flatMap((lesson) => {
        const { value: text } = pick(lesson.texts);
        const teacher = teacherOf(lesson);
        const label = t(`teacher.${teacher}.short`);
        const images = memoImages(lesson);

        return [
          ...(lesson.memo?.items ?? []).map((item, k) => {
            const itemText = text.memo?.items[k];
            if (!itemText) return null;
            return (
              <FeedCard
                key={`${lesson.slug}-memo-${k}`}
                label={`${label} · Memo`}
                source={text.title}
                href={`#/${lesson.slug}/memo/${k + 1}`}
                front={
                  <>
                    {images[k] && <img src={images[k]} alt={itemText.caption} loading="lazy" />}
                    <span>{t('facts.memoPair', { n: k + 1 })}</span>
                  </>
                }
                back={
                  <>
                    <h3>{itemText.title}</h3>
                    <p className="he" lang="he" dir="rtl">{displayNames(item.verse)}</p>
                    <p>{itemText.verse}</p>
                    <p>{itemText.caption}</p>
                  </>
                }
              />
            );
          }),
          ...(lesson.cards?.items ?? []).map((item, k) => {
            const itemText = text.cards?.items[k];
            if (!itemText) return null;
            return (
              <FeedCard
                key={`${lesson.slug}-rebbe-${k}`}
                label={`${label} · ${t('cards.tab')}`}
                source={text.title}
                href={`#/${lesson.slug}/cards`}
                front={
                  <>
                    <h3>{itemText.title}</h3>
                    <p className="he" lang="he" dir="rtl">{displayNames(item.verse)}</p>
                    <p>{itemText.verse}</p>
                  </>
                }
                back={
                  <>
                    <h3>{t('cards.rebbe')}</h3>
                    <p>{itemText.card}</p>
                  </>
                }
              />
            );
          }),
        ];
      })}
    </main>
  );
}
