import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isLocalhostHost, resolveContentPath } from '../src/lib/content-path';

const root = path.resolve('/tmp/site-content');

describe('resolveContentPath', () => {
  it('resolves files inside the content root', () => {
    expect(resolveContentPath(root, 'profile.json')).toBe(path.join(root, 'profile.json'));
    expect(resolveContentPath(root, 'posts/hello.md')).toBe(path.join(root, 'posts', 'hello.md'));
  });

  it('rejects traversal and escapes', () => {
    expect(resolveContentPath(root, '../.env')).toBeNull();
    expect(resolveContentPath(root, 'posts/../../.env')).toBeNull();
    expect(resolveContentPath(root, 'content/../../.env')).toBeNull();
  });
});

describe('isLocalhostHost', () => {
  it('accepts localhost hosts with ports', () => {
    expect(isLocalhostHost('localhost:5173')).toBe(true);
    expect(isLocalhostHost('127.0.0.1:5173')).toBe(true);
    expect(isLocalhostHost('[::1]:5173')).toBe(true);
  });

  it('rejects non-local hosts', () => {
    expect(isLocalhostHost('example.com')).toBe(false);
    expect(isLocalhostHost('192.168.1.5:5173')).toBe(false);
    expect(isLocalhostHost(undefined)).toBe(false);
  });
});
