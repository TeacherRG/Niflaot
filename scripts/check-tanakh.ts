/**
 * «Пророки» и «Писания» (часть npm run check):
 *  - src/tanakh/cycle.json — ровно то, что считает scripts/tanakh-cycle.ts по правилам src/core/tanakhCycle.ts;
 *  - ни одного дня в Шабат, праздник или 9 ава; даты по порядку; каждый день — хотя бы один стих каждого раздела;
 *    каждый стих Невиим и Ктувим — ровно один раз; оба раздела заканчиваются в последний день цикла;
 *  - тексты дней public/tanakh/<дата>.json: дата — учебный день, стихи — ровно отрывок этого дня, у каждого иврит и
 *    английский; комментарии (Мецудат Давид, Раши) — только свободные издания, без Штейнзальца (© Steinsaltz Center);
 *    Имена — как во всём проекте; в HTML комментариев — только <b> и <small class="fn">;
 *    public/tanakh/index.json перечисляет все готовые дни;
 *  - переводы проекта (src/tanakh/ru|en|de/<книга>.json): только настоящие стихи; перевод комментария — столько же
 *    комментариев, сколько в оригинале; день, где есть перевод, переведён целиком (стих — ru, de; Мецудат Давид — по
 *    языку; Раши — ru, de); файлы дней совпадают с переводом (после правки — python3 scripts/fetch-tanakh.py tr); Имена — Б-г, Г-сподь /
 *    G-d, L-rd / G-tt, der Ewige (немецкий — и стиль de.chabad.org, scripts/style-rules.ts); в стихе — без HTML.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { buildCycle } from './tanakh-cycle';
import { BOOKS, restReason, track, SECTIONS } from '../src/core/tanakhCycle';
import cycleJson from '../src/tanakh/cycle.json';
import { styleErrors } from './style-rules';
import { tanakhLang, tanakhNarration } from '../src/core/tanakhNarration';

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

// переводы проекта: язык → книга → «глава:стих» → {t, md, rashi}
type TrVerse = { t?: string; md?: string[]; rashi?: string[] };
const LANGS = ['ru', 'en', 'de'] as const;
type Lang = (typeof LANGS)[number];
const TR = { ru: {}, en: {}, de: {} } as Record<Lang, Record<string, Record<string, TrVerse>>>;
for (const lang of LANGS) {
  const trDir = new URL(`../src/tanakh/${lang}/`, import.meta.url);
  for (const f of existsSync(trDir) ? readdirSync(trDir).filter((f) => f.endsWith('.json')) : []) {
    const slug = f.slice(0, -5);
    const book = BOOKS.find((b) => b.slug === slug);
    if (!book) {
      err(`src/tanakh/${lang}/${f}: нет такой книги`);
      continue;
    }
    TR[lang][slug] = JSON.parse(readFileSync(new URL(f, trDir), 'utf8'));
    for (const [key, r] of Object.entries(TR[lang][slug])) {
      const [c, v] = key.split(':').map(Number);
      if (!(v >= 1 && v <= (book.verses[c - 1] ?? 0))) err(`src/tanakh/${lang}/${f}: нет стиха ${key}`);
      if (lang === 'en' && (r.t || r.rashi)) err(`src/tanakh/en/${f} ${key}: в английском файле — только Мецудат Давид`);
      if (Object.keys(r).some((k) => !['t', 'md', 'rashi'].includes(k))) err(`src/tanakh/${lang}/${f} ${key}: лишнее поле (Штейнзальца на сайте нет)`);
    }
  }
}
const ALLOWED = ['<b>', '</b>', '<small class="fn">', '</small>'];
const badTags = (html: string) => (html.match(/<[^>]*>/g) ?? []).some((tg) => !ALLOWED.includes(tg));
// Имена — как в scripts/fetch-sources.py: Б-г, Г-сподь; G-d, L-rd; по-немецки G-tt, der Ewige (Herr — только «мой господин», אדני)
const badName: Record<Lang, (s: string) => string[]> = {
  ru: (s) => (/(^|[^\p{L}-])(Бог|Господ|Бож)/u.test(s) ? ['Имена по-русски — Б-г, Г-сподь'] : []),
  en: (s) => (/\b(God|LORD|Lord)\b/.test(s) ? ['G-d / L-rd'] : []),
  de: (s) => styleErrors('de', s),
};
type Comm = Partial<Record<'he' | Lang, string[]>>;
const FREE = ['Public Domain', 'CC0', 'CC-BY'];

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
  // «Слушать» (src/core/tanakhNarration.ts): parts the worker accepts (≤ 4000), plain text, the Names said in words
  for (const loc of ['ru', 'en', 'de'])
    for (const s of SECTIONS) {
      const n = await tanakhNarration(c, s, tanakhLang(c, loc));
      for (const p of n?.parts ?? []) {
        if (p.text.length > 4000) err(`${f} ${s}: часть для «Слушать» длиннее 4000 знаков (${p.label})`);
        const bad = p.text.match(/<[^>]+>|&[a-z]+;|[א-ת]-[א-ת]|[БГ]-[а-яё]|G-d|G-tt|L-rd|ה׳/);
        if (bad) err(`${f} ${s}: в тексте для «Слушать» — «${bad[0]}» (${p.label}); сказать словами — spoken() в src/core/speech.ts`);
      }
    }
  const all = SECTIONS.flatMap((s) => c[s]?.verses ?? []) as ({ md?: Comm; rashi?: Comm } & Partial<Record<Lang, string>>)[];
  for (const lang of ['ru', 'de'] as const) if (all.some((v) => v[lang]) && !all.every((v) => v[lang])) err(`${f}: день переведён (${lang}) не целиком`);
  for (const lang of LANGS) {
    const md = all.filter((v) => v.md);
    if (md.some((v) => v.md![lang]) && !md.every((v) => v.md![lang])) err(`${f}: Мецудат Давид переведён (${lang}) не целиком`);
  }
  for (const lang of ['ru', 'de'] as const) {
    const rashi = all.filter((v) => v.rashi?.he);
    if (rashi.some((v) => v.rashi![lang]) && !rashi.every((v) => v.rashi![lang])) err(`${f}: Раши переведён (${lang}) не целиком`);
  }
  SECTIONS.forEach((s, k) => {
    const want = track(s).slice(days[i][1 + 2 * k], days[i][2 + 2 * k]);
    const got = c[s]?.verses ?? [];
    if (got.length !== want.length || got.some((v: { b: string; c: number; v: number }, j: number) => v.b !== want[j].book.slug || v.c !== want[j].chapter || v.v !== want[j].verse))
      err(`${f} ${s}: стихи не совпадают с отрывком дня`);
    for (const [name, ver] of Object.entries(c[s]?.versions ?? {}) as [string, { license?: string; title?: string }][]) {
      if (name === 'steinsaltz' || /steinsaltz/i.test(ver.title ?? '')) err(`${f} ${s}: Штейнзальц (© Steinsaltz Center) на сайте не приводится`);
      if ((name === 'md' || name.startsWith('rashi')) && !FREE.includes(ver.license ?? '')) err(`${f} ${s}: лицензия комментария «${ver.license}» — нужна свободная`);
    }
    for (const v of got) {
      const where = `${f} ${v.b} ${v.c}:${v.v}`;
      if (!v.he || !v.en) err(`${where}: нет иврита или английского`);
      if ('st' in v || 'intro' in v) err(`${where}: Штейнзальц (© Steinsaltz Center) на сайте не приводится`);
      const comms = [v.md, v.rashi].filter(Boolean) as Comm[];
      const he = [v.he, ...comms.flatMap((x) => x.he ?? [])].join(' ');
      const en = [v.en, ...comms.flatMap((x) => x.en ?? [])].join(' ');
      // по словам: макаф разделяет слова («דִּי־הֲוָה» — не Имя)
      const plain = he.replace(/\u05BE/g, ' ').replace(/[\u0591-\u05C7]/g, '');
      if (/(^|[^א-ת])[והבכלמש]*יהוה(?![א-ת])|(^|[^א-ת])[והבכלמש]?ה'(?![א-ת])/.test(plain)) err(`${where}: Имя не по правилам проекта (ה׳)`);
      if (/\b(God|LORD|Lord)\b/.test(en)) err(`${where}: G-d / L-rd`);
      for (const x of comms) if (badTags(Object.values(x).flat().join(' '))) err(`${where}: в HTML комментария лишние теги`);
      // переводы проекта: как в src/tanakh/<язык>, и целиком
      for (const lang of LANGS) {
        const r = TR[lang][v.b]?.[`${v.c}:${v.v}`];
        if (lang !== 'en' && (r?.t ?? undefined) !== v[lang]) err(`${where}: перевод (${lang}) в файле дня устарел — python3 scripts/fetch-tanakh.py tr`);
        for (const kind of ['md', 'rashi'] as const) {
          if (kind === 'rashi' && lang === 'en') continue;
          const own = v[kind]?.[lang] as string[] | undefined;
          if (JSON.stringify(r?.[kind] ?? null) !== JSON.stringify(v[kind] ? own ?? null : null))
            err(`${where}: перевод ${kind} (${lang}) в файле дня устарел — python3 scripts/fetch-tanakh.py tr`);
          if (r?.[kind] && r[kind]!.length !== (v[kind]?.he?.length ?? 0)) err(`${where}: перевод ${kind} (${lang}) — ${r[kind]!.length} комментариев, в оригинале ${v[kind]?.he?.length ?? 0}`);
          if (r?.[kind]?.some((x) => !x.trim() || badTags(x))) err(`${where}: перевод ${kind} (${lang}) — пустой комментарий или лишние теги`);
        }
        if (r) for (const e of badName[lang](`${r.t ?? ''} ${[...(r.md ?? []), ...(r.rashi ?? [])].join(' ').replace(/<[^>]+>/g, ' ')}`)) err(`${where} (${lang}): ${e}`);
        // стих показывается как текст: без тегов
        if (r?.t && /<[^>]*>/.test(r.t)) err(`${where} (${lang}): HTML в стихе`);
      }
    }
  });
}

if (errors.length) {
  console.error(`✗ Пророки и Писания: ${errors.length} ошибок\n  ${errors.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Пророки и Писания: цикл ${days.length} учебных дней (${days[0][0]} – ${days[days.length - 1][0]}), готовы тексты ${files.length} дней`);
