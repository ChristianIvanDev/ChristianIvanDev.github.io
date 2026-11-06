import { renderStickyBar } from './render/stickyBar.js';

export function stickyVisible({ heroVisible, contactVisible }) {
  return !heroVisible && !contactVisible;
}

/**
 * Monta la barra fija de reserva si la vista visible es la de Profesor y la pantalla es de móvil.
 * Devuelve una función que la desmonta.
 */
export function initSticky(root, lang, { IO = window.IntersectionObserver, matchMedia = window.matchMedia?.bind(window) } = {}) {
  const view = root.querySelector('[data-view="teacher"]');
  const mobile = matchMedia?.('(max-width: 640px)').matches;
  if (!view || view.hidden || !mobile || typeof IO !== 'function') return () => {};

  document.querySelectorAll('.sticky-cta').forEach((el) => el.remove());
  const bar = renderStickyBar(lang);
  document.body.append(bar);
  document.body.classList.add('has-sticky');

  const seen = { heroVisible: true, contactVisible: false };
  const hero = view.querySelector('.hero');
  const contact = view.querySelector('.contact');
  const io = new IO((entries) => {
    for (const e of entries) {
      if (e.target === hero) seen.heroVisible = e.isIntersecting;
      if (e.target === contact) seen.contactVisible = e.isIntersecting;
    }
    bar.classList.toggle('is-visible', stickyVisible(seen));
  });
  if (hero) io.observe(hero);
  if (contact) io.observe(contact);

  return () => {
    io.disconnect();
    bar.remove();
    document.body.classList.remove('has-sticky');
  };
}
