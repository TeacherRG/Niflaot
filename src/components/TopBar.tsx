import { useBalance } from '../core/coins';
import coinArt from '../assets/coins/coin-72.webp';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { track } from '../core/analytics';
import { UI_LOCALES, useI18n, type UiLocale } from '../i18n';
import { Icon, useDismiss, useUI } from './ui';
import { loadConfig, useAccount } from '../core/account';
import { currentLink, noShare, type Ref } from '../core/site';
import { NIFLAOT_MARK } from '../core/partners';
import { HebrewDay } from './HebrewDay';
import { useHabit } from '../core/habit';
import { findLesson } from '../lessons';

/** One button showing the current language; opens a list of all languages in their own names. */
export function LanguagePicker() {
  const { ui, setLocale, t } = useI18n();
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
        aria-label={`${t('lang.choose')}: ${UI_LOCALES[ui].label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="globe" size={17} />
        <span>{UI_LOCALES[ui].short}</span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <ul className="lang-list" role="listbox" aria-label={t('lang.choose')}>
          {(Object.keys(UI_LOCALES) as UiLocale[]).map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === ui}
                lang={l}
                onClick={() => {
                  setLocale(l);
                  close();
                }}
              >
                <span className="code">{UI_LOCALES[l].short}</span>
                <span className="name">{UI_LOCALES[l].label}</span>
                {l === ui && <Icon name="check" size={16} />}
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
  const h = useHabit();
  // the study streak by the avatar: lit — studied today; dim — the streak still holds, today not yet; out — broken / not started
  const state = h.today ? 'on' : h.streak > 0 ? 'wait' : 'out';
  const streak = h.streak > 0 ? t('habit.streak', { n: h.streak }) : '';
  const how = t(h.today ? 'habit.today' : h.streak > 0 ? 'habit.notYet' : h.back ? 'habit.back' : 'habit.first');
  const label = [nick ?? t('acc.chipGuest'), streak, how].filter(Boolean).join(' · ');
  return (
    <a className={`acc-chip${token ? ' in' : ''}`} href="#/account" aria-label={label} title={label}>
      <span className={`streak-badge ${state}`} aria-hidden="true">
        <Flame />
        {h.streak > 0 && <b>{h.streak}</b>}
      </span>
      <Icon name="user" size={18} />
      <span className="acc-chip-name">{token ? (nick ?? '…') : t('acc.chipGuest')}</span>
    </a>
  );
}

/** The game coins by the account (src/core/coins.ts): the balance, a link to «Pelecoin». */
function CoinChip() {
  const { t } = useI18n();
  const n = useBalance();
  const label = t('coins.badge', { n });
  return (
    <a className="coin-chip" href="#/coins" aria-label={label} title={label}>
      <img src={coinArt} alt="" width={22} height={22} />
      <b>{n}</b>
    </a>
  );
}

/** The flame of the study streak (src/core/habit.ts): its colour comes from `.streak-badge.on | wait | out`. */
function Flame() {
  return (
    <svg className="flame" viewBox="0 0 24 24" width="17" height="17">
      <path
        className="flame-outer"
        d="M12 2.5c.6 3.3 4.4 5.3 5.6 8.9 1.4 4.2-1.5 9.1-5.6 9.1s-7-3.7-6.1-7.9c.4-1.9 1.6-3.2 2.6-4.3.2 1.4.9 2.5 2 3-.6-3.4.4-6.4 1.5-8.8z"
      />
      <path className="flame-inner" d="M12 12.2c.4 1.6 2.4 2.6 2.4 4.6 0 1.6-1.1 2.8-2.4 2.8s-2.5-1.1-2.4-2.7c.1-1.6 1.6-2.5 2.4-4.7z" />
    </svg>
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
  const close = useCallback(() => (track('share'), setOpen(false)), []);
  useDismiss(open, root, () => setOpen(false));
  if (noShare(location.hash)) return null;
  const link = (ref: Ref) => currentLink(location.hash, ref, locale, (slug) => !!findLesson(slug));
  // the page's own title, without the site's name at the end
  const title = () => document.title.split(' · ')[0];
  const native = typeof navigator !== 'undefined' && 'share' in navigator;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link('copy'));
      track('share');
      setCopied(true);
      setTimeout(() => (setCopied(false), setOpen(false)), 1400);
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
        {/* the game's progress (riddle steps, timer, score) — its own row under the brand (QA, 10.11.2026: it wrapped anyhow) */}
        {children && <div className="top-game">{children}</div>}
        {share && <ShareButton />}
        <CoinChip />
        <AccountChip />
        <HebrewDay />
        <LanguagePicker />
      </div>
    </div>
  );
}
