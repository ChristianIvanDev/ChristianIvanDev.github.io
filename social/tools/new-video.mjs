// Crea un video nuevo a partir de la plantilla estándar y genera su guion para grabar.
// Uso:
//   node social/tools/new-video.mjs video-02            → crea social/video-02/ (script.json + guion-para-grabar.md)
//   node social/tools/new-video.mjs --guion social/video-02  → solo regenera el guion a partir de script.json
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export function guion(spec) {
  const total = spec.scenes.reduce((n, s) => n + s.say.split(/\s+/).length, 0);
  const seconds = Math.round(total / 2.6);
  return `# Guion para grabar · ${spec.title} (unos ${seconds} segundos)

Graba **todo en un solo archivo**, leyendo las ${spec.scenes.length} frases en orden.
**Deja 1 segundo de silencio entre frase y frase.** Si te equivocas, repite la frase entera: se usa la última toma.

- Cuarto silencioso, celular a un palmo de la boca, **grabadora de voz** (mejor que una nota de WhatsApp).
- Con energía, sonriendo un poco, como si le contaras algo emocionante a un papá.

---

${spec.scenes.map((s, i) => `${i + 1}. ${s.tone ? `**(${s.tone})** ` : ''}${s.say}`).join('\n\n')}
`;
}

const args = process.argv.slice(2);
if (args[0] === '--guion') {
  const dir = resolve(root, args[1]);
  const spec = JSON.parse(await readFile(join(dir, 'script.json'), 'utf8'));
  await writeFile(join(dir, 'guion-para-grabar.md'), guion(spec));
  console.log(`guion actualizado: ${join(dir, 'guion-para-grabar.md')}`);
} else if (args[0]) {
  const dir = resolve(root, 'social', args[0]);
  if (existsSync(dir)) throw new Error(`ya existe ${dir}`);
  await mkdir(dir, { recursive: true });
  const spec = JSON.parse(await readFile(join(root, 'social/template/script.json'), 'utf8'));
  await writeFile(join(dir, 'script.json'), JSON.stringify(spec, null, 2) + '\n');
  await writeFile(join(dir, 'guion-para-grabar.md'), guion(spec));
  console.log(`video nuevo en ${dir}: edita script.json y luego ejecuta "node social/tools/new-video.mjs --guion social/${args[0]}"`);
} else {
  console.log('Uso: node social/tools/new-video.mjs <nombre>   |   node social/tools/new-video.mjs --guion social/<nombre>');
}
