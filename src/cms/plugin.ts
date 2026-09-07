import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { isLocalhostHost, resolveContentPath } from '../lib/content-path';
import { serializePost } from '../lib/posts';
import {
  validatePostWrite,
  validateProfileWrite,
  validateRecommendationsWrite,
  validateWorksWrite
} from '../lib/schema';

const MAX_BODY = 1_000_000;

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('payload-too-large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function requestPath(url: string | undefined): string {
  return (url ?? '').split('?')[0];
}

export function localCmsPlugin(): Plugin {
  return {
    name: 'local-cms',
    apply: 'serve',
    configureServer(server) {
      const contentRoot = path.resolve(server.config.root, 'content');
      server.middlewares.use((req, res, next) => {
        const pathname = requestPath(req.url);
        if (!pathname.startsWith('/__local-cms')) {
          next();
          return;
        }

        void (async () => {
          if (!isLocalhostHost(req.headers.host)) {
            send(res, 403, { error: '只允許本機寫入' });
            return;
          }

          try {
            if (req.method === 'PUT' && pathname === '/__local-cms/profile') {
              const parsed = JSON.parse(await readBody(req)) as unknown;
              const result = validateProfileWrite(parsed);
              if (!result.ok) {
                send(res, 400, { error: result.error });
                return;
              }
              const target = resolveContentPath(contentRoot, 'profile.json');
              if (!target) {
                send(res, 400, { error: '無效的路徑' });
                return;
              }
              fs.writeFileSync(target, `${JSON.stringify(result.profile, null, 2)}\n`, 'utf8');
              send(res, 200, { ok: true, profile: result.profile });
              return;
            }

            if (req.method === 'PUT' && pathname === '/__local-cms/recommendations') {
              const parsed = JSON.parse(await readBody(req)) as unknown;
              const result = validateRecommendationsWrite(parsed);
              if (!result.ok) {
                send(res, 400, { error: result.error });
                return;
              }
              const target = resolveContentPath(contentRoot, 'recommendations.json');
              if (!target) {
                send(res, 400, { error: '無效的路徑' });
                return;
              }
              fs.writeFileSync(target, `${JSON.stringify(result.recommendations, null, 2)}\n`, 'utf8');
              send(res, 200, { ok: true, recommendations: result.recommendations });
              return;
            }

            if (req.method === 'PUT' && pathname === '/__local-cms/works') {
              const parsed = JSON.parse(await readBody(req)) as unknown;
              const result = validateWorksWrite(parsed);
              if (!result.ok) {
                send(res, 400, { error: result.error });
                return;
              }
              const target = resolveContentPath(contentRoot, 'works.json');
              if (!target) {
                send(res, 400, { error: '無效的路徑' });
                return;
              }
              fs.writeFileSync(target, `${JSON.stringify(result.works, null, 2)}\n`, 'utf8');
              send(res, 200, { ok: true, works: result.works });
              return;
            }

            const postMatch = pathname.match(/^\/__local-cms\/posts(?:\/([^/]+))?$/);
            if (postMatch && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
              const urlSlug = postMatch[1] ? decodeURIComponent(postMatch[1]) : '';
              if (req.method === 'DELETE') {
                if (!urlSlug) {
                  send(res, 400, { error: '缺少網址代稱' });
                  return;
                }
                const target = resolveContentPath(contentRoot, path.join('posts', `${urlSlug}.md`));
                if (!target) {
                  send(res, 400, { error: '無效的路徑' });
                  return;
                }
                if (!fs.existsSync(target)) {
                  send(res, 404, { error: '找不到這篇貼文' });
                  return;
                }
                fs.unlinkSync(target);
                send(res, 200, { ok: true });
                return;
              }

              const parsed = JSON.parse(await readBody(req)) as unknown;
              const result = validatePostWrite(parsed);
              if (!result.ok) {
                send(res, 400, { error: result.error });
                return;
              }

              const postsDir = resolveContentPath(contentRoot, 'posts');
              if (!postsDir) {
                send(res, 400, { error: '無效的路徑' });
                return;
              }
              fs.mkdirSync(postsDir, { recursive: true });

              const target = resolveContentPath(contentRoot, path.join('posts', `${result.post.slug}.md`));
              if (!target) {
                send(res, 400, { error: '無效的路徑' });
                return;
              }

              if (req.method === 'POST' && fs.existsSync(target)) {
                send(res, 409, { error: '這個網址代稱已被使用' });
                return;
              }

              if (req.method === 'PUT' && urlSlug && urlSlug !== result.post.slug) {
                const oldPath = resolveContentPath(contentRoot, path.join('posts', `${urlSlug}.md`));
                if (oldPath && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
              }

              fs.writeFileSync(target, serializePost(result.post), 'utf8');
              send(res, 200, { ok: true, post: result.post });
              return;
            }

            send(res, 404, { error: '找不到這個端點' });
          } catch (error) {
            if (error instanceof SyntaxError) {
              send(res, 400, { error: '內容格式不正確' });
              return;
            }
            send(res, 400, { error: '無法儲存' });
          }
        })();
      });
    }
  };
}
