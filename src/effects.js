import { canUse3D, renderSceneFallback } from './three/canUse3D.js';
import { enableTilt } from './tilt.js';
import { initReveal, animateCounter, fadeView } from './motion.js';
import { initSticky } from './sticky.js';

function defaultIdle(fn) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 1200 });
  else setTimeout(fn, 300);
}

/**
 * Efectos que dependen del DOM ya montado: escena 3D (o su respaldo) e inclinación de tarjetas.
 * Cada render nuevo invalida el trabajo diferido del anterior (token `generation`), para que
 * un cambio de idioma rápido nunca deje escenas montadas en contenedores ya retirados.
 */
export function createEffects({ use3D = canUse3D(window), idle = defaultIdle, loadScene = () => import('./three/scene.js') } = {}) {
  let scenes = [];
  let generation = 0;
  let cleanupReveal = () => {};
  let cleanupSticky = () => {};

  function remountSticky(root, state) {
    cleanupSticky();
    cleanupSticky = state ? initSticky(root, state.lang) : () => {};
  }

  async function mountScene(container, gen) {
    if (gen !== generation || !container.isConnected || container.dataset.mounted) return;
    container.dataset.mounted = '1';
    if (!use3D) {
      container.append(renderSceneFallback());
      return;
    }
    try {
      const mod = await loadScene();
      if (gen !== generation || !container.isConnected) return;
      const variant = container.id.endsWith('developer') ? 'developer' : 'teacher';
      scenes.push(mod.initScene(container, { variant }));
    } catch (err) {
      console.warn('[3d] no se pudo iniciar la escena', err);
      container.append(renderSceneFallback());
    }
  }

  function mountVisible(root) {
    const container = root.querySelector('[data-view]:not([hidden]) .hero-3d');
    const gen = generation;
    if (container) idle(() => mountScene(container, gen));
    scenes.forEach((s) => s.update());
  }

  return {
    /** Tras cada render completo (p. ej., cambio de idioma). */
    onRender(root, state) {
      generation += 1;
      scenes.forEach((s) => s.dispose());
      scenes = [];
      cleanupReveal();
      cleanupReveal = initReveal(root);
      root.querySelectorAll('[data-count-to]').forEach((el) => animateCounter(el));
      enableTilt(root);
      mountVisible(root);
      remountSticky(root, state);
    },
    /** Tras cambiar de vista. */
    onViewChange(root, state, { fromKeyboard = false } = {}) {
      fadeView(root.querySelector('[data-view]:not([hidden])'), { fromKeyboard });
      mountVisible(root);
      remountSticky(root, state);
    },
  };
}
