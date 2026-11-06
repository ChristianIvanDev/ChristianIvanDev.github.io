import { describe, test, expect } from 'vitest';
import { renderCV, cvHref } from '../src/cv-render.js';
import { renderTeacher } from '../src/render/teacher.js';
import { renderDeveloper } from '../src/render/developer.js';
import es from '../src/content/es.js';
import en from '../src/content/en.js';

describe('CV', () => {
  const el = renderCV('es');

  test('incluye foto y datos de contacto', () => {
    expect(el.querySelector('img[src="/assets/photo/christian.webp"]')).not.toBeNull();
    expect(el.textContent).toContain('christianespinozagaytan@gmail.com');
    expect(el.textContent).toContain('+52 753 150 1861');
    expect(el.textContent).toContain('linkedin.com/in/christianieg');
  });

  test('tiene las secciones del CV', () => {
    for (const k of ['cv.teaching', 'cv.developer', 'cv.education', 'cv.projects']) {
      expect(el.textContent).toContain(es[k]);
    }
  });

  test('lista como mucho 6 proyectos', () => {
    const n = el.querySelectorAll('.cv-projects li').length;
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThanOrEqual(6);
  });

  test('existe en inglés', () => {
    expect(renderCV('en').textContent).toContain(en['cv.teaching']);
  });

  test('cvHref apunta al PDF de cada idioma', () => {
    expect(cvHref('es')).toBe('/cv/CV-Christian-Espinoza-ES.pdf');
    expect(cvHref('en')).toBe('/cv/CV-Christian-Espinoza-EN.pdf');
  });
});

describe('botón Descargar CV', () => {
  test('aparece en las dos vistas con el PDF del idioma', () => {
    for (const [render, lang] of [[renderTeacher, 'es'], [renderDeveloper, 'en']]) {
      const a = render(lang).querySelector('a[data-cv]');
      expect(a, `${lang}`).not.toBeNull();
      expect(a.getAttribute('href')).toBe(cvHref(lang));
      expect(a.hasAttribute('download')).toBe(true);
    }
  });
});
