import { isValidDate } from './schema';
import { isValidSlug } from './slug';

export type Post = {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  body: string;
  sourcePath: string;
};

export type PostWarning = {
  sourcePath?: string;
  slug?: string;
  message: string;
};

function parseFrontMatter(block: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key) fields[key] = value;
  }
  return fields;
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function parsePostMarkdown(
  raw: string,
  sourcePath: string
): { ok: true; post: Post } | { ok: false; error: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { ok: false, error: '缺少 front matter' };
  const fields = parseFrontMatter(match[1]);
  const title = (fields.title ?? '').trim();
  const date = (fields.date ?? '').trim();
  const slug = (fields.slug ?? '').trim();
  const body = match[2].replace(/^\r?\n/, '');
  if (!title) return { ok: false, error: '請填寫標題' };
  if (!isValidDate(date)) return { ok: false, error: '請使用 YYYY-MM-DD 日期' };
  if (!isValidSlug(slug)) return { ok: false, error: '網址代稱只能使用小寫英文字母、數字與連字號' };
  return {
    ok: true,
    post: {
      title,
      date,
      slug,
      tags: parseTags(fields.tags),
      body,
      sourcePath
    }
  };
}

export function serializePost(post: {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  body: string;
}): string {
  const tags = post.tags.join(', ');
  return `---\ntitle: ${post.title}\ndate: ${post.date}\nslug: ${post.slug}\ntags: ${tags}\n---\n\n${post.body.replace(/\s+$/, '')}\n`;
}

export function collectPublishedPosts(
  files: Array<{ path: string; raw: string }>
): { posts: Post[]; warnings: PostWarning[] } {
  const warnings: PostWarning[] = [];
  const bySlug = new Map<string, Post>();
  for (const file of files) {
    const parsed = parsePostMarkdown(file.raw, file.path);
    if (!parsed.ok) {
      warnings.push({ sourcePath: file.path, message: `${file.path}：${parsed.error}` });
      continue;
    }
    const existing = bySlug.get(parsed.post.slug);
    if (existing) {
      warnings.push({
        slug: parsed.post.slug,
        sourcePath: file.path,
        message: `重複的網址代稱「${parsed.post.slug}」，已忽略 ${file.path}`
      });
      continue;
    }
    bySlug.set(parsed.post.slug, parsed.post);
  }
  const posts = [...bySlug.values()].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
  return { posts, warnings };
}
