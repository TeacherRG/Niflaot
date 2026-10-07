import type { ReactNode } from 'react';
import { LOCALES, useI18n, type Locale } from '../i18n';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="lang" role="group" aria-label={t('app.language')}>
      {(Object.keys(LOCALES) as Locale[]).map((l) => (
        <button key={l} lang={l} aria-pressed={l === locale} title={LOCALES[l].label} onClick={() => setLocale(l)}>
          {LOCALES[l].short}
        </button>
      ))}
    </div>
  );
}

export function TopBar({ title, children, lang = true }: { title: string; children?: ReactNode; lang?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="top">
      <div className="top-in">
        <a className="brand" href="#/">
          {title}
          <small>{t('app.brandSub')}</small>
        </a>
        {children}
        {lang && <LanguageSwitcher />}
      </div>
    </div>
  );
}
