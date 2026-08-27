'use client';

import { useEffect, useRef, useState } from 'react';
import { physicsEras, physicsReferences } from '../physicsHistory';

type DemoId = 'measure' | 'fall' | 'orbit' | 'field' | 'clock' | 'quantum' | 'cosmos';

const demos: { id: DemoId; era: string; title: string; prompt: string; insight: string; control: string }[] = [
  { id: 'measure', era: 'MEASUREMENT · EVIDENCE', title: '测量：一组读数不是一个真值', prompt: '增大仪器噪声，观察同一加速度的重复读数如何分散；再看平均值为何仍有意义。', insight: '实验报告应给出不确定性和重复次数；“看起来接近”不是精确相等。', control: '测量噪声' },
  { id: 'fall', era: 'GALILEO · MOTION', title: '落体：改变质量，不改变加速度', prompt: '拖动时间，比较两个不同质量的物体。忽略空气阻力时，它们会同时落地。', insight: '这是理想化模型的力量：先明确忽略什么，再检验留下的关系。', control: '时间' },
  { id: 'orbit', era: 'NEWTON · GRAVITY', title: '轨道：速度总在被引力折向', prompt: '改变轨道偏心率，观察同一引力中心如何让方向不断偏转。', insight: '“绕圈”并不表示没有力；速度方向持续改变，就意味着存在加速度。', control: '偏心率' },
  { id: 'field', era: 'FARADAY / MAXWELL', title: '电磁波：变化的场可以传播', prompt: '沿空间移动切片，观察相互垂直的 E 与 B 如何一起振荡。', insight: '光不是必须依赖介质的机械波；它是电磁场自身的传播解。', control: '相位' },
  { id: 'clock', era: 'EINSTEIN · RELATIVITY', title: '光钟：不变的光速带来时间膨胀', prompt: '提高相对速度，比较静止与运动光钟的一次来回路径。', insight: '不是钟“坏了”：不同世界线之间的固有时间确实不同。', control: 'v / c' },
  { id: 'quantum', era: 'QUANTUM · AMPLITUDE', title: '双缝：先相加振幅，再得到概率', prompt: '移动相位，观察屏幕上明暗条纹如何平移；单个探测仍是离散的。', insight: '波纹是概率分布，不是“小球被切成两半”的轨迹照片。', control: '相位差' },
  { id: 'cosmos', era: 'COSMOLOGY · EVIDENCE', title: '宇宙膨胀：距离越远，退行越快', prompt: '推动时间滑块，让网格尺度变化；每个星系并非从某个中心“飞出”。', insight: '这是空间尺度因子改变的示意，不能据此画出宇宙的外部形状。', control: '尺度因子' },
];

const checks: Record<DemoId, { question: string; answers: string[]; correct: number; explain: string }> = {
  measure: { question: '若重复测量的散布变大，最合理的报告是什么？', answers: ['只保留最接近预期的一个数', '报告平均值、散布和测量条件', '宣布理论错误'], correct: 1, explain: '重复读数的平均与散布共同描述测量；还要说明仪器、环境和模型条件。' },
  fall: { question: '为什么这个实验中重物和轻物同步落下？', answers: ['重物其实没有受重力', '模型明确忽略空气阻力，重力加速度与质量无关', '质量在真空中都会相同'], correct: 1, explain: '这是理想化结论。加入空气阻力后，形状和面积会影响运动。' },
  orbit: { question: '轨道上速度方向不断变，为何不是“匀速直线运动”？', answers: ['速度只要大小不变就不变', '速度是向量，方向变化也意味着加速度', '引力只改变距离'], correct: 1, explain: '加速度描述速度向量的变化；向心效应正是方向持续改变。' },
  field: { question: '这个示意真正想表达什么？', answers: ['电场和磁场是两种彼此无关的物质', '变化的电磁场可以在真空中传播', '所有光都只有一种颜色'], correct: 1, explain: '图中波形是简化读图。真实电磁场仍要由方程、边界条件和测量来判断。' },
  clock: { question: '运动光钟路径更长时，狭义相对论要求什么保持一致？', answers: ['光速 c', '每个观察者的坐标时间', '两条光路的几何长度'], correct: 0, explain: '在每个惯性系中光速相同；不同路径配合不同的时间间隔，导出时间膨胀。' },
  quantum: { question: '双缝屏幕上的条纹首先描述什么？', answers: ['每个粒子都沿着明暗波纹连续涂抹', '大量重复实验中各位置出现的概率', '仪器把粒子切成两半'], correct: 1, explain: '单次探测是离散事件；重复后统计分布呈现干涉。' },
  cosmos: { question: '这个网格图不应该被理解为？', answers: ['尺度因子随时间改变的示意', '宇宙从图中心炸进预先存在的空房间', '任意两点间距离可随尺度变化'], correct: 1, explain: '示意没有“宇宙外部”或特殊中心；它只表达共动距离随尺度因子变化。' },
};

export function PhysicsHistoryAtlas({ onOpenLesson }: { onOpenLesson: (lessonId: string) => void }) {
  const [activeEra, setActiveEra] = useState(0);
  const [demo, setDemo] = useState<DemoId>('fall');
  const [value, setValue] = useState(.45);
  const [playing, setPlaying] = useState(true);
  const [choice, setChoice] = useState<number | null>(null);
  const selectedDemo = demos.find(item => item.id === demo)!;
  const era = physicsEras[activeEra];

  return <div className="physics-atlas">
    <section className="physics-hero">
      <div className="physics-kicker"><span>PHYSICS HISTORY · OBSERVATION → MODEL → TEST</span><i>高中起点 · 7 个思想实验</i></div>
      <div className="physics-hero-grid"><div><h1>物理学不是<br /><em>结论年表</em></h1><p>它从测量开始：什么被观察到？什么模型能压缩这些观察？模型在哪里失效？沿着这条线，力学、场、相对论、量子与宇宙学成为一段连续但从不封闭的探索。</p></div><PhysicsMotif /></div>
      <div className="physics-progress-map">{physicsEras.map((item, index) => <button key={item.id} className={activeEra === index ? 'active' : ''} onClick={() => { setActiveEra(index); document.getElementById('physics-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}><span>{String(index + 1).padStart(2, '0')}</span><b>{item.span}</b><small>{item.title}</small></button>)}</div>
    </section>

    <section className="physics-lab-section">
      <div className="section-heading"><div><span>PHENOMENON LAB</span><h2>先改变现象，再读模型</h2></div><p>图形不是“装饰动画”：每个实验都保留一个可控量，并在旁边指出它验证什么、又没有验证什么。</p></div>
      <PhysicsCanvas demo={demo} value={value} playing={playing} onValue={setValue} />
      <div className="physics-demo-tabs" role="tablist" aria-label="物理史互动实验">{demos.map(item => <button key={item.id} role="tab" aria-selected={item.id === demo} className={item.id === demo ? 'active' : ''} onClick={() => { setDemo(item.id); setValue(item.id === 'clock' ? .25 : .45); setChoice(null); }}><span>{item.era}</span><b>{item.title}</b></button>)}</div>
      <div className="physics-player"><button onClick={() => setPlaying(current => !current)} aria-label={playing ? '暂停实验' : '播放实验'}>{playing ? 'Ⅱ' : '▶'}</button><label><span>{selectedDemo.control}</span><input aria-label={selectedDemo.control} type="range" min="0" max="1" step="0.001" value={value} onChange={event => { setPlaying(false); setValue(Number(event.target.value)); }} /></label><output>{demo === 'clock' ? `${(value * .92).toFixed(2)} c` : demo === 'measure' ? `±${(.05 + value * .7).toFixed(2)}` : `${Math.round(value * 100)}%`}</output></div>
      <div className="physics-lab-copy"><div><span>实验任务</span><p>{selectedDemo.prompt}</p></div><div><span>你应当观察到</span><p>{selectedDemo.insight}</p></div></div>
      <PhysicsCheck demo={demo} choice={choice} onChoose={setChoice} />
    </section>

    <section className="physics-timeline" id="physics-timeline">
      <div className="section-heading"><div><span>NINE TURNS IN PHYSICS</span><h2>每一步都留下可检验的痕迹</h2></div><p>用“证据、模型、边界”取代英雄式年表：科学理论不仅解释成功，也主动说明自己的适用范围。</p></div>
      <div className="physics-timeline-layout"><nav aria-label="物理学史时期">{physicsEras.map((item, index) => <button key={item.id} className={activeEra === index ? 'active' : ''} onClick={() => setActiveEra(index)}><i /><span>{item.span}</span><b>{item.title}</b></button>)}</nav><article className="physics-era-card" key={era.id}><header><span>{era.span}</span><i>第 {activeEra + 1} 站</i></header><p className="physics-question">“{era.question}”</p><h3>{era.title}</h3><div className="evidence-stack"><section><span>OBSERVATION · 观测</span><p>{era.evidence}</p></section><section><span>MODEL · 模型</span><p>{era.model}</p></section><section><span>OPEN EDGE · 边界</span><p>{era.limit}</p></section></div><div className="physics-bridge"><span>连接到 GA / SPACE</span><p>{era.bridge}</p><button onClick={() => onOpenLesson(era.lessonId)}>进入对应课程 <i>→</i></button></div></article></div>
    </section>

    <section className="physics-frontier"><div><span>WHAT “FRONTIER” MEANS</span><h2>前沿不是更炫的名词，<br />而是更清楚的未知。</h2></div><ol><li><b>已成功</b><p>在已检验范围内，牛顿力学、Maxwell 理论、相对论、量子理论与标准模型各自极其有效。</p></li><li><b>尚未统一</b><p>量子理论与广义相对论的共同极限仍未被实验证实；“量子引力”是一组研究方向，不是一门已完成理论。</p></li><li><b>仍受观测约束</b><p>暗物质、暗能量、宇宙早期与中微子性质都要由数据筛选，不能只靠漂亮公式。</p></li></ol></section>

    <section className="physics-reference-section"><div className="section-heading"><div><span>READ FURTHER</span><h2>从互动图回到可靠资料</h2></div><p>这些入口分别提供物理学史、相对论、粒子物理和宇宙学的进一步材料。</p></div><div className="reference-list">{physicsReferences.map((reference, index) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><span>0{index + 1}</span><div><b>{reference.title}</b><p>{reference.note}</p></div><i>↗</i></a>)}</div></section>
  </div>;
}

function PhysicsMotif() { return <div className="physics-motif" aria-hidden="true"><i /><i /><i /><i /><span>measure</span><span>model</span><span>test</span><b>?</b></div>; }

function PhysicsCheck({ demo, choice, onChoose }: { demo: DemoId; choice: number | null; onChoose: (value: number) => void }) {
  const check = checks[demo];
  return <section className="physics-check" aria-label="理解检查"><div><span>先预测 · 再核对</span><h3>{check.question}</h3></div><div className="physics-check-options">{check.answers.map((answer, index) => <button key={answer} className={choice === index ? (index === check.correct ? 'correct' : 'incorrect') : ''} onClick={() => onChoose(index)}><i>{String.fromCharCode(65 + index)}</i>{answer}</button>)}</div>{choice !== null && <p className={choice === check.correct ? 'correct' : 'incorrect'}>{choice === check.correct ? '判断正确。' : '再看一次模型条件。'} {check.explain}</p>}</section>;
}

function PhysicsCanvas({ demo, value, playing, onValue }: { demo: DemoId; value: number; playing: boolean; onValue: (value: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valueRef = useRef(value); const previousRef = useRef(0);
  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { if (!playing) return; let frame = 0; const tick = (now: number) => { if (!previousRef.current) previousRef.current = now; const speed = demo === 'clock' ? .000055 : .000075; const next = (valueRef.current + Math.min(50, now - previousRef.current) * speed) % 1; previousRef.current = now; onValue(next); frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => { cancelAnimationFrame(frame); previousRef.current = 0; }; }, [demo, playing, onValue]);
  useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const rect = canvas.getBoundingClientRect(); const ratio = Math.min(devicePixelRatio, 2); canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio); const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); drawPhysics(ctx, rect.width, rect.height, demo, value); }, [demo, value]);
  return <div className="physics-canvas-wrap"><canvas ref={canvasRef} aria-label="物理现象互动图" /><div className="physics-canvas-label"><span>LIVE MODEL · NOT TO SCALE</span><b>{demos.find(item => item.id === demo)?.title}</b></div></div>;
}

function base(ctx: CanvasRenderingContext2D, w: number, h: number) { ctx.fillStyle = '#111820'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = 'rgba(158,189,182,.08)'; ctx.lineWidth = 1; for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, radius = 5) { ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); }
function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width = 1) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); }

function drawPhysics(ctx: CanvasRenderingContext2D, w: number, h: number, demo: DemoId, value: number) {
  base(ctx, w, h);
  if (demo === 'fall') drawFall(ctx, w, h, value);
  if (demo === 'measure') drawMeasure(ctx, w, h, value);
  if (demo === 'orbit') drawOrbit(ctx, w, h, value);
  if (demo === 'field') drawField(ctx, w, h, value);
  if (demo === 'clock') drawClock(ctx, w, h, value);
  if (demo === 'quantum') drawQuantum(ctx, w, h, value);
  if (demo === 'cosmos') drawCosmos(ctx, w, h, value);
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#9aaea8') { ctx.fillStyle = color; ctx.font = '10px ui-monospace, monospace'; ctx.fillText(text, x, y); }
function drawMeasure(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) { const center = h * .53, noise = .05 + t * .7, readings = Array.from({ length: 11 }, (_, index) => 9.8 + Math.sin(index * 2.37 + .4) * noise); const mean = readings.reduce((sum, reading) => sum + reading, 0) / readings.length, scale = w * .31; line(ctx, w * .19, center, w * .81, center, 'rgba(238,242,237,.42)'); [9, 9.5, 10, 10.5].forEach(reading => { const x = w * .5 + (reading - 9.8) * scale; line(ctx, x, center - 6, x, center + 6, '#71837c'); label(ctx, `${reading.toFixed(1)}`, x - 10, center + 26); }); readings.forEach((reading, index) => { const x = w * .5 + (reading - 9.8) * scale; dot(ctx, x, center - 32 - (index % 3) * 28, index % 2 ? '#55d8b0' : '#f0c15b', 5); line(ctx, x, center - 6, x, center - 20, 'rgba(102,218,181,.3)'); }); const mx = w * .5 + (mean - 9.8) * scale; line(ctx, mx, center - 125, mx, center + 10, '#eaf4ef', 2); label(ctx, `mean = ${mean.toFixed(2)} m/s²`, 36, 38, '#edf2ec'); label(ctx, `noise ≈ ±${noise.toFixed(2)} m/s² · 11 trials`, 36, 58, '#9fb4ab'); label(ctx, 'repeated readings', w * .19, h - 32); }
function drawFall(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) { const ground = h - 50, y = 48 + Math.min(1, t * 1.38) ** 2 * (ground - 64); line(ctx, 32, ground, w - 32, ground, '#6ed7b8', 2); dot(ctx, w * .37, y, '#f0c15b', 11); dot(ctx, w * .63, y, '#55d8b0', 6); label(ctx, 'heavy', w * .37 - 18, y - 21, '#f0c15b'); label(ctx, 'light', w * .63 - 15, y - 17, '#55d8b0'); label(ctx, `t = ${(t * 3.2).toFixed(2)} s · a = g`, 35, 36, '#edf2ec'); label(ctx, 'AIR RESISTANCE: OFF', 35, ground + 28); }
function drawOrbit(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) { const cx = w * .5, cy = h * .53, a = Math.min(w, h) * .28, e = .12 + t * .72, b = a * Math.sqrt(1 - e * e), focus = cx - a * e; ctx.strokeStyle = 'rgba(102,218,181,.52)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke(); const angle = t * Math.PI * 2; const x = cx + a * Math.cos(angle), y = cy + b * Math.sin(angle); dot(ctx, focus, cy, '#f2bd51', 12); dot(ctx, x, y, '#7be4c4', 7); line(ctx, x, y, focus, cy, 'rgba(242,189,81,.45)', 1); line(ctx, x, y, x - Math.sin(angle) * 38, y + Math.cos(angle) * 38, '#73d8ee', 2); label(ctx, `eccentricity e = ${e.toFixed(2)}`, 35, 38, '#edf2ec'); label(ctx, 'gravity →', focus + 18, cy - 18, '#f2bd51'); label(ctx, 'instantaneous velocity', x + 11, y + 23, '#73d8ee'); }
function drawField(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) { const mid = h * .54, phase = t * Math.PI * 2; line(ctx, 35, mid, w - 35, mid, 'rgba(245,241,229,.38)'); for (let x = 42; x < w - 36; x += 16) { const p = x / w * Math.PI * 4 + phase; const e = Math.sin(p) * h * .2, b = Math.sin(p) * h * .12; line(ctx, x, mid, x, mid - e, '#4be0ba', 2); line(ctx, x - 5, mid + b, x + 5, mid - b, '#9c8cf2', 1.5); } label(ctx, 'E field', 38, 34, '#4be0ba'); label(ctx, 'B field · symbolic out-of-page strokes', 38, 52, '#9c8cf2'); label(ctx, 'propagation →', w - 140, mid + 31, '#f0c15b'); }
function drawClock(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) { const beta = t * .92, gamma = 1 / Math.sqrt(1 - beta * beta), top = 75, bottom = h - 62, left = w * .28, right = w * .68, shift = beta * (right - left) * .7; line(ctx, left, top, left, bottom, '#4ce0ba', 2); line(ctx, left, bottom, left, top, '#4ce0ba', 2); line(ctx, right, top, right + shift, bottom, '#f0c15b', 2); line(ctx, right + shift, bottom, right, top, '#f0c15b', 2); dot(ctx, left, top, '#4ce0ba', 5); dot(ctx, left, bottom, '#4ce0ba', 5); dot(ctx, right, top, '#f0c15b', 5); dot(ctx, right + shift, bottom, '#f0c15b', 5); label(ctx, 'rest clock', left - 33, top - 17, '#4ce0ba'); label(ctx, 'moving clock', right - 24, top - 17, '#f0c15b'); label(ctx, `γ = ${gamma.toFixed(2)}   Δt = γ Δτ`, 36, 37, '#edf2ec'); label(ctx, 'both light paths use c', w - 177, h - 24); }
function drawQuantum(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) { const barrier = w * .32, screen = w * .78, cy = h * .52, phase = t * Math.PI * 2; ctx.fillStyle = '#75827e'; ctx.fillRect(barrier - 3, 32, 6, h - 64); ctx.clearRect(barrier - 5, cy - 45, 10, 18); ctx.clearRect(barrier - 5, cy + 27, 10, 18); line(ctx, 46, cy, barrier - 10, cy, '#f0c15b', 2); for (let y = 42; y < h - 42; y += 2) { const a1 = Math.cos((y - cy) * .09 + phase), a2 = Math.cos((y - cy) * .09 - phase); const probability = (a1 + a2) ** 2 / 4; ctx.fillStyle = `rgba(79, 222, 184, ${.08 + probability * .9})`; ctx.fillRect(screen, y, 14, 2); } label(ctx, 'single detection →', 44, cy - 14, '#f0c15b'); label(ctx, 'two slits', barrier - 27, 24); label(ctx, 'probability on screen', screen - 48, 24, '#54d9b2'); label(ctx, 'amplitudes add · probabilities are measured', 36, h - 21, '#edf2ec'); }
function drawCosmos(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) { const scale = .4 + t * 1.5, cx = w / 2, cy = h / 2; ctx.save(); ctx.translate(cx, cy); for (let step = -4; step <= 4; step++) { line(ctx, step * 42 * scale, -h, step * 42 * scale, h, 'rgba(106,216,185,.26)'); line(ctx, -w, step * 42 * scale, w, step * 42 * scale, 'rgba(106,216,185,.26)'); } [[-2,-1],[1,-1],[-1,2],[2,1],[-2,2]].forEach(([x,y], i) => dot(ctx, x * 55 * scale, y * 45 * scale, i % 2 ? '#f0c15b' : '#5ce0ba', 4)); ctx.restore(); label(ctx, `scale factor a = ${scale.toFixed(2)}`, 36, 38, '#edf2ec'); label(ctx, 'comoving grid · no preferred center in this diagram', 36, h - 23); }
