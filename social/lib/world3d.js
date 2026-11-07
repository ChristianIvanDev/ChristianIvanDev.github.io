// Mundo 3D de los videos: personaje de bloques genérico, obby, lava/trampolín y partículas.
// Determinista: todo se calcula a partir del tiempo (sin física acumulada), así cada fotograma es reproducible.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const C = { purple: 0x7c3aed, deep: 0x3b0f80, border: 0x8b5cf6, pink: 0xf9c9da, pinkSoft: 0xfbe1ea, white: 0xffffff, skin: 0xf2c6a0, lava: 0xff5a1f, lavaHot: 0xffc23d, jelly: 0x37e39a };
const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...opts });
const box = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, r);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, d) => clamp((t - a) / d);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const smooth = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, x) => a + (b - a) * x;
function rand(seed) { const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

function character() {
  const g = new THREE.Group();
  const part = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); g.add(o); return o; };
  const head = part(box(0.9, 0.9, 0.9, 0.14), mat(C.skin), 0, 2.35, 0);
  part(box(0.2, 0.12, 0.04, 0.03), mat(C.deep), -0.18, 2.42, 0.46);
  part(box(0.2, 0.12, 0.04, 0.03), mat(C.deep), 0.18, 2.42, 0.46);
  const mouth = part(box(0.3, 0.06, 0.04, 0.02), mat(C.deep), 0, 2.18, 0.46);
  part(box(1.4, 1.3, 0.7, 0.12), mat(C.purple), 0, 1.25, 0);
  // brazos y piernas con pivote arriba para poder balancearlos
  const limb = (w, h, color, x, y) => {
    const pivot = new THREE.Group(); pivot.position.set(x, y, 0); g.add(pivot);
    const m = new THREE.Mesh(box(w, h, w, 0.1), mat(color)); m.position.y = -h / 2; pivot.add(m);
    return pivot;
  };
  const armL = limb(0.6, 1.3, C.pink, -1.0, 1.9);
  const armR = limb(0.6, 1.3, C.pink, 1.0, 1.9);
  const legL = limb(0.65, 1.2, C.deep, -0.37, 0.6);
  const legR = limb(0.65, 1.2, C.deep, 0.37, 0.6);
  g.userData = { head, mouth, armL, armR, legL, legR };
  return g;
}

export function createWorld(canvas, { width = 1080, height = 1920 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3b0f80, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(5, 10, 8); scene.add(sun);
  const lavaLight = new THREE.PointLight(0xff7a2e, 3, 14, 1.6); lavaLight.position.set(1, -1, 2); scene.add(lavaLight);

  // Obby: plataforma de salida (A) y de llegada (B), más plataformas de fondo
  const platA = new THREE.Mesh(box(4.4, 0.8, 3, 0.16), mat(C.border)); platA.position.set(-3.6, -0.4, 0); scene.add(platA);
  const platB = new THREE.Mesh(box(3.6, 0.8, 3, 0.16), mat(C.pink)); platB.position.set(5.0, -0.4, 0); scene.add(platB);
  const deco = [];
  [[-8, 3, -7, C.pinkSoft], [9, 5, -9, C.border], [-2, 7, -12, C.purple], [6, 10, -10, C.pink], [-7, 12, -8, C.white], [2, 14, -6, C.border]].forEach(([x, y, z, c], i) => {
    const m = new THREE.Mesh(box(2.2, 0.5, 2.2, 0.12), mat(c)); m.position.set(x, y, z); m.userData.phase = i; scene.add(m); deco.push(m);
  });

  // Lava (se vuelve trampolín verde)
  const lavaMat = mat(C.lava, { emissive: C.lava, emissiveIntensity: 0.9, roughness: 0.3 });
  const lava = new THREE.Mesh(new THREE.BoxGeometry(40, 0.6, 14), lavaMat); lava.position.set(0, -2.6, -2); scene.add(lava);
  const bubbles = Array.from({ length: 18 }, (_, i) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.16 + rand(i) * 0.18, 12, 10), mat(C.lavaHot, { emissive: C.lavaHot, emissiveIntensity: 1 }));
    b.userData = { x: -6 + rand(i + 1) * 13, z: -3 + rand(i + 2) * 5, speed: 0.6 + rand(i + 3) * 0.8, off: rand(i + 4) * 3 };
    scene.add(b); return b;
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.18, 14, 48), mat(C.jelly, { emissive: C.jelly, emissiveIntensity: 0.8 }));
  ring.rotation.x = Math.PI / 2; ring.position.set(0.8, -2.25, 0); scene.add(ring);

  const hero = character(); scene.add(hero);
  const splash = Array.from({ length: 22 }, (_, i) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.14 + rand(i + 9) * 0.12, 10, 8), mat(C.lavaHot, { emissive: C.lavaHot, emissiveIntensity: 1 }));
    s.userData = { a: rand(i + 20) * Math.PI * 2, v: 3 + rand(i + 30) * 4, up: 4 + rand(i + 40) * 4 }; scene.add(s); return s;
  });
  const trail = Array.from({ length: 16 }, (_, i) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.22 * (1 - i / 18), 10, 8), mat(i % 2 ? C.pink : C.white, { emissive: i % 2 ? C.pink : C.white, emissiveIntensity: 0.7, transparent: true }));
    scene.add(s); return s;
  });

  const ud = hero.userData;
  function pose({ run = 0, wave = 0, flail = 0, t = 0 }) {
    const sw = Math.sin(t * 14) * 0.9 * run;
    ud.legL.rotation.x = sw; ud.legR.rotation.x = -sw;
    ud.armL.rotation.x = -sw * 0.8; ud.armR.rotation.x = sw * 0.8;
    ud.armL.rotation.z = 0; ud.armR.rotation.z = 0;
    if (flail) {
      ud.armL.rotation.z = -2.4 + Math.sin(t * 22) * 0.5 * flail; ud.armR.rotation.z = 2.4 + Math.cos(t * 22) * 0.5 * flail;
      ud.legL.rotation.x = Math.sin(t * 18) * 0.6 * flail; ud.legR.rotation.x = -Math.sin(t * 18) * 0.6 * flail;
    }
    if (wave) { ud.armR.rotation.z = 2.6 + Math.sin(t * 10) * 0.45 * wave; }
  }

  // Posición del personaje según la acción: (local = segundos dentro de la escena)
  function heroAt(action, local) {
    if (action === 'fall') {
      if (local < 1.1) return { x: lerp(-4.6, -1.6, local / 1.1), y: 0, run: 1, rotY: Math.PI / 2 };
      const u = (local - 1.1) / 0.95;                       // salto que se queda corto
      if (u < 1) return { x: lerp(-1.6, 0.8, u), y: Math.sin(Math.PI * Math.min(u, 0.5)) * 1.6 - Math.max(0, u - 0.5) * 2 * 4.2, flail: u > 0.5 ? 1 : 0, rotY: Math.PI / 2 };
      return { x: 0.8, y: -4.2 - Math.min(0.5, (local - 2.05) * 0.6), flail: 0.3, rotY: 0.3 }; // hundido en la lava
    }
    if (action === 'freeze') return { x: 0.8, y: -4.55 + Math.sin(local * 2) * 0.05, flail: 0.15, rotY: 0.3 };
    if (action === 'launch') {
      if (local < 0.3) return { x: 0.8, y: -4.55 + easeOut(local / 0.3) * 0.4, rotY: 0.3 };
      const u = clamp((local - 0.3) / 2.6);
      const x = lerp(0.8, 5.0, u), y = lerp(-4.15, 0, u) + Math.sin(Math.PI * u) * 11;
      return { x, y, spin: u < 1 ? u * Math.PI * 4 : 0, flail: u < 1 ? 0.6 : 0, rotY: 0.2, landed: u >= 1 };
    }
    // orbit / wave: de pie en la plataforma B
    return { x: 5.0, y: Math.abs(Math.sin(local * (action === 'wave' ? 5 : 2))) * (action === 'wave' ? 0.6 : 0), wave: 1, rotY: -0.25 };
  }

  function update(t, action, local) {
    const h = heroAt(action, local);
    hero.position.set(h.x, h.y, 0);
    hero.rotation.set(h.spin || 0, h.rotY ?? 0, 0);
    pose({ run: h.run || 0, wave: h.wave || 0, flail: h.flail || 0, t });
    ud.mouth.scale.x = h.flail ? 0.6 : 1;

    // Lava → trampolín (en freeze, a partir de 2.6 s; y después siempre)
    const jelly = action === 'freeze' ? smooth(prog(local, 2.6, 0.7)) : action === 'fall' ? 0 : 1;
    lavaMat.color.setHex(C.lava).lerp(new THREE.Color(C.jelly), jelly);
    lavaMat.emissive.copy(lavaMat.color);
    lavaMat.emissiveIntensity = 0.75 + Math.sin(t * 3) * 0.12;
    lavaLight.color.setHex(jelly > 0.5 ? C.jelly : 0xff7a2e);
    ring.scale.setScalar(action === 'freeze' ? easeOut(prog(local, 2.8, 0.5)) : action === 'launch' ? 1 + (local < 0.3 ? 0 : Math.max(0, 0.4 - (local - 0.3)) * 1.5) : 0.001);
    lava.position.y = -2.6 + (action === 'launch' && local < 0.6 ? Math.sin(local * 30) * 0.12 * (1 - local / 0.6) : 0);

    bubbles.forEach((b, i) => {
      const { x, z, speed, off } = b.userData;
      const k = ((t * speed + off) % 2.2) / 2.2;
      b.position.set(x, -2.3 + k * 0.9, z);
      b.scale.setScalar(Math.sin(Math.PI * k) + 0.01);
      b.material.color.setHex(jelly > 0.5 ? C.white : C.lavaHot); b.material.emissive.copy(b.material.color);
    });

    // Salpicadura al caer en la lava
    const since = action === 'fall' ? local - 2.05 : -1;
    splash.forEach((s) => {
      const { a, v, up } = s.userData;
      if (since < 0 || since > 1.2) { s.visible = false; return; }
      s.visible = true;
      s.position.set(0.8 + Math.cos(a) * v * since * 0.5, -2.3 + up * since - 9 * since * since, Math.sin(a) * v * since * 0.5);
    });

    // Estela al volar
    trail.forEach((s, i) => {
      const lt = local - 0.04 * (i + 1);
      if (action !== 'launch' || lt < 0.35 || lt > 2.9) { s.visible = false; return; }
      const p = heroAt('launch', lt);
      s.visible = true; s.position.set(p.x, p.y + 1.3, 0); s.material.opacity = 1 - i / trail.length;
    });

    deco.forEach((m) => { m.position.y += Math.sin(t * 1.2 + m.userData.phase) * 0.004; m.rotation.y = Math.sin(t * 0.4 + m.userData.phase) * 0.3; });

    // Cámara
    let cam, look;
    if (action === 'fall') {
      const shake = local > 2.05 && local < 2.4 ? Math.sin(local * 80) * 0.25 * (1 - (local - 2.05) / 0.35) : 0;
      cam = new THREE.Vector3(lerp(-3, 0.5, smooth(prog(local, 0, 2.2))) + shake, 3.2, 19);
      look = new THREE.Vector3(lerp(-2.5, 0.6, smooth(prog(local, 0, 2.2))), lerp(0.2, -2.4, smooth(prog(local, 1.4, 0.8))), 0);
    } else if (action === 'freeze') {
      const d = smooth(prog(local, 0, 3.2));
      cam = new THREE.Vector3(lerp(0.5, 2.6, d), lerp(3.2, 0.6, d), lerp(19, 10, d));
      look = new THREE.Vector3(0.8, -2.4, 0);
    } else if (action === 'launch') {
      const p = heroAt('launch', local);
      cam = new THREE.Vector3(p.x * 0.6 + 1, p.y * 0.75 + 1.5, 19);
      look = new THREE.Vector3(p.x, p.y + 1, 0);
    } else {
      const a = -0.6 + local * 0.18;
      cam = new THREE.Vector3(5 + Math.sin(a) * 11, 3.4, Math.cos(a) * 11);
      look = new THREE.Vector3(5, 1.4, 0);
    }
    camera.position.copy(cam); camera.lookAt(look);
    renderer.render(scene, camera);
  }

  return { update };
}
