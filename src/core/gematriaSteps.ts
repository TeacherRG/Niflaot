import { VALUES, letters } from './gematria';
import { solve } from './mentalMath';

/**
 * Gematria of a word, explained for mental arithmetic. Hebrew letters already carry their place value
 * (units א–ט, tens י–צ, hundreds ק–ת), so we add hundreds, then tens, then units, and finally join
 * the three sums left to right — the same "by place value" technique as in the Mental math section.
 */
export interface GematriaSteps {
  letters: { c: string; v: number }[];
  /** non-empty groups, from hundreds to units */
  groups: { rank: 'hundreds' | 'tens' | 'units'; letters: string[]; values: number[]; sum: number }[];
  /** joining the group sums: "300 + 70 = 370", "370 + 6 = 376" */
  join: string[];
  total: number;
}

export function gematriaSteps(text: string): GematriaSteps {
  const ls = letters(text).map((c) => ({ c, v: VALUES[c] }));
  const groups = (
    [
      ['hundreds', (v: number) => v >= 100],
      ['tens', (v: number) => v >= 10 && v < 100],
      ['units', (v: number) => v < 10],
    ] as const
  )
    .map(([rank, test]) => {
      const g = ls.filter((l) => test(l.v));
      return { rank, letters: g.map((l) => l.c), values: g.map((l) => l.v), sum: g.reduce((a, l) => a + l.v, 0) };
    })
    .filter((g) => g.letters.length);
  const join: string[] = [];
  let cur = groups[0]?.sum ?? 0;
  for (const g of groups.slice(1)) {
    join.push(...solve({ op: 'add', a: cur, b: g.sum }).map((s) => s.text));
    cur += g.sum;
  }
  return { letters: ls, groups, join, total: cur };
}
