import { describe, expect, it } from 'vitest';
import {
  isGithubUrl,
  normalizeProfile,
  publicLinks,
  validatePostWrite,
  validateProfileWrite,
  validateRecommendationsWrite,
  validateWorksWrite
} from '../src/lib/schema';

describe('profile schema', () => {
  it('requires a name', () => {
    expect(normalizeProfile({ tagline: 'x' })).toBeNull();
    expect(validateProfileWrite({ name: '' }).ok).toBe(false);
    expect(normalizeProfile({ name: 'Kan' })?.name).toBe('Kan');
  });

  it('drops non-http links from the public view', () => {
    const links = publicLinks([
      { label: 'GitHub', url: 'https://github.com/Kan090808' },
      { label: 'Email', url: 'mailto:kanjingterng@gmail.com' },
      { label: 'Phone', url: 'tel:+886905620013' },
      { label: 'bad', url: 'javascript:alert(1)' },
      { label: 'empty', url: '' }
    ]);
    expect(links).toEqual([
      { label: 'GitHub', url: 'https://github.com/Kan090808' },
      { label: 'Email', url: 'mailto:kanjingterng@gmail.com' },
      { label: 'Phone', url: 'tel:+886905620013' }
    ]);
  });
});

describe('recommendations schema', () => {
  it('rejects a non-http item url on write', () => {
    const result = validateRecommendationsWrite({
      categories: [{ id: 'dev-tools', label: '開發工具' }],
      items: [{ id: 'x', categoryId: 'dev-tools', title: 'X', summary: '', url: 'ftp://x' }]
    });
    expect(result.ok).toBe(false);
  });

  it('accepts a url-less item', () => {
    const result = validateRecommendationsWrite({
      categories: [{ id: 'anime', label: '動漫' }],
      items: [{ id: 'y', categoryId: 'anime', title: '孤獨搖滾！', summary: '樂團' }]
    });
    expect(result.ok).toBe(true);
  });
});

describe('post write schema', () => {
  it('rejects spaces in slugs and leaves the caller able to skip the write', () => {
    const result = validatePostWrite({
      title: 'Hello',
      date: '2026-09-04',
      slug: 'hello world',
      body: 'x'
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/網址代稱/);
  });

  it('accepts a valid post', () => {
    const result = validatePostWrite({
      title: 'Hello',
      date: '2026-09-04',
      slug: 'hello-world',
      tags: ['站務'],
      body: '內容'
    });
    expect(result.ok).toBe(true);
  });
});

describe('works schema', () => {
  it('accepts a GitHub or website link', () => {
    const result = validateWorksWrite({
      items: [
        { id: 'g', title: 'Repo', summary: 'code', url: 'https://github.com/Kan090808/app' },
        { id: 'w', title: 'Site', summary: 'demo', url: 'https://example.com' }
      ]
    });
    expect(result.ok).toBe(true);
    expect(isGithubUrl('https://github.com/Kan090808/app')).toBe(true);
    expect(isGithubUrl('https://kan090808.github.io')).toBe(false);
  });

  it('rejects a non-http work url', () => {
    const result = validateWorksWrite({
      items: [{ id: 'x', title: 'X', summary: '', url: 'javascript:alert(1)' }]
    });
    expect(result.ok).toBe(false);
  });
});

