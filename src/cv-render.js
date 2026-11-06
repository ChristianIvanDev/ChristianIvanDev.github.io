import { h } from './render/dom.js';
import { t, pick } from './i18n.js';
import { TEACHING, DEV_JOBS, EDUCATION, CERTIFICATIONS, STACK } from './content/experience.js';
import { PROJECTS } from './content/projects.js';
import { CONTACT } from './render/contact.js';
import { asset } from './paths.js';

const CV_PROJECTS = ['caza-de-monstruos', 'build-a-pipe', 'haunted-obby', 'culto-del-juicio', 'agenda-docente', 'plataforma-aduanera'];

export function cvHref(lang) {
  return asset(`cv/CV-Christian-Espinoza-${lang.toUpperCase()}.pdf`);
}

/** Botón "Descargar CV" para las vistas. */
export function cvButton(lang, className = 'btn btn--secondary') {
  return h('a', { class: className, href: cvHref(lang), download: true, 'data-cv': '' }, t(lang, 'cta.cv'));
}

function jobs(list, lang) {
  return h('ol', { class: 'cv-jobs' },
    list.map((j) =>
      h('li', {},
        h('div', { class: 'cv-jobs__head' },
          h('strong', {}, pick(j.role, lang)),
          h('span', {}, pick(j.period, lang)),
        ),
        h('p', { class: 'cv-jobs__org' }, j.org),
        h('p', {}, pick(j.detail, lang)),
      ),
    ),
  );
}

export function renderCV(lang) {
  const projects = CV_PROJECTS.map((id) => PROJECTS.find((p) => p.id === id));
  return h('article', { class: 'cv' },
    h('header', { class: 'cv-head' },
      h('img', { src: asset('assets/photo/christian.webp'), alt: t(lang, 'hero.photo.alt'), width: 900, height: 1125 }),
      h('div', {},
        h('h1', {}, t(lang, 'cv.title')),
        h('p', { class: 'cv-role' }, t(lang, 'cv.role')),
        h('p', { class: 'cv-summary' }, t(lang, 'cv.summary')),
        h('ul', { class: 'cv-contact', 'aria-label': t(lang, 'cv.contact') },
          h('li', {}, CONTACT.email),
          h('li', {}, `WhatsApp ${CONTACT.phoneDisplay}`),
          h('li', {}, 'linkedin.com/in/christianieg'),
        ),
      ),
    ),
    h('section', {}, h('h2', {}, t(lang, 'cv.teaching')), jobs(TEACHING, lang)),
    h('section', {}, h('h2', {}, t(lang, 'cv.developer')), jobs(DEV_JOBS, lang)),
    h('section', {},
      h('h2', {}, t(lang, 'cv.projects')),
      h('ul', { class: 'cv-projects' },
        projects.map((p) => h('li', {}, h('strong', {}, pick(p.title, lang)), ` — ${pick(p.summary, lang)}`)),
      ),
    ),
    h('section', { class: 'cv-cols' },
      h('div', {}, h('h2', {}, t(lang, 'cv.education')), jobs(EDUCATION, lang)),
      h('div', {},
        h('h2', {}, t(lang, 'cv.certs')),
        h('ul', { class: 'cv-list' }, CERTIFICATIONS.map((c) => h('li', {}, c))),
        h('h2', { class: 'cv-gap' }, t(lang, 'dev.stack.title')),
        h('p', {}, STACK.join(' · ')),
      ),
    ),
  );
}
