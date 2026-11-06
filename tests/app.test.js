import { describe, test, expect, beforeEach, vi } from 'vitest';
import { mountApp } from '../src/app.js';
import { whatsappHref, renderContact } from '../src/render/contact.js';
import es from '../src/content/es.js';
import en from '../src/content/en.js';

function fakeRenderers() {
  const make = (view) => (lang) => {
    const el = document.createElement('section');
    el.dataset.view = view;
    el.innerHTML = `<h1 tabindex="-1">${view}-${lang}</h1>`;
    return el;
  };
  return { teacher: make('teacher'), developer: make('developer') };
}

function setup(search = '') {
  document.body.innerHTML = '<div id="app"></div>';
  const saved = {};
  const storage = { getItem: (k) => saved[k] ?? null, setItem: (k, v) => { saved[k] = v; } };
  const history = { replaceState: vi.fn() };
  const app = mountApp(document.getElementById('app'), { search, storage, history, renderers: fakeRenderers() });
  return { app, saved, history };
}

describe('mountApp', () => {
  beforeEach(() => { document.documentElement.lang = ''; });

  test('arranca en español y en la vista Profesor', () => {
    setup('');
    expect(document.documentElement.lang).toBe('es');
    const tab = document.querySelector('[role="tab"][data-target="teacher"]');
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('[data-view="teacher"]').hidden).toBe(false);
    expect(document.querySelector('[data-view="developer"]').hidden).toBe(true);
  });

  test('al pulsar Desarrollador cambia la vista y la URL', () => {
    const { history } = setup('');
    document.querySelector('[role="tab"][data-target="developer"]').click();
    expect(history.replaceState).toHaveBeenLastCalledWith(null, '', '?view=developer');
    expect(document.querySelector('[data-view="developer"]').hidden).toBe(false);
    expect(document.querySelector('[data-view="teacher"]').hidden).toBe(true);
    expect(document.querySelector('[role="tab"][data-target="developer"]').getAttribute('aria-selected')).toBe('true');
  });

  test('al pulsar el botón de idioma cambia a inglés y lo recuerda', () => {
    const { saved, history } = setup('');
    document.querySelector('[data-action="toggle-lang"]').click();
    expect(document.documentElement.lang).toBe('en');
    expect(saved.lang).toBe('en');
    expect(document.querySelector('[role="tab"][data-target="teacher"]').textContent).toBe(en['nav.view.teacher']);
    expect(document.querySelector('[data-view="teacher"] h1').textContent).toBe('teacher-en');
    expect(history.replaceState).toHaveBeenLastCalledWith(null, '', '?lang=en');
  });

  test('el foco vuelve al botón de idioma tras cambiar de idioma', () => {
    setup('');
    document.querySelector('[data-action="toggle-lang"]').focus();
    document.querySelector('[data-action="toggle-lang"]').click();
    expect(document.activeElement?.dataset.action).toBe('toggle-lang');
  });

  test('respeta la vista y el idioma de la URL', () => {
    setup('?view=developer&lang=en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.querySelector('[data-view="developer"]').hidden).toBe(false);
  });

  test('las pestañas se manejan con las flechas del teclado', () => {
    setup('');
    const teacherTab = document.querySelector('[role="tab"][data-target="teacher"]');
    teacherTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.querySelector('[data-view="developer"]').hidden).toBe(false);
  });
});

describe('contacto', () => {
  test('el enlace de WhatsApp lleva el número y el mensaje en el idioma activo', () => {
    expect(whatsappHref('es')).toBe(`https://wa.me/527531501861?text=${encodeURIComponent(es['contact.whatsappMessage'])}`);
    expect(whatsappHref('en')).toContain(encodeURIComponent(en['contact.whatsappMessage']));
  });

  test('el bloque de contacto enlaza a correo y Superprof', () => {
    const el = renderContact('es', 'teacher');
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('mailto:christianespinozagaytan@gmail.com');
    expect(hrefs).toContain('https://www.superprof.mx/profesor-joven-con-anos-experiencia-programacion-aprende-desarrollo-web-python-css-roblox-desde-cero.html');
    expect(el.textContent).toContain(es['contact.teacher.title']);
  });
});
