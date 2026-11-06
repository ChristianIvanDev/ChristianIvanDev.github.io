import { describe, test, expect, vi } from 'vitest';
import es from '../src/content/es.js';
import en from '../src/content/en.js';
import { PROJECTS } from '../src/content/projects.js';
import { TEACHING, DEV_JOBS, EDUCATION, CERTIFICATIONS } from '../src/content/experience.js';
import { t, _setDictionaries } from '../src/i18n.js';

const FORBIDDEN = /\b(IA|AI)\b|generad|generated|Claude|ChatGPT/i;

describe('diccionarios', () => {
  test('español e inglés tienen exactamente las mismas claves', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
  });

  test('ningún texto está vacío', () => {
    for (const [k, v] of [...Object.entries(es), ...Object.entries(en)]) {
      expect(v, k).toBeTruthy();
    }
  });

  test('existe la nota sobre los alumnos en los dos idiomas', () => {
    expect(es['students.note']).toBe(
      'He colaborado en muchos proyectos de mis estudiantes, pero no los muestro aquí para respetar su privacidad y su autoría.'
    );
    expect(en['students.note']).toBeTruthy();
  });

  test('la cifra de clases es la del spec', () => {
    expect(es['teach.lessons.number']).toBe('+2,000');
    expect(en['teach.lessons.number']).toBe('2,000+');
  });
});

describe('t()', () => {
  test('devuelve el texto en el idioma pedido', () => {
    expect(t('en', 'nav.view.teacher')).toBe(en['nav.view.teacher']);
  });

  test('si falta en inglés usa el español y nunca la clave cruda', () => {
    _setDictionaries({ es: { 'solo.es': 'Hola' }, en: {} });
    expect(t('en', 'solo.es')).toBe('Hola');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(t('en', 'no.existe')).toBe('');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    _setDictionaries(null);
  });
});

describe('contenido sin palabras prohibidas', () => {
  test('ningún texto menciona IA ni herramientas de generación', () => {
    const all = JSON.stringify({ es, en, PROJECTS, TEACHING, DEV_JOBS, EDUCATION, CERTIFICATIONS });
    expect(all.match(FORBIDDEN)).toBeNull();
  });
});

describe('proyectos', () => {
  const ids = [
    'caza-de-monstruos', 'build-a-pipe', 'haunted-obby', 'mecha-apex',
    'culto-del-juicio', 'armero-blender', 'agenda-docente', 'plataforma-aduanera',
  ];

  test('están los 8 proyectos en orden', () => {
    expect(PROJECTS.map((p) => p.id)).toEqual(ids);
  });

  test('solo 3 tienen enlace público, con las URL del spec', () => {
    const links = PROJECTS.filter((p) => p.link).map((p) => [p.id, p.link.href, p.link.kind]);
    expect(links).toEqual([
      ['caza-de-monstruos', 'https://www.roblox.com/es/games/134450784529527/Caza-de-mounstruos', 'roblox'],
      ['build-a-pipe', 'https://www.roblox.com/es/games/70899491861878/Build-a-Pipe', 'roblox'],
      ['culto-del-juicio', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3826352482', 'steam'],
    ]);
  });

  test('cada proyecto tiene título, resumen y funciones en los dos idiomas', () => {
    for (const p of PROJECTS) {
      for (const lang of ['es', 'en']) {
        expect(p.title[lang], `${p.id} title ${lang}`).toBeTruthy();
        expect(p.summary[lang], `${p.id} summary ${lang}`).toBeTruthy();
        expect(p.features[lang].length, `${p.id} features ${lang}`).toBeGreaterThan(0);
      }
      expect(p.features.es.length).toBe(p.features.en.length);
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  test('cada imagen tiene ruta optimizada y alt en los dos idiomas', () => {
    for (const p of PROJECTS) {
      for (const img of p.images) {
        expect(img.src).toMatch(new RegExp(`^/assets/projects/${p.id}/\\d+\\.webp$`));
        expect(img.alt.es).toBeTruthy();
        expect(img.alt.en).toBeTruthy();
      }
    }
  });

  test('los destacados son Caza de Monstruos y Build a Pipe!, y Mecha está en desarrollo', () => {
    expect(PROJECTS.filter((p) => p.featured).map((p) => p.id)).toEqual(['caza-de-monstruos', 'build-a-pipe']);
    expect(PROJECTS.find((p) => p.id === 'mecha-apex').status).toBe('in-dev');
  });
});

describe('experiencia', () => {
  test('ISELAC está destacado como profesor presencial de bachillerato', () => {
    const iselac = TEACHING.find((j) => j.org.includes('ISELAC'));
    expect(iselac.highlight).toBe(true);
    expect(iselac.role.es).toMatch(/bachillerato/i);
  });

  test('hay 2 puestos en la Asociación de Agentes Aduanales', () => {
    expect(DEV_JOBS.filter((j) => j.org.includes('Agentes Aduanales')).length).toBe(2);
  });

  test('todas las entradas tienen los dos idiomas', () => {
    for (const j of [...TEACHING, ...DEV_JOBS, ...EDUCATION]) {
      for (const f of ['role', 'period', 'detail']) {
        expect(j[f].es, `${j.org} ${f}`).toBeTruthy();
        expect(j[f].en, `${j.org} ${f}`).toBeTruthy();
      }
    }
  });
});
