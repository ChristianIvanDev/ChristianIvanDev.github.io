# Portafolio v2: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** que la vista Profesor responda las tres dudas de los padres, permita agendar en la página de reservas de Google y se sienta viva con animaciones discretas, sin romper nada de la v1.

**Architecture:** se mantiene la estructura de la v1, con vanilla JS y funciones `render*` que devuelven nodos.
- Contenido nuevo en `src/content/es.js`, `src/content/en.js` y `src/content/learning.js`.
- Lógica de llamada a la acción en `src/render/contact.js` (`primaryCta`).
- Secciones nuevas en `src/render/persuade.js`.
- Animaciones en `src/motion.js`: IntersectionObserver, Web Animations API y CSS. Se cargan desde `effects.js`.
- Barra fija en `src/render/stickyBar.js` y `src/sticky.js`.

**Tech Stack:** el de la v1 (Vite 6, Vitest 3 con jsdom, Three.js y sharp). Sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-11-06-conversion-animaciones-design.md` (y la v1, `docs/superpowers/specs/2026-11-06-portafolio-design.md`).

## Global Constraints

- **URL de reservas:** `https://calendar.app.google/kydiVgoRNTarLdCv6`, guardada en `CONTACT.booking`. Si está vacía, se usa la versión WhatsApp.
- **Garantía:**
  - ES: "Si la primera clase no te convence, dímelo y no te la cobro."
  - EN: "If the first lesson doesn't win you over, tell me and I won't charge you for it."
- **Botón de reserva:** "Agendar clase" / "Book a lesson". Sin "gratis". Abre en pestaña nueva con `rel="noopener"`.
- **Vista Desarrollador:** sin reserva ni barra fija.
- **Sin datos inventados:** no se indican duración, precio ni edad mínima.
- **Animaciones:**
  - solo `transform` y `opacity`, con curva `--ease-out`;
  - interacciones de menos de 300 ms;
  - hover solo con `(hover: hover) and (pointer: fine)`;
  - con `prefers-reduced-motion: reduce` no hay desplazamientos ni escalas, y todo el contenido es visible desde el inicio;
  - sin animación al cambiar con el teclado.
- **Peso:** el bundle principal crece como mucho 15 KB comprimidos.
- **Accesibilidad:** contraste AA, cuerpo de 16 px o más, sin scroll horizontal a 360 px, teclado y lector de pantalla.
- **Reglas de la v1 que siguen vigentes:** paridad de claves ES/EN y la expresión prohibida `/\b(IA|AI)\b|generad|generated|Claude|ChatGPT/i`.

## Review Focus

1. **Sin JavaScript o si el IntersectionObserver falla:** nada queda invisible. El estado "oculto" solo lo aplica JS, y solo si puede revelarlo después. Se prueba en Task 4 (`initReveal` sin IO deja todo visible).
2. **Cambio de idioma con la barra fija visible:** la barra se vuelve a montar en el idioma nuevo, sin duplicarse. Se prueba en Task 5.
3. **Abrir varias preguntas del acordeón con el teclado:** cada pregunta es independiente y se abre con Enter o Espacio (`<details>`). Se prueba en Task 3.
4. **Teclado en el recorrido:** las flechas cambian de etapa, el foco sigue a la pestaña y `aria-selected` es correcto. Se prueba en Task 3.
5. **El contador con movimiento reducido o leído por un lector de pantalla:** siempre muestra la cifra final; el número animado lleva `aria-hidden` y el texto real está en `visually-hidden`. Se prueba en Task 4.

---

### Task 1: Llamada a la acción de reserva con respaldo a WhatsApp, y textos nuevos

**Files:**
- Modify: `src/render/contact.js`, `src/content/es.js`, `src/content/en.js`, `src/render/teacher.js`
- Test: `tests/cta.test.js` y `tests/content.test.js` (ya tiene paridad y palabras prohibidas)

**Interfaces:**
- Produces:
  - `CONTACT.booking: string`;
  - `primaryCta(lang, { booking = CONTACT.booking } = {}): { href, label, kind: 'booking'|'whatsapp' }`;
  - `contactButtons(lang, { primary: true })`, que usa `primaryCta` como primer botón y deja WhatsApp y correo después. Si el primero ya es WhatsApp, no se repite.

- [ ] **Step 1: pruebas.**
  - `primaryCta('es')` devuelve `{ kind: 'booking', href: 'https://calendar.app.google/kydiVgoRNTarLdCv6', label: es['cta.book'] }`.
  - `primaryCta('es', { booking: '' }).kind === 'whatsapp'`, con `href` que empieza por `https://wa.me/527531501861`.
  - `renderTeacher('es')`:
    - el primer `.btn` de la portada apunta a la reserva, con `target="_blank"`;
    - el texto contiene la garantía exacta en español;
    - `renderDeveloper('es')` no contiene ningún enlace a `calendar.app.google`.
  - Existen las claves `cta.book`, `guarantee.text`, `faq.*`, `need.*`, `path.*`, `class.*` y `sticky.*` en ES y EN, con los textos del spec §4.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar.
  - Los textos de la garantía son los de Global Constraints.
  - `faq.how.booking` y `faq.how.whatsapp` son las dos variantes de "¿Cómo agendo?".
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: PASA.
- [ ] **Step 5:** commit `feat: botón de reserva con respaldo a WhatsApp y garantía`.

### Task 2: Orden y anclajes (correcciones menores pendientes de la v1)

**Files:**
- Modify: `src/render/developer.js`, `src/styles/base.css`
- Test: `tests/views.test.js`

- [ ] **Step 1: prueba.** En `renderDeveloper('es')`, la sección `#projects-developer` va antes que la sección que contiene "Experiencia como desarrollador". Se comprueba con `compareDocumentPosition`.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** reordenar las secciones y añadir `html { scroll-padding-top: 140px }` (96px a partir de 561px de ancho), para que los anclajes no queden bajo la barra.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: PASA.
- [ ] **Step 5:** commit `fix: orden de la vista Desarrollador y anclajes bajo la barra fija`.

### Task 3: Secciones para convencer: "¿Es necesario?", recorrido "Qué aprenden y cómo" y preguntas frecuentes

**Files:**
- Create: `src/content/learning.js`, `src/render/persuade.js`, `src/styles/persuade.css`
- Modify: `src/render/teacher.js` (sustituye la sección "Qué enseño"), `src/main.js` (importa el CSS)
- Test: `tests/persuade.test.js`

**Interfaces:**
- Produces:
  - `STAGES: Array<{ id: 'logic'|'python'|'roblox'|'web', title:{es,en}, learns:{es,en}, builds:{es,en}, image?: src }>`. Roblox usa `caza-de-monstruos/1.webp` y Python no lleva imagen.
  - `renderNeed(lang)`, `renderPath(lang)` y `renderFaq(lang, { booking })`, que devuelven `HTMLElement`.
- Orden en `renderTeacher`: portada → `renderNeed` → experiencia en el aula → `renderPath` → proyectos → nota de alumnos → `renderFaq` → contacto.

- [ ] **Step 1: pruebas.**
  - `renderNeed('es')` tiene 3 tarjetas con los títulos `need.1.title` … `need.3.title`.
  - `renderPath('es')`:
    - un `role="tablist"` con 4 `role="tab"`, el primero con `aria-selected="true"`;
    - un `role="tabpanel"` que muestra `STAGES[0].learns.es`;
    - al hacer clic en la pestaña 3, el panel muestra el texto de Roblox y `aria-selected` cambia;
    - con `ArrowRight` desde la pestaña 1, el foco pasa a la pestaña 2 y esta queda seleccionada;
    - con `End`, se selecciona la 4;
    - incluye "Cómo es una clase" con 4 pasos (`ol > li`).
  - `renderFaq('es', { booking: true })`:
    - 5 elementos `<details>`, todos cerrados al inicio;
    - el de la garantía contiene `guarantee.text`;
    - "¿Cómo agendo?" usa `faq.how.booking`, y con `booking: false` usa `faq.how.whatsapp`;
    - abrir uno no cierra otro.
  - `renderTeacher('es')` ya no contiene `offer.how.title` y sí contiene `[data-section="path"]`.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar con `h()`.
  - El recorrido gestiona su propio estado; al cambiar de etapa sustituye el contenido del panel.
  - Las tres áreas (Programación, Diseño, Desarrollo) pasan a ser chips al inicio del recorrido.
  - Se quitan las claves `offer.*` que ya no se usen, en los dos idiomas.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: PASA, incluidas paridad y palabras prohibidas.
- [ ] **Step 5:** commit `feat: secciones ¿es necesario?, recorrido de aprendizaje y preguntas frecuentes`.

### Task 4: Animaciones (aparición al hacer scroll, contador, entrada de la portada, cambio de vista, hover)

**Files:**
- Create: `src/motion.js`, `src/styles/motion.css`
- Modify: `src/effects.js` (llama a `initReveal` y `animateCounters` en `onRender`, y `fadeView` en `onViewChange`), `src/render/teacher.js` (marcas `data-reveal` y el contador), `src/render/shared.js`, `src/app.js` (avisa si el cambio de vista vino del teclado)
- Test: `tests/motion.test.js`

**Interfaces:**
- Produces:
  - `initReveal(root, { reduced, IO = window.IntersectionObserver }): () => void`. Marca los `[data-reveal]` fuera de la primera pantalla con `.is-pending`, los revela con `.is-revealed` al entrar en pantalla (una sola vez) y escalona los hijos `[data-reveal-item]` con `--i`. Devuelve una función de limpieza.
  - `animateCounter(el, { to, duration = 1100, reduced, IO })`. Escribe el número formateado. El elemento con el número lleva `aria-hidden="true"`; el texto real vive en un `span.visually-hidden` hermano.
  - `fadeView(section, { reduced, fromKeyboard })`. Hace un fundido de opacidad de 180 ms con WAAPI. No hace nada si `reduced` o `fromKeyboard`.
  - `mountApp` pasa a `onViewChange(root, state, { fromKeyboard })`.

- [ ] **Step 1: pruebas** (con un IO simulado que permite disparar `isIntersecting`).
  - Con `reduced: true`, ningún elemento recibe `.is-pending`.
  - Sin IO (`IO: undefined`), ningún elemento recibe `.is-pending`.
  - Con IO, un `[data-reveal]` recibe `.is-pending`; al dispararse, recibe `.is-revealed` y pierde `.is-pending`; dispararlo otra vez no cambia nada.
  - Los hijos `[data-reveal-item]` reciben `style --i` = 0, 1, 2…
  - `animateCounter` con `reduced: true` pone de inmediato el texto `+2,000`, y el `span.visually-hidden` contiene "+2,000 clases dadas".
  - `renderTeacher('es')` tiene al menos 5 `[data-reveal]` y el contador lleva `data-count-to="2000"`.
  - `fadeView` con `fromKeyboard: true` no llama a `section.animate`.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar.
  - En `motion.css`:
    - `.is-pending` = `opacity:0; transform: translateY(12px)`;
    - `.is-revealed` = transición de 420 ms con `--ease-out` y retraso `calc(var(--i,0) * 55ms)` (como mucho 6 escalones);
    - entrada de la portada con `@keyframes` y retraso escalonado solo con `(prefers-reduced-motion: no-preference)`;
    - elevación de las tarjetas `[data-tilt]` con hover: `translateY(-3px)`, combinada con la inclinación;
    - el acordeón anima la apertura del contenido (opacidad y `translateY(-4px)` a 0, 200 ms).
  - Se formatea con `Intl.NumberFormat('en-US')` y se añade el prefijo `+` (ES) o el sufijo `+` (EN), según el texto del diccionario.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: PASA. Comprobar en el navegador que no hay errores en consola.
- [ ] **Step 5:** commit `feat: animaciones de entrada, scroll, contador y cambio de vista`.

### Task 5: Barra fija de reserva en el móvil (vista Profesor)

**Files:**
- Create: `src/render/stickyBar.js`, `src/sticky.js`
- Modify: `src/effects.js`, `src/styles/motion.css` (o `persuade.css`)
- Test: `tests/sticky.test.js`

**Interfaces:**
- Produces:
  - `stickyVisible({ heroVisible, contactVisible }): boolean`, que es `!heroVisible && !contactVisible`.
  - `renderStickyBar(lang): HTMLElement` (`.sticky-cta`, con `primaryCta`).
  - `initSticky(root, lang, { IO, matchMedia })`. Se monta solo si la vista visible es la del profesor y `(max-width: 640px)`. Observa `.hero` y `.contact` de la vista Profesor y alterna `.is-visible`. Devuelve una función de limpieza que quita la barra.

- [ ] **Step 1: pruebas.**
  - La tabla de verdad de `stickyVisible`.
  - `renderStickyBar('en')` contiene `sticky.text` en inglés y un enlace a la reserva.
  - `initSticky` montado dos veces seguidas, llamando a la limpieza entre ambas, deja exactamente un `.sticky-cta` en el documento.
  - Con `matchMedia` que no coincide (escritorio), no monta nada.
  - En la vista Desarrollador no monta nada.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar.
  - La barra va al final de `<body>`, con `position: fixed`, `bottom: 0`, `env(safe-area-inset-bottom)`, y entra con `translateY(110%)` → 0 en 220 ms.
  - Mientras la barra existe, `body.has-sticky` añade `padding-bottom`.
  - `effects.onRender` y `onViewChange` llaman a la limpieza anterior y vuelven a montar.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: PASA.
- [ ] **Step 5:** commit `feat: barra fija de reserva en el móvil`.

### Task 6: Vista previa al compartir (Open Graph y favicon)

**Files:**
- Create: `tools/make-og.mjs`, `public/og.png` (1200×630, generado), `public/favicon.svg`
- Modify: `index.html`, `package.json` (script `og`)
- Test: `tests/meta.test.js`

- [ ] **Step 1: pruebas** (leyendo `index.html` como texto).
  - `og:title`, `og:description`, `og:type=website`, `og:url=https://christianivandev.github.io/` y `og:image=https://christianivandev.github.io/og.png`. Las URL de OG deben ser absolutas.
  - `twitter:card=summary_large_image`.
  - `<link rel="icon" href="./favicon.svg" type="image/svg+xml">`.
  - `public/og.png` existe, mide 1200×630 (leer la cabecera con sharp) y pesa menos de 300 KB.
  - `public/favicon.svg` existe y contiene `#5b21b6`.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar.
  - `make-og.mjs` compone con sharp un SVG con fondo `#5b21b6`, una tarjeta rosa con el titular "Aprende a crear juegos, webs y diseño", "Christian Espinoza · Tutor en línea", cubos decorativos y la foto recortada a la derecha. Se ejecuta con `npm run og`.
  - El favicon es un cubo morado redondeado con una "C" rosa.
- [ ] **Step 4:** ejecutar `npm run og && npm test`. Resultado esperado: PASA.
- [ ] **Step 5:** commit `feat: vista previa al compartir y favicon`.

### Task 7: QA, revisión final y publicación

- [ ] **Step 1:** `npm run dev`. En el navegador, a 360 y 1440 px, con las dos vistas y los dos idiomas:
  - `scrollWidth === clientWidth`;
  - sin errores en consola;
  - el recorrido y el acordeón funcionan con teclado;
  - la barra fija aparece y desaparece según el spec;
  - con movimiento reducido emulado, todo se ve sin animación.
- [ ] **Step 2:** `npm run build`, y después `impeccable detect --no-advisory` sobre `http://localhost:5173/` con las 4 combinaciones. Resultado esperado: 0 hallazgos nuevos.
- [ ] **Step 3:** comprobar con `gzip` que `dist/assets/main-*.js` creció como mucho 15 KB comprimidos respecto a la v1 (4.49 KB). La búsqueda de palabras prohibidas en `src` da 0 coincidencias.
- [ ] **Step 4:** ejecutar `npm run release && npm test`. Resultado esperado: todo pasa.
- [ ] **Step 5:** revisión final de la rama con un revisor nuevo y una única ronda de correcciones. Después, **pedir confirmación a Christian antes de subir a `main`**, porque eso publica la web.
