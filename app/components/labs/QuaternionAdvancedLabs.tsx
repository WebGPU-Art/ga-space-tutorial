'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawDarkGrid, toRad } from './drawing';
import { LabFrame, Slider } from './LabChrome';

export function SlerpLab() {
  const [targetAngle, setTargetAngle] = useState(150);
  const [t, setT] = useState(.28);
  const omega = toRad(targetAngle) / 2;
  const q1 = [Math.cos(omega), Math.sin(omega)];
  const lw = (1 - t) + t * q1[0], lv = t * q1[1], ln = Math.hypot(lw, lv);
  const nlerpAngle = 2 * Math.atan2(lv / ln, lw / ln);
  const slerpAngle = toRad(targetAngle) * t;
  const denominator = lw * lw + lv * lv;
  const speedRatio = Math.sin(omega) / (omega * denominator);

  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height);
    const pad = { left: 54, right: 30, top: 35, bottom: 46 };
    const graphWidth = width - pad.left - pad.right, graphHeight = height - pad.top - pad.bottom;
    const point = (x: number, y: number) => [pad.left + x * graphWidth, pad.top + (1 - y) * graphHeight] as const;
    ctx.strokeStyle = 'rgba(214,225,222,.38)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(...point(0, 0)); ctx.lineTo(...point(1, 0)); ctx.moveTo(...point(0, 0)); ctx.lineTo(...point(0, 1)); ctx.stroke();
    for (let i = 1; i < 4; i++) { const f = i / 4; ctx.beginPath(); ctx.moveTo(...point(f, 0)); ctx.lineTo(...point(f, 1)); ctx.moveTo(...point(0, f)); ctx.lineTo(...point(1, f)); ctx.strokeStyle = 'rgba(180,196,194,.1)'; ctx.stroke(); }
    const curve = (kind: 'slerp' | 'nlerp', color: string) => {
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        const y = kind === 'slerp' ? u : Math.atan2(u * q1[1], (1 - u) + u * q1[0]) / omega;
        const p = point(u, y); if (i === 0) ctx.moveTo(...p); else ctx.lineTo(...p);
      }
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
    };
    curve('slerp', '#4bdab0'); curve('nlerp', '#b69bf2');
    const sp = point(t, t), np = point(t, nlerpAngle / toRad(targetAngle));
    ctx.beginPath(); ctx.moveTo(...point(t, 0)); ctx.lineTo(...point(t, 1)); ctx.strokeStyle = 'rgba(239,189,85,.5)'; ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]);
    for (const [p, color] of [[sp, '#4bdab0'], [np, '#b69bf2']] as const) { ctx.beginPath(); ctx.arc(...p, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); }
    ctx.fillStyle = '#91a2a1'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText('interpolation parameter t', width / 2 - 66, height - 15);
    ctx.save(); ctx.translate(15, height / 2 + 55); ctx.rotate(-Math.PI / 2); ctx.fillText('fraction of physical angle', 0, 0); ctx.restore();
    ctx.fillStyle = '#4bdab0'; ctx.fillText('SLERP · constant speed', width - 173, 20); ctx.fillStyle = '#b69bf2'; ctx.fillText('NLERP · varying speed', 55, 20);
  };

  return <LabFrame title="同一终点，不同的时间参数化" tag="LAB · SLERP VS NLERP" metrics={[["SLERP θ", `${(slerpAngle * 180 / Math.PI).toFixed(1)}°`], ["NLERP θ", `${(nlerpAngle * 180 / Math.PI).toFixed(1)}°`], ["NLERP speed", `${speedRatio.toFixed(2)}×`]]}>
    <InteractiveCanvas draw={draw} dependencies={[targetAngle, t]} label="SLERP 与归一化线性插值角速度对照实验" />
    <div className="lab-controls"><Slider label="目标姿态夹角" value={targetAngle} min={20} max={170} suffix="°" onChange={setTargetAngle} /><Slider label="插值参数 t" value={t} min={0} max={1} step={.01} onChange={setT} /></div>
    <div className="quaternion-readout"><code>SLERP progress = {t.toFixed(2)} · θ</code><code>NLERP q(t) = normalize((1−t)q₀ + tq₁)</code></div>
  </LabFrame>;
}

export function QuaternionNumericsLab() {
  const [steps, setSteps] = useState(2400);
  const [driftPpm, setDriftPpm] = useState(180);
  const [interval, setInterval] = useState(120);
  const [renormalize, setRenormalize] = useState(true);
  const growth = 1 + driftPpm * 1e-6, logGrowth = Math.log(growth);
  const effectiveSteps = renormalize ? steps % interval : steps;
  const norm = Math.exp(effectiveSteps * logGrowth), rawVectorLength = norm * norm;

  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height);
    const left = 50, right = width - 34, top = 34, bottom = height - 43, graphWidth = right - left, graphHeight = bottom - top, mid = (top + bottom) / 2;
    ctx.beginPath(); ctx.moveTo(left, mid); ctx.lineTo(right, mid); ctx.strokeStyle = 'rgba(215,225,223,.42)'; ctx.stroke();
    const maxLog = Math.max(Math.abs(logGrowth) * (renormalize ? interval : Math.max(steps, 1)), .0001);
    ctx.beginPath();
    const samples = Math.max(2, Math.min(600, steps || 2));
    for (let i = 0; i <= samples; i++) {
      const n = steps * i / samples;
      const sinceNormalize = renormalize ? n % interval : n;
      const logNorm = sinceNormalize * logGrowth;
      const x = left + graphWidth * i / samples, y = mid - logNorm / maxLog * graphHeight * .42;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = renormalize ? '#4bdab0' : '#f07f63'; ctx.lineWidth = 2.3; ctx.stroke();
    ctx.fillStyle = '#93a3a2'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText('multiplication count', width / 2 - 52, height - 15); ctx.fillText('log |q| = 0', 8, mid + 3);
    ctx.fillStyle = renormalize ? '#72e2c0' : '#f39780'; ctx.fillText(renormalize ? `normalize every ${interval} steps` : 'no normalization', left, 20);
    const gaugeX = right - 9, gaugeTop = top + 12, gaugeBottom = bottom - 12;
    ctx.beginPath(); ctx.moveTo(gaugeX, gaugeTop); ctx.lineTo(gaugeX, gaugeBottom); ctx.strokeStyle = 'rgba(220,229,227,.25)'; ctx.stroke();
    const gaugeY = mid - Math.max(-1, Math.min(1, Math.log(Math.max(rawVectorLength, 1e-10)) / (maxLog * 2))) * graphHeight * .35;
    ctx.beginPath(); ctx.arc(gaugeX, gaugeY, 5, 0, Math.PI * 2); ctx.fillStyle = '#efbd55'; ctx.fill();
  };

  return <LabFrame title="累计误差会把单位四元数推离 S³" tag="LAB · NUMERICAL DRIFT" metrics={[["|q|", norm.toFixed(6)], ["raw |v′|", rawVectorLength.toFixed(6)], ["policy", renormalize ? `every ${interval}` : 'never']] }>
    <InteractiveCanvas draw={draw} dependencies={[steps, driftPpm, interval, renormalize]} label="四元数累计乘法漂移与重归一化实验" />
    <div className="lab-controls drift-controls"><Slider label="累计乘法次数" value={steps} min={0} max={5000} step={10} onChange={setSteps} /><Slider label="每步尺度误差" value={driftPpm} min={-500} max={500} step={10} suffix=" ppm" onChange={setDriftPpm} /><Slider label="归一化间隔" value={interval} min={20} max={500} step={10} onChange={setInterval} /><button className={renormalize ? 'active' : 'danger'} onClick={() => setRenormalize(value => !value)}>{renormalize ? '已启用重归一化' : '未启用重归一化'}</button></div>
  </LabFrame>;
}
