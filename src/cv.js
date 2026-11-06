import './styles/tokens.css';
import './styles/cv.css';
import { renderCV } from './cv-render.js';
import { resolveState } from './state.js';
import { t } from './i18n.js';

const { lang } = resolveState(window.location.search, null);
document.documentElement.lang = lang;
document.title = `CV · ${t(lang, 'cv.title')}`;
document.getElementById('cv').replaceChildren(renderCV(lang));
document.body.dataset.ready = '1';
