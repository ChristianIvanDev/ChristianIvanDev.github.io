/**
 * Ruta relativa a un recurso de /public. Las dos páginas (index.html y cv.html) viven en la raíz
 * del despliegue, así que "./" funciona igual en un dominio propio o bajo una subcarpeta (GitHub Pages).
 */
export function asset(path) {
  return `./${String(path).replace(/^\.?\/+/, '')}`;
}
