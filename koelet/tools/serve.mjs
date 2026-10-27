// Minimal static server for the game (no dependencies).
// The game loads its texts with fetch(), so it must be opened over http://, not file://.
// Usage: npm start            → http://localhost:8080
//        PORT=9000 npm start  → http://localhost:9000
import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {extname, join, normalize, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
};

export function startServer(port = 0) {
  const server = http.createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      const file = normalize(join(ROOT, path));
      if (!file.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) { res.writeHead(403).end(); return; }
      if (!(await stat(file)).isFile()) throw new Error('not a file');
      const body = await readFile(file);
      res.writeHead(200, {'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store'});
      res.end(body);
    } catch {
      res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'}).end('Not found');
    }
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const server = await startServer(Number(process.env.PORT) || 8080);
  console.log(`Koelet: http://localhost:${server.address().port}/`);
}
