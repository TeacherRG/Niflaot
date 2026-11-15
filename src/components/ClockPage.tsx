import { useEffect, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { CityPicker } from './ShabbatCalendar';
import { hebrewDateText } from '../core/hebcal';
import { currentPlace, PLACE_EVENT } from '../core/places';
import { addDays, BEFORE, isoIn, nextRing, restAt, ringOn, shownDay, TIME_IDS, type Alarm, type AlarmKind, type Rest, type Spot, type TimeId } from '../core/clock';
import { armSound, currentSpot, loadAlarm, ring, saveAlarm, soundReady } from '../core/alarm';

const MIN = 60_000;
const DAYS = [0, 1, 2, 3, 4, 5, 6];
/** the numerals of the face — Hebrew letters: 12, 3, 6, 9 */
const FACE: [number, string][] = [
  [12, 'י״ב'],
  [3, 'ג'],
  [6, 'ו'],
  [9, 'ט'],
];
const COLOR: Record<TimeId, string> = { shma: 'var(--tchelet)', tefila: 'var(--gold)', mincha: 'var(--plum-deep)' };

/** hours, minutes and seconds of a moment on the wall clock of a time zone */
function wall(at: Date, zone: string) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(at);
  const g = (k: string) => Number(p.find((x) => x.type === k)?.value ?? 0);
  return { h: g('hour'), m: g('minute'), s: g('second') };
}
const polar = (turn: number, r: number) => [100 + r * Math.sin(turn * 2 * Math.PI), 100 - r * Math.cos(turn * 2 * Math.PI)] as const;

/** The face: hands by the city's time, and on the rim — a dot for each of the three times of the day. */
function Face({ now, zone, marks }: { now: Date; zone: string; marks: [TimeId, Date | null][] }) {
  const { h, m, s } = wall(now, zone);
  const hand = (turn: number, r: number, cls: string) => {
    const [x, y] = polar(turn, r);
    return <line className={cls} x1="100" y1="100" x2={x} y2={y} />;
  };
  return (
    <svg className="clk-face" viewBox="0 0 200 200" aria-hidden="true">
      <circle className="clk-rim" cx="100" cy="100" r="96" />
      {Array.from({ length: 60 }, (_, i) => {
        const [x1, y1] = polar(i / 60, i % 5 ? 91 : 86);
        const [x2, y2] = polar(i / 60, 94);
        return <line key={i} className={i % 5 ? 'clk-tick' : 'clk-tick big'} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {FACE.map(([n, he]) => {
        const [x, y] = polar(n / 12, 72);
        return (
          <text key={n} className="clk-num he" lang="he" x={x} y={y} textAnchor="middle" dominantBaseline="central">
            {he}
          </text>
        );
      })}
      {marks.map(([id, at]) => {
        if (!at) return null;
        const w = wall(at, zone);
        const [x, y] = polar(((w.h % 12) + w.m / 60) / 12, 94);
        return <circle key={id} cx={x} cy={y} r="5" fill={COLOR[id]} stroke="var(--surface)" strokeWidth="1.5" />;
      })}
      {hand(((h % 12) + m / 60) / 12, 48, 'clk-hand hour')}
      {hand((m + s / 60) / 60, 70, 'clk-hand minute')}
      {hand(s / 60, 78, 'clk-hand second')}
      <circle className="clk-pin" cx="100" cy="100" r="4" />
    </svg>
  );
}

/**
 * One alarm: `wake` — the alarm clock (at a time, or before the end of the time of Shma), `study` — the alarm of Torah
 * study (at a time; its ring leads to the passage of the day of the Prophets and Writings). Both keep quiet on Shabbat,
 * Yom Tov and Yom Kippur.
 */
function AlarmCard({ kind, now, spot, zone }: { kind: AlarmKind; now: Date; spot: Spot | null; zone: string }) {
  const { t, locale } = useI18n();
  const [alarm, setAlarm] = useState<Alarm>(() => loadAlarm(kind));
  const lang = uiLang(locale);
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang, { timeZone: zone, ...o });
  const hm = (d: Date) => fmt({ hour: '2-digit', minute: '2-digit' }).format(d);
  const dayText = (d: Date) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const todayIso = isoIn(now, zone);
  const study = kind === 'study';

  const change = (patch: Partial<Alarm>) => {
    const a = { ...alarm, ...patch };
    armSound();
    saveAlarm(a, kind);
    setAlarm(a);
  };
  const next = spot && alarm.on ? nextRing(alarm, now, spot) : null;
  // the rings of the coming eight days that the days of rest cancel — so that the reader sees the rule at work
  const skips: { at: Date; why: Rest }[] = [];
  if (spot && alarm.on) {
    for (let n = 0; n <= 8 && skips.length < 2; n++) {
      const iso = addDays(todayIso, n);
      const at = alarm.days.includes(new Date(`${iso}T12:00:00Z`).getUTCDay()) ? ringOn(alarm, iso, spot) : null;
      const why = at && at >= now ? restAt(at, spot, alarm.chm) : null;
      if (at && why) skips.push({ at, why });
    }
  }
  const dayName = (d: number) => new Intl.DateTimeFormat(lang, { weekday: lang === 'he' ? 'narrow' : 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 10, 15 + d)));
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeInput = (
    <input
      type="time"
      className="clk-time"
      aria-label={t('clock.modeClock')}
      value={`${pad(alarm.h)}:${pad(alarm.m)}`}
      onFocus={() => alarm.mode !== 'clock' && change({ mode: 'clock' })}
      onChange={(e) => {
        const [h, m] = e.target.value.split(':').map(Number);
        if (Number.isInteger(h) && Number.isInteger(m)) change({ h, m, mode: 'clock' });
      }}
    />
  );

  return (
    <section className={`clk-alarm ${kind}${alarm.on ? ' on' : ''}`} aria-labelledby={`clk-alarm-${kind}`}>
      <div className="clk-alarm-head">
        <h2 id={`clk-alarm-${kind}`}>{t(study ? 'clock.study' : 'clock.alarm')}</h2>
        <label className="clk-switch">
          <input type="checkbox" checked={alarm.on} disabled={!spot} onChange={(e) => change({ on: e.target.checked })} />
          <span aria-hidden="true" />
          <b>{t(alarm.on ? 'clock.on' : 'clock.off')}</b>
        </label>
      </div>

      {study ? (
        <>
          <p className="clk-study-lead">
            {t('clock.studyLead')}{' '}
            <a href="#/neviim">{t('menu.neviim')}</a> · <a href="#/ketuvim">{t('menu.ketuvim')}</a>
          </p>
          <div className="clk-mode">
            <label>
              <span>{t('clock.studyWhen')}</span>
              {timeInput}
            </label>
          </div>
        </>
      ) : (
        <fieldset className="clk-mode">
          <legend>{t('clock.when')}</legend>
          <label>
            <input type="radio" name="clk-mode" checked={alarm.mode === 'clock'} onChange={() => change({ mode: 'clock' })} />
            <span>{t('clock.modeClock')}</span>
            {timeInput}
          </label>
          <label>
            <input type="radio" name="clk-mode" checked={alarm.mode === 'shma'} onChange={() => change({ mode: 'shma' })} />
            <span>{t('clock.modeShma')}</span>
            <select aria-label={t('clock.modeShma')} value={alarm.before} onChange={(e) => change({ before: Number(e.target.value), mode: 'shma' })}>
              {BEFORE.map((n) => (
                <option key={n} value={n}>
                  {t('clock.beforeMin', { n })}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      )}

      <div className="clk-days" role="group" aria-label={t('clock.days')}>
        {DAYS.map((d) => {
          const on = alarm.days.includes(d);
          return (
            <button key={d} type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={() => change({ days: on ? alarm.days.filter((x) => x !== d) : [...alarm.days, d].sort() })}>
              {dayName(d)}
            </button>
          );
        })}
      </div>

      <div className="clk-rest">
        <p>
          <b>{t('clock.restH')}</b> {t('clock.rest')}
        </p>
        <label>
          <input type="checkbox" checked={alarm.chm} onChange={(e) => change({ chm: e.target.checked })} /> {t('clock.chm')}
        </label>
      </div>

      {alarm.on && (
        <div className="clk-next" role="status">
          {next ? (
            <p>
              {t('clock.next')} <b>{dayText(next.at)}, {hm(next.at)}</b>
            </p>
          ) : (
            <p>{t(alarm.days.length ? 'clock.noNext' : 'clock.noDays')}</p>
          )}
          {skips.map((s) => (
            <p key={s.at.getTime()} className="clk-skip">
              {t('clock.skip', { date: dayText(s.at), why: t(`clock.why.${s.why}` as MessageKey) })}
            </p>
          ))}
        </div>
      )}

      <div className="clk-alarm-foot">
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            armSound();
            ring({ kind, at: new Date(), test: true });
          }}
        >
          {t('clock.test')}
        </button>
        {alarm.on && !soundReady() && <small>{t('clock.tapSound')}</small>}
      </div>
    </section>
  );
}

/**
 * «Часы» (`#/clock`): the clock of the reader's city, the three «latest» times of the day — Shma, the morning prayer,
 * Mincha — and two alarms that keep quiet on Shabbat, Yom Tov and Yom Kippur: the alarm clock and the alarm of Torah study. Rules — src/core/clock.ts, the ring — src/core/alarm.ts.
 */
export function ClockPage() {
  const { t, locale } = useI18n();
  const [now, setNow] = useState(() => new Date());
  const [editing, setEditing] = useState(false);
  const [, redraw] = useState(0);

  useEffect(() => {
    document.title = `${t('clock.title')} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    const on = () => redraw((n) => n + 1);
    window.addEventListener(PLACE_EVENT, on);
    return () => (clearInterval(id), window.removeEventListener(PLACE_EVENT, on));
  }, []);

  const { place, zone, auto } = currentPlace();
  const spot: Spot | null = currentSpot();
  const lang = uiLang(locale);
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang, { timeZone: zone, ...o });
  const hm = (d: Date) => fmt({ hour: '2-digit', minute: '2-digit' }).format(d);
  const dayText = (d: Date) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const city = place ? (place.name[locale as keyof typeof place.name] ?? place.name.en) : '';

  const shown = spot && shownDay(now, spot);
  const todayIso = isoIn(now, zone);
  const hebrew = hebrewDateText(shown?.tomorrow ? addDays(todayIso, 1) : todayIso).replace(/[֑-ׇ]/g, '');
  const left = (at: Date) => {
    const mins = Math.max(1, Math.ceil((at.getTime() - now.getTime()) / MIN));
    return mins >= 60 ? t('clock.leftHm', { h: Math.floor(mins / 60), m: mins % 60 }) : t('clock.leftM', { m: mins });
  };
  const nextId = shown && TIME_IDS.find((id) => shown.times[id] && shown.times[id]! > now);

  return (
    <>
      <TopBar title={t('clock.title')} />
      <div className="wrap clk">
        <h1>{t('clock.title')}</h1>
        <p className="shabbat-calendar-city clk-city">
          {place ? t('calendar.city', { city }) : t('calendar.locationUnavailable')}
          {place && auto && <small> · {t('calendar.auto')}</small>}{' '}
          {!editing && (
            <button type="button" className="sc-edit" onClick={() => setEditing(true)}>
              {t(place ? 'calendar.change' : 'calendar.choose')}
            </button>
          )}
        </p>
        {editing && <CityPicker auto={auto} onDone={() => setEditing(false)} />}

        <div className="clk-top">
          <section className="clk-now" aria-label={t('clock.title')}>
            <Face now={now} zone={zone} marks={shown ? TIME_IDS.map((id) => [id, shown.times[id]]) : []} />
            <p className="clk-digital" role="timer" aria-live="off">
              {fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now)}
            </p>
            <p className="clk-date">
              {dayText(now)}
              <span className="he" lang="he">
                {hebrew}
              </span>
              {shown?.tomorrow && <small>{t('calendar.evening')}</small>}
            </p>
          </section>

          <section className="clk-times" aria-labelledby="clk-times-h">
            <h2 id="clk-times-h">{t('clock.timesH')}</h2>
            {shown ? (
              <>
                {shown.tomorrow && <p className="clk-tomorrow">{t('clock.tomorrow', { date: dayText(new Date(now.getTime() + 24 * 60 * MIN)) })}</p>}
                <ul>
                  {TIME_IDS.map((id) => {
                    const at = shown.times[id];
                    const past = !!at && at <= now;
                    return (
                      <li key={id} className={past ? 'past' : id === nextId ? 'next' : ''}>
                        <i style={{ background: COLOR[id] }} aria-hidden="true" />
                        <span>
                          <b>{t(`clock.t.${id}` as MessageKey)}</b>
                          <small>{at ? (past ? t('clock.past') : left(at)) : ''}</small>
                        </span>
                        <time dateTime={at?.toISOString()}>{at ? hm(at) : t('calendar.noSun')}</time>
                      </li>
                    );
                  })}
                </ul>
                <p className="clk-note">{t('clock.note')}</p>
              </>
            ) : (
              <p className="clk-note">{t('clock.noCity')}</p>
            )}
          </section>
        </div>

        <AlarmCard kind="wake" now={now} spot={spot} zone={zone} />
        <AlarmCard kind="study" now={now} spot={spot} zone={zone} />
        <p className="clk-note clk-limits">{t('clock.limits')}</p>
      </div>
      <Colophon />
    </>
  );
}
