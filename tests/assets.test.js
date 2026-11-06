import { test, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECTS } from '../src/content/projects.js';

const pub = (src) => join(process.cwd(), 'public', src);

test('cada imagen de proyecto existe y pesa menos de 400 KB', () => {
  for (const p of PROJECTS) {
    for (const img of p.images) {
      const file = pub(img.src);
      expect(existsSync(file), img.src).toBe(true);
      expect(statSync(file).size, img.src).toBeLessThan(400 * 1024);
    }
  }
});

test('la foto de Christian existe optimizada', () => {
  const file = pub('/assets/photo/christian.webp');
  expect(existsSync(file)).toBe(true);
  expect(statSync(file).size).toBeLessThan(400 * 1024);
});
