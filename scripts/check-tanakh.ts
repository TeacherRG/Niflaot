/**
 * «Пророки» и «Писания» (часть npm run check):
 *  - src/tanakh/cycle.json — ровно то, что считает scripts/tanakh-cycle.ts по правилам src/core/tanakhCycle.ts;
 *  - ни одного дня в Шабат, праздник или 9 ава; даты по порядку; каждый день — хотя бы один стих каждого раздела;
 *    каждый стих Невиим и Ктувим — ровно один раз; оба раздела заканчиваются в последний день цикла;
 *  - тексты дней public/tanakh/<дата>.json: дата — учебный день, стихи — ровно отрывок этого дня, у каждого иврит и
 *    английский; Имена — как во всём проекте; в HTML Штейнзальца — только <b> и <small class="fn">;
 *    public/tanakh/index.json перечисляет все готовые дни.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { buildCycle } from './tanakh-cycle';
import { restReason, track, SECTIONS } from '../src/core/tanakhCycle';
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
  SECTIONS.forEach((s, k) => {
    const want = track(s).slice(days[i][1 + 2 * k], days[i][2 + 2 * k]);
    const got = c[s]?.verses ?? [];
    if (got.length !== want.length || got.some((v: { b: string; c: number; v: number }, j: number) => v.b !== want[j].book.slug || v.c !== want[j].chapter || v.v !== want[j].verse))
      err(`${f} ${s}: стихи не совпадают с отрывком дня`);
    for (const v of got) {
      const where = `${f} ${v.b} ${v.c}:${v.v}`;
      if (!v.he || !v.en) err(`${where}: нет иврита или английского`);
      const he = [v.he, v.st?.he, ...(v.intro ?? []).flatMap((x: { he?: string; title: { he?: string } }) => [x.he, x.title.he])].join(' ');
      const en = [v.en, v.st?.en, ...(v.intro ?? []).flatMap((x: { en?: string; title: { en?: string } }) => [x.en, x.title.en])].join(' ');
      if (/יהוה|(^|[^א-ת])ה'(?![א-ת])/.test(he.replace(/[֑-ׇ]/g, ''))) err(`${where}: Имя не по правилам проекта (ה׳)`);
      if (/\b(God|LORD|Lord)\b/.test(en)) err(`${where}: G-d / L-rd`);
      const html = `${v.st?.he ?? ''} ${v.st?.en ?? ''}`;
      const tags = html.match(/<[^>]*>/g) ?? [];
      if (tags.some((tg) => !['<b>', '</b>', '<small class="fn">', '</small>'].includes(tg))) err(`${where}: в HTML Штейнзальца лишние теги`);
    }
  });
}

if (errors.length) {
  console.error(`✗ Пророки и Писания: ${errors.length} ошибок\n  ${errors.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Пророки и Писания: цикл ${days.length} учебных дней (${days[0][0]} – ${days[days.length - 1][0]}), готовы тексты ${files.length} дней`);
