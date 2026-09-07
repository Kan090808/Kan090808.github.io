import { bindTabList, renderApp, type AppState } from './app';
import { loadSite } from './lib/content';
import { parseHash } from './lib/routes';
import './styles.css';

const panelEl = document.getElementById('panel');
if (!panelEl) throw new Error('missing panel');
const panel: HTMLElement = panelEl;

const state: AppState = {
  content: loadSite(),
  route: parseHash(location.hash).route,
  recFilter: 'all'
};

function paint(): void {
  const parsed = parseHash(location.hash);
  if (parsed.redirected && location.hash !== parsed.canonical) {
    history.replaceState(null, '', parsed.canonical);
  }
  state.route = parsed.route;
  if (state.route.name !== 'recs') state.recFilter = 'all';
  renderApp(panel, state, {
    onRecFilter: (id) => {
      state.recFilter = id;
      paint();
    }
  });
  if (import.meta.env.DEV) {
    void import('./editor').then((mod) =>
      mod.enhance(state, {
        refresh: () => paint()
      })
    );
  }
}

bindTabList();
window.addEventListener('hashchange', paint);
paint();
