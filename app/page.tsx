'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const lessons = [
  { id: 'start', label: '起点', title: '空间不是静止的' },
  { id: 'quaternion', label: '01', title: '四元数 · 旋转的语言' },
  { id: 'rotor', label: '02', title: '转子 · 平面的旋转' },
  { id: 'algebra', label: '03', title: '几何代数 · 统一视角' },
  { id: 'notes', label: '04', title: '读懂 GA · 记号与层级' },
  { id: 'spaces', label: '05', title: '空间结构的变幻' },
];

const toRad = (degrees: number) => (degrees * Math.PI) / 180;

function SpaceCanvas({ angle, tilt, azimuth, elevation }: { angle: number; tilt: number; azimuth: number; elevation: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const gpuRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (rect.width * dpr !== canvas.width || rect.height * dpr !== canvas.height) { canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; }
      const w = rect.width, h = rect.height, cx = w * .49, cy = h * .52, scale = Math.min(w, h) * .24;
      const a = toRad(angle), t = toRad(tilt), az = toRad(azimuth), el = toRad(elevation);
      const project = (x: number, y: number, z: number) => [cx + (x - (y * Math.cos(t) - z * Math.sin(t)) * .72) * scale, cy - ((y * Math.sin(t) + z * Math.cos(t)) + x * .28) * scale] as const;
      const line = (from: number[], to: number[], color: string, width = 1, dash?: number[]) => { const p = project(from[0], from[1], from[2]), q = project(to[0], to[1], to[2]); ctx.beginPath(); ctx.setLineDash(dash || []); ctx.moveTo(...p); ctx.lineTo(...q); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); ctx.setLineDash([]); };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#101720'; ctx.fillRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, scale * 2.2); glow.addColorStop(0, 'rgba(47,230,181,.13)'); glow.addColorStop(1, 'rgba(15,23,32,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
      for (let i = -3; i <= 3; i++) { line([-2.6, i * .5, 0], [2.6, i * .5, 0], 'rgba(123,145,158,.18)'); line([i * .5, -2.6, 0], [i * .5, 2.6, 0], 'rgba(123,145,158,.14)'); }
      line([-2.3, 0, 0], [2.35, 0, 0], 'rgba(230,240,242,.55)', 1.25); line([0, -2.2, 0], [0, 2.25, 0], 'rgba(230,240,242,.55)', 1.25); line([0, 0, -1.85], [0, 0, 1.85], 'rgba(230,240,242,.55)', 1.25);
      const axis = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
      const initial = [1.38, .45, .38];
      const cross = [axis[1] * initial[2] - axis[2] * initial[1], axis[2] * initial[0] - axis[0] * initial[2], axis[0] * initial[1] - axis[1] * initial[0]];
      const dot = axis[0] * initial[0] + axis[1] * initial[1] + axis[2] * initial[2];
      const rotated = initial.map((v, i) => v * Math.cos(a) + cross[i] * Math.sin(a) + axis[i] * dot * (1 - Math.cos(a)));
      line(axis.map(v => -v * 2.1), axis.map(v => v * 2.1), 'rgba(179,151,240,.8)', 1.75, [4, 5]);
      line([0, 0, 0], initial, 'rgba(245,184,79,.48)', 2, [5, 5]); line([0, 0, 0], rotated, '#50e6bd', 3);
      const end = project(...rotated), start = project(0, 0, 0); ctx.beginPath(); ctx.arc(...end, 6, 0, Math.PI * 2); ctx.fillStyle = '#50e6bd'; ctx.fill(); ctx.beginPath(); ctx.arc(...start, 4, 0, Math.PI * 2); ctx.fillStyle = '#e8f0ef'; ctx.fill();
      ctx.font = '12px ui-monospace, monospace'; ctx.fillStyle = '#8fa3ac'; const before = project(...initial), axisEnd = project(...axis.map(v => v * 2.1)); ctx.fillText('v', before[0] + 8, before[1] - 5); ctx.fillStyle = '#8af0d1'; ctx.fillText('qvq⁻¹', end[0] + 9, end[1] - 8); ctx.fillStyle = '#c9baf7'; ctx.fillText('n̂', axisEnd[0] + 7, axisEnd[1] - 4); ctx.fillStyle = '#a9bac1'; ctx.fillText('rotation plane', w - 120, h - 28);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw); return () => cancelAnimationFrame(frame);
  }, [angle, tilt, azimuth, elevation]);
  useEffect(() => {
    const canvas = gpuRef.current;
    const gpu = (navigator as unknown as { gpu?: { requestAdapter: () => Promise<unknown>; getPreferredCanvasFormat: () => string } }).gpu;
    if (!canvas || !gpu) return;
    let disposed = false;
    const setup = async () => {
      const adapter = await gpu.requestAdapter() as { requestDevice: () => Promise<unknown> } | null;
      if (!adapter || disposed) return;
      const device = await adapter.requestDevice() as { createShaderModule: (x: unknown) => unknown; createRenderPipeline: (x: unknown) => unknown; createCommandEncoder: () => unknown; queue: { submit: (x: unknown[]) => void } };
      const context = canvas.getContext('webgpu') as unknown as { configure: (x: unknown) => void; getCurrentTexture: () => { createView: () => unknown } };
      if (!context || disposed) return;
      const format = gpu.getPreferredCanvasFormat();
      const shader = device.createShaderModule({ code: `@vertex fn v(@builtin(vertex_index) i:u32)->@builtin(position) vec4f { var p=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.)); return vec4f(p[i],0.,1.); } @fragment fn f(@builtin(position) p:vec4f)->@location(0) vec4f { let x=fract(p.x/42.); let y=fract(p.y/42.); let g=step(x,.018)+step(y,.018); return vec4f(.16,.95,.73,g*.075); }` });
      const pipeline = device.createRenderPipeline({ layout: 'auto', vertex: { module: shader, entryPoint: 'v' }, fragment: { module: shader, entryPoint: 'f', targets: [{ format, blend: { color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' } } }] }, primitive: { topology: 'triangle-list' } });
      const render = () => {
        if (disposed) return;
        const dpr = Math.min(devicePixelRatio, 2), box = canvas.getBoundingClientRect(); canvas.width = Math.round(box.width * dpr); canvas.height = Math.round(box.height * dpr);
        context.configure({ device, format, alphaMode: 'premultiplied' });
        const encoder = device.createCommandEncoder() as { beginRenderPass: (x: unknown) => { setPipeline: (x: unknown) => void; draw: (x: number) => void; end: () => void }; finish: () => unknown };
        const pass = encoder.beginRenderPass({ colorAttachments: [{ view: context.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 0 } }] }); pass.setPipeline(pipeline); pass.draw(3); pass.end(); device.queue.submit([encoder.finish()]);
      };
      render(); window.addEventListener('resize', render); return () => window.removeEventListener('resize', render);
    };
    let cleanup: (() => void) | undefined; setup().then(value => { cleanup = value; });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return <><canvas ref={ref} className="space-canvas" aria-label="可交互的三维旋转空间图像" /><canvas ref={gpuRef} className="gpu-canvas" aria-hidden="true" /></>;
}

function Formula({ children, caption }: { children: React.ReactNode; caption?: string }) { return <figure className="formula"><code>{children}</code>{caption && <figcaption>{caption}</figcaption>}</figure>; }

export default function Home() {
  const [active, setActive] = useState('start'); const [angle, setAngle] = useState(64); const [tilt, setTilt] = useState(25); const [azimuth, setAzimuth] = useState(30); const [elevation, setElevation] = useState(35); const [webgpu, setWebgpu] = useState(false);
  useEffect(() => { setWebgpu(typeof navigator !== 'undefined' && 'gpu' in navigator); }, []);
  const quaternion = useMemo(() => { const half = toRad(angle) / 2, az = toRad(azimuth), el = toRad(elevation), s = Math.sin(half); return { w: Math.cos(half), x: Math.cos(el) * Math.cos(az) * s, y: Math.cos(el) * Math.sin(az) * s, z: Math.sin(el) * s }; }, [angle, azimuth, elevation]);
  const select = (id: string) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return <main>
    <aside className="sidebar"><a className="brand" href="#start" onClick={() => select('start')}><span className="brand-mark"><i /><i /><i /></span><span>GA / SPACE</span></a><div className="course-label">一场空间漫游</div><nav aria-label="教程目录">{lessons.map((item) => <button key={item.id} onClick={() => select(item.id)} className={active === item.id ? 'active' : ''}><span>{item.label}</span><em>{item.title}</em></button>)}</nav><div className="sidebar-bottom"><span className="dot" /> 第 1 / 5 节<br /><small>以交互建立直觉</small></div></aside>
    <div className="mobile-head"><span className="brand-mark"><i /><i /><i /></span><b>GA / SPACE</b><span>空间漫游 · 01</span></div>
    <section className="content" onScroll={(e) => { const container = e.currentTarget, mid = container.scrollTop + container.clientHeight * .38; const nearest = lessons.reduce((best, item) => { const el = document.getElementById(item.id), distance = el ? Math.abs(el.offsetTop - mid) : Infinity; return distance < best.distance ? { id: item.id, distance } : best; }, { id: active, distance: Infinity }); if (nearest.id !== active) setActive(nearest.id); }}>
      <section id="start" className="hero section"><p className="eyebrow">从四元数开始 · 一份可玩的教程</p><h1>看见<br /><i>空间如何改变。</i></h1><p className="lede">旋转不是把物体“转过去”而已。它揭示了空间里方向、平面与维度之间更深的秩序。</p><div className="hero-meta"><span>约 45 分钟</span><span>•</span><span>5 个互动实验</span><span>•</span><span>无需预备知识</span></div><button className="begin" onClick={() => select('quaternion')}>开始漫游 <b>↓</b></button><div className="hero-orbit"><span /><span /><span /><strong>e<sup>iθ</sup></strong></div></section>
      <section id="quaternion" className="section lesson"><div className="section-no">01 / QUATERNION</div><h2>先忘掉三维。<br />从一个<span>旋转</span>开始。</h2><p>复数 <i>a + bi</i> 可以在平面上表达旋转；四元数则把这种能力带入三维。它不是多加一个神秘维度，而是给“绕任意轴转动”找到了一个极其紧凑的语言。</p><Formula caption="单位四元数：标量部分 + 指向旋转轴的向量部分">q = cos(θ/2) + n̂ sin(θ/2)</Formula><div className="callout"><span>✦</span><p><b>关键直觉</b>：角度被折半了。因为一次空间旋转，本质上是在“方向的方向”中完成的一次双重映射。</p></div></section>
      <section id="rotor" className="section experiment"><div className="experiment-top"><div><div className="section-no">02 / LIVE LAB</div><h2>亲手转动<br />一根<span>向量。</span></h2></div><div className={webgpu ? 'gpu-pill online' : 'gpu-pill'}><i /> {webgpu ? 'WEBGPU READY' : 'CANVAS MODE'}</div></div><div className="lab-card"><SpaceCanvas angle={angle} tilt={tilt} azimuth={azimuth} elevation={elevation} /><div className="readout"><span>ANGLE</span><b>{String(angle).padStart(3, '0')}°</b><small>axis · n̂</small></div></div><div className="controls"><label><span>旋转角 θ</span><output>{angle}°</output><input aria-label="旋转角" type="range" min="0" max="360" value={angle} onChange={e => setAngle(+e.target.value)} /></label><label><span>观察倾角</span><output>{tilt}°</output><input aria-label="观察倾角" type="range" min="-35" max="65" value={tilt} onChange={e => setTilt(+e.target.value)} /></label><label><span>旋转轴方位 φ</span><output>{azimuth}°</output><input aria-label="旋转轴方位" type="range" min="-180" max="180" value={azimuth} onChange={e => setAzimuth(+e.target.value)} /></label><label><span>旋转轴仰角 λ</span><output>{elevation}°</output><input aria-label="旋转轴仰角" type="range" min="-85" max="85" value={elevation} onChange={e => setElevation(+e.target.value)} /></label></div><Formula caption="紫色虚线是单位旋转轴 n̂；四元数的虚部正指向它。">q = {quaternion.w.toFixed(3)} + ({quaternion.x.toFixed(3)})i + ({quaternion.y.toFixed(3)})j + ({quaternion.z.toFixed(3)})k</Formula><p className="lab-note">绿色向量是 <i>v</i> 经 <i>qvq⁻¹</i> 旋转后的结果。拖动四个滑块，留意：不论轴转向哪里、角度变成多少，向量长度始终不变。</p></section>
      <section id="algebra" className="section lesson algebra"><div className="section-no">03 / GEOMETRIC ALGEBRA</div><h2>不只处理“数”。<br />也处理<span>方向与平面。</span></h2><p>几何代数（GA）把向量、面积、体积乃至更高维的“定向元素”都放入同一种代数里。你不必记住一套套独立规则：几何关系自己成为了运算。</p><Formula caption="几何积同时包含投影（点积）与张开的平面（外积）">ab = a · b + a ∧ b</Formula><div className="comparison"><div><span className="chip yellow">a · b</span><b>标量</b><p>两个方向有多对齐？</p></div><div><span className="chip mint">a ∧ b</span><b>双向量</b><p>它们张开哪一个平面？</p></div><div><span className="chip violet">ab</span><b>几何积</b><p>两种信息同时保留。</p></div></div><p>在这个视角里，四元数不再是一个孤岛：它恰好是三维几何代数的偶子代数。四元数旋转，也有了更普适的名字：<b>转子（rotor）</b>。</p></section>
      <section id="notes" className="section notes"><div className="section-no">04 / FIELD NOTES</div><h2>把 GA 当成一份<br /><span>空间的词典。</span></h2><p className="notes-lede">下面四个词，足够让你在继续探索前建立稳定的阅读坐标。它们不是新的计算负担，而是帮你辨认“眼前这个对象代表什么”。</p><div className="notes-grid"><article><span>01 · basis</span><h3>基向量</h3><p><b>e₁, e₂, e₃</b> 是空间的三条“说话方向”。向量是它们的线性组合；选一套基，就像选定了地图的东、北、上。</p><code>v = v₁e₁ + v₂e₂ + v₃e₃</code></article><article><span>02 · grade</span><h3>层级</h3><p><b>标量、向量、双向量、三向量</b>分别描述大小、方向、定向平面与定向体积。GA 把它们并排放在同一张桌上。</p><div className="grade-row"><i>0</i><i>1</i><i>2</i><i>3</i></div></article><article><span>03 · orientation</span><h3>定向</h3><p><b>面积不只是数值。</b>从 a 转到 b 的顺序不同，a∧b 与 b∧a 的方向相反；这是旋转会“带方向”的根源。</p><code>a ∧ b = −b ∧ a</code></article><article><span>04 · reverse</span><h3>反演</h3><p>把复合对象的乘积顺序倒过来，得到反演 <b>~R</b>。单位转子的反演恰好就是逆，因此旋转可以无损地撤销。</p><code>v′ = Rv~R</code></article></div><div className="reading-tip"><span>读法</span><p>遇到一个 GA 表达式，先问：它的每一项是<span>点</span>、<span>方向</span>、<span>平面</span>还是<span>体积</span>？再问它们如何相乘。把几何意义放在符号之前，公式就不再只是公式。</p></div></section>
      <section id="spaces" className="section future"><div className="section-no">05 / FURTHER OUT</div><h2>再往前，<br />空间会<span>长出翅膀。</span></h2><p>掌握了旋转与几何积，许多看似不同的空间变换开始显露同一个骨架。以下是接下来的站点地图。</p><div className="future-grid"><article className="future-card card-1"><span>01</span><h3>共形几何代数</h3><p>把圆、直线、球与平面放在同一个空间里，自然地做反演与保角变换。</p><div className="circle-art"><i /><i /><b /></div></article><article className="future-card card-2"><span>02</span><h3>时空与洛伦兹变换</h3><p>当“时间”也成为一个方向，旋转会变成推动（boost）。</p><div className="cone-art"><i /><i /><i /></div></article><article className="future-card card-3"><span>03</span><h3>刚体运动</h3><p>用双四元数与马达，同时表达旋转、平移和它们的连续插值。</p><div className="motor-art"><i /><i /><i /></div></article></div><div className="ending"><span>◇</span><p>空间不是容器。<br /><b>它是关系运行的方式。</b></p><button onClick={() => select('start')}>回到起点 ↑</button></div></section>
    </section>
  </main>;
}
