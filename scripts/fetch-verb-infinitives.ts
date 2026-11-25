import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const sourceUrl = 'https://raw.githubusercontent.com/fhardison/biblical-hebrew-form-generator-validator/main/output/forms.csv';
const wordsPath = new URL('../src/tanakh/words.json', import.meta.url);
const outputPath = new URL('../public/tanakh/words/infinitives.json', import.meta.url);

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift()?.map((x) => x.trim()) ?? [];
  return rows.filter((r) => r.length === headers.length).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}

const norm = (s: string) => [...s.normalize('NFC')].filter((c) => {
  const n = c.codePointAt(0)!;
  return n < 0x0591 || n > 0x05C7;
}).join('');

async function main() {
  const [csvResponse, source] = await Promise.all([fetch(sourceUrl), readFile(wordsPath, 'utf8')]);
  if (!csvResponse.ok) throw new Error(`Could not download Macula Hebrew FST forms: HTTP ${csvResponse.status}`);
  const rows = parseCsv(await csvResponse.text());
  if (!rows.length || !['lemma', 'stem', 'vtype', 'surface'].every((k) => k in rows[0]))
    throw new Error('FST forms.csv schema changed; expected lemma, stem, vtype and surface columns');

  const byLemma = new Map<string, Record<string, string>[]>();
  for (const row of rows) {
    const key = norm(row.lemma ?? '');
    if (!key || !row.stem) continue;
    const list = byLemma.get(key) ?? [];
    list.push(row);
    byLemma.set(key, list);
  }

  const dict = JSON.parse(source) as { words: { id: string; he: string; pos: string }[] };
  const infinitives: Record<string, string> = {};
  const missing: string[] = [];
  for (const word of dict.words) {
    if (!word.pos.split(/\s+/).includes('v')) continue;
    const candidates = byLemma.get(norm(word.he)) ?? [];
    const qatalStems = new Map<string, number>();
    for (const row of candidates) if (row.vtype?.trim().toLowerCase() === 'qatal')
      qatalStems.set(row.stem, (qatalStems.get(row.stem) ?? 0) + 1);
    const infs = candidates.filter((row) => row.vtype?.trim().toLowerCase() === 'infinitive construct');
    if (!infs.length) { missing.push(word.id); continue; }
    const preferredStem = [...qatalStems].sort((a, b) => b[1] - a[1])[0]?.[0];
    const sameStem = preferredStem ? infs.filter((row) => row.stem === preferredStem) : [];
    const pool = sameStem.length ? sameStem : infs;
    const score = (row: Record<string, string>) => {
      const surface = (row.surface ?? '').normalize('NFC').trim();
      const attested = row.attested?.trim().toLowerCase() === 'attested' ? 1 : 0;
      const refs = (row.refs ?? '').split(/[;,\s]+/).filter(Boolean).length;
      return [surface.startsWith('ל') ? 1 : 0, attested, refs, surface.length];
    };
    pool.sort((a, b) => {
      const x = score(a), y = score(b);
      for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return y[i] - x[i];
      return 0;
    });
    const form = pool[0].surface?.normalize('NFC').trim();
    if (form) infinitives[word.id] = form;
    else missing.push(word.id);
  }
  await mkdir(new URL('../public/tanakh/words/', import.meta.url), { recursive: true });
  await writeFile(outputPath, JSON.stringify(infinitives) + '\n', 'utf8');
  console.log(`Biblical Hebrew infinitives: ${Object.keys(infinitives).length} mapped; ${missing.length} unmatched`);
  if (Object.keys(infinitives).length < 100) throw new Error('Infinitive lookup coverage unexpectedly low; refusing to publish');
}

await main();
