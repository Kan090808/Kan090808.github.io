import { isValidSlug, SLUG_ERROR } from './slug';

export type ProfileLink = { label: string; url: string };

export type Profile = {
  name: string;
  tagline: string;
  avatar: string;
  bio: string;
  links: ProfileLink[];
};

export type RecCategory = { id: string; label: string };

export type RecItem = {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  tags: string[];
};

export type Recommendations = {
  categories: RecCategory[];
  items: RecItem[];
};

export type WorkItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
};

export type Works = {
  items: WorkItem[];
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isPublicHref(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:' ||
      parsed.protocol === 'mailto:' ||
      parsed.protocol === 'tel:'
    );
  } catch {
    return false;
  }
}

export function isGithubUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return host === 'github.com' || host === 'gist.github.com';
  } catch {
    return false;
  }
}

export function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function publicLinks(links: unknown): ProfileLink[] {
  if (!Array.isArray(links)) return [];
  const result: ProfileLink[] = [];
  for (const entry of links) {
    if (!entry || typeof entry !== 'object') continue;
    const label = typeof (entry as ProfileLink).label === 'string' ? (entry as ProfileLink).label.trim() : '';
    const url = typeof (entry as ProfileLink).url === 'string' ? (entry as ProfileLink).url.trim() : '';
    if (!label || !isPublicHref(url)) continue;
    result.push({ label, url });
  }
  return result;
}

export function isUsableAvatar(src: string): boolean {
  const value = src.trim();
  if (!value) return false;
  if (isHttpUrl(value)) return true;
  if (value.startsWith('/') || value.startsWith('media/') || value.startsWith('content/media/')) {
    return true;
  }
  return false;
}

export function avatarSrc(src: string): string {
  const value = src.trim();
  if (isHttpUrl(value) || value.startsWith('/')) return value;
  if (value.startsWith('content/media/')) return `/${value.slice('content/'.length)}`;
  if (value.startsWith('media/')) return `/${value}`;
  return value;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeProfile(raw: unknown): Profile | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const name = asString(record.name).trim();
  if (!name) return null;
  return {
    name,
    tagline: asString(record.tagline).trim(),
    avatar: asString(record.avatar).trim(),
    bio: asString(record.bio),
    links: Array.isArray(record.links)
      ? record.links.map((entry) => {
          if (!entry || typeof entry !== 'object') return { label: '', url: '' };
          return {
            label: asString((entry as ProfileLink).label),
            url: asString((entry as ProfileLink).url)
          };
        })
      : []
  };
}

export function validateProfileWrite(raw: unknown): { ok: true; profile: Profile } | { ok: false; error: string } {
  const profile = normalizeProfile(raw);
  if (!profile) return { ok: false, error: '請填寫名稱' };
  return { ok: true, profile };
}

export function normalizeRecommendations(raw: unknown): Recommendations {
  if (!raw || typeof raw !== 'object') return { categories: [], items: [] };
  const record = raw as Record<string, unknown>;
  const categories: RecCategory[] = [];
  const seenCategory = new Set<string>();
  if (Array.isArray(record.categories)) {
    for (const entry of record.categories) {
      if (!entry || typeof entry !== 'object') continue;
      const id = asString((entry as RecCategory).id).trim();
      const label = asString((entry as RecCategory).label).trim();
      if (!id || !label || seenCategory.has(id)) continue;
      seenCategory.add(id);
      categories.push({ id, label });
    }
  }
  const items: RecItem[] = [];
  const seenItem = new Set<string>();
  if (Array.isArray(record.items)) {
    for (const entry of record.items) {
      if (!entry || typeof entry !== 'object') continue;
      const item = entry as RecItem;
      const id = asString(item.id).trim();
      const categoryId = asString(item.categoryId).trim();
      const title = asString(item.title).trim();
      const summary = asString(item.summary).trim();
      if (!id || !title || seenItem.has(id)) continue;
      seenItem.add(id);
      items.push({
        id,
        categoryId,
        title,
        summary,
        url: asString(item.url).trim(),
        image: asString(item.image).trim(),
        tags: Array.isArray(item.tags) ? item.tags.filter((tag): tag is string => typeof tag === 'string') : []
      });
    }
  }
  return { categories, items };
}

export function validateRecommendationsWrite(
  raw: unknown
): { ok: true; recommendations: Recommendations } | { ok: false; error: string } {
  const recommendations = normalizeRecommendations(raw);
  for (const category of recommendations.categories) {
    if (!isValidSlug(category.id)) {
      return { ok: false, error: `分類代號${SLUG_ERROR.replace('網址代稱', '')}` };
    }
    if (!category.label.trim()) return { ok: false, error: '請填寫分類名稱' };
  }
  for (const item of recommendations.items) {
    if (!item.title.trim()) return { ok: false, error: '請填寫項目標題' };
    if (item.url && !isHttpUrl(item.url)) return { ok: false, error: '連結必須是 http 或 https 網址' };
  }
  return { ok: true, recommendations };
}

export function normalizeWorks(raw: unknown): Works {
  if (!raw || typeof raw !== 'object') return { items: [] };
  const record = raw as Record<string, unknown>;
  const items: WorkItem[] = [];
  const seen = new Set<string>();
  if (!Array.isArray(record.items)) return { items };
  for (const entry of record.items) {
    if (!entry || typeof entry !== 'object') continue;
    const item = entry as WorkItem;
    const id = asString(item.id).trim();
    const title = asString(item.title).trim();
    if (!id || !title || seen.has(id)) continue;
    seen.add(id);
    items.push({
      id,
      title,
      summary: asString(item.summary).trim(),
      url: asString(item.url).trim()
    });
  }
  return { items };
}

export function validateWorksWrite(raw: unknown): { ok: true; works: Works } | { ok: false; error: string } {
  const works = normalizeWorks(raw);
  for (const item of works.items) {
    if (!item.title.trim()) return { ok: false, error: '請填寫作品標題' };
    if (item.url && !isHttpUrl(item.url)) return { ok: false, error: '連結必須是 http 或 https 網址' };
  }
  return { ok: true, works };
}

export type PostDraft = {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  body: string;
};

export function validatePostWrite(raw: unknown): { ok: true; post: PostDraft } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: '內容格式不正確' };
  const record = raw as Record<string, unknown>;
  const title = asString(record.title).trim();
  const date = asString(record.date).trim();
  const slug = asString(record.slug).trim();
  const body = asString(record.body);
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean)
    : typeof record.tags === 'string'
      ? record.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];
  if (!title) return { ok: false, error: '請填寫標題' };
  if (title.includes('\n')) return { ok: false, error: '標題不能換行' };
  if (!isValidDate(date)) return { ok: false, error: '請使用 YYYY-MM-DD 日期' };
  if (!isValidSlug(slug)) return { ok: false, error: SLUG_ERROR };
  return { ok: true, post: { title, date, slug, tags, body } };
}
