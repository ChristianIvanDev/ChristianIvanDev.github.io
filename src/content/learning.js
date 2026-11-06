import { asset } from '../paths.js';

/** Etapas del recorrido "¿Exactamente qué aprenden y cómo?". Propuesta basada en lo que Christian enseña. */
export const STAGES = [
  {
    id: 'logic',
    title: { es: 'Lógica', en: 'Logic' },
    learns: {
      es: 'A pensar como programador: secuencias, condiciones y bucles, con retos visuales y juegos sencillos.',
      en: 'To think like a programmer: sequences, conditions and loops, with visual challenges and simple games.',
    },
    builds: { es: 'Sus primeros retos resueltos paso a paso.', en: 'Their first challenges, solved step by step.' },
  },
  {
    id: 'python',
    title: { es: 'Python', en: 'Python' },
    learns: {
      es: 'Variables, condiciones, bucles y objetos en Python, el mismo camino que seguí en el aula de bachillerato.',
      en: 'Variables, conditions, loops and objects in Python, the same path I followed in the high school classroom.',
    },
    builds: { es: 'Su primer videojuego con PyGame.', en: 'Their first video game with PyGame.' },
  },
  {
    id: 'roblox',
    title: { es: 'Roblox', en: 'Roblox' },
    learns: {
      es: 'A crear mundos y mecánicas con Luau en Roblox Studio: obbys, tiendas, puntuaciones y más.',
      en: 'To build worlds and mechanics with Luau in Roblox Studio: obbys, shops, scores and more.',
    },
    builds: { es: 'Su propio juego publicado en Roblox, como los que hice yo.', en: 'Their own game published on Roblox, like the ones I made.' },
    image: {
      src: asset('assets/projects/caza-de-monstruos/1.webp'),
      alt: { es: 'Partida de Caza de Monstruos, un juego de Roblox hecho por Christian', en: 'A match of Caza de Monstruos, a Roblox game made by Christian' },
    },
  },
  {
    id: 'web',
    title: { es: 'Webs', en: 'Websites' },
    learns: {
      es: 'HTML, CSS y JavaScript para diseñar y programar páginas que funcionan en cualquier pantalla.',
      en: 'HTML, CSS and JavaScript to design and code pages that work on any screen.',
    },
    builds: { es: 'Su primera página web publicada.', en: 'Their first published website.' },
  },
];
