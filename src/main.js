import './styles/tokens.css';
import './styles/base.css';
import './styles/nav.css';
import './styles/bento.css';
import './styles/sections.css';

import { mountApp } from './app.js';
import { renderTeacher } from './render/teacher.js';
import { renderDeveloper } from './render/developer.js';
import { onRender, onViewChange } from './effects.js';

function safeStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

mountApp(document.getElementById('app'), {
  search: window.location.search,
  storage: safeStorage(),
  history: window.history,
  renderers: { teacher: renderTeacher, developer: renderDeveloper },
  onRender,
  onViewChange,
});
