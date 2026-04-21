/**
 * Sovereign Systems Spiral — Three.js 3D Helix Renderer
 *
 * Tapered helix with 3D orb meshes, drag-to-rotate OrbitControls,
 * hover tooltips, click-to-navigate. Orbs float with independent
 * micro-motion. Helix extends beyond nodes for an infinite feel.
 * Works on both desktop (mouse) and mobile (touch).
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
const PATH_EXTEND = 0.3;          // 30% extra helix above/below nodes
const BG_COLOR = 0x071e22;
const FOG_DENSITY = 0.035;
const ORB_RADIUS = 0.4;
const ORB_SEGMENTS = 32;
const CLICK_THRESHOLD = 8;        // px — drag vs. click/tap

const PHASE_HEX: Record<string, number> = {
  ELEVATE: 0x119a9e,
  ALIGN:   0x8cc5d3,
  UNLOCK:  0x3dbfc4,
};

// Micro-motion amplitudes
const DRIFT_AMP = 0.06;
const DRIFT_AMP_Y = 0.04;

// ---------------------------------------------------------------------------
// Helix path builder (extended for infinite effect)
// ---------------------------------------------------------------------------

function buildHelixPath(): THREE.Vector3[] {
  const totalRange = 1 + 2 * PATH_EXTEND;
  const totalSteps = Math.ceil(PATH_STEPS * totalRange);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= totalSteps; i++) {
    const p = -PATH_EXTEND + (i / totalSteps) * totalRange;
    const theta = p * Math.PI * 2 * TURNS;
    const r = 2.5 + Math.sin(Math.max(0, Math.min(1, p)) * Math.PI) * 3.5;
    points.push(new THREE.Vector3(
      r * Math.cos(theta),
      p * HELIX_HEIGHT - HELIX_HEIGHT / 2,
      r * Math.sin(theta),
    ));
  }
  return points;
}

/** Map a normalized t (0–1 among nodes) to a path index in the extended array. */
function nodePathIndex(t: number, pathLength: number): number {
  const totalRange = 1 + 2 * PATH_EXTEND;
  const normalized = (t + PATH_EXTEND) / totalRange;
  return Math.min(Math.floor(normalized * (pathLength - 1)), pathLength - 1);
}

// ---------------------------------------------------------------------------
// Emoji sprite (small billboard in front of each orb)
// ---------------------------------------------------------------------------

function makeEmojiSprite(emoji: string): THREE.Sprite {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.font = `${Math.round(size * 0.7)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.setScalar(0.45);
  return sprite;
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
  scene.fog = new THREE.FogExp2(BG_COLOR, FOG_DENSITY);

  const w = container.clientWidth;
  const h = container.clientHeight;

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(0, 2, 22);

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = 'grab';
  renderer.domElement.style.touchAction = 'none';  // prevent scroll on touch

  // --- Lighting ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const keyLight = new THREE.PointLight(0x119a9e, 1.5, 60);
  keyLight.position.set(8, 12, 15);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xc9a96e, 0.6, 40);
  fillLight.position.set(-6, -4, -10);
  scene.add(fillLight);

  // --- Controls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 40;

  // --- Build helix path ---
  const path = buildHelixPath();

  // Phase-colored line with alpha fade at extensions
  const geo = new THREE.BufferGeometry().setFromPoints(path);
  const vColors = new Float32Array(path.length * 3);
  const phaseC = {
    ELEVATE: new THREE.Color(PHASE_HEX.ELEVATE),
    ALIGN: new THREE.Color(PHASE_HEX.ALIGN),
    UNLOCK: new THREE.Color(PHASE_HEX.UNLOCK),
  };
  const totalRange = 1 + 2 * PATH_EXTEND;
  for (let i = 0; i < path.length; i++) {
    const p = -PATH_EXTEND + (i / path.length) * totalRange;
    const c = p < 5 / 13 ? phaseC.ELEVATE : p < 11 / 13 ? phaseC.ALIGN : phaseC.UNLOCK;
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

  // --- Orb meshes ---
  const sharedGeo = new THREE.SphereGeometry(ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS);
  const orbMeshes: THREE.Mesh[] = [];
  const orbGroups: THREE.Group[] = [];
  const basePositions: THREE.Vector3[] = [];
  const disposables: THREE.Material[] = [];

  nodes.forEach((node, i) => {
    const t = nodes.length > 1 ? i / (nodes.length - 1) : 0;
    const idx = nodePathIndex(t, path.length);
    const pos = path[idx].clone();

    const live = node.status === 'live';
    const nodeColor = new THREE.Color(node.color);

    const mat = new THREE.MeshPhysicalMaterial({
      color: nodeColor,
      emissive: nodeColor,
      emissiveIntensity: live ? 0.6 : 0.12,
      metalness: 0.1,
      roughness: 0.15,
      transparent: true,
      opacity: live ? 0.85 : 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    disposables.push(mat);

    const mesh = new THREE.Mesh(sharedGeo, mat);
    mesh.userData = node;

    // Group holds orb + emoji sprite
    const group = new THREE.Group();
    group.position.copy(pos);
    group.add(mesh);

    // Emoji sprite
    const emoji = makeEmojiSprite(node.emoji);
    group.add(emoji);

    scene.add(group);
    orbMeshes.push(mesh);
    orbGroups.push(group);
    basePositions.push(pos);
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

  // --- Raycaster & interaction ---
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: THREE.Mesh | null = null;
  let downX = 0;
  let downY = 0;

  function setPointer(ex: number, ey: number): void {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((ex - r.left) / r.width) * 2 - 1;
    pointer.y = -((ey - r.top) / r.height) * 2 + 1;
  }

  function onPointerMove(e: PointerEvent): void {
    // Skip touch move (no hover on touch devices)
    if (e.pointerType === 'touch') return;

    setPointer(e.clientX, e.clientY);
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(orbMeshes);
    const rect = renderer.domElement.getBoundingClientRect();

    if (hits.length > 0) {
      const hitMesh = hits[0].object as THREE.Mesh;
      if (hovered !== hitMesh) {
        if (hovered) {
          hovered.scale.setScalar(1);
        }
        hovered = hitMesh;
        hitMesh.scale.setScalar(1.2);
        const data = hitMesh.userData as NodeData;
        tip.textContent = data.status === 'locked'
          ? `${data.emoji} ${data.name} — locked`
          : `${data.emoji} ${data.name}`;
        tip.style.display = 'block';
      }
      tip.style.left = (e.clientX - rect.left + 15) + 'px';
      tip.style.top = (e.clientY - rect.top - 10) + 'px';
      renderer.domElement.style.cursor = 'pointer';
    } else if (hovered) {
      hovered.scale.setScalar(1);
      hovered = null;
      tip.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
    }
  }

  function onPointerDown(e: PointerEvent): void {
    downX = e.clientX;
    downY = e.clientY;
    if (e.pointerType !== 'touch') {
      renderer.domElement.style.cursor = 'grabbing';
    }
  }

  function onPointerUp(e: PointerEvent): void {
    if (e.pointerType !== 'touch') {
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
    }
    // Only navigate if pointer barely moved (click/tap, not drag)
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > CLICK_THRESHOLD) return;

    setPointer(e.clientX, e.clientY);
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(orbMeshes);
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

  // --- Bind pointer events (unified mouse + touch) ---
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  window.addEventListener('resize', onResize);

  // --- Animation loop ---
  const clock = new THREE.Clock();
  let frame = 0;
  const cameraDir = new THREE.Vector3();

  function loop(): void {
    frame = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();

    // Orb micro-motion: each orb drifts on unique sine curves
    orbGroups.forEach((group, i) => {
      const seed = i * 2.39;
      group.position.x = basePositions[i].x + Math.sin(t * 0.5 + seed) * DRIFT_AMP;
      group.position.y = basePositions[i].y + Math.sin(t * 0.35 + seed * 1.3) * DRIFT_AMP_Y;
      group.position.z = basePositions[i].z + Math.cos(t * 0.4 + seed * 0.7) * DRIFT_AMP;

      // Keep emoji sprite facing camera
      const emoji = group.children[1];
      if (emoji) {
        cameraDir.copy(camera.position).sub(group.position).normalize();
        emoji.position.copy(cameraDir.multiplyScalar(ORB_RADIUS + 0.08));
      }
    });

    controls.update();
    renderer.render(scene, camera);
  }
  loop();

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(frame);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('resize', onResize);
    controls.dispose();
    disposables.forEach(m => m.dispose());
    sharedGeo.dispose();
    geo.dispose();
    renderer.dispose();
    tip.remove();
    renderer.domElement.remove();
  };
}
