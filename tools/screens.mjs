// Capturas de QA: node tools/screens.mjs [baseUrl]  →  .superpowers/screens/*.png
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://localhost:5173/';
const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean).find((p) => existsSync(p));

const out = resolve(root, '.superpowers/screens');
mkdirSync(out, { recursive: true });

const cases = [
  ['teacher-es', '', 1440, 6200],
  ['developer-es', '?view=developer', 1440, 4200],
  ['teacher-en', '?lang=en', 768, 6400],
  ['teacher-es-360', '', 360, 9000],
  ['developer-en-360', '?view=developer&lang=en', 360, 9000],
];

for (const [name, q, w, h] of cases.filter(([n]) => !process.argv[3] || n.includes(process.argv[3]))) {
  const file = resolve(out, `${name}.png`);
  execFileSync(browser, [
    '--headless=new', '--hide-scrollbars', '--force-prefers-reduced-motion',
    `--window-size=${w},${h}`, '--virtual-time-budget=6000',
    `--screenshot=${file}`, `${base}${q}`,
  ], { stdio: 'ignore' });
  console.log(file);
}
