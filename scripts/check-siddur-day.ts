/**
 * Вставки Амиды по календарю (src/core/siddurDay.ts) и их разметка в тексте сидура — run by `npm run check`.
 */
import { readFileSync } from 'node:fs';
import { siddurConds, type SiddurCond } from '../src/core/siddurDay';
import type { Prayer } from '../src/core/siddur';

let failed = 0;
const ok = (cond: unknown, what: string) => {
  if (!cond) {
    failed++;
    console.error(`✗ siddur-day: ${what}`);
  }
};
const has = (prayer: Prayer, iso: string, want: SiddurCond[], not: SiddurCond[] = [], il = false) => {
  const c = siddurConds(prayer, iso, il);
  for (const w of want) ok(c.has(w), `${prayer} ${iso}: expected ${w}, got ${[...c].join(',')}`);
  for (const w of not) ok(!c.has(w), `${prayer} ${iso}: unexpected ${w}`);
};

has('mincha', '2026-11-25', ['geshem', 'bracha'], ['tal', 'matar', 'aseret', 'fast', 'yaale', 'hanisim']);
has('shacharit', '2026-12-04', ['bracha'], ['matar']); // diaspora: «טל ומטר» from the night of 4 December
has('shacharit', '2026-12-05', ['matar', 'chanukah', 'hanisim']);
has('shacharit', '2027-12-05', ['bracha'], ['matar']); // 2028 is a leap year: from the night of 5 December
has('shacharit', '2027-12-06', ['matar']);
has('shacharit', '2026-11-17', ['matar'], [], true); // Israel: from 7 Cheshvan
has('mincha', '2026-12-20', ['fast']); // 10 Tevet
has('shacharit', '2026-12-20', [], ['fast']); // Aneinu of the individual — only at Mincha
has('mincha', '2026-09-14', ['aseret', 'fast', 'tal']); // Tzom Gedaliah
has('mincha', '2027-03-23', ['purim', 'hanisim']);
has('mincha', '2027-08-12', ['fast', 'av9']);
has('shacharit', '2027-08-12', [], ['av9']);
has('shacharit', '2026-10-11', ['rc', 'yaale', 'geshem']); // 30 Tishrei
has('mincha', '2027-04-24', ['pesach', 'yaale', 'tal']);
has('shacharit', '2026-10-03', ['tal'], ['geshem']); // Shacharit of Shemini Atzeret — still «מוריד הטל»
has('mincha', '2026-10-03', ['geshem']);
has('maariv', '2026-10-04', ['havdalah']); // the night after Shabbat
has('maariv', '2026-10-06', [], ['havdalah']);

// outside the Amidah (2026-11-25 — Wednesday, 15 Kislev)
has('shacharit', '2026-11-25', ['day4', 'tachanun'], ['day3', 'monthu', 'avinu', 'elul', 'rc']);
has('shacharit', '2026-11-26', ['day5', 'monthu', 'tachanun']);
has('shacharit', '2026-11-28', [], ['tachanun', 'day1', 'day6']); // Shabbat
has('mincha', '2026-11-27', [], ['tachanun']); // Friday Mincha
has('shacharit', '2026-11-29', [], ['tachanun']); // 19 Kislev
has('mincha', '2026-11-28', [], ['tachanun']); // Mincha before 19 Kislev (Shabbat anyway)
has('shacharit', '2026-12-05', ['chanukah'], ['tachanun', 'erechapayim']);
has('shacharit', '2026-12-20', ['avinu', 'taanit', 'tachanun', 'day1']); // 10 Tevet: Avinu Malkenu, «זכרנו»
has('shacharit', '2026-09-14', ['avinu', 'aseret', 'elul'], ['taanit']); // Tzom Gedaliah — «כתבנו»
has('shacharit', '2026-09-21', [], ['avinu', 'tachanun']); // Erev Yom Kippur
has('shacharit', '2026-08-14', ['elul']); // 1 Elul 5786
has('shacharit', '2026-10-02', ['elul'], ['tachanun']); // Hoshana Rabbah
has('shacharit', '2026-10-05', [], ['elul']);
has('shacharit', '2027-04-12', [], ['tachanun']); // Nisan
has('mincha', '2027-03-22', ['taanit'], ['avinu', 'tachanun']); // Taanit Esther Mincha — no Tachanun before Purim
has('shacharit', '2027-03-22', ['avinu', 'taanit', 'tachanun']);
has('shacharit', '2027-08-12', ['tishabav'], ['tachanun', 'avinu', 'erechapayim']);
has('shacharit', '2026-11-12', ['day5', 'monthu', 'erechapayim']);
has('maariv', '2026-11-29', ['motzash', 'vihinoam', 'havdalah']); // Saturday night: the prayer day is Sunday
has('maariv', '2027-04-18', ['motzash'], ['vihinoam']); // Saturday night before Pesach (Thursday 22 Apr — Yom Tov)

// every condition in the text is one the calendar knows; every insertion is closed
const KNOWN = new Set(['aseret', 'tal', 'geshem', 'bracha', 'matar', 'fast', 'av9', 'rc', 'pesach', 'sukkot', 'yaale', 'chanukah', 'purim', 'hanisim', 'havdalah', 'chazan',
  'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'elul', 'tachanun', 'monthu', 'avinu', 'taanit', 'erechapayim', 'tishabav', 'motzash', 'vihinoam']);
for (const prayer of ['shacharit', 'mincha', 'maariv', 'birkat-hamazon']) {
  const data = JSON.parse(readFileSync(`public/reading/siddur/${prayer}-he.json`, 'utf8')) as { sections: { title: string; lines: string[] }[] };
  let conds = 0;
  for (const s of data.sections)
    for (const line of s.lines) {
      const open = [...line.matchAll(/⟦\?(!?)([a-z0-9]+)⟧/g)];
      conds += open.length;
      for (const m of open) ok(KNOWN.has(m[2]), `${prayer}: unknown condition ${m[2]}`);
      ok(open.length === (line.match(/⟦\/⟧/g) ?? []).length, `${prayer}: unclosed insertion in «${line.slice(0, 40)}…»`);
    }
  ok(conds >= 6, `${prayer}: only ${conds} insertions marked`);
}

if (failed) process.exit(1);
console.log('✓ siddur-day: insertions by the calendar');
