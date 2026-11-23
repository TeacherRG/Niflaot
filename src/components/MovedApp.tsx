import { useEffect, useState, useSyncExternalStore } from 'react';
import { useI18n } from '../i18n';
import { canInstall, install, subscribeInstall } from '../core/install';
import { MOVED_APP } from '../core/migrate';
import { Sheet } from './ui';

/** «Понятно» — asked again after a week, while the old app still brings the player here */
const HIDDEN = 'niflaot:moved-app-hidden';
const HIDE_FOR = 7 * 864e5;
/** the old app not opened for two months — nothing to tell */
const FORGET = 60 * 864e5;

const standalone = () =>
  matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
const ios = () => /iPhone|iPad|iPod/.test(navigator.userAgent);

const read = (k: string) => {
  try {
    return Number(localStorage.getItem(k) ?? 0);
  } catch {
    return 0;
  }
};
const drop = () => {
  try {
    localStorage.removeItem(MOVED_APP);
    localStorage.removeItem(HIDDEN);
  } catch {}
};

/**
 * The site moved from niflaot.mychitas.app to niflaot.app (17.11.2026). An app installed on the old address cannot be
 * moved: it still starts there, the old address sends it here (redirect/src/index.ts, `&app=1` — src/core/migrate.ts),
 * and the old app shows niflaot.app as a foreign page — a bar with ✕, the title and the address on top. So once: the app
 * has moved — remove the old icon and install it again from niflaot.app. Installed again (this page standalone, or the
 * browser's «installed») — the note is forgotten.
 */
export function MovedApp({ off }: { off?: boolean }) {
  const { t } = useI18n();
  const installable = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const at = read(MOVED_APP);
    if (!at) return;
    if (standalone() || Date.now() - at > FORGET) return drop();
    if (Date.now() - read(HIDDEN) < HIDE_FOR) return;
    setOpen(true);
    const done = () => {
      drop();
      setOpen(false);
    };
    addEventListener('appinstalled', done);
    return () => removeEventListener('appinstalled', done);
  }, []);

  if (off || !open) return null;
  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(HIDDEN, String(Date.now()));
    } catch {}
  };

  return (
    <Sheet open onClose={close} title={t('moved.title')} closeLabel={t('menu.close')}>
      <div className="moved-app">
        <p>{t('moved.lead')}</p>
        <ol>
          <li>{t('moved.step1')}</li>
          <li>{t(ios() ? 'moved.step2ios' : 'moved.step2')}</li>
          <li>{t('moved.step3')}</li>
        </ol>
        <p className="moved-note">{t('moved.note')}</p>
        <div className="h-phone-btns">
          {installable && (
            <button className="btn" onClick={() => install()}>
              {t('install.button')}
            </button>
          )}
          <button className={`btn ${installable ? 'ghost' : ''}`} onClick={close}>
            {t('moved.ok')}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
