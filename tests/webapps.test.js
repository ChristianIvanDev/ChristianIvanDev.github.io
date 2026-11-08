import { describe, test, expect } from 'vitest';
import es from '../src/content/es.js';
import en from '../src/content/en.js';
import { PROJECTS, isReleased } from '../src/content/projects.js';
import { renderProjectCard } from '../src/render/projectCard.js';
import { renderTeacher } from '../src/render/teacher.js';

const web = PROJECTS.filter((p) => p.group === 'web');
const byId = (id) => PROJECTS.find((p) => p.id === id);

describe('apps web', () => {
  test('son 4, cada una con demo en GitHub Pages, código en GitHub y fecha de publicación', () => {
    expect(web.map((p) => p.id)).toEqual(['franja', 'sinnube', 'malla', 'ramaje']);
    for (const p of web) {
      expect(p.code).toBe(`https://github.com/ChristianIvanDev/${p.id}`);
      expect(p.link.href).toBe(`https://christianivandev.github.io/${p.id}/`);
      expect(p.release).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('las fechas siguen el orden en que se publican', () => {
    const dates = web.map((p) => p.release);
    expect([...dates].sort()).toEqual(dates);
  });

  test('antes de su fecha se muestra en desarrollo y sin enlaces', () => {
    const card = renderProjectCard(byId('malla'), 'es', { now: new Date('2026-12-03T12:00:00') });
    expect(card.querySelector('a.project__link')).toBeNull();
    expect(card.textContent).toContain(es['project.status.indev']);
    expect(card.textContent).toContain(`${es['project.release']} 4 de diciembre`);
  });

  test('desde su fecha muestra la demo y el código', () => {
    const card = renderProjectCard(byId('malla'), 'en', { now: new Date('2026-12-04T09:00:00') });
    const links = [...card.querySelectorAll('a.project__link')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['https://christianivandev.github.io/malla/', 'https://github.com/ChristianIvanDev/malla']);
    expect(links[0].textContent).toContain(en['project.view.demo']);
    expect(links[1].textContent).toContain(en['project.view.code']);
    expect(card.textContent).not.toContain(en['project.status.indev']);
  });

  test('los proyectos sin fecha siempre están publicados', () => {
    expect(isReleased(byId('caza-de-monstruos'), new Date('2000-01-01'))).toBe(true);
  });

  test('la vista de profesor no muestra las apps web', () => {
    const el = renderTeacher('es');
    for (const p of web) expect(el.querySelector(`[data-project="${p.id}"]`)).toBeNull();
  });
});
