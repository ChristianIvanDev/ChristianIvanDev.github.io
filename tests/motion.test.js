import { describe, test, expect, vi } from 'vitest';
import { initReveal, animateCounter, fadeView } from '../src/motion.js';
import { renderTeacher } from '../src/render/teacher.js';

/** IntersectionObserver simulado: guarda los elementos y deja disparar la intersección a mano. */
function fakeIO() {
  const observers = [];
  class IO {
    constructor(cb) { this.cb = cb; this.els = new Set(); observers.push(this); }
    observe(el) { this.els.add(el); }
    unobserve(el) { this.els.delete(el); }
    disconnect() { this.els.clear(); }
  }
  const fire = (el) => observers.forEach((o) => o.els.has(el) && o.cb([{ target: el, isIntersecting: true }], o));
  return { IO, fire };
}

function page() {
  const root = document.createElement('div');
  root.innerHTML = `
    <section data-reveal id="a"><p data-reveal-item>1</p><p data-reveal-item>2</p><p data-reveal-item>3</p></section>
    <section data-reveal id="b"></section>`;
  return root;
}

describe('initReveal', () => {
  test('con movimiento reducido no oculta nada', () => {
    const root = page();
    initReveal(root, { reduced: true, IO: fakeIO().IO });
    expect(root.querySelectorAll('.is-pending').length).toBe(0);
  });

  test('sin IntersectionObserver no oculta nada', () => {
    const root = page();
    initReveal(root, { reduced: false, IO: undefined });
    expect(root.querySelectorAll('.is-pending').length).toBe(0);
  });

  test('revela una sola vez al entrar en pantalla y escalona los hijos', () => {
    const root = page();
    const { IO, fire } = fakeIO();
    initReveal(root, { reduced: false, IO });
    const a = root.querySelector('#a');
    expect(a.classList.contains('is-pending')).toBe(true);
    fire(a);
    expect(a.classList.contains('is-revealed')).toBe(true);
    expect(a.classList.contains('is-pending')).toBe(false);
    fire(a);
    expect(a.classList.contains('is-revealed')).toBe(true);
    const items = [...a.querySelectorAll('[data-reveal-item]')].map((n) => n.style.getPropertyValue('--i'));
    expect(items).toEqual(['0', '1', '2']);
  });

  test('si el observador nunca responde, todo se vuelve visible igualmente', () => {
    vi.useFakeTimers();
    const root = page();
    initReveal(root, { reduced: false, IO: fakeIO().IO });
    expect(root.querySelectorAll('.is-pending').length).toBe(2);
    vi.advanceTimersByTime(1500);
    expect(root.querySelectorAll('.is-pending').length).toBe(0);
    vi.useRealTimers();
  });

  test('en una pestaña oculta no se oculta nada', () => {
    const root = page();
    const spy = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    initReveal(root, { reduced: false, IO: fakeIO().IO });
    expect(root.querySelectorAll('.is-pending').length).toBe(0);
    spy.mockRestore();
  });

  test('al imprimir se muestra todo', () => {
    const root = page();
    initReveal(root, { reduced: false, IO: fakeIO().IO });
    window.dispatchEvent(new Event('beforeprint'));
    expect(root.querySelectorAll('.is-pending').length).toBe(0);
  });

  test('la limpieza deja todo visible', () => {
    const root = page();
    const cleanup = initReveal(root, { reduced: false, IO: fakeIO().IO });
    cleanup();
    expect(root.querySelectorAll('.is-pending').length).toBe(0);
  });
});

describe('animateCounter', () => {
  test('con movimiento reducido muestra la cifra final y el texto real para lectores de pantalla', () => {
    const wrap = document.createElement('div');
    wrap.innerHTML = '<p class="stat__number" data-count-to="2000" data-count-format="+{n}" aria-hidden="true">+2,000</p><span class="visually-hidden">+2,000 clases dadas</span>';
    const el = wrap.querySelector('[data-count-to]');
    animateCounter(el, { reduced: true, IO: fakeIO().IO });
    expect(el.textContent).toBe('+2,000');
    expect(wrap.querySelector('.visually-hidden').textContent).toBe('+2,000 clases dadas');
  });

  test('al entrar en pantalla empieza desde cero', () => {
    const el = document.createElement('p');
    el.dataset.countTo = '2000';
    el.dataset.countFormat = '{n}+';
    el.textContent = '2,000+';
    const { IO, fire } = fakeIO();
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
    animateCounter(el, { reduced: false, IO });
    fire(el);
    expect(el.textContent).toBe('0+');
    raf.mockRestore();
  });
});

describe('fadeView', () => {
  test('no anima si el cambio vino del teclado o con movimiento reducido', () => {
    const section = document.createElement('section');
    section.animate = vi.fn();
    fadeView(section, { reduced: false, fromKeyboard: true });
    fadeView(section, { reduced: true, fromKeyboard: false });
    expect(section.animate).not.toHaveBeenCalled();
    fadeView(section, { reduced: false, fromKeyboard: false });
    expect(section.animate).toHaveBeenCalledTimes(1);
  });
});

test('la vista Profesor marca secciones para revelar y el contador', () => {
  const el = renderTeacher('es');
  expect(el.querySelectorAll('[data-reveal]').length).toBeGreaterThanOrEqual(5);
  const counter = el.querySelector('[data-count-to="2000"]');
  expect(counter).not.toBeNull();
  expect(counter.getAttribute('aria-hidden')).toBe('true');
  expect(counter.parentElement.querySelector('.visually-hidden').textContent).toContain('+2,000');
});
