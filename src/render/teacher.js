import { h } from './dom.js';
import { t, pick } from '../i18n.js';
import { TEACHING } from '../content/experience.js';
import { contactButtons, renderContact, guaranteeLine, CONTACT } from './contact.js';
import { renderNeed, renderPath, renderFaq } from './persuade.js';
import { cvButton } from '../cv-render.js';
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
      h('div', { class: 'card card--pink span-4 row-2 hero__main', 'data-enter': '' },
        h('p', { class: 'card__label' }, t(lang, 'hero.teacher.eyebrow')),
        h('h1', { class: 'hero__title', tabindex: '-1' }, t(lang, 'hero.teacher.title')),
        h('p', { class: 'hero__lead' }, t(lang, 'hero.teacher.lead')),
        h('p', { class: 'chip chip--online' }, t(lang, 'hero.online')),
        contactButtons(lang, { primary: true }),
        guaranteeLine(lang),
      ),
      photoCard(lang),
      sceneCard(lang, 'teacher', 'span-4'),
      h('div', { class: 'card span-2 stat' },
        h('p', {
          class: 'stat__number',
          'aria-hidden': 'true',
          'data-count-to': '2000',
          'data-count-format': t(lang, 'teach.lessons.number').replace('2,000', '{n}'),
        }, t(lang, 'teach.lessons.number')),
        h('span', { class: 'visually-hidden' }, `${t(lang, 'teach.lessons.number')} ${t(lang, 'teach.lessons.label')}`),
        h('p', { class: 'stat__label', 'aria-hidden': 'true' }, t(lang, 'teach.lessons.label')),
        h('p', { class: 'stat__detail' }, t(lang, 'teach.lessons.detail')),
      ),
    ),

    renderNeed(lang),

    // Experiencia docente
    h('section', { class: 'section', 'data-section': 'teach', 'data-reveal': '', 'aria-labelledby': 'teach-title' },
      sectionHead(lang, { id: 'teach-title', titleKey: 'teach.title', leadKey: 'teach.lead' }),
      h('p', { class: 'section__action' }, cvButton(lang, 'text-link')),
      h('div', { class: 'bento' },
        teachingCard(highlight, lang, 'span-4 row-2'),
        others.map((job, i) => teachingCard(job, lang, otherSizes[i])),
      ),
    ),

    renderPath(lang),

    // Proyectos
    h('section', { class: 'section', id: 'projects-teacher', 'data-section': 'projects', 'data-reveal': '', 'aria-labelledby': 'projects-teacher-title' },
      sectionHead(lang, { id: 'projects-teacher-title', titleKey: 'projects.teacher.title', leadKey: 'projects.teacher.lead' }),
      projectsGrid(lang, { detailed: false }),
      h('div', { class: 'bento note-row' }, studentsNote(lang, 'teacher')),
    ),

    renderFaq(lang, { booking: Boolean(CONTACT.booking) }),

    renderContact(lang, 'teacher'),
  );
}
