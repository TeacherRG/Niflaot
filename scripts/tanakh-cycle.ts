/**
 * Расписание трёхлетнего цикла «Пророки» и «Писания» (правила — src/core/tanakhCycle.ts):
 *     npx tsx scripts/tanakh-cycle.ts   → src/tanakh/cycle.json
 * Каждый учебный день — [дата, Невиим с, до, Ктувим с, до] (номера стихов в разделе, «до» не входит).
 */
import { writeFileSync } from 'node:fs';
import { CYCLE_START, splitTrack, studyDays, rangeLabel, track } from '../src/core/tanakhCycle';

export function buildCycle() {
  const days = studyDays();
  const n = splitTrack('neviim', days.length);
  const k = splitTrack('ketuvim', days.length);
  return { start: CYCLE_START, end: days[days.length - 1], days: days.map((d, i) => [d, n[i], n[i + 1], k[i], k[i + 1]] as const) };
}

if (process.argv[1]?.endsWith('tanakh-cycle.ts')) {
  const c = buildCycle();
  const out = new URL('../src/tanakh/cycle.json', import.meta.url);
  writeFileSync(out, `{"start":"${c.start}","end":"${c.end}","days":[\n${c.days.map((d) => JSON.stringify(d)).join(',\n')}\n]}\n`);
  console.log(`${c.days.length} учебных дней, ${c.start} – ${c.end}; Невиим ${track('neviim').length} стихов, Ктувим ${track('ketuvim').length}`);
  for (const [d, na, nz, ka, kz] of c.days.slice(0, 8))
    console.log(d, '|', rangeLabel('neviim', [na, nz], 'ru'), '|', rangeLabel('ketuvim', [ka, kz], 'ru'));
  const last = c.days[c.days.length - 1];
  console.log('…', last[0], '|', rangeLabel('neviim', [last[1], last[2]], 'ru'), '|', rangeLabel('ketuvim', [last[3], last[4]], 'ru'));
}
