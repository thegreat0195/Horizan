// Deterministic pseudo-random route generator.
// Given a seed (string) and a target size, returns a normalized polyline
// (points in the [0..1] range) that resembles an outdoor route. Purely visual —
// this is never presented as real GPS data.

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  };
}

export function generateRoute(seed: string, points = 72): { x: number; y: number }[] {
  const rand = xmur3(seed);
  const out: { x: number; y: number }[] = [];
  let x = 0.15 + rand() * 0.2;
  let y = 0.8 - rand() * 0.15;
  let angle = rand() * Math.PI * 2;
  const step = 0.9 / points;
  for (let i = 0; i < points; i++) {
    out.push({ x, y });
    // Bias the walk gently toward the top-right so routes look purposeful.
    angle += (rand() - 0.5) * 0.9;
    const bias = Math.atan2(0.2 - y, 0.85 - x);
    angle = angle * 0.7 + bias * 0.3;
    x += Math.cos(angle) * step;
    y += Math.sin(angle) * step * 0.9;
    // Clamp inside 0.05..0.95 so nothing hits the frame.
    x = Math.max(0.05, Math.min(0.95, x));
    y = Math.max(0.1, Math.min(0.9, y));
  }
  return out;
}

// Approximate the arc length of a polyline in normalized space so we can
// place a dot at a given fraction (0..1) of the way along.
export function pathLength(pts: { x: number; y: number }[]): number {
  let d = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    d += Math.hypot(dx, dy);
  }
  return d;
}

export function pointAt(
  pts: { x: number; y: number }[],
  fraction: number,
): { x: number; y: number } {
  const total = pathLength(pts);
  const target = total * Math.max(0, Math.min(1, fraction));
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const seg = Math.hypot(dx, dy);
    if (acc + seg >= target) {
      const t = (target - acc) / seg;
      return { x: pts[i - 1].x + dx * t, y: pts[i - 1].y + dy * t };
    }
    acc += seg;
  }
  return pts[pts.length - 1];
}
