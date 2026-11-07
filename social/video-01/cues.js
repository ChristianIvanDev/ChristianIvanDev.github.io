// Marcas de tiempo del video, calculadas a partir de la voz (timeline.json).
// Las usan la animación (scene.html) y la pista de efectos (sfx.mjs), así todo queda sincronizado.

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

export function cues(timeline) {
  const scene = Object.fromEntries(timeline.scenes.map((s) => [s.id, s]));
  const word = (id, text, nth = 0) => {
    const hits = scene[id].words.filter((w) => norm(w.w).startsWith(norm(text)));
    const hit = hits[nth] ?? hits[0];
    if (!hit) throw new Error(`palabra "${text}" no encontrada en ${id}`);
    return hit.t;
  };
  const end = (id) => scene[id].start + scene[id].duration;

  const c = {
    total: timeline.total,
    hook: { start: 0, hit: scene.hook.start + 0.02, end: scene.turn.start - 0.05 },
    turn: { start: scene.turn.start - 0.05, strike: word('turn', 'quites'), create: word('turn', 'crearlo'), end: scene.proof.start - 0.05 },
    proof: { start: scene.proof.start - 0.05, cardA: word('proof', 'juegos'), cardB: word('proof', 'hice'), code: word('proof', 'hice'), end: scene.method.start - 0.05 },
    method: {
      start: scene.method.start - 0.05,
      steps: [word('method', 'logica'), word('method', 'python'), word('method', 'roblox'), word('method', 'webs')],
      online: word('method', 'linea'),
      end: scene.trust.start - 0.05,
    },
    trust: { start: scene.trust.start - 0.05, count: word('trust', 'mas'), countEnd: word('trust', 'dadas'), stamp: word('trust', 'cobro'), end: scene.cta.start - 0.05 },
    cta: { start: scene.cta.start - 0.05, button: word('cta', 'enlace'), end: timeline.total },
  };

  c.sfx = [
    { t: 0.0, type: 'whoosh' },
    { t: c.hook.hit, type: 'hit' },
    { t: c.turn.start, type: 'whoosh' },
    { t: c.turn.strike, type: 'scratch' },
    { t: c.turn.create, type: 'pop' },
    { t: c.proof.start, type: 'whoosh' },
    { t: c.proof.cardA, type: 'pop' },
    { t: c.proof.cardB, type: 'pop' },
    ...Array.from({ length: 14 }, (_, i) => ({ t: c.proof.code + i * 0.085, type: 'type' })),
    { t: c.method.start, type: 'whoosh' },
    ...c.method.steps.map((t, i) => ({ t, type: 'blip', step: i })),
    { t: c.method.online, type: 'pop' },
    { t: c.trust.start, type: 'whoosh' },
    ...Array.from({ length: 16 }, (_, i) => ({ t: c.trust.count + (i / 16) * (c.trust.countEnd - c.trust.count), type: 'tick' })),
    { t: c.trust.stamp, type: 'stamp' },
    { t: c.cta.start, type: 'whoosh' },
    { t: c.cta.button, type: 'chime' },
  ];
  return c;
}
