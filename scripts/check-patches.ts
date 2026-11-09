/**
 * «Лоскуты гематрии» (src/core/patches.ts; часть npm run check):
 *  - на каждом уровне поля (по 60 зёрен) — решение одно; скрытое решение закрывает все клетки ровно раз,
 *    у каждой буквы свой прямоугольник её гематрии и формы, внутри — ни одной другой буквы; размеры — по правилам уровня;
 *  - «Подсказка» ведёт к решению; буквы-числа — как пишут (ט״ו, ט״ז), их сумма = число;
 *  - уровень: без подсказок и ≤ 1 ошибки — выше, 5 ошибок или 2 подсказки — ниже, иначе тот же; границы 1…MAX_LEVEL.
 */
import { LEVELS, MAX_LEVEL, area, check, countSolutions, hintRect, inside, letterOf, lettersOf, makeBoard, nextLevel, recordWin, shapeOf, solved, type Rect } from '../src/core/patches';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

for (let level = 1; level <= MAX_LEVEL; level++) {
  const L = LEVELS[level - 1];
  for (let seed = 0; seed < 60; seed++) {
    const at = `уровень ${level}, поле ${seed}`;
    const b = makeBoard(level, seed);
    if (b.n !== L.n) err(`${at}: размер ${b.n}`);
    if (b.clues.length !== b.solution.length) err(`${at}: букв ${b.clues.length}, прямоугольников ${b.solution.length}`);
    const cover = new Array(b.n * b.n).fill(0);
    b.solution.forEach((x, i) => {
      const k = b.clues[i];
      for (let r = x.r; r < x.r + x.h; r++) for (let c = x.c; c < x.c + x.w; c++) cover[r * b.n + c]++;
      if (!inside(x, k.cell, b.n)) err(`${at}: буква ${i} вне своего прямоугольника`);
      if (area(x) !== k.value) err(`${at}: ${letterOf(k.value)} ≠ ${area(x)} клеток`);
      if (k.shape !== 'any' && k.shape !== shapeOf(x)) err(`${at}: форма буквы ${i}`);
      if (area(x) > L.max || area(x) < 2) err(`${at}: прямоугольник из ${area(x)} клеток`);
      if (check(b, x)) err(`${at}: решение не проходит проверку`);
    });
    if (!cover.every((v) => v === 1)) err(`${at}: решение закрывает не все клетки ровно раз`);
    if (!solved(b, b.solution)) err(`${at}: solved() не принимает решение`);
    if (countSolutions(b, 3) !== 1) err(`${at}: решений не одно`);
    // the hints, one by one, solve the board
    let rects: Rect[] = [];
    for (let guard = 0; guard < 100 && !solved(b, rects); guard++) {
      const h = hintRect(b, rects);
      if (!h) break;
      rects = [...rects, h];
    }
    if (!solved(b, rects)) err(`${at}: подсказки не доводят до решения`);
    if (JSON.stringify(makeBoard(level, seed)) !== JSON.stringify(b)) err(`${at}: «Заново» даёт другое поле`);
  }
}

for (let v = 1; v <= 99; v++) {
  if (lettersOf(v).reduce((s, [, x]) => s + x, 0) !== v) err(`${v}: буквы ${letterOf(v)} не дают число`);
}
if (letterOf(15) !== 'ט״ו' || letterOf(16) !== 'ט״ז' || letterOf(12) !== 'י״ב' || letterOf(5) !== 'ה') err('буквы-числа пишутся не так');

if (nextLevel(3, 0, 0) !== 4 || nextLevel(3, 1, 0) !== 4) err('чисто решено — уровень не растёт');
if (nextLevel(3, 3, 0) !== 3 || nextLevel(3, 0, 1) !== 3) err('с ошибками / подсказкой — уровень должен остаться');
if (nextLevel(3, 5, 0) !== 2 || nextLevel(3, 0, 2) !== 2) err('много ошибок / подсказок — уровень не снижается');
if (nextLevel(1, 9, 9) !== 1 || nextLevel(MAX_LEVEL, 0, 0) !== MAX_LEVEL) err('уровень вышел за границы');
const s = recordWin({ l: 2, g: 4, b: {} }, 2, 50, 0, 0);
if (s.l !== 3 || s.g !== 5 || s.b[2] !== 50) err('recordWin');

if (errors.length) {
  console.error(`✗ Лоскуты гематрии: ${errors.length} ошибок\n` + errors.slice(0, 30).join('\n'));
  process.exit(1);
}
console.log(`✓ Лоскуты гематрии: ${MAX_LEVEL} уровней × 60 полей — у каждого одно решение, подсказки ведут к нему`);
