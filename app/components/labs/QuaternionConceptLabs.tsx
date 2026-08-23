'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawAxes3D, drawDarkGrid, drawProjectedArrow, rotateAroundAxis, rotateX, rotateY, toRad, type Vec3 } from './drawing';
import { LabFrame as Lab, Slider } from './LabChrome';

export function QuaternionAnatomyLab() {
  const [w, setW] = useState(.72), [x, setX] = useState(.35), [y, setY] = useState(-.2), [z, setZ] = useState(.48);
  const norm2 = w * w + x * x + y * y + z * z, norm = Math.sqrt(norm2), inverseScale = norm2 > 1e-7 ? 1 / norm2 : 0;
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height);
    const split = width * .3, cy = height * .52, gauge = Math.min(height * .33, 112), center = [width * .67, cy] as const, scale = Math.min(width * .18, height * .25);
    ctx.strokeStyle = 'rgba(193,209,207,.2)'; ctx.beginPath(); ctx.moveTo(split, 22); ctx.lineTo(split, height - 22); ctx.stroke();
    ctx.strokeStyle = 'rgba(230,235,233,.35)'; ctx.beginPath(); ctx.moveTo(split * .24, cy); ctx.lineTo(split * .78, cy); ctx.stroke();
    const wx = split * .51 + Math.max(-1.5, Math.min(1.5, w)) * gauge * .62;
    drawArrow2D(ctx, split * .51, cy, wx, cy, '#efbd55', 'w');
    ctx.fillStyle = '#9ba9a8'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText('scalar line', split * .28, cy + 34);
    drawAxes3D(ctx, center, scale);
    drawProjectedArrow(ctx, [x, y, z], center, scale, '#4bdab0', 'Im(q)');
    ctx.fillStyle = '#93a4a5'; ctx.fillText('imaginary 3-space', center[0] - 52, height - 28);
  };
  return <Lab title="把标量部与虚部分开观察" tag="LAB · QUATERNION ANATOMY" metrics={[["|q|", norm.toFixed(3)], ["q q*", norm2.toFixed(3)], ["unit?", Math.abs(norm - 1) < .015 ? 'yes' : 'no']] }>
    <InteractiveCanvas draw={draw} dependencies={[w, x, y, z]} label="四元数标量部、虚部、共轭与模实验" />
    <div className="lab-controls quaternion-controls"><Slider label="标量 w" value={w} min={-1.2} max={1.2} step={.01} onChange={setW} /><Slider label="i 分量 x" value={x} min={-1.2} max={1.2} step={.01} onChange={setX} /><Slider label="j 分量 y" value={y} min={-1.2} max={1.2} step={.01} onChange={setY} /><Slider label="k 分量 z" value={z} min={-1.2} max={1.2} step={.01} onChange={setZ} /></div>
    <div className="quaternion-readout"><code>q = {w.toFixed(2)} {signed(x)}i {signed(y)}j {signed(z)}k</code><code>q* = {w.toFixed(2)} {signed(-x)}i {signed(-y)}j {signed(-z)}k</code><code>q⁻¹ = {inverseScale ? `${(w * inverseScale).toFixed(2)} ${signed(-x * inverseScale)}i ${signed(-y * inverseScale)}j ${signed(-z * inverseScale)}k` : 'undefined'}</code></div>
  </Lab>;
}

export function AxisAngleLab() {
  const [angle, setAngle] = useState(110), [azimuth, setAzimuth] = useState(35), [elevation, setElevation] = useState(28);
  const half = toRad(angle) / 2, az = toRad(azimuth), el = toRad(elevation);
  const axis: Vec3 = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
  const s = Math.sin(half), q = [Math.cos(half), axis[0] * s, axis[1] * s, axis[2] * s];
  const initial: Vec3 = [1, .25, .1], rotated = rotateAroundAxis(initial, axis, toRad(angle));
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const center = [width * .5, height * .53] as const, scale = Math.min(width, height) * .25;
    const glow = ctx.createRadialGradient(center[0], center[1], 5, center[0], center[1], scale * 1.5); glow.addColorStop(0, 'rgba(75,218,176,.13)'); glow.addColorStop(1, 'rgba(17,24,33,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    ctx.beginPath(); ctx.ellipse(center[0], center[1], scale, scale * .52, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(200,214,214,.22)'; ctx.stroke();
    drawAxes3D(ctx, center, scale * .78);
    drawProjectedArrow(ctx, [-axis[0] * 1.35, -axis[1] * 1.35, -axis[2] * 1.35], center, scale, 'rgba(182,155,242,.46)', '', true);
    drawProjectedArrow(ctx, [axis[0] * 1.35, axis[1] * 1.35, axis[2] * 1.35], center, scale, '#b69bf2', 'n̂', true);
    drawProjectedArrow(ctx, initial, center, scale, '#efbd55', 'v', true);
    drawProjectedArrow(ctx, rotated, center, scale, '#4bdab0', 'Rv');
  };
  return <Lab title="轴角与单位四元数同步转换" tag="LAB · AXIS–ANGLE MAP" metrics={[["θ / 2", `${(angle / 2).toFixed(1)}°`], ["|Im q|", Math.abs(s).toFixed(3)], ["|q|", Math.hypot(...q).toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[angle, azimuth, elevation]} label="轴角到单位四元数双向转换实验" />
    <div className="lab-controls"><Slider label="旋转角 θ" value={angle} min={0} max={360} suffix="°" onChange={setAngle} /><Slider label="轴方位 φ" value={azimuth} min={-180} max={180} suffix="°" onChange={setAzimuth} /><Slider label="轴仰角 λ" value={elevation} min={-85} max={85} suffix="°" onChange={setElevation} /></div>
    <div className="quaternion-readout"><code>n̂ = ({axis.map(value => value.toFixed(3)).join(', ')})</code><code>q = {q[0].toFixed(3)} {signed(q[1])}i {signed(q[2])}j {signed(q[3])}k</code></div>
  </Lab>;
}

export function CompositionLab() {
  const [xAngle, setXAngle] = useState(75), [yAngle, setYAngle] = useState(55), [order, setOrder] = useState<'xy' | 'yx'>('xy');
  const source: Vec3 = [.75, .55, .78], a = toRad(xAngle), b = toRad(yAngle);
  const xy = rotateY(rotateX(source, a), b), yx = rotateX(rotateY(source, b), a);
  const dot = xy[0] * yx[0] + xy[1] * yx[1] + xy[2] * yx[2], lengths = Math.hypot(...xy) * Math.hypot(...yx);
  const separation = Math.acos(Math.max(-1, Math.min(1, dot / lengths))) * 180 / Math.PI;
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const cy = height * .53, scale = Math.min(width * .16, height * .23), left = [width * .28, cy] as const, right = [width * .73, cy] as const;
    ctx.fillStyle = '#95a4a4'; ctx.font = '11px ui-monospace, monospace'; ctx.fillText('first X, then Y', left[0] - 54, 25); ctx.fillText('first Y, then X', right[0] - 54, 25);
    for (const center of [left, right]) { drawAxes3D(ctx, center, scale * .72); drawProjectedArrow(ctx, source, center, scale, '#efbd55', 'v', true); }
    drawProjectedArrow(ctx, xy, left, scale, order === 'xy' ? '#4bdab0' : 'rgba(75,218,176,.62)', 'vXY');
    drawProjectedArrow(ctx, yx, right, scale, order === 'yx' ? '#b69bf2' : 'rgba(182,155,242,.62)', 'vYX');
    ctx.strokeStyle = 'rgba(200,213,212,.18)'; ctx.beginPath(); ctx.moveTo(width / 2, 20); ctx.lineTo(width / 2, height - 20); ctx.stroke();
  };
  return <Lab title="交换顺序，终点通常不同" tag="LAB · NON-COMMUTATIVITY" metrics={[["selected", order === 'xy' ? 'qᵧqₓ' : 'qₓqᵧ'], ["result gap", `${separation.toFixed(1)}°`], ["length", Math.hypot(...xy).toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[xAngle, yAngle, order]} label="四元数旋转复合与不可交换性实验" />
    <div className="lab-controls composition-controls"><Slider label="绕 x 角 α" value={xAngle} min={-180} max={180} suffix="°" onChange={setXAngle} /><Slider label="绕 y 角 β" value={yAngle} min={-180} max={180} suffix="°" onChange={setYAngle} /><button className={order === 'xy' ? 'active' : ''} onClick={() => setOrder('xy')}>先 X 后 Y · qᵧqₓ</button><button className={order === 'yx' ? 'active violet' : ''} onClick={() => setOrder('yx')}>先 Y 后 X · qₓqᵧ</button></div>
  </Lab>;
}

export function DoubleCoverLab() {
  const [angle, setAngle] = useState(360), physical = toRad(angle), half = physical / 2, qw = Math.cos(half), qv = Math.sin(half);
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const left = [width * .27, height * .53] as const, right = [width * .73, height * .53] as const, radius = Math.min(width * .16, height * .3);
    ctx.fillStyle = '#99aaa9'; ctx.font = '11px ui-monospace, monospace'; ctx.fillText('physical orientation · SO(3)', left[0] - 78, 26); ctx.fillText('quaternion path · Spin(3)', right[0] - 78, 26);
    for (const center of [left, right]) { ctx.beginPath(); ctx.arc(center[0], center[1], radius, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(213,225,223,.24)'; ctx.stroke(); }
    drawArrow2D(ctx, left[0], left[1], left[0] + radius * Math.cos(-physical), left[1] + radius * Math.sin(-physical), '#4bdab0', 'orientation');
    const qx = right[0] + radius * qw, qy = right[1] - radius * qv;
    ctx.beginPath(); ctx.moveTo(right[0], right[1]); ctx.lineTo(qx, qy); ctx.strokeStyle = '#b69bf2'; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(qx, qy, 6, 0, Math.PI * 2); ctx.fillStyle = '#b69bf2'; ctx.fill();
    ctx.beginPath(); ctx.arc(right[0] - radius * qw, right[1] + radius * qv, 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(182,155,242,.32)'; ctx.fill();
    ctx.fillStyle = '#cbbcf4'; ctx.fillText('q', qx + 9, qy - 5); ctx.fillStyle = '#80769a'; ctx.fillText('−q', right[0] - radius * qw + 8, right[1] + radius * qv - 5);
    ctx.fillStyle = '#93a4a5'; ctx.fillText('0° / 360°', left[0] + radius + 8, left[1] + 4); ctx.fillText('+1', right[0] + radius + 8, right[1] + 4); ctx.fillText('−1', right[0] - radius - 25, right[1] + 4);
  };
  const stage = angle === 0 ? 'identity +q' : angle === 360 ? 'same rotation, −q' : angle === 720 ? 'identity +q again' : 'in transit';
  return <Lab title="姿态转一圈，四元数只走半圈" tag="LAB · DOUBLE COVER" metrics={[["physical", `${angle % 360}°`], ["q", `(${qw.toFixed(2)}, ${qv.toFixed(2)})`], ["state", stage]]}>
    <InteractiveCanvas draw={draw} dependencies={[angle]} label="SO(3) 与 Spin(3) 双覆盖的 720 度路径实验" />
    <div className="lab-controls one-slider"><Slider label="连续转动 θ" value={angle} min={0} max={720} suffix="°" onChange={setAngle} /></div>
  </Lab>;
}

function signed(value: number) {
  return `${value < 0 ? '−' : '+'} ${Math.abs(value).toFixed(2)}`;
}
