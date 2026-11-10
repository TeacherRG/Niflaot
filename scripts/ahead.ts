/**
 * Запас: на сколько вперёд готово то, что пишется по неделе (владелец, 09.11.2026: «Танах есть на 2 недели вперёд —
 * как сделать, чтобы ты не забыл»). Цель — 2 недели (`TARGET` учебных дней). Печатает таблицу; запускается сам при старте
 * `npm run check` (последним) и вручную: `npx tsx scripts/ahead.ts`; Claude запускает его в начале каждой сессии (CLAUDE.md).
 * Ничего не роняет — только сообщает, что пора готовить.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import cycleJson from '../src/tanakh/cycle.json';
import retell from '../src/tanakh/retell.json';
import { allPassages, passageDate } from '../src/core/hemshech';
import { LESSONS, PARSHIOT } from '../src/lessons';

/** две недели — 12 учебных дней (вс–пт) */
const TARGET = 12;
const LANGS = ['ru', 'en', 'de'] as const;
const read = <T>(p: string): T => JSON.parse(readFileSync(p, 'utf8')) as T;
const pad = (n: number) => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const cycle = (cycleJson.days as [string, ...number[]][]).map(([d]) => d);
const future = cycle.filter((d) => d >= today);
/** сколько учебных дней с сегодняшнего по `until` включительно */
const aheadOf = (until: string) => future.filter((d) => d <= until).length;
/** последний день цикла, до которого (подряд с начала) `ok` верно */
function lastOk(ok: (date: string) => boolean): string {
  let last = '—';
  for (const d of cycle) {
    if (!ok(d)) break;
    last = d;
  }
  return last;
}

type Verse = { he: string; ru?: string; de?: string; md?: Record<string, string[]>; rashi?: Record<string, string[]> };
type Day = Record<'neviim' | 'ketuvim', { verses: Verse[] }>;
const dayCache = new Map<string, Verse[] | null>();
function verses(date: string): Verse[] | null {
  if (!dayCache.has(date)) {
    const p = `public/tanakh/${date}.json`;
    const d = existsSync(p) ? read<Day>(p) : null;
    dayCache.set(date, d ? [...d.neviim.verses, ...d.ketuvim.verses] : null);
  }
  return dayCache.get(date)!;
}
const translated = (d: string) => {
  const vs = verses(d);
  return (
    !!vs &&
    vs.every(
      (v) =>
        v.ru &&
        v.de &&
        (!v.md?.he || LANGS.every((l) => v.md![l]?.length)) &&
        (!v.rashi?.he || (v.rashi.ru?.length && v.rashi.de?.length)),
    )
  );
};

const atlasTexts = Object.fromEntries(LANGS.map((l) => [l, read<Record<string, { d?: string }>>(`src/tanakh/atlas/${l}.json`)]));
const atlasReady = (d: string) => {
  const p = `public/tanakh/atlas/${d}.json`;
  if (!existsSync(p)) return false;
  const a = read<{ o: { neviim: string[]; ketuvim: string[] } }>(p);
  return [...a.o.neviim, ...a.o.ketuvim].every((id) => LANGS.every((l) => atlasTexts[l][id]?.d));
};

// «Ключевые места» Невиим — маячок шана · нефеш · олам у отрывка дня (src/tanakh/atlas/keys.json)
const akeys = read<Record<string, unknown>>('src/tanakh/atlas/keys.json');
const keyReady = (d: string) => {
  const p = `public/tanakh/${d}.json`;
  if (!existsSync(p)) return false;
  return read<{ neviim: { verses: { b: string; c: number; v: number }[] } }>(p).neviim.verses.some((v) => `${v.b} ${v.c}:${v.v}` in akeys);
};

const quizDays = new Set(readdirSync('src/tanakh/quiz').map((f) => f.replace(/\.json$/, '')));
const RETELL = retell as Record<string, unknown>;

const trUntil = lastOk(translated);
// справки «Кто и где» пишутся вместе с переводом дня: дальше него новые имена ещё не заведены (их показывает
// fetch-atlas.py todo — нужен OSHB), поэтому и справки готовы не дальше перевода
const atlasUntil = [lastOk(atlasReady), trUntil].sort()[0];
const rows: [string, string, string][] = [
  ['Пророки и Писания — перевод (стих ru/de, Мецудат Давид ru/en/de, Раши ru/de)', trUntil, 'src/tanakh/<язык>/<книга>.json → fetch-tanakh.py tr'],
  ['Пересказ дней («Неделя в Академии»)', lastOk((d) => d in RETELL), 'src/tanakh/retell.json'],
  ['Вопросы к отрывку', lastOk((d) => quizDays.has(d)), 'src/tanakh/quiz/<дата>.json'],
  ['«Кто и где» — справки', atlasUntil, 'вместе с переводом: fetch-atlas.py todo ru <до-даты>'],
  ['«Ключевые места» Невиим (шана · нефеш · олам)', lastOk(keyReady), 'src/tanakh/atlas/keys.json — по одному на день'],
  ['Хасидут — отрывки дня', passageDate(allPassages().length - 1), 'src/hemshech/5666.json'],
];

const out: string[] = [`Запас подготовленного (сегодня ${today}; цель — ${TARGET} учебных дней ≈ 2 недели):`];
let behind = 0;
for (const [name, until, how] of rows) {
  const n = until === '—' ? 0 : aheadOf(until);
  const ok = n >= TARGET;
  if (!ok) behind++;
  out.push(`  ${ok ? '✓' : '⚠'} ${name}: до ${until} — ${n} уч. дн. вперёд${ok ? '' : `  → готовить: ${how}`}`);
}

// уроки недельной главы: последняя глава с уроком каждого учителя и её Шабат
const lastShabbat = Object.values(PARSHIOT).map((p) => p.shabbat).sort().at(-1)!;
for (const [name, pick] of [
  ['Бааль ґа-Турим', (s?: string) => s !== 'rebbe'],
  ['«Нифлаот Ребе»', (s?: string) => s === 'rebbe'],
] as const) {
  const ps = LESSONS.filter((l) => pick(l.series) && l.kind !== undefined).map((l) => PARSHIOT[l.parsha as keyof typeof PARSHIOT]?.shabbat).filter(Boolean).sort();
  const last = ps.at(-1) ?? '—';
  const days = Math.round((Date.parse(last) - Date.parse(today)) / 86400000);
  const ok = days >= 7;
  if (!ok) behind++;
  out.push(`  ${ok ? '✓' : '⚠'} Уроки главы — ${name}: последний — к Шабату ${last} (${days >= 0 ? `через ${days} дн.` : 'уже прошёл'})${ok ? '' : '  → нужен урок следующей главы'}`);
}
if (lastShabbat < today) out.push(`  ⚠ В src/lessons/parshiot.ts нет главы этой недели — добавить следующую.`);
out.push(behind ? `Отстаёт: ${behind}. Скажи владельцу и предложи подготовить (сначала то, что кончается раньше).` : 'Всё готово на 2 недели вперёд.');
console.log(out.join('\n'));
