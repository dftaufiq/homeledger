// A tiny static server for app/ (Node 22, standard library only), a local
// development convenience: `node serve.ts` serves app/ on
// http://localhost:8080 (`--port <n>` for another port). It sends the MIME
// types a browser needs and refuses any path outside app/.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const wanted = portIndex === -1 ? 8080 : Number(args[portIndex + 1]);
const port = Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const rel = normalize(decoded === '/' ? '/index.html' : decoded).replace(/^(\.\.[/\\])+/, '');
  const full = join(root, rel);
  return full === root || full.startsWith(root + sep) ? full : null;
}

createServer((req, res) => {
  const file = safePath(req.url ?? '/');
  if (!file) { res.writeHead(400); res.end('Bad path'); return; }
  let stat;
  try { stat = statSync(file); } catch { res.writeHead(404); res.end('Not found'); return; }
  if (!stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`HomeLedger at http://localhost:${port}`));
