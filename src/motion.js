/**
 * Animaciones de la página. Todo el contenido es visible por defecto: el estado oculto
 * (.is-pending) solo lo pone este módulo cuando puede revelarlo después (hay IntersectionObserver
 * y no hay movimiento reducido).
 */

export const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const MAX_STAGGER = 6;

/** Revela [data-reveal] al entrar en pantalla, una sola vez, escalonando sus [data-reveal-item]. */
export function initReveal(root, { reduced = prefersReduced(), IO = window.IntersectionObserver } = {}) {
  const targets = [...root.querySelectorAll('[data-reveal]')];
  targets.forEach((el) => {
    [...el.querySelectorAll('[data-reveal-item]')].forEach((item, i) => item.style.setProperty('--i', String(Math.min(i, MAX_STAGGER))));
  });
  if (reduced || typeof IO !== 'function' || targets.length === 0) return () => {};
  // En una pestaña oculta el observador puede no responder: no ocultamos nada.
  if (document.visibilityState === 'hidden') return () => {};

  const revealAll = () => targets.forEach((el) => el.classList.remove('is-pending'));
  // Seguro: el observador siempre responde al empezar a observar; si no lo hace, mostramos todo.
  const failsafe = setTimeout(revealAll, 1200);
  window.addEventListener('beforeprint', revealAll);

  const io = new IO((entries, obs) => {
    clearTimeout(failsafe);
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('is-pending');
      entry.target.classList.add('is-revealed');
      obs.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach((el) => {
    if (el.classList.contains('is-revealed')) return;
    el.classList.add('is-pending');
    io.observe(el);
  });

  return () => {
    clearTimeout(failsafe);
    window.removeEventListener('beforeprint', revealAll);
    io.disconnect();
    revealAll();
  };
}

const fmt = new Intl.NumberFormat('en-US');
const render = (format, n) => (format || '{n}').replace('{n}', fmt.format(n));

/** Cuenta de 0 al valor de data-count-to cuando el elemento entra en pantalla. */
export function animateCounter(el, { duration = 1100, reduced = prefersReduced(), IO = window.IntersectionObserver } = {}) {
  const to = Number(el.dataset.countTo);
  const format = el.dataset.countFormat;
  const final = render(format, to);
  if (reduced || typeof IO !== 'function' || !Number.isFinite(to)) {
    el.textContent = final;
    return;
  }
  const io = new IO((entries, obs) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    obs.disconnect();
    el.textContent = render(format, 0);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? render(format, Math.round(to * eased)) : final;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });
  io.observe(el);
}

/** Fundido corto al cambiar de vista (no con teclado ni con movimiento reducido). */
export function fadeView(section, { reduced = prefersReduced(), fromKeyboard = false } = {}) {
  if (!section || reduced || fromKeyboard || typeof section.animate !== 'function') return;
  section.animate(
    [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
    { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  );
}
