/**
 * Проверка «Кто и где» (scripts/fetch-atlas.py, src/tanakh/atlas/<язык>.json):
 *  - у каждого дня цикла есть файл public/tanakh/atlas/<дата>.json; связи слов стиха ведут к справкам этого же файла,
 *    `o` — те же люди и места, что в `v`, у семьи — свои справки; номер слова — внутри стиха (как HeVerse делит иврит);
 *  - у мест с точкой — координаты в окне карты, уверенность 0–1000; Имя Всевышнего справкой не стало;
 *  - справки проекта: одни и те же id на ru / en / de, у каждой — имя и описание, Имена — Б-г, Г-сподь / G-d / G-tt
 *    (английский и немецкий — scripts/style-rules.ts), без HTML;
 *  - у всех, кто встречается в отрывках до последнего дня с пересказом недели (src/tanakh/retell.json — он пишется
 *    вместе с переводом дня), есть справка на всех языках; предупреждение — если справок меньше чем на неделю вперёд.
 */
import { existsSync, readFileSync } from 'node:fs';
import cycleJson from '../src/tanakh/cycle.json';
import retell from '../src/tanakh/retell.json';
import { styleErrors } from './style-rules';
import type { AtlasDay, AtlasMap, AtlasTexts } from '../src/core/atlas';

const read = <T>(path: string): T => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const errors: string[] = [];
const err = (s: string) => errors.length < 60 && errors.push(s);
const LANGS = ['ru', 'en', 'de'] as const;
const NAMES: Record<(typeof LANGS)[number], (s: string) => string[]> = {
  ru: (s) => (/(^|[^\p{L}-])(Бог|Господ|Бож|божеств)/u.test(s) ? ['Имена по-русски — Б-г, Г-сподь'] : []),
  en: (s) => [...(/\b(God|LORD|Lord)\b/.test(s) ? ['G-d / L-rd'] : []), ...styleErrors('en', s)],
  de: (s) => styleErrors('de', s),
};

const cycle = (cycleJson.days as [string, ...number[]][]).map(([date]) => ({ date }));
const map = read<AtlasMap>('../public/tanakh/atlas/map.json');
if (!map.land.length || !map.lakes.length || !map.rivers.length) err('map.json: нет суши, озёр или рек');

const texts = Object.fromEntries(LANGS.map((l) => [l, read<AtlasTexts>(`../src/tanakh/atlas/${l}.json`)])) as Record<(typeof LANGS)[number], AtlasTexts>;
for (const l of LANGS) {
  for (const [id, x] of Object.entries(texts[l])) {
    if (!x.n?.trim() || !x.d?.trim()) err(`atlas/${l}.json ${id}: нет имени или описания`);
    if (/<[a-z]/i.test(x.n + x.d)) err(`atlas/${l}.json ${id}: HTML в справке`);
    for (const e of NAMES[l](`${x.n} ${x.d}`)) err(`atlas/${l}.json ${id}: ${e}`);
  }
  for (const id of Object.keys(texts.ru)) if (!texts[l][id]) err(`atlas/${l}.json: нет ${id} (есть по-русски)`);
  for (const id of Object.keys(texts[l])) if (!texts.ru[id]) err(`atlas/${l}.json: лишняя ${id} (нет по-русски)`);
}

const until = Object.keys(retell).sort().at(-1)!;
const need = new Map<string, string>();
let words = 0;
let ready = '';
for (const { date } of cycle) {
  const path = `../public/tanakh/atlas/${date}.json`;
  if (!existsSync(new URL(path, import.meta.url))) {
    err(`нет public/tanakh/atlas/${date}.json — python3 scripts/fetch-atlas.py build`);
    continue;
  }
  const d = read<AtlasDay>(path);
  const day = read<{ neviim: { verses: { b: string; c: number; v: number; he: string }[] }; ketuvim: { verses: { b: string; c: number; v: number; he: string }[] } }>(`../public/tanakh/${date}.json`);
  const verses = new Map([...day.neviim.verses, ...day.ketuvim.verses].map((v) => [`${v.b} ${v.c}:${v.v}`, v.he]));
  const used = new Set<string>();
  for (const [ref, row] of Object.entries(d.v)) {
    const he = verses.get(ref);
    if (he === undefined) {
      err(`${date}: ${ref} — не стих этого дня`);
      continue;
    }
    const n = he.split(/[ ־]+/).filter(Boolean).length;
    for (const [w, id] of Object.entries(row)) {
      words++;
      if (+w >= n) err(`${date} ${ref}: слово ${w} — за концом стиха`);
      if (!d.e[id]) err(`${date} ${ref}: нет справки ${id}`);
      used.add(id);
    }
  }
  const order = [...d.o.neviim, ...d.o.ketuvim];
  for (const id of used) if (!order.includes(id)) err(`${date}: ${id} нет в «o»`);
  for (const id of order) if (!used.has(id)) err(`${date}: ${id} в «o», но не в стихах`);
  for (const [id, e] of Object.entries(d.e)) {
    if (!'mfgpx'.includes(e.k) || !e.he || !e.en) err(`${date} ${id}: вид, иврит или имя`);
    if (/^(LORD|God|Lord)$/.test(e.en)) err(`${date} ${id}: Имя Всевышнего — не справка`);
    for (const j of [e.fa, e.mo, ...(e.sp ?? []), ...(e.sib ?? []), ...(e.ch ?? [])]) if (j && !d.e[j]) err(`${date} ${id}: в семье ${j} без справки`);
    if (e.ll) {
      const [lat, lon] = e.ll;
      // Танах — от Испании (Таршиш) до Персии и Шевы; Рим или Америка — ошибка связи с OpenBible
      if (lat < 10 || lat > 45 || lon < -10 || lon > 62) err(`${date} ${id}: точка далеко за пределами Танаха (${lat}, ${lon})`);
      if (e.q === undefined || e.q < 0 || e.q > 1200) err(`${date} ${id}: уверенность места`);
    }
  }
  if (date <= until) {
    for (const id of order) if (LANGS.some((l) => !texts[l][id])) need.set(id, `${date} ${d.e[id].en}`);
    if (!need.size) ready = date;
  }
}
for (const [id, where] of need) err(`нет справки ${id} (${where}) на ${LANGS.filter((l) => !texts[l][id]).join(', ')} — python3 scripts/fetch-atlas.py todo ru ${until}`);

// предупреждение: справок меньше чем на неделю вперёд (по циклу, начиная с сегодняшнего дня)
const today = new Date().toISOString().slice(0, 10);
const ahead = cycle.filter((d) => d.date >= today && d.date <= ready).length;
if (errors.length) {
  console.error(`check-atlas: ${errors.length} ошибок\n` + errors.join('\n'));
  process.exit(1);
}
console.log(`check-atlas: ok — ${words} имён в стихах, справок ${Object.keys(texts.ru).length}; готово до ${ready}`);
if (ahead < 6) console.warn(`check-atlas: справки «Кто и где» готовы только на ${ahead} учебных дней вперёд — python3 scripts/fetch-atlas.py todo ru`);
