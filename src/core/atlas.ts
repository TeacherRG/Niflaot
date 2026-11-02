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
