---
name: video-redes
description: Videos verticales que anuncian las clases de Christian en su Página de Facebook, Instagram (Reel), TikTok y YouTube Shorts, con su estilo estándar (bloques morado/rosa, hook, subtítulos palabra a palabra, efectos sintetizados, su voz grabada). Usar al crear, cambiar, re-renderizar o preparar la publicación de un video para redes.
---

# Video para redes

Cada video sigue el **mismo molde**: 6 escenas (hook → giro → prueba → método → confianza → CTA), unos 25 s, 1080×1920 y la **voz grabada de Christian**. Si pide un video **sin voz**, haz la variante con efectos, música sintetizada y texto en pantalla. Se omiten los pasos 2 y 3 y los tiempos salen de `timeline_silent.mjs`. Para chicos que juegan Roblox, el CTA es "pídele a tus papás". La referencia de los tipos de escena, los campos y los comandos está en [`social/README.md`](../../../social/README.md). Léela antes de editar un `script.json`.

## Pasos

1. **Guion.** Crea la carpeta con `npm run video:new -- video-NN` y escribe su `script.json`.
   - **Hook:** una pregunta o afirmación que un padre entienda en menos de 2 s, con la imagen más llamativa.
   - **Contenido:** solo hechos reales del portafolio (`docs/superpowers/specs/`). Sin precios, edades ni cifras nuevas, y sin mencionar IA.
   - **Cierre:** siempre con la garantía ("La primera clase es gratis: si no te convence, no pagas nada") y "el enlace de mi perfil". Precios: solo los de `src/content/pricing.js`.
   - **Bloque `post`:** hook, cuerpo, título de YouTube, hashtags, comentario fijado y `coverAt`.
   - **Hecho cuando:** Christian aprueba el guion en el chat.
2. **Grabación.** Regenera `guion-para-grabar.md` (`new-video.mjs --guion`), pásaselo y espera su audio. Cópialo a `social/voz/video-NN-raw.<ext>`.
3. **Voz.** Ejecuta `voice_recorded.py`. **Hecho cuando** cada escena aparece con la toma correcta y su texto real. Si Whisper oyó mal una palabra, corrígela en `FIXES`. Si una palabra `…At` no coincide con lo que dijo, ajústala en `script.json`.
4. **Revisión visual.** Usa `render.mjs --stills` en 6–8 momentos y júntalos en una hoja. **Hecho cuando** ningún texto se corta ni se tapa, los subtítulos están en la zona segura y cada efecto cae en su palabra.
5. **Render.** Ejecuta `render.mjs` sin `--stills`. Genera el MP4, la portada y `post.md`.
   - **Hecho cuando:** existen `social/out/video-NN.mp4` y `video-NN-portada.jpg`, el audio mide cerca de -14 LUFS (`ebur128` con el ffmpeg de `node_modules/ffmpeg-static`) y la portada no tiene subtítulo.
6. **Entrega.** Envía a Christian el MP4, la portada y `post.md` con `SendUserFile`, y recuérdale la subida única en Metricool a Facebook, Instagram, TikTok y YouTube. Él publica desde sus cuentas: tú no inicias sesión en ellas.

Los comandos que bajan modelos o usan la red (`pip`, Whisper la primera vez, Google Fonts al renderizar) necesitan salir del sandbox.
