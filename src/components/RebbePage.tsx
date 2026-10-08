import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { PARSHIOT, rebbeLessons, type ParshaId } from '../lessons';
import { lessonGames } from './LessonTabs';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { AgeBadge } from './AgeBadge';

/** «Нифлаот Ребе» of a Torah portion (`#/rebbe/<parsha>`): its lessons — each with an investigation and cards. */
export function RebbePage({ parsha }: { parsha: ParshaId }) {
  const { t, pick, locale } = useI18n();
  const p = PARSHIOT[parsha];
  const name = p.name[locale as keyof typeof p.name] ?? p.name.ru;
  const lessons = rebbeLessons(parsha);

  useEffect(() => {
    document.title = `${t('rebbe.title')} · ${name} · ${t('app.title')}`;
  }, [t, name]);

  return (
    <>
      <TopBar title={t('app.title')} />
      <div className="wrap">
        <article className="m-card">
          <div className="eyebrow">
            {name} · <span lang="he">{p.he}</span> · {p.year}
          </div>
          <h1>{t('rebbe.title')}</h1>
          <p>{t('rebbe.intro')}</p>
        </article>
        <div className="cards rebbe-list">
          {lessons.map((l) => {
            const text = pick(l.texts).value;
            return (
              <div key={l.slug} className="card-wrap">
                <a className="card" href={`#/${l.slug}`}>
                  <span className="eyebrow">
                    <span>{t('catalog.lesson', { n: l.number })}</span>
                    <span>{t('catalog.riddles', { n: l.riddles.length })}</span>
                  </span>
                  <span className="heb">{l.hebrewTitle}</span>
                  <h3>{text.title}</h3>
                  <p>{text.summary}</p>
                  <AgeBadge age={l.age} />
                </a>
                <div className="card-games">
                  {lessonGames(l)?.map((g) => (
                    <a key={g.href} href={g.href}>
                      {g.icon} {t(g.label)}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
          {!lessons.length && <div className="card soon">{t('rebbe.soon', { parsha: name })}</div>}
        </div>
      </div>
      <Colophon />
    </>
  );
}
