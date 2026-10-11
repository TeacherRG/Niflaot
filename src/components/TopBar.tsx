import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { LOCALES, useI18n, type Locale } from '../i18n';
import { Icon, useDismiss, useUI } from './ui';
import { loadConfig, localSummary, logout, useAccount } from '../core/account';

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

/**
 * The avatar in the top right corner, next to the language — always there. A guest: «Вы играете как гость», this
 * device's progress and «Войти в аккаунт» (while the server can't send emails — that the sign-in opens soon);
 * signed in: the nickname, «Аккаунт и классы», the leaderboard, «Выйти». Not in the main menu.
 */
function AccountMenu() {
  const { t } = useI18n();
  const { token, me, mail } = useAccount();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  useEffect(() => {
    loadConfig();
  }, []);
  const nick = me?.user.nick;
  const p = open && !token ? localSummary() : null;

  return (
    <div className="langpick acc-menu" ref={root}>
      <button
        className={`avatar${token ? ' in' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={nick ?? t('acc.avatar')}
        title={nick ?? t('acc.guest')}
        onClick={() => setOpen((o) => !o)}
      >
        {nick ? <span>{[...nick][0].toUpperCase()}</span> : <Icon name="user" size={18} />}
      </button>
      {open && (
        <div className="lang-list acc-pop" role="menu">
          {token ? (
            <>
              <p className="acc-pop-head">
                <b>{nick ?? '…'}</b>
                <small>{me?.user.email}</small>
              </p>
              <a role="menuitem" href="#/account" onClick={close}>
                <Icon name="user" size={16} /> {t('acc.manage')}
              </a>
              <a role="menuitem" href="#/leaders" onClick={close}>
                🏆 {t('leaders.title')}
              </a>
              <button
                role="menuitem"
                onClick={() => {
                  close();
                  logout();
                }}
              >
                {t('acc.logout')}
              </button>
            </>
          ) : (
            <>
              <p className="acc-pop-head">
                <b>{t('acc.guest')}</b>
                <small>{t('acc.menuGuestNote')}</small>
              </p>
              {p && <p className="acc-pop-stats">{t('acc.myProgress', { solved: p.solved, points: p.points, streak: p.streak })}</p>}
              {mail ? (
                <a role="menuitem" className="acc-pop-cta" href="#/account" onClick={close}>
                  {t('acc.signIn')} →
                </a>
              ) : (
                <p className="acc-pop-soon">{t('acc.loginSoon')}</p>
              )}
              <a role="menuitem" href="#/leaders" onClick={close}>
                🏆 {t('leaders.title')}
              </a>
              <a role="menuitem" href="#/privacy" onClick={close}>
                {t('privacy.title')}
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function TopBar({ title, children, wide }: { title: string; children?: ReactNode; wide?: boolean }) {
  const { t } = useI18n();
  const { open } = useUI();
  return (
    <div className="top">
      <div className={`top-in${wide ? ' wide' : ''}`}>
        <button className="icon-btn menu-btn" aria-label={t('menu.open')} onClick={() => open('menu')}>
          <Icon name="menu" />
        </button>
        <a className="brand" href="#/">
          {title}
          <small>{t('app.brandSub')}</small>
        </a>
        {children}
        {/* the language and the avatar together in the right corner */}
        <div className="top-end">
          <LanguagePicker />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
