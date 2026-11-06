import { h } from './dom.js';
import { t } from '../i18n.js';
import { VIEWS } from '../state.js';

export function renderNav(state, { onView, onLang }) {
  const tabs = VIEWS.map((view) =>
    h('button', {
      type: 'button',
      role: 'tab',
      id: `tab-${view}`,
      class: 'seg__tab',
      'data-target': view,
      'aria-controls': `view-${view}`,
      'aria-selected': String(state.view === view),
      tabindex: state.view === view ? '0' : '-1',
      onclick: () => onView(view),
    }, t(state.lang, `nav.view.${view}`)),
  );

  const tablist = h('div', { class: 'seg', role: 'tablist', 'aria-label': t(state.lang, 'nav.view.label') }, tabs);
  tablist.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = VIEWS.indexOf(state.view);
    const next = VIEWS[(i + (e.key === 'ArrowRight' ? 1 : VIEWS.length - 1)) % VIEWS.length];
    onView(next, { focusTab: true });
  });

  return h('header', { class: 'topbar' },
    h('div', { class: 'topbar__inner' },
      h('a', { class: 'topbar__brand', href: '#top' }, t(state.lang, 'nav.brand')),
      tablist,
      h('button', {
        type: 'button',
        class: 'lang-btn',
        'data-action': 'toggle-lang',
        'aria-label': t(state.lang, 'nav.lang.aria'),
        onclick: onLang,
      }, t(state.lang, 'nav.lang.switch')),
    ),
  );
}
