import { describe, test, expect } from 'vitest';
import { renderTeacher } from '../src/render/teacher.js';
import { renderDeveloper } from '../src/render/developer.js';
import { renderProjectCard } from '../src/render/projectCard.js';
import { PROJECTS } from '../src/content/projects.js';
import es from '../src/content/es.js';
import en from '../src/content/en.js';

const byId = (id) => PROJECTS.find((p) => p.id === id);

describe('vista Profesor', () => {
  const el = renderTeacher('es');

  test('es la sección de la vista teacher con un h1', () => {
    expect(el.dataset.view).toBe('teacher');
    expect(el.querySelector('h1').textContent).toBe(es['hero.teacher.title']);
  });

  test('destaca las clases y el bachillerato presencial', () => {
    expect(el.textContent).toContain('+2,000');
    const hl = el.querySelector('.card--highlight');
    expect(hl).not.toBeNull();
    expect(hl.textContent).toContain('ISELAC');
  });

  test('deja claro que las clases son en línea', () => {
    expect(el.textContent).toContain(es['hero.online']);
  });

  test('muestra las 3 áreas de enseñanza', () => {
    for (const k of ['offer.programming.title', 'offer.design.title', 'offer.dev.title']) {
      expect(el.textContent).toContain(es[k]);
    }
  });

  test('incluye la foto, los 8 proyectos y la nota de alumnos', () => {
    expect(el.querySelector('img[src="./assets/photo/christian.webp"]')).not.toBeNull();
    expect(el.querySelectorAll('[data-project]').length).toBe(8);
    expect(el.textContent).toContain(es['students.note']);
  });

  test('tiene el contenedor de la escena 3D y el contacto', () => {
    expect(el.querySelector('#hero-3d-teacher')).not.toBeNull();
    expect(el.querySelector('a[href^="https://wa.me/527531501861"]')).not.toBeNull();
  });

  test('todas las imágenes tienen alt y solo la foto carga sin lazy', () => {
    for (const img of el.querySelectorAll('img')) {
      expect(img.getAttribute('alt')).toBeTruthy();
      if (img.getAttribute('src') !== './assets/photo/christian.webp') expect(img.getAttribute('loading')).toBe('lazy');
    }
  });
});

describe('vista Desarrollador', () => {
  const el = renderDeveloper('en');

  test('es la sección developer con su h1 en inglés', () => {
    expect(el.dataset.view).toBe('developer');
    expect(el.querySelector('h1').textContent).toBe(en['hero.developer.title']);
  });

  test('los proyectos van antes que la experiencia, como dice el spec', () => {
    const projects = el.querySelector('#projects-developer');
    const exp = [...el.querySelectorAll('section')].find((s) => s.querySelector('#devexp-title'));
    expect(projects.compareDocumentPosition(exp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('muestra el stack', () => {
    for (const s of ['FastAPI', 'Django', 'Luau', 'Blender']) expect(el.textContent).toContain(s);
  });

  test('línea de tiempo con los 2 puestos de la Asociación de Agentes Aduanales', () => {
    const items = [...el.querySelectorAll('.timeline__item')].filter((i) => i.textContent.includes('Agentes Aduanales'));
    expect(items.length).toBe(2);
  });

  test('incluye formación, certificaciones, proyectos y la nota de alumnos', () => {
    expect(el.textContent).toContain('Utel Universidad');
    expect(el.textContent).toContain('Python Essentials 1');
    // Los 8 de la vista de profesor más las 4 apps web.
    expect(el.querySelectorAll('[data-project]').length).toBe(12);
    expect(el.textContent).toContain(en['students.note']);
  });
});

describe('tarjeta de proyecto', () => {
  test('Caza de Monstruos enlaza a Roblox en pestaña nueva', () => {
    const a = renderProjectCard(byId('caza-de-monstruos'), 'es', { detailed: false }).querySelector('a.project__link');
    expect(a.getAttribute('href')).toBe('https://www.roblox.com/es/games/134450784529527/Caza-de-mounstruos');
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener');
    expect(a.textContent).toContain(es['project.play.roblox']);
  });

  test('El Culto del Juicio enlaza a Steam Workshop', () => {
    const a = renderProjectCard(byId('culto-del-juicio'), 'en', { detailed: false }).querySelector('a.project__link');
    expect(a.textContent).toContain(en['project.view.steam']);
  });

  test('Haunted Obby enlaza a Roblox, Agenda Docente no tiene enlace y Mecha muestra "En desarrollo"', () => {
    expect(renderProjectCard(byId('haunted-obby'), 'es', {}).querySelector('a.project__link').getAttribute('href')).toBe('https://www.roblox.com/es/games/90518449117709/Escape-the-Haunted-Obby-HALLOWEEN');
    expect(renderProjectCard(byId('agenda-docente'), 'es', {}).querySelector('a.project__link')).toBeNull();
    expect(renderProjectCard(byId('mecha-apex'), 'es', {}).textContent).toContain(es['project.status.indev']);
  });

  test('la versión detallada lista funciones y tecnologías', () => {
    const el = renderProjectCard(byId('build-a-pipe'), 'es', { detailed: true });
    expect(el.querySelectorAll('.project__features li').length).toBe(byId('build-a-pipe').features.es.length);
    expect(el.textContent).toContain('Luau');
  });

  test('la plataforma aduanera, sin imágenes, muestra un fragmento de código ilustrativo', () => {
    const el = renderProjectCard(byId('plataforma-aduanera'), 'es', {});
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('pre code')).not.toBeNull();
  });
});
