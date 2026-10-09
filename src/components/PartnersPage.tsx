import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { NIFLAOT_LOGO, PARTNERS } from '../core/partners';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

/** `#/partners` — «Партнёры»: the communities the project is made with, with their logos. */
export function PartnersPage() {
  const { t, locale } = useI18n();

  useEffect(() => {
    document.title = `${t('partners.title')} · ${t('app.title')}`;
  }, [t]);

  return (
    <>
      <TopBar title={t('partners.title')} />
      <div className="wrap">
        <header className="partners-head">
          <img className="partners-logo" src={NIFLAOT_LOGO} alt="Niflaot" />
          <h1>{t('partners.title')}</h1>
          <p>{t('partners.intro')}</p>
        </header>
        <main className="partners">
          {PARTNERS.map((p) => {
            const body = (
              <>
                <img src={p.logo} alt={p.he ? `${p.name} · ${p.he}` : p.name} loading="lazy" />
                <span className="partner-name">{p.name}</span>
                <span className="partner-about">{p.about[locale] ?? p.about.ru}</span>
                {p.url && <span className="partner-url">{p.url.replace(/^https?:\/\//, '')} ↗</span>}
              </>
            );
            return p.url ? (
              <a key={p.id} className="partner" href={p.url} target="_blank" rel="noopener">
                {body}
              </a>
            ) : (
              <div key={p.id} className="partner">
                {body}
              </div>
            );
          })}
        </main>
      </div>
      <Colophon />
    </>
  );
}
