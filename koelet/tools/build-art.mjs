// Collect the artist's pictures into art/manifest.json: npm run art
// Run it after adding, replacing or removing files in art/<age>/{bg,keeper,avatar}/ (see art/README.md).
// The game shows only the files listed there; the ?hash after each name makes browsers fetch a replaced file anew.
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {scanArt, AGES, RULES} from './art-files.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const {manifest, problems} = await scanArt(ROOT);
await writeFile(ROOT + 'art/manifest.json', JSON.stringify(manifest, null, 1) + '\n');
for (const age of AGES) console.log(`${age}: ` + Object.keys(RULES).map(k => `${k} ${Object.keys(manifest[age]?.[k] || {}).length}`).join(', '));
if (problems.length) {
  console.error(`\n${problems.length} problem(s), these files are not used:\n  ` + problems.join('\n  '));
  process.exit(1);
}
