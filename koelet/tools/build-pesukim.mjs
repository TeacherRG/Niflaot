// Builds data/pesukim/ for «Твой стих в Танахе».
//
// The verses and their text come from the traditional list «פסוק המתחיל ומסתיים באות» of Torat Emet
// (https://www.toratemetfreeware.com/online/f_00720_all.html), saved by the browser as MHTML into
// tools/sources/toratemet-f_00720.mhtml: for every pair «first letter – last letter» every verse of
// Tanakh that begins and ends with them, in the order of Tanakh, with Jewish chapter and verse numbers.
//
// The Open Scriptures Hebrew Bible (morphhb, CC BY 4.0) is used only as a word list: which words are
// proper names (the verse «with your name») and which verses speak of evil, death or war (shown later).
//
//   npm pack morphhb@2.0.2 && tar xzf morphhb-2.0.2.tgz      # once, anywhere outside the repo
//   node tools/build-pesukim.mjs path/to/package/wlc
//
// Output: data/pesukim/index.json (book names, name → a verse with it) and data/pesukim/<0..21>.json, one per
// first letter: pair → its verses, the personal one first (from the Torah when it has a fitting one: short and
// bright; otherwise from the rest of Tanach), then all the others.
// Divine Names are written the way books for learning write them (ה׳, אלקים…).
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WLC = process.argv[2];
if (!WLC) { console.error('usage: node tools/build-pesukim.mjs <morphhb>/wlc'); process.exit(1); }
const SRC = join(ROOT, 'tools', 'sources', 'toratemet-f_00720.mhtml');

/* order of Tanakh: [name in Torat Emet, OSIS file of morphhb, group: 0 Torah, 1 Tehillim/Mishlei, 2 the rest, 3 lists] */
const BOOKS = [
  ['בראשית','Gen',0],['שמות','Exod',0],['ויקרא','Lev',0],['במדבר','Num',0],['דברים','Deut',0],
  ['יהושע','Josh',2],['שופטים','Judg',2],['שמואל א','1Sam',2],['שמואל ב','2Sam',2],['מלכים א','1Kgs',2],['מלכים ב','2Kgs',2],
  ['ישעיה','Isa',2],['ירמיה','Jer',2],['יחזקאל','Ezek',2],['הושע','Hos',2],['יואל','Joel',2],['עמוס','Amos',2],['עובדיה','Obad',2],
  ['יונה','Jonah',2],['מיכה','Mic',2],['נחום','Nah',2],['חבקוק','Hab',2],['צפניה','Zeph',2],['חגי','Hag',2],['זכריה','Zech',2],['מלאכי','Mal',2],
  ['תהילים','Ps',1],['משלי','Prov',1],['איוב','Job',2],['שיר השירים','Song',2],['רות','Ruth',2],['איכה','Lam',2],['קהלת','Eccl',2],
  ['אסתר','Esth',2],['דניאל','Dan',2],['עזרא','Ezra',3],['נחמיה','Neh',3],['דברי הימים א','1Chr',3],['דברי הימים ב','2Chr',3],
];
const WEIGHT = [0.75, 0.85, 1.1, 1.5];
/* chapters that are not for a children's screen: shown last */
const SKIP = {
  Gen:[19,34,38,39],Lev:[12,13,14,15,18,20],Num:[5,25,31],Deut:[21,22,23,27,28],
  Judg:[19,20,21],'2Sam':[11,13,16],'1Kgs':[14],'2Kgs':[6,9,10],Isa:[3,47],Jer:[3,13,19],
  Ezek:[4,5,16,23],Hos:[1,2,3,4],Nah:[3],Lam:[2,4],Prov:[5,6,7],Song:'all',
};
/* Strong's numbers: verses with these words go further down (evil, sword, death, blood, enemy, hatred,
   smiting, killing, destruction, harlotry, wrath, trouble, sorcery, abomination)… */
const DARK = new Set('7451 7489 7455 2719 4191 4194 4193 1818 7563 7562 341 8130 8135 5221 2026 7523 6 8045 7843 2181 2183 5003 2534 7110 6862 6869 6887 2490 3772 5307 2491 4347 5062 7701 3784 3785 8441'.split(' '));
/* …and verses with these come first (peace, kindness, joy, blessing, good, love, Torah, wisdom, song, praise, thanks) */
const LIGHT = new Set('7965 2617 8055 8057 7442 1288 1293 2896 157 160 8451 2451 7891 7892 1984 3034 8426 539 530 3820 5797 4268'.split(' '));
const DIVINE = new Set(['3068','3069','430','433','3050','7706','136','410']);

const AB = [...'אבגדהוזחטיכלמנסעפצקרשת'];
const FINAL = {'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
const letters = s => s.replace(/[^א-ת]/g, '');
const base = c => FINAL[c] || c;
const M = '[\\u0591-\\u05C7]*';   // nikud and cantillation between letters

/* Hebrew numerals: קיט → 119, טו → 15 */
const GEM = {'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ל':30,'מ':40,'נ':50,'ס':60,'ע':70,'פ':80,'צ':90,'ק':100,'ר':200,'ש':300,'ת':400};
const num = s => [...letters(s)].reduce((n, c) => n + GEM[base(c)], 0);

/* the text as books for learning print it: no ketiv in brackets, Divine Names not written out */
function display(t) {
  return t.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/[:׃]\s*$/, '').replace(/\s+/g, ' ').trim()
    .split(' ').map(w => {
      const L = letters(w);
      if (/יהוה$/.test(L)) return w.replace(new RegExp('י' + M + 'ה' + M + 'ו' + M + 'ה' + M + '$'), 'ה׳');
      if (/^[והבלמכש]{0,3}(אלהים|אלהי|אלהיך|אלהיכם|אלהינו|אלהיו|אלהיה|אלהיהם|אלהיהן|אלהיכן|אלהייך|אלוה|אלהך|אלהא|אלהין|אלהיא|אלהה|אלההון|אלהכון|אלהנא)$/.test(L))
        return w.replace(new RegExp('(ל' + M + ')ה'), '$1ק');
      if (/^[ובל]?יה$/.test(L) && w.includes('ּ')) return w.replace(new RegExp('י(' + M + ')ה'), 'ק$1ה');
      if (/^[ול]?שדי$/.test(L) && /שׁ/.test(w) && /ד[ְ-ֻ]*ּ/.test(w.normalize('NFD'))) return w.replace(new RegExp('(ש' + M + ')(ד)'), '$1-$2');
      if (/^[ול]?אדני$/.test(L) && /נָ/.test(w)) return w.replace(new RegExp('(א' + M + ')(ד)'), '$1-$2');
      if (/^[והבלכ]?אל$/.test(L) && /אֵ/.test(w)) return w.replace(new RegExp('(א' + M + ')(ל)'), '$1-$2');
      return w;
    }).join(' ');
}

/* ---------- 1. the traditional list ---------- */
const raw = readFileSync(SRC);
const part = raw.toString('latin1').split(/^------MultipartBoundary.*$/m)[1];
let html = new TextDecoder('windows-1255').decode(Buffer.from(part, 'latin1'));
html = html.replace(/<br\s*\/?>|<\/p>|<\/tr>|<\/div>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const bookIdx = Object.fromEntries(BOOKS.map((b, i) => [b[0], i]));
const list = {};   // pair → [{b, c, v, text}]
let pair = null, total = 0, wrong = 0;
for (const line of html.split('\n')) {
  let m = line.match(/^\s*([א-ת])-([א-ת])\s*$/);
  if (m) { pair = m[1] + m[2]; continue; }
  m = line.match(/^\s*\[([^\]]+?) פרק-([^\]-]+)-([^\]]+)\]\s*(.+?)\s*$/);
  if (!m || !pair) continue;
  const b = bookIdx[m[1]];
  if (b === undefined) throw new Error('unknown book ' + m[1]);
  const L = letters(m[4].replace(/\([^)]*\)/g, ''));
  if (L[0] !== pair[0] || base(L.at(-1)) !== pair[1]) { wrong++; continue; }
  (list[pair] ||= []).push({b, c: num(m[2]), v: num(m[3]), text: display(m[4])});
  total++;
}

/* ---------- 2. word list of morphhb: names and the mood of a verse ---------- */
const info = {};   // "b.c.v" → {len, np, mood, edge, ok}
const names = new Map();   // proper name → ["b.c.v"]
BOOKS.forEach(([, osis], b) => {
  const xml = readFileSync(join(WLC, osis + '.xml'), 'utf8');
  for (const m of xml.matchAll(/<verse osisID="[^.]+\.(\d+)\.(\d+)">([\s\S]*?)<\/verse>/g)) {
    const ref = `${b}.${+m[1]}.${+m[2]}`;
    const words = [...m[3].replace(/<note[\s\S]*?<\/note>/g, '').matchAll(/<w lemma="([^"]*)"[^>]*morph="([^"]*)"[^>]*>([\s\S]*?)<\/w>/g)]
      .map(w => ({lemmas: w[1].split('/').map(l => l.replace(/\s.*/, '')), morph: w[2], raw: w[3].replace(/<[^>]+>/g, '')}));
    if (!words.length) continue;
    const has = set => words.some(w => w.lemmas.some(l => set.has(l)));
    info[ref] = {
      np: words.filter(w => /Np/.test(w.morph)).length / words.length,
      mood: has(DARK) ? 3 : has(LIGHT) ? 0.7 : 1,
      edge: DIVINE.has(words[0].lemmas.at(-1)) || DIVINE.has(words.at(-1).lemmas.at(-1)),
      ok: SKIP[osis] !== 'all' && !(SKIP[osis] || []).includes(+m[1]),
    };
    for (const w of words) {
      const parts = w.raw.split('/'), mp = w.morph.slice(1).split('/');
      mp.forEach((mo, k) => {
        if (!/^Np/.test(mo) || DIVINE.has(w.lemmas[k])) return;
        const nm = letters(parts[k] || '');
        if (nm.length < 2) return;
        if (!names.has(nm)) names.set(nm, []);
        const l = names.get(nm); if (l.at(-1) !== ref) l.push(ref);
      });
    }
  }
});

/* ---------- 3. one personal verse per pair, one verse per name ---------- */
const inf = e => info[`${e.b}.${e.c}.${e.v}`] || {np: 0, mood: 1, edge: false, ok: true};
const score = e => { const i = inf(e);
  return letters(e.text).length * WEIGHT[BOOKS[e.b][2]] * (1 + 2 * i.np) * i.mood * (i.ok ? 1 : 4) * (i.edge ? 3 : 1); };
const clean = e => { const i = inf(e); return i.ok && !i.edge && i.mood < 3; };
const best = l => l.slice().sort((x, y) => score(x) - score(y))[0];
const row = e => [e.b, e.c, e.v, e.text];
/* the personal verse first: from the Torah (Chumash) when the pair has a fitting verse there, otherwise
   from the rest of Tanach; then all the other verses of the pair, the short, bright ones first */
const pairs = {};
let fromTorah = 0;
for (const k in list) {
  const torah = list[k].filter(e => BOOKS[e.b][2] === 0 && clean(e));
  if (torah.length) fromTorah++;
  const first = best(torah.length ? torah : list[k].filter(clean).length ? list[k].filter(clean) : list[k]);
  pairs[k] = [first, ...list[k].filter(e => e !== first).sort((x, y) => score(x) - score(y))].map(row);
}
/* a verse with the name: only verses of the list */
const byRef = {};
for (const k in list) for (const e of list[k]) byRef[`${e.b}.${e.c}.${e.v}`] = e;
const nameIdx = {};
for (const [nm, refs] of names) {
  const cand = refs.map(r => byRef[r]).filter(Boolean).filter(e => inf(e).ok);
  if (cand.length) nameIdx[nm] = row(best(cand.filter(e => BOOKS[e.b][2] === 0).length ? cand.filter(e => BOOKS[e.b][2] === 0) : cand));
}
const dir = join(ROOT, 'data', 'pesukim');
mkdirSync(dir, {recursive: true});
const json = JSON.stringify({src: 'Torat Emet, «פסוק המתחיל ומסתיים באות», https://www.toratemetfreeware.com/online/f_00720_all.html',
  books: BOOKS.map(b => b[0]), names: nameIdx});
writeFileSync(join(dir, 'index.json'), json + '\n');
let bytes = json.length;
AB.forEach((a, i) => {
  const out = {};
  for (const b of AB) if (pairs[a + b]) out[a + b] = pairs[a + b];
  const j = JSON.stringify(out); bytes += j.length;
  writeFileSync(join(dir, i + '.json'), j + '\n');
});
const missing = AB.flatMap(a => AB.filter(b => !list[a + b]).map(b => a + b));
console.log(`${total} verses in ${Object.keys(list).length} pairs (${wrong} skipped: letters do not match the pair); ` +
  `${fromTorah} pairs with a verse from the Torah; ${missing.length} pairs without a verse; ${Object.keys(nameIdx).length} names; ${(bytes / 1024).toFixed(0)} KB`);
