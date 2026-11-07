// Motor de los videos para redes. Cada escena de script.json tiene un `type` y sus campos;
// las palabras `...At` son palabras de la voz que disparan cada efecto (se buscan en timeline.json).
//
// Tipos: hook · turn · proof · list · counter · cta   (ver social/README.md)

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, d) => clamp((t - a) / d);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeBack = (x) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const set = (el, { o = 1, x = 0, y = 0, s = 1, r = 0 } = {}) => {
  el.style.opacity = o;
  el.style.transform = `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`;
};
const popIn = (t, a, d = 0.32) => { const p = prog(t, a, d); return { o: clamp(p * 3), s: 0.6 + 0.4 * easeBack(p) }; };
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const el = (tag, cls, html = '') => { const n = document.createElement(tag); if (cls) n.className = cls; n.innerHTML = html; return n; };

const ASSET = (p) => (p.startsWith('http') || p.startsWith('/') ? p : `/public/${p}`);

function stripLen(html) { return html.replace(/<[^>]+>/g, '').length; }
function typed(html, n) {
  let out = '', count = 0;
  for (let i = 0; i < html.length && count < n; i++) {
    if (html[i] === '<') { const j = html.indexOf('>', i); out += html.slice(i, j + 1); i = j; continue; }
    out += html[i]; count++;
  }
  const opens = (out.match(/<span/g) || []).length - (out.match(/<\/span>/g) || []).length;
  return out + '</span>'.repeat(Math.max(0, opens));
}

/* ---------- Tipos de escena: build(spec) → nodos; cues(spec, word) → tiempos; render(t, c, nodes); sfx(c) ---------- */

const TYPES = {
  // Escena 3D: el mundo de fondo hace `action` (fall · freeze · launch · orbit · wave); encima, textos grandes y código.
  world: {
    build(s) {
      const headline = s.headline ? el('div', 'abs display world-headline', s.headline) : null;
      const sub = s.sub ? el('div', 'abs display world-sub', s.sub) : null;
      const code = s.code ? el('div', 'code world-code') : null;
      return { root: [headline, sub, code].filter(Boolean), headline, sub, code, lines: s.code || [] };
    },
    cues: (s, w) => ({ action: s.action, headline: w(s.headlineAt ?? 0), sub: s.sub ? w(s.subAt ?? 0) : null, code: s.code ? w(s.codeAt ?? 0) : null }),
    render(t, c, n) {
      if (n.headline) { const p = popIn(t, c.headline, 0.32); set(n.headline, { ...p, r: Math.sin(t * 3) * 1.5 }); }
      if (n.sub) set(n.sub, popIn(t, c.sub, 0.34));
      if (n.code) {
        const total = n.lines.reduce((k, l) => k + stripLen(l), 0);
        let left = Math.floor(total * prog(t, c.code, 1.4));
        const shown = n.lines.map((l) => { const len = stripLen(l); const take = Math.min(len, Math.max(0, left)); left -= len; return typed(l, take); });
        n.code.innerHTML = shown.join('\n') + (Math.floor(t * 3) % 2 ? '▌' : ' ');
        set(n.code, { o: clamp((t - c.code + 0.2) * 6), y: 40 * (1 - easeOut(prog(t, c.code - 0.2, 0.3))) });
      }
    },
    sfx(c) {
      const at = (dt, type, extra = {}) => ({ t: c.start + dt, type, ...extra });
      const base = { fall: [at(0, 'whoosh'), at(1.1, 'jump'), at(2.05, 'splash'), at(2.1, 'hit')],
        freeze: [at(0.1, 'rewind'), at(2.8, 'pop')],
        launch: [at(0.3, 'boing'), at(0.45, 'whoosh'), at(2.95, 'stamp'), at(3.0, 'fanfare')],
        orbit: [at(0, 'whoosh')], wave: [at(0, 'whoosh')] }[c.action] || [];
      const typing = c.code == null ? [] : Array.from({ length: 16 }, (_, i) => ({ t: c.code + i * 0.085, type: 'type' }));
      const head = c.headline == null ? [] : [{ t: c.headline, type: 'pop' }];
      return [...base, ...typing, ...head];
    },
  },

  hook: {
    build(s) {
      const shot = el('div', 'card hook-shot', `<img src="${ASSET(s.image)}">`);
      const text = el('div', 'abs display hook-text', s.text);
      return { root: [shot, text], shot, text };
    },
    cues: (s, w, sc) => ({ hit: sc.start + 0.02 }),
    render(t, c, n) {
      const hz = prog(t, c.start, 0.5);
      const shake = t > c.hit && t < c.hit + 0.25 ? Math.sin(t * 90) * 14 * (1 - (t - c.hit) / 0.25) : 0;
      set(n.shot, { s: 1.25 - 0.25 * easeOut(hz), x: shake, r: -2 + 2 * easeOut(hz), o: clamp(hz * 4) });
      set(n.text, { ...popIn(t, c.start + 0.04, 0.32), y: shake * 0.4 });
    },
    sfx: (c) => [{ t: c.start, type: 'whoosh' }, { t: c.hit, type: 'hit' }],
  },

  turn: {
    build(s) {
      const from = el('div', 'abs display turn-from', s.from);
      const strike = el('div', 'abs turn-strike');
      const to = el('div', 'card pinkcard display turn-to', s.to);
      return { root: [from, strike, to], from, strike, to };
    },
    cues: (s, w) => ({ strike: w(s.strikeAt), to: w(s.toAt) }),
    render(t, c, n) {
      set(n.from, { ...popIn(t, c.start, 0.3), o: t > c.to ? 0.35 : clamp((t - c.start) * 6) });
      n.strike.style.transform = `scaleX(${easeOut(prog(t, c.strike, 0.22))}) rotate(-4deg)`;
      n.strike.style.opacity = t > c.strike ? 1 : 0;
      set(n.to, { ...popIn(t, c.to, 0.36), r: -3 + 3 * easeOut(prog(t, c.to, 0.4)) });
    },
    sfx: (c) => [{ t: c.start, type: 'whoosh' }, { t: c.strike, type: 'scratch' }, { t: c.to, type: 'pop' }],
  },

  proof: {
    build(s) {
      const a = el('div', 'card proof-a', `<img src="${ASSET(s.images[0])}">`);
      const b = el('div', 'card proof-b', `<img src="${ASSET(s.images[1])}">`);
      const code = el('div', 'code');
      const caption = s.caption ? el('div', 'abs display world-sub proof-caption', s.caption) : null;
      return { root: [a, b, s.code ? code : null, caption].filter(Boolean), a, b, code, caption, lines: s.code || [] };
    },
    cues: (s, w) => ({ a: w(s.at[0]), b: w(s.at[1]), code: s.codeAt != null ? w(s.codeAt) : null, caption: s.caption ? w(s.captionAt ?? 0) : null }),
    render(t, c, n) {
      const pa = easeOut(prog(t, c.a - 0.1, 0.4));
      const pb = easeOut(prog(t, c.b - 0.1, 0.4));
      set(n.a, { o: pa, x: -700 * (1 - pa), r: -5 * pa });
      set(n.b, { o: pb, x: 700 * (1 - pb), r: 4 * pb });
      if (n.caption) set(n.caption, popIn(t, c.caption, 0.34));
      if (!n.lines.length) return;
      const total = n.lines.reduce((k, l) => k + stripLen(l), 0);
      let left = Math.floor(total * prog(t, c.code, 1.3));
      const shown = n.lines.map((l) => { const len = stripLen(l); const take = Math.min(len, Math.max(0, left)); left -= len; return typed(l, take); });
      n.code.innerHTML = shown.join('\n') + (Math.floor(t * 3) % 2 ? '▌' : ' ');
      set(n.code, { o: clamp((t - c.code + 0.2) * 6), y: 30 * (1 - easeOut(prog(t, c.code - 0.2, 0.3))) });
    },
    sfx: (c) => [
      { t: c.start, type: 'whoosh' }, { t: c.a, type: 'pop' }, { t: c.b, type: 'pop' },
      ...(c.code == null ? [] : Array.from({ length: 14 }, (_, i) => ({ t: c.code + i * 0.085, type: 'type' }))),
    ],
  },

  list: {
    build(s) {
      const items = s.items.map((label, i) => {
        const chip = el('div', 'chip', `<span class="n">${i + 1}</span>${label}`);
        chip.style.top = `${300 + i * 190}px`;
        return chip;
      });
      const badge = s.badge ? el('div', 'abs display badge', s.badge) : null;
      if (badge) badge.style.top = `${300 + s.items.length * 190 + 15}px`;
      return { root: [...items, badge].filter(Boolean), items, badge };
    },
    cues: (s, w) => ({ steps: s.at.map((x) => w(x)), badge: s.badgeAt ? w(s.badgeAt) : null }),
    render(t, c, n) {
      c.steps.forEach((st, i) => {
        const p = easeBack(prog(t, st - 0.05, 0.34));
        set(n.items[i], { o: clamp(prog(t, st - 0.05, 0.12)), x: -500 * (1 - clamp(p, 0, 1.2)), s: 0.9 + 0.1 * clamp(p, 0, 1) });
      });
      if (n.badge) set(n.badge, popIn(t, c.badge - 0.05, 0.34));
    },
    sfx: (c) => [{ t: c.start, type: 'whoosh' }, ...c.steps.map((t, i) => ({ t, type: 'blip', step: i })), ...(c.badge == null ? [] : [{ t: c.badge, type: 'pop' }])],
  },

  counter: {
    build(s) {
      const num = el('div', 'abs display count-num', `${s.prefix ?? '+'}0`);
      const label = el('div', 'abs display count-label', s.label);
      const stamp = s.stamp ? el('div', 'stamp', s.stamp) : null;
      return { root: [num, label, stamp].filter(Boolean), num, label, stamp, to: s.to, prefix: s.prefix ?? '+' };
    },
    cues: (s, w) => ({ count: w(s.countAt), countEnd: w(s.countEndAt), stamp: s.stampAt ? w(s.stampAt) : null }),
    render(t, c, n) {
      const cp = easeOut(prog(t, c.count, Math.max(0.3, c.countEnd - c.count)));
      n.num.textContent = n.prefix + Math.round(n.to * cp).toLocaleString('en-US');
      const bump = t > c.countEnd && t < c.countEnd + 0.2 ? 1.06 : 1;
      set(n.num, { o: popIn(t, c.start, 0.3).o, s: (0.6 + 0.4 * easeBack(prog(t, c.start, 0.3))) * bump });
      set(n.label, { o: clamp(prog(t, c.count, 0.25)), y: 40 * (1 - easeOut(prog(t, c.count, 0.35))) });
      if (n.stamp) { const sp = prog(t, c.stamp - 0.08, 0.22); set(n.stamp, { o: clamp(sp * 4), s: 1.8 - 0.8 * easeOut(sp), r: -6 }); }
    },
    sfx: (c) => [
      { t: c.start, type: 'whoosh' },
      ...Array.from({ length: 16 }, (_, i) => ({ t: c.count + (i / 16) * Math.max(0.3, c.countEnd - c.count), type: 'tick' })),
      ...(c.stamp == null ? [] : [{ t: c.stamp, type: 'stamp' }]),
    ],
  },

  cta: {
    build(s) {
      const photo = el('div', 'card cta-photo', `<img src="${ASSET(s.photo || 'assets/photo/christian.webp')}">`);
      const title = el('div', 'abs display cta-title', s.title || '');
      const btn = el('div', 'btn', s.button);
      const link = el('div', 'abs cta-link', s.link || '👆 Enlace en mi perfil');
      return { root: [photo, title, btn, link], photo, title, btn, link };
    },
    cues: (s, w) => ({ button: w(s.buttonAt) }),
    render(t, c, n) {
      set(n.photo, { ...popIn(t, c.start, 0.4), r: 3 });
      set(n.title, { o: clamp(prog(t, c.start + 0.25, 0.2)), y: 30 * (1 - easeOut(prog(t, c.start + 0.25, 0.3))) });
      const beat = t > c.button ? 1 + 0.05 * Math.max(0, Math.sin((t - c.button) * 7)) : 1;
      const bp = popIn(t, c.button - 0.1, 0.36);
      set(n.btn, { o: bp.o, s: bp.s * beat });
      set(n.link, { o: clamp(prog(t, c.button + 0.3, 0.25)), y: 20 * Math.sin(t * 6) });
    },
    sfx: (c) => [{ t: c.start, type: 'whoosh' }, { t: c.button, type: 'chime' }],
  },
};

/* ---------- Fondo, marca y subtítulos (iguales en todos los videos) ---------- */

const BLOCKS = [
  [40, 1180, 90, '#f9c9da', 12], [930, 1220, 70, '#8b5cf6', -8], [930, 180, 110, '#fbe1ea', 16],
  [60, 160, 80, '#7c3aed', -14], [120, 1800, 70, '#ffffff', 22], [880, 1790, 60, '#c4b5fd', 0],
];

function captionHtml(sc, t) {
  const groups = [];
  let g = [];
  sc.words.forEach((w) => { g.push(w); if (g.length >= 4 || /[.,?!…]$/.test(w.w)) { groups.push(g); g = []; } });
  if (g.length) groups.push(g);
  const current = [...groups].reverse().find((gr) => t >= gr[0].t - 0.08) || groups[0];
  return current.map((w) => {
    const cls = t >= w.t && t < w.t + Math.max(w.d, 0.18) ? 'on' : t >= w.t ? 'past' : 'next';
    return `<span class="${cls}">${w.w}</span>`;
  }).join(' ');
}

export async function mount(stage, spec, timeline) {
  const byId = Object.fromEntries(timeline.scenes.map((s) => [s.id, s]));
  let world = null, worldCanvas = null;
  if (spec.scenes.some((s) => s.type === 'world')) {
    const { createWorld } = await import('./world3d.js');
    worldCanvas = el('canvas', 'world-canvas');
    worldCanvas.width = 1080; worldCanvas.height = 1920;
    stage.append(worldCanvas);
    world = createWorld(worldCanvas);
  }
  const blocks = BLOCKS.map(([x, y, s, c, r], i) => {
    const b = el('div', 'blk');
    Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${s}px`, height: `${s}px`, background: c, borderRadius: i % 3 === 1 ? '50%' : '26px' });
    b.dataset.r = r;
    stage.append(b);
    return b;
  });
  const brand = el('div', 'brand', spec.brand || 'Christian E. · Tutor en línea');
  stage.append(brand);

  const scenes = spec.scenes.map((s, i) => {
    const type = TYPES[s.type];
    if (!type) throw new Error(`tipo de escena desconocido: ${s.type}`);
    const sc = byId[s.id];
    if (!sc) throw new Error(`la escena ${s.id} no está en timeline.json (¿falta grabar o generar la voz?)`);
    const word = (text) => {
      if (text == null || text === '') return null;
      // En videos sin voz, los disparadores son segundos desde el inicio de la escena.
      if (typeof text === 'number') return sc.start + text;
      const hit = sc.words.find((w) => norm(w.w).startsWith(norm(text)));
      if (!hit) throw new Error(`palabra "${text}" no encontrada en la escena ${s.id}: ${sc.words.map((w) => w.w).join(' ')}`);
      return hit.t;
    };
    const next = timeline.scenes[i + 1];
    const c = { start: i === 0 ? 0 : sc.start - 0.05, end: next ? next.start - 0.05 : timeline.total + 1, ...type.cues(s, word, sc) };
    const root = el('div', 'scene');
    const nodes = type.build(s);
    nodes.root.forEach((n) => root.append(n));
    stage.append(root);
    return { s, sc, c, type, root, nodes };
  });

  const caption = el('div', '', '');
  caption.id = 'caption';
  stage.append(caption);

  const total = timeline.total;
  const sfx = scenes.flatMap(({ type, c }) => type.sfx(c)).sort((a, b) => a.t - b.t);
  const ctaStart = scenes.find((x) => x.s.type === 'cta')?.c.start ?? Infinity;

  function renderAt(t) {
    blocks.forEach((b, i) => {
      b.style.transform = `translateY(${Math.sin(t * 1.3 + i) * 14}px) rotate(${+b.dataset.r + Math.sin(t * 0.7 + i) * 6}deg)`;
    });
    brand.style.opacity = t > ctaStart ? 0 : 0.92;
    if (world) {
      const active = scenes.find((x) => t >= x.c.start && t < x.c.end) || scenes[scenes.length - 1];
      const isWorld = active.s.type === 'world';
      world.update(t, isWorld ? active.c.action : (spec.worldIdle || 'orbit'), t - active.c.start);
      worldCanvas.style.opacity = isWorld ? 1 : 0.5;
    }
    for (const x of scenes) {
      const alpha = clamp(Math.min((t - x.c.start) / 0.18 + 1, (x.c.end - t) / 0.18));
      x.root.style.opacity = alpha;
      if (alpha > 0) x.type.render(t, x.c, x.nodes);
    }
    const sc = timeline.scenes.find((s) => t >= s.start - 0.05 && t < s.start + s.duration + 0.15);
    const hasWords = sc && sc.words.length > 0;
    caption.innerHTML = hasWords ? captionHtml(sc, t) : '';
    caption.style.opacity = hasWords ? clamp((t - sc.start + 0.05) * 8) : 0;
  }

  await document.fonts.ready;
  await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
  renderAt(0);
  return { total, sfx, renderAt };
}
