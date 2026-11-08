import { asset } from '../paths.js';

const img = (id, n, es, en) => ({ src: asset(`assets/projects/${id}/${n}.webp`), alt: { es, en } });

const GH = 'https://github.com/ChristianIvanDev';
const PAGES = 'https://christianivandev.github.io';

export const PROJECTS = [
  {
    id: 'franja',
    group: 'web',
    featured: false,
    release: '2026-11-07',
    link: { href: `${PAGES}/franja/`, kind: 'demo' },
    code: `${GH}/franja`,
    stack: ['React', 'TypeScript', 'Intl API', 'Vitest'],
    title: { es: 'Franja', en: 'Franja' },
    summary: {
      es: 'Planificador de reuniones entre zonas horarias: encuentra la hora en la que todo el equipo coincide.',
      en: 'A meeting planner across time zones: finds the hour when the whole team overlaps.',
    },
    features: {
      es: [
        'Las 420 zonas horarias del mundo, con búsqueda por país, desfase o abreviatura',
        'Franja común resaltada y sugerencia del mejor horario',
        'Horario de verano, días de 23 y 25 horas y fines de semana de cada zona',
        'Exporta a Google Calendar o .ics y se comparte con un enlace, sin cuentas',
      ],
      en: [
        "All 420 of the world's time zones, searchable by country, offset or abbreviation",
        'Highlighted overlap and a suggested best time',
        "Daylight saving time, 23- and 25-hour days and each zone's weekends",
        'Exports to Google Calendar or .ics and is shared with a link, no accounts',
      ],
    },
    images: [img('franja', 1, 'Línea de tiempo con cinco personas en distintas ciudades y la franja común resaltada', 'Timeline with five people in different cities and the shared slot highlighted')],
  },
  {
    id: 'sinnube',
    group: 'web',
    featured: false,
    release: '2026-11-21',
    link: { href: `${PAGES}/sinnube/`, kind: 'demo' },
    code: `${GH}/sinnube`,
    stack: ['React', 'TypeScript', 'Web Workers', 'pdf-lib'],
    title: { es: 'Sinnube', en: 'Sinnube' },
    summary: {
      es: 'Herramientas de PDF e imágenes que funcionan en el navegador: tus archivos nunca se suben a un servidor.',
      en: 'PDF and image tools that run in the browser: your files are never uploaded to a server.',
    },
    features: {
      es: [
        'Une, divide y reordena PDF; convierte fotos en un PDF',
        'Comprime imágenes en paralelo con Web Workers',
        'Muestra y borra la ubicación GPS de las fotos sin perder calidad',
        'Funciona sin internet y demuestra que no envía ningún archivo',
      ],
      en: [
        'Merge, split and reorder PDFs; turn photos into a PDF',
        'Compresses images in parallel with Web Workers',
        "Shows and removes photos' GPS location without losing quality",
        'Works offline and proves it never sends a file',
      ],
    },
    images: [img('sinnube', 1, 'Herramienta para dividir un PDF con las miniaturas de sus páginas elegidas', 'Tool to split a PDF with thumbnails of the chosen pages')],
  },
  {
    id: 'malla',
    group: 'web',
    featured: false,
    release: '2026-12-04',
    link: { href: `${PAGES}/malla/`, kind: 'demo' },
    code: `${GH}/malla`,
    stack: ['React', 'TypeScript', 'three.js', 'glTF'],
    title: { es: 'Malla', en: 'Malla' },
    summary: {
      es: 'Inspector de modelos 3D en el navegador que detecta qué los hace pesados y exporta una versión optimizada.',
      en: 'A 3D model inspector in the browser that finds what makes models heavy and exports an optimized version.',
    },
    features: {
      es: [
        'Abre GLB, glTF, OBJ, FBX y STL con sus texturas',
        'Informe de optimización con nota de 0 a 100',
        'Vista de UVs, texturas, animaciones y árbol de la escena',
        'Exporta un GLB once veces más ligero en el modelo de ejemplo',
      ],
      en: [
        'Opens GLB, glTF, OBJ, FBX and STL with their textures',
        'Optimization report with a score from 0 to 100',
        'UV view, textures, animations and scene tree',
        'Exports a GLB eleven times lighter on the sample model',
      ],
    },
    images: [img('malla', 1, 'Faro en una isla con el informe de optimización a un lado', 'Lighthouse on an island with the optimization report beside it')],
  },
  {
    id: 'ramaje',
    group: 'web',
    featured: false,
    release: '2026-12-16',
    link: { href: `${PAGES}/ramaje/`, kind: 'demo' },
    code: `${GH}/ramaje`,
    stack: ['React', 'TypeScript', 'Canvas', 'GitHub API'],
    title: { es: 'Ramaje', en: 'Ramaje' },
    summary: {
      es: 'La historia de cualquier repositorio de GitHub como un mapa: ramas, merges y quién cambió qué.',
      en: 'The history of any GitHub repository as a map: branches, merges and who changed what.',
    },
    features: {
      es: [
        'Grafo de commits con ramas y merges, dibujado en Canvas',
        'Archivos que más cambian y actividad del equipo por día y hora',
        'Repetición animada de cómo creció el repositorio',
        'Enlaces que guardan la vista y cuidan el cupo de la API',
      ],
      en: [
        'Commit graph with branches and merges, drawn on Canvas',
        'Most-changed files and team activity by day and hour',
        'Animated replay of how the repository grew',
        'Links that keep the view and care for the API quota',
      ],
    },
    images: [img('ramaje', 1, 'Grafo de commits con ramas de colores y el detalle de un commit', 'Commit graph with colored branches and a commit detail')],
  },
  {
    id: 'caza-de-monstruos',
    group: 'roblox',
    featured: true,
    link: { href: 'https://www.roblox.com/es/games/134450784529527/Caza-de-mounstruos', kind: 'roblox' },
    stack: ['Luau', 'Roblox Studio', 'DataStore'],
    title: { es: 'Caza de Monstruos', en: 'Caza de Monstruos (Monster Hunt)' },
    summary: {
      es: 'Juego de cacería de criaturas legendarias con tres modos, zona de obbys y progresión completa.',
      en: 'A game about hunting legendary creatures, with three modes, an obby zone and full progression.',
    },
    features: {
      es: [
        'Modos Cacería, Horda y Cabaña, con preparación que escala con el tamaño del mapa',
        'Wendigo, Mothman, Pie Grande, Chupacabras y Demonio de Jersey',
        'Zona de obbys con un obby temático por monstruo',
        'Tienda con pestaña premium, pase de temporada, recompensa diaria y contratos semanales',
        'Armería, sala de trofeos y guardado de datos seguro',
        'En español e inglés, adaptado a móvil y mando',
      ],
      en: [
        'Hunt, Horde and Cabin modes, with prep time that scales with map size',
        'Wendigo, Mothman, Bigfoot, Chupacabra and Jersey Devil',
        'Obby zone with a themed obby for each monster',
        'Shop with a premium tab, season pass, daily reward and weekly contracts',
        'Armory, trophy room and safe data saving',
        'In Spanish and English, adapted to mobile and gamepad',
      ],
    },
    images: [
      img('caza-de-monstruos', 1, 'Cacería nocturna en el bosque nevado con escopeta mientras vigila el Pie Grande', 'Night hunt in the snowy forest with a shotgun while Bigfoot watches'),
      img('caza-de-monstruos', 2, 'Zona de obbys vista desde arriba, con pistas de colores alrededor de un centro', 'Obby zone seen from above, with colorful tracks around a hub'),
      img('caza-de-monstruos', 3, 'Pantalla de la armería para elegir el equipo de partida', 'Armory screen to choose the match loadout'),
      img('caza-de-monstruos', 4, 'Pase de temporada con sus recompensas por nivel', 'Season pass with its rewards per level'),
    ],
  },
  {
    id: 'build-a-pipe',
    group: 'roblox',
    featured: true,
    link: { href: 'https://www.roblox.com/es/games/70899491861878/Build-a-Pipe', kind: 'roblox' },
    stack: ['Luau', 'Roblox Studio'],
    title: { es: 'Build a Pipe! [Plumbing Simulator]', en: 'Build a Pipe! [Plumbing Simulator]' },
    summary: {
      es: 'Simulador de fontanería: conecta tuberías y controla la presión del agua en dos modos de juego.',
      en: 'A plumbing simulator: connect pipes and manage water pressure across two game modes.',
    },
    features: {
      es: [
        'Modo Arcade',
        'Modo Realista: recorres el escenario y consultas el plano de la tubería en una tablet',
        'Niveles tutoriales guiados que presentan cada pieza nueva',
        'Tienda de objetos que ayudan a resolver los niveles',
      ],
      en: [
        'Arcade mode',
        'Realistic mode: walk the scene and check the pipe blueprint on a tablet',
        'Guided tutorial levels that introduce each new piece',
        'Item shop with tools that help solve levels',
      ],
    },
    images: [
      img('build-a-pipe', 1, 'Portada de Build a Pipe! con tuberías y agua', 'Build a Pipe! key art with pipes and water'),
      img('build-a-pipe', 2, 'Modo Realista dentro de una casa con el plano de la tubería', 'Realistic mode inside a house with the pipe blueprint'),
      img('build-a-pipe', 3, 'Nivel de tuberías donde hay que controlar la presión del agua', 'Pipe level where you have to manage water pressure'),
    ],
  },
  {
    id: 'haunted-obby',
    group: 'roblox',
    featured: false,
    link: { href: 'https://www.roblox.com/es/games/90518449117709/Escape-the-Haunted-Obby-HALLOWEEN', kind: 'roblox' },
    stack: ['Luau', 'Roblox Studio'],
    title: { es: 'Escape the Haunted Obby', en: 'Escape the Haunted Obby' },
    summary: {
      es: 'Obby de Halloween con ambientación embrujada y productos de pago dentro del juego.',
      en: 'A Halloween obby with a haunted setting and in-game paid products.',
    },
    features: {
      es: ['Tema y decoración de Halloween', 'Productos Skip Stage, Speed Boost y Stage Pack', 'Ícono y arte del juego'],
      en: ['Halloween theme and decoration', 'Skip Stage, Speed Boost and Stage Pack products', 'Game icon and art'],
    },
    images: [
      img('haunted-obby', 1, 'Ícono de Haunted Obby con un castillo embrujado y una calabaza', 'Haunted Obby icon with a haunted castle and a pumpkin'),
      img('haunted-obby', 2, 'Primera etapa del obby en un cementerio embrujado con calabazas', 'First obby stage in a haunted graveyard with pumpkins'),
    ],
  },
  {
    id: 'mecha-apex',
    group: 'roblox',
    featured: false,
    status: 'in-dev',
    stack: ['Luau', 'Roblox Studio'],
    title: { es: 'Mecha: Apex Protocols', en: 'Mecha: Apex Protocols' },
    summary: {
      es: 'Juego de acción de mechas PvPvE en un mundo semiabierto.',
      en: 'A PvPvE mecha action game in a semi-open world.',
    },
    features: {
      es: ['Modelos de mecha y drones enemigos', 'Comportamiento de los drones enemigos', 'Sistema de combate con efectos de impacto'],
      en: ['Mecha and enemy drone models', 'Enemy drone behavior', 'Combat system with impact effects'],
    },
    images: [
      img('mecha-apex', 1, 'Dos modelos de mecha blanco y negro', 'Two white and black mecha models'),
      img('mecha-apex', 2, 'Mecha frente a un dron enemigo', 'Mecha facing an enemy drone'),
    ],
  },
  {
    id: 'culto-del-juicio',
    group: 'other',
    featured: false,
    link: { href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3826352482', kind: 'steam' },
    stack: ['Lua', 'Project Zomboid Build 42'],
    title: { es: 'El Culto del Juicio', en: 'El Culto del Juicio (The Judgment Cult)' },
    summary: {
      es: 'Mod de Project Zomboid que añade un culto con jefes, arenas y su propia historia.',
      en: 'A Project Zomboid mod that adds a cult with bosses, arenas and its own story.',
    },
    features: {
      es: [
        'Jefes con sus propias arenas',
        'Cinemática de un culto con antorchas',
        'Nota con datos de los jefes que reaparece en el inventario',
        'Comerciantes y helicóptero, compatible con multijugador',
      ],
      en: [
        'Bosses with their own arenas',
        'Cutscene of a torch-bearing cult',
        'Lore note with boss info that reappears in the inventory',
        'Traders and a helicopter, multiplayer compatible',
      ],
    },
    images: [
      img('culto-del-juicio', 1, 'Póster del mod El Culto del Juicio', 'El Culto del Juicio mod poster'),
      img('culto-del-juicio', 2, 'Resumen de las funciones del mod', 'Overview of the mod features'),
    ],
  },
  {
    id: 'armero-blender',
    group: 'other',
    featured: false,
    stack: ['Python', 'Blender'],
    title: { es: 'Armero para Blender', en: 'Gunsmith for Blender' },
    summary: {
      es: 'Plugin de Blender para ensamblar armas completas con sus accesorios y colocarlas en escenas.',
      en: 'A Blender plugin to assemble complete weapons with their attachments and place them in scenes.',
    },
    features: {
      es: ['Montaje de miras, silenciadores y otros accesorios', 'Presets de armas propias', 'Importación de animaciones'],
      en: ['Fitting of sights, suppressors and other attachments', 'Custom weapon presets', 'Animation import'],
    },
    images: [img('armero-blender', 1, 'Panel de modding del plugin dentro de Blender', "The plugin's modding panel inside Blender")],
  },
  {
    id: 'agenda-docente',
    group: 'other',
    featured: false,
    stack: ['JavaScript', 'Chrome Extensions', 'Google Calendar API'],
    title: { es: 'Agenda Docente', en: 'Agenda Docente (Teacher Planner)' },
    summary: {
      es: 'Extensión de Chrome que reúne los horarios de varias plataformas de clases en un solo lugar.',
      en: 'A Chrome extension that brings schedules from several teaching platforms into one place.',
    },
    features: {
      es: ['Lee el horario de cada plataforma de clases', 'Vista unificada de la semana y de la próxima clase', 'Sincronización con Google Calendar'],
      en: ["Reads each teaching platform's schedule", 'Unified view of the week and the next lesson', 'Sync with Google Calendar'],
    },
    images: [img('agenda-docente', 1, 'Semana en Google Calendar con las clases que sincroniza Agenda Docente', 'A week in Google Calendar with the lessons Agenda Docente syncs')],
  },
  {
    id: 'plataforma-aduanera',
    group: 'other',
    featured: false,
    stack: ['Python', 'FastAPI', 'Django', 'Tailwind'],
    title: { es: 'Plataforma de consulta aduanera', en: 'Customs lookup platform' },
    summary: {
      es: 'Trabajo profesional: APIs y aplicación web para consultar datos aduanales y gestionar servicios portuarios.',
      en: 'Professional work: APIs and a web app to look up customs data and manage port services.',
    },
    features: {
      es: ['APIs RESTful con FastAPI', 'Interfaces web con Django y Tailwind', 'Gestión de servicios portuarios'],
      en: ['RESTful APIs with FastAPI', 'Web interfaces with Django and Tailwind', 'Port services management'],
    },
    images: [],
  },
];

/**
 * Las apps web se publican de a un commit por día: hasta su fecha, la demo está a medias.
 * Antes de `release` la tarjeta las muestra «en desarrollo» y sin enlaces; después, con todo.
 */
export function isReleased(project, now = new Date()) {
  if (!project.release) return true;
  return now >= new Date(`${project.release}T00:00:00`);
}
