/**
 * «Мысль к стиху» — маячки у стихов Теґилим в «Святом чтении»: раздел «Living the Mizmor» сайта nafshi.org
 * (ред. Ицхок Кирзнер; некоммерческое воспроизведение по главам разрешено, подпись и ссылка — под текстом).
 * Данные — `python3 scripts/fetch-nafshi.py build` → public/reading/living/<глава>.json; по-английски.
 */
import { root } from './reading';

export type LivingKind = 'lessons' | 'tefillos' | 'tehillos' | 'other';

export interface LivingItem {
  /** стих главы, с 1 */
  v: number;
  kind: LivingKind;
  /** тема группы: behavior, attitude, gratitude… ('' — нет) */
  topic: string;
  /** куски стиха (между пробелами), где стоят слова, — [первый, последний]; нет — маячок у номера стиха */
  r?: [number, number];
  title?: string;
  /** перевод слов стиха */
  quote?: string;
  /** вывод */
  text?: string;
}
export interface Living {
  c: number;
  title: string;
  url: string;
  items: LivingItem[];
}

/** главы, у которых автор написал раздел (остальные — без маячков); сверяет scripts/check-reading.ts */
export const hasLiving = (c: number) => (c >= 1 && c <= 67) || (c >= 120 && c <= 134);
export const LIVING_SITE = 'https://nafshi.org/category/tehillim/';

const cache = new Map<number, Promise<Living | null>>();
export function loadLiving(c: number): Promise<Living | null> {
  if (!hasLiving(c)) return Promise.resolve(null);
  let p = cache.get(c);
  if (!p) {
    p = fetch(`${root()}reading/living/${c}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Living>) : null))
      .catch(() => null);
    cache.set(c, p);
  }
  return p;
}
/** уже загруженные главы — окну над маячком (одно на страницу) */
const loaded = new Map<number, Living>();
export const rememberLiving = (l: Living) => loaded.set(l.c, l);
export const livingItem = (id: string): { living: Living; item: LivingItem } | null => {
  const [c, i] = id.split(':').map(Number);
  const living = loaded.get(c);
  const item = living?.items[i];
  return living && item ? { living, item } : null;
};
