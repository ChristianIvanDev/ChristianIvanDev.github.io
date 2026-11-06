import { describe, test, expect } from 'vitest';
import { renderNeed, renderPath, renderFaq } from '../src/render/persuade.js';
import { STAGES } from '../src/content/learning.js';
import { renderTeacher } from '../src/render/teacher.js';
import es from '../src/content/es.js';

describe('¿Es realmente necesario?', () => {
  test('tres tarjetas con sus títulos', () => {
    const el = renderNeed('es');
    const titles = [...el.querySelectorAll('.need__card h3')].map((n) => n.textContent);
    expect(titles).toEqual([es['need.1.title'], es['need.2.title'], es['need.3.title']]);
  });
});

describe('recorrido de aprendizaje', () => {
  test('cuatro etapas, la primera seleccionada', () => {
    const el = renderPath('es');
    const tabs = el.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(4);
    expect(STAGES.map((s) => s.id)).toEqual(['logic', 'python', 'roblox', 'web']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(el.querySelector('[role="tabpanel"]').textContent).toContain(STAGES[0].learns.es);
  });

  test('al pulsar la etapa 3 se muestra Roblox', () => {
    const el = renderPath('es');
    const tabs = el.querySelectorAll('[role="tab"]');
    tabs[2].click();
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(el.querySelector('[role="tabpanel"]').textContent).toContain(STAGES[2].learns.es);
  });

  test('las flechas y Fin mueven la selección y el foco', () => {
    const el = renderPath('es');
    document.body.append(el);
    const tabs = el.querySelectorAll('[role="tab"]');
    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[1]);
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabs[3].getAttribute('aria-selected')).toBe('true');
    el.remove();
  });

  test('incluye cómo es una clase en 4 pasos', () => {
    expect(renderPath('es').querySelectorAll('.class-steps > li').length).toBe(4);
  });
});

describe('preguntas frecuentes', () => {
  test('cinco preguntas cerradas, con la garantía', () => {
    const el = renderFaq('es', { booking: true });
    const items = el.querySelectorAll('details');
    expect(items.length).toBe(5);
    for (const d of items) expect(d.open).toBe(false);
    expect(el.textContent).toContain(es['guarantee.text']);
  });

  test('¿Cómo agendo? depende de si hay reserva', () => {
    expect(renderFaq('es', { booking: true }).textContent).toContain(es['faq.how.booking']);
    const wa = renderFaq('es', { booking: false }).textContent;
    expect(wa).toContain(es['faq.how.whatsapp']);
    expect(wa).not.toContain(es['faq.how.booking']);
  });

  test('abrir una pregunta no cierra otra', () => {
    const items = renderFaq('es', { booking: true }).querySelectorAll('details');
    items[0].open = true;
    items[1].open = true;
    expect(items[0].open && items[1].open).toBe(true);
  });
});

test('la vista Profesor sustituye "Qué enseño" por el recorrido, en el orden del spec', () => {
  const el = renderTeacher('es');
  expect(el.textContent).not.toContain('Cómo son las clases');
  const order = ['need', 'teach', 'path', 'projects', 'faq'].map((k) => el.querySelector(`[data-section="${k}"]`));
  order.forEach((n, i) => expect(n, `sección ${i}`).not.toBeNull());
  for (let i = 1; i < order.length; i++) {
    expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
});
