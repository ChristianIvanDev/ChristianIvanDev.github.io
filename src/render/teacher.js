import { h } from './dom.js';
import { t, pick } from '../i18n.js';
import { TEACHING } from '../content/experience.js';
import { contactButtons, renderContact } from './contact.js';
import { sectionHead, photoCard, sceneCard, studentsNote, projectsGrid } from './shared.js';

function teachingCard(job, lang, size) {
  return h('article', { class: `card ${size} ${job.highlight ? 'card--pink card--highlight' : ''}`.trim() },
    job.highlight ? h('p', { class: 'card__label' }, t(lang, 'teach.highlight.label')) : null,
    h('h3', { class: 'card__title' }, job.org),
    h('p', { class: 'job__role' }, pick(job.role, lang)),
    h('p', { class: 'job__period' }, pick(job.period, lang)),
    job.highlight ? h('p', { class: 'job__detail' }, pick(job.detail, lang)) : null,
  );
}

export function renderTeacher(lang) {
  const [highlight, ...others] = TEACHING;
  const otherSizes = ['span-2', 'span-2', 'span-3', 'span-3'];

  return h('section', { class: 'page view', 'data-view': 'teacher' },
    // Portada
    h('div', { class: 'bento hero' },
      h('div', { class: 'card card--pink span-4 row-2 hero__main' },
        h('p', { class: 'card__label' }, t(lang, 'hero.teacher.eyebrow')),
        h('h1', { class: 'hero__title', tabindex: '-1' }, t(lang, 'hero.teacher.title')),
        h('p', { class: 'hero__lead' }, t(lang, 'hero.teacher.lead')),
        h('p', { class: 'chip chip--online' }, t(lang, 'hero.online')),
        contactButtons(lang),
      ),
      photoCard(lang),
      sceneCard(lang, 'teacher', 'span-4'),
      h('div', { class: 'card span-2 stat' },
        h('p', { class: 'stat__number' }, t(lang, 'teach.lessons.number')),
        h('p', { class: 'stat__label' }, t(lang, 'teach.lessons.label')),
        h('p', { class: 'stat__detail' }, t(lang, 'teach.lessons.detail')),
      ),
    ),

    // Experiencia docente
    h('section', { class: 'section', 'aria-labelledby': 'teach-title' },
      sectionHead(lang, { id: 'teach-title', titleKey: 'teach.title', leadKey: 'teach.lead' }),
      h('div', { class: 'bento' },
        teachingCard(highlight, lang, 'span-4 row-2'),
        others.map((job, i) => teachingCard(job, lang, otherSizes[i])),
      ),
    ),

    // Qué enseño
    h('section', { class: 'section', 'aria-labelledby': 'offer-title' },
      sectionHead(lang, { id: 'offer-title', titleKey: 'offer.title' }),
      h('div', { class: 'bento' },
        ['programming', 'design', 'dev'].map((k) =>
          h('article', { class: `card span-2 offer offer--${k}` },
            h('span', { class: 'offer__cube', 'aria-hidden': 'true' }),
            h('h3', { class: 'card__title' }, t(lang, `offer.${k}.title`)),
            h('p', {}, t(lang, `offer.${k}.text`)),
          ),
        ),
        h('article', { class: 'card card--pink span-6 offer-how' },
          h('h3', { class: 'card__title' }, t(lang, 'offer.how.title')),
          h('p', {}, t(lang, 'offer.how.text')),
        ),
      ),
    ),

    // Proyectos
    h('section', { class: 'section', id: 'projects-teacher', 'aria-labelledby': 'projects-teacher-title' },
      sectionHead(lang, { id: 'projects-teacher-title', titleKey: 'projects.teacher.title', leadKey: 'projects.teacher.lead' }),
      projectsGrid(lang, { detailed: false }),
      h('div', { class: 'bento note-row' }, studentsNote(lang, 'teacher')),
    ),

    renderContact(lang, 'teacher'),
  );
}
