import { describe, test, expect } from 'vitest';
import { stickyVisible, initSticky } from '../src/sticky.js';
import { renderStickyBar } from '../src/render/stickyBar.js';
import en from '../src/content/en.js';

const mq = (matches) => () => ({ matches });
class IO { constructor(cb) { this.cb = cb; } observe() {} unobserve() {} disconnect() {} }

function app(view = 'teacher') {
  document.body.innerHTML = `
    <div id="app">
      <section data-view="teacher" ${view === 'teacher' ? '' : 'hidden'}><div class="hero"></div><section class="contact"></section></section>
      <section data-view="developer" ${view === 'developer' ? '' : 'hidden'}><div class="hero"></div><section class="contact"></section></section>
    </div>`;
  return document.getElementById('app');
}

describe('stickyVisible', () => {
  test('solo se ve cuando ni la portada ni el contacto están en pantalla', () => {
    expect(stickyVisible({ heroVisible: true, contactVisible: false })).toBe(false);
    expect(stickyVisible({ heroVisible: false, contactVisible: true })).toBe(false);
    expect(stickyVisible({ heroVisible: true, contactVisible: true })).toBe(false);
    expect(stickyVisible({ heroVisible: false, contactVisible: false })).toBe(true);
  });
});

test('la barra lleva el texto del idioma y el enlace de reserva', () => {
  const el = renderStickyBar('en');
  expect(el.textContent).toContain(en['sticky.text']);
  expect(el.querySelector('a').getAttribute('href')).toBe('https://calendar.app.google/kydiVgoRNTarLdCv6');
});

describe('initSticky', () => {
  test('montar, limpiar y volver a montar deja una sola barra', () => {
    const root = app();
    const c1 = initSticky(root, 'es', { IO, matchMedia: mq(true) });
    c1();
    initSticky(root, 'en', { IO, matchMedia: mq(true) });
    expect(document.querySelectorAll('.sticky-cta').length).toBe(1);
    expect(document.querySelector('.sticky-cta').textContent).toContain(en['sticky.text']);
  });

  test('en escritorio no se monta', () => {
    initSticky(app(), 'es', { IO, matchMedia: mq(false) });
    expect(document.querySelector('.sticky-cta')).toBeNull();
  });

  test('en la vista Desarrollador no se monta', () => {
    initSticky(app('developer'), 'es', { IO, matchMedia: mq(true) });
    expect(document.querySelector('.sticky-cta')).toBeNull();
  });
});
