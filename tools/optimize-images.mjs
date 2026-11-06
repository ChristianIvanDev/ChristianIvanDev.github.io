// Recorta, redimensiona y convierte a WebP las imágenes listadas en image-sources.json.
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(await readFile(resolve(root, 'tools/image-sources.json'), 'utf8'));

const MAX_WIDTH = 1600;

for (const { from, to, crop, width, blur } of sources) {
  const out = resolve(root, to);
  await mkdir(dirname(out), { recursive: true });
  let img = sharp(resolve(root, from));
  if (crop) img = img.extract(crop);
  img = img.resize({ width: width ?? MAX_WIDTH, withoutEnlargement: true });
  // Desenfoque para que no se lean textos privados (p. ej., enlaces internos de una plataforma).
  if (blur) img = img.blur(blur);
  const info = await img.webp({ quality: 78 }).toFile(out);
  console.log(`${to}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
