import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { LOCALES, useI18n, type Locale } from '../i18n';
import { Icon, useDismiss, useUI } from './ui';
import { loadConfig, useAccount } from '../core/account';
import { currentLink, noShare, type Ref } from '../core/site';
import { NIFLAOT_MARK } from '../core/partners';
import { HebrewDay } from './HebrewDay';
import { findLesson } from '../lessons';

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
 * The account button, always there — `#/account`: the site's mode («Дети и семья» / «Подростки и взрослые»), sign-in
 * and the profile. «Войти» for a guest (when the site can register), the nickname when signed in, else «Аккаунт».
 */
function AccountChip() {
  const { t } = useI18n();
  const { token, me, mail } = useAccount();
  useEffect(() => {
    loadConfig();
  }, []);
  const nick = me?.user.nick ?? (token || mail ? undefined : t('acc.title'));
  return (
    <a className={`acc-chip${token ? ' in' : ''}`} href="#/account" aria-label={nick ?? t('acc.chipGuest')} title={nick ?? t('acc.chipGuest')}>
      <Icon name="user" size={18} />
      <span>{token ? (nick ?? '…') : t('acc.chipGuest')}</span>
    </a>
  );
}

/**
 * «Поделиться» — on every page one reads (not the home, the onboarding, the account, the admin's): a short list —
 * the phone's own share sheet (when the browser has one), WhatsApp, Telegram, e-mail, «Скопировать ссылку».
 * The link is the page open now (`currentLink`: a lesson — its static page with the preview), marked `?ref=`.
 */
export function ShareButton({ label, className = '' }: { label?: boolean; className?: string }) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  if (noShare(location.hash)) return null;
  const link = (ref: Ref) => currentLink(location.hash, ref, locale, (slug) => !!findLesson(slug));
  // the page's own title, without the site's name at the end
  const title = () => document.title.split(' · ')[0];
  const native = typeof navigator !== 'undefined' && 'share' in navigator;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link('copy'));
      setCopied(true);
      setTimeout(() => (setCopied(false), close()), 1400);
    } catch {
      window.prompt(t('share.copy'), link('copy'));
    }
  };
  return (
    <div className={`langpick sharepick ${className}`} ref={root}>
      {label ? (
        <button className="btn ghost hero-help" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <Icon name="share" size={18} />
          {t('share.btn')}
        </button>
      ) : (
        <button className="icon-btn share-btn" aria-haspopup="menu" aria-expanded={open} aria-label={t('share.btn')} title={t('share.btn')} onClick={() => setOpen((o) => !o)}>
          <Icon name="share" size={19} />
        </button>
      )}
      {open && (
        <ul className="lang-list share-list" role="menu" aria-label={t('share.btn')}>
          {native && (
            <li>
              <button role="menuitem" onClick={() => (navigator.share({ title: title(), url: link('share') }).catch(() => {}), close())}>
                <Icon name="share" size={16} />
                <span className="name">{t('share.more')}</span>
              </button>
            </li>
          )}
          <li>
            <a role="menuitem" href={`https://wa.me/?text=${encodeURIComponent(`${title()} ${link('wa')}`)}`} target="_blank" rel="noopener noreferrer" onClick={close}>
              <span className="code">WA</span>
              <span className="name">WhatsApp</span>
            </a>
          </li>
          <li>
            <a role="menuitem" href={`https://t.me/share/url?url=${encodeURIComponent(link('tg'))}&text=${encodeURIComponent(title())}`} target="_blank" rel="noopener noreferrer" onClick={close}>
              <span className="code">TG</span>
              <span className="name">Telegram</span>
            </a>
          </li>
          <li>
            <a role="menuitem" href={`mailto:?subject=${encodeURIComponent(title())}&body=${encodeURIComponent(link('mail'))}`} onClick={close}>
              <span className="code">@</span>
              <span className="name">{t('share.mail')}</span>
            </a>
          </li>
          <li>
            <button role="menuitem" onClick={copy}>
              <Icon name={copied ? 'check' : 'link'} size={16} />
              <span className="name">{t(copied ? 'share.copied' : 'share.copy')}</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

/** `share` false — no «Поделиться» (a page not found) */
export function TopBar({ title, children, wide, share = true }: { title: string; children?: ReactNode; wide?: boolean; share?: boolean }) {
  const { t } = useI18n();
  const { open } = useUI();
  return (
    <div className="top">
      <div className={`top-in${wide ? ' wide' : ''}`}>
        <button className="icon-btn menu-btn" aria-label={t('menu.open')} onClick={() => open('menu')}>
          <Icon name="menu" />
        </button>
        <a className="brand" href="#/">
          <img className="brand-logo" src={NIFLAOT_MARK} alt="" width={36} height={36} />
          <span className="brand-text">
            {title}
            <small>{t('app.brandSub')}</small>
          </span>
        </a>
        {children}
        {share && <ShareButton />}
        <AccountChip />
        <HebrewDay />
        <LanguagePicker />
      </div>
    </div>
  );
}
