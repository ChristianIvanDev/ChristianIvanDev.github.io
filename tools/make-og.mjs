// Genera public/og.png (1200×630), la imagen de vista previa al compartir el enlace. Uso: npm run og
import sharp from 'sharp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;

const photo = await sharp(resolve(root, '_material/foto/christian.jpg'))
  .extract({ left: 540, top: 125, width: 1100, height: 1375 })
  .resize({ width: 360, height: 450 })
  .composite([{ input: Buffer.from('<svg width="360" height="450"><rect width="360" height="450" rx="28" fill="#fff"/></svg>'), blend: 'dest-in' }])
  .png()
  .toBuffer();

const font = "'Segoe UI', 'Arial Black', Arial, sans-serif";
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#5b21b6"/>
  <rect x="56" y="74" width="680" height="490" rx="30" fill="#c98aa3"/>
  <rect x="56" y="64" width="680" height="490" rx="30" fill="#fbe1ea" stroke="#ffffff" stroke-width="3"/>
  <text x="96" y="132" font-family="${font}" font-size="24" font-weight="800" letter-spacing="3" fill="#5a2d9c">TUTOR PRIVADO · CLASES EN LÍNEA</text>
  <text font-family="${font}" font-size="60" font-weight="900" fill="#3b0f80">
    <tspan x="96" y="222">APRENDE A CREAR</tspan>
    <tspan x="96" y="300">JUEGOS, WEBS</tspan>
    <tspan x="96" y="378">Y DISEÑO</tspan>
  </text>
  <text x="96" y="446" font-family="${font}" font-size="30" font-weight="700" fill="#2c0a63">Christian Espinoza</text>
  <rect x="96" y="474" width="330" height="52" rx="26" fill="#5b21b6"/>
  <text x="122" y="509" font-family="${font}" font-size="24" font-weight="800" fill="#ffffff">+2,000 clases dadas</text>
  <rect x="792" y="98" width="366" height="456" rx="30" fill="#3b0f80"/>
  <rect x="1090" y="40" width="62" height="62" rx="14" fill="#f9c9da" transform="rotate(12 1121 71)"/>
  <rect x="760" y="520" width="54" height="54" rx="12" fill="#ffffff" transform="rotate(-10 787 547)"/>
  <circle cx="1150" cy="575" r="26" fill="#8b5cf6"/>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: photo, left: 795, top: 92 }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(resolve(root, 'public/og.png'));

console.log('public/og.png generado');
