import { lazy, Suspense, useEffect, useState } from 'react';
import { Sheet } from './ui';

const ShabbatCalendar = lazy(() => import('./ShabbatCalendar').then((m) => ({ default: m.ShabbatCalendar })));
import { useI18n, uiLang } from '../i18n';
import { shabbatWindow } from '../core/shabbat';
import { jewishDate } from '../core/hebrewDate';

/** Two Shabbat candles — the mark of the countdown (an outline drawing, no emoji). */
function Candles({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M13 6c2 3 2 5 0 7M27 6c2 3 2 5 0 7M6 35h28" stroke="#B07A1E" strokeWidth="2" strokeLinecap="round" />
      <rect x="10" y="15" width="6" height="18" rx="1.5" stroke="#85631F" strokeWidth="2" />
      <rect x="24" y="15" width="6" height="18" rx="1.5" stroke="#85631F" strokeWidth="2" />
    </svg>
  );
}

/** Time left until the site closes for Shabbat (src/core/shabbat.ts), refreshed every 30 s. */
function useLeft() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  let left = Math.max(0, shabbatWindow(new Date(now)).from.getTime() - now);
  const days = Math.floor(left / 86_400_000);
  left -= days * 86_400_000;
  const hours = Math.floor(left / 3_600_000);
  left -= hours * 3_600_000;
  return { days, hours, mins: Math.floor(left / 60_000), now: new Date(now) };
}

/**
 * «Осталось учиться на этой неделе» with today's date (civil and Jewish): days, hours and minutes until the site rests for
 * Shabbat — one line on the children's home. Deliberately no halachic wording (no «candle lighting»): it is only how long
 * the site is open for learning this week.
 */
export function WeekCountdown() {
  const { t, locale } = useI18n();
  const { days, hours, mins, now } = useLeft();
  // today's date on the device: the civil one in the site's language and the Jewish one in Hebrew
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const civilShort = now.toLocaleDateString(uiLang(locale), { weekday: 'short', day: 'numeric', month: 'short' });
  const pad = (n: number) => String(n).padStart(2, '0');
  const label = `${t('countdown.title')}: ${t('countdown.days', { n: days })} ${t('countdown.hours', { n: hours })} ${t('countdown.mins', { n: mins })}`;
  return (
    <div className="wc wc-line" role="timer" aria-label={label}>
      <Candles size={20} />
      <span className="wc-l-title">
        <span className="wc-l-date">{civilShort}</span>{' '}
        <span className="he wc-l-he" lang="he">
          {jewishDate(iso)}
        </span>
        <br />
        {t('countdown.short')}
      </span>
      <span className="wc-l-time num">
        {days}
        {t('countdown.d')} {hours}
        {t('countdown.h')} {pad(mins)}
        {t('countdown.m')}
      </span>
    </div>
  );
}

/**
 * The same countdown as a tile of the kids' home (QA, 10.11.2026: one kind of tile, one screen): the time left, today's date
 * (civil and Jewish); a tap opens the calendar (the Shabbat card that stood on the home before — city, «Изменить», times).
 */
export function CountdownTile() {
  const { t, locale } = useI18n();
  const { days, hours, mins, now } = useLeft();
  const [open, setOpen] = useState(false);
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const civilShort = now.toLocaleDateString(uiLang(locale), { weekday: 'short', day: 'numeric', month: 'short' });
  const pad = (n: number) => String(n).padStart(2, '0');
  const label = `${t('countdown.title')}: ${t('countdown.days', { n: days })} ${t('countdown.hours', { n: hours })} ${t('countdown.mins', { n: mins })}. ${t('calendar.title')}`;
  return (
    <>
      <button type="button" className="a-tile kt kt-sky" onClick={() => setOpen(true)} aria-label={label}>
        <span className="a-tile-k">{t('home.ktLeft')}</span>
        <span className="a-tile-t num kt-time" role="timer">
          {days}
          {t('countdown.d')} {hours}
          {t('countdown.h')} {pad(mins)}
          {t('countdown.m')}
        </span>
        <span className="a-zip-s">
          {civilShort} ·{' '}
          <span className="he" lang="he">
            {jewishDate(iso)}
          </span>
        </span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={t('calendar.title')} closeLabel={t('menu.close')}>
        <Suspense fallback={null}>{open && <ShabbatCalendar bare />}</Suspense>
      </Sheet>
    </>
  );
}
