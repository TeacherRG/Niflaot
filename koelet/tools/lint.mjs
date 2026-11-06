// Syntax check for all game scripts and JSON files (no dependencies): npm run lint
// JS files are checked with `node --check`; vendor/ (third-party, minified) is skipped.
import {execFileSync} from 'node:child_process';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKIP = new Set(['node_modules', '.git', 'vendor', 'screenshots']);
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(m?js|json)$/.test(name)) files.push(p);
  }
})(ROOT);

let bad = 0;
for (const f of files) {
  const rel = relative(ROOT, f);
  try {
    if (f.endsWith('.json')) JSON.parse(readFileSync(f, 'utf8'));
    else execFileSync(process.execPath, ['--check', f], {stdio: 'pipe'});
  } catch (e) {
    bad++;
    console.error(`✗ ${rel}\n  ${String(e.stderr || e.message).trim().split('\n').slice(0, 6).join('\n  ')}`);
  }
}
if (bad) process.exit(1);
console.log(`✓ Lint passed: ${files.length} files`);
