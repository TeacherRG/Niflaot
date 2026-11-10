import type { AtlasEntity, AtlasLang, AtlasTexts, Timeline } from './atlas';
import type { AtlasKeys } from './atlasKeys';

/**
 * «Шана · Нефеш · Олам» в объёме (`#/atlas/3d`, Sno3DPage): три измерения «Сефер Ецира» — шана (время), нефеш (душа),
 * олам (пространство) — осями: X — год от сотворения мира, Y — место с юга на север (широта), Z — люди от Адама и дальше,
 * каждый на своей линии по порядку появления. Здесь — только модель (без рисования): кто где и когда.
 *
 * Данные — проекта: жизни праотцев и пророков до царей — src/tanakh/atlas/sno3d.json («Седер олам», Раши); цари и пророки —
 * хронология (timeline.json, «Седер ґа-дорот»); события — хронология и «Ключевые места» (keys.json); места и их точки —
 * справочник «Кто и где» (entities / all.json), места вне карты справочника — sno3d.json `places`. Ничего не придумывается:
 * где стих не говорит, где человек, — пунктир (`known: false`).
 */
export type Sno3DLang = AtlasLang;
type Txt = Record<AtlasLang, string>;

export interface SnoPlaceRaw {
  he?: string;
  ll: [number, number];
  sure?: 0 | 1 | 2;
  a?: number;
  t?: Txt;
}
export interface SnoLifeRaw {
  id: string;
  who?: string;
  he: string;
  t: Txt;
  from: number;
  to?: number;
  /** [год, место | null — с этого года место неизвестно]; годы не убывают; одинаковый год — переход */
  path: [number, string | null][];
  src: Txt;
  /** ref пророка хронологии — это тот же человек */
  prophet?: string;
}
export interface SnoData {
  places: Record<string, SnoPlaceRaw>;
  lives: SnoLifeRaw[];
  /** ref царя → столица (иначе — `seatDefault` по линии) */
  seats: Record<string, string>;
  seatDefault: Record<'united' | 'judah' | 'israel', string>;
  /** ref пророка → где пророчествовал; `approx` — место не названо, взята столица его царства */
  prophets: Record<string, { p: string; approx?: boolean }>;
}

export type PersonKind = 'life' | 'king-united' | 'king-judah' | 'king-israel' | 'prophet' | 'point';
/** отрезок жизни на одной широте */
export interface Stay {
  a: number;
  b: number;
  lat: number;
  place: string | null;
  known: boolean;
}
export interface SnoPerson {
  key: string;
  /** id записи «Кто и где» (справка) */
  atlas?: string;
  he: string;
  name: Txt | null;
  kind: PersonKind;
  lane: number;
  /** годы на оси (у пророка и человека из события — год первого упоминания) */
  from: number;
  to: number;
  /** годы известны (жизнь или царствование), иначе — только точка */
  span: boolean;
  stays: Stay[];
  /** годы царствования */
  reign?: [number, number];
  /** год, с которого пророчествует */
  prophetFrom?: number;
  approx?: boolean;
  src?: Txt;
  ref?: string;
  note?: Txt;
}
export interface SnoEvent {
  key: string;
  y: number;
  y2?: number;
  lat: number;
  lanes: number[];
  who: string[];
  where: string[];
  t: Txt;
  d: Txt;
  ref?: string;
  src?: Txt;
  kind: 'event' | 'key';
}
export interface SnoPlace {
  id: string;
  lat: number;
  lon: number;
  he: string;
  area: boolean;
}
export interface SnoModel {
  persons: SnoPerson[];
  events: SnoEvent[];
  places: Record<string, SnoPlace>;
  lanes: number;
  /** линия «народы и места» — события без людей */
  groupLane: number;
  y0: number;
  y1: number;
  lat0: number;
  lat1: number;
  eras: Timeline['eras'];
}

/** «40 years», «3 months», «7 days» → годы */
export function reignYears(en: string): number {
  const m = en.match(/^(\d+) (year|month|day)/);
  if (!m) return 0;
  const n = +m[1];
  return m[2] === 'year' ? n : m[2] === 'month' ? n / 12 : n / 365;
}

export function buildSnoModel(data: SnoData, tl: Timeline, keys: AtlasKeys, ents: Record<string, AtlasEntity>): SnoModel {
  const places: Record<string, SnoPlace> = {};
  for (const [id, e] of Object.entries(ents)) if (e.k === 'p' && e.ll) places[id] = { id, lat: e.ll[0], lon: e.ll[1], he: e.he, area: !!e.a };
  for (const [id, p] of Object.entries(data.places)) places[id] = { id, lat: p.ll[0], lon: p.ll[1], he: p.he ?? ents[id]?.he ?? '', area: !!p.a };
  const latOf = (id: string | null | undefined) => (id && places[id] ? places[id].lat : undefined);

  const persons: SnoPerson[] = [];
  const byAtlas = new Map<string, SnoPerson>();
  const add = (p: Omit<SnoPerson, 'lane'>) => {
    const q = { ...p, lane: 0 };
    persons.push(q);
    if (q.atlas) byAtlas.set(q.atlas, q);
    return q;
  };

  // жизни: путь ступенькой — человек в месте, пока стих не переводит его в другое
  const lifeByProphet = new Map<string, SnoPerson>();
  for (const l of data.lives) {
    const to = l.to ?? l.path.at(-1)![0];
    const firstLat = l.path.map(([, p]) => latOf(p)).find((x) => x !== undefined)!;
    const stays: Stay[] = [];
    let lat = firstLat;
    let place: string | null = null;
    let known = false;
    let a = l.from;
    l.path.forEach(([y, p], i) => {
      // одинаковый год у двух мест подряд — переход: прежнее место остаётся точкой (Харан → Шхем)
      if (y > a || (i && l.path[i - 1][0] === y && l.path[i - 1][1])) stays.push({ a, b: y, lat, place, known });
      a = Math.max(a, y);
      if (p) {
        lat = latOf(p)!;
        place = p;
        known = true;
      } else known = false;
    });
    if (to > a) stays.push({ a, b: to, lat, place, known });
    else stays.push({ a, b: a, lat, place, known });
    const q = add({ key: l.id, atlas: l.who, he: l.he, name: l.t, kind: 'life', from: l.from, to, span: true, stays, src: l.src });
    if (l.prophet) lifeByProphet.set(l.prophet, q);
  }

  // цари: столица на годы царствования; царь, у которого есть жизнь (Давид, Шломо), — на её линии
  for (const k of tl.kings) {
    const end = k.y + Math.max(reignYears(k.r.en), 0.25);
    const seat = data.seats[k.ref] ?? data.seatDefault[k.lane];
    const own = k.who ? byAtlas.get(k.who) : undefined;
    if (own) {
      own.reign = [k.y, end];
      own.ref = k.ref;
      continue;
    }
    add({
      key: `king:${k.ref}`,
      atlas: k.who,
      he: k.he,
      name: k.t,
      kind: `king-${k.lane}` as PersonKind,
      from: k.y,
      to: end,
      span: true,
      reign: [k.y, end],
      stays: [{ a: k.y, b: end, lat: latOf(seat)!, place: seat, known: true }],
      ref: k.ref,
      note: k.r,
    });
  }

  // пророки: точка — год, с которого пророчествует (сколько — в хронологии не сказано), в месте пророчества
  for (const p of tl.prophets) {
    const own = lifeByProphet.get(p.ref);
    if (own) {
      own.prophetFrom = p.y;
      continue;
    }
    const at = data.prophets[p.ref];
    if (!at) continue;
    add({
      key: `prophet:${p.ref}`,
      he: p.he,
      name: p.t,
      kind: 'prophet',
      from: p.y,
      to: p.y,
      span: false,
      prophetFrom: p.y,
      stays: [{ a: p.y, b: p.y, lat: latOf(at.p)!, place: at.p, known: !at.approx }],
      approx: at.approx,
      ref: p.ref,
      note: p.w,
    });
  }

  // события: хронология и «Ключевые места»
  const raw: Omit<SnoEvent, 'lat' | 'lanes'>[] = [];
  tl.events.forEach((e, i) => {
    const who = (e.who ?? []).filter((w) => ents[w]?.k !== 'p');
    const where = (e.who ?? []).filter((w) => ents[w]?.k === 'p');
    raw.push({ key: `ev:${i}`, y: e.y, y2: e.y2, who, where, t: e.t, d: e.d, ref: e.ref, src: e.src, kind: 'event' });
  });
  for (const [ref, k] of Object.entries(keys)) raw.push({ key: `key:${ref}`, y: k.y, y2: k.y2, who: k.who, where: k.where, t: k.t, d: k.d, ref, kind: 'key' });

  // люди из событий, у которых нет ни жизни, ни царствования: точка на своей линии
  for (const e of [...raw].sort((a, b) => a.y - b.y))
    for (const w of e.who) {
      const ent = ents[w];
      // сыновья Яакова и Йосефа в событиях после Египта — это колена, а не люди
      if (!ent || (ent.k !== 'm' && ent.k !== 'f') || byAtlas.has(w) || ent.fa === 'yisrael' || ent.fa === 'yosef') continue;
      add({ key: `p:${w}`, atlas: w, he: ent.he, name: null, kind: 'point', from: e.y, to: e.y, span: false, stays: [] });
    }

  // линии «нефеш» — по порядку появления, параллельными нитями: кто жил одновременно — на соседних линиях, линия
  // освобождается, когда человек ушёл; цари одного царства продолжают одну линию (дом Давида — от Шломо)
  persons.sort((a, b) => a.from - b.from || order(a.kind) - order(b.kind));
  const ends: number[] = [];
  const last: Partial<Record<PersonKind, number>> = {};
  const shlomo = byAtlas.get('shlomo');
  for (const p of persons) {
    const end = Math.max(p.to, p.from);
    const pref = last[p.kind];
    let lane = pref !== undefined && ends[pref] <= p.from + 1e-6 ? pref : -1;
    if (lane < 0) {
      lane = ends.findIndex((e) => e + 1 <= p.from);
      if (lane < 0) lane = ends.length;
    }
    p.lane = lane;
    ends[lane] = end;
    if (p.kind.startsWith('king')) last[p.kind] = lane;
    if (p === shlomo) last['king-judah'] = lane;
  }

  const events: SnoEvent[] = [];
  for (const e of raw) {
    // нить события — только к тем, кто жил в его год (Моше в «земля успокоилась» — уже нет)
    const ps = e.who.map((w) => byAtlas.get(w)).filter((p): p is SnoPerson => !!p && (!p.span || (e.y >= p.from - 1 && e.y <= p.to + 1)));
    const lat = e.where.map(latOf).find((x) => x !== undefined) ?? ps.map((p) => latAtYear(p, e.y)).find((x) => x !== undefined);
    if (lat === undefined) continue;
    events.push({ ...e, lat, lanes: ps.length ? ps.map((p) => p.lane) : [-1] });
  }
  // у человека-точки — место его событий
  for (const p of persons)
    if (p.kind === 'point') {
      const ev = events.find((e) => e.who.includes(p.atlas!));
      if (ev) p.stays = [{ a: p.from, b: p.from, lat: ev.lat, place: ev.where[0] ?? null, known: !!ev.where.length }];
    }

  const lats = [...persons.flatMap((p) => p.stays.map((s) => s.lat)), ...events.map((e) => e.lat)];
  return {
    persons,
    events,
    places,
    lanes: ends.length,
    groupLane: -1,
    y0: 0,
    y1: Math.max(tl.eras.at(-1)!.to, ...persons.map((p) => p.to)),
    lat0: Math.floor(Math.min(...lats) * 2) / 2,
    lat1: Math.ceil(Math.max(...lats) * 2) / 2,
    eras: tl.eras,
  };
}

const order = (k: PersonKind) => ['life', 'king-united', 'king-judah', 'king-israel', 'prophet', 'point'].indexOf(k);

/** Где человек в этот год (широта) — или undefined, если его в этот год на оси нет. */
export const latAtYear = (p: SnoPerson, y: number): number | undefined => stayAt(p, y)?.lat;
export function stayAt(p: SnoPerson, y: number): Stay | undefined {
  let found: Stay | undefined;
  for (const s of p.stays) if (y >= s.a && y <= s.b) found = s;
  return found;
}

/** Кто «относится» к году: живёт / правит в этот год; пророк и человек-точка — в пределах ± `win` лет. */
export function activeAt(m: SnoModel, y: number, win: number) {
  const persons = m.persons.filter((p) => (p.span ? y >= p.from - 1e-6 && y <= p.to + 1e-6 : Math.abs(p.from - y) <= win));
  const events = m.events.filter((e) => (e.y2 ? y >= e.y - win && y <= e.y2 + win : Math.abs(e.y - y) <= win));
  const placeIds = new Set<string>();
  for (const p of persons) {
    const s = p.span ? stayAt(p, y) : p.stays[0];
    if (s?.place && s.known) placeIds.add(s.place);
  }
  for (const e of events) e.where.forEach((w) => m.places[w] && placeIds.add(w));
  return { persons, events, places: [...placeIds].map((id) => m.places[id]).sort((a, b) => a.lat - b.lat) };
}

/**
 * Шкала времени: «по эпохам» — у каждой полосы (от Адама до Авраґама, праотцы, от Исхода до царей, цари, изгнание и
 * Второй Храм) одинаковая ширина: иначе две тысячи лет до Авраґама сжали бы царей в черту; «ровно» — год = год.
 */
export const BANDS = [0, 1948, 2448, 2884, 3338, 3450];
export function timeScale(mode: 'eras' | 'linear', y1: number) {
  const end = Math.max(y1, BANDS.at(-1)!);
  if (mode === 'linear') return { x: (y: number) => y / end, y: (x: number) => x * end };
  const bands = [...BANDS.slice(0, -1), end];
  const n = bands.length - 1;
  const x = (y: number) => {
    for (let i = 0; i < n; i++) if (y <= bands[i + 1]) return (i + (y - bands[i]) / (bands[i + 1] - bands[i])) / n;
    return 1;
  };
  const inv = (t: number) => {
    const k = Math.min(n - 1, Math.max(0, Math.floor(t * n)));
    return bands[k] + (t * n - k) * (bands[k + 1] - bands[k]);
  };
  return { x, y: inv };
}

/** Имя человека на языке сайта: справка «Кто и где», иначе — своё. */
export function personName(p: SnoPerson, tx: AtlasTexts | null, lang: AtlasLang): string {
  return (p.atlas && tx?.[p.atlas]?.n) || p.name?.[lang] || p.he;
}
export function placeName(id: string, data: SnoData, tx: AtlasTexts | null, lang: AtlasLang): string {
  return tx?.[id]?.n || data.places[id]?.t?.[lang] || id;
}
