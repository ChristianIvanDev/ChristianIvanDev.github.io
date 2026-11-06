import { h, externalLink } from './dom.js';
import { t } from '../i18n.js';

export const CONTACT = {
  phoneDisplay: '+52 753 150 1861',
  whatsappNumber: '527531501861',
  email: 'christianespinozagaytan@gmail.com',
  superprof: 'https://www.superprof.mx/profesor-joven-con-anos-experiencia-programacion-aprende-desarrollo-web-python-css-roblox-desde-cero.html',
  linkedin: 'https://www.linkedin.com/in/christianieg/',
};

export function whatsappHref(lang) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(t(lang, 'contact.whatsappMessage'))}`;
}

/** Botones principales de contacto (WhatsApp + correo). */
export function contactButtons(lang, { size = 'lg' } = {}) {
  return h('div', { class: `cta-row cta-row--${size}` },
    externalLink(whatsappHref(lang), t(lang, 'cta.whatsapp'), t(lang, 'project.link.newtab'), { class: 'btn btn--primary' }),
    h('a', { class: 'btn btn--secondary', href: `mailto:${CONTACT.email}` }, t(lang, 'cta.email')),
  );
}

export function renderContact(lang, view) {
  return h('section', { class: 'section contact', 'aria-labelledby': `contact-${view}` },
    h('div', { class: 'bento' },
      h('div', { class: 'card card--pink span-4 contact__main' },
        h('h2', { id: `contact-${view}`, class: 'contact__title' }, t(lang, `contact.${view}.title`)),
        h('p', { class: 'contact__lead' }, t(lang, `contact.${view}.lead`)),
        contactButtons(lang),
      ),
      h('div', { class: 'card span-2 contact__side' },
        h('p', { class: 'card__label' }, t(lang, 'contact.superprof.lead')),
        externalLink(CONTACT.superprof, t(lang, 'cta.superprof'), t(lang, 'project.link.newtab'), { class: 'text-link' }),
        h('p', { class: 'card__label contact__gap' }, t(lang, 'contact.linkedin')),
        externalLink(CONTACT.linkedin, 'linkedin.com/in/christianieg', t(lang, 'project.link.newtab'), { class: 'text-link' }),
      ),
    ),
  );
}
