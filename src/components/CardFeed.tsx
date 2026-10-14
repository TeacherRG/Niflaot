import { useState, type ReactNode } from 'react';
import { memoImages } from '../core/memo';
import { displayNames } from '../core/names';
import { renderTextCard, shareOrSave, type TextCardSection } from '../core/shareCard';
import { SITE_HOST, routeLink } from '../core/site';
import { useI18n } from '../i18n';
import { teacherOf } from '../lessons/teachers';
import type { Lesson } from '../lessons/types';

function FeedCard({
  label,
  source,
  front,
  back,
  href,
  share,
}: {
  label: string;
  source: string;
  front: ReactNode;
  back: ReactNode;
  href: string;
  share: { title: string; sections: TextCardSection[]; filename: string };
}) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState<'idle' | 'making' | 'saved'>('idle');

  const shareCard = async () => {
    setSharing('making');
    try {
      const blob = await renderTextCard({
        eyebrow: `${t('app.title')} · ${t('facts.cardsTab')}`,
        source: `${label} · ${source}`,
        title: share.title,
        sections: share.sections,
        site: SITE_HOST,
      });
      const description = share.sections.map((section) => `${section.heading}: ${section.text}`).join('\n');
      const result = await shareOrSave(
        blob,
        `niflaot-${share.filename}.png`,
        `${share.title}\n${description}\n${routeLink('facts/cards', 'card', locale)}`,
      );
      setSharing(result === 'saved' ? 'saved' : 'idle');
      if (result === 'saved') setTimeout(() => setSharing('idle'), 2500);
    } catch {
      setSharing('idle');
    }
  };

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
        <button className="btn ghost" onClick={shareCard} disabled={sharing === 'making'}>
          📤 {sharing === 'making' ? t('final.cardMaking') : sharing === 'saved' ? t('final.cardSaved') : t('facts.shareCard')}
        </button>
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
                share={{
                  title: itemText.title,
                  filename: `${lesson.slug}-memo-${k + 1}`,
                  sections: [
                    { heading: t('cards.verse'), text: displayNames(item.verse), hebrew: true },
                    { heading: itemText.title, text: itemText.verse },
                    { heading: t('facts.cardWhy'), text: itemText.caption },
                  ],
                }}
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
                share={{
                  title: itemText.title,
                  filename: `${lesson.slug}-rebbe-${k + 1}`,
                  sections: [
                    { heading: t('cards.verse'), text: displayNames(item.verse), hebrew: true },
                    { heading: t('cards.verse'), text: itemText.verse },
                    { heading: t('cards.rebbe'), text: itemText.card },
                    { heading: t('cards.ls', { vol: item.ls.vol, n: item.ls.sicha }), text: itemText.horaah },
                  ],
                }}
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
          ...(lesson.cards?.items ?? []).map((item, k) => {
            const itemText = text.cards?.items[k];
            if (!itemText) return null;
            return (
              <FeedCard
                key={`${lesson.slug}-poem-${k}`}
                label={`${label} · ${t('cards.modePoem')}`}
                source={text.title}
                href={`#/${lesson.slug}/read/poem`}
                share={{
                  title: itemText.title,
                  filename: `${lesson.slug}-poem-${k + 1}`,
                  sections: [
                    { heading: t('cards.verse'), text: displayNames(item.verse), hebrew: true },
                    { heading: t('cards.modePoem'), text: itemText.poem.join('\n') },
                  ],
                }}
                front={
                  <>
                    <h3>{itemText.title}</h3>
                    <p>{itemText.poem.map((line, n) => <span key={n}>{line}{n < itemText.poem.length - 1 && <br />}</span>)}</p>
                  </>
                }
                back={
                  <>
                    <p className="he" lang="he" dir="rtl">{displayNames(item.verse)}</p>
                    <p>{itemText.verse}</p>
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
