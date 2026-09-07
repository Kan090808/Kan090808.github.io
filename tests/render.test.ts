/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { renderApp } from '../src/app';
import { loadSite } from '../src/lib/content';
import type { SiteContent } from '../src/lib/content';

function mount(): HTMLElement {
  document.body.innerHTML = `
    <nav class="tabs">
      <button type="button" role="tab" id="tab-profile" data-tab="profile">個人資料</button>
      <button type="button" role="tab" id="tab-works" data-tab="works">作品</button>
      <button type="button" role="tab" id="tab-recs" data-tab="recs">推薦列表</button>
      <button type="button" role="tab" id="tab-posts" data-tab="posts">貼文</button>
    </nav>
    <main id="panel"></main>
  `;
  return document.getElementById('panel') as HTMLElement;
}

const noop = { onRecFilter: () => undefined };

describe('renderApp', () => {
  let content: SiteContent;
  let panel: HTMLElement;

  beforeEach(() => {
    panel = mount();
    content = loadSite();
  });

  it('renders profile as the default view', () => {
    renderApp(panel, { content, route: { name: 'profile' }, recFilter: 'all' }, noop);
    expect(panel.textContent).toContain('Kan Jing Terng (Jayden)');
    expect(panel.textContent).toContain('Senior iOS Engineer');
    expect(panel.textContent).toContain('Letstalk');
    expect(panel.textContent).toContain('+886 905-620-013');
    expect(panel.querySelector('a[href="tel:+886905620013"]')).toBeTruthy();
    expect(document.getElementById('tab-profile')?.getAttribute('aria-selected')).toBe('true');
  });

  it('renders works with a GitHub link', () => {
    renderApp(panel, { content, route: { name: 'works' }, recFilter: 'all' }, noop);
    expect(panel.textContent).toContain('作品');
    expect(panel.textContent).toContain('GitHub');
    expect(panel.querySelector('a[href="https://github.com/Kan090808"]')?.getAttribute('rel')).toContain(
      'noopener'
    );
  });

  it('renders recommendation categories and a url-less item', () => {
    renderApp(panel, { content, route: { name: 'recs' }, recFilter: 'all' }, noop);
    expect(panel.textContent).toContain('開發工具');
    expect(panel.textContent).toContain('動漫');
    expect(panel.textContent).toMatch(/目前還沒有推薦項目|這個分類目前沒有項目/);
    expect(panel.textContent).not.toContain('改名');
  });

  it('filters a category with no matching items', () => {
    renderApp(panel, { content, route: { name: 'recs' }, recFilter: 'missing' }, noop);
    expect(panel.textContent).toContain('這個分類目前沒有項目。');
  });

  it('lists posts newest first and opens a missing slug state', () => {
    renderApp(panel, { content, route: { name: 'posts' }, recFilter: 'all' }, noop);
    expect(panel.textContent).toContain('第一篇筆記');
    renderApp(panel, { content, route: { name: 'posts', slug: 'does-not-exist' }, recFilter: 'all' }, noop);
    expect(panel.textContent).toContain('找不到這篇貼文');
    expect(panel.querySelector('a[href="#/posts"]')?.textContent).toBe('回到列表');
  });

  it('shows a public empty profile without editor copy', () => {
    renderApp(panel, { content: { ...content, profile: null }, route: { name: 'profile' }, recFilter: 'all' }, noop);
    expect(panel.textContent).toContain('這是一份個人網站');
    expect(panel.textContent).not.toContain('Vite');
    expect(panel.textContent).not.toContain('本機');
  });
});
