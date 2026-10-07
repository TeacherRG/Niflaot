import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { LESSONS } from '../lessons';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

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
  const { t, pick } = useI18n();

  useEffect(() => {
    document.title = `${t('app.title')} · MyChitas`;
  }, [t]);

  return (
    <>
      <TopBar title={t('app.title')} />
      <div className="wrap">
        <header className="hero">
          <div className="hero-in" data-l1="נ" data-l2="פ">
            <div className="heb gold-text">נפלאות</div>
            <h1>{t('app.title')}</h1>
            <p>{t('catalog.intro')}</p>
          </div>
        </header>
        <section className="catalog">
          <h2>{t('catalog.heading')}</h2>
          <div className="cards">
            {LESSONS.map((l) => {
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
            <div className="card soon">{t('catalog.soon')}</div>
          </div>
        </section>
      </div>
      <Colophon />
    </>
  );
}
