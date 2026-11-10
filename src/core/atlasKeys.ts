import type { AtlasLang } from './atlas';

/**
 * «Ключевые места» Невиим — маячки в стихе (владелец, 10.11.2026: «особые маячки на ключевые словосочетания, которые связывают
 * воедино человека, место и время — шана, нефеш, маком»). По одному на отрывок дня: словосочетание стиха, которое собирает
 * вместе נֶפֶשׁ (кто), מָקוֹם (где) и שָׁנָה (когда). Нажатие на маячок — окно KeyPop: время (год от сотворения мира по
 * «Седер олам», эпоха хронологии), люди и места (справки «Кто и где», карта) и как это связано.
 *
 * Данные — src/tanakh/atlas/keys.json (проекта, по простому смыслу стиха, Раши, Мецудат Давид, «Седер олам», Талмуду):
 * {«книга глава:стих»: {w — словосочетание буквами без огласовок, слова через пробел (макаф — тоже пробел); who / where —
 * id записей «Кто и где»; y, y2? — год / годы от сотворения мира; when? — день или срок словами; t — заголовок; d — 1–2
 * предложения}}. Проверка — scripts/check-atlas.ts.
 */
export interface AtlasKey {
  w: string;
  who: string[];
  where: string[];
  y: number;
  y2?: number;
  when?: Record<AtlasLang, string>;
  t: Record<AtlasLang, string>;
  d: Record<AtlasLang, string>;
}
export type AtlasKeys = Record<string, AtlasKey>;

let keys: Promise<AtlasKeys> | undefined;
export const loadAtlasKeys = () => (keys ??= import('../tanakh/atlas/keys.json').then((m) => m.default as unknown as AtlasKeys));

/** слова стиха — как их режет HeVerse (через пробел и макаф) */
export const verseWords = (text: string) => text.split(/[ ־]+/).filter(Boolean);
/** буквы слова: без огласовок, знаков кантилляции, скобок кри / кетива и соф пасука */
export const bareWord = (w: string) => w.replace(/[֑-ׇ׳״׃׀[\]()]/g, '');

/** где в стихе словосочетание: [номер первого слова, номер последнего] (номера — как у HeVerse), или null */
export function keyRange(text: string, phrase: string): [number, number] | null {
  const ws = verseWords(text).map(bareWord);
  const p = phrase.split(' ').filter(Boolean);
  for (let i = 0; i + p.length <= ws.length; i++) if (p.every((x, j) => ws[i + j] === x)) return [i, i + p.length - 1];
  return null;
}
