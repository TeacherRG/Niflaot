import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { isShabbatRest, shabbatPreview, shabbatWindow } from '../core/shabbat';
import { LanguagePicker } from './TopBar';

/** True from an hour before sunset on Friday to an hour after sunset on Saturday (src/core/shabbat.ts); re-checked every 30 s. */
export function useShabbatRest() {
  const [rest, setRest] = useState(() => shabbatPreview() || isShabbatRest());
  useEffect(() => {
    if (shabbatPreview()) return;
    const id = setInterval(() => setRest(isShabbatRest()), 30_000);
    return () => clearInterval(id);
  }, []);
  return rest;
}

/** The whole site on Shabbat: a greeting and when the site opens again (no halachic times are shown). */
export function ShabbatRest() {
  const { t, locale } = useI18n();
  useEffect(() => {
    document.title = `${t('shabbat.title')} · ${t('app.title')}`;
  }, [t]);
  const w = shabbatWindow();
  const time = (d: Date) => d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
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
      {!w.place && <p>{t('shabbat.fixed')}</p>}
      <p className="shabbat-back">{t('shabbat.back', { time: time(w.to) })}</p>
      <div className="shabbat-brand">
        {t('app.title')} · MyChitas
      </div>
    </main>
  );
}
