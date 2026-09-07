import { createPost, deletePost, putProfile, putRecommendations, putWorks, updatePost } from './cms/client';
import type { AppState } from './app';
import { h } from './dom';
import type { Post } from './lib/posts';
import type { Profile } from './lib/schema';
import { isValidDate } from './lib/schema';
import { isValidSlug, SLUG_ERROR } from './lib/slug';

export type EditorHost = {
  refresh: () => void;
};

let editing = sessionStorage.getItem('local-edit-mode') === '1';
let host: EditorHost | null = null;

export function isEditing(): boolean {
  return editing;
}

export function resetEditorState(): void {
  editing = false;
  sessionStorage.removeItem('local-edit-mode');
  document.querySelector('.edit-fab')?.remove();
  document.querySelector('.edit-toast')?.remove();
  document.body.classList.remove('edit-mode');
}

function toast(message: string): void {
  let node = document.querySelector<HTMLElement>('.edit-toast');
  if (!node) {
    node = h('p', { class: 'edit-toast', role: 'status' });
    document.body.append(node);
  }
  node.textContent = message;
  node.hidden = !message;
}

function ensureProfile(state: AppState): Profile {
  if (!state.content.profile) {
    state.content.profile = { name: '', tagline: '', avatar: '', bio: '', links: [] };
  }
  return state.content.profile;
}

function textOf(el: HTMLElement): string {
  return (el.innerText ?? el.textContent ?? '').replace(/\u00a0/g, ' ').trim();
}

function enableText(el: HTMLElement, multiline: boolean, commit: (value: string) => Promise<void> | void): void {
  el.contentEditable = 'true';
  el.spellcheck = false;
  el.addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      el.focus();
    },
    true
  );
  el.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !multiline) {
      event.preventDefault();
      el.blur();
    }
  });
  el.addEventListener('blur', () => {
    void Promise.resolve(commit(textOf(el))).catch((error: Error) => toast(error.message));
  });
}

function enableSource(el: HTMLElement, commit: (value: string) => Promise<void>): void {
  const raw = el.dataset.raw ?? '';
  const textarea = h('textarea', { class: 'inline-source' }) as HTMLTextAreaElement;
  textarea.value = raw;
  el.replaceChildren(textarea);
  textarea.addEventListener('click', (event) => event.stopPropagation());
  textarea.addEventListener('blur', () => {
    el.dataset.raw = textarea.value;
    void commit(textarea.value).catch((error: Error) => toast(error.message));
  });
}

async function saveProfile(state: AppState): Promise<void> {
  const profile = ensureProfile(state);
  if (!profile.name.trim()) throw new Error('請填寫名稱');
  await putProfile(profile);
  toast('');
}

async function saveRecs(state: AppState): Promise<void> {
  await putRecommendations(state.content.recommendations);
  toast('');
}

async function saveWorks(state: AppState): Promise<void> {
  await putWorks(state.content.works);
  toast('');
}

async function savePost(post: Post): Promise<void> {
  if (!isValidSlug(post.slug)) throw new Error(SLUG_ERROR);
  if (!isValidDate(post.date)) throw new Error('請使用 YYYY-MM-DD 日期');
  if (!post.title.trim()) throw new Error('請填寫標題');
  await updatePost(post.slug, {
    title: post.title,
    date: post.date,
    slug: post.slug,
    tags: post.tags,
    body: post.body
  });
  toast('');
}

function bindProfile(state: AppState): void {
  const profile = ensureProfile(state);
  const root = document.querySelector('.profile');
  if (!root) return;

  if (root instanceof HTMLElement && root.dataset.profileEmpty === 'true') {
    root.replaceChildren(
      h('h1', { 'data-edit': 'profile.name' }, profile.name || '名稱'),
      h('p', { class: 'tagline', 'data-edit': 'profile.tagline' }, profile.tagline || '一句介紹'),
      h('p', { class: 'meta', 'data-edit': 'profile.avatar' }, profile.avatar || '頭像網址或 /media/ 路徑'),
      h('div', { class: 'bio markdown', 'data-edit': 'profile.bio', 'data-raw': profile.bio }, profile.bio || '簡介')
    );
  }

  const name = document.querySelector<HTMLElement>('[data-edit="profile.name"]');
  if (name) {
    enableText(name, false, async (value) => {
      if (!value) throw new Error('請填寫名稱');
      profile.name = value;
      await saveProfile(state);
    });
  }

  let tagline = document.querySelector<HTMLElement>('[data-edit="profile.tagline"]');
  if (!tagline && root instanceof HTMLElement) {
    tagline = h('p', { class: 'tagline', 'data-edit': 'profile.tagline' }, profile.tagline || '一句介紹');
    name?.after(tagline);
  }
  if (tagline) {
    enableText(tagline, false, async (value) => {
      profile.tagline = value;
      await saveProfile(state);
    });
  }

  let avatar = document.querySelector<HTMLElement>('[data-edit="profile.avatar"]');
  if (!avatar && root instanceof HTMLElement) {
    avatar = h('p', { class: 'meta', 'data-edit': 'profile.avatar' }, profile.avatar || '頭像網址或 /media/ 路徑');
    (tagline ?? name)?.after(avatar);
  } else if (avatar && avatar.tagName === 'IMG') {
    const field = h('p', { class: 'meta', 'data-edit': 'profile.avatar' }, profile.avatar);
    avatar.after(field);
    avatar = field;
  }
  if (avatar) {
    enableText(avatar, false, async (value) => {
      profile.avatar = value === '頭像網址或 /media/ 路徑' ? '' : value;
      await saveProfile(state);
    });
  }

  let bio = document.querySelector<HTMLElement>('[data-edit="profile.bio"]');
  if (!bio && root instanceof HTMLElement) {
    bio = h('div', { class: 'bio markdown', 'data-edit': 'profile.bio' });
    bio.dataset.raw = profile.bio;
    root.append(bio);
  }
  if (bio) enableSource(bio, async (value) => {
    profile.bio = value;
    await saveProfile(state);
  });

  let list = document.querySelector('.links');
  if (!list && root instanceof HTMLElement) {
    list = h('ul', { class: 'links' });
    root.append(list);
  }
  if (list) {
    list.replaceChildren();
    profile.links.forEach((link, index) => {
      const row = h('li', { 'data-link-index': String(index) });
      const label = h('span', { 'data-edit': 'profile.link.label', 'data-index': String(index) }, link.label || '連結名稱');
      const url = h('span', { class: 'meta', 'data-edit': 'profile.link.url', 'data-index': String(index) }, link.url || 'https://');
      const remove = h('button', { type: 'button', class: 'btn btn-danger' }, '刪除');
      enableText(label, false, async (value) => {
        profile.links[index].label = value === '連結名稱' ? '' : value;
        await saveProfile(state);
      });
      enableText(url, false, async (value) => {
        profile.links[index].url = value === 'https://' ? '' : value;
        await saveProfile(state);
      });
      remove.addEventListener('click', () => {
        const nameLabel = profile.links[index].label || '這個連結';
        if (!confirm(`確定刪除「${nameLabel}」？`)) return;
        profile.links.splice(index, 1);
        void saveProfile(state).then(() => host?.refresh()).catch((error: Error) => toast(error.message));
      });
      row.append(label, url, remove);
      list.append(row);
    });
    const add = h('button', { type: 'button', class: 'btn' }, '新增連結');
    add.addEventListener('click', () => {
      profile.links.push({ label: '', url: '' });
      void saveProfile(state).then(() => host?.refresh()).catch((error: Error) => toast(error.message));
    });
    list.after(add);
  }
}

function bindRecs(state: AppState): void {
  const recs = state.content.recommendations;
  const toolbar = document.querySelector('[data-rec-toolbar]');
  if (toolbar) {
    const addCategory = h('button', { type: 'button', class: 'btn' }, '新增分類');
    const addItem = h('button', { type: 'button', class: 'btn btn-primary' }, '新增項目');
    addCategory.addEventListener('click', () => {
      recs.categories.push({ id: `cat-${Date.now().toString(36)}`, label: '新分類' });
      void saveRecs(state).then(() => host?.refresh()).catch((error: Error) => toast(error.message));
    });
    addItem.addEventListener('click', () => {
      if (recs.categories.length === 0) {
        toast('請先新增分類');
        return;
      }
      recs.items.push({
        id: crypto.randomUUID(),
        categoryId:
          state.recFilter !== 'all' && recs.categories.some((category) => category.id === state.recFilter)
            ? state.recFilter
            : recs.categories[0].id,
        title: '未命名',
        summary: '簡介',
        url: '',
        image: '',
        tags: []
      });
      void saveRecs(state).then(() => host?.refresh()).catch((error: Error) => toast(error.message));
    });
    toolbar.append(addCategory, addItem);
  }

  for (const chip of document.querySelectorAll<HTMLElement>('[data-edit="rec.category.label"]')) {
    enableText(chip, false, async (value) => {
      if (!value) throw new Error('請填寫分類名稱');
      const category = recs.categories.find((entry) => entry.id === chip.dataset.id);
      if (!category) return;
      category.label = value;
      await saveRecs(state);
    });
  }

  for (const item of recs.items) {
    const card = document.querySelector(`[data-rec-id="${item.id}"]`);
    if (!card) continue;
    const title = card.querySelector<HTMLElement>('[data-edit="rec.item.title"]');
    const summary = card.querySelector<HTMLElement>('[data-edit="rec.item.summary"]');
    if (title) {
      enableText(title, false, async (value) => {
        if (!value) throw new Error('請填寫項目標題');
        item.title = value;
        await saveRecs(state);
      });
    }
    if (summary) {
      enableText(summary, true, async (value) => {
        item.summary = value;
        await saveRecs(state);
      });
    }
    const url = h(
      'p',
      { class: 'meta', 'data-edit': 'rec.item.url', 'data-id': item.id },
      item.url || 'https://'
    );
    enableText(url, false, async (value) => {
      item.url = value === 'https://' ? '' : value;
      await saveRecs(state);
    });
    const remove = h('button', { type: 'button', class: 'btn btn-danger' }, '刪除');
    remove.addEventListener('click', () => {
      if (!confirm(`確定刪除「${item.title}」？`)) return;
      recs.items = recs.items.filter((entry) => entry.id !== item.id);
      void saveRecs(state).then(() => host?.refresh()).catch((error: Error) => toast(error.message));
    });
    card.append(url, h('div', { class: 'card-actions' }, remove));
  }
}

function bindWorks(state: AppState): void {
  const works = state.content.works;
  const toolbar = document.querySelector('[data-works-toolbar]');
  if (toolbar) {
    const add = h('button', { type: 'button', class: 'btn btn-primary' }, '新增作品');
    add.addEventListener('click', () => {
      works.items.push({
        id: crypto.randomUUID(),
        title: '未命名作品',
        summary: '簡介',
        url: ''
      });
      void saveWorks(state).then(() => host?.refresh()).catch((error: Error) => toast(error.message));
    });
    toolbar.append(add);
  }

  for (const item of works.items) {
    const card = document.querySelector(`[data-work-id="${item.id}"]`);
    if (!card) continue;
    const title = card.querySelector<HTMLElement>('[data-edit="work.title"]');
    const summary = card.querySelector<HTMLElement>('[data-edit="work.summary"]');
    if (title) {
      enableText(title, false, async (value) => {
        if (!value) throw new Error('請填寫作品標題');
        item.title = value;
        await saveWorks(state);
      });
    }
    if (summary) {
      enableText(summary, true, async (value) => {
        item.summary = value;
        await saveWorks(state);
      });
    }
    const url = h(
      'p',
      { class: 'meta', 'data-edit': 'work.url', 'data-id': item.id },
      item.url || 'https://'
    );
    enableText(url, false, async (value) => {
      item.url = value === 'https://' ? '' : value;
      await saveWorks(state);
      host?.refresh();
    });
    const remove = h('button', { type: 'button', class: 'btn btn-danger' }, '刪除');
    remove.addEventListener('click', () => {
      if (!confirm(`確定刪除「${item.title}」？`)) return;
      works.items = works.items.filter((entry) => entry.id !== item.id);
      void saveWorks(state).then(() => host?.refresh()).catch((error: Error) => toast(error.message));
    });
    card.append(url, h('div', { class: 'card-actions' }, remove));
  }
}

function bindPosts(state: AppState): void {
  const toolbar = document.querySelector('[data-post-toolbar]');
  if (toolbar) {
    const add = h('button', { type: 'button', class: 'btn btn-primary' }, '新增貼文');
    add.addEventListener('click', () => {
      const slug = `post-${Date.now().toString(36)}`;
      const draft = {
        title: '未命名',
        date: new Date().toISOString().slice(0, 10),
        slug,
        tags: [] as string[],
        body: ''
      };
      void createPost(draft)
        .then(() => {
          state.content.posts.unshift({ ...draft, sourcePath: `content/posts/${slug}.md` });
          const next = `#/posts/${slug}`;
          if (location.hash === next) host?.refresh();
          else location.hash = next;
        })
        .catch((error: Error) => toast(error.message));
    });
    toolbar.append(add);
  }

  const findPost = (slug: string | undefined): Post | undefined =>
    state.content.posts.find((entry) => entry.slug === slug);

  for (const el of document.querySelectorAll<HTMLElement>('[data-edit="post.title"]')) {
    enableText(el, false, async (value) => {
      const post = findPost(el.dataset.slug);
      if (!post) return;
      if (!value) throw new Error('請填寫標題');
      post.title = value;
      await savePost(post);
    });
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-edit="post.date"]')) {
    enableText(el, false, async (value) => {
      const post = findPost(el.dataset.slug);
      if (!post) return;
      if (!isValidDate(value)) throw new Error('請使用 YYYY-MM-DD 日期');
      post.date = value;
      await savePost(post);
    });
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-edit="post.tags"]')) {
    el.hidden = false;
    enableText(el, false, async (value) => {
      const post = findPost(el.dataset.slug);
      if (!post) return;
      post.tags = value.split(',').map((tag) => tag.trim()).filter(Boolean);
      await savePost(post);
    });
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-edit="post.body"]')) {
    enableSource(el, async (value) => {
      const post = findPost(el.dataset.slug);
      if (!post) return;
      post.body = value;
      await savePost(post);
    });
  }

  for (const row of document.querySelectorAll('[data-post-slug]')) {
    const slug = (row as HTMLElement).dataset.postSlug;
    const post = findPost(slug);
    if (!post) continue;
    const open = h('a', { class: 'text-link', href: `#/posts/${post.slug}` }, '開啟');
    const remove = h('button', { type: 'button', class: 'btn btn-danger' }, '刪除');
    remove.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!confirm(`確定刪除「${post.title}」？`)) return;
      void deletePost(post.slug)
        .then(() => {
          state.content.posts = state.content.posts.filter((entry) => entry.slug !== post.slug);
          if (location.hash === '#/posts') host?.refresh();
          else location.hash = '#/posts';
        })
        .catch((error: Error) => toast(error.message));
    });
    const actions = h('div', { class: 'card-actions' }, open, remove);
    if (row.matches('article')) {
      document.querySelector('[data-post-toolbar]')?.append(remove);
    } else {
      row.append(actions);
    }
  }
}

function ensureFab(): HTMLButtonElement {
  const existing = document.querySelector<HTMLButtonElement>('.edit-fab');
  if (existing) return existing;
  const fab = h('button', { type: 'button', class: 'edit-fab', 'aria-pressed': 'false' }, '編輯');
  fab.setAttribute('aria-label', '本機編輯');
  fab.addEventListener('click', () => {
    editing = !editing;
    sessionStorage.setItem('local-edit-mode', editing ? '1' : '0');
    toast('');
    host?.refresh();
  });
  document.body.append(fab);
  return fab;
}

export function enhance(state: AppState, nextHost: EditorHost): void {
  host = nextHost;
  const fab = ensureFab();
  document.body.classList.toggle('edit-mode', editing);
  fab.setAttribute('aria-pressed', editing ? 'true' : 'false');
  fab.textContent = editing ? '完成' : '編輯';

  const warnings = document.querySelector<HTMLElement>('[data-local-warnings]');
  if (warnings) {
    if (state.content.warnings.length) {
      warnings.hidden = false;
      warnings.textContent = state.content.warnings.map((warning) => warning.message).join(' ');
    } else {
      warnings.hidden = true;
    }
  }

  if (!editing) return;
  if (state.route.name === 'profile') bindProfile(state);
  if (state.route.name === 'works') bindWorks(state);
  if (state.route.name === 'recs') bindRecs(state);
  if (state.route.name === 'posts') bindPosts(state);
}


