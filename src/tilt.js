/** Inclinación 3D leve (máx. 4°) al pasar el ratón por las tarjetas con [data-tilt]. */
export function enableTilt(root, selector = '[data-tilt]') {
  const ok = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!ok) return;

  const MAX = 4;
  for (const card of root.querySelectorAll(selector)) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) translateY(-3px) rotateX(${(-y * MAX).toFixed(2)}deg) rotateY(${(x * MAX).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }
}
