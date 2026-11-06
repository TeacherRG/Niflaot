// Builds data/hayomyom.json for «Твой день в „Hayom Yom“» from the Hebrew text of «היום יום»
// of the Lubavitcher Rebbe (tools/sources/hayomyom.pdf, Tishrei–Av) and tools/sources/hayomyom-elul.pdf (Elul),
// one entry for every day of the year.
//
//   node tools/build-hayomyom.mjs          # needs pdftotext (poppler-utils)
//
// Output: {"months": [...12 names: תשרי … אלול, Adar I and Adar II apart], "days": {"<month>-<day>": text}}.
// Paragraphs of an entry are joined with "\n". The year of the book (5703) was a leap year, so it has
// אדר א and אדר ב; a birthday in Adar of a regular year uses אדר ב (see hayomyom.js).
import {execFileSync} from 'node:child_process';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'tools', 'sources', 'hayomyom.pdf');
const MONTHS = ['תשרי','חשון','כסלו','טבת','שבט','אדר א','אדר ב','ניסן','אייר','סיון','תמוז','אב','אלול'];
const GEM = {'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ל':30};

const raw = execFileSync('pdftotext', [SRC, '-'], {encoding: 'utf8', maxBuffer: 1 << 26})
  .replace(/[‎‏‪-‮]/g, '').replace(/\r/g, '');
const lines = raw.split('\n');
/* the body begins with the second «תשרי» (the first one is the table of contents) */
const start = lines.findIndex((l, i) => l.trim() === 'תשרי' && i > 0 && !/\d/.test(l));
const norm = s => s.replace(/['"׳״]/g, '').replace(/\s+/g, ' ').trim().replace(/^מנחם אב$/, 'אב');
const days = {};
let month = -1, key = null, last = 0, buf = [];
const flush = () => {
  if (key) {
    const text = buf.join('\n').replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n\n').trim()
      .split(/\n\n+/).map(p => p.replace(/\n/g, ' ').replace(/ +/g, ' ').trim()
        /* pdftotext puts punctuation of right-to-left text before the next word: «יום ,לא» → «יום, לא» */
        .replace(/ ([,.:;!?])(?=[^\s,.:;!?])/g, '$1 ').replace(/ ([,.:;])$/, '$1').replace(/ -(?=[א-ת"'(])/g, ' – ')).filter(p => p && !/^[_*\s]+$/.test(p)).join('\n');
    if (text) days[key] = (days[key] ? days[key] + '\n' : '') + text;
  }
  buf = [];
};
for (const line of lines.slice(start)) {
  const s = line.trim();
  const mi = MONTHS.indexOf(norm(s));
  if (mi >= 0 && s.length < 10) { flush(); month = mi; key = null; last = 0; continue; }
  /* «ליום ט"ו»; twice the book has «יום ד'» or a bare «כ"ט» — taken only when it is the next day */
  const m = s.match(/^'?(ל?יום )?([א-ת]{1,2}['"]?[א-ת]?)'?$/);
  const d = m ? [...norm(m[2])].reduce((n, c) => n + (GEM[c] || 0), 0) : 0;
  if (m && month >= 0 && d && (m[1] === 'ליום ' || d === last + 1) && /['"]|ליום|יום/.test(s)) {
    flush(); last = d;
    key = `${month}-${d}`;
    continue;
  }
  if (/^\d+$/.test(s)) continue;            // page numbers
  buf.push(s);
}
flush();
/* Элул: в книге-PDF его нет, он взят со страницы Хабадпедии «היום יום/אלול», распечатанной в PDF
   (tools/sources/hayomyom-elul.pdf). Там две колонки: ссылки «עריכה» и куски адресов перемешаны с текстом,
   а заголовок дня стоит посреди абзаца, поэтому режем по меткам «תבנית - שיחה» — по одной в конце каждого дня. */
const ELUL = join(ROOT, 'tools', 'sources', 'hayomyom-elul.pdf');
if (existsSync(ELUL)) {
  const el = execFileSync('pdftotext', [ELUL, '-'], {encoding: 'utf8', maxBuffer: 1 << 26}).replace(/[‎‏‪-‮]/g, '');
  const NAV = new Set(['היום יום', 'תשרי חשוון', 'כסלו', 'טבת', 'שבט', "אדר אדר א' אדר ב' ניסן", 'אייר', 'סיון', 'תמוז', 'מנחם', 'אב', 'אלול', 'ראש חודש']);
  const junk = l => !l || NAV.has(l) || /chabadpedia|co\.il|%[0-9A-F]|&acti|on=edit|עריכה|^\)|חב"דפדיה/.test(l) || /^[א-ת]{1,2}['"]?[א-ת]?'? אלול$/.test(l);
  const segs = el.split(/^.*תבנית\s*-\s*שיחה.*$/m);
  let n = 0;
  for (const seg of segs) {
    const text = seg.split('\n').map(l => l.trim()).filter(l => !junk(l)).join(' ').replace(/\s+/g, ' ').trim()
      .replace(/ ([,.:;!?])(?=[^\s,.:;!?])/g, '$1 ').replace(/ ([,.:;])$/, '$1').replace(/ -(?=[א-ת"'(])/g, ' – ')
      .replace(/([א-ת])": (?=[א-ת])/g, '$1: "');   // «הזקן": ישראל» → «הזקן: "ישראל»
    if (!text || n >= 29) continue;
    days[`12-${++n}`] = text;
  }
  if (n !== 29) throw new Error(`Elul: ${n} days instead of 29`);
}
const missing = [];
MONTHS.forEach((_, mi) => { for (let d = 1; d <= 30; d++) if (!days[`${mi}-${d}`] && !(d === 30 && [3,6,8,10,12].includes(mi))) missing.push(`${MONTHS[mi]} ${d}`); });
mkdirSync(join(ROOT, 'data'), {recursive: true});
const json = JSON.stringify({src: 'היום יום — לקט פתגמים ומנהגים לכל יום מימות השנה, כ"ק אדמו"ר מליובאוויטש', months: MONTHS, days});
writeFileSync(join(ROOT, 'data', 'hayomyom.json'), json + '\n');
console.log(`${Object.keys(days).length} days; missing: ${missing.join(', ') || 'none'}; ${(json.length / 1024).toFixed(0)} KB`);
