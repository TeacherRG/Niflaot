import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { atlasName, loadAtlasMap, loadAtlasTexts, type AtlasLang, type AtlasMap as MapData, type AtlasTexts } from '../core/atlas';

export interface MapPoint {
  id: string;
  ll: [number, number];
  label: string;
  /** номер на кружке (блок «Кто и где»); без номера — точка */
  n?: number;
}

const KM = [1, 2, 5, 10, 20, 50, 100, 200];
type Box = [number, number, number, number];

/**
 * Своя карта Земли Израиля на SVG: суша, озёра и реки (Natural Earth, PD), места отрывка (точки — проекта,
 * src/tanakh/atlas/entities.json) и серым — известные города рядом
 * для ориентира (Йерушалаим, Йерихо…). Без чужих тайлов — работает офлайн, печатается и никого не отслеживает. Окно — по
 * местам, с запасом (одно место — с окрестностями ~30 км); масштаб 1:1 с экраном (подписи — настоящего размера и на телефоне).
 */
export function AtlasMap({ points, ratio, label }: { points: MapPoint[]; ratio?: number; label: string }) {
  const { t, locale } = useI18n();
  const lang: AtlasLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [data, setData] = useState<MapData | null>(null);
  const [tx, setTx] = useState<AtlasTexts | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(360);
  useEffect(() => {
    let live = true;
    loadAtlasMap().then((m) => live && setData(m));
    loadAtlasTexts(lang).then((x) => live && setTx(x));
    return () => {
      live = false;
    };
  }, [lang]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => el.clientWidth && setW(Math.round(el.clientWidth));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // высота — по тому, как лежат места: длинный список с севера на юг (цари гл. 12) — карта выше
  const auto = useMemo(() => {
    const lats = points.map((p) => p.ll[0]);
    const lons = points.map((p) => p.ll[1]);
    const k = Math.cos((((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI) / 180);
    const dy = Math.max(...lats) - Math.min(...lats);
    const dx = (Math.max(...lons) - Math.min(...lons)) * k;
    return Math.min(1.5, Math.max(0.6, (dy + 0.05) / (dx + 0.05)));
  }, [points]);
  const H = Math.round(W * (ratio ?? auto));

  const view = useMemo(() => {
    const lats = points.map((p) => p.ll[0]);
    const lons = points.map((p) => p.ll[1]);
    const mid = (Math.min(...lats) + Math.max(...lats)) / 2;
    const k = Math.cos((mid * Math.PI) / 180);
    // одно место — с окрестностями (~30 км); несколько — крупнее, чтобы близкие города (2–4 км) не слились
    const min = points.length > 1 ? 0.09 : 0.3;
    const cx = ((Math.min(...lons) + Math.max(...lons)) / 2) * k;
    const cy = (Math.min(...lats) + Math.max(...lats)) / 2;
    let sx = Math.max((Math.max(...lons) - Math.min(...lons)) * k, min) * 1.5;
    let sy = Math.max(Math.max(...lats) - Math.min(...lats), min) * 1.5;
    if (sx / sy > W / H) sy = (sx * H) / W;
    else sx = (sy * W) / H;
    const [x0, y1] = [cx - sx / 2, cy + sy / 2];
    const s = W / sx;
    const px = (lon: number) => (lon * k - x0) * s;
    const py = (lat: number) => (y1 - lat) * s;
    const km = s / 111; // пикселей в километре
    const bar = KM.find((d) => d * km >= 50) ?? 200;
    return { px, py, km, bar };
  }, [points, W, H]);

  // подписи: справа от точки, если занято — слева, выше или ниже; ориентир без места для подписи не показываем
  const placed = useMemo(() => {
    const boxes: Box[] = [];
    const hit = (b: Box) => boxes.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
    const place = (x: number, y: number, text: string, r: number, size: number, force: boolean) => {
      const w = text.length * size * 0.56 + 4;
      const tries: [number, number, 'start' | 'end' | 'middle'][] = [
        [x + r + 3, y + size * 0.35, 'start'],
        [x - r - 3, y + size * 0.35, 'end'],
        [x, y - r - 4, 'middle'],
        [x, y + r + size, 'middle'],
      ];
      for (const [tx_, ty, a] of tries) {
        const bx = a === 'start' ? tx_ : a === 'end' ? tx_ - w : tx_ - w / 2;
        const b: Box = [bx, ty - size, bx + w, ty + 3];
        if (!hit(b) && bx > 2 && bx + w < W - 2 && ty - size > 2 && ty < H - 24) {
          boxes.push(b);
          return { tx: tx_, ty, a };
        }
      }
      return force ? { tx: tries[0][0], ty: tries[0][1], a: tries[0][2] } : null;
    };
    // сначала точки отрывка (их кружки — тоже занятое место), потом ориентиры
    const pts = points.map((p) => {
      const x = view.px(p.ll[1]);
      const y = view.py(p.ll[0]);
      const r = p.n ? 12 : 7;
      boxes.push([x - r, y - r, x + r, y + r]);
      return { p, x, y, r };
    });
    // много мест — подпись, только где есть место (номер на кружке и список под картой всё равно скажут, что это)
    const many = points.length > 8;
    const main = pts.map(({ p, x, y, r }) => ({ p, x, y, r, lb: place(x, y, p.label, r, many ? 12 : 14, !many) }));
    const ids = new Set(points.map((p) => p.id));
    const towns = (data?.towns ?? [])
      .filter(([id]) => !ids.has(id))
      .map(([id, lat, lon, he]) => ({ id, x: view.px(lon), y: view.py(lat), name: atlasName(id, { k: 'p', he }, tx, lang) }))
      .filter(({ x, y }) => x > 8 && x < W - 8 && y > 8 && y < H - 28)
      .slice(0, 8)
      .map((tw) => {
        const lb = place(tw.x, tw.y, tw.name, 4, 12, false);
        if (lb) boxes.push([tw.x - 4, tw.y - 4, tw.x + 4, tw.y + 4]);
        return { ...tw, lb };
      })
      .filter((tw) => tw.lb);
    return { main, towns };
  }, [points, view, data, tx, lang, W, H]);

  const path = (pts: [number, number][], close: boolean) =>
    pts.map(([lon, lat], i) => `${i ? 'L' : 'M'}${view.px(lon).toFixed(1)} ${view.py(lat).toFixed(1)}`).join('') + (close ? 'Z' : '');

  return (
    <div ref={ref} className="am-box">
      <svg className="am" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <rect className="am-sea" width={W} height={H} />
        {data?.land.map((l, i) => <path key={i} className="am-land" d={path(l, true)} />)}
        {data?.lakes.map((l, i) => <path key={i} className="am-lake" d={path(l, true)} />)}
        {data?.rivers.map((l, i) => <path key={i} className="am-river" d={path(l, false)} />)}
        {placed.towns.map(({ id, x, y, name, lb }) => (
          <g key={id} className="am-pt dim">
            <circle cx={x} cy={y} r={3.5} />
            <text x={lb!.tx} y={lb!.ty} textAnchor={lb!.a} className="am-lb">
              {name}
            </text>
          </g>
        ))}
        {placed.main.map(({ p, x, y, lb }) => (
          <g key={p.id} className="am-pt">
            {p.n ? (
              <>
                <circle cx={x} cy={y} r={11} />
                <text x={x} y={y + 4.5} textAnchor="middle" className="am-n">
                  {p.n}
                </text>
              </>
            ) : (
              <circle cx={x} cy={y} r={7} />
            )}
            {lb && (
              <text x={lb.tx} y={lb.ty} textAnchor={lb.a} className={points.length > 8 ? 'am-lb sm' : 'am-lb'}>
                {p.label}
              </text>
            )}
          </g>
        ))}
        <g className="am-scale" transform={`translate(12 ${H - 12})`}>
          <path d={`M0 0H${(view.bar * view.km).toFixed(1)}`} />
          <text x={view.bar * view.km + 6} y={4}>
            {t('atlas.km', { n: view.bar })}
          </text>
        </g>
      </svg>
    </div>
  );
}
