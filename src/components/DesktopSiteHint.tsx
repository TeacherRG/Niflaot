import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

/* The phone shows the site «как на компьютере» (owner, 12.11.2026: «в приложении на телефоне почему-то включается
 * полноэкранный режим» — tiny text, giant tiles, no bottom bar). The site never asks for it: it is Chrome's «Версия для ПК»
 * (Request desktop site) — a per-site setting that also reaches the installed app. In that mode Chrome ignores
 * `<meta name="viewport">` and lays the page out 980 px wide, so a page cannot undo it; this banner says how to turn it off.
 * Detected: a touch screen, a narrow phone screen, and a layout much wider than the screen. «×» hides it for 7 days. */
const KEY = 'niflaot:pc-hint';

export function desktopSiteMode(): number {
  try {
    if (!matchMedia('(pointer: coarse)').matches) return 0;
    const sw = screen.width;
    const cw = document.documentElement.clientWidth;
    return sw > 0 && sw <= 600 && cw >= sw * 1.4 ? cw / sw : 0;
  } catch {
    return 0;
  }
}

const standalone = () => matchMedia('(display-mode: standalone)').matches;

export function DesktopSiteHint() {
  const { t } = useI18n();
  const [scale, setScale] = useState(0);
  useEffect(() => {
    try {
      if (Number(localStorage.getItem(KEY) || 0) > Date.now()) return;
    } catch {
      /* no storage — show */
    }
    setScale(desktopSiteMode());
  }, []);
  if (!scale) return null;
  const close = () => {
    try {
      localStorage.setItem(KEY, String(Date.now() + 7 * 864e5));
    } catch {
      /* ignore */
    }
    setScale(0);
  };
  return (
    // the page is drawn shrunk by 1/scale — the banner is enlarged by the same factor to stay readable
    <div className="pc-hint" role="alert" style={{ fontSize: `${13 * scale}px` }}>
      <b>{t('pc.title')}</b>
      <p>{t(standalone() ? 'pc.app' : 'pc.browser')}</p>
      <button type="button" onClick={close} aria-label={t('pc.close')}>
        ×
      </button>
    </div>
  );
}
