/**
 * «Святая музыка» (src/nigun/index.ts): each niggun has its recording, a line time for every line (increasing, inside
 * the recording), the words read and translated on the other languages, the texts on ru/en/de and the link to its
 * source (the condition of the permission of m770.org).
 */
import { existsSync, statSync } from 'node:fs';
import { NIGUNIM } from '../src/nigun';

const LOCALES = ['ru', 'en', 'de'] as const;
const errors: string[] = [];
const ids = new Set<string>();
for (const n of NIGUNIM) {
  const at = (s: string) => errors.push(`nigun ${n.id}: ${s}`);
  if (ids.has(n.id)) at('the id repeats');
  ids.add(n.id);
  if (!/^[a-z0-9-]+$/.test(n.id)) at('the id must be a slug');
  const file = `public/${n.audio}`;
  if (!existsSync(file)) at(`no recording ${file}`);
  else if (statSync(file).size > 8e6) at('the recording is larger than 8 MB');
  for (const l of LOCALES) {
    if (!n.title[l]?.trim()) at(`no title (${l})`);
    if (!n.about[l]?.trim()) at(`no text about the niggun (${l})`);
  }
  if (!/^https:\/\//.test(n.source.url) || !n.source.name) at('no link to the source');
  if (n.times.length !== n.lines.length) at(`${n.times.length} times for ${n.lines.length} lines`);
  n.times.forEach((t, k) => {
    if (!(t >= 0) || (k > 0 && t <= n.times[k - 1])) at(`the time of line ${k + 1} must be after the one before`);
  });
  n.lines.forEach((line, k) => {
    if (!line.text.trim()) at(`line ${k + 1} is empty`);
    for (const l of LOCALES)
      if (l !== n.lang && (!line.read?.[l]?.trim() || !line.tr?.[l]?.trim())) at(`line ${k + 1}: no reading or translation (${l})`);
  });
}
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`✓ Святая музыка: ${NIGUNIM.length} нигун(ов) — записи, время строк, тексты ru/en/de, ссылка на источник`);
