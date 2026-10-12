/**
 * «Пророки» и «Писания» на сайте: расписание цикла (src/tanakh/cycle.json) и тексты дня (/tanakh/<дата>.json —
 * пишет scripts/fetch-tanakh.py). Загружается только там, где нужно (страница раздела, плитки главной).
 */
import cycleJson from '../tanakh/cycle.json';
import type { CycleDay, Section } from './tanakhCycle';

export const CYCLE: CycleDay[] = (cycleJson.days as [string, number, number, number, number][]).map(([date, na, nz, ka, kz]) => ({
  date,
  neviim: [na, nz],
  ketuvim: [ka, kz],
}));

/** Сегодня по часам устройства, `YYYY-MM-DD`. */
export const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * День цикла для даты: сам этот день, а если в эту дату чтения нет (Шабат, праздник) или цикл ещё не начался —
 * ближайший следующий; после конца цикла — последний.
 */
export function cycleDayFor(iso: string): { index: number; exact: boolean } {
  const i = CYCLE.findIndex((d) => d.date >= iso);
  if (i < 0) return { index: CYCLE.length - 1, exact: false };
  return { index: i, exact: CYCLE[i].date === iso };
}

/** Вступление Штейнзальца к разделу: заголовок и текст (иврит, английский). */
export interface SteinsaltzIntro {
  title: { he?: string; en?: string; ru?: string; de?: string };
  he?: string;
  en?: string;
  /** переводы проекта (src/tanakh/ru|de/<книга>.json) */
  ru?: string;
  de?: string;
}
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
  /** Штейнзальц: стих с вплетённым объяснением (HTML: слова стиха — <b>, сноски — <small class="fn">); ru, de — переводы проекта */
  st?: { he?: string; en?: string; ru?: string; de?: string };
  /** вступления Штейнзальца к разделу, который начинается этим стихом */
  intro?: SteinsaltzIntro[];
}
interface Version {
  title?: string;
  license?: string;
  source?: string;
}
export interface SectionDay {
  refs: { b: string; from: [number, number]; to: [number, number]; url: string }[];
  verses: DayVerse[];
  versions: { he?: Version; en?: Version; steinsaltz?: Version };
}
export type DayContent = { date: string; day: number; days: number } & Record<Section, SectionDay>;

const cache = new Map<string, Promise<DayContent | null>>();
/** Тексты дня; null — этот день ещё не подготовлен. */
export function loadDay(date: string): Promise<DayContent | null> {
  let p = cache.get(date);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}tanakh/${date}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<DayContent>) : null))
      .catch(() => null);
    cache.set(date, p);
  }
  return p;
}

/**
 * About how long the passage takes to read in the chosen view: the vocalized Hebrew read aloud — ~100 words a minute,
 * the translation and Steinsaltz's explanation — ~180 words a minute. Rounded up, at least a minute.
 */
const HE_WPM = 100;
const TR_WPM = 180;
const words = (s?: string) => (s ? s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 0);
/** язык перевода на странице: английский (JPS 1985 и издание Штейнзальца) или перевод проекта */
export type Tr = 'en' | 'ru' | 'de';
export function readingMinutes(verses: DayVerse[], he: boolean, tr: Tr | null, st: boolean): number {
  let heW = 0;
  let trW = 0;
  const add = (x: ({ he?: string } & Partial<Record<Tr, string>>) | undefined) => {
    if (!x) return;
    if (he) heW += words(x.he);
    if (tr) trW += words(x[tr]);
  };
  for (const v of verses) {
    add(v);
    if (st) {
      add(v.st);
      v.intro?.forEach((x) => {
        add(x);
        add(x.title);
      });
    }
  }
  return Math.max(1, Math.ceil(heW / HE_WPM + trW / TR_WPM));
}
