// Efectos de sonido sintetizados por programa (sin archivos de terceros): devuelve un WAV mono 48 kHz.
const SR = 48000;

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
}

const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

const VOICES = {
  // Golpe grave con chasquido: el "impacto" del hook.
  hit: (t, r) => (Math.sin(2 * Math.PI * (55 + 90 * Math.exp(-t * 30)) * t) * 0.9 + r() * 0.35 * Math.exp(-t * 60)) * env(t, 0.003, 0.18),

  // Pop corto y brillante.
  pop: (t) => Math.sin(2 * Math.PI * (520 + 700 * Math.min(1, t * 25)) * t) * env(t, 0.002, 0.05) * 0.7,
  // Raspado (tachar "jugar").
  scratch: (t, r) => r() * 0.5 * env(t, 0.01, 0.12) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 38 * t)),
  // Tecleo.
  type: (t, r) => r() * 0.4 * Math.exp(-t * 180),
  // Tic del contador.
  tick: (t) => Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 120) * 0.35,
  // Sello: golpe seco + chasquido.
  stamp: (t, r) => (Math.sin(2 * Math.PI * (90 + 60 * Math.exp(-t * 25)) * t) * 0.9 + r() * 0.5 * Math.exp(-t * 45)) * env(t, 0.002, 0.14),
  // Campanita final (dos notas).
  chime: (t) => (Math.sin(2 * Math.PI * 1318.5 * t) * env(t, 0.004, 0.45) + Math.sin(2 * Math.PI * 1975.5 * Math.max(0, t - 0.12)) * (t > 0.12 ? env(t - 0.12, 0.004, 0.5) : 0)) * 0.35,
};

/**
 * Transición suave ("swoosh"): aire filtrado oscuro con entrada y salida redondeadas
 * + una nota grave que baja de tono. Más cómoda de escuchar que un whoosh brillante.
 */
function softSwoosh(r) {
  const D = 0.5;
  let a = 0, b = 0;
  return (t) => {
    const x = Math.min(1, t / D);
    const shape = Math.pow(Math.sin(Math.PI * x), 2); // campana sin bordes duros
    const k = 0.008 + 0.05 * shape;                    // filtro paso bajo de dos polos: sonido oscuro
    a += k * (r() - a);
    b += k * (a - b);
    const air = b * 2.2 * shape;
    const tone = Math.sin(2 * Math.PI * (420 - 140 * x) * t) * 0.12 * shape;
    return (air + tone) * 0.55;
  };
}

// Efectos del mundo 3D
VOICES.jump = (t) => Math.sin(2 * Math.PI * (300 + 900 * Math.min(1, t / 0.18)) * t) * env(t, 0.004, 0.12) * 0.45;
VOICES.splash = (() => (t, r) => { const k = Math.exp(-t * 7); return (r() * 0.6 * k + Math.sin(2 * Math.PI * (180 + 60 * Math.sin(t * 40)) * t) * 0.35 * k) * (t < 0.01 ? t / 0.01 : 1); })();
VOICES.rewind = (t) => Math.sin(2 * Math.PI * (900 - 700 * Math.min(1, t / 0.6)) * t + Math.sin(t * 60) * 2) * env(t, 0.02, 0.35) * 0.3;
VOICES.boing = (t) => Math.sin(2 * Math.PI * (220 + 160 * Math.sin(t * 38) * Math.exp(-t * 6)) * t) * env(t, 0.003, 0.35) * 0.6;
VOICES.fanfare = (t) => [523.25, 659.25, 783.99, 1046.5].reduce((acc, f, i) => {
  const lt = t - i * 0.11; if (lt < 0) return acc;
  return acc + (Math.sin(2 * Math.PI * f * lt) + 0.3 * Math.sin(4 * Math.PI * f * lt)) * env(lt, 0.005, i === 3 ? 0.5 : 0.14) * 0.22;
}, 0);

// Blip ascendente: una nota más aguda por cada etapa.
const blip = (step) => (t) => Math.sin(2 * Math.PI * [523.25, 659.25, 783.99, 1046.5][step % 4] * t) * env(t, 0.003, 0.11) * 0.55;

const LENGTH = { jump: 0.3, splash: 0.9, rewind: 0.8, boing: 0.9, fanfare: 1.4, hit: 0.6, whoosh: 0.5, pop: 0.18, scratch: 0.3, type: 0.04, tick: 0.05, stamp: 0.5, chime: 1.4, blip: 0.35 };

export function buildSfx(events, total) {
  const n = Math.ceil((total + 0.5) * SR);
  const buf = new Float32Array(n);
  events.forEach((ev, idx) => {
    const fn = ev.type === 'blip' ? blip(ev.step ?? 0) : VOICES[ev.type];
    if (!fn && ev.type !== 'whoosh') return;
    const r = rng(idx + 7);
    const start = Math.floor(ev.t * SR);
    const len = Math.floor((LENGTH[ev.type] ?? 0.3) * SR);
    // La transición guarda estado de filtro: creamos una nueva por evento.
    const voice = ev.type === 'whoosh' ? softSwoosh(r) : fn;
    for (let i = 0; i < len && start + i < n; i++) buf[start + i] += voice(i / SR, r);
  });
  // Límite suave para que nada sature
  for (let i = 0; i < n; i++) buf[i] = Math.tanh(buf[i] * 1.2) * 0.9;

  const data = Buffer.alloc(44 + n * 2);
  data.write('RIFF', 0); data.writeUInt32LE(36 + n * 2, 4); data.write('WAVE', 8);
  data.write('fmt ', 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
  data.write('data', 36); data.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i])) * 32767), 44 + i * 2);
  return data;
}

/**
 * Música de fondo sintetizada (sin derechos de terceros): loop alegre tipo videojuego, 120 BPM,
 * progresión C–G–Am–F con bajo, arpegio, bombo, palmas y platillos. Fundido de entrada y salida.
 */
export function buildMusic(total, { bpm = 120, gain = 0.5 } = {}) {
  const n = Math.ceil((total + 0.5) * SR);
  const buf = new Float32Array(n);
  const beat = 60 / bpm;
  const bar = beat * 4;
  const chords = [[261.63, 329.63, 392.0], [196.0, 246.94, 293.66], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63]];
  const tri = (ph) => 2 * Math.abs(2 * (ph - Math.floor(ph + 0.5))) - 1;
  const sq = (ph) => (ph % 1 < 0.5 ? 1 : -1);
  const r = rng(99);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const chord = chords[Math.floor(t / bar) % 4];
    const inBeat = t % beat;
    const sixteenth = beat / 4;
    const step = Math.floor(t / sixteenth);
    const inStep = t % sixteenth;
    // bajo: raíz una octava abajo, en corcheas
    const root = chord[0] / 2;
    const bass = tri(root * t) * env(t % (beat / 2), 0.004, 0.16) * 0.32;
    // arpegio suave (onda cuadrada filtrada)
    const note = chord[[0, 1, 2, 1][step % 4]] * 2;
    lp += 0.12 * (sq(note * t) - lp);
    const arp = lp * env(inStep, 0.002, 0.07) * 0.1;
    // bombo en cada tiempo
    const kick = Math.sin(2 * Math.PI * (50 + 110 * Math.exp(-inBeat * 35)) * inBeat) * Math.exp(-inBeat * 9) * 0.55;
    // palmas en 2 y 4
    const beatIdx = Math.floor(t / beat) % 4;
    const clap = beatIdx % 2 === 1 ? r() * Math.exp(-inBeat * 28) * 0.22 : 0;
    // platillo en los contratiempos
    const off = (t + beat / 2) % beat;
    const hat = r() * Math.exp(-off * 90) * 0.07;
    buf[i] = (bass + arp + kick + clap + hat) * gain;
  }
  // fundidos
  const fadeIn = Math.floor(0.6 * SR), fadeOut = Math.floor(1.4 * SR), end = Math.floor(total * SR);
  for (let i = 0; i < n; i++) {
    let g = 1;
    if (i < fadeIn) g = i / fadeIn;
    if (i > end - fadeOut) g = Math.max(0, (end - i) / fadeOut);
    buf[i] = Math.tanh(buf[i] * g * 1.1) * 0.9;
  }
  return toWav(buf);
}

function toWav(buf) {
  const n = buf.length;
  const data = Buffer.alloc(44 + n * 2);
  data.write('RIFF', 0); data.writeUInt32LE(36 + n * 2, 4); data.write('WAVE', 8);
  data.write('fmt ', 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
  data.write('data', 36); data.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i])) * 32767), 44 + i * 2);
  return data;
}
