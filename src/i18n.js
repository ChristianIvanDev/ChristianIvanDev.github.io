import es from './content/es.js';
import en from './content/en.js';

const DEFAULT_DICTS = { es, en };
let dicts = DEFAULT_DICTS;

/** Solo para pruebas: sustituye los diccionarios (null restaura los reales). */
export function _setDictionaries(next) {
  dicts = next || DEFAULT_DICTS;
}

export function t(lang, key) {
  const value = dicts[lang]?.[key] ?? dicts.es?.[key];
  if (value == null) {
    console.warn(`[i18n] falta el texto "${key}"`);
    return '';
  }
  return value;
}

/** Elige la versión de un campo bilingüe {es, en}. */
export function pick(field, lang) {
  return field?.[lang] ?? field?.es ?? '';
}
