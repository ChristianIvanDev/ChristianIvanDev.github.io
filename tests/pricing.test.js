import { describe, test, expect } from 'vitest';
import { PRICING, packageMath } from '../src/content/pricing.js';
import { renderPricing } from '../src/render/pricing.js';
import { renderTeacher } from '../src/render/teacher.js';
import { renderDeveloper } from '../src/render/developer.js';
import es from '../src/content/es.js';
import en from '../src/content/en.js';

describe('precios', () => {
  test('tarifas base del spec', () => {
    expect(PRICING.currency).toBe('MXN');
    expect(PRICING.firstClass).toBe(0);
    expect(PRICING.superprof).toBe(150);
    expect(PRICING.direct).toBe(130);
  });

  test('paquetes de 4, 8 y 12 clases con descuento máximo del 15 %', () => {
    expect(PRICING.packages.map((p) => [p.classes, p.price])).toEqual([[4, 480], [8, 920], [12, 1320]]);
    for (const p of PRICING.packages) {
      const m = packageMath(p);
      expect(m.discountPct).toBeLessThanOrEqual(15);
      expect(m.perHour * p.classes).toBe(p.price);
    }
  });

  test('el ahorro se calcula contra la tarifa directa, no contra Superprof', () => {
    expect(packageMath(PRICING.packages[0])).toEqual({ perHour: 120, savings: 40, discountPct: 8 });
    expect(packageMath(PRICING.packages[2])).toEqual({ perHour: 110, savings: 240, discountPct: 15 });
  });
});

describe('sección de precios', () => {
  const el = renderPricing('es');

  test('muestra primera clase gratis, tarifa directa y la de Superprof', () => {
    expect(el.textContent).toContain(es['pricing.free.title']);
    expect(el.textContent).toContain('$130');
    expect(el.textContent).toContain('$150');
    expect(el.textContent).toContain('MXN');
  });

  test('explica con honestidad por qué Superprof cuesta más', () => {
    expect(el.textContent).toContain(es['pricing.why']);
  });

  test('tres paquetes con precio total, por hora y ahorro', () => {
    const cards = el.querySelectorAll('[data-package]');
    expect(cards.length).toBe(3);
    expect(cards[1].textContent).toContain('$920');
    expect(cards[1].textContent).toContain('$115');
    expect(cards[1].textContent).toContain('$120');
  });

  test('el botón de la primera clase abre la reserva', () => {
    expect(el.querySelector('a[href="https://calendar.app.google/kydiVgoRNTarLdCv6"]')).not.toBeNull();
  });

  test('existe en inglés', () => {
    expect(renderPricing('en').textContent).toContain(en['pricing.title']);
  });
});

test('la vista Profesor incluye los precios antes de las preguntas frecuentes; la de Desarrollador no', () => {
  const t = renderTeacher('es');
  const pricing = t.querySelector('[data-section="pricing"]');
  const faq = t.querySelector('[data-section="faq"]');
  expect(pricing).not.toBeNull();
  expect(pricing.compareDocumentPosition(faq) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(renderDeveloper('es').querySelector('[data-section="pricing"]')).toBeNull();
});

test('garantía y botón reflejan que la primera clase es gratis', () => {
  expect(es['guarantee.text']).toBe('La primera clase es gratis: si no te convence, no pagas nada.');
  expect(en['guarantee.text']).toBe("Your first lesson is free: if it doesn't win you over, you pay nothing.");
  expect(es['cta.book']).toBe('Agendar clase gratis');
  expect(en['cta.book']).toBe('Book a free lesson');
});
