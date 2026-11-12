import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { COINS_EVENT, type CoinNews } from '../core/coins';
import coin from '../assets/coins/coin-72.webp';
import chest from '../assets/coins/chest-72.webp';

/** «+3» — a short note when game coins are earned (src/core/coins.ts); nothing to press, it leaves by itself. */
export function CoinToast() {
  const { t } = useI18n();
  const [news, setNews] = useState<(CoinNews & { k: number }) | null>(null);
  useEffect(() => {
    let timer = 0;
    const on = (e: Event) => {
      const d = (e as CustomEvent<CoinNews | undefined>).detail;
      if (!d?.gained) return;
      setNews({ ...d, k: Date.now() });
      clearTimeout(timer);
      timer = window.setTimeout(() => setNews(null), d.chest ? 3600 : 2200);
    };
    window.addEventListener(COINS_EVENT, on);
    return () => (window.removeEventListener(COINS_EVENT, on), clearTimeout(timer));
  }, []);
  return (
    <div className="coin-toast-live no-print" role="status" aria-live="polite">
      {news && (
        <a className={`coin-toast${news.chest ? ' chest' : ''}`} href="#/coins" key={news.k}>
          <img src={news.chest ? chest : coin} alt="" width={30} height={30} />
          <b>+{news.gained}</b>
          <span>{news.chest ? t('coins.toastChest') : news.doubled ? t('coins.toastDouble') : t('coins.name')}</span>
        </a>
      )}
    </div>
  );
}
