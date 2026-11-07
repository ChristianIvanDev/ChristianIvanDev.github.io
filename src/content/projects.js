import { asset } from '../paths.js';

const img = (id, n, es, en) => ({ src: asset(`assets/projects/${id}/${n}.webp`), alt: { es, en } });

export const PROJECTS = [
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
