/**
 * Проверка «Кто и где» (scripts/fetch-atlas.py, src/tanakh/atlas/entities.json и <язык>.json):
 *  - записи проекта: вид, иврит, номера Стронга, места `in` в понятной форме, `nc` — не «*», семья — существующие записи,
 *    у места с точкой — `sure` 0–2 и точка в окне карты; Имена Всевышнего — не записи;
 *  - у каждого дня цикла есть public/tanakh/atlas/<дата>.json; связи слов стиха ведут к записям этого же файла,
 *    номер слова — внутри стиха (как HeVerse делит иврит), `o` — те же записи, что в `v`, семья — тоже в файле;
 *  - справки: у каждой записи — имя на ru / en / de; у записей, которые называют слова стиха, — и описание; Имена —
 *    Б-г, Г-сподь / G-d / G-tt (английский и немецкий — scripts/style-rules.ts), без HTML;
 *  - хронология (timeline.json): эпохи подряд, события по годам, ссылки на стихи, записи, три языка, Имена и стиль;
 *  - у всех, кто встречается в отрывках до последнего дня с пересказом недели (src/tanakh/retell.json — он пишется
 *    вместе с переводом дня), есть справка; предупреждение — если справок меньше чем на неделю вперёд.
 */
import { existsSync, readFileSync } from 'node:fs';
import cycleJson from '../src/tanakh/cycle.json';
import retell from '../src/tanakh/retell.json';
import { styleErrors } from './style-rules';
import type { AtlasDay, AtlasMap, AtlasTexts, Timeline } from '../src/core/atlas';
import booksJson from '../src/tanakh/books.json';

interface Entity {
  k: string;
  he: string;
  s: string[];
  in: string[];
  nc?: number;
  fa?: string;
  mo?: string;
  sp?: string[];
  ch?: string[];
  ll?: [number, number];
  sure?: number;
  a?: number;
  t?: number;
}

const read = <T>(path: string): T => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const errors: string[] = [];
const err = (s: string) => errors.length < 60 && errors.push(s);
const LANGS = ['ru', 'en', 'de'] as const;
const NAMES: Record<(typeof LANGS)[number], (s: string) => string[]> = {
  ru: (s) => (/(^|[^\p{L}-])(Бог|Господ|Бож|божеств)/u.test(s) ? ['Имена по-русски — Б-г, Г-сподь'] : []),
  en: (s) => [...(/\b(God|LORD|Lord)\b/.test(s) ? ['G-d / L-rd'] : []), ...styleErrors('en', s)],
  de: (s) => styleErrors('de', s),
};
const GODLY = new Set(['3068', '3069', '3050', '136', '410', '430', '433', '7706', '6635']);
const SCOPE = /^(\*|[a-z-]+(?: \d+(?::\d+)?(?:-\d+(?::\d+)?)?)?)$/;

const ents = read<Record<string, Entity>>('../src/tanakh/atlas/entities.json');
const map = read<AtlasMap>('../public/tanakh/atlas/map.json');
const [x0, y0, x1, y1] = map.bbox;
if (!map.land.length || !map.lakes.length || !map.rivers.length) err('map.json: нет суши, озёр или рек');
for (const [id, , , he] of map.towns) if (!ents[id]?.t || ents[id].he !== he) err(`map.json: ориентир ${id} — не запись с \`t\``);

for (const [id, e] of Object.entries(ents)) {
  if (!/^[a-z][a-z-]*$/.test(id)) err(`entities.json ${id}: id — латиница через дефис`);
  if (!'mfgpx'.includes(e.k) || e.k.length !== 1) err(`entities.json ${id}: вид ${e.k}`);
  if (!/[א-ת]/.test(e.he ?? '')) err(`entities.json ${id}: нет имени на иврите`);
  if (!Array.isArray(e.s) || !Array.isArray(e.in)) err(`entities.json ${id}: нет \`s\` или \`in\``);
  for (const n of e.s ?? []) if (!/^\d+$/.test(n) || GODLY.has(n)) err(`entities.json ${id}: номер ${n}`);
  for (const s of e.in ?? []) if (!SCOPE.test(s)) err(`entities.json ${id}: непонятное место «${s}»`);
  if (e.s?.length && !e.in?.length) err(`entities.json ${id}: есть \`s\`, но нет \`in\``);
  if (e.nc && e.in.includes('*')) err(`entities.json ${id}: \`nc\` — только с точным \`in\``);
  for (const j of [e.fa, e.mo, ...(e.sp ?? []), ...(e.ch ?? [])]) if (j && !ents[j]) err(`entities.json ${id}: в семье ${j} — нет такой записи`);
  if (e.ll) {
    const [lat, lon] = e.ll;
    if (e.k !== 'p') err(`entities.json ${id}: точка — только у места`);
    if (lat < y0 || lat > y1 || lon < x0 || lon > x1) err(`entities.json ${id}: точка за окном карты (${lat}, ${lon})`);
    if (e.a !== undefined) {
      if (!(e.a > 0 && e.a <= 120) || e.sure !== undefined || e.t) err(`entities.json ${id}: область — радиус 1–120 км, без \`sure\` и \`t\``);
    } else if (![0, 1, 2].includes(e.sure as number)) err(`entities.json ${id}: \`sure\` — 0, 1 или 2`);
  } else if (e.sure !== undefined || e.t || e.a) err(`entities.json ${id}: \`sure\` / \`t\` / \`a\` без точки`);
}

const texts = Object.fromEntries(LANGS.map((l) => [l, read<AtlasTexts>(`../src/tanakh/atlas/${l}.json`)])) as Record<(typeof LANGS)[number], AtlasTexts>;
for (const l of LANGS) {
  for (const [id, x] of Object.entries(texts[l])) {
    if (!ents[id]) err(`atlas/${l}.json: ${id} — нет такой записи`);
    if (!x.n?.trim()) err(`atlas/${l}.json ${id}: нет имени`);
    if (/<[a-z]/i.test(x.n + (x.d ?? ''))) err(`atlas/${l}.json ${id}: HTML в справке`);
    for (const e of NAMES[l](`${x.n} ${x.d ?? ''}`)) err(`atlas/${l}.json ${id}: ${e}`);
  }
  for (const id of Object.keys(ents)) if (!texts[l][id]) err(`atlas/${l}.json: нет имени ${id}`);
}

// хронология: эпохи подряд, события — по годам, внутри эпох; ссылки — на стих Пророков или Писаний, записи — есть; три языка
const tl = read<Timeline>('../src/tanakh/atlas/timeline.json');
const chapters = new Map((booksJson as { books: { slug: string; verses: number[] }[] }).books.map((b) => [b.slug, b.verses]));
tl.eras.forEach((e, i) => {
  if (e.from >= e.to || (i && tl.eras[i - 1].to !== e.from)) err(`timeline: эпоха ${e.id} — годы`);
  for (const l of LANGS) if (!e.t[l]) err(`timeline: эпоха ${e.id} без ${l}`);
});
tl.events.forEach((ev, i) => {
  const at = `timeline: ${ev.t.ru ?? i}`;
  if (i && ev.y < tl.events[i - 1].y) err(`${at}: год раньше предыдущего`);
  if (ev.y < tl.eras[0].from || ev.y > tl.eras.at(-1)!.to || (ev.y2 && ev.y2 <= ev.y)) err(`${at}: год`);
  if (ev.ref) {
    const m = ev.ref.match(/^([a-z-]+) (\d+)(?::(\d+))?$/);
    const ch = m && chapters.get(m[1]);
    if (!m || !ch || +m[2] > ch.length || (m[3] && +m[3] > ch[+m[2] - 1])) err(`${at}: ссылка ${ev.ref}`);
  } else if (!ev.src) err(`${at}: нет ни ссылки, ни источника`);
  for (const w of ev.who ?? []) if (!ents[w]) err(`${at}: нет записи ${w}`);
  for (const l of LANGS) {
    if (!ev.t[l] || !ev.d[l] || (ev.src && !ev.src[l])) err(`${at}: нет текста ${l}`);
    for (const e of NAMES[l](`${ev.t[l]} ${ev.d[l]}`)) err(`${at} (${l}): ${e}`);
  }
});

// цари и пророки: эпоха есть, стих — настоящий, три языка, Имена и стиль; годы внутри одной линии — по порядку
const eraIds = new Set(tl.eras.map((e) => e.id));
const verseOk = (ref: string) => {
  const m = ref.match(/^([a-z-]+) (\d+):(\d+)$/);
  const ch = m && chapters.get(m[1]);
  return !!m && !!ch && +m[2] <= ch.length && +m[3] <= ch[+m[2] - 1];
};
const lastY: Record<string, number> = {};
for (const k of tl.kings) {
  const at = `timeline: царь ${k.t.ru}`;
  if (!eraIds.has(k.era) || !['united', 'judah', 'israel'].includes(k.lane)) err(`${at}: эпоха / линия`);
  if (!verseOk(k.ref)) err(`${at}: стих ${k.ref}`);
  if (k.who && !ents[k.who]) err(`${at}: нет записи ${k.who}`);
  if (!k.y || k.y < (lastY[k.lane] ?? 0)) err(`${at}: нет года или год раньше предыдущего царя`);
  lastY[k.lane] = k.y;
  for (const l of LANGS) {
    if (!k.t[l] || !k.r[l]) err(`${at}: нет текста ${l}`);
    for (const e of NAMES[l](k.t[l])) err(`${at} (${l}): ${e}`);
  }
}
for (const p of tl.prophets) {
  const at = `timeline: пророк ${p.t.ru}`;
  if (!eraIds.has(p.era)) err(`${at}: эпоха`);
  const era = tl.eras.find((e) => e.id === p.era);
  if (!p.y || (era && p.y < era.from - 1) || p.y > tl.eras.at(-1)!.to) err(`${at}: год`);
  if (!verseOk(p.ref)) err(`${at}: стих ${p.ref}`);
  for (const l of LANGS) {
    if (!p.t[l] || !p.w[l]) err(`${at}: нет текста ${l}`);
    for (const e of NAMES[l](`${p.t[l]} ${p.w[l]}`)) err(`${at} (${l}): ${e}`);
  }
}

const cycle = (cycleJson.days as [string, ...number[]][]).map(([date]) => date);
const until = Object.keys(retell).sort().at(-1)!;
const need = new Map<string, string>();
let words = 0;
let ready = '';
for (const date of cycle) {
  const path = `../public/tanakh/atlas/${date}.json`;
  if (!existsSync(new URL(path, import.meta.url))) {
    err(`нет public/tanakh/atlas/${date}.json — python3 scripts/fetch-atlas.py build`);
    continue;
  }
  const d = read<AtlasDay>(path);
  const day = read<Record<'neviim' | 'ketuvim', { verses: { b: string; c: number; v: number; he: string }[] }>>(`../public/tanakh/${date}.json`);
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
      if (!d.e[id] || !ents[id]) err(`${date} ${ref}: нет записи ${id}`);
      used.add(id);
    }
  }
  const order = [...d.o.neviim, ...d.o.ketuvim];
  for (const id of used) if (!order.includes(id)) err(`${date}: ${id} нет в «o»`);
  for (const id of order) if (!used.has(id)) err(`${date}: ${id} в «o», но не в стихах`);
  for (const [id, e] of Object.entries(d.e))
    for (const j of [e.fa, e.mo, ...(e.sp ?? []), ...(e.ch ?? [])]) if (j && !d.e[j]) err(`${date} ${id}: в семье ${j}, а в файле его нет`);
  if (date <= until) {
    for (const id of order) if (LANGS.some((l) => !texts[l][id]?.d)) need.set(id, date);
    if (!need.size) ready = date;
  }
}
for (const [id, date] of need)
  err(`нет справки ${id} (${date}) на ${LANGS.filter((l) => !texts[l][id]?.d).join(', ')} — python3 scripts/fetch-atlas.py todo ru ${until}`);

// предупреждение: справок меньше чем на неделю вперёд (по циклу, начиная с сегодняшнего дня)
const today = new Date().toISOString().slice(0, 10);
const ahead = cycle.filter((d) => d >= today && d <= ready).length;
if (errors.length) {
  console.error(`check-atlas: ${errors.length} ошибок\n` + errors.join('\n'));
  process.exit(1);
}
console.log(`✓ Кто и где: ${Object.keys(ents).length} записей проекта, ${words} имён в стихах; справки готовы до ${ready}; хронология — ${tl.events.length} событий, ${tl.kings.length} царей, ${tl.prophets.length} пророков`);
if (ahead < 6) console.warn(`check-atlas: справки «Кто и где» готовы только на ${ahead} учебных дней вперёд — python3 scripts/fetch-atlas.py todo ru`);
