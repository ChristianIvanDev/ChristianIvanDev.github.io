# Portafolio v2: animaciones, más motivos para agendar y reserva de clases. Documento de diseño

- **Fecha:** 2026-11-06
- **Proyecto:** `D:\Porfotlio`, publicado en https://christianivandev.github.io
- **Se apoya en:** `docs/superpowers/specs/2026-11-06-portafolio-design.md` (v1). Todo lo que este documento no cambia sigue igual: dirección visual C, las dos vistas, los dos idiomas, las restricciones y los antiobjetivos.

## 1. Intención y por qué

La v1 muestra bien el trabajo de Christian, pero no resuelve las dudas que frenan a un padre antes de escribir. Los padres le preguntan siempre tres cosas:

1. "¿Es realmente necesario?"
2. "¿Exactamente qué aprenden y cómo?"
3. "¿Y si no me gusta la clase?"

La v2 contesta esas tres preguntas en la vista Profesor. También permite que el padre **reserve él mismo la primera clase en un hueco libre de Christian**, con el enlace de Google Meet creado automáticamente y un aviso por correo para los dos. Además, hace la página más viva e interactiva con animaciones discretas.

**Éxito:** que más visitantes reserven una clase o escriban, sin que Christian tenga que coordinar horarios a mano.

## 2. Objetivos, no objetivos y antiobjetivos

**Objetivos**
- Tres secciones nuevas en la vista Profesor, una por cada pregunta de los padres (sección 4).
- Botón principal **"Agendar clase"**, que abre la página de reservas de Google Calendar de Christian. WhatsApp y el correo quedan como segunda opción.
- En móvil, una barra inferior fija con el botón de reserva, que aparece después de pasar la portada.
- Animaciones de entrada, interacción y cambio de vista (sección 5).
- Vista previa al compartir el enlace (etiquetas Open Graph y favicon), porque Christian difunde la web por WhatsApp y redes.

**No objetivos (en esta versión)**
- **Mensajes automáticos por WhatsApp.** Requieren la WhatsApp Business Platform de Meta: cuenta verificada, número dedicado, plantillas aprobadas, pago por mensaje y un conector como Make o Zapier. Se hará después, si las reservas lo justifican.
- **Que la extensión Agenda Docente muestre las reservas.** Es otro proyecto con su propio código y se hará en una sesión aparte. Mientras tanto, las reservas aparecen en Google Calendar.
- Precios, pagos en línea y cuentas de usuario.

**Antiobjetivos**
- Todos los de la v1, en especial: nada de IA, nada de proyectos ni datos de alumnos y **nada de datos inventados**. Por ejemplo, no se puede inventar la duración de la clase, una tarifa ni el número de alumnos.
- **Animaciones que molesten o hagan lenta la página:**
  - nada que bloquee la lectura o el scroll;
  - nada que dure más de unos 300 ms en interacciones frecuentes;
  - todo respeta `prefers-reduced-motion`.
- **Presión comercial agresiva:** sin contadores falsos de urgencia, sin ventanas emergentes y sin "quedan 2 plazas".

## 3. Lo que Christian decidió

- Le parece bien la maqueta de las secciones nuevas: portada con "agendar", "¿Es realmente necesario?", recorrido interactivo "Qué aprenden y cómo", preguntas frecuentes en acordeón y barra fija en móvil.
- **Reserva:** el padre agenda en los horarios libres de Christian, a Christian le llega un aviso por correo y la cita tiene un enlace de Google Meet automático. La herramienta es la **agenda de citas de Google Calendar**, recomendada y aceptada.
- **Garantía (confirmada para publicar):** si la primera clase no les convence y se lo comunican, Christian no se la cobra. Texto: "Si la primera clase no te convence, dímelo y no te la cobro." En inglés: "If the first lesson doesn't win you over, tell me and I won't charge you for it."
- **Horarios:** la página de reservas consulta el calendario "Agenda Docente" para no aceptar reservas encima de otras clases. Christian la crea con su cuenta siguiendo los pasos que se le dieron y entrega el enlace.

## 4. Contenido nuevo (vista Profesor)

El orden propuesto es: portada → **¿Es realmente necesario?** → experiencia en el aula → **qué aprenden y cómo** → proyectos → nota de alumnos → **preguntas frecuentes** → contacto.

**La sección "Qué enseño" de la v1 se sustituye por la 4.3** (mi decisión): sus tres áreas (Programación, Diseño, Desarrollo) pasan a ser una fila compacta al inicio de 4.3, y su tarjeta "Cómo son las clases" se convierte en "Cómo es una clase". Así no se repite el contenido.

### 4.1 Portada
- **Botón principal:** "Agendar clase" / "Book a lesson". Abre la página de reservas en una pestaña nueva.
- **Botones secundarios:** WhatsApp y correo.
- **Debajo de los botones,** una línea corta con la garantía.
- Si todavía no existe el enlace de reservas, el botón principal vuelve a ser WhatsApp, como en la v1, y la web no muestra un botón roto.

### 4.2 "¿Es realmente necesario?"
Tres tarjetas, con argumentos generales y no cifras inventadas:
- **De jugar a crear:** deja de solo consumir juegos y empieza a construir los suyos.
- **Pensamiento lógico:** resolver problemas paso a paso le sirve en todas las materias.
- **Algo propio que mostrar:** termina con un proyecto real que puede enseñar y publicar.

### 4.3 "¿Exactamente qué aprenden y cómo?" (interactivo)
- **Recorrido por etapas** con pestañas o pasos que se pueden pulsar. Cada etapa muestra qué aprende y qué termina construyendo. Se maneja con teclado. La etapa activa **no** se guarda en la URL (mi decisión: evita conflictos con `?view=&lang=` y con los anclajes).
  1. **Lógica:** pensar como programador, con secuencias, condiciones y bucles.
  2. **Python:** su primer videojuego en PyGame. Variables, condiciones, bucles y objetos (sale de la experiencia real en ISELAC).
  3. **Roblox:** crear y publicar su propio juego con Luau. Referencia: Caza de Monstruos y Build a Pipe!
  4. **Webs:** su primera página web con HTML, CSS y JavaScript.
- **"Cómo es una clase":** 100 % en línea por Google Meet, con pantalla compartida. Repaso, reto nuevo, construimos juntos en directo y reto corto opcional para casa.
- Las etapas y el orden de la clase son una propuesta construida a partir de lo que Christian enseña. Él puede ajustarlas.
- **No se indica la duración** de la clase. La define la página de reservas.

### 4.4 Preguntas frecuentes (acordeón)
- **¿Es realmente necesario?** Resumen de 4.2.
- **¿Qué aprende exactamente y cómo?** Resumen de 4.3, con enlace a la sección.
- **¿Y si no me gusta la clase?** La garantía de la sección 3.
- **¿Qué necesita para empezar?** Una computadora con internet y ganas de crear. Las clases son en línea, desde cualquier lugar.
- **¿Cómo agendo?** Con el botón "Agendar clase": se elige un horario libre y llega un enlace de Google Meet por correo. También se puede escribir por WhatsApp.
- **Edad:** no hay pregunta sobre edad, porque Christian no ha dado una edad mínima. Se añadirá si la da.

### 4.5 Contacto y barra fija en móvil
- El bloque de contacto pone "Agendar clase" como primera opción.
- **Barra inferior fija (ancho de 640 px o menos):** el texto "¿Listo para la primera clase?" con el botón de reserva.
  - Aparece cuando la portada sale de la pantalla.
  - Se oculta cuando el bloque de contacto está visible, para no duplicarlo.
  - No tapa contenido: la página añade un margen inferior equivalente.

### 4.6 Vista Desarrollador
Sin secciones nuevas y **sin botón de reserva** (mi decisión): su público son empresas, así que su contacto sigue siendo WhatsApp y correo, y la barra fija de móvil solo existe en la vista Profesor. Recibe las animaciones comunes y se aplica la corrección menor pendiente: Proyectos antes que Experiencia, como dice el spec de la v1.

### 4.7 Datos de configuración
- La URL de la página de reservas vive en un solo lugar, junto a los datos de contacto.
- Si la URL está vacía, se usa el respaldo de 4.1.
- **URL de reservas:** https://calendar.app.google/kydiVgoRNTarLdCv6
- **Sin URL de reservas**, todo lo que depende de ella tiene su versión WhatsApp (mi decisión), para no afirmar nada falso en la web publicada:
  - el botón de la portada y el del contacto abren WhatsApp;
  - la barra fija dice "Agendar por WhatsApp";
  - la respuesta "¿Cómo agendo?" dice "Escríbeme por WhatsApp y elegimos un horario".
  - Con URL, cambian a la versión de reserva. Las dos versiones tienen prueba.

## 5. Animaciones e interactividad

Se siguen las reglas de la skill de Emil Kowalski: animar solo `transform` y `opacity`, curvas `ease-out` propias, menos de 300 ms en interacciones, hover solo con `(hover: hover) and (pointer: fine)`, y sin animar las acciones de teclado repetidas.

- **Entrada de la portada al cargar:** titular, texto y botones entran escalonados (de 40 a 60 ms entre elementos, desplazamiento de unos 8 px más opacidad).
- **Aparición al hacer scroll:**
  - cada sección y sus tarjetas aparecen una sola vez, con un escalonado corto;
  - la primera pantalla no espera al scroll;
  - sin JavaScript, o con movimiento reducido, todo es visible desde el inicio.
- **Contador:** "+2,000" cuenta desde cero cuando entra en pantalla, durante menos de 1.2 s. Con movimiento reducido se muestra la cifra final. El texto real está siempre en el HTML para lectores de pantalla.
- **Tarjetas:** elevación leve al pasar el ratón, que se suma a la inclinación 3D actual. Los botones mantienen su respuesta al pulsar.
- **Recorrido de 4.3:** al cambiar de etapa, el contenido hace un fundido corto y una barra de progreso avanza hasta la etapa activa.
- **Acordeón:** se abre y se cierra con una transición de altura y opacidad. Usa `<details>/<summary>` o un botón con `aria-expanded`, para que sea accesible.
- **Cambio de vista Profesor / Desarrollador:** fundido breve del contenido, de 150 a 200 ms. Si se cambia con el teclado, el cambio es instantáneo.
- **Barra fija en móvil:** entra deslizándose desde abajo.
- **Movimiento reducido:** sin desplazamientos ni escalas. Como mucho, fundidos de opacidad. La escena 3D sigue con su respaldo actual.

## 6. Restricciones

- Las de la v1: contraste AA, cuerpo de texto de 16 px o más, sin scroll horizontal a 360 px, todo usable con teclado y lector de pantalla, y textos en los dos idiomas.
- **Sin librerías de animación pesadas.** Basta con CSS, IntersectionObserver y Web Animations API. La página no debe crecer más de unos 15 KB comprimidos.
- **Despliegue:** sigue siendo estático y se publica solo al subir cambios a `main` (GitHub Actions), con rutas relativas.
- **Pruebas:** cada comportamiento nuevo tiene su prueba. Entre ellos: el respaldo del botón de reserva, el recorrido manejable con teclado, el acordeón accesible, la barra fija que no se muestra mientras se ve la portada, la paridad de textos entre idiomas y el filtro de palabras prohibidas.

## 7. Decisiones que tomé yo (sin confirmar con Christian)

- **Contenido de 4.2, 4.3 y 4.4:** las etapas del recorrido, el orden de la clase y los textos de las tarjetas y de las preguntas frecuentes son propuestas mías basadas en lo que enseña.
- **Nombre del botón:** "Agendar clase", sin "gratis" (la primera clase no es gratis por adelantado).
- **Orden de secciones:** el de la sección 4.
- **Vista previa al compartir:**
  - Open Graph con título y descripción del idioma por defecto (español);
  - imagen 1200×630 hecha con la estética de bloques y su foto;
  - favicon de un cubo morado con una "C".
- **Corrección menor de la v1:** se incluyen "Ver proyectos" quedando bajo la barra fija (`scroll-margin-top`) y el orden de secciones de la vista Desarrollador.

## 8. Lo que queda a criterio de quien construya

- La implementación de cada animación, siempre dentro de los límites de la sección 5.
- El diseño exacto del recorrido de 4.3: pestañas, línea de pasos o tarjetas.
- Si el acordeón usa `<details>` o botones.
- El diseño de la imagen de Open Graph y del favicon.

## 9. Lo que tiene que hacer Christian

1. ~~Crear la agenda de citas~~ Hecho: https://calendar.app.google/kydiVgoRNTarLdCv6. Con la cuenta gratuita, Google solo revisa el calendario principal, no "Agenda Docente" (ver no objetivos).
2. Revisar los textos propuestos de 4.2, 4.3 y 4.4.
