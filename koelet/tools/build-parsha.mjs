// Builds data/parsha.json for «Глава рождения» (the weekly Torah portion of the week one was born).
//
// The schedule of the weekly portions repeats by «year type»: the weekday of Rosh Hashana and the length
// of the year (353…385 days), separately for Israel and outside Israel — the classic tables of the Tur.
// This script takes the schedule from Hebcal (@hebcal/core, dev dependency only — it never reaches the
// browser), stores one list per year type and checks that every year 5500–6400 follows its type exactly.
// Verse ranges of the portions come from @hebcal/leyning. The game computes the year type itself
// (hebNewYear() in hayomyom.js) and looks the Shabbat up in these lists (parshaOf() in lot.js).
//
//   node tools/build-parsha.mjs
//
// Output: data/parsha.json
//   he      — 54 portion names in Hebrew (0 Bereshit … 53 Vezot Haberakhah)
//   ranges  — [book 0–4, chapter, verse, chapter, verse] for each portion
//   d / il  — "<weekday of Rosh Hashana 0=Sun…6=Sat>-<days in year>" → one entry per Shabbat from the first
//             Shabbat on or after Rosh Hashana until the last one before the next: portion index, [a, b] for
//             two portions read together, or null — a festival Shabbat with no weekly portion.
import {writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Sedra, HDate, parshiot} from '@hebcal/core';
import {getLeyningForParsha} from '@hebcal/leyning';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HE = ['בראשית','נח','לך לך','וירא','חיי שרה','תולדות','ויצא','וישלח','וישב','מקץ','ויגש','ויחי',
  'שמות','וארא','בא','בשלח','יתרו','משפטים','תרומה','תצוה','כי תשא','ויקהל','פקודי',
  'ויקרא','צו','שמיני','תזריע','מצורע','אחרי מות','קדושים','אמור','בהר','בחוקותי',
  'במדבר','נשא','בהעלותך','שלח','קרח','חקת','בלק','פינחס','מטות','מסעי',
  'דברים','ואתחנן','עקב','ראה','שופטים','כי תצא','כי תבוא','נצבים','וילך','האזינו','וזאת הברכה'];
if (HE.length !== 54 || parshiot.length !== 54) throw new Error('expected 54 portions');

const BOOK = {Genesis: 0, Exodus: 1, Leviticus: 2, Numbers: 3, Deuteronomy: 4};
const ranges = parshiot.map(name => {
  const m = getLeyningForParsha(name).summary.match(/^(\w+) (\d+):(\d+)-(?:(\d+):)?(\d+)$/);
  if (!m || !(m[1] in BOOK)) throw new Error('cannot read the range of ' + name);
  return [BOOK[m[1]], +m[2], +m[3], +(m[4] || m[2]), +m[5]];
});

const out = {src: 'Hebcal (@hebcal/core, @hebcal/leyning) — schedule by year type, checked for the years 5500–6400', he: HE, ranges, d: {}, il: {}};
let years = 0;
for (const il of [false, true]) {
  const types = out[il ? 'il' : 'd'];
  for (let y = 5500; y <= 6400; y++) {
    const rh = new HDate(1, 'Tishrei', y).abs(), next = new HDate(1, 'Tishrei', y + 1).abs();
    const key = `${rh % 7}-${next - rh}`, sedra = new Sedra(y, il), list = [];
    for (let sh = rh + ((6 - rh % 7) + 7) % 7; sh < next; sh += 7) {
      const r = sedra.lookup(new HDate(sh));
      if (r.chag) { list.push(null); continue; }
      const idx = r.parsha.map(p => parshiot.indexOf(p));
      if (idx.some(i => i < 0)) throw new Error(`${y}: unknown portion ${r.parsha}`);
      list.push(idx.length === 1 ? idx[0] : idx);
    }
    const s = JSON.stringify(list);
    if (!(key in types)) types[key] = list;
    else if (JSON.stringify(types[key]) !== s) throw new Error(`${y} (${il ? 'Israel' : 'outside Israel'}) does not follow its year type ${key}`);
    years++;
  }
}
const n = o => Object.keys(o).length;
// one list per line: easy to read and to review in a diff
const J = JSON.stringify, block = o => '{\n' + Object.entries(o).map(([k, v]) => `  ${J(k)}: ${J(v)}`).join(',\n') + '\n }';
const json = `{\n "src": ${J(out.src)},\n "he": ${J(HE)},\n "ranges": [\n${ranges.map(r => '  ' + J(r)).join(',\n')}\n ],\n "d": ${block(out.d)},\n "il": ${block(out.il)}\n}\n`;
JSON.parse(json);
writeFileSync(join(ROOT, 'data', 'parsha.json'), json);
console.log(`data/parsha.json: ${n(out.d)} year types outside Israel, ${n(out.il)} in Israel; ${years} years checked`);
