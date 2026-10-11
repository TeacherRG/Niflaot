/**
 * «Пророки» и «Писания» (часть npm run check):
 *  - src/tanakh/cycle.json — ровно то, что считает scripts/tanakh-cycle.ts по правилам src/core/tanakhCycle.ts;
 *  - ни одного дня в Шабат, праздник или 9 ава; даты по порядку; каждый день — хотя бы один стих каждого раздела;
 *    каждый стих Невиим и Ктувим — ровно один раз; оба раздела заканчиваются в последний день цикла;
 *  - тексты дней public/tanakh/<дата>.json: дата — учебный день, стихи — ровно отрывок этого дня, у каждого иврит и
 *    английский и объяснение Штейнзальца на обоих языках; Имена — как во всём проекте; в HTML Штейнзальца — только <b> и <small class="fn">;
 *    public/tanakh/index.json перечисляет все готовые дни;
 *  - русский перевод проекта (src/tanakh/ru/<книга>.json): только настоящие стихи; день, где он есть, переведён целиком
 *    (стих, объяснение Штейнзальца, вступления — заголовок и текст); файлы дней совпадают с переводом
 *    (после правки — python3 scripts/fetch-tanakh.py ru); Имена — Б-г, Г-сподь; в HTML — только <b> и <small class="fn">.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { buildCycle } from './tanakh-cycle';
import { BOOKS, restReason, track, SECTIONS } from '../src/core/tanakhCycle';
import cycleJson from '../src/tanakh/cycle.json';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

const built = buildCycle();
if (JSON.stringify(built.days) !== JSON.stringify(cycleJson.days) || built.end !== cycleJson.end)
  err('src/tanakh/cycle.json устарел — запустите npx tsx scripts/tanakh-cycle.ts');

const days = cycleJson.days as [string, number, number, number, number][];
days.forEach(([d], i) => {
  const r = restReason(d);
  if (r) err(`цикл: ${d} — ${r}, в этот день чтения нет`);
  if (i && d <= days[i - 1][0]) err(`цикл: даты не по порядку (${days[i - 1][0]}, ${d})`);
});
SECTIONS.forEach((s, k) => {
  const total = track(s).length;
  let at = 0;
  for (const day of days) {
    const [a, z] = [day[1 + 2 * k], day[2 + 2 * k]];
    if (a !== at) err(`цикл ${s}: ${day[0]} начинается со стиха ${a}, ожидался ${at}`);
    if (z <= a) err(`цикл ${s}: ${day[0]} — пустой день`);
    at = z;
  }
  if (at !== total) err(`цикл ${s}: пройдено ${at} стихов из ${total} — раздел не заканчивается в последний день`);
});

// русский перевод проекта: книга → «глава:стих» → {t, st, intro}
type RuVerse = { t: string; st?: string; intro?: { title: string; text: string }[] };
const ruDir = new URL('../src/tanakh/ru/', import.meta.url);
const RU: Record<string, Record<string, RuVerse>> = {};
for (const f of existsSync(ruDir) ? readdirSync(ruDir).filter((f) => f.endsWith('.json')) : []) {
  const slug = f.slice(0, -5);
  const book = BOOKS.find((b) => b.slug === slug);
  if (!book) {
    err(`src/tanakh/ru/${f}: нет такой книги`);
    continue;
  }
  RU[slug] = JSON.parse(readFileSync(new URL(f, ruDir), 'utf8'));
  for (const key of Object.keys(RU[slug])) {
    const [c, v] = key.split(':').map(Number);
    if (!(v >= 1 && v <= (book.verses[c - 1] ?? 0))) err(`src/tanakh/ru/${f}: нет стиха ${key}`);
  }
}
const ALLOWED = ['<b>', '</b>', '<small class="fn">', '</small>'];
const badTags = (html: string) => (html.match(/<[^>]*>/g) ?? []).some((tg) => !ALLOWED.includes(tg));
// Имена по-русски — как в scripts/fetch-sources.py: Б-г, Г-сподь
const badRuName = (s: string) => /(^|[^\p{L}-])(Бог|Господ|Бож)/u.test(s);

const dir = new URL('../public/tanakh/', import.meta.url);
const files = existsSync(dir) ? readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)) : [];
const index = existsSync(new URL('index.json', dir)) ? JSON.parse(readFileSync(new URL('index.json', dir), 'utf8')).days : [];
if (JSON.stringify(index) !== JSON.stringify(files.map((f) => f.slice(0, 10)).sort())) err('public/tanakh/index.json не совпадает с файлами дней');
for (const f of files) {
  const c = JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
  const i = days.findIndex((d) => d[0] === c.date);
  if (i < 0 || `${c.date}.json` !== f) {
    err(`${f}: не учебный день цикла`);
    continue;
  }
  if (c.day !== i + 1 || c.days !== days.length) err(`${f}: номер дня ${c.day}/${c.days}, ожидался ${i + 1}/${days.length}`);
  const all = SECTIONS.flatMap((s) => c[s]?.verses ?? []) as { ru?: string }[];
  if (all.some((v) => v.ru) && !all.every((v) => v.ru)) err(`${f}: день переведён на русский не целиком`);
  SECTIONS.forEach((s, k) => {
    const want = track(s).slice(days[i][1 + 2 * k], days[i][2 + 2 * k]);
    const got = c[s]?.verses ?? [];
    if (got.length !== want.length || got.some((v: { b: string; c: number; v: number }, j: number) => v.b !== want[j].book.slug || v.c !== want[j].chapter || v.v !== want[j].verse))
      err(`${f} ${s}: стихи не совпадают с отрывком дня`);
    for (const v of got) {
      const where = `${f} ${v.b} ${v.c}:${v.v}`;
      if (!v.he || !v.en) err(`${where}: нет иврита или английского`);
      // у Штейнзальца нет только Йеґошуа 21:36–37 (их нет и во многих изданиях; JPS 1985 даёт их в сноске)
      if ((!v.st?.he || !v.st?.en) && !(v.b === 'joshua' && v.c === 21 && (v.v === 36 || v.v === 37))) err(`${where}: нет объяснения Штейнзальца`);
      const he = [v.he, v.st?.he, ...(v.intro ?? []).flatMap((x: { he?: string; title: { he?: string } }) => [x.he, x.title.he])].join(' ');
      const en = [v.en, v.st?.en, ...(v.intro ?? []).flatMap((x: { en?: string; title: { en?: string } }) => [x.en, x.title.en])].join(' ');
      // по словам: макаф разделяет слова («דִּי־הֲוָה» — не Имя)
      const plain = he.replace(/\u05BE/g, ' ').replace(/[\u0591-\u05C7]/g, '');
      if (/(^|[^א-ת])[והבכלמש]*יהוה(?![א-ת])|(^|[^א-ת])ה'(?![א-ת])/.test(plain)) err(`${where}: Имя не по правилам проекта (ה׳)`);
      if (/\b(God|LORD|Lord)\b/.test(en)) err(`${where}: G-d / L-rd`);
      if (badTags(`${v.st?.he ?? ''} ${v.st?.en ?? ''} ${v.st?.ru ?? ''}`)) err(`${where}: в HTML Штейнзальца лишние теги`);
      // русский: как в src/tanakh/ru, и целиком
      const r = RU[v.b]?.[`${v.c}:${v.v}`];
      const intro = (v.intro ?? []) as { ru?: string; title: { ru?: string } }[];
      if ((r?.t ?? undefined) !== v.ru || (r?.st ?? undefined) !== v.st?.ru || intro.some((x, k) => x.ru !== r?.intro?.[k]?.text || x.title.ru !== r?.intro?.[k]?.title))
        err(`${where}: русский перевод в файле дня устарел — python3 scripts/fetch-tanakh.py ru`);
      if (r && (!r.t || (v.st && !r.st) || (r.intro?.length ?? 0) !== intro.length || r.intro?.some((x) => !x.title || !x.text)))
        err(`${where}: перевод неполный (стих, Штейнзальц, вступления)`);
      if (r && badRuName(`${r.t} ${r.st ?? ''} ${r.intro?.map((x) => `${x.title} ${x.text}`).join(' ') ?? ''}`)) err(`${where}: Имена по-русски — Б-г, Г-сподь`);
    }
  });
}

if (errors.length) {
  console.error(`✗ Пророки и Писания: ${errors.length} ошибок\n  ${errors.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Пророки и Писания: цикл ${days.length} учебных дней (${days[0][0]} – ${days[days.length - 1][0]}), готовы тексты ${files.length} дней`);
