export type Vec3 = readonly [number, number, number];

export const toRad = (degrees: number) => degrees * Math.PI / 180;

export function drawDarkGrid(ctx: CanvasRenderingContext2D, width: number, height: number, step = 38) {
  ctx.fillStyle = '#111821';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(152,170,174,.13)';
  ctx.lineWidth = 1;
  for (let x = width / 2 % step; x < width; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = height / 2 % step; y < height; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
}

export function drawArrow2D(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  label: string,
  dashed = false,
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.setLineDash(dashed ? [5, 5] : []); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(angle - .42), y2 - 10 * Math.sin(angle - .42));
  ctx.lineTo(x2 - 10 * Math.cos(angle + .42), y2 - 10 * Math.sin(angle + .42));
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  ctx.font = '12px ui-monospace, monospace'; ctx.fillText(label, x2 + 8, y2 - 8);
}

export function rotateX([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
}

export function rotateY([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [x * c + z * s, y, -x * s + z * c];
}

export function projectIso(point: Vec3, cx: number, cy: number, scale: number, yaw = -.62, pitch = .48) {
  const [x, y] = rotateX(rotateY(point, yaw), pitch);
  return [cx + x * scale, cy - y * scale] as const;
}

export function rotateAroundAxis(vector: Vec3, axis: Vec3, angle: number): Vec3 {
  const [x, y, z] = vector, [nx, ny, nz] = axis;
  const c = Math.cos(angle), s = Math.sin(angle), dot = x * nx + y * ny + z * nz;
  return [
    x * c + (ny * z - nz * y) * s + nx * dot * (1 - c),
    y * c + (nz * x - nx * z) * s + ny * dot * (1 - c),
    z * c + (nx * y - ny * x) * s + nz * dot * (1 - c),
  ];
}

export function drawProjectedArrow(ctx: CanvasRenderingContext2D, vector: Vec3, center: readonly [number, number], scale: number, color: string, label: string, dashed = false) {
  const origin = projectIso([0, 0, 0], center[0], center[1], scale);
  const end = projectIso(vector, center[0], center[1], scale);
  drawArrow2D(ctx, ...origin, ...end, color, label, dashed);
}

export function drawAxes3D(ctx: CanvasRenderingContext2D, center: readonly [number, number], scale: number) {
  drawProjectedArrow(ctx, [1.1, 0, 0], center, scale, 'rgba(239,189,85,.58)', 'x');
  drawProjectedArrow(ctx, [0, 1.1, 0], center, scale, 'rgba(75,218,176,.58)', 'y');
  drawProjectedArrow(ctx, [0, 0, 1.1], center, scale, 'rgba(182,155,242,.6)', 'z');
}
