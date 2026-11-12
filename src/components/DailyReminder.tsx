import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { ANCHORS, DEFAULT_HOUR, PUSH_HOURS, disablePush, enablePush, isAnchor, pushState, testPush, type Anchor, type PushState } from '../core/push';

/**
 * «Напоминать каждый день»: turn the daily notification on (the browser asks for permission only now, after the tap),
 * pick «после чего» (the habit's anchor: it sets the hour and the first line of the message) and the hour, «Проверить» — a notification right away, «Выключить». Hidden where the browser can't do it at all.
 * Under «Гематрия дня» after the word is solved and at the end of a lesson.
 * `compact` (owner, 02.11.2026: «окно занимает слишком много места»): once the player has chosen — on, or «Не напоминать» —
 * only «🔔 Напоминать» and a switch: a green ✓ or a red ✗ that draws itself; a tap changes the choice. `note` — a line under the
 * lead of the full block (e.g. what the game adds to the message).
 */
const DECLINED = 'niflaot:push-no';
const declinedSaved = () => {
  try {
    return localStorage.getItem(DECLINED) === '1';
  } catch {
    return false;
  }
};
const setDeclined = (no: boolean) => {
  try {
    if (no) localStorage.setItem(DECLINED, '1');
    else localStorage.removeItem(DECLINED);
  } catch {}
};

export function DailyReminder({ sheet = false, compact = false, note: extra }: { sheet?: boolean; compact?: boolean; note?: string }) {
  const { t, locale } = useI18n();
  const mode = useMode();
  const [state, setState] = useState<PushState | null>(null);
  const [hour, setHour] = useState(DEFAULT_HOUR);
  const [anchor, setAnchor] = useState<Anchor | ''>('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [declined, setDecl] = useState(declinedSaved);

  useEffect(() => {
    pushState().then(
      (st) => {
        setState(st);
        // «было включено» (a reinstall, another device): the same hour and anchor are ready to turn on again
        if (st.kind === 'off' && st.again) {
          setHour(st.again.hour);
          setAnchor(st.again.anchor ?? '');
        }
      },
      () => setState({ kind: 'unsupported' }),
    );
  }, []);

  if (!state) return null;
  // in the sheet (menu, home) the player asked for it: say why it can't work here instead of showing nothing
  if (state.kind === 'unsupported') return sheet ? <p className="reminder-note">{t('push.unsupported')} {t('offer.inapp')}</p> : null;
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

  const decline = (no: boolean) => {
    setDeclined(no);
    setDecl(no);
  };

  // the choice is made: one line and a switch
  if (compact && (state.kind === 'on' || (state.kind === 'off' && declined))) {
    const on = state.kind === 'on';
    return (
      <section className="reminder reminder-mini">
        <span className="reminder-mini-t">🔔 {t('push.short')}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={t('push.title')}
          title={on ? t('push.enabled', { time: time(state.hour) }) : t('push.offShort')}
          className={`reminder-switch ${on ? 'on' : 'no'}`}
          disabled={busy}
          onClick={() =>
            on
              ? run(async () => {
                  const next = await disablePush();
                  decline(true);
                  return next;
                })
              : run(async () => {
                  const next = await enablePush(DEFAULT_HOUR, locale);
                  if (next.kind === 'on') decline(false);
                  return next;
                })
          }
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" key={on ? 'on' : 'no'}>
            {on ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>}
          </svg>
        </button>
        {note && (
          <span className="reminder-note" role="status">
            {note}
          </span>
        )}
      </section>
    );
  }

  return (
    <section className={sheet ? 'reminder reminder-sheet' : 'reminder'}>
      {!sheet && <h3>🔔 {t('push.title')}</h3>}
      <p>{t(mode === 'adults' ? 'push.adultsLead' : 'push.lead')}</p>
      {extra && <p className="reminder-note">{extra}</p>}
      {state.kind === 'ios' && <p className="reminder-note">{t('push.ios')}</p>}
      {state.kind === 'denied' && <p className="reminder-note">{t('push.denied')}</p>}
      {state.kind === 'off' && (
        <>
          {state.again && (
            <p className="reminder-note reminder-again" role="status">
              {t('push.again', { time: time(state.again.hour) })}
            </p>
          )}
          <div className="reminder-row">
            <label>
              {t('push.anchor')}{' '}
              <select
                value={anchor}
                onChange={(e) => {
                  const a = e.target.value;
                  setAnchor(isAnchor(a) ? a : '');
                  if (isAnchor(a)) setHour(ANCHORS[a]);
                }}
              >
                <option value="">{t('push.anchorNone')}</option>
                {(Object.keys(ANCHORS) as Anchor[]).map((a) => (
                  <option key={a} value={a}>
                    {t(`push.anchor.${a}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
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
            <button
              className="btn"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const next = await enablePush(hour, locale, anchor || undefined);
                  if (next.kind === 'on') decline(false);
                  return next;
                })
              }
            >
              {t('push.on')}
            </button>
            {compact && (
              <button className="btn ghost" disabled={busy} onClick={() => decline(true)}>
                {t('push.no')}
              </button>
            )}
          </div>
          <p className="reminder-note">{t('push.anchorNote')}</p>
          <p className="reminder-note">{t('push.privacy')}</p>
        </>
      )}
      {state.kind === 'on' && (
        <div className="reminder-row">
          <span className="reminder-on">✓ {t('push.enabled', { time: time(state.hour) })}
            {state.anchor && ` · ${t(`push.anchor.${state.anchor}`)}`}</span>
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
