// Genera social/<video>/post.md con el texto listo para cada red, a partir del bloque "post" de script.json.
// Uso: node social/tools/post.mjs social/video-01   (render.mjs también lo ejecuta al terminar el MP4)
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const SITE = 'https://christianivandev.github.io';
const BOOKING = 'https://calendar.app.google/kydiVgoRNTarLdCv6';
const GUARANTEE = '✅ La primera clase es gratis: si no te convence, no pagas nada.';

export function buildPost(spec, name) {
  const p = spec.post;
  if (!p) throw new Error('script.json no tiene bloque "post"');
  const tags = (list) => list.map((h) => `#${h}`).join(' ');
  const short = p.hashtags.slice(0, 5);

  return `# Publicación · ${spec.title}

**Archivos:**
- Video: \`social/out/${name}.mp4\`, vertical 1080×1920.
- Portada: \`social/out/${name}-portada.jpg\`.

**Dónde subirlo:** usa una sola subida en **Metricool** o **Buffer** y elige **Facebook (Página), Instagram (Reel), TikTok y YouTube (Short)**. También puedes hacer dos subidas: **Meta Business Suite** para Facebook + Instagram y **TikTok Studio** para TikTok.
**Cuándo:** de lunes a jueves de 19:00 a 21:00, o el sábado de 9:00 a 11:00.
**Etiqueta de IA:** no hace falta, porque la voz es tuya y la animación es gráfica.

---

## TikTok
Texto corto. El enlace no es clicable: va en tu biografía.

\`\`\`
${p.hook} ${GUARANTEE.replace('✅ ', '')} 📅 Agenda en el enlace de mi perfil. ${tags(short)}
\`\`\`

- **Portada:** elige el fotograma del segundo ${p.coverAt}, o sube la portada desde la computadora.
- **Música (opcional):** del catálogo de TikTok, al 10–15 %.
- **Primer comentario fijado:** ${p.comment}

## Instagram · Reel
Se publica a la vez en Facebook si marcas "Compartir en Facebook" (Meta Business Suite lo hace solo).

\`\`\`
${p.hook}

${p.body}

${GUARANTEE}

📅 Agenda su primera clase en el enlace de mi perfil.

${tags(p.hashtags)}
\`\`\`

- **Portada:** sube \`${name}-portada.jpg\` ("Editar portada" → "Añadir desde el carrusel"). En la cuadrícula se recorta a 4:5, y el título del hook queda centrado.
- **Primer comentario fijado:** ${p.comment}

## Página de Facebook · Reel
En Facebook el enlace **sí es clicable**: va directo en el texto.

\`\`\`
${p.hook}

${p.body}

${GUARANTEE}

📅 Agenda su primera clase aquí: ${BOOKING}
🌐 Mi portafolio: ${SITE}
\`\`\`

## YouTube · Short
El título es lo que buscan los padres. El vertical de menos de 60 s se publica como Short automáticamente.

**Título** (${p.youtubeTitle.length}/100):
\`\`\`
${p.youtubeTitle}
\`\`\`

**Descripción:**
\`\`\`
${p.body}

${GUARANTEE}
📅 Agenda su primera clase: ${BOOKING}
🌐 Portafolio: ${SITE}

${tags(short)} #shorts
\`\`\`

## Estado y canal de WhatsApp
\`\`\`
${p.hook} Agenda su primera clase 👉 ${BOOKING}
\`\`\`
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const dir = resolve(root, process.argv[2] || 'social/video-01');
  const spec = JSON.parse(await readFile(join(dir, 'script.json'), 'utf8'));
  await writeFile(join(dir, 'post.md'), buildPost(spec, basename(dir)));
  console.log(`post.md actualizado: ${join(dir, 'post.md')}`);
}
