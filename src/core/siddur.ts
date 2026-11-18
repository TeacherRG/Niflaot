/** Молитвы сидура «Теилат Ашем» на сайте: адрес `#/reading/siddur/<молитва>`, текст — `public/reading/siddur/<молитва>-he.json`
 * (собирает `scripts/build-siddur.py`). Отдельный файл — чтобы маршрут в `App.tsx` не тянул код страницы. */
export const PRAYERS = ['shacharit', 'mincha', 'maariv', 'birkat-hamazon'] as const;
export type Prayer = (typeof PRAYERS)[number];
export const isPrayer = (x: string | undefined): x is Prayer => !!x && (PRAYERS as readonly string[]).includes(x);
