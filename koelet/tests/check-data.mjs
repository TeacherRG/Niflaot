// Fast data check (no browser): npm run test:data
// Compares every language with Russian (the reference) and reports:
//  - invalid JSON, missing files or keys;
//  - different structure (keys, list lengths, step order);
//  - changed technical values (type, key, ic, game, who: "mentor", Hebrew...);
//  - {{placeholders}} and {boy|girl} forms that don't match or aren't closed;
//  - wrong alphabet (Cyrillic in German, Russian-only letters in Ukrainian);
//  - inline style="…" in texts (the CSP blocks it).
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {imgSize, scanArt} from '../tools/art-files.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REF = 'ru';
const TECH = new Set(['type','key','game','ic','art','mood','age','tool','he','heb','pic','item','__dynamic','__ag','skin','hair','style','M']);
const ALPHABET = {
  de: {bad: /[А-Яа-яЁёІіЇїЄєҐґ]/, what: 'Cyrillic letters'},
  en: {bad: /[А-Яа-яЁёІіЇїЄєҐґ]/, what: 'Cyrillic letters'},
  uk: {bad: /[ЫыЭэЪъЁё]/, what: 'Russian-only letters (ы, э, ъ, ё)'}
};
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

const i18n = await readFile(ROOT + 'i18n.js', 'utf8');
const langs = [...i18n.match(/const LANGS = \{([\s\S]*?)\};/)[1].matchAll(/^\s*(\w+):\{name:/gm)].map(m => m[1]);
const files = JSON.parse(i18n.match(/const CONTENT_FILES = (\[[^\]]*\])/)[1].replace(/'/g, '"'));

async function load(path) {
  try { return JSON.parse(await readFile(ROOT + path, 'utf8')); }
  catch (e) { err(path, e.code === 'ENOENT' ? 'file is missing' : 'invalid JSON — ' + e.message); return undefined; }
}
const placeholders = s => (s.match(/\{\{\w+\}\}/g) || []).sort().join(' ');
function checkString(where, s, lang) {
  // the CSP allows styles only from styles.css: an inline style in a text is dropped by the browser
  if (/\sstyle\s*=|<style/i.test(s)) err(where, `inline style in "${s.slice(0, 60)}" — use a class from styles.css`);
  const plain = s.replace(/\{\{\w+\}\}/g, '');
  const opens = (plain.match(/\{/g) || []).length, closes = (plain.match(/\}/g) || []).length;
  if (opens !== closes) err(where, `unbalanced { } in "${s.slice(0, 60)}"`);
  for (const m of plain.matchAll(/\{([^{}]*)\}/g)) if (!m[1].includes('|')) err(where, `gender form without "|": {${m[1]}}`);
  const a = ALPHABET[lang];
  if (a && a.bad.test(s)) err(where, `${a.what} in "${s.slice(0, 60)}"`);
}
// Walk reference and translation side by side.
function compare(where, ref, val, lang, key) {
  const t = v => Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v;
  if (t(ref) !== t(val)) { err(where, `expected ${t(ref)}, got ${t(val)}`); return; }
  if (Array.isArray(ref)) {
    if (ref.length !== val.length) err(where, `list has ${val.length} items, ${REF} has ${ref.length}`);
    ref.forEach((r, i) => i < val.length && compare(`${where}[${i}]`, r, val[i], lang, key));
  } else if (t(ref) === 'object') {
    for (const k of Object.keys(ref)) {
      if (!(k in val)) err(where, `missing key "${k}"`);
      else compare(`${where}.${k}`, ref[k], val[k], lang, k);
    }
    for (const k of Object.keys(val)) if (!(k in ref)) err(where, `extra key "${k}"`);
  } else if (typeof ref === 'string') {
    if (TECH.has(key) || (key === 'who' && ref === 'mentor')) {
      if (ref !== val) err(where, `technical value changed: "${ref}" → "${val}"`);
    } else {
      if (placeholders(ref) !== placeholders(val)) err(where, `placeholders differ: "${placeholders(ref)}" vs "${placeholders(val)}"`);
      checkString(where, val, lang);
    }
  }
}

for (const lang of langs) {
  if (lang !== REF) {
    for (const f of files) {
      const ref = await load(`content/${REF}/${f}.json`), val = await load(`content/${lang}/${f}.json`);
      if (ref !== undefined && val !== undefined) compare(`content/${lang}/${f}.json`, ref, val, lang);
    }
    const ref = await load(`locales/${REF}.json`), val = await load(`locales/${lang}.json`);
    if (ref !== undefined && val !== undefined) compare(`locales/${lang}.json`, ref, val, lang);
  } else {
    for (const f of files) await load(`content/${REF}/${f}.json`);
    await load(`locales/${REF}.json`);
  }
}

// the author's own backgrounds for «Картина со стихом» (gallery/backgrounds.json, see gallery/README.md)
{
  const own = await load('gallery/backgrounds.json');
  const FMT = {phone: [1170, 2532], screen: [3840, 2160], print: [2480, 3508]}, BUILTIN = ['deep', 'night', 'dawn'];
  const ids = new Set();
  const size = imgSize;
  for (const [n, s] of ((own && own.scenes) || []).entries()) {
    const where = `gallery/backgrounds.json scene ${n + 1}${s && s.id ? ` «${s.id}»` : ''}`;
    if (!s || !/^[a-z0-9-]+$/.test(s.id || '')) { err(where, 'id must be latin letters, digits or -'); continue; }
    if (BUILTIN.includes(s.id) || ids.has(s.id)) err(where, 'id is already taken'); ids.add(s.id);
    for (const l of langs) if (!s.name || typeof s.name[l] !== 'string' || !s.name[l].trim()) err(where, `no name in ${l}`);
    const files = Object.entries(s.files || {});
    if (!files.length) err(where, 'needs at least one file in files: phone, screen or print');
    for (const [f, file] of files) {
      if (!FMT[f]) { err(where, `unknown format "${f}" (phone, screen, print)`); continue; }
      if (!/^[\w.-]+\.(jpe?g|png|webp)$/i.test(file || '')) { err(where, `${f}: "${file}" — a latin file name .jpg, .png or .webp next to backgrounds.json`); continue; }
      let b; try { b = await readFile(ROOT + 'gallery/' + file); } catch (e) { err(where, `${f}: gallery/${file} is missing`); continue; }
      const wh = size(b);
      if (!wh) err(where, `${f}: cannot read the size of ${file}`);
      else if (wh[0] < FMT[f][0] / 2 || wh[1] < FMT[f][1] / 2) err(where, `${f}: ${file} is ${wh.join('×')}, too small (best ${FMT[f].join('×')})`);
      if (b.length > 4e6) err(where, `${f}: ${file} is ${(b.length / 1e6).toFixed(1)} MB — compress it below 4 MB`);
    }
    for (const p of s.pairs || []) if (!/^[אבגדהוזחטיכלמנסעפצקרשת]{2}$/.test(p)) err(where, `pair "${p}" must be two Hebrew letters (no final forms), e.g. "מה"`);
    for (const [f, band] of Object.entries(s.band || {})) if (!FMT[f] || !Array.isArray(band) || band.length !== 2 || !(band[0] >= 0 && band[0] < band[1] && band[1] <= 1)) err(where, `band.${f} must be [top, bottom] between 0 and 1`);
    if (s.shade != null && !(s.shade >= 0 && s.shade <= 1)) err(where, 'shade must be between 0 and 1');
  }
}

// the artist's pictures (art/<age>/{bg,keeper,avatar}/, see art/README.md): names, sizes, and art/manifest.json up to date
{
  const {manifest, problems} = await scanArt(ROOT);
  for (const p of problems) err('art', p);
  const have = await load('art/manifest.json');
  if (have && JSON.stringify(have) !== JSON.stringify(manifest)) err('art/manifest.json', 'does not match the files in art/ — run npm run art');
}

// finished pictures for verses uploaded by the admin (gallery/verses.json: "book-chapter-verse" → files in gallery/)
{
  const vs = await load('gallery/verses.json');
  for (const [key, list] of Object.entries(vs || {})) {
    const where = `gallery/verses.json «${key}»`;
    if (!/^\d{1,2}-\d{1,3}-\d{1,3}$/.test(key)) err(where, 'key must be "book-chapter-verse", e.g. "27-20-5"');
    if (!Array.isArray(list) || !list.length) { err(where, 'needs a list of files'); continue; }
    for (const f of list) {
      if (!/^[\w.-]+\.(jpe?g|png|webp)$/i.test(f || '')) { err(where, `"${f}" — a latin file name .jpg, .png or .webp`); continue; }
      try { const b = await readFile(ROOT + 'gallery/' + f); if (b.length > 4e6) err(where, `${f} is ${(b.length / 1e6).toFixed(1)} MB — over 4 MB`); }
      catch (e) { err(where, `gallery/${f} is missing`); }
    }
  }
}

// texts about the weekly portions (content/<lang>/parsha.json, filled in by the author): 54 portions in the order of
// data/parsha.json, the same structure in every language; empty fields are simply not shown
{
  const ph = await load('data/parsha.json');
  if (ph) {
    for (const k of ['d', 'il']) if (Object.keys(ph[k] || {}).length !== 14) err('data/parsha.json', `${k}: expected 14 year types — rebuild with node tools/build-parsha.mjs`);
    if ((ph.he || []).length !== 54 || (ph.ranges || []).length !== 54) err('data/parsha.json', 'expected 54 portions');
  }
  const ref = await load(`content/${REF}/parsha.json`);
  if (ref && (ref.parshiot || []).length !== 54) err(`content/${REF}/parsha.json`, 'expected 54 portions');
  if (ref && ph) ref.parshiot.forEach((p, i) => { if (p.he !== ph.he[i]) err(`content/${REF}/parsha.json`, `portion ${i + 1}: "he" must be ${ph.he[i]}`); });
  for (const lang of langs) if (lang !== REF) {
    const val = await load(`content/${lang}/parsha.json`);
    if (ref !== undefined && val !== undefined) compare(`content/${lang}/parsha.json`, ref, val, lang);
  }
}

// the teacher's guide (docs/guide.ru.md) is generated from the Russian texts: rebuild it after text changes
const {build} = await import('../tools/guide.mjs');
let guide = '';
try { guide = await readFile(ROOT + 'docs/guide.ru.md', 'utf8'); } catch (e) {}
if (guide !== build()) err('docs/guide.ru.md', 'out of date with content/ru and locales/ru.json — run npm run guide');

if (errors.length) {
  console.error(`✗ Data check failed (${errors.length}):\n  ` + errors.slice(0, 80).join('\n  ') + (errors.length > 80 ? `\n  …and ${errors.length - 80} more` : ''));
  process.exit(1);
}
console.log(`✓ Data check passed: ${langs.join(', ')} · ${files.length} content files + locales`);
