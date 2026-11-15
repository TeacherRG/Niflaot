import { useEffect, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { CityPicker } from './ShabbatCalendar';
import { hebrewDateText } from '../core/hebcal';
import { currentPlace, PLACE_EVENT } from '../core/places';
import { addDays, BEFORE, cleanMarks, DEADLINES, DEFAULT_MARKS, isoIn, nextRing, restAt, ringOn, shownDay, TIME_IDS, type Alarm, type AlarmKind, type Rest, type Spot, type TimeId } from '../core/clock';
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
const COLOR: Record<TimeId, string> = {
  sunrise: 'var(--gold)',
  shma: 'var(--tchelet)',
  tefila: 'var(--ok)',
  chatzot: 'var(--muted)',
  minchaGedola: 'var(--plum-deep)',
  plag: 'var(--gold-deep)',
  mincha: 'var(--bad)',
  tzeit: 'var(--ink-2)',
};
const MARKS_KEY = 'niflaot:clock-marks';
const loadMarks = (): TimeId[] => {
  try {
    return cleanMarks(JSON.parse(localStorage.getItem(MARKS_KEY) ?? 'null'));
  } catch {
    return DEFAULT_MARKS;
  }
};

/** hours, minutes and seconds of a moment on the wall clock of a time zone */
function wall(at: Date, zone: string) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(at);
  const g = (k: string) => Number(p.find((x) => x.type === k)?.value ?? 0);
  return { h: g('hour'), m: g('minute'), s: g('second') };
}
const polar = (turn: number, r: number) => [100 + r * Math.sin(turn * 2 * Math.PI), 100 - r * Math.cos(turn * 2 * Math.PI)] as const;

/** the labels of one side of the face: each at the height of its dot, moved apart so that none covers another */
function spread(ys: number[], gap = 17, lo = 2, hi = 198): number[] {
  const order = ys.map((y, i) => [y, i] as const).sort((a, b) => a[0] - b[0]);
  const out = order.map(([y]) => y);
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap);
  const over = out.length ? Math.max(0, out[out.length - 1] - hi) : 0;
  for (let i = out.length - 1; i >= 0; i--) out[i] = Math.max(lo + i * gap, Math.min(out[i] - over, i < out.length - 1 ? out[i + 1] - gap : hi));
  const res: number[] = [];
  order.forEach(([, i], k) => (res[i] = out[k]));
  return res;
}

/**
 * The face: hands by the city's time; each chosen time of the day — a dot on the rim at its place and, beside the face,
 * its time and name (owner, 15.11.2026: «отметки о времени должны быть прямо на циферблате»). A passed time is pale.
 */
function Face({ now, zone, marks, hm, name }: { now: Date; zone: string; marks: [TimeId, Date | null][]; hm: (d: Date) => string; name: (id: TimeId) => string }) {
  const { h, m, s } = wall(now, zone);
  const hand = (turn: number, r: number, cls: string) => {
    const [x, y] = polar(turn, r);
    return <line className={cls} x1="100" y1="100" x2={x} y2={y} />;
  };
  const dots = marks.flatMap(([id, at]) => {
    if (!at) return [];
    const w = wall(at, zone);
    const [x, y] = polar(((w.h % 12) + w.m / 60) / 12, 96);
    return [{ id, at, x, y, right: x >= 100 }];
  });
  const place = (right: boolean) => {
    const side = dots.filter((d) => d.right === right);
    const ys = spread(side.map((d) => d.y));
    return side.map((d, i) => ({ ...d, ly: ys[i] }));
  };
  return (
    <svg className="clk-face" viewBox="-116 -10 432 220" role="img" aria-label={dots.map((d) => `${name(d.id)} ${hm(d.at)}`).join(', ')} direction="ltr">
      <circle className="clk-rim" cx="100" cy="100" r="96" />
      {Array.from({ length: 60 }, (_, i) => {
        const [x1, y1] = polar(i / 60, i % 5 ? 90 : 85);
        const [x2, y2] = polar(i / 60, 93);
        return <line key={i} className={i % 5 ? 'clk-tick' : 'clk-tick big'} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {FACE.map(([n, he]) => {
        const [x, y] = polar(n / 12, 70);
        return (
          <text key={n} className="clk-num he" lang="he" x={x} y={y} textAnchor="middle" dominantBaseline="central">
            {he}
          </text>
        );
      })}
      {[...place(false), ...place(true)].map((d) => {
        const lx = d.right ? 208 : -8;
        return (
          <g key={d.id} className={`clk-mark${d.at <= now ? ' past' : ''}`}>
            <polyline points={`${d.x},${d.y} ${d.right ? 200 : 0},${d.ly} ${lx - (d.right ? 3 : -3)},${d.ly}`} stroke={COLOR[d.id]} />
            <circle cx={d.x} cy={d.y} r="5.5" fill={COLOR[d.id]} />
            <text x={lx} y={d.ly} textAnchor={d.right ? 'start' : 'end'} dominantBaseline="central">
              {d.right ? (
                <>
                  <tspan className="clk-mark-t">{hm(d.at)}</tspan> <tspan>{name(d.id)}</tspan>
                </>
              ) : (
                <>
                  <tspan>{name(d.id)}</tspan> <tspan className="clk-mark-t">{hm(d.at)}</tspan>
                </>
              )}
            </text>
          </g>
        );
      })}
      {hand(((h % 12) + m / 60) / 12, 46, 'clk-hand hour')}
      {hand((m + s / 60) / 60, 68, 'clk-hand minute')}
      {hand(s / 60, 76, 'clk-hand second')}
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
  const [marks, setMarks] = useState<TimeId[]>(loadMarks);
  const toggleMark = (id: TimeId) => {
    const next = cleanMarks(marks.includes(id) ? marks.filter((x) => x !== id) : [...marks, id]);
    setMarks(next);
    try {
      localStorage.setItem(MARKS_KEY, JSON.stringify(next));
    } catch {}
  };
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
  // a «latest» time: «осталось …»; the others: «через …»
  const left = (id: TimeId, at: Date) => {
    const mins = Math.max(1, Math.ceil((at.getTime() - now.getTime()) / MIN));
    const k = DEADLINES.includes(id) ? 'left' : 'in';
    return mins >= 60 ? t(`clock.${k}Hm` as MessageKey, { h: Math.floor(mins / 60), m: mins % 60 }) : t(`clock.${k}M` as MessageKey, { m: mins });
  };
  const nextId = shown && marks.find((id) => shown.times[id] && shown.times[id]! > now);

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
            <Face now={now} zone={zone} marks={shown ? marks.map((id) => [id, shown.times[id]]) : []} hm={hm} name={(id) => t(`clock.s.${id}` as MessageKey)} />
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
            <div className="clk-pick" role="group" aria-label={t('clock.pick')}>
              <b>{t('clock.pick')}</b>
              {TIME_IDS.map((id) => {
                const on = marks.includes(id);
                return (
                  <button key={id} type="button" className={on ? 'on' : ''} aria-pressed={on} title={t(`clock.t.${id}` as MessageKey)} onClick={() => toggleMark(id)}>
                    <i style={{ background: COLOR[id] }} aria-hidden="true" />
                    {t(`clock.s.${id}` as MessageKey)}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="clk-times" aria-labelledby="clk-times-h">
            <h2 id="clk-times-h">{t('clock.timesH')}</h2>
            {shown ? (
              <>
                {shown.tomorrow && <p className="clk-tomorrow">{t('clock.tomorrow', { date: dayText(new Date(now.getTime() + 24 * 60 * MIN)) })}</p>}
                <ul>
                  {marks.map((id) => {
                    const at = shown.times[id];
                    const past = !!at && at <= now;
                    return (
                      <li key={id} className={past ? 'past' : id === nextId ? 'next' : ''}>
                        <i style={{ background: COLOR[id] }} aria-hidden="true" />
                        <span>
                          <b>{t(`clock.t.${id}` as MessageKey)}</b>
                          <small>{at ? (past ? t('clock.past') : left(id, at)) : ''}</small>
                        </span>
                        <time dateTime={at?.toISOString()}>{at ? hm(at) : t('calendar.noSun')}</time>
                      </li>
                    );
                  })}
                </ul>
                {!marks.length && <p className="clk-note">{t('clock.pickNone')}</p>}
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
