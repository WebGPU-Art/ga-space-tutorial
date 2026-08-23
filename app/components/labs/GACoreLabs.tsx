'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid, toRad } from './drawing';
import { LabFrame, Slider } from './LabChrome';

type SignaturePreset = 'euclidean' | 'lorentz' | 'degenerate';

const signatures: Record<SignaturePreset, { squares: readonly [number, number, number]; label: string; name: string }> = {
  euclidean: { squares: [1, 1, 1], label: 'Cl(3,0,0)', name: 'Euclidean' },
  lorentz: { squares: [1, 1, -1], label: 'Cl(2,1,0)', name: 'Lorentzian' },
  degenerate: { squares: [1, 1, 0], label: 'Cl(2,0,1)', name: 'degenerate' },
};

export function MetricSignatureLab() {
  const [preset, setPreset] = useState<SignaturePreset>('lorentz');
  const [x, setX] = useState(1.15), [y, setY] = useState(.35), [z, setZ] = useState(.82);
  const signature = signatures[preset], [s1, s2, s3] = signature.squares;
  const square = s1 * x * x + s2 * y * y + s3 * z * z;
  const kind = square > .015 ? 'positive' : square < -.015 ? 'negative' : 'null';
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const cx = width * .5, cy = height * .53, unit = Math.min(width, height) * .22;
    ctx.beginPath(); ctx.moveTo(25, cy); ctx.lineTo(width - 25, cy); ctx.moveTo(cx, 22); ctx.lineTo(cx, height - 24); ctx.strokeStyle = 'rgba(215,225,223,.42)'; ctx.stroke();
    const locusColor = preset === 'euclidean' ? '#4bdab0' : preset === 'lorentz' ? '#b69bf2' : '#efbd55';
    if (preset === 'euclidean') {
      ctx.beginPath(); ctx.arc(cx, cy, unit, 0, Math.PI * 2); ctx.strokeStyle = locusColor; ctx.lineWidth = 2; ctx.stroke();
    } else if (preset === 'lorentz') {
      for (const sign of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const zv = -1.7 + 3.4 * i / 100, xv = sign * Math.sqrt(1 + zv * zv);
          const px = cx + xv * unit, py = cy - zv * unit;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = locusColor; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(cx - unit * 1.75, cy + unit * 1.75); ctx.lineTo(cx + unit * 1.75, cy - unit * 1.75); ctx.moveTo(cx - unit * 1.75, cy - unit * 1.75); ctx.lineTo(cx + unit * 1.75, cy + unit * 1.75); ctx.strokeStyle = 'rgba(240,127,99,.38)'; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
    } else {
      for (const sign of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + sign * unit, 25); ctx.lineTo(cx + sign * unit, height - 25); ctx.strokeStyle = locusColor; ctx.lineWidth = 2; ctx.stroke(); }
    }
    drawArrow2D(ctx, cx, cy, cx + x * unit, cy - z * unit, kind === 'negative' ? '#f07f63' : kind === 'null' ? '#efbd55' : '#4bdab0', 'v');
    ctx.fillStyle = '#93a4a3'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText('e₁', width - 38, cy - 8); ctx.fillText(`e₃ · e₃²=${s3}`, cx + 8, 22); ctx.fillText('unit locus in span{e₁,e₃}', 24, height - 16);
  };
  return <LabFrame title="改变基向量的平方，空间测量随之改变" tag="LAB · METRIC SIGNATURE" metrics={[["signature", signature.label], ["v²", square.toFixed(3)], ["type", kind]]}>
    <InteractiveCanvas draw={draw} dependencies={[preset, x, y, z]} label="欧氏、Lorentz 与退化度量 signature 对照实验" />
    <div className="metric-presets">{(Object.keys(signatures) as SignaturePreset[]).map(key => <button key={key} className={preset === key ? 'active' : ''} onClick={() => setPreset(key)}><b>{signatures[key].label}</b><span>{signatures[key].name}</span></button>)}</div>
    <div className="lab-controls"><Slider label="e₁ 分量 x" value={x} min={-1.7} max={1.7} step={.01} onChange={setX} /><Slider label="e₂ 分量 y" value={y} min={-1.7} max={1.7} step={.01} onChange={setY} /><Slider label="e₃ 分量 z" value={z} min={-1.7} max={1.7} step={.01} onChange={setZ} /></div>
  </LabFrame>;
}

export function OuterProductLab() {
  const [lengthA, setLengthA] = useState(1.2), [lengthB, setLengthB] = useState(1), [angle, setAngle] = useState(62), [swapped, setSwapped] = useState(false);
  const base = toRad(15), theta = toRad(angle);
  const av = [lengthA * Math.cos(base), lengthA * Math.sin(base)] as const;
  const bv = [lengthB * Math.cos(base + theta), lengthB * Math.sin(base + theta)] as const;
  const first = swapped ? bv : av, second = swapped ? av : bv;
  const coefficient = first[0] * second[1] - first[1] * second[0], area = Math.abs(coefficient);
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const cx = width * .34, cy = height * .68, unit = Math.min(width, height) * .25;
    const aEnd = [cx + first[0] * unit, cy - first[1] * unit] as const;
    const bEnd = [cx + second[0] * unit, cy - second[1] * unit] as const;
    const sum = [cx + (first[0] + second[0]) * unit, cy - (first[1] + second[1]) * unit] as const;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(...aEnd); ctx.lineTo(...sum); ctx.lineTo(...bEnd); ctx.closePath();
    ctx.fillStyle = coefficient >= 0 ? 'rgba(75,218,176,.19)' : 'rgba(240,127,99,.2)'; ctx.fill(); ctx.strokeStyle = coefficient >= 0 ? '#4bdab0' : '#f07f63'; ctx.lineWidth = 1.5; ctx.stroke();
    drawArrow2D(ctx, cx, cy, ...aEnd, '#efbd55', swapped ? 'b · first' : 'a · first');
    drawArrow2D(ctx, cx, cy, ...bEnd, '#b69bf2', swapped ? 'a · second' : 'b · second');
    ctx.beginPath(); ctx.arc(cx, cy, 34, -base, -(base + theta), true); ctx.strokeStyle = coefficient >= 0 ? '#4bdab0' : '#f07f63'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#94a5a4'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText(`oriented area = ${coefficient.toFixed(3)} e₁₂`, width * .61, height * .33); ctx.fillText(swapped ? 'b ∧ a' : 'a ∧ b', width * .67, height * .42);
  };
  return <LabFrame title="外积记录面积、平面和顺序" tag="LAB · OUTER PRODUCT" metrics={[["|a∧b|", area.toFixed(3)], ["e₁₂ coeff", coefficient.toFixed(3)], ["orientation", coefficient >= 0 ? 'positive' : 'negative']] }>
    <InteractiveCanvas draw={draw} dependencies={[lengthA, lengthB, angle, swapped]} label="两向量外积的定向面积实验" />
    <div className="lab-controls outer-controls"><Slider label="|a|" value={lengthA} min={.25} max={1.6} step={.01} onChange={setLengthA} /><Slider label="|b|" value={lengthB} min={.25} max={1.6} step={.01} onChange={setLengthB} /><Slider label="夹角 θ" value={angle} min={0} max={180} suffix="°" onChange={setAngle} /><button className={swapped ? 'active danger' : ''} onClick={() => setSwapped(value => !value)}>{swapped ? '当前顺序：b ∧ a' : '当前顺序：a ∧ b'}</button></div>
  </LabFrame>;
}
