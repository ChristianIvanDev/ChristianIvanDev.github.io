# Portafolio de Christian Espinoza — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** una web estática y bilingüe (ES / EN) con dos vistas, Profesor y Desarrollador. Tiene estilo Bento en bloques morados y rosa pálido y una escena 3D, muestra los proyectos de Christian, lleva a escribirle por WhatsApp o correo y ofrece el CV en PDF.

**Architecture:** una sola página, `index.html`, montada por Vite con JavaScript sin framework.
- Los textos de cada idioma y los datos de los proyectos viven en módulos de contenido.
- Unas funciones de render generan cada vista a partir de esos datos.
- Un módulo de estado lee y escribe la vista y el idioma en la URL (`?view=…&lang=…`) y en `localStorage`.
- La escena 3D (Three.js) se carga después del contenido, con una imagen fija como respaldo.
- El CV se imprime a PDF con Chrome sin interfaz, desde una página `cv.html` que reutiliza el mismo contenido.

**Tech Stack:** Node 24, Vite 6, Vitest 3 + jsdom, Three.js 0.170, sharp (optimizar imágenes) y Chrome / Edge sin interfaz (PDF).

**Spec:** `docs/superpowers/specs/2026-11-06-portafolio-design.md`

## Global Constraints

- **Idiomas:** español por defecto e inglés. Vistas: `teacher` (por defecto) y `developer`.
- **Colores base de la dirección C:**
  - fondo `#5b21b6`, tarjeta `#6d28d9`, borde `#8b5cf6`, sombra sólida `#3b0f80`;
  - rosa pálido `#fbe1ea` / `#f9c9da`, texto sobre rosa `#3b0f80`.
- **Prohibido en cualquier texto, `alt`, metadato o comentario visible:** mencionar IA, AI, "generado", "Claude" ni herramientas de generación.
- **Prohibido:** mostrar proyectos o datos de alumnos. La nota sobre alumnos aparece en las dos vistas.
- **Prohibido inventar datos.** Solo se usan cifras y hechos del spec.
- **Cifra de clases:** "+2,000 clases dadas" (en inglés, "2,000+ lessons taught").
- **Modalidad:** las clases particulares son **solo en línea**. El bachillerato presencial se presenta como trayectoria, no como oferta.
- **Contacto:**
  - WhatsApp `https://wa.me/527531501861`
  - correo `christianespinozagaytan@gmail.com`
  - Superprof `https://www.superprof.mx/profesor-joven-con-anos-experiencia-programacion-aprende-desarrollo-web-python-css-roblox-desde-cero.html`
  - LinkedIn `https://www.linkedin.com/in/christianieg/`
- **Enlaces de los proyectos:**
  - Caza de Monstruos `https://www.roblox.com/es/games/134450784529527/Caza-de-mounstruos`
  - Build a Pipe! `https://www.roblox.com/es/games/70899491861878/Build-a-Pipe`
  - El Culto del Juicio `https://steamcommunity.com/sharedfiles/filedetails/?id=3826352482`
- **Legibilidad y contraste:**
  - texto con contraste AA;
  - cuerpo de 16 px o más;
  - sin texto en degradado ni sombras de brillo de color (`dark-glow`).
- **Móvil:** sin scroll horizontal a 360 px de ancho. El 3D no bloquea el contenido y respeta `prefers-reduced-motion`.
- **Imágenes:** WebP, ancho máximo de 1600 px, y `alt` en los dos idiomas.

## Review Focus

1. **URL con parámetros inválidos** (`?view=xyz&lang=fr`): carga la vista y el idioma por defecto, sin errores. Se prueba en Task 2 (`resolveState` con valores inválidos).
2. **`localStorage` que lanza excepción** (modo privado o almacenamiento bloqueado): la web funciona y el idioma no se recuerda. Se prueba en Task 2 (`resolveState` y `persistLang` con un storage que lanza).
3. **Sin WebGL, con movimiento reducido o en un dispositivo lento**: aparece la imagen fija, sin errores en consola. Se prueba en Task 7 (`canUse3D`).
4. **Una clave de texto que falta en inglés**: se muestra el texto en español, nunca la clave cruda. Se prueba en Task 3 (paridad de claves y la función `t` con respaldo).
5. **Pantalla de 360 px con nombres largos**, como "Build a Pipe! [Plumbing Simulator]": las tarjetas no se desbordan. Se comprueba en Task 9 (QA visual a 360 px, `scrollWidth` igual a `clientWidth`).

---

### Task 1: Proyecto base, tokens de diseño y pruebas

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `src/main.js`, `src/styles/tokens.css`, `src/styles/base.css`, `tests/smoke.test.js`

**Interfaces:**
- Produces: los scripts `npm run dev`, `npm run build`, `npm test`, y las variables CSS de `tokens.css`:
  - colores: `--c-bg`, `--c-card`, `--c-border`, `--c-shadow`, `--c-pink`, `--c-pink-2`, `--c-ink`, `--c-text`;
  - radios: `--radius-card: 18px`;
  - sombra: `--shadow-block: 0 5px 0 var(--c-shadow)`;
  - espacios: `--space-1` … `--space-6`.

- [ ] **Step 1:** ejecutar `git init` en `D:\Porfotlio`. Crear `.gitignore` con `node_modules/`, `dist/`, `.superpowers/` y `_material/`. `_material` guarda los originales pesados y no se sube.
- [ ] **Step 2:** crear `package.json` con `"type": "module"` y estas dependencias:
  - normales: `three@0.170.0`;
  - de desarrollo: `vite@6`, `vitest@3`, `jsdom@25`, `sharp@0.33`.
  - Scripts: `dev`, `build`, `preview`, `test` (`vitest run`), `images` (`node tools/optimize-images.mjs`) y `cv` (`node tools/build-cv.mjs`).
  - Ejecutar `npm install`.
- [ ] **Step 3:** escribir `tests/smoke.test.js` con `expect(1 + 1).toBe(2)` y configurar `environment: 'jsdom'` en `vite.config.js`. Ejecutar `npm test`. Resultado esperado: 1 prueba superada.
- [ ] **Step 4:** crear `tokens.css` con los colores de Global Constraints y `base.css` con:
  - fondo de `body` = `--c-bg`;
  - fuente de cuerpo de 16 px o más;
  - titulares con una fuente redondeada y gruesa de Google Fonts, por ejemplo "Lilita One" o "Baloo 2" (que no sea Inter, Poppins ni Montserrat);
  - estilos de `:focus-visible` y la regla `prefers-reduced-motion`.
  - `index.html` lleva `lang="es"`, la metaetiqueta viewport y una `<title>`.
- [ ] **Step 5:** ejecutar `npm run build`. Resultado esperado: termina sin errores y crea `dist/index.html`.
- [ ] **Step 6:** commit `chore: proyecto base con Vite, tokens y pruebas`.

### Task 2: Estado de vista e idioma (URL y localStorage)

**Files:**
- Create: `src/state.js`, `tests/state.test.js`

**Interfaces:**
- Produces:
  - `VIEWS = ['teacher','developer']` y `LANGS = ['es','en']`.
  - `resolveState(search: string, storage: Storage|null): {view, lang}`. Orden de prioridad: URL, luego `storage.getItem('lang')` y por último los valores por defecto.
  - `toSearch({view, lang}): string`. Devuelve, por ejemplo, `"?view=developer&lang=en"`. Omite el valor que coincide con el defecto, así que `{teacher, es}` da `""`.
  - `persistLang(storage, lang): void`. Nunca lanza excepción.

- [ ] **Step 1:** escribir las pruebas:
  - `resolveState('', null)` → `{view:'teacher', lang:'es'}`;
  - `resolveState('?view=developer&lang=en', null)` → `{view:'developer', lang:'en'}`;
  - `resolveState('?view=xyz&lang=fr', null)` → `{view:'teacher', lang:'es'}`;
  - con un storage `{getItem:()=> 'en'}`, `resolveState('', storage).lang === 'en'`;
  - si la URL tiene idioma, gana sobre el storage;
  - con un storage cuyo `getItem` y `setItem` lanzan, `resolveState` devuelve los valores por defecto y `persistLang` no lanza;
  - `toSearch({view:'teacher',lang:'es'}) === ''` y `toSearch({view:'developer',lang:'en'}) === '?view=developer&lang=en'`.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA, porque el módulo no existe.
- [ ] **Step 3:** implementar `src/state.js` con `URLSearchParams` y `try/catch` alrededor del storage.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: todas las pruebas pasan.
- [ ] **Step 5:** commit `feat: estado de vista e idioma`.

### Task 3: Contenido bilingüe y datos de proyectos

**Files:**
- Create:
  - `src/content/es.js` y `src/content/en.js`: diccionarios planos `{ 'hero.teacher.title': '…', … }`;
  - `src/content/projects.js`;
  - `src/content/experience.js`;
  - `src/i18n.js`;
  - `tests/content.test.js`.

**Interfaces:**
- Produces:
  - `t(lang, key): string`. Busca en `lang`; si no encuentra, usa `es`; si tampoco, devuelve `''` y registra `console.warn`. Nunca devuelve la clave cruda.
  - `PROJECTS: Array<{id, group:'roblox'|'other', featured:boolean, status?:'in-dev', link?:{href, kind:'roblox'|'steam'}, stack:string[], images:Array<{src, alt:{es,en}}>, title:{es,en}, summary:{es,en}, features:{es:string[], en:string[]}}>`. Los ids son `caza-de-monstruos`, `build-a-pipe`, `haunted-obby`, `mecha-apex`, `culto-del-juicio`, `armero-blender`, `agenda-docente` y `plataforma-aduanera`.
  - `TEACHING: Array<{org, role:{es,en}, period:{es,en}, detail:{es,en}, highlight?:boolean}>`, con ISELAC marcado `highlight: true`.
  - `DEV_JOBS` y `EDUCATION` con la misma forma.

- [ ] **Step 1:** escribir las pruebas:
  - **paridad de claves:** `Object.keys(es)` y `Object.keys(en)` son el mismo conjunto;
  - **respaldo:** `t('en','solo.es')` devuelve el texto en español si se inyecta una clave solo en `es`, y una clave inexistente da `''`;
  - **palabras prohibidas:** en todo el texto de `es`, `en`, `PROJECTS`, `TEACHING`, `DEV_JOBS` y `EDUCATION`, serializado a JSON, no aparece `/\b(IA|AI)\b|generad|generated|Claude|ChatGPT/i`;
  - **enlaces:** `PROJECTS` tiene exactamente 3 con `link`, cuyos `href` son las tres URL de Global Constraints;
  - **traducciones e imágenes:** cada proyecto tiene `title`, `summary` y `features` en los dos idiomas, y cada imagen tiene `alt.es` y `alt.en` no vacíos;
  - **nota de alumnos:** existe la clave `students.note` en los dos idiomas.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** escribir el contenido con los textos del spec (secciones 4 y 5).
  - Primera persona, sin palabras prohibidas.
  - Texto en español de `students.note`: "He colaborado en muchos proyectos de mis estudiantes, pero no los muestro aquí para respetar su privacidad y su autoría."
  - El mensaje de WhatsApp va en la clave `contact.whatsappMessage`. Es español: "¡Hola Christian! Vi tu portafolio y me gustaría saber más sobre tus clases en línea." En inglés se traduce.
  - Las rutas de imagen apuntan a `/assets/projects/<id>/<n>.webp`, que crea el Task 4.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: todas pasan.
- [ ] **Step 5:** commit `feat: contenido bilingüe y datos de proyectos`.

### Task 4: Selección y optimización de imágenes

**Files:**
- Create: `tools/optimize-images.mjs`, `tools/image-sources.json`, `public/assets/**` (generado) y `tests/assets.test.js`

**Interfaces:**
- Consumes: las rutas `images[].src` de `PROJECTS` (Task 3).
- Produces: un archivo WebP por cada `src` y `public/assets/photo/christian.webp`, más `public/assets/hero-fallback.webp`, que se crea en el Task 7.

- [ ] **Step 1:** revisar a tamaño completo los candidatos de `_material/`. Los índices recomendados están en el spec §6 y corresponden a `_material/capturas-sesiones/NNN.*`.
  - Descartar cualquier captura con nombres o datos de alumnos (cuidado con las de Agenda Docente), interfaz de Studio o herramientas de desarrollo, o demasiado oscura.
  - Elegir de 2 a 4 por proyecto destacado y 1 o 2 por los demás.
  - Escribir la correspondencia origen → destino en `image-sources.json`, con recorte opcional `{left, top, width, height}`.
- [ ] **Step 2:** escribir la prueba: cada `images[].src` de `PROJECTS` existe bajo `public/` y pesa menos de 400 KB.
- [ ] **Step 3:** ejecutar `npm test`. Resultado esperado: FALLA, porque no hay imágenes.
- [ ] **Step 4:** implementar `optimize-images.mjs`. Lee `image-sources.json` y, con sharp, recorta, redimensiona a un ancho máximo de 1600 px y exporta a WebP con calidad 78.
  - La foto se recorta en 4:5, centrada en la cara y sin el edificio de la izquierda, a 900 px de ancho.
  - Ejecutar `npm run images`.
- [ ] **Step 5:** ejecutar `npm test`. Resultado esperado: pasa.
- [ ] **Step 6:** commit `feat: imágenes optimizadas de los proyectos`. Se incluye `public/assets`.

### Task 5: Estructura, barra superior y cambio de vista e idioma

**Files:**
- Create: `src/app.js`, `src/render/nav.js`, `src/render/contact.js`, `src/styles/bento.css`, `src/styles/nav.css` y `tests/app.test.js`
- Modify: `src/main.js` e `index.html`

**Interfaces:**
- Consumes: `resolveState`, `toSearch` y `persistLang` (Task 2); `t` (Task 3).
- Produces:
  - `mountApp(root: HTMLElement, {search, storage, history}): {setView(v), setLang(l), state}`;
  - `renderNav(state): HTMLElement`. El selector de vista es un `role="tablist"` con dos `role="tab"` y `aria-selected`, y el idioma es un `<button aria-pressed>`.
  - `whatsappHref(lang): string`;
  - `renderContact(lang): HTMLElement`;
  - las clases Bento `.bento`, `.card`, `.card--pink`, `.span-2/3/4/6` y `.row-2`.

- [ ] **Step 1:** escribir las pruebas (jsdom), con `history` simulado mediante `replaceState` espiado:
  - al montar con `search=''`, `document.documentElement.lang === 'es'` y la pestaña "Profesor" tiene `aria-selected="true"`;
  - al hacer clic en "Desarrollador", `replaceState` recibe `'?view=developer'` y `[data-view="developer"]` está visible mientras `[data-view="teacher"]` está oculto con `hidden`;
  - al hacer clic en el botón de idioma, `html.lang === 'en'`, el texto de la barra cambia y se llama a `storage.setItem('lang','en')`;
  - `whatsappHref('es')` empieza por `https://wa.me/527531501861?text=` y contiene el mensaje en español codificado con `encodeURIComponent`;
  - `renderContact` contiene enlaces a `mailto:christianespinozagaytan@gmail.com` y a la URL de Superprof.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar. Al cambiar de idioma se vuelve a renderizar todo con `t`. Al cambiar de vista solo se alterna `hidden` y se lleva el foco a la cabecera de la vista. La barra es `position: sticky`.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: pasa.
- [ ] **Step 5:** commit `feat: barra superior con vista e idioma`.

### Task 6: Vista Profesor y vista Desarrollador

**Files:**
- Create: `src/render/teacher.js`, `src/render/developer.js`, `src/render/projectCard.js`, `src/render/timeline.js`, `src/styles/sections.css` y `tests/views.test.js`

**Interfaces:**
- Consumes: `PROJECTS`, `TEACHING`, `DEV_JOBS`, `EDUCATION` y `t` (Task 3); `renderContact` (Task 5).
- Produces:
  - `renderTeacher(lang): HTMLElement` con `data-view="teacher"`;
  - `renderDeveloper(lang): HTMLElement` con `data-view="developer"`;
  - `renderProjectCard(project, lang, {detailed:boolean}): HTMLElement`;
  - en la portada, un contenedor `#hero-3d` para el Task 7.

- [ ] **Step 1:** escribir las pruebas:
  - `renderTeacher('es')` contiene:
    - "+2,000";
    - el bloque de ISELAC con la clase `card--highlight`;
    - el texto de `students.note`;
    - el texto de modalidad en línea;
    - las 3 tarjetas de "Qué enseño" (Programación, Diseño, Desarrollo);
    - la foto `/assets/photo/christian.webp`;
    - las 8 tarjetas de proyecto;
  - `renderDeveloper('en')` contiene el stack (`FastAPI`, `Django`, `Luau`, `Blender`), la línea de tiempo con 2 puestos de la Asociación de Agentes Aduanales y `students.note`;
  - `renderProjectCard` de `caza-de-monstruos` tiene un `<a>` con `target="_blank"`, `rel="noopener"` y el texto de `project.play.roblox`; el de `culto-del-juicio` usa `project.view.steam`; el de `haunted-obby` no tiene enlace; el de `mecha-apex` muestra la etiqueta "En desarrollo";
  - todas las `<img>` tienen `alt` no vacío y `loading="lazy"`, salvo la de la portada.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar las dos vistas con el orden de secciones del spec §4.1 y §4.2. Las tarjetas destacadas, Caza de Monstruos y Build a Pipe!, ocupan `span-3 row-2` en escritorio. En menos de 640 px todas las tarjetas son de una columna, sin anchos fijos.
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: pasa.
- [ ] **Step 5:** commit `feat: vistas Profesor y Desarrollador`.

### Task 7: Escena 3D, respaldo e inclinación de tarjetas

**Files:**
- Create: `src/three/canUse3D.js`, `src/three/scene.js`, `src/tilt.js` y `tests/three.test.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: el contenedor `#hero-3d` (Task 6).
- Produces:
  - `canUse3D(win): boolean`. Da `false` si `matchMedia('(prefers-reduced-motion: reduce)').matches`, si no hay contexto `webgl2`/`webgl` o si `navigator.hardwareConcurrency < 4`;
  - `initScene(container): {dispose()}`;
  - `enableTilt(selector): void`.

- [ ] **Step 1:** escribir las pruebas, con `win` simulado:
  - con movimiento reducido → `false`;
  - si `getContext` devuelve `null` → `false`;
  - con 2 núcleos → `false`;
  - en un caso normal → `true`.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar `canUse3D`.
  - En `main.js`: si da `true`, cargar `scene.js` con `import()` dinámico tras `requestIdleCallback` (o `setTimeout` de 300 ms como respaldo). Si da `false`, poner `<img src="/assets/hero-fallback.webp">`.
  - La escena: 6 a 10 cubos y piezas redondeadas en `--c-card`, `--c-pink` y `--c-border`, más un personaje sencillo de bloques. Luz suave, sin bloom ni brillos.
    - Parallax leve con `pointermove`, o `deviceorientation` en móvil, con un máximo de unos 8°.
    - `pixelRatio` limitado a 2, y la escena se pausa con `visibilitychange` y cuando sale de la vista (`IntersectionObserver`).
  - `enableTilt`: una inclinación de 4° como máximo al pasar el ratón, solo con `(hover: hover)` y sin movimiento reducido.
  - Generar `hero-fallback.webp` con una captura de la escena (`npm run dev` + captura del navegador).
- [ ] **Step 4:** ejecutar `npm test`. Resultado esperado: pasa. Con `npm run dev`, la consola no muestra errores con WebGL ni al emular movimiento reducido.
- [ ] **Step 5:** commit `feat: escena 3D con respaldo e inclinación`.

### Task 8: CV en PDF (ES y EN)

**Files:**
- Create: `cv.html`, `src/cv.js`, `src/styles/cv.css`, `tools/build-cv.mjs` y `tests/cv.test.js`
- Modify: `vite.config.js`, con `cv.html` como segunda entrada, y `src/render/nav.js` o las portadas, para añadir el botón "Descargar CV"

**Interfaces:**
- Consumes: `TEACHING`, `DEV_JOBS`, `EDUCATION`, `PROJECTS` y `t`.
- Produces:
  - `renderCV(lang): HTMLElement`;
  - los archivos `public/cv/CV-Christian-Espinoza-ES.pdf` y `-EN.pdf`;
  - `cvHref(lang)`.

- [ ] **Step 1:** escribir las pruebas:
  - `renderCV('es')` incluye la foto, el correo, `+52 753 150 1861`, la URL de LinkedIn, los títulos "Experiencia docente", "Experiencia como desarrollador", "Formación" y "Proyectos destacados", y como mucho 6 proyectos;
  - `cvHref('en') === '/cv/CV-Christian-Espinoza-EN.pdf'`.
- [ ] **Step 2:** ejecutar `npm test`. Resultado esperado: FALLA.
- [ ] **Step 3:** implementar `cv.html?lang=xx` con estilos `@media print` (A4, márgenes de 14 mm, máximo 2 páginas).
  - `build-cv.mjs` arranca `vite preview` y ejecuta Chrome o Edge (`CHROME_PATH`, o la ruta estándar de Windows) con `--headless --print-to-pdf=<salida> --no-pdf-header-footer` para cada idioma.
- [ ] **Step 4:** ejecutar `npm test && npm run build && npm run cv`. Resultado esperado: se crean los dos PDF, de 2 páginas como máximo cada uno (comprobar abriéndolos).
- [ ] **Step 5:** commit `feat: CV descargable en PDF`.

### Task 9: QA visual y de diseño

**Files:**
- Modify: los CSS y renders que haga falta según los hallazgos.

- [ ] **Step 1:** ejecutar `npm run dev` y revisar en el navegador a 360, 768 y 1440 px de ancho: las dos vistas en los dos idiomas.
  - En cada combinación, `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
  - Sin errores en consola.
  - El foco se ve con teclado, y el selector de vista se maneja con Tab y Enter.
- [ ] **Step 2:** ejecutar `"C:/Users/chrit/.claude/skills/impeccable/scripts/impeccable" detect dist/index.html` tras `npm run build`. Corregir todos los hallazgos de contraste, `tiny-text`, `gradient-text` y `dark-glow`. Resultado esperado: 0 hallazgos o solo excepciones justificadas.
- [ ] **Step 3:** pasar la revisión de las skills `design-taste-frontend` y `emil-design-eng` sobre la web en marcha, y aplicar las correcciones de jerarquía, espaciado y movimiento que encuentren.
- [ ] **Step 4:** buscar en todo `src/`, `index.html`, `cv.html` y `dist/` la expresión prohibida `/\b(IA|AI)\b|generad|generated|Claude|ChatGPT/i`. Resultado esperado: 0 coincidencias.
- [ ] **Step 5:** ejecutar `npm test && npm run build && npm run cv`. Resultado esperado: todo pasa.
- [ ] **Step 6:** commit `fix: QA visual y de accesibilidad`.
