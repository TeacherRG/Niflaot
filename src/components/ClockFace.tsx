import { useEffect, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { cleanMarks, DEFAULT_MARKS, shownDay, type TimeId } from '../core/clock';
import { currentSpot } from '../core/alarm';

/*
 * The face of «Часы» — on its page (ClockPage.tsx) and in the «Календарь» window (ShabbatCalendar.tsx).
 */
export const COLOR: Record<TimeId, string> = {
  sunrise: 'var(--gold)',
  shma: 'var(--tchelet)',
  tefila: 'var(--ok)',
  chatzot: 'var(--muted)',
  minchaGedola: 'var(--plum-deep)',
  plag: 'var(--gold-deep)',
  mincha: 'var(--bad)',
  tzeit: 'var(--ink-2)',
};
export const MARKS_KEY = 'niflaot:clock-marks';
export const loadMarks = (): TimeId[] => {
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
 * Inside the face — the digital time of the city («21:15»), no hands and no numerals; the rim is the ring of the whole
 * day (24 hours: noon at the top, midnight at the bottom) made of dashes — see `ring` below; the chosen times stand
 * as dots just outside it.
 */
export function Face({
  now,
  zone,
  marks,
  times,
  hm,
  name,
}: {
  now: Date;
  zone: string;
  marks: [TimeId, Date | null][];
  times?: Partial<Record<TimeId | 'alot', Date | null>>;
  hm: (d: Date) => string;
  name: (id: TimeId) => string;
}) {
  const { h, m, s } = wall(now, zone);
  const turnOf = (at: Date) => {
    const w = wall(at, zone);
    return ((w.h + w.m / 60 + w.s / 3600) / 24 + 0.5) % 1;
  };
  const nowTurn = ((h + m / 60 + s / 3600) / 24 + 0.5) % 1;
  const two = (n: number) => String(n).padStart(2, '0');
  /*
   * The rim — dashes, as on a watch, but a dash is a quarter of a halachic hour: 48 from sunrise to sunset and 48 from
   * sunset to sunrise. The ring is the 24 hours of the clock, so the dashes of the shorter half are narrower — as its
   * hour is shorter. The dashes up to «now» are lit, the dash of «now» stands out; from dawn to sunrise and from
   * sunset to nightfall the colour passes between night and day (owner, 16.11.2026).
   */
  const ring = (() => {
    const rise = times?.sunrise;
    const set = times?.mincha;
    if (!rise || !set) return null;
    const a = turnOf(rise);
    const dayLen = (turnOf(set) - a + 1) % 1;
    if (dayLen < 0.05 || dayLen > 0.95) return null;
    const nightLen = 1 - dayLen;
    const off = (at: Date | null | undefined, from: number, len: number, fallback: number) => {
      if (!at) return fallback;
      const d = (turnOf(at) - from + 1) % 1;
      return d > len ? fallback : d / len;
    };
    const dusk = off(times?.tzeit, a + dayLen, nightLen, 0.08); // nightfall — a part of the night
    const dawn = off(times?.alot, a + dayLen, nightLen, 0.9); // dawn
    const p = (nowTurn - a + 1) % 1;
    const isDay = p < dayLen;
    const cur = Math.min(47, Math.floor((isDay ? p / dayLen : (p - dayLen) / nightLen) * 48));
    const dashes = Array.from({ length: 96 }, (_, k) => {
      const day = k < 48;
      const i = k % 48;
      const f = (i + 0.5) / 48;
      const turn = (a + (day ? dayLen * f : dayLen + nightLen * f)) % 1;
      /* how much of the day is in the colour: 1 — day, 0 — night */
      const light = day ? 1 : f < dusk ? 1 - f / dusk : f > dawn ? (f - dawn) / (1 - dawn) : 0;
      const slot = (day ? dayLen : nightLen) / 48;
      const state = day !== isDay ? 'off' : i < cur ? 'lit' : i === cur ? 'now' : 'off';
      return { k, turn, light, width: slot * 2 * Math.PI * 92 * 0.5, hour: i % 4 === 0, state };
    });
    const noon = (a + dayLen / 2) % 1;
    return { dashes, sun: polar(noon, 62), moon: polar((noon + 0.5) % 1, 62) };
  })();
  const dots = marks.flatMap(([id, at]) => {
    if (!at) return [];
    const [x, y] = polar(turnOf(at), 104);
    return [{ id, at, x, y, right: x >= 100 }];
  });
  const place = (right: boolean) => {
    const side = dots.filter((d) => d.right === right);
    const ys = spread(side.map((d) => d.y));
    return side.map((d, i) => ({ ...d, ly: ys[i] }));
  };
  return (
    <svg className="clk-face" viewBox="-116 -10 432 220" role="img" aria-label={dots.map((d) => `${name(d.id)} ${hm(d.at)}`).join(', ')} direction="ltr">
      <circle className="clk-rim" cx="100" cy="100" r="99" />
      {ring ? (
        <>
          {ring.dashes.map((d) => {
            const [x1, y1] = polar(d.turn, d.hour ? 84 : 87);
            const [x2, y2] = polar(d.turn, d.state === 'now' ? 99 : 96);
            return (
              <line
                key={d.k}
                className={`clk-dash ${d.state}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={d.state === 'now' ? d.width * 1.5 : d.width}
                stroke={`color-mix(in srgb, var(--gold) ${Math.round(d.light * 100)}%, var(--tchelet))`}
              />
            );
          })}
          <g className="clk-sun" transform={`translate(${ring.sun[0]} ${ring.sun[1]})`}>
            <circle r="4.5" />
            {Array.from({ length: 8 }, (_, i) => (
              <line key={i} x1="0" y1="-7" x2="0" y2="-9.5" transform={`rotate(${i * 45})`} />
            ))}
          </g>
          <path className="clk-moon" transform={`translate(${ring.moon[0]} ${ring.moon[1]})`} d="M2 -7 A7 7 0 1 0 7 2 A5.5 5.5 0 0 1 2 -7Z" />
        </>
      ) : null}
      {[...place(false), ...place(true)].map((d) => {
        const lx = d.right ? 208 : -8;
        return (
          <g key={d.id} className={`clk-mark${d.at <= now ? ' past' : ''}`}>
            <polyline points={`${d.x},${d.y} ${d.right ? 200 : 0},${d.ly} ${lx - (d.right ? 3 : -3)},${d.ly}`} stroke={COLOR[d.id]} />
            <circle cx={d.x} cy={d.y} r="4" fill={COLOR[d.id]} />
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
      <text className="clk-big" x="100" y="100" textAnchor="middle" dominantBaseline="central">
        {two(h)}:{two(m)}
      </text>
      <text className="clk-bigs" x="100" y="136" textAnchor="middle" dominantBaseline="central">
        {two(s)}
      </text>
    </svg>
  );
}

/**
 * The face in the «Календарь» window (owner, 15.11.2026: «добавь циферблат в страничку календарь»): the clock of the
 * reader's city with the marks chosen on the page «Часы», and the way there — to choose the marks and to set the alarms.
 */
export function CalendarClock() {
  const { t, locale } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const spot = currentSpot();
  if (!spot) return null;
  const shown = shownDay(now, spot);
  const hm = (d: Date) => new Intl.DateTimeFormat(uiLang(locale), { timeZone: spot.zone, hour: '2-digit', minute: '2-digit' }).format(d);
  return (
    <div className="sc-face">
      <Face now={now} zone={spot.zone} times={shown.times} marks={loadMarks().map((id) => [id, shown.times[id]])} hm={hm} name={(id) => t(`clock.s.${id}` as MessageKey)} />
      {shown.tomorrow && <small>{t('clock.tomorrowShort')}</small>}
      <a className="sc-clock" href="#/clock">
        {t('clock.link')} →
      </a>
    </div>
  );
}
