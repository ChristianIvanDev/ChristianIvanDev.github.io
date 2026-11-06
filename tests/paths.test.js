import { test, expect } from 'vitest';
import { asset } from '../src/paths.js';
import { renderTeacher } from '../src/render/teacher.js';
import { cvHref } from '../src/cv-render.js';
import { PROJECTS } from '../src/content/projects.js';

test('la base es relativa, para que la web funcione bajo una subcarpeta (GitHub Pages)', () => {
  expect(asset('/assets/photo/christian.webp')).toBe('./assets/photo/christian.webp');
});

test('ninguna imagen, PDF ni recurso usa una ruta absoluta desde la raíz', () => {
  const el = renderTeacher('es');
  for (const img of el.querySelectorAll('img')) expect(img.getAttribute('src').startsWith('/')).toBe(false);
  expect(cvHref('es').startsWith('/')).toBe(false);
  for (const p of PROJECTS) for (const i of p.images) expect(i.src.startsWith('/')).toBe(false);
});
