import { h } from './dom';
import type { SiteContent } from './lib/content';
import { renderMarkdown } from './lib/markdown';
import {
  avatarSrc,
  isGithubUrl,
  isHttpUrl,
  isUsableAvatar,
  publicLinks,
  type RecItem,
  type WorkItem
} from './lib/schema';
import type { Route } from './lib/routes';
import { routeToHash } from './lib/routes';

export type AppState = {
  content: SiteContent;
  route: Route;
  recFilter: string;
};

export type AppHandlers = {
  onRecFilter: (id: string) => void;
};

const TAB_IDS = ['profile', 'recs'] as const;

export function syncTabs(route: Route): void {
  const selected = route.name;
  const tabs = document.querySelectorAll<HTMLButtonElement>('.tabs [role="tab"]');
  for (const tab of tabs) {
    const name = tab.dataset.tab;
    const isSelected = name === selected;
    tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    tab.tabIndex = isSelected ? 0 : -1;
  }
  const panel = document.getElementById('panel');
  if (panel) panel.setAttribute('aria-labelledby', `tab-${selected}`);
}

export function bindTabList(): void {
  const tablist = document.querySelector<HTMLElement>('.tabs');
  if (!tablist) return;
  tablist.addEventListener('keydown', (event) => {
    const current = document.activeElement;
    if (!(current instanceof HTMLButtonElement) || current.getAttribute('role') !== 'tab') return;
    const index = TAB_IDS.indexOf((current.dataset.tab ?? '') as (typeof TAB_IDS)[number]);
    if (index < 0) return;
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % TAB_IDS.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + TAB_IDS.length) % TAB_IDS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TAB_IDS.length - 1;
    else return;
    event.preventDefault();
    const target = tablist.querySelector<HTMLButtonElement>(`[data-tab="${TAB_IDS[next]}"]`);
    target?.focus();
    target?.click();
  });
  tablist.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-tab]');
    if (!button?.dataset.tab) return;
    const name = button.dataset.tab;
    if (name === 'profile' || name === 'works' || name === 'recs' || name === 'posts') {
      location.hash = routeToHash({ name });
    }
  });
}

export function renderApp(panel: HTMLElement, state: AppState, handlers: AppHandlers): void {
  syncTabs(state.route);
  panel.replaceChildren();
  if (state.route.name === 'profile') {
    panel.append(renderProfile(state.content));
    return;
  }
  if (state.route.name === 'works') {
    panel.append(renderWorks(state.content));
    return;
  }
  if (state.route.name === 'recs') {
    panel.append(renderRecs(state, handlers));
    return;
  }
  if (state.route.name === 'posts' && state.route.slug) {
    panel.append(renderPostDetail(state));
    return;
  }
  panel.append(renderPostList(state.content));
}

function renderProfile(content: SiteContent): HTMLElement {
  const profile = content.profile;
  if (!profile) {
    return h(
      'div',
      { class: 'profile', 'data-profile-empty': 'true' },
      h('p', { class: 'empty' }, '這是一份個人網站，目前還沒有公開的個人資料。')
    );
  }
  const root = h(
    'article',
    { class: 'profile' },
    h('h1', { 'data-edit': 'profile.name' }, profile.name)
  );
  if (profile.tagline) {
    root.append(h('p', { class: 'tagline', 'data-edit': 'profile.tagline' }, profile.tagline));
  }
  if (isUsableAvatar(profile.avatar)) {
    root.append(
      h('img', {
        class: 'avatar',
        src: avatarSrc(profile.avatar),
        alt: `${profile.name} 的頭像`,
        width: '96',
        height: '96',
        'data-edit': 'profile.avatar'
      })
    );
  }
  if (profile.bio.trim()) {
    const bio = h('div', { class: 'bio markdown', 'data-edit': 'profile.bio' });
    bio.dataset.raw = profile.bio;
    bio.innerHTML = renderMarkdown(profile.bio);
    root.append(bio);
  }
  const links = publicLinks(profile.links);
  if (links.length) {
    const list = h('ul', { class: 'links' });
    for (const [index, link] of profile.links.entries()) {
      if (!publicLinks([link]).length) continue;
      list.append(
        h(
          'li',
          { 'data-link-index': String(index) },
          h(
            'a',
            {
              href: link.url,
              rel: 'noopener noreferrer',
              target: '_blank',
              'data-edit': 'profile.link.label',
              'data-index': String(index)
            },
            link.label
          )
        )
      );
    }
    root.append(list);
  }
  return root;
}

function workCardClass(item: WorkItem): string {
  if (item.url && isGithubUrl(item.url)) return 'card card--github';
  return 'card card--site';
}

function renderWorks(content: SiteContent): HTMLElement {
  const root = h(
    'section',
    { 'data-view': 'works' },
    h('h1', {}, '作品'),
    h('div', { class: 'toolbar', 'data-works-toolbar': 'true' })
  );
  const items = content.works.items;
  if (items.length === 0) {
    root.append(h('p', { class: 'empty' }, '目前還沒有公開的作品。'));
    return root;
  }
  const list = h('div', { class: 'cards' });
  for (const item of items) {
    const titleText = h('span', { 'data-edit': 'work.title', 'data-id': item.id }, item.title);
    const heading = h('h2', {});
    if (item.url && isHttpUrl(item.url)) {
      heading.append(
        h('a', { href: item.url, rel: 'noopener noreferrer', target: '_blank' }, titleText)
      );
    } else {
      heading.append(titleText);
    }
    const kind =
      item.url && isHttpUrl(item.url)
        ? isGithubUrl(item.url)
          ? 'GitHub'
          : '網站'
        : '';
    const article = h(
      'article',
      { class: workCardClass(item), 'data-work-id': item.id },
      heading,
      kind ? h('p', { class: 'kind' }, kind) : null,
      h('p', { 'data-edit': 'work.summary', 'data-id': item.id }, item.summary)
    );
    list.append(article);
  }
  root.append(list);
  return root;
}

function cardClass(item: RecItem): string {
  if (item.categoryId === 'anime') return 'card card--anime';
  return 'card card--tool';
}

function renderRecs(state: AppState, handlers: AppHandlers): HTMLElement {
  const { categories, items } = state.content.recommendations;
  const root = h(
    'section',
    { 'data-view': 'recs' },
    h('h1', {}, '推薦列表'),
    h('div', { class: 'toolbar', 'data-rec-toolbar': 'true' })
  );

  if (categories.length === 0 && items.length === 0) {
    root.append(h('p', { class: 'empty' }, '目前還沒有推薦項目。'));
    return root;
  }

  const filters = h('div', { class: 'filters', role: 'group', 'aria-label': '分類' });
  filters.append(
    h(
      'button',
      {
        type: 'button',
        class: 'chip',
        'aria-pressed': state.recFilter === 'all' ? 'true' : 'false',
        onClick: () => handlers.onRecFilter('all')
      },
      '全部'
    )
  );
  for (const category of categories) {
    filters.append(
      h(
        'button',
        {
          type: 'button',
          class: 'chip',
          'data-edit': 'rec.category.label',
          'data-id': category.id,
          'aria-pressed': state.recFilter === category.id ? 'true' : 'false',
          onClick: () => handlers.onRecFilter(category.id)
        },
        category.label
      )
    );
  }
  root.append(filters);

  const visible =
    state.recFilter === 'all' ? items : items.filter((item) => item.categoryId === state.recFilter);

  if (visible.length === 0) {
    root.append(h('p', { class: 'empty' }, '這個分類目前沒有項目。'));
    return root;
  }

  const list = h('div', { class: 'cards' });
  for (const item of visible) {
    const titleText = h(
      'span',
      { 'data-edit': 'rec.item.title', 'data-id': item.id },
      item.title
    );
    const heading = h('h2', {});
    if (item.url && isHttpUrl(item.url)) {
      heading.append(
        h(
          'a',
          { href: item.url, rel: 'noopener noreferrer', target: '_blank' },
          titleText
        )
      );
    } else {
      heading.append(titleText);
    }
    const article = h(
      'article',
      { class: cardClass(item), 'data-rec-id': item.id },
      heading,
      h('p', { 'data-edit': 'rec.item.summary', 'data-id': item.id }, item.summary)
    );
    list.append(article);
  }
  root.append(list);
  return root;
}

function renderPostList(content: SiteContent): HTMLElement {
  const root = h(
    'section',
    { 'data-view': 'posts' },
    h('h1', {}, '貼文'),
    h('div', { class: 'toolbar', 'data-post-toolbar': 'true' })
  );
  if (content.posts.length === 0) {
    root.append(h('p', { class: 'empty' }, '目前還沒有貼文。'));
    return root;
  }
  const list = h('ul', { class: 'post-list' });
  for (const post of content.posts) {
    const row = h('li', { 'data-post-slug': post.slug });
    row.append(
      h(
        'a',
        { href: `#/posts/${post.slug}` },
        h('span', { class: 'title', 'data-edit': 'post.title', 'data-slug': post.slug }, post.title),
        h('span', { class: 'meta', 'data-edit': 'post.date', 'data-slug': post.slug }, post.date)
      )
    );
    list.append(row);
  }
  root.append(list);
  return root;
}

function renderPostDetail(state: AppState): HTMLElement {
  const slug = state.route.name === 'posts' ? state.route.slug : undefined;
  const post = state.content.posts.find((entry) => entry.slug === slug);
  if (!post) {
    return h(
      'section',
      { 'data-view': 'post-missing' },
      h('h1', {}, '找不到這篇貼文'),
      h('p', { class: 'empty' }, '這篇文章不存在，或尚未公開。'),
      h('p', {}, h('a', { class: 'text-link', href: '#/posts' }, '回到列表'))
    );
  }
  const article = h(
    'article',
    { 'data-view': 'post', 'data-post-slug': post.slug },
    h('div', { class: 'toolbar', 'data-post-toolbar': 'true' }),
    h('h1', { 'data-edit': 'post.title', 'data-slug': post.slug }, post.title),
    h('p', { class: 'meta', 'data-edit': 'post.date', 'data-slug': post.slug }, post.date)
  );
  const tags = h('ul', { class: 'tags' });
  tags.append(
    h('li', { 'data-edit': 'post.tags', 'data-slug': post.slug }, post.tags.join(', ') || '')
  );
  if (post.tags.length === 0) tags.hidden = true;
  article.append(tags);
  const body = h('div', { class: 'markdown', 'data-edit': 'post.body', 'data-slug': post.slug });
  body.dataset.raw = post.body;
  body.innerHTML = renderMarkdown(post.body);
  article.append(body);
  return article;
}
