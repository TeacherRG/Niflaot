import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { PARSHIOT } from '../lessons';
import { atlasName, loadAtlasTexts, type AtlasDay, type AtlasLang, type AtlasTexts } from '../core/atlas';
import type { AtlasKeys } from '../core/atlasKeys';
import { gemLine, gemThought, sameNumber, type EqFact } from '../core/turimGems';

/**
 * Общий граф отрывка — внизу страницы дня (владелец, 10.11.2026: «общий граф отрывка поставить внизу с теми же маячками»).
 * Невиим (`VersesGraph`): стихи по порядку, сверху люди, снизу места и народы («Кто и где»), у стиха ключевого места — тот же
 * маячок `.tk-beacon[data-k]` (KeyPop). Бааль ґа-Турим (`GemGraph`): числа дня — узлы, над ними равенства дня с мыслью и
 * маячком `[data-g]` (GemPop), под ними то же число в других главах. SVG в натуральную величину, на телефоне — прокрутка вбок.
 */

/** ширина подписи — примерно, по числу знаков (иврит шире) */
const textW = (s: string, fs: number) => [...s].reduce((a, c) => a + (/[א-ת]/.test(c) ? fs * 0.62 : /[֑-ׇ]/.test(c) ? 0 : fs * 0.56), 0);
/** перенос по словам — не длиннее `max` знаков в строке, не больше `lines` строк */
function wrap(s: string, max: number, lines: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) {
    if (cur && (cur + ' ' + w).length > max) {
      out.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) out.push(cur);
  if (out.length > lines) {
    out.length = lines;
    out[lines - 1] = out[lines - 1].replace(/[\s,.;:—–]*$/, '') + '…';
  }
  return out;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
const overlaps = (a: Box, b: Box) => Math.abs(a.x - b.x) * 2 < a.w + b.w + 8 && Math.abs(a.y - b.y) * 2 < a.h + b.h + 6;
const curve = (x1: number, y1: number, x2: number, y2: number) => `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;

/** маячок внутри SVG — тот же класс и данные, что у кнопки в тексте (KeyPop / GemPop слушают страницу) */
function SvgBeacon({ x, y, k, g, label }: { x: number; y: number; k?: string; g?: string; label: string }) {
  return (
    <g className="tk-beacon gr-beacon" data-k={k} data-g={g} role="button" tabIndex={0} aria-label={label}>
      <title>{label}</title>
      <circle className="gr-beacon-ring" cx={x} cy={y} r={9} />
      <circle className="gr-beacon-dot" cx={x} cy={y} r={6} />
    </g>
  );
}

function Frame({ title, lead, w, h, label, focus, children }: { title: string; lead: string; w: number; h: number; label: string; focus?: number; children: ReactNode }) {
  // на узком экране — сразу к маячку
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (el && focus !== undefined && el.scrollWidth > el.clientWidth) el.scrollLeft = Math.max(0, focus - el.clientWidth / 2);
  }, [focus, w]);
  return (
    <section className="gr no-print">
      <h2 className="gr-h">{title}</h2>
      <p className="gr-lead">
        <span className="kp-dot" aria-hidden="true" /> {lead}
      </p>
      <div className="gr-scroll" ref={box}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
          {children}
        </svg>
      </div>
    </section>
  );
}

/** «Кто и где» отрывка Невиим графом: стихи — ось, люди — сверху, места и народы — снизу; маячок ключевого места */
export function VersesGraph({ verses, atlas, keys }: { verses: { b: string; c: number; v: number }[]; atlas: AtlasDay | null; keys: AtlasKeys | null }) {
  const { t, locale } = useI18n();
  const lang: AtlasLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [tx, setTx] = useState<AtlasTexts | null>(null);
  useEffect(() => {
    let live = true;
    loadAtlasTexts(lang).then((x) => live && setTx(x));
    return () => {
      live = false;
    };
  }, [lang]);

  const g = useMemo(() => {
    if (!atlas) return null;
    const refs = verses.map((v) => `${v.b} ${v.c}:${v.v}`).filter((r) => atlas.v[r] || keys?.[r]);
    const ids = new Map<string, string[]>(); // id → refs
    for (const r of refs) for (const id of new Set(Object.values(atlas.v[r] ?? {}))) ids.set(id, [...(ids.get(id) ?? []), r]);
    if (ids.size < 3) return null;
    const DX = 104;
    const X = new Map(refs.map((r, i) => [r, 70 + i * DX]));
    const name = (id: string) => atlasName(id, atlas.e[id], tx, lang);
    const up = [...ids].filter(([id]) => 'mf'.includes(atlas.e[id]?.k ?? 'p'));
    const down = [...ids].filter(([id]) => !'mf'.includes(atlas.e[id]?.k ?? 'p'));
    // люди: один ряд над стихами (владелец, 10.11.2026: «Исраэль между Моше и Йеґошуа — визуально неправильно»), каждый — над
    // средним своих стихов, по порядку; налегает на соседа — сдвигается вправо
    const nodes: { id: string; k: string; label: string; box: Box; refs: string[] }[] = [];
    const spine = 30 + 30 + 70;
    let right = 12;
    const ups = up.map(([id, rs]) => ({ id, rs, x: rs.reduce((a, r) => a + X.get(r)!, 0) / rs.length })).sort((a, b) => a.x - b.x);
    // равномерно по ширине отрывка (иначе все, кто есть почти во всех стихах, сбиваются к середине)
    const x0 = X.get(refs[0])!;
    const x1 = X.get(refs[refs.length - 1])!;
    for (const [i, p] of ups.entries()) {
      // «Исраэль» в книгах Пророков — народ: так и подписан
      const label = p.id === 'yisrael' ? t('graph.israel') : name(p.id);
      const w = textW(label, 13) + 22;
      const even = ups.length > 1 ? x0 + ((x1 - x0) * (i + 0.5)) / ups.length : p.x;
      const x = Math.max((even + p.x) / 2, right + w / 2);
      right = x + w / 2 + 12;
      nodes.push({ id: p.id, k: p.id === 'yisrael' ? 'g' : (atlas.e[p.id]?.k ?? 'm'), label, box: { x, y: 30, w, h: 30 }, refs: p.rs });
    }
    const placed: Box[] = [];
    // места и народы: под своим первым стихом, вниз — пока не перестанут налегать
    for (const [id, rs] of down) {
      const label = name(id);
      const box = { x: X.get(rs[0])!, y: spine + 64, w: textW(label, 12.5) + 20, h: 26 };
      while (placed.some((o) => overlaps(o, box))) box.y += 32;
      placed.push(box);
      nodes.push({ id, k: atlas.e[id]?.k ?? 'p', label, box, refs: rs });
    }
    const width = Math.max(...nodes.map((n) => n.box.x + n.box.w / 2), 70 + (refs.length - 1) * DX + 40) + 24;
    const height = Math.max(...nodes.map((n) => n.box.y + n.box.h / 2)) + 20;
    // ключевые места отрывка — у каждого свой маячок
    const keyRefs = new Set(refs.filter((r) => keys?.[r]));
    return { refs, X, nodes, spine, width, height, keyRefs };
  }, [atlas, keys, verses, tx, lang, t]);

  if (!g) return null;
  return (
    <Frame title={t('graph.title')} lead={t('graph.lead')} w={g.width} h={g.height} label={t('graph.title')} focus={g.keyRefs.size ? g.X.get([...g.keyRefs][0]) : undefined}>
      {g.nodes.flatMap((n) =>
        n.refs.map((r) => {
          const x = g.X.get(r)!;
          const above = n.box.y < g.spine;
          return <path key={`${n.id}-${r}`} className="gr-edge" d={above ? curve(n.box.x, n.box.y + n.box.h / 2, x, g.spine - 13) : curve(x, g.spine + 13, n.box.x, n.box.y - n.box.h / 2)} />;
        }),
      )}
      {g.refs.map((r) => {
        const x = g.X.get(r)!;
        const label = r.split(' ')[1];
        const isKey = g.keyRefs.has(r);
        return (
          <g key={r}>
            <a href={`#v-${r.replace(/[ :]/g, '-')}`} className="gr-link" onClick={(e) => (e.preventDefault(), document.getElementById(`v-${r.replace(/[ :]/g, '-')}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }))}>
              <rect className={isKey ? 'gr-verse is-key' : 'gr-verse'} x={x - 30} y={g.spine - 13} width={60} height={26} rx={13} />
              <text className="gr-t num" x={x} y={g.spine} textAnchor="middle" dominantBaseline="central">
                {label}
              </text>
            </a>
            {isKey && <SvgBeacon x={x + 38} y={g.spine} k={r} label={`${t('keys.title')}: ${keys![r].t[lang]}`} />}
          </g>
        );
      })}
      {g.nodes.map((n) => {
        const cls = `gr-node k-${n.k}`;
        const body = (
          <>
            <rect className={cls} x={n.box.x - n.box.w / 2} y={n.box.y - n.box.h / 2} width={n.box.w} height={n.box.h} rx={8} />
            <text className="gr-t" x={n.box.x} y={n.box.y} textAnchor="middle" dominantBaseline="central" fontSize={n.box.h > 28 ? 13 : 12.5} fontWeight={n.box.h > 28 ? 600 : 400}>
              {n.label}
            </text>
          </>
        );
        return tx?.[n.id]?.d ? (
          <a key={n.id} href={`#/atlas/${n.id}`} className="gr-link">
            {body}
          </a>
        ) : (
          <g key={n.id}>{body}</g>
        );
      })}
    </Frame>
  );
}

/** гематрии дня Бааль ґа-Турима графом: число — узел, сверху равенства дня (мысль, маячок), снизу то же число в других главах */
export function GemGraph({ facts }: { facts: EqFact[] }) {
  const { t, locale } = useI18n();
  const g = useMemo(() => {
    if (!facts.length) return null;
    const text = (f: EqFact) => f.lesson.texts[locale] ?? f.lesson.texts.ru;
    const parsha = (f: EqFact) => {
      const p = PARSHIOT[f.lesson.parsha];
      return p ? ((p.name as Record<string, string>)[locale] ?? p.name.ru) : '';
    };
    const nums = [...new Set(facts.map((f) => f.v))];
    const card = (f: EqFact, own: boolean) => {
      const eq = gemLine(f);
      const th = wrap(gemThought(f, text(f)), own ? 34 : 30, 2);
      const sub = own ? th : [parsha(f), ...th].slice(0, 3);
      const w = Math.max(textW(eq, own ? 16 : 14), ...sub.map((s) => textW(s, 12))) + 28;
      return { f, eq, sub, w, h: 30 + sub.length * 16, own };
    };
    const cols = nums.map((v) => {
      const own = facts.filter((f) => f.v === v).map((f) => card(f, true));
      const ids = new Set(facts.map((f) => f.id));
      const others = sameNumber(own[0].f)
        .filter((o) => !ids.has(o.id))
        .slice(0, 3)
        .map((o) => card(o, false));
      const w = Math.max(...[...own, ...others].map((c) => c.w), 120) + 24;
      return { v, own, others, w };
    });
    let x = 12;
    const ownH = Math.max(...cols.map((c) => c.own.reduce((a, o) => a + o.h + 10, 0)));
    const hubY = 16 + ownH + 34;
    const placed = cols.map((c) => {
      const cx = x + c.w / 2;
      x += c.w + 16;
      let y = 16;
      const own = c.own.map((o) => ({ ...o, x: cx, y: (y += o.h + 10) - o.h / 2 - 10 }));
      let yb = hubY + 44;
      const others = c.others.map((o) => ({ ...o, x: cx, y: (yb += o.h + 10) - o.h / 2 - 10 }));
      return { ...c, cx, own, others };
    });
    const height = Math.max(hubY + 40, ...placed.flatMap((c) => c.others.map((o) => o.y + o.h / 2))) + 16;
    return { placed, hubY, width: x, height };
  }, [facts, locale]);

  if (!g) return null;
  const Card = ({ c }: { c: { f: EqFact; eq: string; sub: string[]; w: number; h: number; own: boolean; x: number; y: number } }) => {
    const top = c.y - c.h / 2;
    const inner = (
      <>
        <rect className={c.own ? 'gr-node gem own' : 'gr-node gem'} x={c.x - c.w / 2} y={top} width={c.w} height={c.h} rx={9} />
        <text className="gr-t gr-he" x={c.x} y={top + 18} textAnchor="middle" dominantBaseline="central" fontSize={c.own ? 16 : 14} direction="rtl">
          {c.eq}
        </text>
        {c.sub.map((s, i) => (
          <text key={i} className="gr-t gr-sub" x={c.x} y={top + 38 + i * 16} textAnchor="middle" dominantBaseline="central" fontSize={12}>
            {s}
          </text>
        ))}
      </>
    );
    return c.own ? (
      <g className="gr-gem" data-g={c.f.id}>
        {inner}
        <SvgBeacon x={c.x - c.w / 2 - 2} y={top + 2} g={c.f.id} label={`${t('gem.title')}: ${c.f.q} = ${c.f.v}`} />
      </g>
    ) : (
      <a href={`#/facts/${c.f.id}`} className="gr-link">
        {inner}
      </a>
    );
  };
  return (
    <Frame title={t('graph.gemTitle')} lead={t('graph.gemLead')} w={g.width} h={g.height} label={t('graph.gemTitle')}>
      {g.placed.flatMap((c) => [
        ...c.own.map((o) => <path key={`e${o.f.id}`} className="gr-edge" d={curve(o.x, o.y + o.h / 2, c.cx, g.hubY - 16)} />),
        ...c.others.map((o) => <path key={`e${o.f.id}`} className="gr-edge" d={curve(c.cx, g.hubY + 16, o.x, o.y - o.h / 2)} />),
      ])}
      {g.placed.map((c) => (
        <g key={c.v}>
          <rect className="gr-hub" x={c.cx - 30} y={g.hubY - 16} width={60} height={32} rx={16} />
          <text className="gr-t num" x={c.cx} y={g.hubY} textAnchor="middle" dominantBaseline="central" fontSize={17} fontWeight={700}>
            {c.v}
          </text>
          {c.others.length > 0 && (
            <text className="gr-t gr-sub" x={c.cx} y={g.hubY + 30} textAnchor="middle" dominantBaseline="central" fontSize={11.5}>
              {t('graph.sameNumber')}
            </text>
          )}
          {c.own.map((o) => (
            <Card key={o.f.id} c={o} />
          ))}
          {c.others.map((o) => (
            <Card key={o.f.id} c={o} />
          ))}
        </g>
      ))}
    </Frame>
  );
}
