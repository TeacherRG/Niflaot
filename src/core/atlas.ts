import { useSyncExternalStore } from 'react';
import { root } from './tanakh';
import { readHebrew } from './translit';

/**
 * «Кто и где» — люди и места отрывка дня Пророков и Писаний (scripts/fetch-atlas.py): окошко над именем в стихе (WordPop) и
 * блок под отрывком (TanakhAtlas). Всё — проекта: кто есть кто, семья и где места — src/tanakh/atlas/entities.json (по Раши,
 * Мецудат Давид, «Седер олам»; места — принятые в Израиле отождествления), справки — src/tanakh/atlas/<язык>.json; данные
 * дня — public/tanakh/atlas/<дата>.json (какое слово стиха кого называет — по разбору Open Scriptures).
 */
export type AtlasLang = 'ru' | 'en' | 'de';
export type AtlasKind = 'm' | 'f' | 'g' | 'p' | 'x';
export interface AtlasEntity {
  k: AtlasKind;
  he: string;
  fa?: string;
  mo?: string;
  sp?: string[];
  sib?: string[];
  ch?: string[];
  /** место: [широта, долгота]; насколько известно, где оно: 2 — известно, 1 — вероятно, 0 — предположительно */
  ll?: [number, number];
  sure?: 0 | 1 | 2;
  /** не точка, а область / река / море: радиус в км вокруг `ll` */
  a?: number;
}
export interface AtlasDay {
  /** «книга глава:стих» → {номер слова нашего текста: id} */
  v: Record<string, Record<string, string>>;
  o: { neviim: string[]; ketuvim: string[] };
  e: Record<string, AtlasEntity>;
}
/** справки проекта: имя и описание (у записей только для семьи и ориентиров — одно имя) */
export type AtlasTexts = Record<string, { n: string; d?: string }>;
export interface AtlasMap {
  bbox: [number, number, number, number];
  /** суша — многоугольники, обрезанные по окну карты */
  land: [number, number][][];
  lakes: [number, number][][];
  rivers: [number, number][][];
  /** ориентиры: [id, широта, долгота, иврит] */
  towns: [string, number, number, string][];
}

const json = <T>(path: string): Promise<T | null> =>
  fetch(`${root()}${path}`)
    .then((r) => (r.ok ? (r.json() as Promise<T>) : null))
    .catch(() => null);

// все справки, загруженные на этой странице: окошко над словом берёт их отсюда
const known = new Map<string, AtlasEntity>();
const subs = new Set<() => void>();
let version = 0;
const register = (d: AtlasDay) => {
  for (const [id, e] of Object.entries(d.e)) if (!known.has(id) || Object.keys(e).length > Object.keys(known.get(id)!).length) known.set(id, e);
  version++;
  subs.forEach((f) => f());
};
export const atlasEntity = (id: string) => known.get(id);
export const useAtlasVersion = () =>
  useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => version,
  );

const days = new Map<string, Promise<AtlasDay | null>>();
export function loadAtlasDay(date: string): Promise<AtlasDay | null> {
  let p = days.get(date);
  if (!p) {
    p = json<AtlasDay>(`tanakh/atlas/${date}.json`).then((d) => (d && register(d), d));
    days.set(date, p);
  }
  return p;
}

const texts = new Map<AtlasLang, Promise<AtlasTexts>>();
/** Справки проекта — отдельным куском кода, только на странице отрывка. */
export function loadAtlasTexts(lang: AtlasLang): Promise<AtlasTexts> {
  let p = texts.get(lang);
  if (!p) {
    p = import(`../tanakh/atlas/${lang}.json`).then((m) => m.default as AtlasTexts).catch(() => ({}));
    texts.set(lang, p);
  }
  return p;
}

let map: Promise<AtlasMap | null> | undefined;
export const loadAtlasMap = () => (map ??= json<AtlasMap>('tanakh/atlas/map.json'));

/** Имя на языке сайта: из справки проекта; нет — чтение иврита. */
export function atlasName(id: string, e: AtlasEntity | undefined, tx: AtlasTexts | null, lang: AtlasLang): string {
  const own = tx?.[id]?.n;
  if (own) return own;
  if (!e?.he) return '';
  const r = readHebrew(e.he, lang);
  return r.charAt(0).toUpperCase() + r.slice(1);
}

export const isPlace = (e: AtlasEntity) => e.k === 'p';

/** Насколько известно, где место (`sure` записи): 2 — известно, 1 — вероятно, 0 — предположительно. */
export const placeSure = (e: AtlasEntity): 0 | 1 | 2 => e.sure ?? 0;

/** Ссылка на место в OpenStreetMap (открывается в новой вкладке; на сайте карта — своя). */
export const osmLink = ([lat, lon]: [number, number]) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

/** Люди и места отрывка: сначала люди и народы, места — отдельно (у них есть точка на карте). */
export function sectionEntities(d: AtlasDay, section: 'neviim' | 'ketuvim') {
  const ids = d.o[section] ?? [];
  return {
    people: ids.filter((i) => d.e[i] && !isPlace(d.e[i])),
    places: ids.filter((i) => d.e[i] && isPlace(d.e[i])),
  };
}

/** Справочник `#/atlas`: все записи и где они в цикле (`all.json` — scripts/fetch-atlas.py build). */
export interface AtlasAll {
  e: Record<string, AtlasEntity>;
  /** id → [стихов в цикле, [[дата, раздел, «книга глава:стих»] — первый стих каждой главы]] */
  r: Record<string, [number, [string, 'neviim' | 'ketuvim', string][]]>;
}
let all: Promise<AtlasAll | null> | undefined;
export const loadAtlasAll = () => (all ??= json<AtlasAll>('tanakh/atlas/all.json'));

/** Хронология (src/tanakh/atlas/timeline.json) — годы от сотворения мира по «Седер олам». */
export interface TimelineEra {
  id: string;
  from: number;
  to: number;
  t: Record<AtlasLang, string>;
}
export interface TimelineEvent {
  y: number;
  y2?: number;
  /** «книга глава[:стих]» Пророков и Писаний — ссылка на стих; Тора — `src` текстом */
  ref?: string;
  src?: Record<AtlasLang, string>;
  who?: string[];
  t: Record<AtlasLang, string>;
  d: Record<AtlasLang, string>;
}
/** Цари: объединённого царства, Йеґуды и Израиля — по порядку; `r` — сколько правил, `ref` — стих начала царствования,
 * `y` — год воцарения от сотворения мира по «Седер ґа-дорот» (на основе «Седер олам») */
export interface TimelineKing {
  lane: 'united' | 'judah' | 'israel';
  era: string;
  he: string;
  t: Record<AtlasLang, string>;
  r: Record<AtlasLang, string>;
  ref: string;
  y: number;
  who?: string;
}
/** Пророки — по эпохам; `y` — год, когда начал пророчествовать (по «Седер ґа-дорот», иначе — год царя, при котором он
 * назван); `w` — при каких царях (по первому стиху книги или «Седер олам»), `ref` — стих */
export interface TimelineProphet {
  era: string;
  y: number;
  he: string;
  t: Record<AtlasLang, string>;
  w: Record<AtlasLang, string>;
  ref: string;
}
export interface Timeline {
  eras: TimelineEra[];
  events: TimelineEvent[];
  kings: TimelineKing[];
  prophets: TimelineProphet[];
}
let timeline: Promise<Timeline> | undefined;
export const loadTimeline = () => (timeline ??= import('../tanakh/atlas/timeline.json').then((m) => m.default as unknown as Timeline));

/** «2488» → «≈ 1273 до н. э.» (традиционный счёт: год от сотворения − 3760) */
export const bce = (y: number) => 3761 - y;

/** Для поиска: строчные, без огласовок и знаков, ё → е, ґ → г, конечные буквы иврита — как обычные */
export const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u0591-\u05c7]/g, (c) => (c === '\u05be' ? ' ' : ''))
    .replace(/[ךםןףץ]/g, (c) => 'כמנפצ'['ךםןףץ'.indexOf(c)])
    .replace(/ё/g, 'е')
    .replace(/ґ/g, 'г')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[״׳"'’«»()]/g, '');

/** иврит: без ו / י не в начале слова — полное и краткое написание совпадают (ירושלים = ירושלם, יהושוע = יהושע) */
const plene = (s: string) => s.replace(/(?<=[\u05d0-\u05ea])[וי]/g, '');
/** согласные остова имени: «грар» = «Герар», «Иегошуа» = «Йеґошуа», «Jehoschua» ≈ «Yehoshua» не обещаем */
const skeleton = (s: string) => s.replace(/[^\p{L}]/gu, '').replace(/[аеиоуыэюяйьъaeiouyäöü]/g, '');

/**
 * Насколько запись подходит к запросу: 0 — имя (на любом языке сайта) или иврит начинается с запроса, 1 — содержит его,
 * 2 — иврит без ו / י, 3 — слово из справки, 4 — совпали согласные имени (запрос без гласных или с другими: «грар» — Герар);
 * -1 — не подходит.
 */
export function atlasMatch(query: string, names: string[], he: string, text: string): number {
  const f = fold(query.trim()).replace(/\s+/g, ' ');
  if (!f) return 0;
  const ns = names.map(fold);
  const h = fold(he);
  if (ns.some((n) => n.startsWith(f)) || h.startsWith(f)) return 0;
  if (ns.some((n) => n.includes(f)) || h.includes(f)) return 1;
  if (/[\u05d0-\u05ea]/.test(f) && plene(h).includes(plene(f))) return 2;
  if (fold(text).includes(f)) return 3;
  const k = skeleton(f);
  if (f.length >= 3 && k.length >= 2 && ns.some((n) => skeleton(n).includes(k))) return 4;
  return -1;
}
