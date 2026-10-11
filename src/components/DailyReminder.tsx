import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { DEFAULT_HOUR, PUSH_HOURS, disablePush, enablePush, pushState, testPush, type PushState } from '../core/push';

/**
 * «Напоминать каждый день»: turn the daily notification on (the browser asks for permission only now, after the tap),
 * pick the hour, «Проверить» — a notification right away, «Выключить». Hidden where the browser can't do it at all.
 * Under «Гиматрия дня» after the word is solved and at the end of a lesson.
 */
export function DailyReminder() {
  const { t, locale } = useI18n();
  const [state, setState] = useState<PushState | null>(null);
  const [hour, setHour] = useState(DEFAULT_HOUR);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    pushState().then(setState, () => setState({ kind: 'unsupported' }));
  }, []);

  if (!state || state.kind === 'unsupported') return null;
  const time = (h: number) => `${String(h).padStart(2, '0')}:00`;
  const run = async (f: () => Promise<PushState | void>, ok = '') => {
    setBusy(true);
    setNote('');
    try {
      const next = await f();
      if (next) setState(next);
      if (ok) setNote(ok);
    } catch {
      setNote(t('push.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="reminder">
      <h3>🔔 {t('push.title')}</h3>
      <p>{t('push.lead')}</p>
      {state.kind === 'ios' && <p className="reminder-note">{t('push.ios')}</p>}
      {state.kind === 'denied' && <p className="reminder-note">{t('push.denied')}</p>}
      {state.kind === 'off' && (
        <>
          <div className="reminder-row">
            <label>
              {t('push.time')}{' '}
              <select value={hour} onChange={(e) => setHour(Number(e.target.value))}>
                {PUSH_HOURS.map((h) => (
                  <option key={h} value={h}>
                    {time(h)}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn" disabled={busy} onClick={() => run(() => enablePush(hour, locale))}>
              {t('push.on')}
            </button>
          </div>
          <p className="reminder-note">{t('push.privacy')}</p>
        </>
      )}
      {state.kind === 'on' && (
        <div className="reminder-row">
          <span className="reminder-on">✓ {t('push.enabled', { time: time(state.hour) })}</span>
          <button
            className="btn ghost"
            disabled={busy}
            onClick={() =>
              run(async () => {
                if ((await testPush(locale)) === 'sent') return setNote(t('push.testSent'));
                setState({ kind: 'off' });
                setNote(t('push.gone'));
              })
            }
          >
            {t('push.test')}
          </button>
          <button className="btn ghost" disabled={busy} onClick={() => run(disablePush)}>
            {t('push.off')}
          </button>
        </div>
      )}
      {note && (
        <p className="reminder-note" role="status">
          {note}
        </p>
      )}
    </section>
  );
}
