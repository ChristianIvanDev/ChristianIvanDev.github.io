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

// Blip ascendente: una nota más aguda por cada etapa.
const blip = (step) => (t) => Math.sin(2 * Math.PI * [523.25, 659.25, 783.99, 1046.5][step % 4] * t) * env(t, 0.003, 0.11) * 0.55;

const LENGTH = { hit: 0.6, whoosh: 0.5, pop: 0.18, scratch: 0.3, type: 0.04, tick: 0.05, stamp: 0.5, chime: 1.4, blip: 0.35 };

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
