import { h, externalLink } from './dom.js';
import { t } from '../i18n.js';
import { asset } from '../paths.js';
import { REVIEWS, SUPERPROF_RATING, SOCIAL, VIDEOS } from '../content/social.js';
import { CONTACT } from './contact.js';
import { sectionHead } from './shared.js';

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

/** Enlaces a redes sociales (solo las que tienen URL). */
export function socialLinks(lang, className = '') {
  const newTab = t(lang, 'project.link.newtab');
  return h('ul', { class: `social ${className}`.trim(), 'aria-label': t(lang, 'social.label') },
    SOCIAL.map((s) => h('li', {}, externalLink(s.href, s.label, newTab, { class: 'social__link', 'data-social': s.id }))));
}

/** Reseñas reales de Superprof, con la calificación y un enlace para verificarlas. */
export function renderReviews(lang) {
  const newTab = t(lang, 'project.link.newtab');
  const sizes = ['span-3', 'span-3', 'span-3', 'span-3'];
  const cards = REVIEWS.map((r, i) => h('figure', { class: `card ${sizes[i]} review ${r.kind === 'parent' ? 'card--pink review--parent' : ''}`.trim(), 'data-reveal-item': '' },
    r.stars ? h('p', { class: 'review__stars', 'aria-label': fill(t(lang, 'reviews.stars'), { n: r.stars }) }, '★'.repeat(r.stars)) : null,
    h('blockquote', { class: 'review__text', lang: 'es' }, `“${r.text}”`),
    h('figcaption', { class: 'review__who' },
      h('strong', {}, r.name), ' · ', t(lang, `reviews.kind.${r.kind}`)),
  ));
  return h('section', { class: 'section', id: 'reviews', 'data-section': 'reviews', 'data-reveal': '', 'aria-labelledby': 'reviews-title' },
    sectionHead(lang, { id: 'reviews-title', titleKey: 'reviews.title', leadKey: 'reviews.lead' }),
    h('p', { class: 'reviews__rating' },
      h('span', { class: 'reviews__score' }, `★ ${SUPERPROF_RATING.score}`),
      ' ', fill(t(lang, 'reviews.rating'), { n: SUPERPROF_RATING.count }), ' ',
      externalLink(CONTACT.superprof, t(lang, 'reviews.verify'), newTab, { class: 'text-link' })),
    h('div', { class: 'bento' }, cards),
    lang === 'en' ? h('p', { class: 'reviews__note' }, t(lang, 'reviews.original')) : null,
  );
}

/** Videos cortos: se cargan solo al pulsar play. */
export function renderVideos(lang) {
  const cards = VIDEOS.map((v) => h('figure', { class: 'card card--flush span-2 short', 'data-reveal-item': '' },
    h('video', {
      class: 'short__video',
      src: asset(`assets/videos/${v.id}.mp4`),
      poster: asset(`assets/videos/${v.id}.jpg`),
      controls: true,
      preload: 'none',
      playsinline: true,
      width: 540,
      height: 960,
      'aria-label': t(lang, v.titleKey),
    }),
    h('figcaption', { class: 'short__title' }, t(lang, v.titleKey)),
  ));
  return h('section', { class: 'section', id: 'videos', 'data-section': 'videos', 'data-reveal': '', 'aria-labelledby': 'videos-title' },
    sectionHead(lang, { id: 'videos-title', titleKey: 'videos.title', leadKey: 'videos.lead' }),
    h('div', { class: 'bento' }, cards),
    h('div', { class: 'videos__follow' },
      h('p', { class: 'card__label' }, t(lang, 'social.follow')),
      socialLinks(lang)),
  );
}
