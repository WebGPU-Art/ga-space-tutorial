'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D as arrow, drawDarkGrid as plane, toRad as rad } from './drawing';
import { LabFrame as Lab, Slider } from './LabChrome';

export function ComplexRotationLab() {
  const [rotation, setRotation] = useState(55);
  const [scale, setScale] = useState(1);
  const startAngle = 25, length = 95;
  const resultAngle = startAngle + rotation, resultLength = length * scale;
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    plane(ctx, width, height); const cx = width / 2, cy = height / 2;
    ctx.beginPath(); ctx.arc(cx, cy, length, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(224,232,230,.28)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, resultLength, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(75,218,176,.16)'; ctx.stroke();
    arrow(ctx, cx, cy, cx + length * Math.cos(rad(startAngle)), cy - length * Math.sin(rad(startAngle)), '#efbd55', 'z', true);
    arrow(ctx, cx, cy, cx + resultLength * Math.cos(rad(resultAngle)), cy - resultLength * Math.sin(rad(resultAngle)), '#4bdab0', 'wz');
    ctx.beginPath(); ctx.arc(cx, cy, 32, -rad(startAngle), -rad(resultAngle), rotation < 0); ctx.strokeStyle = '#b69bf2'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#c7b6f2'; ctx.font = '11px ui-monospace, monospace'; ctx.fillText(`${rotation}°`, cx + 37, cy - 14);
  };
  const zx = Math.cos(rad(startAngle)), zy = Math.sin(rad(startAngle)), wx = scale * Math.cos(rad(rotation)), wy = scale * Math.sin(rad(rotation));
  const rx = zx * wx - zy * wy, ry = zx * wy + zy * wx;
  return <Lab title="复数乘法 = 缩放 + 旋转" tag="LAB · COMPLEX PLANE" metrics={[['arg(w)', `${rotation}°`], ['|w|', scale.toFixed(2)], ['wz', `${rx.toFixed(2)} + ${ry.toFixed(2)}i`]]}>
    <InteractiveCanvas draw={draw} dependencies={[rotation, scale]} label="复数乘法旋转实验" />
    <div className="lab-controls"><Slider label="乘数相角" value={rotation} min={-180} max={180} suffix="°" onChange={setRotation} /><Slider label="乘数模长" value={scale} min={.4} max={1.8} step={.05} onChange={setScale} /></div>
  </Lab>;
}

export function BasisChangeLab() {
  const [rotation, setRotation] = useState(28);
  const [shear, setShear] = useState(.25);
  const world = [1.35, .82];
  const c = Math.cos(rad(rotation)), s = Math.sin(rad(rotation));
  const b1 = [c, s], b2 = [-s + shear * c, c + shear * s];
  const determinant = b1[0] * b2[1] - b1[1] * b2[0];
  const coordinates = [(world[0] * b2[1] - world[1] * b2[0]) / determinant, (b1[0] * world[1] - b1[1] * world[0]) / determinant];
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    plane(ctx, width, height); const cx = width / 2, cy = height / 2, unit = Math.min(width, height) * .22;
    arrow(ctx, cx, cy, cx + b1[0] * unit, cy - b1[1] * unit, '#b69bf2', 'b₁');
    arrow(ctx, cx, cy, cx + b2[0] * unit, cy - b2[1] * unit, '#67a8e5', 'b₂');
    arrow(ctx, cx, cy, cx + world[0] * unit, cy - world[1] * unit, '#4bdab0', 'v');
    const first = [coordinates[0] * b1[0], coordinates[0] * b1[1]];
    ctx.beginPath(); ctx.setLineDash([4, 5]); ctx.moveTo(cx + first[0] * unit, cy - first[1] * unit); ctx.lineTo(cx + world[0] * unit, cy - world[1] * unit); ctx.strokeStyle = '#67a8e5'; ctx.stroke(); ctx.setLineDash([]);
  };
  return <Lab title="对象不动，坐标会变" tag="LAB · CHANGE OF BASIS" metrics={[['world v', '(1.35, 0.82)'], ['[v]ᵦ', `(${coordinates[0].toFixed(2)}, ${coordinates[1].toFixed(2)})`], ['det B', determinant.toFixed(2)]]}>
    <InteractiveCanvas draw={draw} dependencies={[rotation, shear]} label="基变换与向量坐标实验" />
    <div className="lab-controls"><Slider label="基旋转" value={rotation} min={-80} max={80} suffix="°" onChange={setRotation} /><Slider label="基倾斜" value={shear} min={-.7} max={.7} step={.05} onChange={setShear} /></div>
  </Lab>;
}

export function DotProductLab() {
  const [angle, setAngle] = useState(52);
  const [lengthB, setLengthB] = useState(1.15);
  const lengthA = 1.25, dot = lengthA * lengthB * Math.cos(rad(angle)), projection = lengthB * Math.cos(rad(angle));
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    plane(ctx, width, height); const cx = width * .32, cy = height * .62, unit = Math.min(width, height) * .24;
    const ax = cx + lengthA * unit, bx = cx + lengthB * unit * Math.cos(rad(angle)), by = cy - lengthB * unit * Math.sin(rad(angle)), px = cx + projection * unit;
    arrow(ctx, cx, cy, ax, cy, '#efbd55', 'a'); arrow(ctx, cx, cy, bx, by, '#4bdab0', 'b');
    arrow(ctx, cx, cy, px, cy, '#b69bf2', 'projₐ b');
    ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(bx, by); ctx.lineTo(px, cy); ctx.strokeStyle = 'rgba(230,235,233,.6)'; ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cx, cy, 34, 0, -rad(angle), true); ctx.strokeStyle = '#b69bf2'; ctx.stroke();
  };
  return <Lab title="点积测量对齐程度" tag="LAB · METRIC" metrics={[['a · b', dot.toFixed(3)], ['cos θ', Math.cos(rad(angle)).toFixed(3)], ['proj length', projection.toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[angle, lengthB]} label="点积、夹角与投影实验" />
    <div className="lab-controls"><Slider label="夹角 θ" value={angle} min={0} max={180} suffix="°" onChange={setAngle} /><Slider label="|b|" value={lengthB} min={.4} max={1.7} step={.05} onChange={setLengthB} /></div>
  </Lab>;
}

export function OrientationLab() {
  const [mirrored, setMirrored] = useState(false);
  const [view, setView] = useState(25);
  const sign = mirrored ? -1 : 1;
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    plane(ctx, width, height); const cx = width / 2, cy = height * .62, unit = Math.min(width, height) * .27, v = rad(view);
    const project = (x: number, y: number, z: number) => [cx + (x - .55 * y) * unit, cy - (z + .34 * x + .23 * Math.sin(v) * y) * unit] as const;
    const origin = project(0, 0, 0), x = project(sign, 0, 0), y = project(0, 1, 0), z = project(0, 0, 1);
    arrow(ctx, ...origin, ...x, '#efbd55', mirrored ? '−e₁' : 'e₁'); arrow(ctx, ...origin, ...y, '#4bdab0', 'e₂'); arrow(ctx, ...origin, ...z, '#b69bf2', 'e₃');
    ctx.beginPath(); ctx.moveTo(...x); ctx.lineTo(...y); ctx.lineTo(...z); ctx.closePath(); ctx.fillStyle = mirrored ? 'rgba(240,127,99,.14)' : 'rgba(75,218,176,.13)'; ctx.fill(); ctx.strokeStyle = mirrored ? '#f07f63' : '#4bdab0'; ctx.stroke();
    ctx.fillStyle = mirrored ? '#f39780' : '#75e4c3'; ctx.font = '12px ui-monospace, monospace'; ctx.fillText(mirrored ? 'orientation = −1' : 'orientation = +1', 20, 28);
  };
  return <Lab title="镜像会翻转空间定向" tag="LAB · HANDEDNESS" metrics={[['det B', String(sign)], ['I′', mirrored ? '−I' : '+I'], ['handedness', mirrored ? 'left' : 'right']]}>
    <InteractiveCanvas draw={draw} dependencies={[mirrored, view]} label="坐标系定向与手性实验" />
    <div className="lab-controls orientation-controls"><button className={!mirrored ? 'active' : ''} onClick={() => setMirrored(false)}>右手系 · det +1</button><button className={mirrored ? 'active danger' : ''} onClick={() => setMirrored(true)}>镜像后 · det −1</button><Slider label="观察角" value={view} min={-55} max={55} suffix="°" onChange={setView} /></div>
  </Lab>;
}
