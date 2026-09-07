import path from 'node:path';

export function resolveContentPath(contentRoot: string, relativePath: string): string | null {
  if (!relativePath || relativePath.includes('\0')) return null;
  const root = path.resolve(contentRoot);
  const resolved = path.resolve(root, relativePath);
  const prefix = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolved !== root && !resolved.startsWith(prefix)) return null;
  return resolved;
}

export function isLocalhostHost(hostHeader: string | undefined): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.trim().toLowerCase();
  const hostname = host.startsWith('[') ? host.slice(1, host.indexOf(']')) : host.split(':')[0];
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}
