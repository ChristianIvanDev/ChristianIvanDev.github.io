import { h, externalLink } from './dom.js';
import { t } from '../i18n.js';
import { PRICING, packageMath, money } from '../content/pricing.js';
import { primaryCta, whatsappHref } from './contact.js';
import { sectionHead } from './shared.js';

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

/** Precios honestos: primera clase gratis, clase suelta (directo vs Superprof) y paquetes. */
export function renderPricing(lang) {
  const newTab = t(lang, 'project.link.newtab');
  const cta = primaryCta(lang);

  const free = h('article', { class: 'card card--pink span-2 price price--free', 'data-reveal-item': '' },
    h('p', { class: 'card__label' }, t(lang, 'pricing.free.label')),
    h('h3', { class: 'card__title' }, t(lang, 'pricing.free.title')),
    h('p', { class: 'price__big' }, t(lang, 'pricing.free.price')),
    h('p', { class: 'price__text' }, t(lang, 'pricing.free.text')),
    externalLink(cta.href, cta.label, newTab, { class: 'btn btn--primary price__btn' }),
  );

  const single = h('article', { class: 'card span-4 price price--single', 'data-reveal-item': '' },
    h('h3', { class: 'card__title' }, t(lang, 'pricing.single.title')),
    h('div', { class: 'price__compare' },
      h('div', { class: 'price__opt price__opt--direct' },
        h('p', { class: 'price__big' }, money(PRICING.direct), h('span', { class: 'price__unit' }, ` ${PRICING.currency}`)),
        h('p', {}, `${t(lang, 'pricing.perClass')} · ${t(lang, 'pricing.single.direct')}`),
      ),
      h('div', { class: 'price__opt price__opt--superprof' },
        h('p', { class: 'price__mid' }, money(PRICING.superprof), h('span', { class: 'price__unit' }, ` ${PRICING.currency}`)),
        h('p', {}, `${t(lang, 'pricing.perClass')} · ${t(lang, 'pricing.single.superprof')}`),
      ),
    ),
    h('p', { class: 'price__why' }, t(lang, 'pricing.why')),
  );

  const packages = PRICING.packages.map((pkg) => {
    const m = packageMath(pkg);
    return h('article', { class: `card span-2 price price--pkg ${pkg.popular ? 'price--popular' : ''}`.trim(), 'data-package': pkg.id, 'data-reveal-item': '' },
      pkg.popular ? h('p', { class: 'chip chip--warn price__badge' }, t(lang, 'pricing.package.popular')) : null,
      h('h3', { class: 'card__title' }, fill(t(lang, 'pricing.package.name'), { n: pkg.classes })),
      h('p', { class: 'price__big' }, money(pkg.price), h('span', { class: 'price__unit' }, ` ${PRICING.currency}`)),
      h('p', {}, fill(t(lang, 'pricing.package.perHour'), { p: money(m.perHour) })),
      h('p', { class: 'price__save' }, `${fill(t(lang, 'pricing.package.savings'), { s: money(m.savings) })} (${m.discountPct} %)`),
    );
  });

  return h('section', { class: 'section', id: 'pricing', 'data-section': 'pricing', 'data-reveal': '', 'aria-labelledby': 'pricing-title' },
    sectionHead(lang, { id: 'pricing-title', titleKey: 'pricing.title', leadKey: 'pricing.lead' }),
    h('div', { class: 'bento' }, free, single),
    h('h3', { class: 'price__subhead' }, t(lang, 'pricing.packages.title')),
    h('p', { class: 'section__lead price__sublead' }, t(lang, 'pricing.packages.lead')),
    h('div', { class: 'bento' }, packages),
    h('p', { class: 'price__note' }, t(lang, 'pricing.note'), ' ',
      externalLink(whatsappHref(lang), t(lang, 'pricing.cta'), newTab, { class: 'text-link' })),
  );
}
