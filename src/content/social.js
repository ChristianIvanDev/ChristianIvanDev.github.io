// Prueba social de la vista Profesor: reseñas reales, redes y videos.
// Las reseñas se copian tal cual de Superprof (no se editan ni se inventan).

export const SUPERPROF_RATING = { score: 5, count: 4, checked: '2026-11-16' };

/**
 * `kind`: 'parent' = opinión verificada de un papá/mamá en Superprof;
 * 'external' = "Recomendación externa" (así la etiqueta Superprof).
 */
export const REVIEWS = [
  { name: 'Guadalupe', kind: 'parent', stars: 5,
    text: '¡Perfecto! Excelente profesor, explica muy bien, muy comprensivo, paciente y organizado, mi hijo está muy contento.' },
  { name: 'Jesus Angel', kind: 'external',
    text: 'Christian tiene una forma única de enseñar programación: convierte cada clase en una experiencia divertida y dinámica. Sus alumnos no solo aprenden a programar, sino que disfrutan el proceso creando juegos y proyectos interesantes.' },
  { name: 'Luis', kind: 'external',
    text: 'Tiene la habilidad de explicar conceptos complejos de forma clara y práctica, siempre con paciencia y entusiasmo. Sus clases son dinámicas, enfocadas en proyectos reales, y logra que programar sea interesante y divertido.' },
  { name: 'Karen Marlene', kind: 'external',
    text: 'Christian es un profesor muy comprometido y paciente. Siempre está dispuesto a resolver cualquier duda. Lo recomiendo totalmente a cualquier estudiante que busque un profesor confiable y dedicado.' },
];

/** Redes sociales. Un valor vacío no se muestra (TikTok, hasta tener el usuario). */
export const SOCIAL = [
  { id: 'tiktok', label: 'TikTok', href: '' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/elchrisalv/' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCpt3Kw1nQLnPrrnpU19Vd8g' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/1496782913509371' },
  { id: 'threads', label: 'Threads', href: 'https://www.threads.net/@elchrisalv' },
].filter((s) => s.href);

/** Videos cortos (versión ligera, 540×960) que se muestran en la web. */
export const VIDEOS = [
  { id: 'video-01', titleKey: 'videos.v01' },
  { id: 'video-16', titleKey: 'videos.v16' },
  { id: 'video-14', titleKey: 'videos.v14' },
];
