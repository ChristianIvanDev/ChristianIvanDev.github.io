# Portafolio de Christian Espinoza — Documento de diseño

Fecha: 2026-11-06 · Carpeta del proyecto: `D:\Porfotlio`

## 1. Intención y por qué

Christian Espinoza Gaytan es profesor de programación y desarrollador, y vive en Lázaro Cárdenas, Michoacán (México). Quiere una web personal con dos funciones:

1. **Publicidad como tutor privado** de programación, diseño y desarrollo. Es el objetivo principal.
2. **Un CV en forma de página**, que muestre su experiencia como profesor y como desarrollador.

**Quién llega a la web.** Suele ser un padre o una madre que lo encontró en Superprof y busca a alguien que lleve a su hijo más allá de lo que aprende en clase. El último caso real fue justo ese: un padre quería "explorar los límites del diseño y la programación de su hijo". En segundo lugar llegan empresas o escuelas que revisan su perfil.

**Qué convence a ese padre.** Dos cosas juntas:
- trabajo real que los chicos reconocen y quieren hacer (juegos de Roblox);
- años de aula: más de 2,000 clases y experiencia presencial en bachillerato.

**Éxito.** Que el visitante escriba a Christian por WhatsApp o por correo. Superprof es la tercera vía.

## 2. Objetivos, no objetivos y antiobjetivos

**Objetivos**
- Dos vistas en la misma página, que se cambian desde arriba: **Profesor** (por defecto) y **Desarrollador**.
- Dos idiomas, **español** (por defecto) e **inglés**, con un botón ES / EN.
- Estilo **Bento grid** con **elementos 3D**: morado como color principal y rosa pálido como secundario.
- Mostrar todos los proyectos listados en la sección 5, Roblox incluido.
- Destacar la **experiencia docente presencial en bachillerato** y las **más de 2,000 clases dadas**.
- Que funcione como CV: un botón **Descargar CV (PDF)** en las dos vistas.

**No objetivos (por ahora)**
- No hay precios, sistema de reservas, blog ni panel de administración.
- No hay formulario de contacto con servidor: el contacto se hace por enlaces de WhatsApp, `mailto:` y Superprof.

**Antiobjetivos (aunque la web funcione, estos serían un fracaso)**
- **Decir o insinuar que los proyectos se hicieron con IA.** Ningún texto, comentario visible, metadato ni crédito puede mencionarlo.
- **Mostrar proyectos de sus alumnos.** Christian ha colaborado en muchos, pero no se pueden mostrar. La web incluye una nota que lo explica (sección 5).
- **Parecer una plantilla genérica "hecha por IA":** texto en degradado, brillos de neón, tarjetas iguales sin jerarquía.
- **Que el 3D haga la web lenta o pesada en móvil.** La mayoría de los padres la verán en el teléfono.
- **Inventar datos.** Ninguna cifra, reseña, alumno o logro que no esté en este documento.

## 3. Lo que Christian decidió

- **Dirección visual "C · Juguetón en bloques"** (elegida entre tres maquetas). Fondo morado intenso, tarjetas moradas con borde grueso más claro y una sombra sólida inferior, como piezas de bloques. Las tarjetas destacadas van en rosa pálido con texto morado oscuro. Los titulares van en mayúsculas, con letra gruesa y redondeada. Los cubos 3D tienen un guiño a Roblox.
  - Referencias tomadas de la maqueta: morado de fondo `#5b21b6`, tarjeta `#6d28d9`, borde `#8b5cf6`, sombra sólida `#3b0f80`, rosa pálido `#fbe1ea` / `#f9c9da`. Son el punto de partida, no son definitivos.
- **Barra superior fija** con:
  - el nombre o la marca a la izquierda;
  - el selector **Profesor / Desarrollador** en el centro;
  - **ES / EN** a la derecha.
- **Contacto:** primero **WhatsApp o correo**, después **Superprof**.
- **Cifra de clases:** "Más de 2,000 clases dadas".
- **Experiencia destacada:** profesor **presencial de bachillerato**.
- **Foto:** la que envió Christian. Es un retrato al aire libre con polo verde oscuro y cielo azul. Original en `C:\Users\chrit\AppData\Local\Temp\claude\6602e84be4da58b1\6242efe3-19b2-4285-82ed-ea4923959066\images\1.jpg`; copiarla al proyecto antes de que se borre esa carpeta temporal.
- **Imágenes de los proyectos:** usar las capturas e imágenes de sesiones anteriores (inventario en la sección 6).
- **Nombre del juego:** se escribe "Caza de Monstruos".
- **Modalidad de las clases particulares:** **solo en línea.** La web lo deja claro: por ejemplo, "Clases en línea, desde cualquier lugar". La ubicación no se usa como argumento de venta.
  - La experiencia presencial en bachillerato se presenta como trayectoria docente: demuestra que sabe manejar grupos reales de adolescentes. No es la modalidad que ofrece.

## 4. Contenido de cada vista

El contenido que no cambia entre vistas aparece en las dos: barra superior, foto, contacto y nota sobre los alumnos.

### 4.1 Vista Profesor (por defecto)

1. **Portada (Bento).**
   - Tarjeta grande rosa con el titular, por ejemplo "Aprende a crear juegos, webs y diseño".
   - Debajo: "Christian Espinoza · Tutor privado de programación, diseño y desarrollo".
   - Botones **WhatsApp** y **Correo**.
   - Tarjeta con la **escena 3D** de bloques, que reacciona al ratón o al movimiento del teléfono.
   - Tarjeta con la foto.
2. **Experiencia docente** (la sección con más peso).
   - "+2,000 clases dadas, presenciales y en línea".
   - **Profesor presencial de bachillerato, Preparatoria ISELAC** (ago 2024 – oct 2025): Python desde los fundamentos hasta programación orientada a objetos, con proyectos de videojuegos en PyGame. El enfoque es el pensamiento lógico y creativo.
   - **Coding Giants (España)**: maestro, desde sep 2026.
   - **Algonova**: tutor en línea, desde ene 2026.
   - **Algorithmics Global**: coordinador académico y profesor de niños y adolescentes (jun 2024 – oct 2025).
   - **Instituto Educativo Lázaro Cárdenas**: maestro de Operador en Sistemas Ofimáticos (feb 2023 – nov 2024).
3. **Qué enseño:** tres tarjetas.
   - **Programación**: Python, JavaScript, Luau.
   - **Diseño**: interfaces, UI de juegos, 3D.
   - **Desarrollo**: juegos en Roblox, webs, APIs.
4. **Proyectos que inspiran.** Los juegos de Roblox y el resto de proyectos, presentados como "esto es lo que tu hijo puede aprender a construir". Cada tarjeta lleva imagen, nombre y una línea.
5. **Nota sobre los alumnos** (sección 5).
6. **Contacto.** "¿Hablamos de lo que quiere aprender tu hijo?" con WhatsApp y Correo, más "También en Superprof".

### 4.2 Vista Desarrollador (tipo CV técnico)

1. **Portada (Bento).**
   - Titular, por ejemplo "Juegos, webs y herramientas que funcionan".
   - Botones **Ver proyectos** y **Descargar CV**.
   - Tarjeta **Stack**: Python, FastAPI, Django, Tailwind, Luau / Roblox Studio, JavaScript, Blender.
2. **Proyectos** con más detalle técnico: problema, qué construyó y tecnologías.
3. **Experiencia como desarrollador**, en línea de tiempo:
   - **Asociación de Agentes Aduanales de Lázaro Cárdenas.**
     - Desarrollador Front-End, Django + Tailwind (dic 2024 – oct 2025): aplicaciones web para gestionar servicios portuarios.
     - Desarrollador Backend, FastAPI (ago – dic 2024): APIs RESTful para una plataforma de consulta aduanera.
4. **Formación y certificaciones.**
   - Ingeniería en Sistemas Computacionales: Utel Universidad (2025 – 2027) e Instituto Tecnológico de Lázaro Cárdenas (2024 – 2025).
   - Diplomado en Habilidades Digitales para la Docencia, Fundación Carlos Slim (2025).
   - Certificaciones: Google Digital Marketing & E-commerce, Google Project Management, JavaScript Essentials 2, Python Essentials 1 y Remote Work Foundations.
5. **Nota sobre los alumnos** y **contacto**, iguales que en la vista Profesor.

### 4.3 Datos de contacto

- **WhatsApp:** +52 753 150 1861 (del perfil de LinkedIn). El enlace es `https://wa.me/527531501861` con un mensaje inicial breve y amable, en el idioma activo.
- **Correo:** christianespinozagaytan@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/christianieg/
- **Superprof:** https://www.superprof.mx/profesor-joven-con-anos-experiencia-programacion-aprende-desarrollo-web-python-css-roblox-desde-cero.html

## 5. Proyectos

El texto de cada proyecto se escribe en primera persona, como trabajo de Christian. **Nunca** se menciona IA ni herramientas de generación.

**Roblox**
1. **Caza de Monstruos** (destacado).
   - Juego de cacería de monstruos con los modos Cacería, Horda y Cabaña. La preparación se escala con el tamaño del mapa.
   - Criaturas como el Wendigo, el Mothman, el Pie Grande, el Chupacabras y el Demonio de Jersey.
   - Zona de obbys con un obby temático por monstruo.
   - Tienda con pestaña premium, pase de temporada, recompensa diaria, contratos semanales, armería y sala de trofeos.
   - Guardado de datos seguro, en español e inglés y adaptado a móvil y mando.
   - **Publicado:** https://www.roblox.com/es/games/134450784529527/Caza-de-mounstruos. La tarjeta lleva el botón "Jugar en Roblox" / "Play on Roblox".
2. **Build a Pipe! [Plumbing Simulator]** (destacado). Simulador de fontanería con modo Arcade y modo Realista. En el Realista te mueves por el escenario y ves el plano de la tubería en una tablet. Tiene niveles tutoriales guiados y tienda.
   - **Publicado:** https://www.roblox.com/es/games/70899491861878/Build-a-Pipe. La tarjeta lleva el botón "Jugar en Roblox" / "Play on Roblox".

**Enlaces:** Caza de Monstruos, Build a Pipe! y El Culto del Juicio son los únicos proyectos con enlace público. El resto se muestra solo con imágenes y sin botón de enlace.
3. **Haunted Obby.** Obby de Halloween con tema y decoración propios, productos de pago (Skip Stage, Speed Boost, Stage Pack) e ícono del juego.
4. **Mecha: Apex Protocols** (en desarrollo). Acción de mechas PvPvE en un mundo semiabierto, con IA de drones enemigos y combate.

**Otros**
5. **El Culto del Juicio**, mod de Project Zomboid (Build 42). Jefes con sus arenas, una cinemática de un culto con antorchas, una nota de lore que reaparece en el inventario, comerciantes y helicóptero. Es compatible con multijugador.
   - **Publicado en Steam Workshop:** https://steamcommunity.com/sharedfiles/filedetails/?id=3826352482. La tarjeta lleva el botón "Ver en Steam Workshop" / "View on Steam Workshop".
6. **Armero para Blender.** Plugin para ensamblar y modificar armas completas, con miras, silenciadores y otros accesorios, y colocarlas en escenas. Guarda presets propios e importa animaciones. Se describe sin poner en primer plano marcas de terceros.
7. **Agenda Docente.** Extensión de Chrome que reúne los horarios de varias plataformas de clases en línea y los sincroniza con Google Calendar.
8. **Plataforma de consulta aduanera** (trabajo profesional). APIs con FastAPI y front-end con Django + Tailwind. No hay capturas: se muestra con un bloque visual (fragmento de código estilizado o diagrama) y sin datos reales del cliente.

**Fuera del portafolio:** la instalación de un servidor de un juego de terceros y las instalaciones de herramientas. Son configuración, no proyectos.

**Nota sobre los alumnos** (texto base, a pulir y traducir):
> "He colaborado en muchos proyectos de mis estudiantes, pero no los muestro aquí para respetar su privacidad y su autoría."

## 6. Inventario de imágenes

Las rutas son de sesiones anteriores. **Copiar al proyecto (`assets/`) lo antes posible**, porque las carpetas de sesión pueden borrarse.

- **Build a Pipe!**
  - Carpeta: `C:\Users\chrit\AppData\Local\Claude-Data\claude_pzs8sxrjxfjjc\scratch-workspaces\9abbe05b-486c-41bb-8e74-37d84c930ae7\34c4908c-d667-4b9b-a795-526f7422b49f\scratch-2026-10-30-79b32b\`
  - Archivos: `icono.png`, `thumbnail-principal.png`, `miniaturas\1-taller.jpg … 4-realista.jpg` y `capturas\` (1-presion, 2-realista, 3-empresa, 4-red, 5-zonas y raw-*.jpg).
- **Haunted Obby**
  - Carpeta: `…\scratch-2026-10-18-45595d\`
  - Archivos: `icono-juego.png`, `producto-skip-stage.png`, `producto-speed-boost.png`, `producto-stage-pack.png`.
- **El Culto del Juicio:** `C:\Users\chrit\Zomboid\mods\CultoDelJuicio\42\poster.png`, `…\docs\preview.png` y `…\docs\workshop_features.png`.
- **Armero para Blender:** `D:\Proyecto Asset Ripper\.superpowers\sdd\2026-10-30-entrega-1-armero\task-11-modding-ui-with-rotation-fix.png` y `task-11-modding-popup-with-rotation-fix.png`.
- **Caza de Monstruos, Mecha y Agenda Docente:** capturas de sesiones anteriores, guardadas en las carpetas `tool-results` de `C:\Users\chrit\.claude\projects\…`. Lista con índices en `C:\Users\chrit\AppData\Local\Temp\claude\6602e84be4da58b1\6242efe3-19b2-4285-82ed-ea4923959066\scratchpad\sheet.idx.txt` y hojas de contactos en `…\scratchpad\sheet-0.jpg … sheet-5.jpg`.
  - **Índices recomendados de Caza de Monstruos:** 6 y 7 (lobby con obbys), 54 y 56 (zona de obbys), 9 y 33 (Wendigo y Mothman en partida), 93 (Demonio de Jersey), 150 a 152 (modelo del Wendigo), 32 (armería), 16 (tienda), 94 (paquetes de tokens), 105 (contrato semanal), 146 (recompensa diaria), 148 (pase de temporada), 120 y 122 (récords de la partida) y 82 (escena del desierto).
  - **Mecha: Apex Protocols:** 43 a 47 (modelos del mecha y de los drones) y 50 a 52 (efectos de combate).
  - **Agenda Docente:** 34, 36, 40 y 41 (panel, calendario y próxima clase).
  - Hay que revisar cada captura a tamaño completo antes de usarla. Se descartan las que muestren nombres o datos de alumnos (las de Agenda Docente pueden mostrarlos), interfaz de Studio o herramientas de desarrollo, y las que salgan demasiado oscuras.

## 7. Restricciones

- **Rendimiento en móvil.**
  - El 3D se carga después del contenido y no bloquea la lectura.
  - Si el dispositivo es lento, no tiene WebGL o tiene activado `prefers-reduced-motion`, se muestra una imagen fija en su lugar.
  - Las imágenes van en formato moderno, con tamaños adaptados.
- **Accesibilidad.**
  - Texto con contraste AA.
  - Cuerpo de texto de 16 px o más.
  - El selector de vista y el de idioma se pueden usar con teclado y lector de pantalla.
  - Las imágenes tienen texto alternativo en los dos idiomas.
- **Enlaces directos:** cada vista y cada idioma tienen su propia dirección. Christian puede mandar a un padre la vista Profesor y a una empresa la vista Desarrollador. El idioma elegido se recuerda en el navegador.
- **CV en PDF:** uno por idioma, generado a partir del mismo contenido de la web. Incluye experiencia docente y de desarrollo.
- **Sin servidor propio:** es una web estática, fácil de publicar gratis.
- **Calidad visual:** debe pasar las revisiones de las skills de diseño instaladas (Impeccable, Taste, Emil Kowalski) sin hallazgos importantes.

## 8. Decisiones que tomé yo (sin confirmar con Christian)

- **Tecnología:** web estática con Vite y JavaScript, y Three.js para la escena 3D. Los textos de cada idioma van en archivos aparte, no repartidos por el código.
- **Publicación:** queda para después del primer build. Se propondrá un hosting gratuito (GitHub Pages, Netlify o Cloudflare Pages).
- **Escena 3D:** cubos y piezas tipo bloque en morado y rosa, con un personaje sencillo de bloques. Se mueve un poco con el ratón o la inclinación del teléfono. Además, las tarjetas de proyecto tienen una inclinación 3D leve al pasar el ratón.
- **Textos en inglés:** los traduzco yo a partir de los textos en español.
- **Titulares:** "Aprende a crear juegos, webs y diseño" y "Juegos, webs y herramientas que funcionan" son provisionales.
- **Detalle técnico en la vista Desarrollador:** se limita a las funciones listadas en la sección 5, más las tecnologías conocidas de cada proyecto. Sin inventar problemas ni cifras.
  - Roblox: Luau y Roblox Studio.
  - Mod de Project Zomboid: Lua.
  - Armero: Python y la API de Blender.
  - Agenda Docente: JavaScript, extensión de Chrome y API de Google Calendar.
  - Plataforma aduanera: FastAPI, Django y Tailwind.
- **CV en PDF:** de 1 a 2 páginas por idioma.
  - Incluye foto, contacto (correo, WhatsApp y LinkedIn), un resumen, experiencia docente, experiencia como desarrollador, formación y certificaciones, y una lista breve de proyectos destacados (nombre y una línea).
  - El teléfono va incluido porque ya es público en LinkedIn.

## 9. Lo que queda a criterio de quien construya

- La estructura de carpetas y el sistema de componentes.
- La tipografía, siempre que cumpla la dirección C (gruesa, redondeada, legible) y no use una fuente "por defecto" muy vista.
- La distribución exacta de las tarjetas Bento en cada tamaño de pantalla.
- Cómo se generan los PDF del CV.
- Las animaciones de cambio de vista y de idioma: breves, que se puedan interrumpir y que respeten `prefers-reduced-motion`.
