// «Глава рождения» against Hebcal (no browser): npm run test:parsha
// Runs the game's own calendar code (hayomyom.js + lot.js) with data/parsha.json and checks, for every day
// 1900–2100 in Israel and outside Israel, the portion of «the week of that day»: the Shabbat on that day or the
// next one; a festival Shabbat with no weekly portion → the portion read the Shabbat before.
// Also checks Hebrew birthdays (day, month, year) → the same day as Hebcal.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {Sedra, HDate, parshiot} from '@hebcal/core';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ctx = vm.createContext({S: {}, LANG: 'ru', console});
for (const f of ['hayomyom.js', 'lot.js']) vm.runInContext(readFileSync(ROOT + f, 'utf8'), ctx, {filename: f});
vm.runInContext(`PARSHA = ${readFileSync(ROOT + 'data/parsha.json', 'utf8')}`, ctx);
const run = code => vm.runInContext(code, ctx);

const errors = [];
const sedras = {};
const sedra = (y, il) => sedras[`${y}-${il}`] || (sedras[`${y}-${il}`] = new Sedra(y, il));
function expected(rd, il) {
  const first = rd + ((6 - rd % 7) + 7) % 7;
  for (let sh = first; ; sh -= 7) {
    const hd = new HDate(sh), r = sedra(hd.getFullYear(), il).lookup(hd);
    if (!r.chag) return {p: r.parsha.map(p => parshiot.indexOf(p)), sh, moved: sh !== first};
  }
}
let days = 0;
const from = run('gregRD(1900,1,1)'), to = run('gregRD(2100,12,31)');
for (const il of [false, true]) {
  for (let rd = from; rd <= to; rd++) {
    const got = run(`parshaOf(${rd}, ${il})`), exp = expected(rd, il);
    if (!got || JSON.stringify([...got.p]) !== JSON.stringify(exp.p) || got.sh !== exp.sh || got.moved !== exp.moved) {
      if (errors.length < 20) errors.push(`${new HDate(rd).toString()} (${il ? 'Israel' : 'outside Israel'}): got ${JSON.stringify(got)}, expected ${JSON.stringify(exp)}`);
      else { errors.push('…'); break; }
    }
    days++;
  }
}
// Hebrew birthdays: the R.D. of a Hebrew date (with Adar of a regular year as «Adar» or «Adar I/II»)
let hdates = 0;
for (let y = 5660; y <= 5860; y += 7) {
  for (const [m, name] of [[0, 'Tishrei'], [2, 'Kislev'], [5, 'Adar I'], [6, 'Adar II'], ['adar', 'Adar'], [7, 'Nisan'], [12, 'Elul']]) {
    for (const d of [1, 15, 29]) {
      const leap = HDate.isLeapYear(y);
      const hcName = !leap && (name === 'Adar I' || name === 'Adar II') ? 'Adar' : leap && name === 'Adar' ? 'Adar II' : name;
      const exp = new HDate(d, hcName, y).abs();
      ctx.S.bday = {mode: 'h', hd: String(d), hm: m, hy: String(y)};
      const got = run('birthRD()');
      if (got !== exp && errors.length < 40) errors.push(`${d} ${name} ${y}: got R.D. ${got}, expected ${exp}`);
      hdates++;
    }
  }
}
// a regular birthday after sunset is the next Jewish day
ctx.S.bday = {mode: 'g', g: '2012-03-14', sunset: true};
if (run('birthRD()') !== run('gregRD(2012,3,15)')) errors.push('«after sunset» does not move the day');

if (errors.length) { console.error(`✗ Parsha check failed:\n  ${errors.join('\n  ')}`); process.exit(1); }
console.log(`✓ Parsha check passed: ${days} days (Israel and outside Israel) and ${hdates} Hebrew dates match Hebcal`);
