import { useEffect, useState, useSyncExternalStore } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { canInstall, install, subscribeInstall } from '../core/install';
import { pushState, type PushState } from '../core/push';
import { useUI } from './ui';

const HIDDEN = 'niflaot:offer-hidden';
/** hidden by the player — shown again after a month */
const HIDE_FOR = 30 * 864e5;

const standalone = () => matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
/** the browser built into a messenger or a social app: no install, no notifications — open in the real browser */
const inApp = () => /Telegram|Instagram|FBAN|FBAV|Line\/|; wv\)/.test(navigator.userAgent);

/**
 * «Нифлаот на телефоне» on the home screen: install the site (when the browser offers it — Chrome, Edge, Samsung)
 * or how to do it on iPhone («Поделиться» → «На экран Домой»), and «Напоминать каждый день» — the reminder sheet
 * (the browser asks for permission only after a tap there). Nothing to offer (installed and reminded, or a browser
 * that can do neither) — no card; in a messenger's built-in browser — open the site in the real one.
 */
export function PhoneOffer() {
  const { t } = useI18n();
  const mode = useMode();
  const { open } = useUI();
  const installable = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  const [push, setPush] = useState<PushState | null>(null);
  const [hidden, setHidden] = useState(() => {
    try {
      return Date.now() - Number(localStorage.getItem(HIDDEN) ?? 0) < HIDE_FOR;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    pushState().then(setPush, () => setPush({ kind: 'unsupported' }));
  }, []);

  if (hidden || !push) return null;
  const ios = push.kind === 'ios' && !standalone();
  const remind = push.kind === 'off' || push.kind === 'denied';
  const messenger = !installable && !ios && push.kind === 'unsupported' && inApp();
  if (!installable && !ios && !remind && !messenger) return null;

  const hide = () => {
    setHidden(true);
    try {
      localStorage.setItem(HIDDEN, String(Date.now()));
    } catch {}
  };

  return (
    <section className="h-phone" aria-labelledby="h-phone">
      <button className="h-phone-x" onClick={hide} aria-label={t('offer.close')}>
        ×
      </button>
      <h2 id="h-phone">📲 {t('offer.title')}</h2>
      <p>{t(mode === 'adults' ? 'offer.adultsLead' : 'offer.lead')}</p>
      {messenger && <p className="h-phone-note">{t('offer.inapp')}</p>}
      {ios && <p className="h-phone-note">{t('offer.ios')}</p>}
      <div className="h-phone-btns">
        {installable && (
          <button className="btn" onClick={() => install()}>
            {t('install.button')}
          </button>
        )}
        {remind && (
          <button className={`btn ${installable ? 'ghost' : ''}`} onClick={() => open('reminder')}>
            🔔 {t('push.title')}
          </button>
        )}
      </div>
    </section>
  );
}
