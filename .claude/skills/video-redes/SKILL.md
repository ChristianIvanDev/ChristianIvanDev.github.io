---
name: video-redes
description: Videos verticales que anuncian las clases de Christian en su Página de Facebook, Instagram (Reel), TikTok y YouTube Shorts, con su estilo estándar (bloques morado/rosa, hook, subtítulos palabra a palabra, efectos sintetizados, su voz grabada). Usar al crear, cambiar, re-renderizar o preparar la publicación de un video para redes.
---

# Video para redes

Cada video sigue el **mismo molde**: 6 escenas (hook → giro → prueba → método → confianza → CTA), unos 25 s, 1080×1920 y la **voz grabada de Christian**. Si pide un video **sin voz**, haz la variante con efectos, música sintetizada y texto en pantalla. Se omiten los pasos 2 y 3 y los tiempos salen de `timeline_silent.mjs`. Para chicos que juegan Roblox, el CTA es "pídele a tus papás". La referencia de los tipos de escena, los campos y los comandos está en [`social/README.md`](../../../social/README.md). Léela antes de editar un `script.json`. En videos sin voz, cada uno lleva una canción distinta (`musicOptions.style`) y una escena 3D que no repita la del video anterior (la serpiente ya se usó mucho).

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

## Pautas de mejora (noviembre 2026)

Aplícalas en cada video nuevo:

- **Duración:** 12–15 s. Con 2 o 3 escenas de dato más el CTA basta; el video que se ve completo (o dos veces) es el que más alcance gana.
- **Primer segundo con movimiento:** el video arranca con acción (auto acelerando, moneda cayendo, número contando), nunca con la cámara quieta.
- **Dos públicos:**
  - *Niños* (TikTok, Instagram): temas que ya conocen (Roblox, Minecraft, GTA) y CTA "Toma tu clase gratis".
  - *Papás* (Facebook, YouTube): CTA tipo "Tu hijo puede crear esto en su primera clase".
- **Cara de Christian en 1 de cada 4 videos:** su voz grabada, unos 15 s (un dato o "esto aprende tu hijo en la clase 1").
- **Series con nombre**, por ejemplo "¿En qué se programó…?" o "Datos de Roblox".
- **Palabra clave en 1 de cada 3 videos:** "Comenta ROBLOX y te mando…", para abrir conversaciones privadas.
- **Fuentes:** todo dato lleva su fuente y fecha en pantalla. Nada inventado ni inflado.
- **Publicación en Metricool** (marca `7932409`, hora de Guatemala/CDMX): 3 publicaciones por video.
  - *Instagram Reel:* texto largo y primer comentario.
  - *TikTok + Threads:* texto corto; TikTok exige título.
  - *Facebook Reel + YouTube Short:* con el enlace de reserva; YouTube con "No es para niños".
  - *Videos:* Metricool los toma de una release pública de GitHub.
