/**
 * «Шнаим микра ве-эхад таргум» в «Святом чтении» (`#/reading/shnayim[/<отрывок 1–7>]`, ShnayimPage.tsx): стих Торы дважды
 * и Таргум Онкелос один раз — по отрывку (алие) недельной главы в день: воскресенье — 1-й … Шабат — 7-й.
 * Данные — public/reading/torah/shnayim-<глава>.json (`python3 scripts/fetch-shnayim.py`); новая глава — там и в SHNAYIM.
 */
import { PARSHIOT, type ParshaId } from '../lessons/parshiot';

/** главы, для которых есть текст (в порядке Торы) */
export const SHNAYIM: ParshaId[] = ['vayera'];
export const ALIYOT = 7;

export interface ShnayimVerse {
  /** «глава:стих» */
  r: string;
  /** стих Торы (огласовки и знаки кантилляции) */
  m: string;
  /** Таргум Онкелос */
  t: string;
}
export interface ShnayimText {
  parsha: ParshaId;
  book: string;
  he: string;
  torah: { title: string; license: string; source: string };
  targum: { title: string; license: string; source: string };
  aliyot: { from: string; to: string; v: ShnayimVerse[] }[];
}

/** глава этой недели — первая, чей Шабат сегодня или позже; текста для неё ещё нет — ближайшая готовая */
export function shnayimParsha(today: string): ParshaId {
  const week = SHNAYIM.find((p) => PARSHIOT[p].shabbat >= today);
  return week ?? SHNAYIM[SHNAYIM.length - 1];
}

/** отрывок дня: воскресенье — 1 … Шабат — 7 */
export const aliyahOfDay = (iso: string) => new Date(`${iso}T12:00:00`).getDay() + 1;

// the site's root, as in src/core/reading.ts
const up = '..';
const root = () => (import.meta.env.DEV ? import.meta.env.BASE_URL : new URL(up, import.meta.url).href);

const cache = new Map<ParshaId, Promise<ShnayimText>>();
export function loadShnayim(p: ParshaId): Promise<ShnayimText> {
  let x = cache.get(p);
  if (!x) {
    x = fetch(`${root()}reading/torah/shnayim-${p}.json`).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
    x.catch(() => cache.delete(p));
    cache.set(p, x);
  }
  return x;
}
