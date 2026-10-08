import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { shabbatWindow } from '../core/shabbat';

/** Two Shabbat candles — the mark of the countdown (an outline drawing, no emoji). */
function Candles({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M13 6c2 3 2 5 0 7M27 6c2 3 2 5 0 7M6 35h28" stroke="var(--gold-2)" strokeWidth="2" strokeLinecap="round" />
      <rect x="10" y="15" width="6" height="18" rx="1.5" stroke="var(--gold-soft)" strokeWidth="2" />
      <rect x="24" y="15" width="6" height="18" rx="1.5" stroke="var(--gold-soft)" strokeWidth="2" />
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
  return { days, hours, mins: Math.floor(left / 60_000) };
}

/**
 * «Осталось играть на этой неделе»: days, hours and minutes until the site rests for Shabbat. Deliberately no
 * halachic wording (no «candle lighting»): it is only how long the games are open this week.
 * `side` — the card beside the home page, with the days of the week; `compact` — a small card for a phone.
 */
export function WeekCountdown({ variant }: { variant: 'side' | 'compact' }) {
  const { t, locale } = useI18n();
  const { days, hours, mins } = useLeft();
  const today = new Date().getDay();
  const pad = (n: number) => String(n).padStart(2, '0');
  const label = `${t('countdown.title')}: ${t('countdown.days', { n: days })} ${t('countdown.hours', { n: hours })} ${t('countdown.mins', { n: mins })}`;

  if (variant === 'compact')
    return (
      <div className="wc wc-compact" role="timer" aria-label={label}>
        <Candles size={22} />
        <span className="wc-c-title">{t('countdown.short')}</span>
        <span className="wc-c-time num">
          {days}
          {t('countdown.d')} {hours}
          {t('countdown.h')} {pad(mins)}
          {t('countdown.m')}
        </span>
      </div>
    );

  // short weekday names, Sunday first: «вс пн … сб»
  const names = [...Array(7)].map((_, i) => new Date(2026, 0, 4 + i).toLocaleDateString(locale, { weekday: 'short' }));
  return (
    <section className="wc wc-side" role="timer" aria-label={label}>
      <span className="wc-bg he" aria-hidden="true">
        ש
      </span>
      <Candles size={40} />
      <h2 className="wc-title">{t('countdown.title')}</h2>
      <div className="wc-units" aria-hidden="true">
        {(
          [
            [days, t('countdown.days', { n: days }).replace(/^\d+\s*/, '')],
            [pad(hours), t('countdown.hours', { n: hours }).replace(/^\d+\s*/, '')],
            [pad(mins), t('countdown.mins', { n: mins }).replace(/^\d+\s*/, '')],
          ] as const
        ).map(([v, u]) => (
          <div key={u} className="wc-unit">
            <b className="num">{v}</b>
            <span>{u}</span>
          </div>
        ))}
      </div>
      <ol className="wc-week" aria-hidden="true">
        {names.map((n, i) => (
          <li key={i} className={`${i < today ? 'past' : ''}${i === today ? ' today' : ''}${i === 6 ? ' shabbat' : ''}`}>
            <i />
            {n}
          </li>
        ))}
      </ol>
    </section>
  );
}
