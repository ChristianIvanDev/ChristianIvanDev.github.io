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
// "Ñam": dos notas cortas que suben, al comer una manzana
VOICES.eat = (t) => (Math.sin(2 * Math.PI * 660 * t) * env(t, 0.002, 0.04) + Math.sin(2 * Math.PI * 990 * Math.max(0, t - 0.06)) * (t > 0.06 ? env(t - 0.06, 0.002, 0.07) : 0)) * 0.4;
VOICES.fanfare = (t) => [523.25, 659.25, 783.99, 1046.5].reduce((acc, f, i) => {
  const lt = t - i * 0.11; if (lt < 0) return acc;
  return acc + (Math.sin(2 * Math.PI * f * lt) + 0.3 * Math.sin(4 * Math.PI * f * lt)) * env(lt, 0.005, i === 3 ? 0.5 : 0.14) * 0.22;
}, 0);

// Blip ascendente: una nota más aguda por cada etapa.
const blip = (step) => (t) => Math.sin(2 * Math.PI * [523.25, 659.25, 783.99, 1046.5][step % 4] * t) * env(t, 0.003, 0.11) * 0.55;

const LENGTH = { eat: 0.25, jump: 0.3, splash: 0.9, rewind: 0.8, boing: 0.9, fanfare: 1.4, hit: 0.6, whoosh: 0.5, pop: 0.18, scratch: 0.3, type: 0.04, tick: 0.05, stamp: 0.5, chime: 1.4, blip: 0.35 };

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
 * Música de fondo sintetizada (sin derechos de terceros): loop alegre tipo videojuego.
 * `variant` cambia poco a poco la canción entre videos (tonalidad, progresión, arpegio, timbre, platillos)
 * sin perder el estilo. variant 0 = la canción original de los videos 02–06.
 */
const PROGRESSIONS = [
  [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]],   // I–V–vi–IV (original)
  [[-3, 0, 4], [-7, -3, 0], [0, 4, 7], [-5, -1, 2]],   // vi–IV–I–V
  [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]],   // I–vi–IV–V
  [[-7, -3, 0], [-5, -1, 2], [-8, -5, -1], [-3, 0, 4]], // IV–V–iii–vi
];
const ARPS = [[0, 1, 2, 1], [0, 2, 1, 2], [0, 1, 2, 0], [2, 1, 0, 1], [0, 2, 0, 1]];
const KEYS = [0, 2, -3, 5, -2, 3, -5, 1, 4, -1];

/**
 * Canciones distintas (no variantes): `style` = 'funk' | 'synthwave' | 'chiptune' | 'lofi'.
 * Cada una tiene su propio ritmo, acordes, bajo, timbre y una melodía fija que se repite cada 2 compases.
 */
const STYLES = {
  // funk: bajo sincopado con slap, acordes m7 en contratiempo, platillos de semicorchea
  funk: { level: 1.28, bpm: 112, key: -3, swing: 0, prog: [[0, 3, 7, 10], [5, 8, 12, 15], [3, 7, 10, 14], [-2, 2, 5, 9]],
    bassPat: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1], stabPat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    mel: [7, null, 10, 12, null, 10, 7, null, 5, null, 7, null, 3, null, null, null], lead: 'tri', kick: [0, 6, 10], snare: [4, 12], hats: 16 },
  // synthwave: acordes largos de sierra, bajo en corcheas, caja grande
  synthwave: { level: 1.7, bpm: 100, key: 2, swing: 0, prog: [[0, 3, 7], [-4, 0, 3], [-7, -4, 0], [-2, 2, 5]],
    bassPat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], pad: true,
    mel: [12, null, null, 15, null, null, 14, null, 12, null, 10, null, 7, null, null, null], lead: 'saw', kick: [0, 8], snare: [4, 12], hats: 8 },
  // chiptune: todo onda cuadrada, melodía rápida, ruido como batería
  chiptune: { level: 1.18, bpm: 150, key: 0, swing: 0, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]],
    bassPat: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1], arp: true,
    mel: [12, 14, 16, 19, 16, 14, 12, null, 11, 12, 14, 12, 7, null, 4, null], lead: 'square', kick: [0, 8], snare: [4, 12], hats: 8, chipDrums: true },
  // lofi: piano eléctrico suave, swing, batería tranquila y ruido de vinilo
  // trap: 808 largo con deslizamiento, caja en el tiempo 3, redobles de platillos y campana menor
  trap: { level: 0.86, bpm: 140, key: -5, swing: 0, prog: [[0, 3, 7], [0, 3, 7], [-4, 0, 3], [-2, 2, 5]],
    bassPat: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], trap808: true,
    mel: [12, null, 15, null, 14, null, 12, null, 10, null, null, 7, null, 10, null, null], lead: 'sine', kick: [0, 3, 10], snare: [8], hats: 16, rolls: true },
  lofi: { level: 1, bpm: 84, key: 5, swing: 0.18, prog: [[2, 5, 9, 12], [7, 11, 14, 17], [0, 4, 7, 11], [9, 12, 16, 19]],
    bassPat: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], epiano: true,
    mel: [16, null, null, 14, null, 12, null, null, 11, null, null, null, 9, null, null, null], lead: 'sine', kick: [0, 7, 10], snare: [4, 12], hats: 8, vinyl: true },
};

function buildSong(total, style, gain) {
  const S = STYLES[style];
  const n = Math.ceil((total + 0.5) * SR);
  const buf = new Float32Array(n);
  const beat = 60 / S.bpm, six = beat / 4, bar = beat * 4;
  const hz = (semi) => 261.63 * Math.pow(2, (semi + S.key) / 12);
  const osc = {
    sine: (ph) => Math.sin(2 * Math.PI * ph),
    tri: (ph) => 2 * Math.abs(2 * (ph - Math.floor(ph + 0.5))) - 1,
    square: (ph) => (ph % 1 < 0.5 ? 0.7 : -0.7),
    saw: (ph) => 2 * (ph % 1) - 1,
  };
  const r = rng(7 + style.length);
  let lpLead = 0, lpPad = 0;
  // posición dentro del paso de semicorchea, con swing en los pasos impares
  const stepAt = (t) => {
    const pair = Math.floor(t / (six * 2)), inPair = t - pair * six * 2, split = six * (1 + S.swing);
    return inPair < split ? { step: pair * 2, inStep: inPair } : { step: pair * 2 + 1, inStep: inPair - split };
  };
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const chord = S.prog[Math.floor(t / bar) % 4];
    const { step, inStep } = stepAt(t);
    const s16 = step % 16;
    let v = 0;
    // bajo
    if (S.trap808) {
      let k = s16; while (k > 0 && !S.bassPat[k]) k--;
      const dt = t - (Math.floor(t / bar) * bar + k * six), f = hz(chord[0] - 24) * (1 + 0.25 * Math.exp(-dt * 30));
      v += Math.tanh(Math.sin(2 * Math.PI * f * dt) * 1.6) * Math.exp(-dt * 1.6) * 0.42;
    } else if (S.bassPat[s16]) {
      const f = hz(chord[0] - 24) * (style === 'funk' && s16 % 4 === 3 ? 2 : 1);
      const tone = style === 'chiptune' ? osc.square(f * t) * 0.6 : style === 'synthwave' ? osc.saw(f * t) * 0.5 : osc.sine(f * t) + osc.tri(f * t) * 0.3;
      v += tone * env(inStep, 0.003, style === 'lofi' ? 0.35 : style === 'funk' ? 0.09 : 0.12) * 0.34;
    }
    // acordes
    if (S.pad) {
      let pad = 0; chord.forEach((c) => { pad += osc.saw(hz(c) * t * 1.003) + osc.saw(hz(c) * t * 0.997); });
      lpPad += 0.03 * (pad - lpPad);
      v += lpPad * 0.045 * (0.75 + 0.25 * Math.sin(2 * Math.PI * t / bar));
    } else if (S.epiano && s16 % 8 === 0) {
      chord.forEach((c, k) => { v += osc.sine(hz(c) * t) * env(inStep + (s16 % 16 === 8 ? 0 : 0), 0.01, 0.9) * 0.05 * (1 - k * 0.1); });
    } else if (S.stabPat && S.stabPat[s16]) {
      chord.forEach((c) => { v += osc.tri(hz(c + 12) * t) * env(inStep, 0.002, 0.06) * 0.06; });
    } else if (S.arp) {
      v += osc.square(hz(chord[s16 % 3] + 12) * t) * env(inStep, 0.001, 0.05) * 0.05;
    }
    // melodía (2 compases: el segundo repite el primero una octava abajo en lofi y synthwave)
    const mStep = Math.floor(t / (beat / 2)) % 16, mNote = S.mel[mStep];
    if (mNote !== null && t > bar * 2) {
      const inNote = t % (beat / 2);
      const f = hz(mNote) * (S.lead === 'square' ? 2 : 1);
      const vib = 1 + (S.lead === 'saw' || S.lead === 'sine' ? Math.sin(t * 30) * 0.004 : 0);
      lpLead += 0.2 * (osc[S.lead](f * vib * t) - lpLead);
      v += lpLead * env(inNote, 0.006, S.lead === 'square' ? 0.12 : 0.3) * 0.085;
    }
    // batería
    const kickOn = S.kick.includes(s16), snareOn = S.snare.includes(s16);
    if (kickOn) v += Math.sin(2 * Math.PI * (S.chipDrums ? 80 : 48 + 100 * Math.exp(-inStep * 35)) * inStep) * Math.exp(-inStep * (style === 'lofi' ? 12 : 9)) * (style === 'lofi' ? 0.4 : 0.55);
    if (snareOn) v += r() * Math.exp(-inStep * (style === 'synthwave' ? 9 : 22)) * (style === 'lofi' ? 0.1 : 0.2);
    if (S.rolls && (s16 === 14 || s16 === 15) && Math.floor(t / bar) % 2 === 1) v += r() * Math.exp(-(inStep % (six / 3)) * 160) * 0.05;
    else if (S.hats === 16 || s16 % 2 === 0) v += r() * Math.exp(-inStep * 110) * (style === 'funk' ? 0.05 : 0.04);
    if (S.vinyl) v += (r() - 0.5) * 0.008 + (r() < 0.0004 ? 0.12 : 0);
    buf[i] = v * gain * S.level;
  }
  const fadeIn = Math.floor(0.6 * SR), fadeOut = Math.floor(1.4 * SR), end = Math.floor(total * SR);
  for (let i = 0; i < n; i++) {
    let g = 1;
    if (i < fadeIn) g = i / fadeIn;
    if (i > end - fadeOut) g = Math.max(0, (end - i) / fadeOut);
    buf[i] = Math.tanh(buf[i] * g * 1.1) * 0.9;
  }
  return toWav(buf);
}

export function buildMusic(total, { bpm = 120, gain = 0.5, variant = 0, style } = {}) {
  if (style && STYLES[style]) return buildSong(total, style, gain);
  const n = Math.ceil((total + 0.5) * SR);
  const buf = new Float32Array(n);
  const beat = 60 / bpm;
  const bar = beat * 4;
  const shift = KEYS[variant % KEYS.length];
  const prog = PROGRESSIONS[variant % PROGRESSIONS.length];
  const arpPattern = ARPS[variant % ARPS.length];
  const squareMix = variant === 0 ? 1 : 0.35 + ((variant * 37) % 60) / 100;   // más cuadrada o más suave
  const sixteenthHats = variant % 3 === 2;                                       // platillos más movidos
  const hz = (semi) => 261.63 * Math.pow(2, (semi + shift) / 12);
  const chords = prog.map((c) => c.map(hz));
  const tri = (ph) => 2 * Math.abs(2 * (ph - Math.floor(ph + 0.5))) - 1;
  const sq = (ph) => (ph % 1 < 0.5 ? 1 : -1);
  const r = rng(99 + variant);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const chord = chords[Math.floor(t / bar) % 4];
    const inBeat = t % beat;
    const sixteenth = beat / 4;
    const step = Math.floor(t / sixteenth);
    const inStep = t % sixteenth;
    const root = chord[0] / 2;
    const bass = tri(root * t) * env(t % (beat / 2), 0.004, 0.16) * 0.32;
    const note = chord[arpPattern[step % 4]] * 2;
    const wave = sq(note * t) * squareMix + tri(note * t) * (1 - squareMix);
    lp += 0.12 * (wave - lp);
    const arp = lp * env(inStep, 0.002, 0.07) * 0.1;
    const kick = Math.sin(2 * Math.PI * (50 + 110 * Math.exp(-inBeat * 35)) * inBeat) * Math.exp(-inBeat * 9) * 0.55;
    const beatIdx = Math.floor(t / beat) % 4;
    const clap = beatIdx % 2 === 1 ? r() * Math.exp(-inBeat * 28) * 0.22 : 0;
    const off = sixteenthHats ? t % sixteenth : (t + beat / 2) % beat;
    const hat = r() * Math.exp(-off * 90) * (sixteenthHats ? 0.05 : 0.07);
    buf[i] = (bass + arp + kick + clap + hat) * gain;
  }
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
