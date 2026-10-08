import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { LESSONS, LESSON_GROUPS, type Lesson } from '../lessons';
import { lessonGames } from './LessonTabs';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { TagCloud } from './TagCloud';
import { AgeBadge } from './AgeBadge';
import { Icon, useUI } from './ui';

function progress(slug: string, legacy?: string): number {
  for (const key of [`niflaot:lesson:${slug}`, legacy]) {
    if (!key) continue;
    try {
      const s = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (s && Array.isArray(s.done)) return s.done.length;
    } catch {}
  }
  return 0;
}

/** A lesson on the home page: number, progress, title, blurb, age; links to both games when it has two. */
function LessonCard({ lesson: l }: { lesson: Lesson }) {
  const { t, pick } = useI18n();
  const text = pick(l.texts).value;
  const done = progress(l.slug, l.legacyStorageKey);
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

export function Catalog() {
  const { t, locale } = useI18n();
  const { open } = useUI();

  useEffect(() => {
    document.title = `${t('app.title')} · MyChitas`;
  }, [t]);

  return (
    <>
      <TopBar title={t('app.title')} />
      <div className="wrap">
        <header className="hero">
          <div className="hero-in" data-l1="נ" data-l2="פ">
            <div className="year">
              5787 · <span className="he">ה׳תשפ״ז</span>
            </div>
            <div className="heb gold-text">נפלאות</div>
            <h1 className="uvp">{t('catalog.uvp')}</h1>
            <p>{t('catalog.intro')}</p>
            {(() => {
              // continue the first unfinished lesson, or start with lesson 1
              const main = LESSONS.filter((l) => !l.series);
              const started = main.find((l) => {
                const d = progress(l.slug, l.legacyStorageKey);
                return d > 0 && d < l.riddles.length;
              });
              const next = started ?? main.find((l) => progress(l.slug, l.legacyStorageKey) < l.riddles.length) ?? main[0];
              return (
                <a className="btn hero-cta" href={`#/${next.slug}`}>
                  {t(started ? 'catalog.continue' : 'catalog.start', { n: next.number })} →
                </a>
              );
            })()}
            <div className="hero-actions">
              <button className="btn ghost hero-help" onClick={() => open('help')}>
                <Icon name="help" size={18} />
                {t('help.title')}
              </button>
              <button className="btn ghost hero-help" onClick={() => open('about')}>
                <Icon name="info" size={18} />
                {t('about.title')}
              </button>
            </div>
          </div>
        </header>
        <section className="catalog">
          <h2>{t('catalog.heading')}</h2>
          {LESSON_GROUPS.map((g) => (
            <div key={g.id} className="parsha">
              <h3 className="parsha-h">
                <span>{g.name[locale as keyof typeof g.name] ?? g.name.ru}</span>
                <span className="he">{g.he}</span>
                <span className="parsha-year">
                  {g.year} · <span className="he">{g.heYear}</span>
                </span>
              </h3>
              <div className="cards">
                {g.lessons.map((l) => (
                  <LessonCard key={l.slug} lesson={l} />
                ))}
              </div>
              <div className="rebbe-block">
                <a className="rebbe-h" href={`#/rebbe/${g.id}`}>
                  <span aria-hidden="true">✦</span> {t('rebbe.section')}
                  <small>{t('rebbe.intro')}</small>
                </a>
                <div className="cards">
                  {g.rebbe.map((l) => (
                    <LessonCard key={l.slug} lesson={l} />
                  ))}
                  {!g.rebbe.length && <div className="card soon">{t('rebbe.soon', { parsha: g.name[locale as keyof typeof g.name] ?? g.name.ru })}</div>}
                </div>
              </div>
            </div>
          ))}
          <div className="cards">
            <div className="card soon">{t('catalog.soon')}</div>
          </div>
        </section>
        <TagCloud />
      </div>
      <Colophon />
    </>
  );
}
