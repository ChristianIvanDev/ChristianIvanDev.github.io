# Videos para redes · referencia del motor

El estilo estándar lo define el motor `social/lib/` (estilo, fondo de bloques, marca, subtítulos y efectos). Cada video es solo una carpeta `social/<nombre>/` con su `script.json` y la voz grabada.

## script.json

```json
{ "title": "…", "gapMs": 180, "scenes": [ { "id": "hook", "type": "hook", "say": "…", "tone": "…", …campos del tipo… } ] }
```

- **`say`:** lo que dice la voz; se usa para localizar cada toma en la grabación.
- **`tone`:** indicación de tono para el guion de grabación.
- **Campos `…At`:** el **inicio de una palabra** de esa escena (se compara sin tildes ni mayúsculas) que dispara el efecto. Si la palabra no está en la voz, el render falla con un mensaje que lista las palabras disponibles.
- **Imágenes:** rutas dentro de `public/` (por ejemplo `assets/projects/build-a-pipe/1.webp`).
- **Texto en pantalla:** admite `<br>` para partir líneas.

## Tipos de escena

| type | Para qué | Campos |
|---|---|---|
| `hook` | Primer segundo: imagen + frase gigante con golpe | `image`, `text` |
| `turn` | Giro: una palabra se tacha y entra otra | `from`, `to`, `strikeAt`, `toAt` |
| `proof` | Prueba: dos imágenes que entran + código que se escribe (opcional) | `images[2]`, `at[2]`, `code[]` (HTML con `<span class="k">` / `<span class="f">`), `codeAt` |
| `list` | Etapas numeradas (hasta 4) + insignia opcional | `items[]`, `at[]` (una palabra por ítem), `badge`, `badgeAt` |
| `counter` | Número que sube + sello opcional | `to`, `label`, `prefix` (por defecto `+`), `countAt`, `countEndAt`, `stamp`, `stampAt` |
| `cta` | Cierre: foto + botón que late + "Enlace en mi perfil" | `title`, `button`, `buttonAt`, `photo`, `link` |

Los efectos de sonido salen solos de cada tipo: transición suave al entrar en cada escena, golpe en el hook, tachado, pops, tecleo, notas por etapa, tics del contador, sello y campanita. Se definen en `social/tools/sfx.mjs`, sintetizados por programa y sin derechos de terceros.

## Comandos

```bash
npm run video:new -- video-02                                   # carpeta nueva desde social/template/
node social/tools/new-video.mjs --guion social/video-02         # regenera guion-para-grabar.md desde script.json
.venv-voice/Scripts/python social/tools/voice_recorded.py social/video-02 social/voz/video-02-raw.wav
node social/tools/render.mjs social/video-02 --stills 0.5,3,6   # capturas sueltas para revisar
node social/tools/render.mjs social/video-02                    # MP4 final → social/out/video-02.mp4
```

## Lo que no se ve en la configuración

- **Voz:** la voz es siempre la **grabación de Christian**. Probó voces sintéticas (edge-tts) y su voz clonada (OpenVoice), y no le gustaron. `voice.py` y `voice_clone.py` quedan solo como alternativa.
- **Audio:** las grabaciones de WhatsApp funcionan, pero la grabadora del celular suena más nítida. El audio final queda a unos -14 LUFS.
- **Subtítulos:** muestran lo que Christian **dijo de verdad**, no el guion. Las palabras que Whisper oye mal se corrigen en `FIXES` de `voice_recorded.py`.
- **Whisper:** corre en CPU, porque la versión para GPU necesita CUDA 12, que no está instalado.
- **Encuadre:** hay una zona segura para TikTok y Reels. Subtítulos a partir de y=1360, contenido principal entre y=250 y y=1290, y nada importante a menos de 170 px del borde derecho.
- **Música:** los videos salen sin música. Christian la añade en la app a un volumen del 10 al 15 %.
