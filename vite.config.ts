import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

/**
 * «Тайна Коэлета» — a course of the academy (src/components/KoeletPage.tsx): the game is plain HTML/JS without a build
 * (koelet/, its own tests and tools) and is served as it is at /koelet/ — in `npm run dev` from koelet/, in the build
 * copied to dist/koelet/. Only what the game loads: not its tools, tests, docs or node_modules.
 */
const KOELET = resolve('koelet');
const KOELET_SKIP = new Set(['tools', 'tests', 'docs', 'node_modules', 'package.json', 'package-lock.json', 'CNAME', 'robots.txt', 'sitemap.xml']);
const koeletFile = (name: string) => !name.startsWith('.') && !name.endsWith('.md') && !KOELET_SKIP.has(name);
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function koelet(): Plugin {
  return {
    name: 'koelet',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? '').split('?')[0]);
        if (!path.startsWith('/koelet/')) return next();
        const rel = normalize(path.slice('/koelet/'.length) || 'index.html');
        const file = join(KOELET, rel.endsWith('/') ? `${rel}index.html` : rel);
        if (!file.startsWith(KOELET) || !koeletFile(rel.split(/[\\/]/)[0]) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader('Content-Type', TYPES[extname(file)] ?? 'application/octet-stream');
        createReadStream(file).pipe(res);
      });
    },
    writeBundle(options) {
      const out = join(options.dir ?? 'dist', 'koelet');
      for (const name of readdirSync(KOELET).filter(koeletFile)) cpSync(join(KOELET, name), join(out, name), { recursive: true });
    },
  };
}

// base: './' — so the build works from any sub-path (GitHub Pages, mychitas.app/niflaot/…)
export default defineConfig({
  base: './',
  plugins: [react(), koelet()],
});
