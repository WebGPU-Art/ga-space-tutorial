'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawAxes3D, drawDarkGrid, drawProjectedArrow, projectIso, rotateAroundAxis, toRad, type Vec3 } from './drawing';
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

export function ProjectionRejectionLab() {
  const [azimuth, setAzimuth] = useState(38), [elevation, setElevation] = useState(48), [planeTilt, setPlaneTilt] = useState(24), [length, setLength] = useState(1.35);
  const az = toRad(azimuth), el = toRad(elevation), tilt = toRad(planeTilt);
  const vector: Vec3 = [length * Math.cos(el) * Math.cos(az), length * Math.cos(el) * Math.sin(az), length * Math.sin(el)];
  const planeW: Vec3 = [0, Math.cos(tilt), Math.sin(tilt)], normal: Vec3 = [0, -Math.sin(tilt), Math.cos(tilt)];
  const normalAmount = vector[0] * normal[0] + vector[1] * normal[1] + vector[2] * normal[2];
  const rejection: Vec3 = [normal[0] * normalAmount, normal[1] * normalAmount, normal[2] * normalAmount];
  const projection: Vec3 = [vector[0] - rejection[0], vector[1] - rejection[1], vector[2] - rejection[2]];
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const center = [width * .5, height * .57] as const, scale = Math.min(width, height) * .22;
    drawAxes3D(ctx, center, scale * .7);
    const corners: Vec3[] = [[-1.45,-planeW[1]*1.2,-planeW[2]*1.2],[1.45,-planeW[1]*1.2,-planeW[2]*1.2],[1.45,planeW[1]*1.2,planeW[2]*1.2],[-1.45,planeW[1]*1.2,planeW[2]*1.2]];
    ctx.beginPath(); corners.forEach((corner,index)=>{const p=projectIso(corner,center[0],center[1],scale); if(index===0)ctx.moveTo(...p);else ctx.lineTo(...p);}); ctx.closePath(); ctx.fillStyle='rgba(182,155,242,.16)';ctx.fill();ctx.strokeStyle='rgba(182,155,242,.62)';ctx.stroke();
    drawProjectedArrow(ctx, vector, center, scale, '#efbd55', 'v'); drawProjectedArrow(ctx, projection, center, scale, '#4bdab0', 'Pₐ(v)');
    const pp=projectIso(projection,center[0],center[1],scale), vp=projectIso(vector,center[0],center[1],scale); drawArrow2D(ctx,...pp,...vp,'#f07f63','Pₐ⊥(v)');
    ctx.fillStyle='#9aa9a8';ctx.font='10px ui-monospace, monospace';ctx.fillText('blade A · purple plane',20,23);
  };
  return <LabFrame title="向量被唯一拆成子空间内与子空间外" tag="LAB · PROJECTION / REJECTION" metrics={[["|projection|",Math.hypot(...projection).toFixed(3)],["|rejection|",Math.abs(normalAmount).toFixed(3)],["orthogonality",Math.abs(projection[0]*rejection[0]+projection[1]*rejection[1]+projection[2]*rejection[2])<1e-8?'yes':'no']] }>
    <InteractiveCanvas draw={draw} dependencies={[azimuth,elevation,planeTilt,length]} label="向量对平面 blade 的投影与拒绝实验" />
    <div className="lab-controls"><Slider label="向量方位" value={azimuth} min={-180} max={180} suffix="°" onChange={setAzimuth}/><Slider label="向量仰角" value={elevation} min={-85} max={85} suffix="°" onChange={setElevation}/><Slider label="平面倾角" value={planeTilt} min={-65} max={65} suffix="°" onChange={setPlaneTilt}/><Slider label="|v|" value={length} min={.35} max={1.7} step={.01} onChange={setLength}/></div>
  </LabFrame>;
}

export function JoinMeetLab() {
  const [dihedral,setDihedral]=useState(52),[azimuth,setAzimuth]=useState(28),[extent,setExtent]=useState(1.2);
  const tilt=toRad(dihedral),az=toRad(azimuth),axis:Vec3=[Math.cos(az),Math.sin(az),0],side:Vec3=[-Math.sin(az),Math.cos(az),0],rotatedSide=rotateAroundAxis(side,axis,tilt);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const center=[width*.5,height*.56] as const,scale=Math.min(width,height)*.2;
    const polygon=(u:Vec3,v:Vec3,color:string)=>{const corners:Vec3[]=[[-u[0]*extent-v[0]*extent,-u[1]*extent-v[1]*extent,-u[2]*extent-v[2]*extent],[u[0]*extent-v[0]*extent,u[1]*extent-v[1]*extent,u[2]*extent-v[2]*extent],[u[0]*extent+v[0]*extent,u[1]*extent+v[1]*extent,u[2]*extent+v[2]*extent],[-u[0]*extent+v[0]*extent,-u[1]*extent+v[1]*extent,-u[2]*extent+v[2]*extent]];ctx.beginPath();corners.forEach((c,i)=>{const p=projectIso(c,center[0],center[1],scale);if(i===0)ctx.moveTo(...p);else ctx.lineTo(...p);});ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=color.replace('.16','.7');ctx.stroke();};
    polygon([1,0,0],[0,1,0],'rgba(75,218,176,.16)');polygon(axis,rotatedSide,'rgba(182,155,242,.16)');
    drawProjectedArrow(ctx,[axis[0]*1.75,axis[1]*1.75,0],center,scale,'#efbd55',Math.abs(dihedral)<1?'meet not unique':'A ∩ B');drawProjectedArrow(ctx,[-axis[0]*1.75,-axis[1]*1.75,0],center,scale,'rgba(239,189,85,.45)','',true);
    ctx.fillStyle='#8fa2a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('A · green plane',20,22);ctx.fillText('B · violet plane',width-132,22);
  };
  const coincident=Math.abs(dihedral)<1;
  return <LabFrame title="两个平面的 meet 是它们共享的直线" tag="LAB · JOIN / MEET" metrics={[["dim A",'2'],["dim B",'2'],["meet",coincident?'plane · dim 2':'line · dim 1']] }>
    <InteractiveCanvas draw={draw} dependencies={[dihedral,azimuth,extent]} label="两个平面的 join 与 meet 相交实验" />
    <div className="lab-controls"><Slider label="二面角" value={dihedral} min={0} max={120} suffix="°" onChange={setDihedral}/><Slider label="交线方位" value={azimuth} min={-180} max={180} suffix="°" onChange={setAzimuth}/><Slider label="显示范围" value={extent} min={.7} max={1.6} step={.01} onChange={setExtent}/></div>
    <div className="quaternion-readout"><code>dim(A+B)+dim(A∩B)=dim A+dim B</code><code>{coincident?'A = B：交集维数上升，交线不再唯一':'dim join = 3, dim meet = 1'}</code></div>
  </LabFrame>;
}

export function ContractionsLab(){
  const [leftGrade,setLeftGrade]=useState(1),[rightGrade,setRightGrade]=useState(2);
  const results=[
    ['scalar product',leftGrade===rightGrade?0:null,'⟨AB⟩₀'],
    ['left contraction',leftGrade<=rightGrade?rightGrade-leftGrade:null,'⟨AB⟩ₛ₋ᵣ'],
    ['right contraction',leftGrade>=rightGrade?leftGrade-rightGrade:null,'⟨AB⟩ᵣ₋ₛ'],
    ['Hestenes inner',leftGrade>0&&rightGrade>0?Math.abs(leftGrade-rightGrade):null,'⟨AB⟩|ᵣ₋ₛ|'],
  ] as const;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const row=height/5,left=width*.22,right=width*.78;
    results.forEach(([name,grade,formula],index)=>{const y=row*(index+1);ctx.fillStyle='#9baba9';ctx.font='10px ui-monospace, monospace';ctx.fillText(name,18,y+4);ctx.fillStyle='#efbd55';ctx.fillRect(left-18,y-16,36,32);ctx.fillStyle='#111821';ctx.textAlign='center';ctx.fillText(`r${leftGrade}`,left,y+4);ctx.fillStyle='#4bdab0';ctx.fillRect(left+54,y-16,36,32);ctx.fillStyle='#111821';ctx.fillText(`s${rightGrade}`,left+72,y+4);ctx.beginPath();ctx.moveTo(left+105,y);ctx.lineTo(right-42,y);ctx.strokeStyle=grade===null?'rgba(240,127,99,.45)':'rgba(182,155,242,.7)';ctx.setLineDash(grade===null?[4,5]:[]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=grade===null?'#f39780':'#b69bf2';ctx.beginPath();ctx.arc(right,y,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111821';ctx.fillText(grade===null?'∅':`g${grade}`,right,y+4);ctx.fillStyle='#7f9290';ctx.fillText(formula,width-80,y+4);ctx.textAlign='start';});
  };
  const label=(value:number)=>`grade ${value}`;
  return <LabFrame title="同一个“内积”名称可能选择不同输出 grade" tag="LAB · CONTRACTION CONVENTIONS" metrics={[["r",String(leftGrade)],["s",String(rightGrade)],["Hestenes",results[3][1]===null?'zero':label(results[3][1])]]}>
    <InteractiveCanvas draw={draw} dependencies={[leftGrade,rightGrade]} label="标量积、左右收缩和 Hestenes 内积 grade 对照实验" />
    <div className="grade-pickers"><div><span>LEFT FACTOR · r</span>{[0,1,2,3].map(g=><button key={g} className={leftGrade===g?'active':''} onClick={()=>setLeftGrade(g)}>grade {g}</button>)}</div><div><span>RIGHT FACTOR · s</span>{[0,1,2,3].map(g=><button key={g} className={rightGrade===g?'active':''} onClick={()=>setRightGrade(g)}>grade {g}</button>)}</div></div>
  </LabFrame>;
}

export function OutermorphismLab(){
  const [scaleX,setScaleX]=useState(1.25),[scaleY,setScaleY]=useState(.72),[shear,setShear]=useState(.35),[rotation,setRotation]=useState(24);
  const a=[1,.18] as const,b=[.2,.92] as const,angle=toRad(rotation),c=Math.cos(angle),s=Math.sin(angle);
  const map=([x,y]:readonly[number,number])=>{const px=scaleX*x+shear*y,py=scaleY*y;return [c*px-s*py,s*px+c*py] as const;};
  const ma=map(a),mb=map(b),areaIn=a[0]*b[1]-a[1]*b[0],areaOut=ma[0]*mb[1]-ma[1]*mb[0],det=scaleX*scaleY;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const scale=Math.min(width,height)*.18,left=[width*.27,height*.62] as const,right=[width*.73,height*.62] as const;
    const panel=(center:readonly[number,number],u:readonly[number,number],v:readonly[number,number],title:string)=>{const p1=[center[0]+u[0]*scale,center[1]-u[1]*scale] as const,p2=[center[0]+v[0]*scale,center[1]-v[1]*scale] as const,p3=[center[0]+(u[0]+v[0])*scale,center[1]-(u[1]+v[1])*scale] as const;ctx.beginPath();ctx.moveTo(...center);ctx.lineTo(...p1);ctx.lineTo(...p3);ctx.lineTo(...p2);ctx.closePath();ctx.fillStyle='rgba(75,218,176,.17)';ctx.fill();ctx.strokeStyle='#4bdab0';ctx.stroke();drawArrow2D(ctx,...center,...p1,'#efbd55','a');drawArrow2D(ctx,...center,...p2,'#b69bf2','b');ctx.fillStyle='#97a7a5';ctx.font='10px ui-monospace, monospace';ctx.fillText(title,center[0]-40,25);};
    panel(left,a,b,'input blades');panel(right,ma,mb,'F(a), F(b)');ctx.beginPath();ctx.moveTo(width*.5,22);ctx.lineTo(width*.5,height-22);ctx.strokeStyle='rgba(205,218,215,.15)';ctx.stroke();ctx.fillStyle='#91a2a0';ctx.fillText('F',width*.5-4,height*.5);
  };
  const status=Math.abs(det)<.015?'singular':det<0?'orientation reversing':'invertible';
  return <LabFrame title="线性变换自然扩展到面积与所有 blade" tag="LAB · OUTERMORPHISM" metrics={[["det F",det.toFixed(3)],["area ratio",(areaOut/areaIn).toFixed(3)],["map",status]]}>
    <InteractiveCanvas draw={draw} dependencies={[scaleX,scaleY,shear,rotation]} label="同一线性变换作用于向量和外积面积实验" />
    <div className="lab-controls"><Slider label="x scale" value={scaleX} min={-1.5} max={1.5} step={.01} onChange={setScaleX}/><Slider label="y scale" value={scaleY} min={-1.5} max={1.5} step={.01} onChange={setScaleY}/><Slider label="shear" value={shear} min={-1} max={1} step={.01} onChange={setShear}/><Slider label="rotation" value={rotation} min={-180} max={180} suffix="°" onChange={setRotation}/></div>
    <div className="quaternion-readout"><code>F(a∧b)=F(a)∧F(b)={areaOut.toFixed(3)}e₁₂</code><code>F(I)=det(F)I={det.toFixed(3)}I</code></div>
  </LabFrame>;
}
