import { describe, expect, it } from 'vitest';
import { collectPublishedPosts, parsePostMarkdown, serializePost } from '../src/lib/posts';

const sample = `---
title: 第一篇
date: 2026-09-04
slug: first-note
tags: 站務
---

內文
`;

describe('parsePostMarkdown', () => {
  it('reads front matter and body', () => {
    const parsed = parsePostMarkdown(sample, 'content/posts/first-note.md');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.post.title).toBe('第一篇');
      expect(parsed.post.slug).toBe('first-note');
      expect(parsed.post.tags).toEqual(['站務']);
      expect(parsed.post.body.trim()).toBe('內文');
    }
  });

  it('rejects invalid slugs', () => {
    const parsed = parsePostMarkdown(
      '---\ntitle: X\ndate: 2026-09-04\nslug: Hello World\n---\n\nbody\n',
      'x.md'
    );
    expect(parsed.ok).toBe(false);
  });
});

describe('collectPublishedPosts', () => {
  it('sorts newest first and keeps the first duplicate slug', () => {
    const { posts, warnings } = collectPublishedPosts([
      {
        path: 'a.md',
        raw: '---\ntitle: Old\ndate: 2026-08-01\nslug: old\n---\n\na\n'
      },
      {
        path: 'b.md',
        raw: '---\ntitle: New\ndate: 2026-09-01\nslug: new\n---\n\nb\n'
      },
      {
        path: 'dup.md',
        raw: '---\ntitle: Dup\ndate: 2026-09-02\nslug: new\n---\n\nc\n'
      },
      {
        path: 'bad.md',
        raw: '---\ntitle: Bad\ndate: 2026-09-03\nslug: Not Valid\n---\n\nd\n'
      }
    ]);
    expect(posts.map((post) => post.slug)).toEqual(['new', 'old']);
    expect(posts[0].title).toBe('New');
    expect(warnings.some((warning) => warning.message.includes('重複'))).toBe(true);
    expect(warnings.some((warning) => warning.sourcePath === 'bad.md')).toBe(true);
  });
});

describe('serializePost', () => {
  it('round-trips a draft', () => {
    const raw = serializePost({
      title: 'Hello',
      date: '2026-09-04',
      slug: 'hello',
      tags: ['a', 'b'],
      body: 'Hi'
    });
    const parsed = parsePostMarkdown(raw, 'hello.md');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.post.title).toBe('Hello');
      expect(parsed.post.tags).toEqual(['a', 'b']);
      expect(parsed.post.body.trim()).toBe('Hi');
    }
  });
});
