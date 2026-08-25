'use client';

import { useEffect, useRef, useState } from 'react';
import { historyEras, historyPrinciples } from '../mathHistory';

type DemoId = 'numerals' | 'conics' | 'complex' | 'fourier' | 'curvature';

const demos: { id: DemoId; label: string; era: string; title: string; prompt: string; insight: string }[] = [
  { id: 'numerals', label: '01', era: '古代记数', title: '改变底数，数量没有改变', prompt: '拖动数量，观察十进制与六十进制怎样重新分组。', insight: '记号依赖表示系统；数量关系不依赖你选择的底数。' },
  { id: 'conics', label: '02', era: '古典几何', title: '一次切割生成一族曲线', prompt: '改变偏心率，从圆连续走到椭圆、抛物线和双曲线。', insight: '看似不同的曲线，可以由一个参数和统一定义组织起来。' },
  { id: 'complex', label: '03', era: '复数与旋转', title: '乘法也可以是一种运动', prompt: '改变相角，观察整个格点如何保持距离并同步旋转。', insight: '复数把二维缩放与旋转压缩成一次乘法。' },
  { id: 'fourier', label: '04', era: '分析与波动', title: '简单圆周叠出复杂波形', prompt: '调节谐波数量，比较近似方波的细节与过冲。', insight: '换一组基之后，复杂信号会变成一串可独立调节的频率。' },
  { id: 'curvature', label: '05', era: '现代几何', title: '改变曲率，平行线改写命运', prompt: '从负曲率拖到正曲率，观察测地线的分离与汇聚。', insight: '几何不是唯一舞台；公理与度量共同决定“直线”如何行动。' },
];

export function MathHistoryAtlas({ onOpenLesson }: { onOpenLesson: (lessonId: string) => void }) {
  const [activeEra, setActiveEra] = useState(0);
  const [demo, setDemo] = useState<DemoId>('numerals');
  const [progress, setProgress] = useState(0.24);
  const [playing, setPlaying] = useState(true);

  return <div className="history-atlas">
    <section className="history-hero">
      <div className="history-kicker"><span>MATHEMATICAL IDEAS · ACROSS CULTURES</span><i>首批 5 个思想实验</i></div>
      <div className="history-title-row"><div><h1>数学不是<br /><em>公式清单</em></h1><p>它是一部人类不断发明表示、证明、抽象与计算工具的历史。沿着“当时的人究竟遇到了什么问题”进入每个时代，再亲手改变参数，看一个新观念解决了什么、又打开了什么。</p></div><HistoryConstellation /></div>
      <div className="history-jump-row">{historyEras.map((era, index) => <button key={era.id} className={index === activeEra ? 'active' : ''} onClick={() => { setActiveEra(index); document.getElementById('history-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}><span>{String(index + 1).padStart(2, '0')}</span><b>{era.title.split('，')[0]}</b><small>{era.span}</small></button>)}</div>
    </section>

    <section className="history-lab-section">
      <div className="section-heading"><div><span>IDEA LAB</span><h2>把思想放进手里</h2></div><p>每个实验自动播放；也可以暂停、拖动时间或切换主题。先预测会发生什么，再看不变量是否支持你的猜想。</p></div>
      <HistoryCanvas demo={demo} progress={progress} playing={playing} onProgress={setProgress} />
      <div className="history-demo-tabs" role="tablist" aria-label="数学史互动实验">
        {demos.map(item => <button key={item.id} role="tab" aria-selected={demo === item.id} className={demo === item.id ? 'active' : ''} onClick={() => { setDemo(item.id); setProgress(.02); }}><span>{item.label} · {item.era}</span><b>{item.title}</b><small>{item.prompt}</small></button>)}
      </div>
      <div className="history-player">
        <button onClick={() => setPlaying(value => !value)} aria-label={playing ? '暂停动画' : '播放动画'}>{playing ? 'Ⅱ' : '▶'}</button>
        <input aria-label="实验进度" type="range" min="0" max="1" step="0.001" value={progress} onChange={event => { setPlaying(false); setProgress(Number(event.target.value)); }} />
        <output>{Math.round(progress * 100)}%</output>
      </div>
      <div className="history-insight"><span>观察重点</span><p>{demos.find(item => item.id === demo)?.insight}</p></div>
    </section>

    <section className="history-timeline" id="history-timeline">
      <div className="section-heading"><div><span>CONNECTED TIMELINE</span><h2>八次观念转向</h2></div><p>时间线只是一张导航图，不是“谁先发现”的排行榜。每一站都同时观察问题、工具、传播与今天仍在使用的结构。</p></div>
      <div className="history-era-layout">
        <nav aria-label="数学史时期">{historyEras.map((era, index) => <button key={era.id} className={index === activeEra ? 'active' : ''} onClick={() => setActiveEra(index)}><i /><span>{era.span}</span><b>{era.title}</b><small>{era.region}</small></button>)}</nav>
        <HistoryEraCard index={activeEra} onOpenLesson={onOpenLesson} />
      </div>
    </section>

    <section className="history-method">
      <div><span>HOW TO READ HISTORY</span><h2>学习思想，<br />也学习它如何形成。</h2></div>
      <ol>{historyPrinciples.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><b>{title}</b><p>{text}</p></li>)}</ol>
    </section>
  </div>;
}

function HistoryEraCard({ index, onOpenLesson }: { index: number; onOpenLesson: (id: string) => void }) {
  const era = historyEras[index];
  return <article className="history-era-card" key={era.id}>
    <header><span>{era.span}</span><i>{era.region}</i></header>
    <p className="history-question">“{era.question}”</p>
    <h3>{era.title}</h3><p>{era.story}</p>
    <div className="history-idea-chips">{era.ideas.map(idea => <span key={idea}>{idea}</span>)}</div>
    <div className="history-bridge"><span>连接到 GA / SPACE</span><p>{era.bridge}</p><button onClick={() => onOpenLesson(era.lessonId)}>进入对应课程 <i>→</i></button></div>
  </article>;
}

function HistoryConstellation() {
  return <div className="history-constellation" aria-hidden="true"><i /><i /><i /><i /><i /><span>数</span><span>形</span><span>变换</span><span>结构</span><b>?</b></div>;
}

function HistoryCanvas({ demo, progress, playing, onProgress }: { demo: DemoId; progress: number; playing: boolean; onProgress: (value: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const lastRef = useRef(0);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = (now: number) => {
      if (!lastRef.current) lastRef.current = now;
      const next = (progressRef.current + Math.min(50, now - lastRef.current) / 12000) % 1;
      lastRef.current = now;
      onProgress(next);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lastRef.current = 0; };
  }, [playing, demo, onProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawHistory(ctx, rect.width, rect.height, demo, progress);
  }, [demo, progress]);

  return <div className="history-canvas-wrap"><canvas ref={canvasRef} /><div className="history-canvas-label"><span>LIVE THOUGHT EXPERIMENT</span><b>{demos.find(item => item.id === demo)?.title}</b></div></div>;
}

function drawHistory(ctx: CanvasRenderingContext2D, width: number, height: number, demo: DemoId, t: number) {
  ctx.fillStyle = '#101a21'; ctx.fillRect(0, 0, width, height);
  const grid = 32;
  ctx.strokeStyle = 'rgba(151,185,176,.09)'; ctx.lineWidth = 1;
  for (let x = 0; x < width; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = 0; y < height; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  ctx.save();
  if (demo === 'numerals') drawNumerals(ctx, width, height, t);
  if (demo === 'conics') drawConics(ctx, width, height, t);
  if (demo === 'complex') drawComplex(ctx, width, height, t);
  if (demo === 'fourier') drawFourier(ctx, width, height, t);
  if (demo === 'curvature') drawCurvature(ctx, width, height, t);
  ctx.restore();
}

function drawNumerals(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const value = Math.max(1, Math.round(1 + t * 719));
  const digits = [Math.floor(value / 60), value % 60];
  ctx.fillStyle = '#f5f0e5'; ctx.font = '500 52px Georgia'; ctx.fillText(String(value), 48, 115);
  ctx.fillStyle = '#8ca19c'; ctx.font = '11px ui-monospace'; ctx.fillText('DECIMAL QUANTITY', 50, 52);
  ctx.fillText('BASE 60 · TWO POSITIONS', 50, 154);
  digits.forEach((digit, column) => {
    const x = 80 + column * Math.min(260, w * .32);
    ctx.strokeStyle = column ? '#48d9ad' : '#f0bf52'; ctx.lineWidth = 2;
    ctx.strokeRect(x - 28, 184, 170, 145);
    ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(String(digit), x + 30, 260);
    ctx.fillStyle = '#8ca19c'; ctx.font = '10px ui-monospace'; ctx.fillText(column ? '× 1' : '× 60', x + 30, 294);
  });
  ctx.fillStyle = '#83ead0'; ctx.font = '16px ui-monospace'; ctx.fillText(`${digits[0]} × 60 + ${digits[1]} = ${value}`, 50, h - 38);
}

function drawConics(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const e = t * 1.55;
  const cx = w * .53, cy = h * .53, scale = Math.min(w, h) * .25;
  ctx.strokeStyle = 'rgba(240,191,82,.35)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - scale, cy - scale * 1.2); ctx.lineTo(cx, cy + scale * 1.2); ctx.lineTo(cx + scale, cy - scale * 1.2); ctx.stroke();
  ctx.strokeStyle = '#48d9ad'; ctx.lineWidth = 3; ctx.beginPath();
  if (e < .98) {
    const a = scale * .82, b = a * Math.sqrt(Math.max(.04, 1 - e * e));
    ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
  } else if (e < 1.04) {
    for (let x = -scale; x <= scale; x += 3) { const y = x * x / (scale * 1.55); if (x === -scale) ctx.moveTo(cx + x, cy - scale * .5 + y); else ctx.lineTo(cx + x, cy - scale * .5 + y); }
  } else {
    const a = scale * .25, b = a * Math.sqrt(e * e - 1);
    for (const sign of [-1, 1]) for (let u = -1.65; u <= 1.65; u += .025) { const x = sign * a * Math.cosh(u), y = b * Math.sinh(u); if (u === -1.65) ctx.moveTo(cx + x, cy + y); else ctx.lineTo(cx + x, cy + y); }
  }
  ctx.stroke();
  ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(`e = ${e.toFixed(2)}`, 45, 92);
  ctx.fillStyle = '#91a7a1'; ctx.font = '11px ui-monospace'; ctx.fillText(e < .02 ? 'CIRCLE' : e < .98 ? 'ELLIPSE' : e < 1.04 ? 'PARABOLA' : 'HYPERBOLA', 48, 121);
}

function drawComplex(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cx = w / 2, cy = h / 2, angle = t * Math.PI * 2, spacing = Math.min(w, h) / 9;
  ctx.translate(cx, cy); ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(72,217,173,.28)'; ctx.lineWidth = 1;
  for (let i = -7; i <= 7; i++) { ctx.beginPath(); ctx.moveTo(i * spacing, -h); ctx.lineTo(i * spacing, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w, i * spacing); ctx.lineTo(w, i * spacing); ctx.stroke(); }
  ctx.strokeStyle = '#48d9ad'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-w, 0); ctx.lineTo(w, 0); ctx.stroke();
  ctx.strokeStyle = '#f0bf52'; ctx.beginPath(); ctx.moveTo(0, -h); ctx.lineTo(0, h); ctx.stroke();
  ctx.rotate(-angle); ctx.fillStyle = '#f5f0e5'; ctx.font = '16px ui-monospace'; ctx.fillText(`z · e^(i ${(angle / Math.PI).toFixed(2)}π)`, -cx + 42, -cy + 72);
}

function drawFourier(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const harmonics = 1 + Math.floor(t * 9), originX = w * .22, originY = h * .52;
  let x = originX, y = originY;
  ctx.lineWidth = 1.3;
  for (let n = 0; n < harmonics; n++) {
    const k = n * 2 + 1, radius = Math.min(w, h) * .14 * (4 / (Math.PI * k)), phase = t * Math.PI * 2 * k;
    ctx.strokeStyle = 'rgba(240,191,82,.38)'; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
    const nx = x + Math.cos(phase) * radius, ny = y + Math.sin(phase) * radius;
    ctx.strokeStyle = '#f0bf52'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke(); x = nx; y = ny;
  }
  ctx.strokeStyle = 'rgba(72,217,173,.35)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(w * .5, y); ctx.stroke();
  ctx.strokeStyle = '#48d9ad'; ctx.lineWidth = 2; ctx.beginPath();
  for (let px = w * .5; px < w - 24; px += 2) { const q = (px - w * .5) / (w * .5) * Math.PI * 2; let sy = 0; for (let n = 0; n < harmonics; n++) { const k = n * 2 + 1; sy += Math.sin(t * Math.PI * 2 * k - q * k) / k; } const py = originY + sy * Math.min(w, h) * .09; if (px === w * .5) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
  ctx.stroke(); ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(String(harmonics), 42, 82); ctx.fillStyle = '#91a7a1'; ctx.font = '11px ui-monospace'; ctx.fillText('ODD HARMONICS', 44, 108);
}

function drawCurvature(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const curvature = (t * 2 - 1), cx = w / 2, top = 58, bottom = h - 45;
  ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(`K ${curvature >= 0 ? '+' : ''}${curvature.toFixed(2)}`, 42, 82);
  ctx.fillStyle = '#91a7a1'; ctx.font = '11px ui-monospace'; ctx.fillText(curvature < -.08 ? 'HYPERBOLIC · DIVERGE' : curvature > .08 ? 'SPHERICAL · CONVERGE' : 'EUCLIDEAN · PARALLEL', 44, 108);
  [-1, 0, 1].forEach((lane, index) => {
    ctx.strokeStyle = index === 1 ? '#f0bf52' : '#48d9ad'; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 100; i++) { const p = i / 100, y = top + p * (bottom - top), bend = curvature * lane * Math.sin(p * Math.PI) * w * .18, x = cx + lane * w * .16 - bend; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(151,185,176,.25)'; ctx.lineWidth = 1;
  for (let p = .1; p < 1; p += .1) { ctx.beginPath(); for (let lane = -1.4; lane <= 1.4; lane += .04) { const x = cx + lane * w * .16 - curvature * lane * Math.sin(p * Math.PI) * w * .18, y = top + p * (bottom - top); if (lane < -1.35) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); }
}
