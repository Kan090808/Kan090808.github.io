import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { resolveContentPath } from '../lib/content-path';

const TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

export function contentMediaPlugin(): Plugin {
  return {
    name: 'content-media',
    configureServer(server) {
      const mediaRoot = path.resolve(server.config.root, 'content/media');
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0];
        if (!url.startsWith('/media/') || (req.method !== 'GET' && req.method !== 'HEAD')) {
          next();
          return;
        }
        const relative = decodeURIComponent(url.slice('/media/'.length));
        const target = resolveContentPath(mediaRoot, relative);
        if (!target || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
          res.statusCode = 404;
          res.end();
          return;
        }
        const type = TYPES[path.extname(target).toLowerCase()] ?? 'application/octet-stream';
        res.setHeader('content-type', type);
        fs.createReadStream(target).pipe(res);
      });
    },
    closeBundle() {
      const src = path.resolve('content/media');
      const dest = path.resolve('dist/media');
      if (!fs.existsSync(src)) return;
      fs.mkdirSync(dest, { recursive: true });
      fs.cpSync(src, dest, { recursive: true });
    }
  };
}
