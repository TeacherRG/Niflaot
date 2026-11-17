import { useEffect, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { cleanMarks, DEFAULT_MARKS, fracOf, halfOf, halfTimes, shownDay, type Half, type TimeId } from '../core/clock';
import { currentSpot } from '../core/alarm';

/*
 * The face of «Часы» — on its page (ClockPage.tsx) and in the «Календарь» window (ShabbatCalendar.tsx).
 */
export const COLOR: Record<TimeId, string> = {
  alot: 'var(--tchelet-deep)',
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
/**
 * The twelve permutations of the four-letter Name, one for each halachic hour — of the day and of the night alike —
 * in the order of «Pardes Rimonim» (gate 13, ch. 3): three beginning with each letter. That every hour has its
 * permutation — «Reshit Chokhmah» (Gate of Fear, 10) and «Pardes Rimonim» (gate 21, ch. 8); the order by the hours is
 * the project's choice (owner, 16.11.2026: «как Пардес, имена через дефис, как опция»). Written with hyphens.
 */
export const TZIRUFIM = ['יהוה', 'יההו', 'יוהה', 'ההיו', 'ההוי', 'היוה', 'והיה', 'וההי', 'ויהה', 'הויה', 'היהו', 'הוהי'].map((w) => [...w].join('-'));
export const TZIRUF_KEY = 'niflaot:clock-tziruf';
export const loadTziruf = (): boolean => {
  try {
    return localStorage.getItem(TZIRUF_KEY) === '1';
  } catch {
    return false;
  }
};
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
 * The time of the city and the ring of the half of the day — for both faces (owner, 17.11.2026: «циферблат отражает 12 часов —
 * или дня, или ночи; горит луна или солнце; что прошло — понятнее: контраст или очень короткая стрелка»).
 * The rim is the 12 halachic hours of the half now — the day (sunrise → sunset) or the night (sunset → sunrise), like a clock:
 * the start and the end of the half at the top. A dash is a quarter of a halachic hour (48 dashes); the first dash of each
 * hour is longer. The dashes of the time gone by are lit, the rest are faint, the dash of «now» is red and a short red hand
 * points at it. The day is gold, the night tchelet; from sunset to nightfall and from dawn to sunrise the colour passes between.
 */
export function dial(now: Date, zone: string, half: Half | null) {
  const { h, m, s } = wall(now, zone);
  const turnOf = (at: Date) => (half ? (((fracOf(at, half) % 1) + 1) % 1) : 0);
  const ring = (() => {
    if (!half) return null;
    const p = Math.min(0.99999, Math.max(0, fracOf(now, half)));
    const cur = Math.floor(p * 48);
    const at = (d: Date | null, fallback: number) => {
      if (!d) return fallback;
      const f = fracOf(d, half);
      return f > 0 && f < 1 ? f : fallback;
    };
    const dusk = at(half.tzeit, 0.08); // nightfall
    const dawn = at(half.alot, 0.9); // dawn
    const dashes = Array.from({ length: 48 }, (_, k) => {
      const f = (k + 0.5) / 48;
      /* how much of the day is in the colour: 1 — day, 0 — night */
      const light = half.day ? 1 : f < dusk ? 1 - f / dusk : f > dawn ? (f - dawn) / (1 - dawn) : 0;
      const state = k < cur ? 'lit' : k === cur ? 'now' : 'off';
      return { k, turn: f, light, width: (2 * Math.PI * 92 * 0.55) / 48, hour: k % 4 === 0, state };
    });
    return { dashes, p, day: half.day, hour: Math.floor(p * 12) };
  })();
  return { h, m, s, turnOf, ring };
}

type DialRing = NonNullable<ReturnType<typeof dial>['ring']>;

/** The rim: 48 dashes, the sun or the moon inside at the top, and the short hand of «now». */
function RingMarks({ ring, symbolAt = 54 }: { ring: DialRing; symbolAt?: number }) {
  const [hx1, hy1] = polar(ring.p, 72);
  const [hx2, hy2] = polar(ring.p, 85);
  return (
    <>
      {ring.dashes.map((d) => {
        const [x1, y1] = polar(d.turn, d.hour ? 82 : 86);
        const [x2, y2] = polar(d.turn, d.state === 'now' ? 99 : 96);
        return (
          <line
            key={d.k}
            className={`clk-dash ${d.state}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={d.state === 'now' ? d.width * 1.4 : d.state === 'lit' ? d.width : d.width * 0.7}
            stroke={`color-mix(in srgb, var(--gold) ${Math.round(d.light * 100)}%, var(--tchelet))`}
          />
        );
      })}
      <line className="clk-hand" x1={hx1} y1={hy1} x2={hx2} y2={hy2} />
      {ring.day ? (
        <g className="clk-sun" transform={`translate(100 ${symbolAt}) scale(1.15)`}>
          <circle r="4.5" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="0" y1="-7" x2="0" y2="-9.5" transform={`rotate(${i * 45})`} />
          ))}
        </g>
      ) : (
        <path className="clk-moon" transform={`translate(100 ${symbolAt}) scale(1.15)`} d="M2 -7 A7 7 0 1 0 7 2 A5.5 5.5 0 0 1 2 -7Z" />
      )}
    </>
  );
}

/**
 * The face: hands by the city's time; each chosen time of the day — a dot on the rim at its place and, beside the face,
 * its time and name (owner, 15.11.2026: «отметки о времени должны быть прямо на циферблате»). A passed time is pale.
 * Inside the face — the digital time of the city («21:15»), the sun or the moon; the rim is the half of the day now — 12
 * halachic hours of the day or of the night (see `dial`); the chosen times stand as dots just outside it.
 */
export function Face({
  now,
  zone,
  marks,
  half,
  hm,
  name,
  tziruf,
}: {
  now: Date;
  zone: string;
  marks: [TimeId, Date | null][];
  half: Half | null;
  hm: (d: Date) => string;
  name: (id: TimeId) => string;
  /** show the permutation of the Name of the current halachic hour */
  tziruf?: boolean;
}) {
  const { h, m, s, turnOf, ring } = dial(now, zone, half);
  const two = (n: number) => String(n).padStart(2, '0');
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
      {ring && <RingMarks ring={ring} />}
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
      {tziruf && ring && (
        <text className="clk-tziruf he" lang="he" x="100" y="160" textAnchor="middle" dominantBaseline="central" direction="rtl">
          {TZIRUFIM[ring.hour]}
        </text>
      )}
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
  const half = halfOf(now, spot);
  const inHalf = half ? halfTimes(half, spot) : {};
  const hm = (d: Date) => new Intl.DateTimeFormat(uiLang(locale), { timeZone: spot.zone, hour: '2-digit', minute: '2-digit' }).format(d);
  return (
    <div className="sc-face">
      <Face now={now} zone={spot.zone} half={half} marks={loadMarks().map((id) => [id, inHalf[id] ?? null])} tziruf={loadTziruf()} hm={hm} name={(id) => t(`clock.s.${id}` as MessageKey)} />
      {shown.tomorrow && <small>{t('clock.tomorrowShort')}</small>}
      <a className="sc-clock" href="#/clock">
        {t('clock.link')} →
      </a>
    </div>
  );
}

/** a time of the day on the big face: a zman, or candle lighting / the end of Shabbat */
export type FaceId = TimeId | 'candles' | 'havdalah';
export interface FaceEvent {
  id: FaceId;
  at: Date;
  color: string;
  /** its time written beside the dot (the reader's choice) */
  label: boolean;
}
/** the box of the big face's SVG — the popover is placed by it */
export const BIG_BOX = { x: -4, y: -4, w: 208, h: 208 };

/**
 * The big face of the page «Часы» (owner, 16.11.2026: «циферблат на весь экран… всплывающими интерактивными подсказками»):
 * the ring of the day, every time of the day a dot on the rim — a button: a tap (or the mouse) opens its popover
 * (ClockPage.tsx); the times the reader chose are written beside their dots. Inside — the city's time and the next time
 * — only digits: the time of the city and, beside the chosen dots, their times (owner, 16.11.2026: «убери другие слова с циферблата»).
 */
export function BigFace({
  now,
  zone,
  half,
  hourLabel,
  events,
  active,
  onPick,
  onHover,
  tziruf,
  hm,
  short = hm,
  name,
}: {
  now: Date;
  zone: string;
  /** the half of the day the rim shows — see `dial` */
  half: Half | null;
  /** «4-й час дня» — under the time */
  hourLabel?: string;
  events: FaceEvent[];
  /** the time written beside a dot — without AM / PM, the rim says day or night */
  short?: (d: Date) => string;
  active: FaceId | null;
  /** a dot chosen: its place as a fraction of the box (0–1) */
  onPick: (id: FaceId, fx: number, fy: number) => void;
  onHover?: (id: FaceId | null, fx: number, fy: number) => void;
  tziruf?: boolean;
  hm: (d: Date) => string;
  name: (id: FaceId) => string;
}) {
  const { h, m, s, turnOf, ring } = dial(now, zone, half);
  const two = (n: number) => String(n).padStart(2, '0');
  const dots = events.map((e) => {
    const turn = turnOf(e.at);
    const [x, y] = polar(turn, 91.5);
    return { ...e, turn, x, y, hit: 11 };
  });
  // the area a tap reaches: no more than half the way to the nearest dot — close times (sunset and nightfall) stay apart
  for (const d of dots) for (const o of dots) if (o !== d) d.hit = Math.max(4.5, Math.min(d.hit, Math.hypot(d.x - o.x, d.y - o.y) / 2));
  // the written times: moved apart along the rim so that none covers another
  const labelled = dots.filter((d) => d.label).sort((a, b) => a.turn - b.turn);
  const GAP = 0.045;
  const turns = labelled.map((d) => d.turn);
  for (let i = 1; i < turns.length; i++) turns[i] = Math.max(turns[i], turns[i - 1] + GAP);
  const frac = (x: number, y: number) => [(x - BIG_BOX.x) / BIG_BOX.w, (y - BIG_BOX.y) / BIG_BOX.h] as const;
  const pick = (d: (typeof dots)[number]) => onPick(d.id, ...frac(d.x, d.y));
  return (
    <svg className="clk-bigface" viewBox={`${BIG_BOX.x} ${BIG_BOX.y} ${BIG_BOX.w} ${BIG_BOX.h}`} role="group" aria-label={dots.map((d) => `${name(d.id)} ${hm(d.at)}`).join(', ')} direction="ltr">
      <circle className="clk-rim" cx="100" cy="100" r="99" />
      {ring && <RingMarks ring={ring} symbolAt={56} />}
      {labelled.map((d, i) => {
        const [x, y] = polar(turns[i], 68);
        return (
          <text key={`l-${d.id}`} className={`clk-blabel${d.at <= now ? ' past' : ''}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={d.color}>
            {short(d.at)}
          </text>
        );
      })}
      {dots.map((d) => (
        <g
          key={d.id}
          className={`clk-bdot${d.at <= now ? ' past' : ''}${active === d.id ? ' on' : ''}${d.id === 'candles' || d.id === 'havdalah' ? ' shabbat' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`${name(d.id)} ${hm(d.at)}`}
          aria-expanded={active === d.id}
          onClick={() => pick(d)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(d))}
          onPointerEnter={(e) => e.pointerType === 'mouse' && onHover?.(d.id, ...frac(d.x, d.y))}
          onPointerLeave={(e) => e.pointerType === 'mouse' && onHover?.(null, 0, 0)}
        >
          <circle className="hit" cx={d.x} cy={d.y} r={d.hit} />
          {active === d.id && <circle className="halo" cx={d.x} cy={d.y} r="8.5" stroke={d.color} />}
          <circle className="dot" cx={d.x} cy={d.y} r={d.label ? 5 : 3.6} fill={d.color} />
        </g>
      ))}
      {tziruf && ring && (
        <text className="clk-tziruf he" lang="he" x="100" y="154" textAnchor="middle" dominantBaseline="central" direction="rtl">
          {TZIRUFIM[ring.hour]}
        </text>
      )}
      <text className="clk-big" x="100" y="91" textAnchor="middle" dominantBaseline="central">
        {two(h)}:{two(m)}
      </text>
      <text className="clk-bigs" x="100" y="114" textAnchor="middle" dominantBaseline="central">
        {two(s)}
      </text>
      {hourLabel && (
        <text className="clk-hour" x="100" y="131" textAnchor="middle" dominantBaseline="central">
          {hourLabel}
        </text>
      )}
    </svg>
  );
}
