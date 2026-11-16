import { test, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { REVIEWS, SUPERPROF_RATING, SOCIAL, VIDEOS } from '../src/content/social.js';
import { renderReviews, renderVideos, socialLinks } from '../src/render/proof.js';
import { clickEventName, initAnalytics } from '../src/analytics.js';

test('las reseñas son reales: nombre, texto y tipo válido', () => {
  expect(REVIEWS.length).toBe(SUPERPROF_RATING.count);
  for (const r of REVIEWS) {
    expect(r.name).toBeTruthy();
    expect(r.text.length).toBeGreaterThan(40);
    expect(['parent', 'external']).toContain(r.kind);
  }
});

test('la sección de reseñas enlaza a Superprof para verificarlas', () => {
  const el = renderReviews('es');
  expect(el.querySelectorAll('.review')).toHaveLength(REVIEWS.length);
  expect(el.querySelector('a[href*="superprof.mx"]')).not.toBeNull();
  expect(el.textContent).toContain('recomendación externa');
});

test('los videos existen, son ligeros y no se descargan hasta pulsar play', () => {
  for (const v of VIDEOS) {
    for (const ext of ['mp4', 'jpg']) {
      const file = join(process.cwd(), 'public/assets/videos', `${v.id}.${ext}`);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThan(1.5 * 1024 * 1024);
    }
  }
  const videos = renderVideos('es').querySelectorAll('video');
  expect(videos).toHaveLength(VIDEOS.length);
  videos.forEach((v) => expect(v.getAttribute('preload')).toBe('none'));
});

test('las redes abren en otra pestaña y solo aparecen las que tienen URL', () => {
  const links = socialLinks('es').querySelectorAll('a');
  expect(links).toHaveLength(SOCIAL.length);
  links.forEach((a) => { expect(a.target).toBe('_blank'); expect(a.href).toMatch(/^https:\/\//); });
});

test('la analítica está apagada sin código y nombra los clics importantes', () => {
  expect(initAnalytics(document, '')).toBe(false);
  const a = document.createElement('a');
  a.href = 'https://calendar.app.google/x';
  expect(clickEventName(a)).toBe('clic-agendar');
  a.href = 'https://wa.me/52';
  expect(clickEventName(a)).toBe('clic-whatsapp');
});
