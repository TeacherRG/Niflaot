import { useCallback, useRef, useState, type ReactNode } from 'react';
import { LOCALES, useI18n, type Locale } from '../i18n';
import { Icon, useDismiss, useUI } from './ui';

/** One button showing the current language; opens a list of all languages in their own names. */
export function LanguagePicker() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);

  return (
    <div className="langpick" ref={root}>
      <button
        className="lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('lang.choose')}: ${LOCALES[locale].label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="globe" size={17} />
        <span>{LOCALES[locale].short}</span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <ul className="lang-list" role="listbox" aria-label={t('lang.choose')}>
          {(Object.keys(LOCALES) as Locale[]).map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === locale}
                lang={l}
                onClick={() => {
                  setLocale(l);
                  close();
                }}
              >
                <span className="code">{LOCALES[l].short}</span>
                <span className="name">{LOCALES[l].label}</span>
                {l === locale && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TopBar({ title, children }: { title: string; children?: ReactNode }) {
  const { t } = useI18n();
  const { open } = useUI();
  return (
    <div className="top">
      <div className="top-in">
        <button className="icon-btn menu-btn" aria-label={t('menu.open')} onClick={() => open('menu')}>
          <Icon name="menu" />
        </button>
        <a className="brand" href="#/">
          {title}
          <small>{t('app.brandSub')}</small>
        </a>
        {children}
        <LanguagePicker />
      </div>
    </div>
  );
}
