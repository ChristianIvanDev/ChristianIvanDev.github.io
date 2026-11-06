import { test, expect } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const html = readFileSync(join(root, 'index.html'), 'utf8');
const meta = (attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]+)"`))?.[1];

test('etiquetas Open Graph con URLs absolutas', () => {
  expect(meta('property', 'og:title')).toBeTruthy();
  expect(meta('property', 'og:description')).toBeTruthy();
  expect(meta('property', 'og:type')).toBe('website');
  expect(meta('property', 'og:url')).toBe('https://christianivandev.github.io/');
  expect(meta('property', 'og:image')).toBe('https://christianivandev.github.io/og.png');
  expect(meta('name', 'twitter:card')).toBe('summary_large_image');
});

test('favicon SVG enlazado y con el morado de la marca', () => {
  expect(html).toContain('<link rel="icon" href="./favicon.svg" type="image/svg+xml"');
  const svg = join(root, 'public/favicon.svg');
  expect(existsSync(svg)).toBe(true);
  expect(readFileSync(svg, 'utf8')).toContain('#5b21b6');
});

test('imagen de vista previa de 1200×630 y menos de 300 KB', async () => {
  const file = join(root, 'public/og.png');
  expect(existsSync(file)).toBe(true);
  const { width, height } = await sharp(file).metadata();
  expect([width, height]).toEqual([1200, 630]);
  expect(statSync(file).size).toBeLessThan(300 * 1024);
});
