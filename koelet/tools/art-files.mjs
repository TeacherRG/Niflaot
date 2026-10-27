// Artist's pictures (art/<age>/{bg,keeper,avatar}/, see art/README.md): which names are allowed, the size rules,
// scanning the folder and reading width/height from the file header. Used by tools/build-art.mjs and tests/check-data.mjs.
import {readdir, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

export const AGES = ['y', 't', 'a'];
export const SCENE_KEYS = ['base', 'library', 'city', 'puzzle', 'mirror', 'tent', 'workshop', 'lab', 'sukkah', 'map'];
export const MOOD_KEYS = ['smile', 'joy', 'think', 'wow', 'warm', 'point'];
export const ROLE_KEYS = ['explorer', 'inventor', 'chronicler', 'traveler', 'artist', 'musician'];

// kind → [name test, min width, min height, aspect w/h (null = any portrait), tolerance, max bytes, extensions]
export const RULES = {
  bg: {name: n => new RegExp(`^(${SCENE_KEYS.join('|')})(-p)?$`).test(n), max: 1e6, ext: /^(jpe?g|png|webp)$/,
    size: n => n.endsWith('-p') ? {min: [720, 1280], portrait: true, best: '1440×2560'} : {min: [1200, 800], ratio: 1.5, tol: .12, best: '2400×1600'}},
  keeper: {name: n => MOOD_KEYS.includes(n), max: 5e5, ext: /^(png|webp)$/,
    size: () => ({min: [360, 450], ratio: .8, tol: .1, best: '800×1000'})},
  avatar: {name: n => new RegExp(`^[mf]([1-6])?(-(${ROLE_KEYS.join('|')}))?$`).test(n), max: 2.5e5, ext: /^(png|webp)$/,
    size: () => ({min: [256, 256], ratio: 1, tol: .06, best: '512×512'})}
};

// width and height from the file header (PNG, JPEG, WebP)
export function imgSize(b) {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const k = b.toString('ascii', 12, 16);
    if (k === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (k === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (k === 'VP8L') { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
  }
  if (b[0] === 0xff && b[1] === 0xd8) for (let i = 2; i < b.length - 9;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  return null;
}

// scan art/: returns {manifest, problems}; manifest = {age: {kind: {name: "file?hash"}}}
export async function scanArt(root) {
  const manifest = {}, problems = [];
  for (const age of AGES) for (const kind of Object.keys(RULES)) {
    const dir = `art/${age}/${kind}`, R = RULES[kind];
    let names;
    try { names = (await readdir(root + dir)).filter(f => !f.startsWith('.')).sort(); } catch (e) { continue; }
    for (const file of names) {
      const where = `${dir}/${file}`, m = file.match(/^([\w-]+)\.(\w+)$/);
      if (!m) { problems.push(`${where}: name must be latin letters, digits and -, e.g. library.webp`); continue; }
      const [, name, ext] = m;
      if (!R.ext.test(ext.toLowerCase())) { problems.push(`${where}: ${kind === 'bg' ? '.jpg, .png or .webp' : '.png or .webp with a transparent background'}`); continue; }
      if (!R.name(name)) { problems.push(`${where}: unknown name «${name}» — see the list in art/README.md`); continue; }
      const b = await readFile(root + where), wh = imgSize(b), S = R.size(name);
      if (!wh) { problems.push(`${where}: cannot read the picture size (broken file?)`); continue; }
      const [w, h] = wh;
      if (w < S.min[0] || h < S.min[1]) problems.push(`${where}: ${w}×${h} is too small (at least ${S.min.join('×')}, best ${S.best})`);
      if (S.portrait && h <= w) problems.push(`${where}: the phone version must be vertical (best ${S.best})`);
      if (S.ratio && Math.abs(w / h / S.ratio - 1) > S.tol) problems.push(`${where}: ${w}×${h} has the wrong proportions (best ${S.best})`);
      if (b.length > R.max) problems.push(`${where}: ${(b.length / 1e3).toFixed(0)} KB — compress it below ${R.max / 1e3} KB (e.g. squoosh.app, WebP)`);
      if (manifest[age]?.[kind]?.[name]) { problems.push(`${where}: «${name}» is there twice with different extensions`); continue; }
      ((manifest[age] ||= {})[kind] ||= {})[name] = `${file}?${createHash('sha1').update(b).digest('hex').slice(0, 8)}`;
    }
  }
  return {manifest, problems};
}
