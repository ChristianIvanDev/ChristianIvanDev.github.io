import { h } from './dom.js';
import { asset } from '../paths.js';
import { t } from '../i18n.js';
import { PROJECTS } from '../content/projects.js';
import { renderProjectCard } from './projectCard.js';

export function sectionHead(lang, { id, titleKey, leadKey }) {
  return h('div', { class: 'section__head' },
    h('h2', { class: 'section__title', id }, t(lang, titleKey)),
    leadKey ? h('p', { class: 'section__lead' }, t(lang, leadKey)) : null,
  );
}

export function photoCard(lang) {
  return h('figure', { class: 'card card--flush photo span-2 row-2' },
    h('img', {
      src: asset('assets/photo/christian.webp'),
      alt: t(lang, 'hero.photo.alt'),
      width: 900,
      height: 1125,
      fetchpriority: 'high',
    }),
  );
}

export function sceneCard(lang, view, className) {
  return h('div', {
    class: `card card--flush scene ${className}`,
    role: 'img',
    'aria-label': t(lang, 'hero.scene.label'),
  }, h('div', { class: 'hero-3d', id: `hero-3d-${view}` }));
}

export function studentsNote(lang, view) {
  return h('aside', { class: 'card note span-6', 'aria-labelledby': `students-${view}` },
    h('h3', { class: 'note__title', id: `students-${view}` }, t(lang, 'students.title')),
    h('p', {}, t(lang, 'students.note')),
  );
}

/** Proyectos en bento: destacados grandes, el resto en tarjetas pequeñas. */
export function projectsGrid(lang, { detailed }) {
  return h('div', { class: 'bento projects' },
    PROJECTS.map((p) => {
      let size;
      if (detailed) size = p.featured ? 'span-3' : 'span-3';
      else if (p.featured) size = 'span-3 row-2';
      else if (p.group === 'roblox') size = 'span-3';
      else size = 'span-2';
      if (!detailed && p.id === 'plataforma-aduanera') size = 'span-6 project--wide';
      return renderProjectCard(p, lang, { detailed, className: size });
    }),
  );
}
