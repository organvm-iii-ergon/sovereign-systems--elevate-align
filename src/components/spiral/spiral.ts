/**
 * Sovereign Systems Spiral — Three.js 3D Helix Renderer
 *
 * Adapted from client prototype. Tapered helix with drag-to-rotate
 * OrbitControls, hover tooltips, and click-to-navigate. Node markers
 * are canvas-textured sprites with emoji and phase-colored glow.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NodeData {
  id: number;
  name: string;
  phase: string;
  emoji: string;
  tagline: string;
  color: string;
  status: 'live' | 'locked';
  url: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNS = 3.5;
const HELIX_HEIGHT = 20;
const PATH_STEPS = 512;
const BG_COLOR = 0x071e22;
const MARKER_BASE = 1.0;
const MARKER_HOVER = 1.35;
const CLICK_THRESHOLD = 6; // px — drag vs. click discrimination

const PHASE_HEX: Record<string, number> = {
  ELEVATE: 0x119a9e,
  ALIGN: 0x8cc5d3,
  UNLOCK: 0x3dbfc4,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Create a canvas-based sprite texture: glow ring + emoji center. */
function makeNodeTexture(
  emoji: string,
  color: string,
  live: boolean,
): THREE.CanvasTexture {
  const size = 128;
  const el = document.createElement('canvas');
  el.width = size;
  el.height = size;
  const ctx = el.getContext('2d')!;
  const cx = size / 2;
  const rad = size * 0.35;

  // Outer glow (radial gradient)
  const glow = ctx.createRadialGradient(cx, cx, rad * 0.3, cx, cx, rad * 1.4);
  glow.addColorStop(0, hexToRgba(color, live ? 0.35 : 0.12));
  glow.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // Circle fill + stroke
  ctx.beginPath();
  ctx.arc(cx, cx, rad, 0, Math.PI * 2);
  ctx.fillStyle = hexToRgba(color, live ? 0.12 : 0.05);
  ctx.fill();
  ctx.lineWidth = live ? 2 : 1.5;
  if (!live) ctx.setLineDash([4, 4]);
  ctx.strokeStyle = hexToRgba(color, live ? 0.6 : 0.25);
  ctx.stroke();
  ctx.setLineDash([]);

  // Emoji
  ctx.font = `${Math.round(size * 0.28)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, cx, cx);

  const tex = new THREE.CanvasTexture(el);
  tex.needsUpdate = true;
  return tex;
}

// ---------------------------------------------------------------------------
// Helix path builder
// ---------------------------------------------------------------------------

function buildHelixPath(): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= PATH_STEPS; i++) {
    const p = i / PATH_STEPS;
    const theta = p * Math.PI * 2 * TURNS;
    const r = 2.5 + Math.sin(p * Math.PI) * 3.5; // tapered: narrow ends, wide middle
    points.push(new THREE.Vector3(
      r * Math.cos(theta),
      p * HELIX_HEIGHT - HELIX_HEIGHT / 2,
      r * Math.sin(theta),
    ));
  }
  return points;
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export function initSpiral(
  container: HTMLElement,
  nodes: NodeData[],
): () => void {
  // --- Scene ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG_COLOR);

  const w = container.clientWidth;
  const h = container.clientHeight;

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(0, 2, 22);

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = 'grab';

  // --- Controls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.enablePan = false;
  controls.minDistance = 10;
  controls.maxDistance = 35;

  // --- Build helix ---
  const path = buildHelixPath();

  // Phase-colored line
  const geo = new THREE.BufferGeometry().setFromPoints(path);
  const vColors = new Float32Array(path.length * 3);
  const pc = {
    ELEVATE: new THREE.Color(PHASE_HEX.ELEVATE),
    ALIGN: new THREE.Color(PHASE_HEX.ALIGN),
    UNLOCK: new THREE.Color(PHASE_HEX.UNLOCK),
  };
  for (let i = 0; i < path.length; i++) {
    const p = i / path.length;
    const c = p < 5 / 13 ? pc.ELEVATE : p < 11 / 13 ? pc.ALIGN : pc.UNLOCK;
    vColors[i * 3] = c.r;
    vColors[i * 3 + 1] = c.g;
    vColors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(vColors, 3));
  scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
  })));

  // --- Node markers ---
  const markers: THREE.Sprite[] = [];
  const textures: THREE.CanvasTexture[] = [];

  nodes.forEach((node, i) => {
    const t = nodes.length > 1 ? i / (nodes.length - 1) : 0;
    const idx = Math.min(Math.floor(t * PATH_STEPS), path.length - 1);
    const pos = path[idx];

    const live = node.status === 'live';
    const tex = makeNodeTexture(node.emoji, node.color, live);
    textures.push(tex);

    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: live ? 1 : 0.5,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(pos);
    sprite.scale.setScalar(MARKER_BASE);
    sprite.userData = node;

    scene.add(sprite);
    markers.push(sprite);
  });

  // --- Tooltip ---
  const tip = document.createElement('div');
  tip.style.cssText = `
    position:absolute;display:none;padding:6px 12px;
    background:rgba(7,30,34,0.88);color:#e8e4df;
    border:1px solid rgba(17,154,158,0.3);border-radius:6px;
    font:13px/1.3 Inter,system-ui,sans-serif;pointer-events:none;
    z-index:100;backdrop-filter:blur(6px);
    box-shadow:0 4px 12px rgba(0,0,0,0.3);
  `;
  container.style.position = 'relative';
  container.appendChild(tip);

  // --- Raycaster & interaction state ---
  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered: THREE.Sprite | null = null;
  let downX = 0;
  let downY = 0;

  function setMouse(ex: number, ey: number): void {
    const r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((ex - r.left) / r.width) * 2 - 1;
    mouse.y = -((ey - r.top) / r.height) * 2 + 1;
  }

  function onMove(e: MouseEvent): void {
    setMouse(e.clientX, e.clientY);
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(markers);
    const rect = renderer.domElement.getBoundingClientRect();

    if (hits.length > 0) {
      const hit = hits[0].object as THREE.Sprite;
      if (hovered !== hit) {
        if (hovered) hovered.scale.setScalar(MARKER_BASE);
        hovered = hit;
        hit.scale.setScalar(MARKER_HOVER);
        const data = hit.userData as NodeData;
        tip.textContent = data.name;
        if (data.status === 'locked') {
          tip.textContent = `${data.name} — locked`;
        }
        tip.style.display = 'block';
      }
      tip.style.left = (e.clientX - rect.left + 15) + 'px';
      tip.style.top = (e.clientY - rect.top - 10) + 'px';
      renderer.domElement.style.cursor = 'pointer';
    } else if (hovered) {
      hovered.scale.setScalar(MARKER_BASE);
      hovered = null;
      tip.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
    }
  }

  function onDown(e: MouseEvent): void {
    downX = e.clientX;
    downY = e.clientY;
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onUp(e: MouseEvent): void {
    renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
    // Only navigate if pointer barely moved (click, not drag)
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > CLICK_THRESHOLD) return;

    setMouse(e.clientX, e.clientY);
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(markers);
    if (hits.length > 0) {
      const data = hits[0].object.userData as NodeData;
      if (data.status === 'live') {
        window.location.href = data.url;
      }
    }
  }

  function onResize(): void {
    const ww = container.clientWidth;
    const hh = container.clientHeight;
    camera.aspect = ww / hh;
    camera.updateProjectionMatrix();
    renderer.setSize(ww, hh);
  }

  // --- Bind events ---
  renderer.domElement.addEventListener('mousemove', onMove);
  renderer.domElement.addEventListener('mousedown', onDown);
  renderer.domElement.addEventListener('mouseup', onUp);
  window.addEventListener('resize', onResize);

  // --- Animate ---
  let frame = 0;
  function loop(): void {
    frame = requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  }
  loop();

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(frame);
    renderer.domElement.removeEventListener('mousemove', onMove);
    renderer.domElement.removeEventListener('mousedown', onDown);
    renderer.domElement.removeEventListener('mouseup', onUp);
    window.removeEventListener('resize', onResize);
    controls.dispose();
    textures.forEach(t => t.dispose());
    markers.forEach(m => m.material.dispose());
    geo.dispose();
    renderer.dispose();
    tip.remove();
    renderer.domElement.remove();
  };
}
