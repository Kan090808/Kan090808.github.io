/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderApp, type AppState } from '../src/app';
import { enhance, isEditing, resetEditorState } from '../src/editor';
import { loadSite } from '../src/lib/content';

function mount(): HTMLElement {
  document.body.innerHTML = `
    <p data-local-warnings hidden></p>
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

describe('local edit mode', () => {
  let panel: HTMLElement;
  let state: AppState;

  beforeEach(() => {
    resetEditorState();
    panel = mount();
    state = { content: loadSite(), route: { name: 'recs' }, recFilter: 'all' };
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) }))
    );
  });

  afterEach(() => {
    resetEditorState();
    vi.unstubAllGlobals();
  });

  function paint(): void {
    renderApp(panel, state, { onRecFilter: (id) => {
      state.recFilter = id;
      paint();
    }});
    enhance(state, { refresh: paint });
  }

  it('shows a floating edit button and no rename tabs before edit mode', () => {
    paint();
    const fab = document.querySelector('.edit-fab');
    expect(fab?.textContent).toBe('編輯');
    expect(isEditing()).toBe(false);
    expect(document.body.textContent).not.toContain('改名');
    expect(document.body.textContent).not.toContain('編輯個人資料');
    expect(document.body.textContent).not.toContain('新增項目');
  });

  it('lets the author click a category label in edit mode instead of a rename tab', () => {
    paint();
    document.querySelector<HTMLButtonElement>('.edit-fab')?.click();
    expect(isEditing()).toBe(true);
    expect(document.querySelector('.edit-fab')?.textContent).toBe('完成');
    expect(document.body.classList.contains('edit-mode')).toBe(true);
    expect(document.body.textContent).not.toContain('改名');
    const chip = document.querySelector<HTMLElement>('[data-edit="rec.category.label"]');
    expect(chip?.contentEditable).toBe('true');
    expect(chip?.textContent).toBe('開發工具');
    expect(document.body.textContent).toContain('新增分類');
  });
});
