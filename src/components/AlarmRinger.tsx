import { useEffect, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import { ALARM_EVENT, alarmIsOn } from '../core/alarmStore';
import type { Ring } from '../core/alarm';

type AlarmCode = typeof import('../core/alarm');

/**
 * The alarm of «Часы» rings on any page of the site (in App.tsx; not on Shabbat — the site is closed then): while it is on,
 * the watch (src/core/alarm.ts, with the Jewish calendar) is loaded and looks at the clock; a ring — a window over the page
 * with «Стоп» and «Ещё 5 минут».
 */
export function AlarmRinger() {
  const { t, locale } = useI18n();
  const [ringing, setRinging] = useState<Ring | null>(null);
  const [code, setCode] = useState<AlarmCode | null>(null);

  useEffect(() => {
    let live = true;
    let unwatch: (() => void) | undefined;
    let unring: (() => void) | undefined;
    const boot = () => {
      // the test ring of the clock page needs the window even while the alarm is off
      if (!alarmIsOn() && !location.hash.startsWith('#/clock')) return unwatch?.(), void (unwatch = undefined);
      void import('../core/alarm').then((m) => {
        if (!live) return;
        setCode(m);
        unring ??= m.onRing(setRinging);
        if (alarmIsOn()) unwatch ??= m.watchAlarm();
      });
    };
    boot();
    window.addEventListener(ALARM_EVENT, boot);
    window.addEventListener('storage', boot);
    window.addEventListener('hashchange', boot);
    return () => {
      live = false;
      unwatch?.();
      unring?.();
      window.removeEventListener(ALARM_EVENT, boot);
      window.removeEventListener('storage', boot);
      window.removeEventListener('hashchange', boot);
    };
  }, []);

  useEffect(() => {
    code?.setRingWords(t('clock.alarm'), t('clock.ringBody'));
  }, [code, t]);

  if (!ringing || !code) return null;
  const time = new Intl.DateTimeFormat(uiLang(locale), { hour: '2-digit', minute: '2-digit' }).format(ringing.test ? new Date() : ringing.at);
  return (
    <div className="alarm-ring no-print" role="alertdialog" aria-modal="true" aria-labelledby="alarm-ring-t">
      <div className="alarm-ring-card">
        <div className="alarm-ring-bell" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0M3.5 7.5A9 9 0 016 4M20.5 7.5A9 9 0 0018 4" />
          </svg>
        </div>
        <h2 id="alarm-ring-t">{ringing.test ? t('clock.testing') : t('clock.alarm')}</h2>
        <p className="alarm-ring-time">{time}</p>
        <div className="alarm-ring-btns">
          <button type="button" className="btn alarm-ring-stop" autoFocus onClick={() => code.stopRing()}>
            {t('clock.stop')}
          </button>
          {!ringing.test && (
            <button type="button" className="btn ghost" onClick={() => code.snooze()}>
              {t('clock.snooze', { n: code.SNOOZE_MIN })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
