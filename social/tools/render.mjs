// Renderiza un video vertical con el motor estándar (social/lib) a partir de script.json + la voz en off.
// Uso:
//   node social/tools/render.mjs social/video-01 --stills 0.8,4,7.5,12,19,21.6,25   (capturas sueltas para revisar)
//   node social/tools/render.mjs social/video-01 --cover                             (solo portada + post.md)
//   node social/tools/render.mjs social/video-01                                     (video completo + portada + post.md)
import http from 'node:http';
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, extname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import ffmpeg from 'ffmpeg-static';
import { buildSfx } from './sfx.mjs';
import { buildPost } from './post.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const videoDir = resolve(root, process.argv[2] || 'social/video-01');
const name = basename(videoDir);
const stillsArg = process.argv.indexOf('--stills');
const stills = stillsArg > 0 ? process.argv[stillsArg + 1].split(',').map(Number) : null;
const coverOnly = process.argv.includes('--cover');
const FPS = 30;
const W = 1080;
const H = 1920;

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean).find((p) => existsSync(p));

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css' };

// Servidor estático mínimo (los módulos ES no cargan desde file://)
const server = http.createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!path.startsWith(root)) throw new Error('fuera del proyecto');
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const port = server.address().port;

const build = join(videoDir, 'build');
const timeline = JSON.parse(await readFile(join(build, 'timeline.json'), 'utf8'));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  const spec = JSON.parse(await readFile(join(videoDir, 'script.json'), 'utf8'));
  page.on('pageerror', (e) => console.error('error en la página:', e.message));
  await page.goto(`http://127.0.0.1:${port}/social/lib/player.html`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.__ready === true');
  const { total, sfx } = await page.evaluate((sp, tl) => window.setup(sp, tl), spec, timeline);

  if (coverOnly) {
    const coverAt = spec.post?.coverAt ?? 1.0;
    await page.evaluate((x) => { window.renderAt(x); document.getElementById('caption').style.visibility = 'hidden'; }, coverAt);
    await mkdir(join(root, 'social/out'), { recursive: true });
    const cover = join(root, 'social/out', `${name}-portada.jpg`);
    await page.screenshot({ path: cover, type: 'jpeg', quality: 92 });
    if (spec.post) await writeFile(join(videoDir, 'post.md'), buildPost(spec, name));
    console.log(`portada: ${cover}`);
  } else if (stills) {
    const outDir = join(build, 'stills');
    await mkdir(outDir, { recursive: true });
    for (const t of stills) {
      await page.evaluate((x) => window.renderAt(x), t);
      await page.screenshot({ path: join(outDir, `t${t.toFixed(2)}.jpg`), type: 'jpeg', quality: 85 });
    }
    console.log(`capturas en ${outDir}`);
  } else {
    const frames = join(build, 'frames');
    await rm(frames, { recursive: true, force: true });
    await mkdir(frames, { recursive: true });
    const count = Math.ceil(total * FPS);
    for (let i = 0; i < count; i++) {
      await page.evaluate((x) => window.renderAt(x), i / FPS);
      await page.screenshot({ path: join(frames, `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
      if (i % 150 === 0) console.log(`fotograma ${i}/${count}`);
    }

    // Pista de efectos
    const sfxWav = join(build, 'sfx.wav');
    await writeFile(sfxWav, buildSfx(sfx, total));

    // Voz: cada escena en su instante
    const inputs = ['-framerate', String(FPS), '-i', join(frames, '%05d.jpg'), '-i', sfxWav];
    const filters = [];
    timeline.scenes.forEach((s, i) => {
      inputs.push('-i', join(build, s.audio));
      const ms = Math.round(s.start * 1000);
      filters.push(`[${i + 2}:a]adelay=${ms}|${ms},volume=1.0[v${i}]`);
    });
    const vo = timeline.scenes.map((_, i) => `[v${i}]`).join('');
    filters.push(`${vo}amix=inputs=${timeline.scenes.length}:normalize=0,asplit=2[vo][vokey]`);
    // Voz al frente; los efectos bajan un poco mientras habla (sidechain).
    filters.push('[1:a]volume=0.55[fx]');
    filters.push('[fx][vokey]sidechaincompress=threshold=0.05:ratio=4:attack=5:release=180[fxd]');
    filters.push('[vo][fxd]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=9[aout]');

    await mkdir(join(root, 'social/out'), { recursive: true });
    const out = join(root, 'social/out', `${name}.mp4`);
    execFileSync(ffmpeg, [
      '-y', ...inputs,
      '-filter_complex', filters.join(';'),
      '-map', '0:v', '-map', '[aout]',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
      '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
      '-t', String(total), '-movflags', '+faststart', out,
    ], { stdio: ['ignore', 'ignore', 'inherit'] });
    console.log(`video: ${out}`);

    // Portada (para Instagram/YouTube) y textos por red
    const coverAt = spec.post?.coverAt ?? 1.0;
    await page.evaluate((x) => { window.renderAt(x); document.getElementById('caption').style.visibility = 'hidden'; }, coverAt);
    const cover = join(root, 'social/out', `${name}-portada.jpg`);
    await page.screenshot({ path: cover, type: 'jpeg', quality: 92 });
    console.log(`portada: ${cover}`);
    if (spec.post) {
      await writeFile(join(videoDir, 'post.md'), buildPost(spec, name));
      console.log(`textos: ${join(videoDir, 'post.md')}`);
    }
  }
} finally {
  await browser.close();
  server.close();
}
