export const VIEWS = ['teacher', 'developer'];
export const LANGS = ['es', 'en'];
const DEFAULTS = { view: 'teacher', lang: 'es' };

function readStoredLang(storage) {
  if (!storage) return null;
  try {
    return storage.getItem('lang');
  } catch {
    return null;
  }
}

export function resolveState(search, storage) {
  const params = new URLSearchParams(search || '');
  const view = params.get('view');
  const urlLang = params.get('lang');
  const stored = readStoredLang(storage);

  let lang = DEFAULTS.lang;
  if (LANGS.includes(urlLang)) lang = urlLang;
  else if (LANGS.includes(stored)) lang = stored;

  return {
    view: VIEWS.includes(view) ? view : DEFAULTS.view,
    lang,
  };
}

export function toSearch({ view, lang }) {
  const params = new URLSearchParams();
  if (view !== DEFAULTS.view) params.set('view', view);
  if (lang !== DEFAULTS.lang) params.set('lang', lang);
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function persistLang(storage, lang) {
  if (!storage) return;
  try {
    storage.setItem('lang', lang);
  } catch {
    /* almacenamiento no disponible: el idioma simplemente no se recuerda */
  }
}
