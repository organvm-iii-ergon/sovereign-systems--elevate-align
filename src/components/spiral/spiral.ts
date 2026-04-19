/**
 * Sovereign Systems Spiral — Canvas Renderer
 *
 * Vanilla Canvas API implementation with 2D Perlin noise for organic motion.
 * No dependencies. 13 spiral nodes positioned via golden-angle phyllotaxis
 * on an Archimedean spiral path. Desktop only — mobile gets SpiralFallback.
 */

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
// 2D Perlin Noise (minimal implementation)
// ---------------------------------------------------------------------------

const PERM = new Uint8Array(512);
const GRAD = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];

function initNoise(): void {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function dot2(g: number[], x: number, y: number): number {
  return g[0] * x + g[1] * y;
}

function noise2d(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);

  const aa = PERM[PERM[xi] + yi] & 7;
  const ab = PERM[PERM[xi] + yi + 1] & 7;
  const ba = PERM[PERM[xi + 1] + yi] & 7;
  const bb = PERM[PERM[xi + 1] + yi + 1] & 7;

  return lerp(
    lerp(dot2(GRAD[aa], xf, yf), dot2(GRAD[ba], xf - 1, yf), u),
    lerp(dot2(GRAD[ab], xf, yf - 1), dot2(GRAD[bb], xf - 1, yf - 1), u),
    v,
  );
}

// ---------------------------------------------------------------------------
// Spiral Renderer
// ---------------------------------------------------------------------------

const GOLDEN_ANGLE = 2.39996;
const BASE_ROTATION_SPEED = 0.0006;
const NODE_RADIUS = 22;
const HIT_RADIUS = 28;
const HOVER_SCALE = 1.15;
const LABEL_FONT = '12px Inter, system-ui, sans-serif';
const SUB_LABEL_FONT = '10px Inter, system-ui, sans-serif';
const CENTER_LABEL_FONT = '600 13px Inter, system-ui, sans-serif';
const EMOJI_FONT_SIZE = 18;
const SPIRAL_MIN_R = 0.18;
const SPIRAL_MAX_R = 0.95;

interface NodeState {
  x: number;
  y: number;
  currentScale: number;
  hovered: boolean;
}

export function initSpiral(
  canvas: HTMLCanvasElement,
  nodes: NodeData[],
): () => void {
  const ctx = canvas.getContext('2d')!;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let baseRadius = 0;
  let animFrame = 0;
  let globalAngle = 0;
  let mouseX = -9999;
  let mouseY = -9999;

  initNoise();

  const nodeStates: NodeState[] = nodes.map(() => ({
    x: 0,
    y: 0,
    currentScale: 1,
    hovered: false,
  }));

  // --- Resize handler ---

  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    baseRadius = Math.min(width, height) * 0.38;
  }

  // --- Hit detection ---

  function updateMouse(e: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function handleClick(): void {
    for (let i = 0; i < nodes.length; i++) {
      if (nodeStates[i].hovered && nodes[i].status === 'live') {
        window.location.href = nodes[i].url;
        return;
      }
    }
  }

  // --- Drawing primitives ---

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // --- Draw functions ---

  function drawLogarithmicSpiral(cx: number, cy: number, time: number): void {
    ctx.save();
    ctx.strokeStyle = hexToRgba('#c9a96e', 0.1);
    ctx.lineWidth = 1;
    ctx.beginPath();
    const a = 4;
    const b = 0.18;
    const rotOffset = time * 0.0002;
    for (let theta = 0; theta < Math.PI * 8; theta += 0.05) {
      const r = a * Math.exp(b * theta);
      if (r > baseRadius * 1.2) break;
      const x = cx + r * Math.cos(theta + rotOffset);
      const y = cy + r * Math.sin(theta + rotOffset);
      if (theta === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawSpiralPath(cx: number, cy: number): void {
    ctx.save();
    ctx.setLineDash([2, 8]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = hexToRgba('#119a9e', 0.08);
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const theta = t * nodes.length * GOLDEN_ANGLE;
      const r = baseRadius * (SPIRAL_MIN_R + t * (SPIRAL_MAX_R - SPIRAL_MIN_R));
      const x = cx + r * Math.cos(theta + globalAngle);
      const y = cy + r * Math.sin(theta + globalAngle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawCenterNode(cx: number, cy: number, time: number): void {
    const pulse = 0.7 + 0.3 * Math.sin(time * 0.002);

    ctx.save();
    ctx.globalAlpha = pulse * 0.15;
    ctx.fillStyle = '#119a9e';
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#e8e4df';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = pulse * 0.7;
    ctx.fillStyle = '#e8e4df';
    ctx.font = CENTER_LABEL_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SOVEREIGN SYSTEMS', cx, cy + 12);
    ctx.restore();
  }

  function drawNode(
    node: NodeData,
    state: NodeState,
    index: number,
  ): void {
    const isLive = node.status === 'live';
    const isHovered = state.hovered;
    const targetScale = isHovered ? HOVER_SCALE : 1;
    state.currentScale = lerp(state.currentScale, targetScale, 0.12);
    const scale = state.currentScale;
    const r = NODE_RADIUS * scale;

    const baseAlpha = isLive ? 1 : 0.4;
    const hoverAlpha = isHovered ? 1 : baseAlpha;

    ctx.save();
    ctx.translate(state.x, state.y);

    // Fill
    ctx.fillStyle = hexToRgba(node.color, 0.1 * hoverAlpha);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Stroke
    ctx.lineWidth = 1.5;
    if (!isLive) {
      ctx.setLineDash([3, 3]);
    }
    ctx.strokeStyle = hexToRgba(node.color, 0.7 * hoverAlpha);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Emoji
    ctx.font = `${Math.round(EMOJI_FONT_SIZE * scale)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.emoji, 0, -1);

    // Name label
    ctx.fillStyle = hexToRgba('#e8e4df', isHovered ? 1 : 0.65 * baseAlpha);
    ctx.font = LABEL_FONT;
    ctx.textBaseline = 'top';
    ctx.fillText(node.name, 0, r + 6);

    // "locked" sub-label
    if (!isLive) {
      ctx.fillStyle = hexToRgba('#8cc5d3', 0.5);
      ctx.font = SUB_LABEL_FONT;
      ctx.fillText('locked', 0, r + 20);
    }

    ctx.restore();
  }

  // --- Main draw loop ---

  function draw(time: number): void {
    ctx.fillStyle = '#071e22';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    drawLogarithmicSpiral(cx, cy, time);
    drawSpiralPath(cx, cy);

    globalAngle += BASE_ROTATION_SPEED;

    let anyCursorHover = false;
    for (let i = 0; i < nodes.length; i++) {
      // Golden-angle spiral positioning
      const t = i / (nodes.length - 1);
      const theta = i * GOLDEN_ANGLE + globalAngle;
      const rBase = baseRadius * (SPIRAL_MIN_R + t * (SPIRAL_MAX_R - SPIRAL_MIN_R));

      // Perlin wobble
      const noiseAngle = noise2d(i * 1.7, time * 0.0003) * 0.15;
      const noiseRadius = noise2d(i * 2.3 + 100, time * 0.0002) * 8;

      const nx = cx + (rBase + noiseRadius) * Math.cos(theta + noiseAngle);
      const ny = cy + (rBase + noiseRadius) * Math.sin(theta + noiseAngle);
      nodeStates[i].x = nx;
      nodeStates[i].y = ny;

      // Hit detection
      const dx = mouseX - nx;
      const dy = mouseY - ny;
      const dist = Math.sqrt(dx * dx + dy * dy);
      nodeStates[i].hovered = dist < HIT_RADIUS;
      if (nodeStates[i].hovered) anyCursorHover = true;

      drawNode(nodes[i], nodeStates[i], i);
    }

    canvas.style.cursor = anyCursorHover ? 'pointer' : 'default';

    drawCenterNode(cx, cy, time);

    animFrame = requestAnimationFrame(draw);
  }

  // --- Bootstrap ---

  resize();
  animFrame = requestAnimationFrame(draw);

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', updateMouse);
  canvas.addEventListener('click', handleClick);

  // --- Cleanup ---

  return function cleanup(): void {
    cancelAnimationFrame(animFrame);
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousemove', updateMouse);
    canvas.removeEventListener('click', handleClick);
  };
}
