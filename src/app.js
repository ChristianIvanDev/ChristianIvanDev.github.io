import { resolveState, toSearch, persistLang, VIEWS } from './state.js';
import { renderNav } from './render/nav.js';
import { t } from './i18n.js';

/**
 * Monta la página. `renderers` = { teacher(lang) → HTMLElement, developer(lang) → HTMLElement }.
 * `onRender(root, state)` se llama después de cada render completo (3D, inclinación…).
 */
export function mountApp(root, { search, storage, history, renderers, onRender } = {}) {
  const state = resolveState(search, storage);

  function syncUrl() {
    history?.replaceState(null, '', toSearch(state) || window.location.pathname);
  }

  function showView({ focus = false, focusTab = false } = {}) {
    for (const view of VIEWS) {
      const section = root.querySelector(`[data-view="${view}"]`);
      if (section) section.hidden = view !== state.view;
      const tab = root.querySelector(`[role="tab"][data-target="${view}"]`);
      if (tab) {
        tab.setAttribute('aria-selected', String(view === state.view));
        tab.tabIndex = view === state.view ? 0 : -1;
      }
    }
    if (focusTab) root.querySelector(`[role="tab"][data-target="${state.view}"]`)?.focus();
    else if (focus) root.querySelector(`[data-view="${state.view}"] h1`)?.focus({ preventScroll: true });
  }

  function setView(view, opts = {}) {
    if (!VIEWS.includes(view) || view === state.view) return;
    state.view = view;
    syncUrl();
    showView({ focus: !opts.focusTab, focusTab: opts.focusTab });
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
  }

  function setLang(lang) {
    state.lang = lang;
    persistLang(storage, lang);
    syncUrl();
    render();
  }

  function render() {
    document.documentElement.lang = state.lang;
    document.title = t(state.lang, 'meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(state.lang, 'meta.description'));

    const nav = renderNav(state, {
      onView: (v, opts) => setView(v, opts),
      onLang: () => setLang(state.lang === 'es' ? 'en' : 'es'),
    });
    const main = document.createElement('main');
    main.id = 'top';
    for (const view of VIEWS) {
      const section = renderers[view](state.lang);
      section.id = `view-${view}`;
      section.setAttribute('role', 'tabpanel');
      section.setAttribute('aria-labelledby', `tab-${view}`);
      main.append(section);
    }
    root.replaceChildren(nav, main);
    showView();
    onRender?.(root, state);
  }

  render();
  return { setView, setLang, state };
}
