import { canUse3D, renderSceneFallback } from './three/canUse3D.js';
import { enableTilt } from './tilt.js';

const use3D = canUse3D(window);
let scenes = [];
let sceneModule = null;

function idle(fn) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 1200 });
  else setTimeout(fn, 300);
}

async function mountScene(container) {
  if (container.dataset.mounted) return;
  container.dataset.mounted = '1';
  if (!use3D) {
    container.append(renderSceneFallback());
    return;
  }
  try {
    sceneModule ??= await import('./three/scene.js');
    const variant = container.id.endsWith('developer') ? 'developer' : 'teacher';
    scenes.push(sceneModule.initScene(container, { variant }));
  } catch (err) {
    console.warn('[3d] no se pudo iniciar la escena', err);
    container.append(renderSceneFallback());
  }
}

function mountVisible(root) {
  const container = root.querySelector('[data-view]:not([hidden]) .hero-3d');
  if (container) idle(() => mountScene(container));
  scenes.forEach((s) => s.update());
}

/** Tras cada render completo (p. ej., cambio de idioma). */
export function onRender(root) {
  scenes.forEach((s) => s.dispose());
  scenes = [];
  enableTilt(root);
  mountVisible(root);
}

/** Tras cambiar de vista. */
export function onViewChange(root) {
  mountVisible(root);
}
