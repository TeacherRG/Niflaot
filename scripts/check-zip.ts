/**
 * «Zip — стих Торы» (src/core/zip.ts; часть npm run check):
 *  - стихи — только с комментарием Бааль ґа-Турима из уроков, у каждого — иврит, перевод на ru/en/de, ссылка на урок;
 *  - на каждом уровне у каждого стиха поле решаемо: скрытый путь проходит все клетки ровно раз, соседними шагами,
 *    числа на нём — по порядку, 1 — в начале, последнее — в конце; слова стиха разложены по числам все и по порядку;
 *    само решение проходит через `canStep` и `solved`, а «Подсказка» ведёт по нему;
 *  - выбор стиха: каждый следующий — другой, пока не собраны все; уровни: без подсказок — выше, с 3+ — ниже;
 *  - слияние (src/core/sync.ts): все собранные стихи, уровень — больший.
 */
import { LEVELS, MAX_LEVEL, adjacent, canStep, stepBlock, reachedCount, hintLine, makeBoard, nextLevel, pickVerse, recordWin, solved, verseTranslation, zipPool, type ZipState } from '../src/core/zip';
import { mergeSnapshots } from '../src/core/sync';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

const pool = zipPool();
if (pool.length < 20) err(`мало стихов для Zip: ${pool.length}`);
if (new Set(pool.map((z) => z.ref)).size !== pool.length) err('стих в пуле дважды');

for (const z of pool) {
  if (!z.bht.length || !z.bht.every((id) => id.startsWith('bht-'))) err(`${z.ref}: нет Бааль ґа-Турима`);
  if (!/^#\/[\w-]+\/read\/\d+$/.test(z.link)) err(`${z.ref}: ссылка ${z.link}`);
  if (z.words.some((w) => /[<>]/.test(w))) err(`${z.ref}: разметка в словах`);
  for (const l of ['ru', 'en', 'de'] as const) if (!verseTranslation(z, l).trim()) err(`${z.ref}: нет перевода ${l}`);
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const b = makeBoard(z, level);
    const { n } = LEVELS[level - 1];
    const at = `${z.ref}, уровень ${level}`;
    if (b.n !== n || b.path.length !== n * n || new Set(b.path).size !== n * n) {
      err(`${at}: путь не проходит все клетки`);
      continue;
    }
    if (b.path.some((c, i) => i && !adjacent(b.path[i - 1], c, n))) err(`${at}: путь с прыжком`);
    const idx = b.nodes.map((x) => b.path.indexOf(x.cell));
    if (idx[0] !== 0 || idx[idx.length - 1] !== n * n - 1 || idx.some((p, i) => i && p <= idx[i - 1])) err(`${at}: числа не по порядку`);
    if (b.nodes.flatMap((x) => x.words).join(' ') !== z.words.join(' ') || b.nodes.some((x) => !x.words.length)) err(`${at}: слова стиха`);
    if (b.nodes.length > LEVELS[level - 1].k || b.nodes.length < 2) err(`${at}: чисел ${b.nodes.length}`);
    let line = [b.path[0]];
    for (const c of b.path.slice(1)) {
      if (!canStep(b, line, c)) {
        err(`${at}: решение не проходит canStep`);
        break;
      }
      line = [...line, c];
    }
    if (!solved(b, line)) err(`${at}: решение не засчитано`);
    // the last number — only as the last cell: a line with all the other numbers, next to it, with cells left — can't enter
    const last = b.nodes[b.nodes.length - 1].cell;
    for (let k = 1; k < b.path.length - 2; k++) {
      const pre = b.path.slice(0, k + 1);
      if (adjacent(pre[pre.length - 1], last, n) && reachedCount(b, pre) === b.nodes.length - 1 && stepBlock(b, pre, last) !== 'last')
        err(`${at}: в последнее число можно войти раньше конца`);
    }
    if (stepBlock(b, b.path.slice(0, -1), last) !== null) err(`${at}: последним шагом в последнее число не войти`);
    let h = [] as number[];
    for (let i = 0; i < n * n; i++) h = hintLine(b, h);
    if (!solved(b, h)) err(`${at}: подсказки не доводят до конца`);
    if (level === 1 && makeBoard(z, 1).path.join() !== b.path.join()) err(`${at}: «Заново» даёт другое поле`);
  }
}

// a different verse every visit, until all are solved
let s: ZipState = { l: 1, d: {} };
const seen = new Set<string>();
for (let day = 0; day < pool.length; day++) {
  const date = `2026-11-${String((day % 28) + 1).padStart(2, '0')}`;
  const v = pickVerse(pool, s, date)!;
  if (seen.has(v.ref)) err(`стих повторился до конца пула: ${v.ref}`);
  if (s.c?.d === date && s.c.v === v.ref) err('после решения — тот же стих');
  seen.add(v.ref);
  s = { ...s, c: { d: date, v: v.ref } };
  if (pickVerse(pool, s, date)!.ref !== v.ref) err('нерешённый стих дня поменялся в тот же день');
  s = recordWin(s, v.ref, date, 60, 0);
}
if (s.l !== MAX_LEVEL) err(`без подсказок уровень не дорос до ${MAX_LEVEL}: ${s.l}`);
const next = pickVerse(pool, s, '2026-12-01')!;
if (next.ref === s.c?.v) err('после всех стихов — снова последний');
const unsolved = { ...s, c: { d: '2026-12-01', v: pool[0].ref }, d: {} };
if (pickVerse(pool, unsolved, '2026-12-02')!.ref === pool[0].ref) err('на следующий день — тот же нерешённый стих');
if (nextLevel(3, 0) !== 4 || nextLevel(3, 1) !== 3 || nextLevel(3, 3) !== 2 || nextLevel(1, 5) !== 1 || nextLevel(MAX_LEVEL, 0) !== MAX_LEVEL) err('правила уровня');

const m = mergeSnapshots(
  { 'niflaot:zip': JSON.stringify({ l: 3, d: { 'Genesis 1:1': ['2026-11-01', 2, 40, 0] }, c: { d: '2026-11-02', v: 'Genesis 2:2' } }) },
  { 'niflaot:zip': JSON.stringify({ l: 5, d: { 'Genesis 1:1': ['2026-10-30', 4, 90, 1], 'Genesis 2:3': ['2026-10-31', 3, 50, 0] } }) },
)['niflaot:zip'];
if (m !== JSON.stringify({ l: 5, d: { 'Genesis 1:1': ['2026-10-30', 4, 90, 1], 'Genesis 2:3': ['2026-10-31', 3, 50, 0] }, c: { d: '2026-11-02', v: 'Genesis 2:2' } })) err(`слияние Zip: ${m}`);

if (errors.length) {
  console.error(`Zip — стих Торы: ${errors.length} ошибок\n` + errors.slice(0, 30).join('\n'));
  process.exit(1);
}
console.log(`Zip — стих Торы: ${pool.length} стихов × ${MAX_LEVEL} уровней — поля решаемы, стихи не повторяются`);
