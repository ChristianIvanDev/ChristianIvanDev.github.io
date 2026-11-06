/**
 * Crea un elemento: h('a', { href, class: 'x' }, 'texto', otroNodo).
 * Los atributos con valor null/false se omiten; `on*` con función añade un listener.
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value == null || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

/** Enlace externo seguro, con aviso para lectores de pantalla. */
export function externalLink(href, label, newTabText, attrs = {}) {
  return h('a', { href, target: '_blank', rel: 'noopener', ...attrs }, label, h('span', { class: 'visually-hidden' }, ` ${newTabText}`));
}
