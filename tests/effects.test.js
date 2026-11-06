import { test, expect, vi } from 'vitest';
import { createEffects } from '../src/effects.js';

function page(lang) {
  const root = document.createElement('div');
  root.innerHTML = `<section data-view="teacher"><div class="hero-3d" id="hero-3d-teacher" data-lang="${lang}"></div></section>`;
  return root;
}

test('cambiar de idioma rápido deja exactamente una escena viva y nunca monta en contenedores ya retirados', async () => {
  const queue = [];
  const live = new Set();
  const initScene = vi.fn((container) => {
    const s = { container, update() {}, dispose: () => live.delete(s) };
    live.add(s);
    return s;
  });
  const fx = createEffects({ use3D: true, idle: (fn) => queue.push(fn), loadScene: async () => ({ initScene }) });

  const host = document.createElement('div');
  document.body.append(host);
  // Tres renders seguidos (dos cambios de idioma) antes de que corra ningún callback diferido.
  for (const lang of ['es', 'en', 'es']) {
    host.replaceChildren(page(lang));
    fx.onRender(host);
  }
  for (const fn of queue.splice(0)) await fn();

  expect(live.size).toBe(1);
  expect([...live][0].container.isConnected).toBe(true);
  for (const call of initScene.mock.calls) expect(call[0].isConnected).toBe(true);
  host.remove();
});

test('sin 3D monta el respaldo de bloques', async () => {
  const queue = [];
  const fx = createEffects({ use3D: false, idle: (fn) => queue.push(fn), loadScene: async () => ({}) });
  const host = document.createElement('div');
  document.body.append(host);
  host.replaceChildren(page('es'));
  fx.onRender(host);
  for (const fn of queue.splice(0)) await fn();
  expect(host.querySelector('.scene-fallback')).not.toBeNull();
  host.remove();
});
