import { h } from './dom.js';
import { t } from '../i18n.js';
import { DEV_JOBS, EDUCATION, CERTIFICATIONS, STACK } from '../content/experience.js';
import { renderContact } from './contact.js';
import { renderTimeline } from './timeline.js';
import { sectionHead, photoCard, sceneCard, studentsNote, projectsGrid } from './shared.js';

export function renderDeveloper(lang) {
  return h('section', { class: 'page view', 'data-view': 'developer' },
    h('div', { class: 'bento hero' },
      h('div', { class: 'card card--pink span-4 row-2 hero__main' },
        h('p', { class: 'card__label' }, t(lang, 'hero.developer.eyebrow')),
        h('h1', { class: 'hero__title', tabindex: '-1' }, t(lang, 'hero.developer.title')),
        h('p', { class: 'hero__lead' }, t(lang, 'hero.developer.lead')),
        h('div', { class: 'cta-row cta-row--lg', 'data-slot': 'developer-cta' },
          h('a', { class: 'btn btn--primary', href: '#projects-developer' }, t(lang, 'cta.projects')),
        ),
      ),
      photoCard(lang),
      h('div', { class: 'card span-4 stack' },
        h('h2', { class: 'card__label' }, t(lang, 'dev.stack.title')),
        h('ul', { class: 'stack__list' }, STACK.map((s) => h('li', {}, s))),
      ),
      sceneCard(lang, 'developer', 'span-2'),
    ),

    h('section', { class: 'section', 'aria-labelledby': 'devexp-title' },
      sectionHead(lang, { id: 'devexp-title', titleKey: 'dev.experience.title' }),
      h('div', { class: 'bento' },
        h('div', { class: 'card span-6' }, renderTimeline(DEV_JOBS, lang)),
      ),
    ),

    h('section', { class: 'section', id: 'projects-developer', 'aria-labelledby': 'projects-developer-title' },
      sectionHead(lang, { id: 'projects-developer-title', titleKey: 'projects.developer.title', leadKey: 'projects.developer.lead' }),
      projectsGrid(lang, { detailed: true }),
      h('div', { class: 'bento note-row' }, studentsNote(lang, 'developer')),
    ),

    h('section', { class: 'section', 'aria-labelledby': 'edu-title' },
      h('div', { class: 'bento' },
        h('div', { class: 'card span-4' },
          h('h2', { class: 'section__title section__title--card', id: 'edu-title' }, t(lang, 'dev.education.title')),
          renderTimeline(EDUCATION, lang),
        ),
        h('div', { class: 'card card--pink span-2' },
          h('h2', { class: 'section__title section__title--card' }, t(lang, 'dev.certs.title')),
          h('ul', { class: 'certs' }, CERTIFICATIONS.map((c) => h('li', {}, c))),
        ),
      ),
    ),

    renderContact(lang, 'developer'),
  );
}
