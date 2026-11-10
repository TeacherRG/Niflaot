import { BANDS, timeScale, type SnoEvent, type SnoModel, type SnoPerson } from '../core/sno3d';

/**
 * Рисование модели «Шана · Нефеш · Олам» (src/core/sno3d.ts) на canvas — своя маленькая перспектива, без библиотек 3D:
 * точек и линий — сотни, им хватает 2D-canvas. Вращение — тянуть, сдвиг — Shift / правая кнопка / два пальца, ближе —
 * колесо / щипок; клавиши: стрелки — вращать, + / − — ближе / дальше, [ ] — год назад / вперёд.
 *
 * Оси: X — шана (год), Y — олам (широта: юг внизу, север вверху), Z — нефеш (линия человека; поздние ближе к зрителю).
 */
export type Pick = { kind: 'person'; key: string; year?: number } | { kind: 'event'; key: string } | { kind: 'year'; year: number } | { kind: 'none' };

export interface SceneState {
  model: SnoModel;
  scale: 'eras' | 'linear';
  year: number | null;
  win: number;
  sel: Pick;
  /** кто светится при выбранном годе */
  active: Set<string>;
  activeEvents: Set<string>;
  activePlaces: Set<string>;
  name: (p: SnoPerson) => string;
  place: (id: string) => string;
  eraName: (i: number) => string;
  axis: { shana: string; nefesh: string; olam: string; south: string; north: string; groups: string };
}

export interface View {
  yaw: number;
  pitch: number;
  dist: number;
  tx: number;
  ty: number;
  tz: number;
}

const W = 120;
const H = 40;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export class Scene {
  private ctx: CanvasRenderingContext2D;
  private st: SceneState | null = null;
  view: View = { yaw: -0.55, pitch: 0.38, dist: 230, tx: W / 2, ty: H / 2, tz: 40 };
  private anim: { from: View; to: View; t0: number } | null = null;
  private raf = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private hover: Pick = { kind: 'none' };
  private hits: { segs: { x1: number; y1: number; x2: number; y2: number; p: SnoPerson; a: number; b: number }[]; dots: { x: number; y: number; r: number; pick: Pick }[]; axis: { x1: number; y1: number; x2: number; y2: number } | null } = { segs: [], dots: [], axis: null };
  private ptr = new Map<number, { x: number; y: number }>();
  private moved = 0;
  private gesture: { d: number; mx: number; my: number } | null = null;
  private off: (() => void)[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private onPick: (p: Pick) => void,
    private onHover: (label: string | null, x: number, y: number) => void,
  ) {
    this.ctx = canvas.getContext('2d')!;
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, k: K, f: (e: HTMLElementEventMap[K]) => void, o?: AddEventListenerOptions) => {
      el.addEventListener(k, f as EventListener, o);
      this.off.push(() => el.removeEventListener(k, f as EventListener, o));
    };
    on(canvas, 'pointerdown', (e) => this.down(e));
    on(canvas, 'pointermove', (e) => this.move(e));
    on(canvas, 'pointerup', (e) => this.up(e));
    on(canvas, 'pointercancel', (e) => this.up(e, true));
    on(canvas, 'pointerleave', () => {
      if (!this.ptr.size) this.setHover({ kind: 'none' }, 0, 0);
    });
    on(canvas, 'wheel', (e) => this.wheel(e), { passive: false });
    on(canvas, 'contextmenu', (e) => e.preventDefault());
    on(canvas, 'keydown', (e) => this.key(e));
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(canvas);
    this.off.push(() => ro.disconnect());
    this.resize();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.off.forEach((f) => f());
  }

  set(st: SceneState) {
    const first = !this.st;
    this.st = st;
    if (first) this.view = this.fit(this.preset('3d'));
    this.redraw();
  }

  /** z линии человека */
  private depth() {
    return Math.max(64, Math.min(96, (this.st?.model.lanes ?? 30) * 3));
  }
  private zOf(lane: number) {
    const n = this.st!.model.lanes;
    // ранние — спереди, у оси времени; поздние уходят вглубь
    return lane < 0 ? this.depth() + 2 : (1 - lane / Math.max(1, n - 1)) * this.depth();
  }
  private xOf(y: number) {
    return timeScale(this.st!.scale, this.st!.model.y1).x(y) * W;
  }
  /** широта: Земля Израиля (30,5–33,5°) — 70 % высоты, юг и север за ней (Египет, Харан, Арарат) — сжаты */
  private yOf(lat: number) {
    const m = this.st!.model;
    const a = Math.min(m.lat0, 30.4);
    const b = Math.max(m.lat1, 33.6);
    const k = [
      [a, 0],
      [30.5, 0.1],
      [33.5, 0.8],
      [b, 1],
    ];
    for (let i = 0; i < 3; i++)
      if (lat <= k[i + 1][0] || i === 2) return (k[i][1] + ((lat - k[i][0]) / (k[i + 1][0] - k[i][0])) * (k[i + 1][1] - k[i][1])) * H;
    return H;
  }

  preset(kind: '3d' | 'to' | 'tn' | 'no'): View {
    const D = this.depth();
    const base = { tx: W / 2, ty: H / 2, tz: D / 2 };
    const fit = (span: number) => span * 0.95 * Math.max(1, (this.h || 400) / (this.w || 400));
    if (kind === 'to') return { ...base, yaw: 0, pitch: 0, dist: fit(W) };
    if (kind === 'tn') return { ...base, yaw: 0, pitch: Math.PI / 2 - 0.001, dist: fit(W) };
    if (kind === 'no') return { ...base, yaw: Math.PI / 2, pitch: 0, dist: fit(Math.max(D, H) * 1.3) };
    return { ...base, yaw: 0.42, pitch: 0.3, dist: fit(W) * 1.2 };
  }
  /** подогнать вид: коробка модели — по центру окна и во весь его размер (несколько шагов: перспектива нелинейна) */
  private fit(v: View): View {
    if (!this.w || !this.st) return v;
    const keep = this.view;
    this.view = { ...v };
    const D = this.depth();
    const corners: [number, number, number][] = [];
    for (const x of [0, W]) for (const y of [0, H]) for (const z of [-6, D + 6]) corners.push([x, y, z]);
    for (let i = 0; i < 6; i++) {
      const ps = corners.map((c) => this.proj(...c)).filter((p): p is [number, number, number] => !!p);
      if (ps.length < 8) {
        this.view.dist *= 1.3;
        continue;
      }
      const xs = ps.map((p) => p[0]);
      const ys = ps.map((p) => p[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      // слева — подписи мест на оси «олам»: модель чуть правее середины
      this.pan(this.w / 2 + Math.min(40, this.w * 0.1) - (x0 + x1) / 2, this.h / 2 - (y0 + y1) / 2 + 8);
      const k = Math.max((x1 - x0) / (this.w - Math.min(150, this.w * 0.12)), (y1 - y0) / (this.h - 60));
      this.view.dist = clamp(this.view.dist * (0.35 + 0.65 * k), 25, 900);
    }
    const out = this.view;
    this.view = keep;
    return out;
  }
  goto(kind: '3d' | 'to' | 'tn' | 'no') {
    const to = this.fit(this.preset(kind));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.view = to;
      this.redraw();
      return;
    }
    this.anim = { from: { ...this.view }, to, t0: performance.now() };
    this.redraw();
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.redraw();
  }

  redraw() {
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => this.draw());
  }

  private proj(x: number, y: number, z: number): [number, number, number] | null {
    const v = this.view;
    const dx = x - v.tx;
    const dy = y - v.ty;
    const dz = z - v.tz;
    const cy = Math.cos(v.yaw);
    const sy = Math.sin(v.yaw);
    const cp = Math.cos(v.pitch);
    const sp = Math.sin(v.pitch);
    const x1 = dx * cy + dz * sy;
    const z1 = -dx * sy + dz * cy;
    const y2 = dy * cp - z1 * sp;
    const z2 = dy * sp + z1 * cp;
    const d = v.dist - z2;
    if (d < 2) return null;
    const f = Math.min(this.w, this.h) * 1.15;
    const s = f / d;
    return [this.w / 2 + x1 * s, this.h / 2 - y2 * s, s];
  }

  private draw() {
    const st = this.st;
    if (!st || !this.w) return;
    if (this.anim) {
      const k = clamp((performance.now() - this.anim.t0) / 450, 0, 1);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const { from, to } = this.anim;
      const lerp = (a: number, b: number) => a + (b - a) * e;
      this.view = { yaw: lerp(from.yaw, to.yaw), pitch: lerp(from.pitch, to.pitch), dist: lerp(from.dist, to.dist), tx: lerp(from.tx, to.tx), ty: lerp(from.ty, to.ty), tz: lerp(from.tz, to.tz) };
      if (k < 1) this.redraw();
      else this.anim = null;
    }
    const cs = getComputedStyle(document.documentElement);
    const c = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
    const col = {
      ink: c('--ink', '#141A33'),
      muted: c('--muted', '#5D6482'),
      line: c('--line', '#E3E5EE'),
      surface: c('--surface', '#fff'),
      gold: c('--gold', '#A47C2F'),
      gold2: c('--gold-2', '#D8B565'),
      tchelet: c('--tchelet', '#2B4F95'),
      plum: c('--plum-deep', '#5B3A8C'),
      ok: c('--ok', '#2A7448'),
      fire: c('--fire', '#B4461B'),
      bad: c('--bad', '#AE2A21'),
      soft: c('--tchelet-soft', '#EAF0FA'),
      goldSoft: c('--gold-soft', '#F7F0E1'),
    };
    const kindColor: Record<string, string> = {
      life: col.tchelet,
      'king-united': col.gold,
      'king-judah': col.gold,
      'king-israel': col.plum,
      prophet: col.ok,
      point: col.muted,
    };
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    const D = this.depth();
    const m = st.model;
    const segs: typeof this.hits.segs = [];
    const dots: typeof this.hits.dots = [];
    const P = (x: number, y: number, z: number) => this.proj(x, y, z);
    const line = (a: [number, number, number], b: [number, number, number], color: string, width: number, alpha = 1, dash: number[] = []) => {
      const p = P(...a);
      const q = P(...b);
      if (!p || !q) return null;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(q[0], q[1]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      return [p, q] as const;
    };
    const poly = (pts: [number, number, number][], fill: string, alpha: number, stroke?: string) => {
      const ps = pts.map((p) => P(...p));
      if (ps.some((p) => !p)) return;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ps.forEach((p, i) => (i ? ctx.lineTo(p![0], p![1]) : ctx.moveTo(p![0], p![1])));
      ctx.closePath();
      ctx.fill();
      if (stroke) {
        ctx.globalAlpha = Math.min(1, alpha * 5);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const labels: { x: number; y: number; w: number; h: number }[] = [];
    const text = (s: string, at: [number, number, number], o: { color?: string; size?: number; weight?: number; align?: CanvasTextAlign; dx?: number; dy?: number; force?: boolean; bg?: boolean; alpha?: number } = {}) => {
      const p = P(...at);
      if (!p) return false;
      const size = o.size ?? 11;
      ctx.font = `${o.weight ?? 500} ${size}px Manrope, system-ui, sans-serif`;
      const w = ctx.measureText(s).width;
      const align = o.align ?? 'left';
      let x = p[0] + (o.dx ?? 0);
      const y = p[1] + (o.dy ?? 0);
      if (align === 'center') x -= w / 2;
      else if (align === 'right') x -= w;
      const box = { x: x - 2, y: y - size + 1, w: w + 4, h: size + 3 };
      if (!o.force && labels.some((b) => b.x < box.x + box.w && box.x < b.x + b.w && b.y < box.y + box.h && box.y < b.y + b.h)) return false;
      if (box.x > this.w || box.x + box.w < 0 || box.y > this.h || box.y + box.h < 0) return false;
      labels.push(box);
      ctx.globalAlpha = o.alpha ?? 1;
      if (o.bg) {
        ctx.fillStyle = col.surface;
        ctx.globalAlpha = (o.alpha ?? 1) * 0.85;
        ctx.fillRect(box.x, box.y, box.w, box.h);
        ctx.globalAlpha = o.alpha ?? 1;
      }
      ctx.fillStyle = o.color ?? col.ink;
      ctx.textAlign = 'left';
      ctx.fillText(s, x, y);
      ctx.globalAlpha = 1;
      return true;
    };

    const year = st.year;
    const selKey = st.sel.kind === 'person' || st.sel.kind === 'event' ? st.sel.key : null;
    const selPerson = st.sel.kind === 'person' ? m.persons.find((p) => p.key === selKey) : undefined;
    const selEvent = st.sel.kind === 'event' ? m.events.find((e) => e.key === selKey) : undefined;
    const focus = (p: SnoPerson) => {
      if (selPerson) return p === selPerson || !!selEvent;
      if (selEvent) return selEvent.who.includes(p.atlas ?? '');
      return year === null || st.active.has(p.key);
    };
    const focusEv = (e: SnoEvent) => {
      if (selEvent) return e === selEvent;
      if (selPerson) return e.who.includes(selPerson.atlas ?? '#');
      return year === null || st.activeEvents.has(e.key);
    };
    const dim = year !== null || !!selPerson || !!selEvent;

    // пол: полосы эпох (X × Z) и подписи
    const bands = [{ from: BANDS[0], to: BANDS[1] }, { from: BANDS[1], to: BANDS[2] }, ...m.eras.map((e) => ({ from: e.from, to: e.to }))];
    bands.forEach((b, i) => {
      const x0 = this.xOf(b.from);
      const x1 = this.xOf(b.to);
      poly(
        [
          [x0, 0, -6],
          [x1, 0, -6],
          [x1, 0, D + 4],
          [x0, 0, D + 4],
        ],
        i % 2 ? col.goldSoft : col.soft,
        0.55,
      );
    });
    // задняя стена (X × Y): широта — линии мест
    poly(
      [
        [0, 0, -6],
        [W, 0, -6],
        [W, H, -6],
        [0, H, -6],
      ],
      col.soft,
      0.25,
    );
    // боковая стена (Z × Y)
    poly(
      [
        [0, 0, -6],
        [0, 0, D + 4],
        [0, H, D + 4],
        [0, H, -6],
      ],
      col.goldSoft,
      0.25,
    );

    // места на оси «олам»: сначала те, что светятся
    const used = new Map<string, number>();
    for (const p of m.persons) for (const s of p.stays) if (s.place && s.known) used.set(s.place, (used.get(s.place) ?? 0) + 1);
    for (const e of m.events) for (const w of e.where) if (m.places[w]) used.set(w, (used.get(w) ?? 0) + 1);
    const placeIds = [...used.keys()].filter((id) => m.places[id]).sort((a, b) => (st.activePlaces.has(b) ? 1 : 0) - (st.activePlaces.has(a) ? 1 : 0) || (used.get(b) ?? 0) - (used.get(a) ?? 0));
    for (const id of placeIds) {
      const y = this.yOf(m.places[id].lat);
      const on = st.activePlaces.has(id);
      line([0, y, -6], [W, y, -6], on ? col.gold : col.line, on ? 1 : 0.8, on ? 0.45 : 0.7);
      line([0, y, -6], [0, y, D + 4], on ? col.gold : col.line, on ? 1 : 0.8, on ? 0.45 : 0.5);
    }

    // оси
    const ax = line([0, 0, D + 4], [W, 0, D + 4], col.ink, 1.6);
    this.hits.axis = ax ? { x1: ax[0][0], y1: ax[0][1], x2: ax[1][0], y2: ax[1][1] } : null;
    line([0, 0, D + 4], [0, H, D + 4], col.ink, 1.6);
    line([0, 0, -6], [0, 0, D + 4], col.ink, 1.6);
    text(`${st.axis.shana} →`, [W, 0, D + 4], { weight: 800, size: 12, color: col.gold, dy: 30, align: 'right', force: true });
    text(`↑ ${st.axis.olam}`, [0, H, D + 4], { weight: 800, size: 12, color: col.gold, dy: -8, force: true });
    text(`${st.axis.nefesh} ↗`, [0, 0, -6], { weight: 800, size: 12, color: col.gold, dy: -8, align: 'right', dx: -6, force: true });
    text(st.axis.south, [0, 0, D + 4], { size: 10, color: col.muted, dx: -6, dy: 14, align: 'right' });
    text(st.axis.north, [0, H, D + 4], { size: 10, color: col.muted, dx: -6, align: 'right' });

    // годы на оси «шана»
    const ticks: number[] = [];
    if (st.scale === 'linear') for (let y = 0; y <= m.y1; y += 250) ticks.push(y);
    else
      for (let i = 0; i < BANDS.length - 1; i++) {
        const len = BANDS[i + 1] - BANDS[i];
        const step = len > 1000 ? 500 : len > 300 ? 100 : 50;
        for (let y = Math.ceil(BANDS[i] / step) * step; y < BANDS[i + 1]; y += step) ticks.push(y);
      }
    for (const b of BANDS) if (!ticks.includes(b)) ticks.push(b);
    ticks.sort((a, b) => a - b);
    for (const y of ticks) {
      const x = this.xOf(y);
      line([x, 0, D + 4], [x, 0, D + 6], col.ink, 1);
      text(String(y), [x, 0, D + 6], { size: 10, color: col.muted, align: 'center', dy: 13 });
    }
    // подписи эпох — на полу у оси
    bands.forEach((b, i) => {
      const x = this.xOf((b.from + b.to) / 2);
      text(st.eraName(i), [x, 0, D + 4], { size: 10, weight: 700, color: col.muted, align: 'center', dy: 27, alpha: 0.85 });
    });

    // плоскость выбранного года
    if (year !== null) {
      const x = this.xOf(year);
      poly(
        [
          [x, 0, -6],
          [x, H, -6],
          [x, H, D + 4],
          [x, 0, D + 4],
        ],
        col.gold2,
        0.12,
        col.gold,
      );
      text(String(year), [x, H, D + 4], { size: 13, weight: 800, color: col.gold, align: 'center', dy: -8, force: true, bg: true });
    }

    // люди
    const drawn = [...m.persons].sort((a, b) => Number(focus(a)) - Number(focus(b)));
    for (const p of drawn) {
      const on = focus(p);
      const alpha = !dim || on ? 1 : 0.16;
      const color = kindColor[p.kind];
      const z = this.zOf(p.lane);
      const hov = this.hover.kind === 'person' && this.hover.key === p.key;
      const thick = (p.kind.startsWith('king') ? 3.2 : 2.2) + (hov || p === selPerson ? 1.6 : 0);
      p.stays.forEach((s, i) => {
        const y = this.yOf(s.lat);
        if (s.b > s.a) {
          const r = line([this.xOf(s.a), y, z], [this.xOf(s.b), y, z], color, thick, alpha, s.known ? [] : [4, 4]);
          if (r) segs.push({ x1: r[0][0], y1: r[0][1], x2: r[1][0], y2: r[1][1], p, a: s.a, b: s.b });
        } else {
          const q = P(this.xOf(s.a), y, z);
          if (q) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath();
            if (p.kind === 'prophet') {
              const r = 5 + (hov ? 2 : 0);
              ctx.moveTo(q[0], q[1] - r);
              ctx.lineTo(q[0] + r, q[1]);
              ctx.lineTo(q[0], q[1] + r);
              ctx.lineTo(q[0] - r, q[1]);
            } else ctx.arc(q[0], q[1], 3.6 + (hov ? 1.5 : 0), 0, Math.PI * 2);
            ctx.fill();
            if (!s.known && p.kind === 'prophet') {
              ctx.fillStyle = col.surface;
              ctx.beginPath();
              ctx.arc(q[0], q[1], 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
            dots.push({ x: q[0], y: q[1], r: 7, pick: { kind: 'person', key: p.key, year: s.a } });
          }
        }
        const next = p.stays[i + 1];
        if (next && next.lat !== s.lat) line([this.xOf(next.a), y, z], [this.xOf(next.a), this.yOf(next.lat), z], color, 1.2, alpha * 0.8, [2, 3]);
      });
      if (p.reign && p.kind === 'life') {
        for (const x of p.stays) {
          const a = Math.max(x.a, p.reign[0]);
          const b = Math.min(x.b, p.reign[1]);
          if (b > a) line([this.xOf(a), this.yOf(x.lat), z], [this.xOf(b), this.yOf(x.lat), z], col.gold, thick + 2, alpha * 0.85);
        }
      }
      if (p.prophetFrom !== undefined && p.kind === 'life') {
        const y = p.stays.find((x) => p.prophetFrom! >= x.a && p.prophetFrom! <= x.b)?.lat;
        const q = y !== undefined ? P(this.xOf(p.prophetFrom), this.yOf(y), z) : null;
        if (q) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = col.ok;
          ctx.beginPath();
          ctx.moveTo(q[0], q[1] - 6);
          ctx.lineTo(q[0] + 6, q[1]);
          ctx.lineTo(q[0], q[1] + 6);
          ctx.lineTo(q[0] - 6, q[1]);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      // точка «здесь в выбранный год»
      if (year !== null && on && p.span) {
        const s = p.stays.find((x) => year >= x.a && year <= x.b);
        if (s) {
          const q = P(this.xOf(year), this.yOf(s.lat), z);
          if (q) {
            ctx.fillStyle = col.gold;
            ctx.strokeStyle = col.surface;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(q[0], q[1], 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    }

    // события: точка на линии каждого человека, «нить» по Z — момент, который связывает души
    for (const e of [...m.events].sort((a, b) => Number(focusEv(a)) - Number(focusEv(b)))) {
      const on = focusEv(e);
      const alpha = !dim || on ? 1 : 0.14;
      const x = this.xOf(e.y);
      const y = this.yOf(e.lat);
      const zs = e.lanes.map((l) => this.zOf(l));
      if (zs.length > 1) line([x, y, Math.min(...zs)], [x, y, Math.max(...zs)], col.fire, 1, alpha * 0.7, [3, 3]);
      if (e.y2) for (const z of zs) line([x, y, z], [this.xOf(e.y2), y, z], col.fire, 1.2, alpha * 0.6);
      const hov = this.hover.kind === 'event' && this.hover.key === e.key;
      for (const z of zs) {
        const q = P(x, y, z);
        if (!q) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = e.kind === 'key' ? col.gold : col.fire;
        ctx.strokeStyle = col.surface;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(q[0], q[1], (e === selEvent ? 6.5 : hov ? 5.5 : 4) * (e.kind === 'key' ? 0.9 : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1;
        dots.push({ x: q[0], y: q[1], r: 8, pick: { kind: 'event', key: e.key } });
      }
    }

    // подписи людей: выбранный, светящиеся, жизни, остальные — где есть место
    const order = [...m.persons].sort((a, b) => rank(b) - rank(a));
    function rank(p: SnoPerson) {
      return (p === selPerson ? 100 : 0) + (year !== null && st!.active.has(p.key) ? 50 : 0) + (p.kind === 'life' ? 10 : 0) + (p.kind.startsWith('king') ? 3 : 0);
    }
    for (const p of order) {
      if (dim && !focus(p)) continue;
      const s = year !== null && p.span ? (p.stays.find((x) => year >= x.a && year <= x.b) ?? p.stays[0]) : p.stays[0];
      if (!s) continue;
      const at: [number, number, number] = [year !== null && p.span ? this.xOf(year) : this.xOf(s.a), this.yOf(s.lat), this.zOf(p.lane)];
      text(this.st!.name(p), at, { size: p === selPerson ? 13 : 11, weight: p === selPerson || p.kind === 'life' ? 800 : 600, color: kindColor[p.kind], dx: 7, dy: -5, bg: true, force: p === selPerson });
    }
    // места выбранного года — подписи на плоскости года
    if (year !== null)
      for (const id of st.activePlaces) {
        const pl = m.places[id];
        if (pl) text(st.place(id), [this.xOf(year), this.yOf(pl.lat), -6], { size: 10.5, weight: 700, color: col.gold, dx: 6, dy: 4, bg: true });
      }
    // места на оси — где есть место для подписи
    for (const id of placeIds) {
      const pl = m.places[id];
      const on = st.activePlaces.has(id);
      text(st.place(id), [0, this.yOf(pl.lat), D + 4], { size: on ? 11 : 9.5, weight: on ? 800 : 500, color: on ? col.gold : col.muted, dx: -8, dy: 3, align: 'right', alpha: dim && !on ? 0.5 : 1 });
    }
    text(st.axis.groups, [0, 0, this.zOf(-1)], { size: 9.5, color: col.muted, dx: -6, dy: 3, align: 'right' });

    this.hits.segs = segs;
    this.hits.dots = dots;
  }

  private pickAt(x: number, y: number): Pick {
    let best: Pick = { kind: 'none' };
    let bd = Infinity;
    for (const d of this.hits.dots) {
      const k = Math.hypot(d.x - x, d.y - y);
      if (k <= d.r + 4 && k < bd) {
        bd = k;
        best = d.pick;
      }
    }
    if (best.kind !== 'none') return best;
    for (const s of this.hits.segs) {
      const vx = s.x2 - s.x1;
      const vy = s.y2 - s.y1;
      const l2 = vx * vx + vy * vy || 1;
      const t = clamp(((x - s.x1) * vx + (y - s.y1) * vy) / l2, 0, 1);
      const k = Math.hypot(s.x1 + t * vx - x, s.y1 + t * vy - y);
      if (k < 8 && k < bd) {
        bd = k;
        const xa = timeScale(this.st!.scale, this.st!.model.y1);
        const ya = xa.x(s.a);
        const yb = xa.x(s.b);
        best = { kind: 'person', key: s.p.key, year: Math.round(xa.y(ya + t * (yb - ya))) };
      }
    }
    if (best.kind !== 'none') return best;
    const a = this.hits.axis;
    if (a) {
      const vx = a.x2 - a.x1;
      const vy = a.y2 - a.y1;
      const l2 = vx * vx + vy * vy || 1;
      const t = clamp(((x - a.x1) * vx + (y - a.y1) * vy) / l2, 0, 1);
      if (Math.hypot(a.x1 + t * vx - x, a.y1 + t * vy - y) < 22) return { kind: 'year', year: Math.round(timeScale(this.st!.scale, this.st!.model.y1).y(t)) };
    }
    return best;
  }

  private setHover(p: Pick, x: number, y: number) {
    const same = JSON.stringify(p) === JSON.stringify(this.hover);
    this.hover = p;
    if (!same) this.redraw();
    if (!this.st || p.kind === 'none') return this.onHover(null, x, y);
    if (p.kind === 'person') {
      const per = this.st.model.persons.find((q) => q.key === p.key);
      return this.onHover(per ? `${this.st.name(per)}${p.year ? ` · ${p.year}` : ''}` : null, x, y);
    }
    if (p.kind === 'year') return this.onHover(String(p.year), x, y);
    this.onHover(null, x, y);
  }

  private down(e: PointerEvent) {
    this.canvas.setPointerCapture(e.pointerId);
    this.ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.moved = 0;
    this.anim = null;
    this.gesture = null;
  }
  private move(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    const prev = this.ptr.get(e.pointerId);
    if (!prev) {
      if (e.pointerType === 'mouse') this.setHover(this.pickAt(e.clientX - r.left, e.clientY - r.top), e.clientX - r.left, e.clientY - r.top);
      return;
    }
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    this.ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.moved += Math.abs(dx) + Math.abs(dy);
    if (this.ptr.size >= 2) {
      const [a, b] = [...this.ptr.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      if (this.gesture) {
        this.view.dist = clamp(this.view.dist * (this.gesture.d / d), 25, 900);
        this.pan(mx - this.gesture.mx, my - this.gesture.my);
      }
      this.gesture = { d, mx, my };
    } else if (e.shiftKey || e.buttons === 2 || e.buttons === 4) this.pan(dx, dy);
    else {
      this.view.yaw += dx * 0.008;
      this.view.pitch = clamp(this.view.pitch + dy * 0.008, -Math.PI / 2 + 0.001, Math.PI / 2 - 0.001);
    }
    this.setHover({ kind: 'none' }, 0, 0);
    this.redraw();
  }
  private up(e: PointerEvent, cancel = false) {
    const had = this.ptr.has(e.pointerId);
    const single = this.ptr.size === 1;
    this.ptr.delete(e.pointerId);
    if (this.ptr.size < 2) this.gesture = null;
    if (!had || cancel || !single || this.moved > 6) return;
    const r = this.canvas.getBoundingClientRect();
    this.onPick(this.pickAt(e.clientX - r.left, e.clientY - r.top));
  }
  private pan(dx: number, dy: number) {
    const v = this.view;
    const f = Math.min(this.w, this.h) * 1.15;
    const k = v.dist / f;
    const cy = Math.cos(v.yaw);
    const sy = Math.sin(v.yaw);
    const cp = Math.cos(v.pitch);
    const sp = Math.sin(v.pitch);
    // экран вправо = (cos yaw, 0, sin yaw), вверх = (sin yaw sin pitch, cos pitch, −cos yaw sin pitch)
    v.tx += -dx * k * cy + dy * k * sy * sp;
    v.ty += dy * k * cp;
    v.tz += -dx * k * sy - dy * k * cy * sp;
  }
  private wheel(e: WheelEvent) {
    e.preventDefault();
    this.anim = null;
    this.view.dist = clamp(this.view.dist * Math.exp(e.deltaY * (e.deltaMode ? 0.05 : 0.0015)), 25, 900);
    this.redraw();
  }
  zoom(k: number) {
    this.view.dist = clamp(this.view.dist * k, 25, 900);
    this.redraw();
  }
  private key(e: KeyboardEvent) {
    const v = this.view;
    const k = e.key;
    if (k === 'ArrowLeft') v.yaw -= 0.08;
    else if (k === 'ArrowRight') v.yaw += 0.08;
    else if (k === 'ArrowUp') v.pitch = clamp(v.pitch - 0.08, -Math.PI / 2 + 0.001, Math.PI / 2 - 0.001);
    else if (k === 'ArrowDown') v.pitch = clamp(v.pitch + 0.08, -Math.PI / 2 + 0.001, Math.PI / 2 - 0.001);
    else if (k === '+' || k === '=') v.dist = clamp(v.dist / 1.15, 25, 900);
    else if (k === '-' || k === '_') v.dist = clamp(v.dist * 1.15, 25, 900);
    else if (k === '[' || k === ']') {
      const y = this.st?.year ?? 2488;
      this.onPick({ kind: 'year', year: y + (k === ']' ? 1 : -1) });
    } else return;
    e.preventDefault();
    this.redraw();
  }
}
