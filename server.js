/* global console, process */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';
const DIST_DIR = resolve('dist');
const INDEX_FILE = join(DIST_DIR, 'index.html');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function sendFile(response, filePath) {
  const extension = extname(filePath);

  response.writeHead(200, {
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'Content-Type': mimeTypes[extension] || 'application/octet-stream'
  });

  createReadStream(filePath).pipe(response);
}

function resolveStaticPath(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(DIST_DIR, cleanPath === '/' ? 'index.html' : cleanPath);

  if (!filePath.startsWith(DIST_DIR)) {
    return INDEX_FILE;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return INDEX_FILE;
}

const server = createServer((request, response) => {
  if (!existsSync(INDEX_FILE)) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Build not found. Run npm run build:web before starting.');
    return;
  }

  const filePath = resolveStaticPath(request.url || '/');
  sendFile(response, filePath);
});

server.listen(PORT, HOST, () => {
  console.log(`FinPibble web listening on http://${HOST}:${PORT}`);
});
