import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const COLORS = {
  card: 0x7c3aed,
  border: 0x8b5cf6,
  deep: 0x3b0f80,
  pink: 0xf9c9da,
  pinkSoft: 0xfbe1ea,
  white: 0xffffff,
  skin: 0xf2c6a0,
};

const mat = (color, rough = 0.55) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 });
const box = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, r);

/** Personaje sencillo de bloques. */
function blockCharacter() {
  const g = new THREE.Group();
  const add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); g.add(o); return o; };
  add(box(1.0, 1.0, 1.0, 0.14), mat(COLORS.skin), 0, 2.55, 0);            // cabeza
  add(box(0.22, 0.12, 0.05, 0.03), mat(COLORS.deep), -0.2, 2.62, 0.51);    // ojos
  add(box(0.22, 0.12, 0.05, 0.03), mat(COLORS.deep), 0.2, 2.62, 0.51);
  add(box(1.6, 1.5, 0.8, 0.12), mat(COLORS.card), 0, 1.3, 0);              // torso
  add(box(0.7, 1.5, 0.7, 0.12), mat(COLORS.pink), -1.2, 1.3, 0);           // brazos
  add(box(0.7, 1.5, 0.7, 0.12), mat(COLORS.pink), 1.2, 1.3, 0);
  add(box(0.75, 1.4, 0.75, 0.12), mat(COLORS.deep), -0.42, -0.15, 0);      // piernas
  add(box(0.75, 1.4, 0.75, 0.12), mat(COLORS.deep), 0.42, -0.15, 0);
  return g;
}

function floatingPieces(variant) {
  const pieces = [];
  const specs = variant === 'developer'
    ? [
        [box(1.1, 1.1, 1.1), COLORS.pink, -3.0, 1.8, -0.5],
        [box(1.1, 1.1, 1.1), COLORS.border, -3.0, 0.6, -0.5],
        [box(1.1, 1.1, 1.1), COLORS.white, -1.85, 0.6, -0.5],
        [new THREE.TorusGeometry(0.75, 0.28, 18, 40), COLORS.pinkSoft, 2.6, 2.2, -1],
        [box(0.8, 0.8, 0.8), COLORS.card, 3.1, 0.2, 0.3],
        [new THREE.SphereGeometry(0.45, 28, 20), COLORS.white, 1.5, 3.4, -1.5],
      ]
    : [
        [box(0.9, 0.9, 0.9), COLORS.pink, -2.9, 2.6, -0.8],
        [box(0.7, 0.7, 0.7), COLORS.white, 2.8, 2.9, -1.2],
        [new THREE.SphereGeometry(0.5, 28, 20), COLORS.pinkSoft, 2.9, 0.9, 0.2],
        [new THREE.TorusGeometry(0.6, 0.24, 18, 40), COLORS.border, -3.1, 0.4, 0],
        [box(0.55, 0.55, 0.55), COLORS.card, 1.7, 4.0, -2],
        [box(0.6, 0.6, 0.6), COLORS.deep, -1.9, 4.0, -1.8],
      ];
  for (const [geo, color, x, y, z] of specs) {
    const m = new THREE.Mesh(geo, mat(color, 0.45));
    m.position.set(x, y, z);
    m.rotation.set(Math.random() * 0.8, Math.random() * 0.8, 0);
    m.userData.baseY = y;
    m.userData.phase = Math.random() * Math.PI * 2;
    pieces.push(m);
  }
  return pieces;
}

/** Monta la escena en `container`. Devuelve { dispose }. */
export function initScene(container, { variant = 'teacher' } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 1.9, 11);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x3b0f80, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 6);
  scene.add(key);

  const rig = new THREE.Group();
  scene.add(rig);

  const hero = variant === 'developer' ? null : blockCharacter();
  if (hero) { hero.rotation.y = -0.35; rig.add(hero); }

  const floor = new THREE.Mesh(box(7.5, 0.4, 3.4, 0.16), mat(COLORS.deep, 0.8));
  floor.position.set(0, -1.1, -0.4);
  rig.add(floor);

  const pieces = floatingPieces(variant);
  pieces.forEach((p) => rig.add(p));

  // Tamaño
  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En tarjetas estrechas alejamos la cámara para que entre todo.
    const aspect = w / h;
    camera.position.z = aspect < 1 ? 15 : aspect > 2 ? 8.6 : 11;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Parallax suave (máx. ~8°)
  const target = { x: 0, y: 0 };
  const MAX = THREE.MathUtils.degToRad(8);
  function onPointer(e) {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  function onTilt(e) {
    if (e.gamma == null) return;
    target.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
    target.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
  }
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('deviceorientation', onTilt, { passive: true });

  // Bucle con pausa fuera de pantalla o en pestañas ocultas
  let visible = true;
  let running = false;
  let raf = 0;
  const clock = new THREE.Clock();

  function frame() {
    if (!running) return;
    const t = clock.getElapsedTime();
    rig.rotation.y += (target.x * MAX - rig.rotation.y) * 0.06;
    rig.rotation.x += (target.y * MAX * 0.6 - rig.rotation.x) * 0.06;
    for (const p of pieces) {
      p.position.y = p.userData.baseY + Math.sin(t * 0.9 + p.userData.phase) * 0.18;
      p.rotation.y += 0.004;
    }
    if (hero) hero.position.y = Math.sin(t * 1.3) * 0.06;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function update() {
    const should = visible && document.visibilityState === 'visible' && container.offsetParent !== null;
    if (should && !running) { running = true; clock.start(); raf = requestAnimationFrame(frame); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); }
  }

  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
  io.observe(container);
  document.addEventListener('visibilitychange', update);
  update();

  return {
    update,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onTilt);
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
