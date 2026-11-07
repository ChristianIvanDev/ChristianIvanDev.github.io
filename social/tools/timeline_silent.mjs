// Para videos sin voz: crea build/timeline.json con la duración fija de cada escena (campo "duration" en segundos).
// Uso: node social/tools/timeline_silent.mjs social/video-02
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export function silentTimeline(spec) {
  let cursor = 0;
  const scenes = spec.scenes.map((s) => {
    if (typeof s.duration !== 'number') throw new Error(`la escena ${s.id} necesita "duration" (segundos) en un video sin voz`);
    const scene = { id: s.id, say: '', start: +cursor.toFixed(3), duration: s.duration, words: [], audio: null };
    cursor += s.duration;
    return scene;
  });
  return { total: +(cursor + 0.6).toFixed(3), silent: true, scenes };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const dir = resolve(root, process.argv[2]);
  const spec = JSON.parse(await readFile(join(dir, 'script.json'), 'utf8'));
  await mkdir(join(dir, 'build'), { recursive: true });
  const tl = silentTimeline(spec);
  await writeFile(join(dir, 'build', 'timeline.json'), JSON.stringify(tl, null, 2));
  console.log(`timeline sin voz: ${tl.total}s, ${tl.scenes.length} escenas`);
}
