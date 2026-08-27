'use client';

import { useEffect, useRef, useState } from 'react';
import { eraLearning, frontierPaths, historyEras, historyPrinciples, knowledgeDomains, learningStages } from '../mathHistory';

type DemoTrack = 'represent' | 'change' | 'frontier';
type DemoId = 'numerals' | 'pythagoras' | 'algebra' | 'conics' | 'probability' | 'calculus' | 'complex' | 'fourier' | 'curvature' | 'topology' | 'chaos' | 'optimization';

const demos: { id: DemoId; track: DemoTrack; label: string; era: string; title: string; prompt: string; insight: string; challenge: string }[] = [
  { id: 'numerals', track: 'represent', label: '01', era: '古代记数', title: '改变底数，数量没有改变', prompt: '拖动数量，观察十进制与六十进制怎样重新分组。', insight: '记号依赖表示系统；数量关系不依赖你选择的底数。', challenge: '找出六十进制第二位增加 1 时，十进制增加多少。' },
  { id: 'pythagoras', track: 'represent', label: '02', era: '演绎证明', title: '让面积替勾股定理说话', prompt: '移动四个全等三角形，比较两个大正方形里剩余的面积。', insight: '证明不是“看起来对”，而是每一步都保持面积且能说明为什么。', challenge: '暂停在中点，说出移动前后保持不变的三个量。' },
  { id: 'algebra', track: 'represent', label: '03', era: '代数学', title: '配方法是一场几何重组', prompt: '让长方形碎片补成正方形，观察缺角如何产生常数项。', insight: 'x² + bx 通过补上 (b/2)² 变成完整平方，这就是配方法。', challenge: '当 b 加倍时，需要补的小正方形面积变成几倍？' },
  { id: 'conics', track: 'represent', label: '04', era: '古典几何', title: '一次切割生成一族曲线', prompt: '改变偏心率，从圆连续走到椭圆、抛物线和双曲线。', insight: '看似不同的曲线，可以由一个参数和统一定义组织起来。', challenge: '在 e 接近 1 的两侧暂停，比较曲线为什么突然换类。' },
  { id: 'probability', track: 'change', label: '05', era: '概率诞生', title: '偶然叠加出稳定分布', prompt: '改变成功概率，观察二项分布的峰值和偏斜怎样移动。', insight: '单次结果不可预测，大量独立重复却会形成稳定形状。', challenge: '预测 p = 0.5 时分布为什么左右对称。' },
  { id: 'calculus', track: 'change', label: '06', era: '微积分', title: '割线逼近切线，矩形逼近面积', prompt: '同一进度同时缩短割线间距并增加积分矩形。', insight: '极限把“无限逼近”变成可计算对象，连接局部变化与总体积累。', challenge: '观察误差是否单调减小，并解释为何只是“趋近”而非突然相等。' },
  { id: 'complex', track: 'change', label: '07', era: '复数与旋转', title: '乘法也可以是一种运动', prompt: '改变相角，观察整个格点如何保持距离并同步旋转。', insight: '复数把二维缩放与旋转压缩成一次乘法。', challenge: '转满一圈时哪些量变化了，哪些量回到原值？' },
  { id: 'fourier', track: 'change', label: '08', era: '分析与波动', title: '简单圆周叠出复杂波形', prompt: '调节谐波数量，比较近似方波的细节与过冲。', insight: '换一组基之后，复杂信号会变成一串可独立调节的频率。', challenge: '谐波增加后，跳变处的过冲是否完全消失？' },
  { id: 'curvature', track: 'frontier', label: '09', era: '现代几何', title: '改变曲率，平行线改写命运', prompt: '从负曲率拖到正曲率，观察测地线的分离与汇聚。', insight: '几何不是唯一舞台；公理与度量共同决定“直线”如何行动。', challenge: '在 K = 0 附近暂停，比较三种空间中“平行”的命运。' },
  { id: 'topology', track: 'frontier', label: '10', era: '拓扑', title: '形状改变，欧拉示性数不变', prompt: '让多面体网络连续变形，跟踪 V − E + F。', insight: '拓扑忽略长度与角度，寻找连续变形下仍然保持的关系。', challenge: '增加一条边并把一个面分成两个面，检查不变量为何不变。' },
  { id: 'chaos', track: 'frontier', label: '11', era: '复杂系统', title: '简单递推跨入混沌', prompt: '提高 logistic 参数 r，观察定点、周期倍增与不规则轨迹。', insight: '确定性不等于长期可预测；非线性会放大极小的初值差异。', challenge: '找出轨迹第一次从一个稳定值分裂成两个值的大致区间。' },
  { id: 'optimization', track: 'frontier', label: '12', era: '优化与学习', title: '梯度沿最陡方向寻找低谷', prompt: '改变步长，观察收敛、振荡与发散。', insight: '机器学习的“学习”常从反复计算局部斜率并更新参数开始。', challenge: '为什么步长不是越大越快？找出开始振荡的位置。' },
];

const demoTracks: { id: DemoTrack; title: string; note: string }[] = [
  { id: 'represent', title: '表示与证明', note: '数、图形与方程如何互译' },
  { id: 'change', title: '变化与不确定', note: '极限、概率与频率' },
  { id: 'frontier', title: '结构与前沿', note: '曲率、拓扑、混沌与优化' },
];

export function MathHistoryAtlas({ onOpenLesson }: { onOpenLesson: (lessonId: string) => void }) {
  const [activeEra, setActiveEra] = useState(0);
  const [demo, setDemo] = useState<DemoId>('numerals');
  const [track, setTrack] = useState<DemoTrack>('represent');
  const [progress, setProgress] = useState(0.24);
  const [playing, setPlaying] = useState(true);

  return <div className="history-atlas">
    <section className="history-hero">
      <div className="history-kicker"><span>MATHEMATICAL IDEAS · ACROSS CULTURES</span><i>12 个时代 · 12 个思想实验</i></div>
      <div className="history-title-row"><div><h1>数学不是<br /><em>公式清单</em></h1><p>它是一部人类不断发明表示、证明、抽象与计算工具的历史。沿着“当时的人究竟遇到了什么问题”进入每个时代，再亲手改变参数，看一个新观念解决了什么、又打开了什么。</p></div><HistoryConstellation /></div>
      <div className="history-jump-row">{historyEras.map((era, index) => <button key={era.id} className={index === activeEra ? 'active' : ''} onClick={() => { setActiveEra(index); document.getElementById('history-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}><span>{String(index + 1).padStart(2, '0')}</span><b>{era.title.split('，')[0]}</b><small>{era.span}</small></button>)}</div>
    </section>

    <section className="history-coverage-section">
      <div className="section-heading"><div><span>KNOWLEDGE COVERAGE</span><h2>不是一条时间线，而是六张互联知识网</h2></div><p>高中课程只是共同起点。每一列都从熟悉对象出发，经由互动实验，连接到一组大学基础与前沿问题。</p></div>
      <div className="history-domain-grid">{knowledgeDomains.map((domain, index) => <article key={domain.id}><header><span>0{index + 1}</span><b>{domain.title}</b></header><p><small>高中起点</small>{domain.start}</p><p><small>继续生长</small>{domain.expands}</p><div>{domain.demos.map(item => <i key={item}>{item}</i>)}</div></article>)}</div>
    </section>

    <section className="history-staircase">
      <div className="section-heading"><div><span>LEARNING STAIRCASE</span><h2>四层台阶，允许读者停在任何一层</h2></div><p>正文先给直觉，再给符号；前沿内容明确标出先修，不用尚未学过的术语假装解释。</p></div>
      <div className="history-stage-grid">{learningStages.map(stage => <article key={stage.number}><span>{stage.number}</span><small>{stage.level}</small><h3>{stage.title}</h3><p>{stage.goal}</p><ul>{stage.checkpoints.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
    </section>

    <section className="history-lab-section">
      <div className="section-heading"><div><span>IDEA LAB</span><h2>把思想放进手里</h2></div><p>每个实验自动播放；也可以暂停、拖动时间或切换主题。先预测会发生什么，再看不变量是否支持你的猜想。</p></div>
      <HistoryCanvas demo={demo} progress={progress} playing={playing} onProgress={setProgress} />
      <div className="history-track-tabs">{demoTracks.map(item => <button key={item.id} className={track === item.id ? 'active' : ''} onClick={() => { setTrack(item.id); setDemo(demos.find(candidate => candidate.track === item.id)!.id); setProgress(.02); }}><b>{item.title}</b><span>{item.note}</span></button>)}</div>
      <div className="history-demo-tabs" role="tablist" aria-label="数学史互动实验">
        {demos.filter(item => item.track === track).map(item => <button key={item.id} role="tab" aria-selected={demo === item.id} className={demo === item.id ? 'active' : ''} onClick={() => { setDemo(item.id); setProgress(.02); }}><span>{item.label} · {item.era}</span><b>{item.title}</b><small>{item.prompt}</small></button>)}
      </div>
      <div className="history-player">
        <button onClick={() => setPlaying(value => !value)} aria-label={playing ? '暂停动画' : '播放动画'}>{playing ? 'Ⅱ' : '▶'}</button>
        <input aria-label="实验进度" type="range" min="0" max="1" step="0.001" value={progress} onChange={event => { setPlaying(false); setProgress(Number(event.target.value)); }} />
        <output>{Math.round(progress * 100)}%</output>
      </div>
      <div className="history-insight"><span>你应当发现</span><p>{demos.find(item => item.id === demo)?.insight}</p><span>暂停挑战</span><p>{demos.find(item => item.id === demo)?.challenge}</p></div>
    </section>

    <section className="history-timeline" id="history-timeline">
      <div className="section-heading"><div><span>CONNECTED TIMELINE</span><h2>十二次观念转向</h2></div><p>时间线只是一张导航图，不是“谁先发现”的排行榜。每一站都同时观察问题、工具、传播与今天仍在使用的结构。</p></div>
      <div className="history-era-layout">
        <nav aria-label="数学史时期">{historyEras.map((era, index) => <button key={era.id} className={index === activeEra ? 'active' : ''} onClick={() => setActiveEra(index)}><i /><span>{era.span}</span><b>{era.title}</b><small>{era.region}</small></button>)}</nav>
        <HistoryEraCard index={activeEra} onOpenLesson={onOpenLesson} />
      </div>
    </section>

    <section className="history-method">
      <div><span>HOW TO READ HISTORY</span><h2>学习思想，<br />也学习它如何形成。</h2></div>
      <ol>{historyPrinciples.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><b>{title}</b><p>{text}</p></li>)}</ol>
    </section>

    <section className="history-frontiers">
      <div className="section-heading"><div><span>FRONTIER PATHS</span><h2>前沿不是黑箱：六条从高中出发的路线</h2></div><p>每条路线都区分已取得的成果与仍然开放的问题，让“了解前沿”不等于只记住几个陌生名词。</p></div>
      <div className="frontier-grid">{frontierPaths.map((path, index) => <article key={path.title}><header><span>{String(index + 1).padStart(2, '0')}</span><h3>{path.title}</h3></header><dl><div><dt>高中起点</dt><dd>{path.start}</dd></div><div><dt>关键台阶</dt><dd>{path.bridge}</dd></div><div><dt>已经做到</dt><dd>{path.success}</dd></div><div><dt>仍在追问</dt><dd>{path.open}</dd></div></dl><button onClick={() => onOpenLesson(path.lessonId)}>从对应课程继续 <i>→</i></button></article>)}</div>
    </section>
  </div>;
}

function HistoryEraCard({ index, onOpenLesson }: { index: number; onOpenLesson: (id: string) => void }) {
  const era = historyEras[index];
  const learning = eraLearning[era.id];
  return <article className="history-era-card" key={era.id}>
    <header><span>{era.span}</span><i>{era.region}</i></header>
    <p className="history-question">“{era.question}”</p>
    <h3>{era.title}</h3><p>{era.story}</p>
    <div className="history-idea-chips">{era.ideas.map(idea => <span key={idea}>{idea}</span>)}</div>
    {learning && <div className="era-learning-row"><div><span>阅读层级</span><b>{learning.level}</b></div><div><span>需要什么</span><b>{learning.prerequisites}</b></div><div><span>读完获得</span><b>{learning.outcome}</b></div></div>}
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
  if (demo === 'pythagoras') drawPythagoras(ctx, width, height, t);
  if (demo === 'algebra') drawAlgebra(ctx, width, height, t);
  if (demo === 'conics') drawConics(ctx, width, height, t);
  if (demo === 'probability') drawProbability(ctx, width, height, t);
  if (demo === 'calculus') drawCalculus(ctx, width, height, t);
  if (demo === 'complex') drawComplex(ctx, width, height, t);
  if (demo === 'fourier') drawFourier(ctx, width, height, t);
  if (demo === 'curvature') drawCurvature(ctx, width, height, t);
  if (demo === 'topology') drawTopology(ctx, width, height, t);
  if (demo === 'chaos') drawChaos(ctx, width, height, t);
  if (demo === 'optimization') drawOptimization(ctx, width, height, t);
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

function drawPythagoras(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const side = Math.min(230, w * .29, h * .52), y = h * .3, left = w * .18 - side / 2, right = w * .68 - side / 2;
  const a = side * .62, b = side - a, pulse = .45 + .55 * Math.sin(t * Math.PI) ** 2;
  const drawTriangle = (points: [number, number][], color: string) => { ctx.fillStyle = color; ctx.strokeStyle = '#101a21'; ctx.lineWidth = 1.4; ctx.beginPath(); points.forEach(([x, py], index) => { if (index) ctx.lineTo(x, py); else ctx.moveTo(x, py); }); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  ctx.strokeStyle = '#8fa7a1'; ctx.lineWidth = 1.5; ctx.strokeRect(left, y, side, side); ctx.strokeRect(right, y, side, side);
  const l = left, r = right, top = y, bottom = y + side;
  drawTriangle([[l, top], [l + a, top], [l, top + b]], 'rgba(240,191,82,.82)');
  drawTriangle([[l + side, top], [l + side, top + a], [l + a, top]], 'rgba(240,191,82,.65)');
  drawTriangle([[l + side, bottom], [l + b, bottom], [l + side, top + a]], 'rgba(240,191,82,.82)');
  drawTriangle([[l, bottom], [l, top + b], [l + b, bottom]], 'rgba(240,191,82,.65)');
  ctx.fillStyle = `rgba(72,217,173,${.22 + .42 * pulse})`; ctx.beginPath(); ctx.moveTo(l + a, top); ctx.lineTo(l + side, top + a); ctx.lineTo(l + b, bottom); ctx.lineTo(l, top + b); ctx.closePath(); ctx.fill();
  drawTriangle([[r, top], [r + a, top], [r, top + b]], 'rgba(240,191,82,.82)');
  drawTriangle([[r + side, top], [r + side, top + b], [r + a, top]], 'rgba(240,191,82,.65)');
  drawTriangle([[r + side, bottom], [r + side - a, bottom], [r + side, top + b]], 'rgba(240,191,82,.82)');
  drawTriangle([[r, bottom], [r, bottom - b], [r + side - a, bottom]], 'rgba(240,191,82,.65)');
  ctx.fillStyle = `rgba(72,217,173,${.18 + .38 * (1 - pulse)})`; ctx.fillRect(r + b, top + b, a, a);
  ctx.fillStyle = `rgba(182,155,242,${.28 + .34 * (1 - pulse)})`; ctx.fillRect(r, bottom - b, b, b);
  ctx.fillStyle = '#f5f0e5'; ctx.font = '22px Georgia'; ctx.fillText('c²', l + side * .45, y + side * .55); ctx.fillText('a² + b²', r + side * .34, y + side * .55);
  ctx.fillStyle = '#91a7a1'; ctx.font = '10px ui-monospace'; ctx.fillText('同一个外框 · 同样四个全等三角形', Math.max(28, w * .5 - 115), h - 42);
}

function drawAlgebra(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const x = Math.min(205, w * .32, h * .48), b = 24 + t * Math.min(120, x * .62), left = w * .24 - x / 2, top = h * .25;
  ctx.fillStyle = 'rgba(72,217,173,.3)'; ctx.strokeStyle = '#48d9ad'; ctx.fillRect(left, top, x, x); ctx.strokeRect(left, top, x, x);
  ctx.fillStyle = 'rgba(240,191,82,.45)'; ctx.strokeStyle = '#f0bf52'; ctx.fillRect(left + x, top, b / 2, x); ctx.strokeRect(left + x, top, b / 2, x); ctx.fillRect(left, top + x, x, b / 2); ctx.strokeRect(left, top + x, x, b / 2);
  ctx.setLineDash([5, 4]); ctx.strokeStyle = '#b69bf2'; ctx.strokeRect(left + x, top + x, b / 2, b / 2); ctx.setLineDash([]);
  ctx.fillStyle = '#f5f0e5'; ctx.font = '21px Georgia'; ctx.fillText('x²', left + x * .44, top + x * .52); ctx.fillText('bx/2', left + x + 5, top + x * .52); ctx.fillText('bx/2', left + x * .4, top + x + b * .32); ctx.fillText('(b/2)²', left + x + b * .58, top + x + b * .35);
  const formulaX = Math.min(w - 290, left + x + b + 65);
  ctx.fillStyle = '#91a7a1'; ctx.font = '10px ui-monospace'; ctx.fillText('COMPLETE THE SQUARE', formulaX, top + 18);
  ctx.fillStyle = '#83ead0'; ctx.font = '22px Georgia'; ctx.fillText('x² + bx + (b/2)²', formulaX, top + 70); ctx.fillText('= (x + b/2)²', formulaX, top + 112);
  ctx.fillStyle = '#f0bf52'; ctx.font = '13px ui-monospace'; ctx.fillText(`b / x = ${(b / x).toFixed(2)}`, formulaX, top + 158);
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

function drawProbability(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const n = 12, p = .05 + .9 * t, margin = 48, base = h - 60, chartW = w - margin * 2, chartH = h - 145;
  const choose = (total: number, k: number) => { let result = 1; for (let i = 1; i <= k; i++) result = result * (total - i + 1) / i; return result; };
  const values = Array.from({ length: n + 1 }, (_, k) => choose(n, k) * p ** k * (1 - p) ** (n - k));
  const max = Math.max(...values), gap = chartW / (n + 1), barW = Math.max(6, gap * .66);
  values.forEach((value, k) => { const barH = value / max * chartH; ctx.fillStyle = k === Math.round(n * p) ? '#f0bf52' : 'rgba(72,217,173,.62)'; ctx.fillRect(margin + k * gap + (gap - barW) / 2, base - barH, barW, barH); ctx.fillStyle = '#91a7a1'; ctx.font = '8px ui-monospace'; ctx.fillText(String(k), margin + k * gap + gap * .35, base + 16); });
  ctx.strokeStyle = '#75908a'; ctx.beginPath(); ctx.moveTo(margin, base); ctx.lineTo(w - margin, base); ctx.stroke();
  ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(`p = ${p.toFixed(2)}`, 45, 73); ctx.fillStyle = '#91a7a1'; ctx.font = '10px ui-monospace'; ctx.fillText(`12 次独立试验 · 期望成功次数 = ${(n * p).toFixed(1)}`, 48, 101);
}

function drawCalculus(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const split = w * .5, margin = 42, top = 58, base = h - 48, panelW = split - margin * 1.45, panelH = base - top;
  const curveY = (u: number) => base - (u * u * .72 + .08) * panelH;
  ctx.strokeStyle = '#75908a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(margin, base); ctx.lineTo(split - 18, base); ctx.moveTo(margin, base); ctx.lineTo(margin, top); ctx.stroke();
  ctx.strokeStyle = '#48d9ad'; ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i <= 100; i++) { const u = i / 100, px = margin + u * panelW, py = curveY(u); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.stroke();
  const u0 = .55, du = Math.max(.015, .38 * (1 - t)), x0 = margin + u0 * panelW, y0 = curveY(u0), x1 = margin + (u0 + du) * panelW, y1 = curveY(u0 + du), slope = (y1 - y0) / (x1 - x0);
  ctx.strokeStyle = '#f0bf52'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 72, y0 - slope * 72); ctx.lineTo(x0 + 90, y0 + slope * 90); ctx.stroke(); ctx.fillStyle = '#f0bf52'; ctx.beginPath(); ctx.arc(x0, y0, 4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(x1, y1, 4, 0, Math.PI * 2); ctx.fill();
  const rightX = split + 24, rightW = w - rightX - margin, n = 2 + Math.floor(t * 22), rectW = rightW / n;
  ctx.strokeStyle = '#75908a'; ctx.beginPath(); ctx.moveTo(rightX, base); ctx.lineTo(w - margin, base); ctx.moveTo(rightX, base); ctx.lineTo(rightX, top); ctx.stroke();
  for (let i = 0; i < n; i++) { const u = (i + 1) / n, rh = (u * u * .72 + .08) * panelH; ctx.fillStyle = 'rgba(182,155,242,.25)'; ctx.strokeStyle = 'rgba(182,155,242,.72)'; ctx.fillRect(rightX + i * rectW, base - rh, rectW, rh); ctx.strokeRect(rightX + i * rectW, base - rh, rectW, rh); }
  ctx.strokeStyle = '#48d9ad'; ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i <= 100; i++) { const u = i / 100, px = rightX + u * rightW, py = base - (u * u * .72 + .08) * panelH; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.stroke();
  ctx.fillStyle = '#f5f0e5'; ctx.font = '17px Georgia'; ctx.fillText(`Δx = ${du.toFixed(3)}`, margin, 34); ctx.fillText(`${n} rectangles`, rightX, 34);
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

function drawTopology(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cx = w * .5, cy = h * .54, scale = Math.min(w, h) * .22, wobble = Math.sin(t * Math.PI * 2) * scale * .18;
  const basePoints = [[-1,-1], [1,-1], [1,1], [-1,1], [-.48,-.48], [.48,-.48], [.48,.48], [-.48,.48]];
  const points = basePoints.map(([x, y], index) => ({ x: cx + x * scale + Math.sin(t * 6 + index) * wobble, y: cy + y * scale + Math.cos(t * 5 + index * .7) * wobble * .65 }));
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const divided = t > .55;
  ctx.strokeStyle = 'rgba(72,217,173,.78)'; ctx.lineWidth = 2;
  edges.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(points[a].x, points[a].y); ctx.lineTo(points[b].x, points[b].y); ctx.stroke(); });
  if (divided) { ctx.strokeStyle = '#f0bf52'; ctx.beginPath(); ctx.moveTo(points[4].x, points[4].y); ctx.lineTo(points[6].x, points[6].y); ctx.stroke(); }
  points.forEach(point => { ctx.fillStyle = '#f5f0e5'; ctx.beginPath(); ctx.arc(point.x, point.y, 4, 0, Math.PI * 2); ctx.fill(); });
  const edgeCount = divided ? 13 : 12, faceCount = divided ? 7 : 6;
  ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(`8 − ${edgeCount} + ${faceCount} = 2`, 42, 76);
  ctx.fillStyle = '#91a7a1'; ctx.font = '10px ui-monospace'; ctx.fillText('V − E + F · CONTINUOUS DEFORMATION', 45, 104);
}

function drawChaos(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const r = 2.5 + 1.5 * t, margin = 48, top = 118, bottom = h - 44, plotW = w - margin * 2, plotH = bottom - top;
  ctx.strokeStyle = '#75908a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(margin, top); ctx.lineTo(margin, bottom); ctx.lineTo(w - margin, bottom); ctx.stroke();
  const drawOrbit = (initial: number, color: string) => { let x = initial; ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.beginPath(); for (let i = 0; i < 92; i++) { x = r * x * (1 - x); const px = margin + i / 91 * plotW, py = bottom - x * plotH; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.stroke(); };
  drawOrbit(.2, '#48d9ad'); drawOrbit(.20001, '#f0bf52');
  ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(`r = ${r.toFixed(3)}`, 43, 72);
  ctx.fillStyle = '#91a7a1'; ctx.font = '10px ui-monospace'; ctx.fillText('xₙ₊₁ = r xₙ(1 − xₙ) · 两个初值只差 0.00001', 46, 101);
  ctx.fillStyle = '#48d9ad'; ctx.fillRect(w - 236, 52, 14, 2); ctx.fillStyle = '#91a7a1'; ctx.fillText('x₀ = 0.2', w - 214, 56); ctx.fillStyle = '#f0bf52'; ctx.fillRect(w - 130, 52, 14, 2); ctx.fillStyle = '#91a7a1'; ctx.fillText('x₀ + ε', w - 108, 56);
}

function drawOptimization(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cx = w * .56, cy = h * .54, sx = Math.min(w, h) * .3, sy = Math.min(w, h) * .19, alpha = .04 + t * .64;
  ctx.strokeStyle = 'rgba(72,217,173,.3)'; ctx.lineWidth = 1.2;
  for (let level = 1; level <= 7; level++) { ctx.beginPath(); ctx.ellipse(cx, cy, sx * level / 7, sy * level / 7, 0, 0, Math.PI * 2); ctx.stroke(); }
  let x = .92, y = .82; const points: { x: number; y: number }[] = [];
  for (let step = 0; step < 24; step++) { points.push({ x: cx + x * sx, y: cy - y * sy }); x *= 1 - alpha; y *= 1 - 4 * alpha; if (Math.abs(x) + Math.abs(y) > 12) break; }
  ctx.strokeStyle = '#f0bf52'; ctx.lineWidth = 2.2; ctx.beginPath(); points.forEach((point, index) => { if (index) ctx.lineTo(point.x, point.y); else ctx.moveTo(point.x, point.y); }); ctx.stroke();
  points.forEach((point, index) => { ctx.fillStyle = index === points.length - 1 ? '#f5f0e5' : '#f0bf52'; ctx.beginPath(); ctx.arc(point.x, point.y, index === points.length - 1 ? 5 : 2.5, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#f5f0e5'; ctx.font = '42px Georgia'; ctx.fillText(`η = ${alpha.toFixed(2)}`, 42, 75);
  ctx.fillStyle = '#91a7a1'; ctx.font = '10px ui-monospace'; ctx.fillText('GRADIENT DESCENT · f(x,y) = ½(x² + 4y²)', 45, 103);
  ctx.fillStyle = alpha < .48 ? '#83ead0' : '#f07f63'; ctx.font = '13px ui-monospace'; ctx.fillText(alpha < .48 ? '收敛：每一步都更接近低谷' : '步长过大：狭窄方向开始振荡或发散', 45, h - 36);
}
