// Genera public/cv/CV-Christian-Espinoza-{ES,EN}.pdf imprimiendo cv.html con Chrome o Edge sin interfaz.
// Uso: npm run build && npm run cv
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4179;

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No encontré Chrome ni Edge. Define CHROME_PATH con la ruta del navegador.');
  process.exit(1);
}

if (!existsSync(resolve(root, 'dist/cv.html'))) {
  console.error('Falta dist/cv.html: ejecuta primero "npm run build".');
  process.exit(1);
}

const preview = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'inherit'],
});

await new Promise((ok, fail) => {
  const timer = setTimeout(() => fail(new Error('vite preview no arrancó')), 15000);
  preview.stdout.on('data', (d) => {
    if (String(d).includes(String(PORT))) { clearTimeout(timer); ok(); }
  });
});

const outDir = resolve(root, 'public/cv');
mkdirSync(outDir, { recursive: true });

try {
  for (const lang of ['es', 'en']) {
    const out = resolve(outDir, `CV-Christian-Espinoza-${lang.toUpperCase()}.pdf`);
    execFileSync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--virtual-time-budget=5000',
      `--print-to-pdf=${out}`,
      `http://localhost:${PORT}/cv.html?lang=${lang}`,
    ], { stdio: 'ignore' });
    console.log(`CV ${lang.toUpperCase()} → ${out}`);
  }
} finally {
  preview.kill();
}
