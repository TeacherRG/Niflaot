import { useEffect, useRef, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Icon, Sheet, useDismiss } from './ui';
import { CityPicker } from './ShabbatCalendar';
import { BigFace, COLOR, loadMarks, loadTziruf, MARKS_KEY, TZIRUF_KEY, type FaceEvent, type FaceId } from './ClockFace';
import { KabbalahMiniDial } from './KabbalahMiniDial';
import { KMINI_KEY, loadKmini } from '../core/kabbalahHours';
import { dayTimes, hebrewDateText, hebrewDayMonth, isErevPesach } from '../core/hebcal';
import { currentPlace, PLACE_EVENT } from '../core/places';
import { addDays, BEFORE, cleanMarks, DEADLINES, halfOf, halfTimes, hourOf, isoIn, nextRing, restAt, ringOn, shabbatSpan, shownDay, TIME_IDS, type Alarm, type AlarmKind, type Rest, type Spot, type TimeId } from '../core/clock';
import { armSound, currentSpot, loadAlarm, ring, saveAlarm, soundReady } from '../core/alarm';

const MIN = 60_000;
const DAYS = [0, 1, 2, 3, 4, 5, 6];

/**
 * One alarm: `wake` — the alarm clock (at a time, or before the end of the time of Shma), `study` — the alarm of Torah
 * study (at a time; its ring leads to the passage of the day of the Prophets and Writings). Both keep quiet on Shabbat,
 * Yom Tov and Yom Kippur.
 */
function AlarmCard({ kind, now, spot, zone, onChange }: { kind: AlarmKind; now: Date; spot: Spot | null; zone: string; onChange?: () => void }) {
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
    onChange?.();
  };
  const next = spot && alarm.on ? nextRing(alarm, now, spot) : null;
  // the rings of the coming eight days that the days of rest cancel — so that the reader sees the rule at work
  const skips: { at: Date; why: Rest }[] = [];
  if (spot && alarm.on) {
    for (let n = 0; n <= 8 && skips.length < 2; n++) {
      const iso = addDays(todayIso, n);
      const at = alarm.days.includes(new Date(`${iso}T12:00:00Z`).getUTCDay()) ? ringOn(alarm, iso, spot) : null;
      const why = at && at >= now ? restAt(at, spot, alarm.chm) : null;
      // Shabbat is not listed: the site itself rests then (ShabbatRest), so no word about the alarm on Shabbat
      if (at && why && why !== 'shabbat') skips.push({ at, why });
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

/** candle lighting and the end of this week's Shabbat for the city: Sunday–Friday — the coming one; on Saturday — today's until it ends */
function shabbatOf(now: Date, spot: Spot) {
  const today = isoIn(now, spot.zone);
  const wd = new Date(`${today}T12:00:00Z`).getUTCDay();
  let fri = addDays(today, wd === 6 ? -1 : (5 - wd + 7) % 7);
  const span = (f: string) => {
    const { candles, end } = shabbatSpan(f, addDays(f, 1), spot);
    return { fri: f, candles, havdalah: end };
  };
  let sh = span(fri);
  if (sh.havdalah && now >= sh.havdalah) sh = span((fri = addDays(fri, 7)));
  return sh;
}

/**
 * «Часы» (`#/clock`; owner, 16.11.2026: «циферблат на весь экран… остальное — всплывающими интерактивными подсказками»):
 * the big face fills the screen; every time of the day is a dot on its rim — a tap opens its popover (what it is, when,
 * how long until it, «label on the face»); the city — a chip above; Shabbat, the two alarms, the list of all times and
 * «how we count» — buttons below that open sheets. Rules — src/core/clock.ts, the ring — src/core/alarm.ts.
 */
type Panel = 'shabbat' | 'wake' | 'study' | 'times' | 'info' | 'kabbalah' | 'city' | null;

export function ClockPage() {
  const { t, locale, ui } = useI18n();
  const [now, setNow] = useState(() => new Date());
  const [panel, setPanel] = useState<Panel>(null);
  const [marks, setMarks] = useState<TimeId[]>(loadMarks);
  const [pop, setPop] = useState<{ id: FaceId; fx: number; fy: number; pinned: boolean } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const popBox = useRef<HTMLDivElement>(null);
  const toggleMark = (id: TimeId) => {
    const next = cleanMarks(marks.includes(id) ? marks.filter((x) => x !== id) : [...marks, id]);
    setMarks(next);
    try {
      localStorage.setItem(MARKS_KEY, JSON.stringify(next));
    } catch {}
  };
  const [tziruf, setTziruf] = useState(loadTziruf);
  const toggleTziruf = () => {
    setTziruf(!tziruf);
    try {
      localStorage.setItem(TZIRUF_KEY, tziruf ? '0' : '1');
    } catch {}
  };
  const [kmini, setKmini] = useState(loadKmini);
  const toggleKmini = () => {
    setKmini(!kmini);
    try {
      localStorage.setItem(KMINI_KEY, kmini ? '0' : '1');
    } catch {}
  };
  const [, redraw] = useState(0);
  useDismiss(!!pop?.pinned, popBox, () => setPop(null));

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
  const hmShort = (d: Date) =>
    fmt({ hour: '2-digit', minute: '2-digit' })
      .formatToParts(d)
      .filter((x) => x.type !== 'dayPeriod')
      .map((x) => x.value)
      .join('')
      .trim();
  const dayText = (d: Date) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const wdTime = (d: Date) => `${fmt({ weekday: 'short' }).format(d)} ${hm(d)}`;
  const city = place ? (place.name[locale as keyof typeof place.name] ?? place.name.en) : '';

  const shown = spot && shownDay(now, spot);
  const todayIso = isoIn(now, zone);
  const hebIso = shown?.tomorrow ? addDays(todayIso, 1) : todayIso;
  const hebrew = hebrewDateText(hebIso).replace(/[֑-ׇ]/g, '');
  // the day as an ordinary number — not everyone reads the letters as numbers (owner, 17.11.2026)
  const hd = hebrewDayMonth(hebIso, ui);
  const sh = spot && shabbatOf(now, spot);
  // Erev Pesach: the last time to burn chametz (5 hours of the day, by the Alter Rebbe), floored to the minute
  const chametzAt = shown && spot && isErevPesach(shown.iso) ? dayTimes(shown.iso, spot.lat, spot.lon, spot.zone).biurChametz : null;
  const chametz = chametzAt && new Date(Math.floor(chametzAt.getTime() / MIN) * MIN);
  // the half of the day on the rim (day or night, 12 halachic hours) and the times that fall in it
  const half = spot && halfOf(now, spot);
  const inHalf = half && spot ? halfTimes(half, spot) : {};
  const hourLabel = half ? t(half.day ? 'clock.hourDay' : 'clock.hourNight', { n: hourOf(now, half) }) : undefined;

  const nameOf = (id: FaceId) => t(`clock.s.${id}` as MessageKey);
  const fullName = (id: FaceId) => (id === 'candles' ? t('calendar.lighting') : id === 'havdalah' ? t('calendar.havdalah') : t(`clock.t.${id}` as MessageKey));
  const colorOf = (id: FaceId) => (id === 'candles' || id === 'havdalah' ? 'var(--gold-deep)' : COLOR[id]);
  const isDeadline = (id: FaceId) => DEADLINES.includes(id as TimeId);
  const until = (at: Date, deadline: boolean) => {
    const mins = Math.max(1, Math.ceil((at.getTime() - now.getTime()) / MIN));
    if (mins >= 24 * 60) return t('clock.inDh', { d: Math.floor(mins / 1440), h: Math.floor((mins % 1440) / 60) });
    const k = deadline ? 'left' : 'in';
    return mins >= 60 ? t(`clock.${k}Hm` as MessageKey, { h: Math.floor(mins / 60), m: mins % 60 }) : t(`clock.${k}M` as MessageKey, { m: mins });
  };

  // the dots of the face: the times of the day that fall in this half; candle lighting and the end of Shabbat — when they are in it too
  const events: FaceEvent[] = [];
  for (const id of TIME_IDS) { const at = inHalf[id]; if (at) events.push({ id, at, color: COLOR[id], label: marks.includes(id) }); }
  if (sh && half) for (const id of ['candles', 'havdalah'] as const) {
    const at = sh[id];
    if (at && at > half.start && at <= half.end) events.push({ id, at, color: colorOf(id), label: true });
  }
  const upcoming = events.filter((e) => e.at > now).sort((a, b) => a.at.getTime() - b.at.getTime())[0];
  const next = upcoming ? { id: upcoming.id, at: upcoming.at, left: until(upcoming.at, isDeadline(upcoming.id)) } : null;
  const popEvent = pop && events.find((e) => e.id === pop.id);

  // where the popover stands: by its dot, inside the stage
  const popStyle = (() => {
    const box = stage.current?.getBoundingClientRect();
    if (!pop || !box) return undefined;
    const size = Math.min(box.width, box.height);
    const ox = (box.width - size) / 2;
    const oy = (box.height - size) / 2;
    const ax = ox + pop.fx * size;
    const ay = oy + pop.fy * size;
    const w = Math.min(280, box.width - 16);
    // a wide screen: beside the face, at the height of the dot; else — next to the dot, towards the centre
    const side = Math.min(300, (box.width - size) / 2 - 20);
    if (side >= 220) {
      const left = pop.fx < 0.5 ? ox - side - 12 : ox + size + 12;
      return { left, width: side, top: Math.max(8, Math.min(box.height - 230, ay - 60)) };
    }
    const left = Math.max(8, Math.min(box.width - w - 8, ax - w / 2));
    return ay < box.height / 2 ? { left, width: w, top: ay + 16 } : { left, width: w, bottom: box.height - ay + 16 };
  })();

  const alarmText = (kind: AlarmKind) => {
    const a = loadAlarm(kind);
    const r = a.on && spot ? nextRing(a, now, spot) : null;
    return r ? wdTime(r.at) : t('clock.off2');
  };
  const shabbatOn = !!(sh?.candles && now >= sh.candles);

  return (
    <>
      <TopBar title={t('clock.title')} />
      <main className="clk2">
        <h1 className="sr-only">{t('clock.title')}</h1>
        <div className="clk2-head">
          <button type="button" className="clk2-chip" onClick={() => setPanel('city')} aria-label={`${t('clock.cityChange')}: ${city || t('calendar.choose')}`}>
            <Icon name="pin" size={16} />
            <span>{city || t('calendar.choose')}</span>
            <Icon name="chevron" size={14} />
          </button>
          <p className="clk2-date">
            <b className="clk2-hday">
              <span className="clk2-hnum">{hd.day}</span> {hd.month} <small>{hd.year}</small>
            </b>
            <span className="clk2-hsub">
              <span className="he" lang="he" dir="rtl">
                {hebrew}
              </span>{' '}
              · {fmt({ weekday: 'short', day: 'numeric', month: 'long' }).format(now)}
            </span>
            {shown?.tomorrow && <small>{t('calendar.evening')}</small>}
          </p>
          <button type="button" className="clk2-chip icon" onClick={() => setPanel('info')} aria-label={t('clock.info')} title={t('clock.info')}>
            <Icon name="info" size={18} />
          </button>
        </div>

        <div className="clk2-stage" ref={stage}>
          {shown ? (
            <>
              <BigFace
                now={now}
                zone={zone}
                half={half}
                hourLabel={hourLabel}
                events={events}
                active={pop?.id ?? null}
                tziruf={tziruf}
                hm={hm}
                short={hmShort}
                name={nameOf}
                onPick={(id, fx, fy) => setPop(pop?.id === id && pop.pinned ? null : { id, fx, fy, pinned: true })}
                onHover={(id, fx, fy) => setPop((p) => (p?.pinned ? p : id ? { id, fx, fy, pinned: false } : null))}
              />
              {half && kmini && <KabbalahMiniDial hour={hourOf(now, half)} day={half.day} onOpen={() => setPanel('kabbalah')} />}
            </>
          ) : (
            <div className="clk2-nocity">
              <p>{t('clock.noCity')}</p>
              <button type="button" className="btn" onClick={() => setPanel('city')}>
                {t('calendar.choose')}
              </button>
            </div>
          )}
          {popEvent && popStyle && (
            <div ref={popBox} className="clk2-pop" style={{ ...popStyle, ['--c' as string]: popEvent.color }} role="dialog" aria-label={fullName(popEvent.id)}>
              <div className="clk2-pop-head">
                <i aria-hidden="true" />
                <b>{fullName(popEvent.id)}</b>
                {pop?.pinned && (
                  <button type="button" className="icon-btn" onClick={() => setPop(null)} aria-label={t('menu.close')}>
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
              <p className="clk2-pop-time">
                <time dateTime={popEvent.at.toISOString()}>{hm(popEvent.at)}</time>
                <span className={popEvent.at <= now ? 'past' : ''}>{popEvent.at <= now ? t('clock.past') : until(popEvent.at, isDeadline(popEvent.id))}</span>
              </p>
              <p className="clk2-pop-d">{t(`clock.d.${popEvent.id}` as MessageKey)}</p>
              {popEvent.id === 'candles' || popEvent.id === 'havdalah' ? (
                <button type="button" className="clk2-pop-link" onClick={() => (setPop(null), setPanel('shabbat'))}>
                  {t('clock.dock.shabbat')} →
                </button>
              ) : (
                <label className="clk2-pop-toggle">
                  <input type="checkbox" checked={marks.includes(popEvent.id as TimeId)} onChange={() => toggleMark(popEvent.id as TimeId)} />
                  {t('clock.onFace')}
                </label>
              )}
            </div>
          )}
        </div>
        {shown && !pop && <p className="clk2-hint">{t('clock.hint')}</p>}

        <nav className="clk2-dock" aria-label={t('clock.title')}>
          <button type="button" className={`clk2-tool shabbat${shabbatOn ? ' live' : ''}`} onClick={() => setPanel('shabbat')}>
            <Icon name="candle" size={22} />
            <b>{t('clock.dock.shabbat')}</b>
            <small>{sh?.candles ? (shabbatOn ? (sh.havdalah ? wdTime(sh.havdalah) : '') : wdTime(sh.candles)) : '—'}</small>
          </button>
          <button type="button" className="clk2-tool" onClick={() => setPanel('wake')}>
            <Icon name="bell" size={22} />
            <b>{t('clock.dock.alarm')}</b>
            <small>{alarmText('wake')}</small>
          </button>
          <button type="button" className="clk2-tool" onClick={() => setPanel('study')}>
            <Icon name="book" size={22} />
            <b>{t('clock.dock.study')}</b>
            <small>{alarmText('study')}</small>
          </button>
          <button type="button" className="clk2-tool" onClick={() => setPanel('times')}>
            <Icon name="list" size={22} />
            <b>{t('clock.dock.times')}</b>
            <small>{shown?.tomorrow ? t('clock.tomorrowWord') : t('clock.today')}</small>
          </button>
        </nav>
      </main>

      <Sheet open={panel === 'city'} onClose={() => setPanel(null)} title={t('clock.cityChange')} closeLabel={t('menu.close')}>
        <p className="shabbat-calendar-city">
          {place ? t('calendar.city', { city }) : t('calendar.locationUnavailable')}
          {place && auto && <small> · {t('calendar.auto')}</small>}
        </p>
        <CityPicker auto={auto} onDone={() => setPanel(null)} />
      </Sheet>

      <Sheet open={panel === 'shabbat'} onClose={() => setPanel(null)} title={t('calendar.shabbat')} closeLabel={t('menu.close')}>
        {sh ? (
          <div className="clk2-shabbat">
            <p className="clk2-sh-date">
              {dayText(new Date(Date.parse(`${addDays(sh.fri, 1)}T12:00:00Z`)))}
              <span className="he" lang="he" dir="rtl">
                {hebrewDateText(addDays(sh.fri, 1)).replace(/[֑-ׇ]/g, '')}
              </span>
            </p>
            {(shabbatOn ? sh.havdalah : sh.candles) && (
              <div className="clk2-sh-count">
                <small>{t(shabbatOn ? 'clock.shabbatOn' : 'clock.shabbatLead')}</small>
                <b>{until((shabbatOn ? sh.havdalah : sh.candles)!, false).replace(/^\S+\s/, '')}</b>
              </div>
            )}
            <ul>
              {(['candles', 'havdalah'] as const).map((id) => (
                <li key={id}>
                  <Icon name={id === 'candles' ? 'candle' : 'spark'} size={22} />
                  <span>
                    <b>{fullName(id)}</b>
                    <small>{t(`clock.d.${id}` as MessageKey)}</small>
                  </span>
                  <time>{sh[id] ? wdTime(sh[id]!) : t('calendar.noSun')}</time>
                </li>
              ))}
            </ul>
            <p className="clk-note">{t('clock.shabbatNote')}</p>
          </div>
        ) : (
          <p className="clk-note">{t('clock.noCity')}</p>
        )}
      </Sheet>

      <Sheet open={panel === 'wake' || panel === 'study'} onClose={() => setPanel(null)} title={t(panel === 'study' ? 'clock.study' : 'clock.alarm')} closeLabel={t('menu.close')}>
        {(panel === 'wake' || panel === 'study') && <AlarmCard kind={panel} now={now} spot={spot} zone={zone} onChange={() => redraw((n) => n + 1)} />}
        <p className="clk-note">{t('clock.limits')}</p>
      </Sheet>

      <Sheet open={panel === 'times'} onClose={() => setPanel(null)} title={t('clock.timesH')} closeLabel={t('menu.close')}>
        {shown ? (
          <div className="clk-times">
            {shown.tomorrow && <p className="clk-tomorrow">{t('clock.tomorrow', { date: dayText(new Date(now.getTime() + 24 * 60 * MIN)) })}</p>}
            <ul>
              {TIME_IDS.map((id) => {
                const at = shown.times[id];
                const past = !!at && at <= now;
                const on = marks.includes(id);
                return (
                  <li key={id} className={past ? 'past' : id === next?.id ? 'next' : ''}>
                    <i style={{ background: COLOR[id] }} aria-hidden="true" />
                    <span>
                      <b>{t(`clock.t.${id}` as MessageKey)}</b>
                      <small>{at ? (past ? t('clock.past') : until(at, isDeadline(id))) : ''}</small>
                    </span>
                    <time dateTime={at?.toISOString()}>{at ? hm(at) : t('calendar.noSun')}</time>
                    <button type="button" className={`clk2-eye${on ? ' on' : ''}`} aria-pressed={on} aria-label={`${t('clock.onFace')}: ${t(`clock.s.${id}` as MessageKey)}`} title={t('clock.onFace')} onClick={() => toggleMark(id)}>
                      {on && <Icon name="check" size={16} />}
                    </button>
                  </li>
                );
              })}
              {chametz && (
                <li className={chametz <= now ? 'past' : ''}>
                  <i style={{ background: 'var(--bad-deep)' }} aria-hidden="true" />
                  <span>
                    <b>{t('clock.t.biurChametz')}</b>
                    <small>{chametz <= now ? t('clock.past') : until(chametz, true)}</small>
                  </span>
                  <time dateTime={chametz.toISOString()}>{hm(chametz)}</time>
                  <span />
                </li>
              )}
            </ul>
            <label className="clk2-pop-toggle clk2-tz">
              <input type="checkbox" checked={tziruf} onChange={toggleTziruf} />
              {t('clock.tziruf')}
            </label>
            {tziruf && <p className="clk-note">{t('clock.tzirufNote')}</p>}
            <label className="clk2-pop-toggle clk2-tz">
              <input type="checkbox" checked={kmini} onChange={toggleKmini} />
              {t('clock.km.toggle')}
            </label>
            {kmini && <p className="clk-note">{t('clock.km.note')}</p>}
            <TzirufMore />
          </div>
        ) : (
          <p className="clk-note">{t('clock.noCity')}</p>
        )}
      </Sheet>

      <Sheet open={panel === 'info'} onClose={() => setPanel(null)} title={t('clock.info')} closeLabel={t('menu.close')}>
        <p className="clk-note">{t('clock.note')}</p>
        <p className="clk-note">{t('clock.shabbatNote')}</p>
        <p className="clk-note">{t('clock.limits')}</p>
        <TzirufMore />
      </Sheet>

      <Sheet open={panel === 'kabbalah'} onClose={() => setPanel(null)} title={t('clock.km.title')} closeLabel={t('menu.close')}>
        <p className="clk-note">{t('clock.km.note')}</p>
        <TzirufMore open />
      </Sheet>
    </>
  );
}

/** «Что такое сочетание Имени?» — свёрнутое объяснение: число сочетаний, источники, порядок на часах, как смотреть. */
function TzirufMore({ open = false }: { open?: boolean } = {}) {
  const { t } = useI18n();
  return (
    <details className="clk-tz-more" open={open}>
      <summary>{t('clock.tzirufMore')}</summary>
      {t('clock.tzirufMoreBody').split('\n\n').map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </details>
  );
}