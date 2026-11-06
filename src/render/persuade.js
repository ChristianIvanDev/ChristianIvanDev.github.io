import { h } from './dom.js';
import { t, pick } from '../i18n.js';
import { STAGES } from '../content/learning.js';
import { sectionHead } from './shared.js';

/** "¿Es realmente necesario?" */
export function renderNeed(lang) {
  return h('section', { class: 'section', 'data-section': 'need', 'data-reveal': '', 'aria-labelledby': 'need-title' },
    sectionHead(lang, { id: 'need-title', titleKey: 'need.title', leadKey: 'need.lead' }),
    h('div', { class: 'bento' },
      [1, 2, 3].map((n) =>
        h('article', { class: `card span-2 need__card need__card--${n}`, 'data-reveal-item': '' },
          h('span', { class: 'need__icon', 'aria-hidden': 'true' }),
          h('h3', { class: 'card__title' }, t(lang, `need.${n}.title`)),
          h('p', {}, t(lang, `need.${n}.text`)),
        ),
      ),
    ),
  );
}

function stagePanel(stage, lang) {
  return [
    h('div', { class: 'path__text' },
      h('p', { class: 'card__label' }, t(lang, 'path.learns')),
      h('p', { class: 'path__learns' }, pick(stage.learns, lang)),
      h('p', { class: 'card__label path__gap' }, t(lang, 'path.builds')),
      h('p', { class: 'path__builds' }, pick(stage.builds, lang)),
    ),
    stage.image
      ? h('img', { class: 'path__img', src: stage.image.src, alt: pick(stage.image.alt, lang), loading: 'lazy', decoding: 'async' })
      : h('div', { class: 'path__art', 'aria-hidden': 'true' }, h('span'), h('span'), h('span')),
  ];
}

/** "¿Exactamente qué aprenden y cómo?": recorrido por etapas (patrón ARIA tabs) + cómo es una clase. */
export function renderPath(lang) {
  let current = 0;
  const panel = h('div', { class: 'path__panel', role: 'tabpanel', id: 'path-panel', tabindex: '0' });
  const progress = h('span', { class: 'path__progress-bar' });

  const tabs = STAGES.map((stage, i) =>
    h('button', {
      type: 'button',
      role: 'tab',
      class: 'path__tab',
      id: `path-tab-${stage.id}`,
      'aria-controls': 'path-panel',
      'aria-selected': 'false',
      tabindex: '-1',
      onclick: () => select(i),
    }, h('span', { class: 'path__num', 'aria-hidden': 'true' }, String(i + 1)), pick(stage.title, lang)),
  );

  function select(i, { focus = false } = {}) {
    current = i;
    tabs.forEach((tab, j) => {
      tab.setAttribute('aria-selected', String(j === i));
      tab.tabIndex = j === i ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    panel.dataset.stage = STAGES[i].id;
    panel.replaceChildren(...stagePanel(STAGES[i], lang));
    progress.style.transform = `scaleX(${(i + 1) / STAGES.length})`;
    if (focus) tabs[i].focus();
  }

  const tablist = h('div', { class: 'path__tabs', role: 'tablist', 'aria-label': t(lang, 'path.tabs.label') }, tabs);
  tablist.addEventListener('keydown', (e) => {
    const last = STAGES.length - 1;
    const next = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select((next + STAGES.length) % STAGES.length, { focus: true });
  });

  select(0);

  return h('section', { class: 'section', 'data-section': 'path', 'data-reveal': '', 'aria-labelledby': 'path-title' },
    sectionHead(lang, { id: 'path-title', titleKey: 'path.title', leadKey: 'path.lead' }),
    h('ul', { class: 'path__areas' },
      ['programming', 'design', 'dev'].map((k) =>
        h('li', { class: `path__area path__area--${k}` }, h('strong', {}, t(lang, `offer.${k}.title`)), h('span', {}, t(lang, `offer.${k}.text`))),
      ),
    ),
    h('div', { class: 'card path' },
      tablist,
      h('div', { class: 'path__progress', 'aria-hidden': 'true' }, progress),
      panel,
    ),
    h('div', { class: 'card card--pink class-card' },
      h('h3', { class: 'card__title' }, t(lang, 'class.title')),
      h('p', { class: 'class-card__lead' }, t(lang, 'class.lead')),
      h('ol', { class: 'class-steps' }, [1, 2, 3, 4].map((n) => h('li', { 'data-reveal-item': '' }, t(lang, `class.${n}`)))),
    ),
  );
}

/** Preguntas frecuentes en acordeón (<details>, cada una independiente). */
export function renderFaq(lang, { booking }) {
  const items = [
    ['faq.need.q', t(lang, 'faq.need.a')],
    ['faq.what.q', t(lang, 'faq.what.a')],
    ['faq.guarantee.q', t(lang, 'guarantee.text')],
    ['faq.start.q', t(lang, 'faq.start.a')],
    ['faq.how.q', t(lang, booking ? 'faq.how.booking' : 'faq.how.whatsapp')],
  ];
  return h('section', { class: 'section', 'data-section': 'faq', 'data-reveal': '', 'aria-labelledby': 'faq-title' },
    sectionHead(lang, { id: 'faq-title', titleKey: 'faq.title' }),
    h('div', { class: 'faq' },
      items.map(([q, a]) =>
        h('details', { class: 'card faq__item', 'data-reveal-item': '' },
          h('summary', { class: 'faq__q' }, h('span', {}, t(lang, q)), h('span', { class: 'faq__icon', 'aria-hidden': 'true' })),
          h('div', { class: 'faq__a' }, h('p', {}, a)),
        ),
      ),
    ),
  );
}
