import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { LESSONS, LESSON_GROUPS } from '../lessons';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { TagCloud } from './TagCloud';
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

export function Catalog() {
  const { t, pick, locale } = useI18n();
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
              const started = LESSONS.find((l) => {
                const d = progress(l.slug, l.legacyStorageKey);
                return d > 0 && d < l.riddles.length;
              });
              const next = started ?? LESSONS.find((l) => progress(l.slug, l.legacyStorageKey) < l.riddles.length) ?? LESSONS[0];
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
                {g.lessons.map((l) => {
                  const text = pick(l.texts).value;
                  const done = progress(l.slug, l.legacyStorageKey);
                  const total = l.riddles.length;
                  return (
                    <a key={l.slug} className="card" href={`#/${l.slug}`}>
                      <span className="eyebrow">
                        <span>{t('catalog.lesson', { n: l.number })}</span>
                        <span>{done ? t('catalog.progress', { done, total }) : t('catalog.riddles', { n: total })}</span>
                      </span>
                      <span className="heb">{l.hebrewTitle}</span>
                      <h3>{text.title}</h3>
                      <p>{text.summary}</p>
                    </a>
                  );
                })}
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
