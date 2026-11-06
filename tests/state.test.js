import { describe, test, expect } from 'vitest';
import { resolveState, toSearch, persistLang, VIEWS, LANGS } from '../src/state.js';

const throwingStorage = {
  getItem() { throw new Error('bloqueado'); },
  setItem() { throw new Error('bloqueado'); },
};

describe('resolveState', () => {
  test('sin URL ni storage usa los valores por defecto', () => {
    expect(resolveState('', null)).toEqual({ view: 'teacher', lang: 'es' });
  });

  test('lee vista e idioma de la URL', () => {
    expect(resolveState('?view=developer&lang=en', null)).toEqual({ view: 'developer', lang: 'en' });
  });

  test('valores inválidos en la URL vuelven a los valores por defecto', () => {
    expect(resolveState('?view=xyz&lang=fr', null)).toEqual({ view: 'teacher', lang: 'es' });
  });

  test('usa el idioma guardado si la URL no trae idioma', () => {
    expect(resolveState('', { getItem: () => 'en' }).lang).toBe('en');
  });

  test('el idioma de la URL gana sobre el guardado', () => {
    expect(resolveState('?lang=es', { getItem: () => 'en' }).lang).toBe('es');
  });

  test('un storage que lanza excepción no rompe nada', () => {
    expect(resolveState('', throwingStorage)).toEqual({ view: 'teacher', lang: 'es' });
  });
});

describe('toSearch', () => {
  test('omite los valores por defecto', () => {
    expect(toSearch({ view: 'teacher', lang: 'es' })).toBe('');
  });

  test('incluye los valores distintos al defecto', () => {
    expect(toSearch({ view: 'developer', lang: 'en' })).toBe('?view=developer&lang=en');
    expect(toSearch({ view: 'teacher', lang: 'en' })).toBe('?lang=en');
  });
});

describe('persistLang', () => {
  test('guarda el idioma', () => {
    const saved = {};
    persistLang({ setItem: (k, v) => { saved[k] = v; } }, 'en');
    expect(saved.lang).toBe('en');
  });

  test('no lanza con un storage bloqueado o nulo', () => {
    expect(() => persistLang(throwingStorage, 'en')).not.toThrow();
    expect(() => persistLang(null, 'en')).not.toThrow();
  });
});

test('constantes', () => {
  expect(VIEWS).toEqual(['teacher', 'developer']);
  expect(LANGS).toEqual(['es', 'en']);
});
