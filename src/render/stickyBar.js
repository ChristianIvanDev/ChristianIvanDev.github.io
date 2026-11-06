import { h, externalLink } from './dom.js';
import { t } from '../i18n.js';
import { primaryCta } from './contact.js';

/** Barra inferior fija con la llamada a la acción principal (solo móvil, vista Profesor). */
export function renderStickyBar(lang) {
  const cta = primaryCta(lang);
  return h('div', { class: 'sticky-cta', role: 'region', 'aria-label': t(lang, 'sticky.text') },
    h('p', { class: 'sticky-cta__text' }, t(lang, 'sticky.text')),
    externalLink(cta.href, cta.label, t(lang, 'project.link.newtab'), { class: 'btn btn--light sticky-cta__btn' }),
  );
}
