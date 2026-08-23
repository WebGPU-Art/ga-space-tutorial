'use client';

import { useMemo, useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';

const toRad = (degrees: number) => degrees * Math.PI / 180;

export function QuaternionRotationLab() {
  const [angle, setAngle] = useState(64);
  const [tilt, setTilt] = useState(25);
  const [azimuth, setAzimuth] = useState(30);
  const [elevation, setElevation] = useState(35);

  const quaternion = useMemo(() => {
    const half = toRad(angle) / 2, az = toRad(azimuth), el = toRad(elevation), s = Math.sin(half);
    return { w: Math.cos(half), x: Math.cos(el) * Math.cos(az) * s, y: Math.cos(el) * Math.sin(az) * s, z: Math.sin(el) * s };
  }, [angle, azimuth, elevation]);

  const draw = ({ ctx, width, height }: CanvasFrame) => {
    const cx = width * .49, cy = height * .52, scale = Math.min(width, height) * .24;
    const a = toRad(angle), t = toRad(tilt), az = toRad(azimuth), el = toRad(elevation);
    const project = (x: number, y: number, z: number) => [cx + (x - (y * Math.cos(t) - z * Math.sin(t)) * .72) * scale, cy - ((y * Math.sin(t) + z * Math.cos(t)) + x * .28) * scale] as const;
    const line = (from: number[], to: number[], color: string, lineWidth = 1, dash: number[] = []) => {
      const p = project(from[0], from[1], from[2]), q = project(to[0], to[1], to[2]);
      ctx.beginPath(); ctx.setLineDash(dash); ctx.moveTo(...p); ctx.lineTo(...q); ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke(); ctx.setLineDash([]);
    };
    ctx.fillStyle = '#111821'; ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, scale * 2.2); glow.addColorStop(0, 'rgba(47,230,181,.14)'); glow.addColorStop(1, 'rgba(15,23,32,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    for (let i = -3; i <= 3; i++) { line([-2.6, i * .5, 0], [2.6, i * .5, 0], 'rgba(123,145,158,.14)'); line([i * .5, -2.6, 0], [i * .5, 2.6, 0], 'rgba(123,145,158,.11)'); }
    line([-2.3, 0, 0], [2.35, 0, 0], 'rgba(230,240,242,.5)', 1.2); line([0, -2.2, 0], [0, 2.25, 0], 'rgba(230,240,242,.5)', 1.2); line([0, 0, -1.85], [0, 0, 1.85], 'rgba(230,240,242,.5)', 1.2);
    const axis = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
    const initial = [1.38, .45, .38], cross = [axis[1] * initial[2] - axis[2] * initial[1], axis[2] * initial[0] - axis[0] * initial[2], axis[0] * initial[1] - axis[1] * initial[0]];
    const dot = axis[0] * initial[0] + axis[1] * initial[1] + axis[2] * initial[2];
    const rotated = initial.map((value, i) => value * Math.cos(a) + cross[i] * Math.sin(a) + axis[i] * dot * (1 - Math.cos(a)));
    line(axis.map(value => -value * 2.1), axis.map(value => value * 2.1), 'rgba(182,155,242,.9)', 1.7, [4, 5]);
    line([0, 0, 0], initial, 'rgba(245,184,79,.55)', 2, [5, 5]); line([0, 0, 0], rotated, '#50e6bd', 3);
    const end = project(...rotated), before = project(...initial), axisEnd = project(...axis.map(value => value * 2.1));
    ctx.beginPath(); ctx.arc(...end, 6, 0, Math.PI * 2); ctx.fillStyle = '#50e6bd'; ctx.fill();
    ctx.font = '12px ui-monospace, monospace'; ctx.fillStyle = '#aebec4'; ctx.fillText('v', before[0] + 8, before[1] - 5); ctx.fillStyle = '#8af0d1'; ctx.fillText('qvq⁻¹', end[0] + 9, end[1] - 8); ctx.fillStyle = '#c9baf7'; ctx.fillText('n̂', axisEnd[0] + 7, axisEnd[1] - 4);
  };

  const shader = `@vertex fn vertexMain(@builtin(vertex_index) i:u32)->@builtin(position) vec4f { var p=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.)); return vec4f(p[i],0.,1.); } @fragment fn fragmentMain(@builtin(position) p:vec4f)->@location(0) vec4f { let phase:f32=${(angle / 360).toFixed(4)}; let axis:f32=${((azimuth + elevation) / 360).toFixed(4)}; let u=(p.x*cos(phase*6.283)+p.y*sin(phase*6.283))/42.; let v=(p.y*cos(axis*6.283)-p.x*sin(axis*6.283))/42.; let g=step(fract(u),.018)+step(fract(v),.018); return vec4f(.16,.95,.73,g*.07); }`;

  return <section className="rotation-lab">
    <div className="lab-heading"><div><span>INTERACTIVE LAB · 1.3</span><h2>绕任意轴旋转</h2><p>拖动参数，公式、旋转轴和向量同步更新。</p></div><span className="webgpu-badge"><i /> WebGPU + Canvas</span></div>
    <div className="lab-visual">
      <InteractiveCanvas draw={draw} shaderCode={shader} dependencies={[angle, tilt, azimuth, elevation]} label="四元数绕任意轴旋转实验" />
      <div className="lab-readout"><span>ANGLE</span><b>{String(angle).padStart(3, '0')}°</b><small>axis · n̂</small></div>
    </div>
    <div className="lab-controls">
      <Slider label="旋转角 θ" value={angle} min={0} max={360} onChange={setAngle} />
      <Slider label="观察倾角" value={tilt} min={-35} max={65} onChange={setTilt} />
      <Slider label="旋转轴方位 φ" value={azimuth} min={-180} max={180} onChange={setAzimuth} />
      <Slider label="旋转轴仰角 λ" value={elevation} min={-85} max={85} onChange={setElevation} />
    </div>
    <figure className="equation-card"><code>q = {quaternion.w.toFixed(3)} + ({quaternion.x.toFixed(3)})i + ({quaternion.y.toFixed(3)})j + ({quaternion.z.toFixed(3)})k</code><figcaption>q = cos(θ/2) + n̂ sin(θ/2) · 紫色虚线为单位旋转轴</figcaption></figure>
  </section>;
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label><span>{label}</span><output>{value}°</output><input aria-label={label} type="range" min={min} max={max} value={value} onChange={event => onChange(Number(event.target.value))} /></label>;
}
