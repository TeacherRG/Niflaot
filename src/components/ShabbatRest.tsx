import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { isShabbatRest, reopensAt, shabbatPreview } from '../core/shabbat';
import { LanguagePicker } from './TopBar';

/** True from Friday 21:00 to Saturday 21:00 (user's time); re-checked every 30 s, so the site closes and opens by itself. */
export function useShabbatRest() {
  const [rest, setRest] = useState(() => shabbatPreview() || isShabbatRest());
  useEffect(() => {
    if (shabbatPreview()) return;
    const id = setInterval(() => setRest(isShabbatRest()), 30_000);
    return () => clearInterval(id);
  }, []);
  return rest;
}

/** The whole site on Shabbat: a greeting and when it opens again. */
export function ShabbatRest() {
  const { t, locale } = useI18n();
  useEffect(() => {
    document.title = `${t('shabbat.title')} · ${t('app.title')}`;
  }, [t]);
  const at = reopensAt().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return (
    <main className="shabbat-rest">
      <div className="shabbat-lang">
        <LanguagePicker />
      </div>
      <div className="shabbat-candles" aria-hidden="true">
        🕯🕯
      </div>
      <div className="shabbat-he he" lang="he">
        שבת שלום
      </div>
      <h1>{t('shabbat.title')}</h1>
      <p>{t('shabbat.text')}</p>
      <p className="shabbat-back">{t('shabbat.back', { time: at })}</p>
      <div className="shabbat-brand">
        {t('app.title')} · MyChitas
      </div>
    </main>
  );
}
