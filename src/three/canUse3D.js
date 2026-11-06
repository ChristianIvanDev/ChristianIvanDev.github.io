/** Composición fija de bloques en CSS para cuando no se carga la escena 3D. */
export function renderSceneFallback() {
  const el = document.createElement('div');
  el.className = 'scene-fallback';
  el.setAttribute('aria-hidden', 'true');
  for (let i = 1; i <= 6; i++) {
    const b = document.createElement('span');
    b.className = `scene-fallback__block scene-fallback__block--${i}`;
    el.append(b);
  }
  return el;
}

/** ¿Merece la pena cargar la escena 3D en este dispositivo? */
export function canUse3D(win = window) {
  try {
    if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    const cores = win.navigator?.hardwareConcurrency;
    if (typeof cores === 'number' && cores < 4) return false;
    const canvas = win.document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}
