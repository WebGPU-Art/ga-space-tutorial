'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawAxes3D, drawDarkGrid, drawProjectedArrow, projectIso, toRad, type Vec3 } from './drawing';
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

export function BladesGradesLab() {
  const [scalar, setScalar] = useState(.55), [vector, setVector] = useState(.9), [bivector, setBivector] = useState(-.68), [trivector, setTrivector] = useState(.42);
  const coefficients = [scalar, vector, bivector, trivector];
  const activeGrades = coefficients.filter(value => Math.abs(value) > .02).length;
  const evenSize = Math.hypot(scalar, bivector), oddSize = Math.hypot(vector, trivector);
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const cell = width / 4, cy = height * .52, size = Math.min(cell * .25, height * .19);
    const colors = ['#efbd55', '#4bdab0', '#b69bf2', '#f07f63'];
    for (let grade = 0; grade < 4; grade++) {
      const cx = cell * (grade + .5), value = coefficients[grade], alpha = .25 + .75 * Math.min(1, Math.abs(value));
      if (grade > 0) { ctx.beginPath(); ctx.moveTo(cell * grade, 24); ctx.lineTo(cell * grade, height - 24); ctx.strokeStyle = 'rgba(205,218,215,.15)'; ctx.stroke(); }
      ctx.globalAlpha = alpha; ctx.strokeStyle = colors[grade]; ctx.fillStyle = colors[grade]; ctx.lineWidth = 2.2;
      if (grade === 0) { ctx.beginPath(); ctx.arc(cx, cy, 8 + Math.abs(value) * 16, 0, Math.PI * 2); ctx.fill(); }
      if (grade === 1) drawArrow2D(ctx, cx - size * .7, cy + size * .45, cx + size * .8 * value, cy - size * .55 * value, colors[grade], 'v');
      if (grade === 2) { const sign = value < 0 ? -1 : 1; ctx.beginPath(); ctx.moveTo(cx - size, cy + size * .45); ctx.lineTo(cx, cy - size * .58 * sign); ctx.lineTo(cx + size, cy - size * .45); ctx.lineTo(cx, cy + size * .58 * sign); ctx.closePath(); ctx.fillStyle = value < 0 ? 'rgba(240,127,99,.25)' : 'rgba(182,155,242,.28)'; ctx.fill(); ctx.stroke(); }
      if (grade === 3) { const r = size * (.55 + .25 * Math.abs(value)); ctx.strokeRect(cx - r, cy - r * .7, r * 1.45, r * 1.35); ctx.strokeRect(cx - r * .55, cy - r, r * 1.45, r * 1.35); ctx.beginPath(); for (const [x1,y1,x2,y2] of [[cx-r,cy-r*.7,cx-r*.55,cy-r],[cx+r*.45,cy-r*.7,cx+r*.9,cy-r],[cx-r,cy+r*.65,cx-r*.55,cy+r*.35],[cx+r*.45,cy+r*.65,cx+r*.9,cy+r*.35]]) { ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); } ctx.stroke(); }
      ctx.globalAlpha = 1; ctx.fillStyle = '#a4b1b0'; ctx.font = '10px ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.fillText(`grade ${grade}`, cx, 26); ctx.fillStyle = colors[grade]; ctx.fillText(value.toFixed(2), cx, height - 26); ctx.textAlign = 'start';
    }
  };
  return <LabFrame title="多向量把不同 grade 放在同一个容器中" tag="LAB · GRADE INSPECTOR" metrics={[["active grades", String(activeGrades)], ["|even|", evenSize.toFixed(3)], ["|odd|", oddSize.toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[scalar, vector, bivector, trivector]} label="标量、向量、双向量与三向量分量检查器" />
    <div className="lab-controls"><Slider label="⟨M⟩₀ · scalar" value={scalar} min={-1} max={1} step={.01} onChange={setScalar} /><Slider label="⟨M⟩₁ · vector" value={vector} min={-1} max={1} step={.01} onChange={setVector} /><Slider label="⟨M⟩₂ · bivector" value={bivector} min={-1} max={1} step={.01} onChange={setBivector} /><Slider label="⟨M⟩₃ · trivector" value={trivector} min={-1} max={1} step={.01} onChange={setTrivector} /></div>
    <div className="quaternion-readout"><code>M = {scalar.toFixed(2)} + {vector.toFixed(2)}e₁ {signed(bivector)}e₁₂ {signed(trivector)}e₁₂₃</code><code>M_even = ⟨M⟩₀ + ⟨M⟩₂ &nbsp;·&nbsp; M_odd = ⟨M⟩₁ + ⟨M⟩₃</code></div>
  </LabFrame>;
}

export function GeometricProductLab() {
  const [lengthA, setLengthA] = useState(1.25), [lengthB, setLengthB] = useState(1.05), [angle, setAngle] = useState(58), [swapped, setSwapped] = useState(false);
  const theta = toRad(angle), dot = lengthA * lengthB * Math.cos(theta), baseWedge = lengthA * lengthB * Math.sin(theta), wedge = swapped ? -baseWedge : baseWedge;
  const firstAngle = swapped ? theta : 0, secondAngle = swapped ? 0 : theta;
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const cx = width * .28, cy = height * .62, unit = Math.min(width, height) * .23;
    const firstLength = swapped ? lengthB : lengthA, secondLength = swapped ? lengthA : lengthB;
    drawArrow2D(ctx, cx, cy, cx + firstLength * unit * Math.cos(firstAngle), cy - firstLength * unit * Math.sin(firstAngle), '#efbd55', swapped ? 'b' : 'a');
    drawArrow2D(ctx, cx, cy, cx + secondLength * unit * Math.cos(secondAngle), cy - secondLength * unit * Math.sin(secondAngle), '#4bdab0', swapped ? 'a' : 'b');
    ctx.beginPath(); ctx.arc(cx, cy, 30, -firstAngle, -secondAngle, secondAngle > firstAngle); ctx.strokeStyle = '#b69bf2'; ctx.stroke();
    const meterX = width * .64, meterWidth = width * .27, centerY = height * .5, max = Math.max(lengthA * lengthB, .01);
    ctx.beginPath(); ctx.moveTo(meterX, 45); ctx.lineTo(meterX, height - 42); ctx.strokeStyle = 'rgba(210,222,219,.28)'; ctx.stroke();
    const bar = (value: number, y: number, color: string, label: string) => { ctx.fillStyle = color; ctx.fillRect(meterX, y - 8, value / max * meterWidth, 16); ctx.fillStyle = '#a7b3b2'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText(label, meterX, y - 15); ctx.fillText(value.toFixed(3), meterX + 8, y + 4); };
    bar(dot, centerY - 46, '#4bdab0', 'scalar · a·b'); bar(wedge, centerY + 48, wedge < 0 ? '#f07f63' : '#b69bf2', 'bivector · a∧b');
  };
  return <LabFrame title="一次乘法同时保留对齐与定向平面" tag="LAB · GEOMETRIC PRODUCT" metrics={[["a·b", dot.toFixed(3)], ["a∧b", `${wedge.toFixed(3)}e₁₂`], ["|ab|", (lengthA * lengthB).toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[lengthA, lengthB, angle, swapped]} label="几何积分解为点积与外积的实验" />
    <div className="lab-controls outer-controls"><Slider label="|a|" value={lengthA} min={.25} max={1.7} step={.01} onChange={setLengthA} /><Slider label="|b|" value={lengthB} min={.25} max={1.7} step={.01} onChange={setLengthB} /><Slider label="夹角 θ" value={angle} min={0} max={180} suffix="°" onChange={setAngle} /><button className={swapped ? 'active danger' : ''} onClick={() => setSwapped(value => !value)}>{swapped ? '当前乘积：ba' : '当前乘积：ab'}</button></div>
    <div className="quaternion-readout"><code>{swapped ? 'ba' : 'ab'} = {dot.toFixed(3)} {signed(wedge)}e₁₂</code></div>
  </LabFrame>;
}

type Involution = 'identity' | 'reverse' | 'grade' | 'clifford';
const involutionSigns: Record<Involution, readonly [number, number, number, number]> = {
  identity: [1, 1, 1, 1], reverse: [1, 1, -1, -1], grade: [1, -1, 1, -1], clifford: [1, -1, -1, 1],
};

export function InvolutionsLab() {
  const [operation, setOperation] = useState<Involution>('reverse');
  const values = [.72, -.92, .64, -.5] as const, signs = involutionSigns[operation];
  const labels: Record<Involution, string> = { identity: 'M', reverse: 'M̃', grade: 'M̂', clifford: 'M̄' };
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const left = width * .25, right = width * .72, row = height / 5, maxWidth = width * .16;
    ctx.fillStyle = '#94a4a3'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText('input M', left - 22, 22); ctx.fillText(`output ${labels[operation]}`, right - 28, 22);
    for (let grade = 0; grade < 4; grade++) {
      const y = row * (grade + 1), input = values[grade], output = input * signs[grade];
      ctx.fillStyle = '#9dacab'; ctx.fillText(`grade ${grade}`, 16, y + 4);
      ctx.fillStyle = input >= 0 ? '#4bdab0' : '#f07f63'; ctx.fillRect(left, y - 8, input * maxWidth, 16);
      ctx.fillStyle = output >= 0 ? '#b69bf2' : '#f07f63'; ctx.fillRect(right, y - 8, output * maxWidth, 16);
      ctx.fillStyle = signs[grade] > 0 ? '#75e4c3' : '#f39780'; ctx.fillText(signs[grade] > 0 ? 'kept +' : 'flipped −', width * .47, y + 4);
      ctx.beginPath(); ctx.moveTo(left - maxWidth, y + 13); ctx.lineTo(left + maxWidth, y + 13); ctx.moveTo(right - maxWidth, y + 13); ctx.lineTo(right + maxWidth, y + 13); ctx.strokeStyle = 'rgba(205,218,215,.12)'; ctx.stroke();
    }
  };
  return <LabFrame title="三种 involution 由 grade 决定符号" tag="LAB · INVOLUTIONS" metrics={[["operation", labels[operation]], ["signs k=0…3", signs.map(sign => sign > 0 ? '+' : '−').join(' ')], ["involution²", 'identity']] }>
    <InteractiveCanvas draw={draw} dependencies={[operation]} label="reverse、grade involution 与 Clifford conjugation 符号实验" />
    <div className="operation-tabs">{(Object.keys(involutionSigns) as Involution[]).map(key => <button key={key} className={operation === key ? 'active' : ''} onClick={() => setOperation(key)}><b>{labels[key]}</b><span>{key}</span></button>)}</div>
    <div className="quaternion-readout"><code>M = 0.72 − 0.92e₁ + 0.64e₁₂ − 0.50e₁₂₃</code><code>{labels[operation]} = {formatTerms(values.map((value, grade) => value * signs[grade]))}</code></div>
  </LabFrame>;
}

export function DualityLab() {
  const [angle, setAngle] = useState(68), [lengthA, setLengthA] = useState(1.15), [lengthB, setLengthB] = useState(.95), [orientation, setOrientation] = useState<1 | -1>(1);
  const theta = toRad(angle), a: Vec3 = [lengthA, 0, 0], b: Vec3 = [lengthB * Math.cos(theta), lengthB * Math.sin(theta), 0];
  const wedge = lengthA * lengthB * Math.sin(theta), dual = orientation * wedge;
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const left = [width * .31, height * .58] as const, right = [width * .73, height * .58] as const, scale = Math.min(width, height) * .2;
    drawAxes3D(ctx, left, scale * .72); drawAxes3D(ctx, right, scale * .72);
    const origin = projectIso([0,0,0], left[0], left[1], scale), pa = projectIso(a, left[0], left[1], scale), pb = projectIso(b, left[0], left[1], scale), sum = projectIso([a[0]+b[0],a[1]+b[1],0], left[0], left[1], scale);
    ctx.beginPath(); ctx.moveTo(...origin); ctx.lineTo(...pa); ctx.lineTo(...sum); ctx.lineTo(...pb); ctx.closePath(); ctx.fillStyle = wedge >= 0 ? 'rgba(182,155,242,.24)' : 'rgba(240,127,99,.22)'; ctx.fill(); ctx.strokeStyle = '#b69bf2'; ctx.stroke();
    drawProjectedArrow(ctx, a, left, scale, '#efbd55', 'a'); drawProjectedArrow(ctx, b, left, scale, '#4bdab0', 'b');
    drawProjectedArrow(ctx, [0,0,dual], right, scale * .72, dual >= 0 ? '#4bdab0' : '#f07f63', '−I(a∧b)');
    ctx.fillStyle = '#9ba9a8'; ctx.font = '10px ui-monospace, monospace'; ctx.fillText('bivector · oriented plane', left[0] - 72, 24); ctx.fillText('dual vector · normal', right[0] - 61, 24);
    ctx.beginPath(); ctx.moveTo(width * .52, 25); ctx.lineTo(width * .52, height - 25); ctx.strokeStyle = 'rgba(205,218,215,.17)'; ctx.stroke();
  };
  return <LabFrame title="对偶把子空间映到它的正交补" tag="LAB · DUALITY" metrics={[["a∧b", `${wedge.toFixed(3)}e₁₂`], ["−I(a∧b)", `${dual.toFixed(3)}e₃`], ["I", orientation > 0 ? '+e₁₂₃' : '−e₁₂₃']] }>
    <InteractiveCanvas draw={draw} dependencies={[angle, lengthA, lengthB, orientation]} label="三维外积双向量与叉积对偶向量实验" />
    <div className="lab-controls duality-controls"><Slider label="夹角 θ" value={angle} min={-170} max={170} suffix="°" onChange={setAngle} /><Slider label="|a|" value={lengthA} min={.3} max={1.5} step={.01} onChange={setLengthA} /><Slider label="|b|" value={lengthB} min={.3} max={1.5} step={.01} onChange={setLengthB} /><button className={orientation < 0 ? 'active danger' : ''} onClick={() => setOrientation(value => value === 1 ? -1 : 1)}>{orientation > 0 ? '空间定向 I = +e₁₂₃' : '空间定向 I = −e₁₂₃'}</button></div>
  </LabFrame>;
}

function signed(value: number) { return `${value < 0 ? '−' : '+'} ${Math.abs(value).toFixed(2)}`; }
function formatTerms(values: number[]) {
  const bases = ['', 'e₁', 'e₁₂', 'e₁₂₃'];
  return values.map((value, index) => `${index === 0 ? value.toFixed(2) : signed(value)}${bases[index]}`).join(' ');
}
