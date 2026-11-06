import { describe, test, expect } from 'vitest';
import { primaryCta, CONTACT } from '../src/render/contact.js';
import { renderTeacher } from '../src/render/teacher.js';
import { renderDeveloper } from '../src/render/developer.js';
import es from '../src/content/es.js';
import en from '../src/content/en.js';

const BOOKING = 'https://calendar.app.google/kydiVgoRNTarLdCv6';

describe('primaryCta', () => {
  test('con enlace de reservas, el botón principal es agendar', () => {
    expect(CONTACT.booking).toBe(BOOKING);
    expect(primaryCta('es')).toEqual({ kind: 'booking', href: BOOKING, label: es['cta.book'] });
    expect(primaryCta('en').label).toBe(en['cta.book']);
  });

  test('sin enlace de reservas, vuelve a WhatsApp', () => {
    const cta = primaryCta('es', { booking: '' });
    expect(cta.kind).toBe('whatsapp');
    expect(cta.href.startsWith('https://wa.me/527531501861')).toBe(true);
  });
});

describe('portada de la vista Profesor', () => {
  const el = renderTeacher('es');

  test('el primer botón de la portada abre la reserva en pestaña nueva', () => {
    const first = el.querySelector('.hero__main .btn');
    expect(first.getAttribute('href')).toBe(BOOKING);
    expect(first.getAttribute('target')).toBe('_blank');
    expect(first.getAttribute('rel')).toBe('noopener');
  });

  test('muestra la garantía exacta', () => {
    expect(es['guarantee.text']).toBe('Si la primera clase no te convence, dímelo y no te la cobro.');
    expect(en['guarantee.text']).toBe("If the first lesson doesn't win you over, tell me and I won't charge you for it.");
    expect(el.querySelector('.hero__main').textContent).toContain(es['guarantee.text']);
  });

  test('WhatsApp sigue disponible como segunda opción', () => {
    expect(el.querySelector('.hero__main a[href^="https://wa.me/"]')).not.toBeNull();
  });
});

test('la vista Desarrollador no ofrece reserva de clases', () => {
  expect(renderDeveloper('es').querySelector('a[href*="calendar.app.google"]')).toBeNull();
});

test('existen los textos nuevos en los dos idiomas', () => {
  const prefixes = ['cta.book', 'guarantee.text', 'need.', 'path.', 'class.', 'faq.', 'sticky.'];
  for (const p of prefixes) {
    expect(Object.keys(es).some((k) => k.startsWith(p)), p).toBe(true);
  }
  expect(es['faq.how.booking']).toBeTruthy();
  expect(es['faq.how.whatsapp']).toBeTruthy();
});
