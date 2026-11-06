import { h, externalLink } from './dom.js';
import { t } from '../i18n.js';

export const CONTACT = {
  phoneDisplay: '+52 753 150 1861',
  whatsappNumber: '527531501861',
  email: 'christianespinozagaytan@gmail.com',
  superprof: 'https://www.superprof.mx/profesor-joven-con-anos-experiencia-programacion-aprende-desarrollo-web-python-css-roblox-desde-cero.html',
  linkedin: 'https://www.linkedin.com/in/christianieg/',
  /** Página de reservas de Google Calendar. Vacía = se usa WhatsApp como llamada principal. */
  booking: 'https://calendar.app.google/kydiVgoRNTarLdCv6',
};

export function whatsappHref(lang) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(t(lang, 'contact.whatsappMessage'))}`;
}

/** Llamada a la acción principal: reservar en Google Calendar o, si no hay enlace, WhatsApp. */
export function primaryCta(lang, { booking = CONTACT.booking } = {}) {
  if (booking) return { kind: 'booking', href: booking, label: t(lang, 'cta.book') };
  return { kind: 'whatsapp', href: whatsappHref(lang), label: t(lang, 'cta.whatsapp') };
}

/**
 * Botones de contacto. Con `primary`, el primero es la reserva (vista Profesor);
 * sin él, WhatsApp + correo (vista Desarrollador).
 */
export function contactButtons(lang, { size = 'lg', primary = false } = {}) {
  const newTab = t(lang, 'project.link.newtab');
  const cta = primary ? primaryCta(lang) : null;
  const buttons = [];
  if (cta?.kind === 'booking') {
    buttons.push(externalLink(cta.href, cta.label, newTab, { class: 'btn btn--primary', 'data-cta': 'booking' }));
    buttons.push(externalLink(whatsappHref(lang), t(lang, 'cta.whatsapp'), newTab, { class: 'btn btn--secondary' }));
  } else {
    buttons.push(externalLink(whatsappHref(lang), t(lang, 'cta.whatsapp'), newTab, { class: 'btn btn--primary' }));
  }
  buttons.push(h('a', { class: 'btn btn--secondary', href: `mailto:${CONTACT.email}` }, t(lang, 'cta.email')));
  return h('div', { class: `cta-row cta-row--${size}` }, buttons);
}

export function guaranteeLine(lang) {
  return h('p', { class: 'guarantee' }, t(lang, 'guarantee.text'));
}

export function renderContact(lang, view) {
  return h('section', { class: 'section contact', 'aria-labelledby': `contact-${view}` },
    h('div', { class: 'bento' },
      h('div', { class: 'card card--pink span-4 contact__main' },
        h('h2', { id: `contact-${view}`, class: 'contact__title' }, t(lang, `contact.${view}.title`)),
        h('p', { class: 'contact__lead' }, t(lang, `contact.${view}.lead`)),
        contactButtons(lang, { primary: view === 'teacher' }),
        view === 'teacher' ? guaranteeLine(lang) : null,
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
