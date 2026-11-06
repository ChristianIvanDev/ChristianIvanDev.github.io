import { h } from './dom.js';
import { pick } from '../i18n.js';

export function renderTimeline(entries, lang) {
  return h('ol', { class: 'timeline' },
    entries.map((e) =>
      h('li', { class: 'timeline__item' },
        h('p', { class: 'timeline__period' }, pick(e.period, lang)),
        h('h3', { class: 'timeline__role' }, pick(e.role, lang)),
        h('p', { class: 'timeline__org' }, e.org),
        h('p', { class: 'timeline__detail' }, pick(e.detail, lang)),
      ),
    ),
  );
}
