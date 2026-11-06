/**
 * «Пророки» и «Писания» на сайте: расписание цикла (src/tanakh/cycle.json) и тексты дня (/tanakh/<дата>.json —
 * пишет scripts/fetch-tanakh.py). Загружается только там, где нужно (страница раздела, плитки главной).
 */
import cycleJson from '../tanakh/cycle.json';
import { oneYearCycle, type CycleDay, type Section } from './tanakhCycle';
import type { CourseChoice } from './courses';

export const CYCLE: CycleDay[] = (cycleJson.days as [string, number, number, number, number][]).map(([date, na, nz, ka, kz]) => ({
  date,
  neviim: [na, nz],
  ketuvim: [ka, kz],
}));

export interface ReadingPlan {
  id: string;
  days: CycleDay[];
  annual: boolean;
}

const plans = new Map<string, ReadingPlan>();
const THREE_YEAR_PLAN: ReadingPlan = { id: 'three-year', days: CYCLE, annual: false };
export function readingPlan(choice?: CourseChoice): ReadingPlan {
  if (choice?.pace !== 'own' || choice.years !== 1) return THREE_YEAR_PLAN;
  const raw = choice.startDate ?? '';
  const parsed = new Date(`${raw}T12:00:00Z`);
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(raw) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === raw;
  const start = valid ? raw : localToday();
  let plan = plans.get(start);
  if (!plan) {
    plan = { id: `one-year:${start}`, days: oneYearCycle(start), annual: true };
    plans.set(start, plan);
  }
  return plan;
}

/** Сегодня по часам устройства, `YYYY-MM-DD`. */
export const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * День цикла для даты: сам этот день, а если в эту дату чтения нет (Шабат, праздник) или цикл ещё не начался —
 * ближайший следующий; после конца цикла — последний.
 */
export function cycleDayFor(iso: string, cycle: CycleDay[] = CYCLE): { index: number; exact: boolean } {
  const i = cycle.findIndex((d) => d.date >= iso);
  if (i < 0) return { index: cycle.length - 1, exact: false };
  return { index: i, exact: cycle[i].date === iso };
}

/**
 * Комментарий к стиху: несколько коротких комментариев, в начале каждого — слова стиха (<b>).
 * he — оригинал (Public Domain); en — английский (Раши — Metsudah / Judaica Press, CC-BY; Мецудат Давид — перевод проекта);
 * ru, de — переводы проекта (src/tanakh/<язык>/<книга>.json).
 */
export type Commentary = { he?: string[]; en?: string[]; ru?: string[]; de?: string[] };
export interface DayVerse {
  b: string;
  c: number;
  v: number;
  /** стих (масоретский текст с огласовками) */
  he: string;
  /** английский перевод */
  en: string;
  /** перевод взят из другого издания (где в основном стиха нет) */
  enFrom?: string;
  /** переводы проекта: русский (src/tanakh/ru/<книга>.json) и немецкий (src/tanakh/de/<книга>.json) */
  ru?: string;
  de?: string;
  /** Мецудат Давид — простое объяснение стиха */
  md?: Commentary;
  /** Раши */
  rashi?: Commentary;
}
interface Version {
  title?: string;
  license?: string;
  source?: string;
}
export interface SectionDay {
  refs: { b: string; from: [number, number]; to: [number, number]; url: string }[];
  verses: DayVerse[];
  versions: { he?: Version; en?: Version; md?: Version; rashi?: Version; rashiEn?: Version };
}
export type DayContent = { date: string; day: number; days: number } & Record<Section, SectionDay>;

const cache = new Map<string, Promise<DayContent | null>>();
/**
 * The site's root for /tanakh/<date>.json. The build uses relative paths (base './'), so on a static page such as
 * /neviim/ or /en/ketuvim/ a relative fetch would miss; the code itself lives in /assets/, one level below the root.
 * (`up` is a variable so that Vite doesn't treat the URL as an asset to bundle.)
 */
const up = '..';
// computed on first use: outside Vite (node scripts that import this module) there is no import.meta.env
export const root = () => (import.meta.env.DEV ? import.meta.env.BASE_URL : new URL(up, import.meta.url).href);
/**
 * Тексты дня; null — этот день ещё не подготовлен (404) или не загрузился. Сохраняется только ответ сервера
 * «есть» / «нет такого дня»: сбой сети или ошибка сервера из кэша уходит, и следующий вызов загружает день заново.
 */
function rawDay(date: string): Promise<DayContent | null> {
  const key = `source:${date}`;
  let p = cache.get(key);
  if (!p) {
    const again = () => (cache.delete(key), null);
    p = fetch(`${root()}tanakh/${date}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<DayContent>) : r.status === 404 ? null : again()))
      .catch(again);
    cache.set(key, p);
  }
  return p;
}

/** Собирает расширенный личный отрывок из соответствующих стихов трёхлетнего календаря. */
async function annualDay(date: string, plan: ReadingPlan): Promise<DayContent | null> {
  const ix = plan.days.findIndex((d) => d.date === date);
  if (ix < 0) return null;
  const target = plan.days[ix];
  const sources = CYCLE.filter((d) => (['neviim', 'ketuvim'] as const).some((s) => d[s][0] < target[s][1] && d[s][1] > target[s][0]));
  const loaded = await Promise.all(sources.map((d) => rawDay(d.date)));
  if (loaded.some((d) => !d)) return null;
  const section = (s: Section): SectionDay => {
    const verses: DayVerse[] = [];
    const refs: SectionDay['refs'] = [];
    let versions: SectionDay['versions'] | undefined;
    sources.forEach((source, i) => {
      const [a, z] = source[s];
      const [from, to] = target[s];
      const start = Math.max(a, from);
      const end = Math.min(z, to);
      if (start >= end) return;
      const part = loaded[i]![s];
      verses.push(...part.verses.slice(start - a, end - a));
      refs.push(...part.refs);
      versions ??= part.versions;
    });
    const uniqueRefs = [...new Map(refs.map((r) => [r.url, r])).values()];
    return { refs: uniqueRefs, verses, versions: versions ?? {} };
  };
  return { date, day: ix + 1, days: plan.days.length, neviim: section('neviim'), ketuvim: section('ketuvim') };
}

/** Тексты дня; годовой план собирает равномерно распределённый диапазон из готовых стихов цикла. */
export function loadDay(date: string, plan: ReadingPlan = THREE_YEAR_PLAN): Promise<DayContent | null> {
  if (!plan.annual) return rawDay(date);
  const key = `${plan.id}:${date}`;
  let p = cache.get(key);
  if (!p) {
    const again = () => (cache.delete(key), null);
    p = annualDay(date, plan).then((d) => d ?? again()).catch(again);
    cache.set(key, p);
  }
  return p;
}

/**
 * About how long the passage takes to read in the chosen view: the vocalized Hebrew read aloud — ~100 words a minute,
 * the translation and the commentaries — ~180 words a minute. Rounded up, at least a minute. A commentary is read in the
 * chosen translation where it has one, otherwise in Hebrew (when the Hebrew is shown).
 */
const HE_WPM = 100;
const TR_WPM = 180;
const words = (s?: string | string[]) => (s ? [s].flat().join(' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 0);
/** язык перевода на странице: английский или перевод проекта */
export type Tr = 'en' | 'ru' | 'de';
export function readingMinutes(verses: DayVerse[], he: boolean, tr: Tr | null, comm: { md: boolean; rashi: boolean }): number {
  let heW = 0;
  let trW = 0;
  for (const v of verses) {
    if (he) heW += words(v.he);
    if (tr) trW += words(v[tr]);
    for (const c of [comm.md && v.md, comm.rashi && v.rashi]) {
      if (!c) continue;
      if (he) heW += words(c.he);
      if (tr) trW += words(c[tr]);
    }
  }
  return Math.max(1, Math.ceil(heW / HE_WPM + trW / TR_WPM));
}
