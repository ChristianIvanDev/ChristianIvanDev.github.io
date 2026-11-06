import { describe, test, expect } from 'vitest';
import { canUse3D, renderSceneFallback } from '../src/three/canUse3D.js';

test('el respaldo sin 3D es una composición de bloques decorativa', () => {
  const el = renderSceneFallback();
  expect(el.classList.contains('scene-fallback')).toBe(true);
  expect(el.getAttribute('aria-hidden')).toBe('true');
  expect(el.querySelectorAll('.scene-fallback__block').length).toBeGreaterThanOrEqual(5);
});

function fakeWin({ reduced = false, webgl = true, cores = 8 } = {}) {
  return {
    matchMedia: (q) => ({ matches: q.includes('reduce') ? reduced : false }),
    navigator: { hardwareConcurrency: cores },
    document: {
      createElement: () => ({ getContext: () => (webgl ? {} : null) }),
    },
  };
}

describe('canUse3D', () => {
  test('falso con movimiento reducido', () => {
    expect(canUse3D(fakeWin({ reduced: true }))).toBe(false);
  });

  test('falso sin WebGL', () => {
    expect(canUse3D(fakeWin({ webgl: false }))).toBe(false);
  });

  test('falso en dispositivos con menos de 4 núcleos', () => {
    expect(canUse3D(fakeWin({ cores: 2 }))).toBe(false);
  });

  test('verdadero en un equipo normal', () => {
    expect(canUse3D(fakeWin())).toBe(true);
  });

  test('falso si comprobar WebGL lanza un error', () => {
    const win = fakeWin();
    win.document.createElement = () => { throw new Error('sin canvas'); };
    expect(canUse3D(win)).toBe(false);
  });
});
