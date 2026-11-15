import { useEffect, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { cleanMarks, DEFAULT_MARKS, shownDay, type TimeId } from '../core/clock';
import { currentSpot } from '../core/alarm';

/*
 * The face of «Часы» — on its page (ClockPage.tsx) and in the «Календарь» window (ShabbatCalendar.tsx).
 */
/** the numerals of the face — Hebrew letters: 12, 3, 6, 9 */
const FACE: [number, string][] = [
  [12, 'י״ב'],
  [3, 'ג'],
  [6, 'ו'],
  [9, 'ט'],
];
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
 */
export function Face({ now, zone, marks, hm, name }: { now: Date; zone: string; marks: [TimeId, Date | null][]; hm: (d: Date) => string; name: (id: TimeId) => string }) {
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
      {(() => {
        /* the dots stand where the HOUR hand points at their time: its thin continuation to the rim shows it
           (owner, 15.11.2026: «написано 16:16, а точка на 16:22» — the dot was read by the minute ticks) */
        const turn = ((h % 12) + m / 60 + s / 3600) / 12;
        const [x1, y1] = polar(turn, 46);
        const [x2, y2] = polar(turn, 89);
        const [cx, cy] = polar(turn, 96);
        return (
          <g className="clk-reach">
            <line x1={x1} y1={y1} x2={x2} y2={y2} />
            <circle cx={cx} cy={cy} r="7" />
          </g>
        );
      })()}
      {hand(((h % 12) + m / 60 + s / 3600) / 12, 46, 'clk-hand hour')}
      {hand((m + s / 60) / 60, 68, 'clk-hand minute')}
      {hand(s / 60, 76, 'clk-hand second')}
      <circle className="clk-pin" cx="100" cy="100" r="4" />
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
      <Face now={now} zone={spot.zone} marks={loadMarks().map((id) => [id, shown.times[id]])} hm={hm} name={(id) => t(`clock.s.${id}` as MessageKey)} />
      {shown.tomorrow && <small>{t('clock.tomorrowShort')}</small>}
      <a className="sc-clock" href="#/clock">
        {t('clock.link')} →
      </a>
    </div>
  );
}
