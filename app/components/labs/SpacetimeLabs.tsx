'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid } from './drawing';
import { LabFrame, Slider } from './LabChrome';

type Event2=readonly[number,number]; // [x, ct]
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
const interval=([x,ct]:Event2)=>ct*ct-x*x;
function eventToScreen(e:Event2,cx:number,cy:number,u:number){return[cx+e[0]*u,cy-e[1]*u] as const;}
function pointerEvent(p:CanvasPointer):Event2{const cx=p.width*.5,cy=p.height*.57,u=Math.min(p.width,p.height)*.18;return[clamp((p.x-cx)/u,-2.35,2.35),clamp((cy-p.y)/u,-2.2,2.2)];}

function drawSpacetimeBase(ctx:CanvasRenderingContext2D,width:number,height:number,cx:number,cy:number,u:number){
  drawDarkGrid(ctx,width,height,34);ctx.strokeStyle='rgba(216,227,224,.22)';ctx.beginPath();ctx.moveTo(18,cy);ctx.lineTo(width-18,cy);ctx.moveTo(cx,height-22);ctx.lineTo(cx,24);ctx.stroke();const a=eventToScreen([-2.5,-2.5],cx,cy,u),b=eventToScreen([2.5,2.5],cx,cy,u),c=eventToScreen([-2.5,2.5],cx,cy,u),d=eventToScreen([2.5,-2.5],cx,cy,u);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.moveTo(...c);ctx.lineTo(...d);ctx.strokeStyle='rgba(239,189,85,.48)';ctx.setLineDash([6,5]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('x',width-28,cy-8);ctx.fillText('ct',cx+8,28);ctx.fillText('light cone · X²=0',18,22);
}

export function MinkowskiIntervalLab(){
  const [event,setEvent]=useState<Event2>([.82,1.48]);const s2=interval(event),eps=.012,kind=s2>eps?'timelike':s2< -eps?'spacelike':'lightlike / null',measure=Math.sqrt(Math.abs(s2));
  const draw=({ctx,width,height}:CanvasFrame)=>{const cx=width*.5,cy=height*.57,u=Math.min(width,height)*.18;drawSpacetimeBase(ctx,width,height,cx,cy,u);
    const hyperbola=(timelike:boolean,color:string)=>{for(const branch of [-1,1]){let prev:readonly[number,number]|null=null;for(let i=-120;i<=120;i++){const v=i/55,p:Event2=timelike?[v,branch*Math.sqrt(1+v*v)]:[branch*Math.sqrt(1+v*v),v],q=eventToScreen(p,cx,cy,u);if(prev){ctx.beginPath();ctx.moveTo(...prev);ctx.lineTo(...q);ctx.strokeStyle=color;ctx.stroke();}prev=q;}}};hyperbola(true,'rgba(75,218,176,.16)');hyperbola(false,'rgba(182,155,242,.15)');
    const o=eventToScreen([0,0],cx,cy,u),p=eventToScreen(event,cx,cy,u);drawArrow2D(ctx,...o,...p,kind.startsWith('time')?'#4bdab0':kind.startsWith('space')?'#b69bf2':'#efbd55','X');ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(p[0],cy);ctx.lineTo(...p);ctx.lineTo(cx,p[1]);ctx.strokeStyle='rgba(216,227,224,.25)';ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(...p,7,0,Math.PI*2);ctx.fillStyle=kind.startsWith('time')?'#4bdab0':kind.startsWith('space')?'#b69bf2':'#efbd55';ctx.fill();
  };
  const move=(p:CanvasPointer)=>{if(p.phase!=='up')setEvent(pointerEvent(p));};
  return <LabFrame title="非零事件也可能平方为零；符号决定可因果到达性" tag="LAB · MINKOWSKI INTERVAL" metrics={[["X²=(ct)²−x²",s2.toFixed(3)],["causal type",kind],[s2>=0?"proper time cτ":"proper distance σ",measure.toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[event]} onPointer={move} label="拖动时空事件观察 Minkowski 间隔与光锥分类" />
    <div className="operation-tabs"><button onClick={()=>setEvent([.7,1.45])}><b>timelike</b><span>可存在慢于光的因果联系</span></button><button onClick={()=>setEvent([1.25,1.25])}><b>null</b><span>光信号路径</span></button><button onClick={()=>setEvent([1.55,.62])}><b>spacelike</b><span>无因果连接</span></button></div>
    <div className="quaternion-readout"><code>X=ct γ₀+xγ₁ &nbsp;·&nbsp; γ₀²=+1, γ₁²=−1</code><code>X²&gt;0 timelike &nbsp;·&nbsp; X²=0 null &nbsp;·&nbsp; X²&lt;0 spacelike &nbsp;·&nbsp; c=1 on canvas</code></div>
  </LabFrame>;
}

export function LorentzBoostLab(){
  const [beta,setBeta]=useState(.58),[x,setX]=useState(.82),[ct,setCt]=useState(1.48),gamma=1/Math.sqrt(1-beta*beta),eta=Math.atanh(beta),xp=gamma*(x-beta*ct),ctp=gamma*(ct-beta*x),s2=ct*ct-x*x,s2p=ctp*ctp-xp*xp;
  const draw=({ctx,width,height}:CanvasFrame)=>{const cx=width*.5,cy=height*.59,u=Math.min(width,height)*.17;drawSpacetimeBase(ctx,width,height,cx,cy,u);
    const timeDir:Event2=[gamma*beta,gamma],spaceDir:Event2=[gamma,gamma*beta],drawAxis=(v:Event2,color:string,label:string)=>{const n=Math.max(Math.abs(v[0]),Math.abs(v[1]))||1,a:Event2=[-v[0]*2.35/n,-v[1]*2.35/n],b:Event2=[v[0]*2.35/n,v[1]*2.35/n],A=eventToScreen(a,cx,cy,u),B=eventToScreen(b,cx,cy,u);ctx.beginPath();ctx.moveTo(...A);ctx.lineTo(...B);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=color;ctx.font='11px ui-monospace, monospace';ctx.fillText(label,B[0]+6,B[1]-6);};
    drawAxis(timeDir,'#4bdab0','ct′ axis');drawAxis(spaceDir,'#b69bf2','x′ axis');const E:Event2=[x,ct],p=eventToScreen(E,cx,cy,u),o=eventToScreen([0,0],cx,cy,u),alongTime:Event2=[ctp*timeDir[0],ctp*timeDir[1]],q=eventToScreen(alongTime,cx,cy,u);drawArrow2D(ctx,...o,...p,'#efbd55','event X');ctx.beginPath();ctx.moveTo(...o);ctx.lineTo(...q);ctx.lineTo(...p);ctx.strokeStyle='rgba(216,227,224,.5)';ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('parallelogram reads X=ct′γ₀′+x′γ₁′',18,22);
  };
  return <LabFrame title="boost 是时空平面里的双曲旋转：光锥和间隔不动，坐标轴倾斜" tag="LAB · LORENTZ BOOST" metrics={[["β / rapidity",`${beta.toFixed(3)} / ${eta.toFixed(3)}`],["(ct′, x′)",`(${ctp.toFixed(2)}, ${xp.toFixed(2)})`],["interval error",Math.abs(s2p-s2).toExponential(1)]]}>
    <InteractiveCanvas draw={draw} dependencies={[beta,x,ct]} label="Lorentz boost 中倾斜坐标轴光锥与不变时空间隔实验" />
    <div className="lab-controls"><Slider label="相对速度 β=v/c" value={beta} min={-.92} max={.92} step={.01} onChange={setBeta}/><Slider label="事件空间坐标 x" value={x} min={-1.8} max={1.8} step={.01} onChange={setX}/><Slider label="事件时间坐标 ct" value={ct} min={.2} max={2.1} step={.01} onChange={setCt}/></div>
    <div className="quaternion-readout"><code>η=artanh β &nbsp;·&nbsp; R=exp(ηγ₁₀/2), γ₁₀²=+1</code><code>ct′=γ(ct−βx) &nbsp;·&nbsp; x′=γ(x−βct) &nbsp;·&nbsp; (ct′)²−x′²=(ct)²−x²</code></div>
  </LabFrame>;
}

export function ObserverSplitLab(){
  const [beta,setBeta]=useState(.52),[event,setEvent]=useState<Event2>([.92,1.55]);
  const gamma=1/Math.sqrt(1-beta*beta),observedTime=gamma*(event[1]-beta*event[0]),observedSpace=gamma*(event[0]-beta*event[1]),s2=interval(event),reconstructed=observedTime*observedTime-observedSpace*observedSpace;
  const draw=({ctx,width,height}:CanvasFrame)=>{const cx=width*.5,cy=height*.59,u=Math.min(width,height)*.17;drawSpacetimeBase(ctx,width,height,cx,cy,u);
    const timeAxis:Event2=[gamma*beta,gamma],spaceAxis:Event2=[gamma,gamma*beta];
    const drawAxis=(v:Event2,color:string,label:string)=>{const n=Math.max(Math.abs(v[0]),Math.abs(v[1]))||1;const a=eventToScreen([-2.35*v[0]/n,-2.35*v[1]/n],cx,cy,u),b=eventToScreen([2.35*v[0]/n,2.35*v[1]/n],cx,cy,u);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=color;ctx.font='11px ui-monospace, monospace';ctx.fillText(label,b[0]+6,b[1]-6);};
    drawAxis(timeAxis,'#4bdab0','observer u');drawAxis(spaceAxis,'#b69bf2','u-space');
    const origin=eventToScreen([0,0],cx,cy,u),target=eventToScreen(event,cx,cy,u),parallel:Event2=[observedTime*timeAxis[0],observedTime*timeAxis[1]],parallelPoint=eventToScreen(parallel,cx,cy,u);
    ctx.fillStyle='rgba(143,154,238,.08)';ctx.beginPath();ctx.moveTo(...origin);ctx.lineTo(...parallelPoint);ctx.lineTo(...target);ctx.lineTo(...eventToScreen([observedSpace*spaceAxis[0],observedSpace*spaceAxis[1]],cx,cy,u));ctx.closePath();ctx.fill();
    drawArrow2D(ctx,...origin,...parallelPoint,'#4bdab0','(X·u)u');drawArrow2D(ctx,...parallelPoint,...target,'#b69bf2','X⊥');drawArrow2D(ctx,...origin,...target,'#efbd55','X');
    ctx.beginPath();ctx.arc(...target,7,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('drag X · change β below',18,22);
  };
  const move=(p:CanvasPointer)=>{if(p.phase==='up')return;const cx=p.width*.5,cy=p.height*.59,u=Math.min(p.width,p.height)*.17;setEvent([clamp((p.x-cx)/u,-2.35,2.35),clamp((cy-p.y)/u,-2.2,2.2)]);};
  return <LabFrame title="事件不变；观察者的时间方向决定它如何被切成时间与空间" tag="LAB · OBSERVER SPLIT" metrics={[["X·u / ctᵤ",observedTime.toFixed(3)],["signed xᵤ",observedSpace.toFixed(3)],["interval error",Math.abs(s2-reconstructed).toExponential(1)]]}>
    <InteractiveCanvas draw={draw} dependencies={[beta,event]} onPointer={move} label="拖动事件并改变观察者速度，比较时空分解" />
    <div className="lab-controls"><Slider label="观察者速度 β=v/c" value={beta} min={-.88} max={.88} step={.01} onChange={setBeta}/></div>
    <div className="operation-tabs"><button onClick={()=>setEvent([0,1.5])}><b>原系静止事件</b><span>运动观察者仍测得空间分量</span></button><button onClick={()=>setEvent([1.25,1.25])}><b>null event</b><span>任何观察者仍判为 null</span></button><button onClick={()=>setEvent([1.55,.7])}><b>spacelike</b><span>分解变、因果类型不变</span></button></div>
    <div className="quaternion-readout"><code>u=γ(γ₀+βγ₁), u²=1 &nbsp;·&nbsp; X∥=(X·u)u &nbsp;·&nbsp; X⊥=X−X∥</code><code>ctᵤ=γ(ct−βx) &nbsp;·&nbsp; xᵤ=γ(x−βct) &nbsp;·&nbsp; X²=ctᵤ²−xᵤ²</code></div>
  </LabFrame>;
}

function drawFieldPanel(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,title:string,e:readonly[number,number],b:readonly[number,number]){
  ctx.fillStyle='rgba(255,255,255,.025)';ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(216,227,224,.13)';ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.fillStyle='#91a3a0';ctx.font='11px ui-monospace, monospace';ctx.fillText(title,x+14,y+22);
  const cx=x+w*.5,cy=y+h*.57,scale=Math.min(w,h)*.24;ctx.strokeStyle='rgba(216,227,224,.16)';ctx.beginPath();ctx.moveTo(x+14,cy);ctx.lineTo(x+w-14,cy);ctx.moveTo(cx,y+34);ctx.lineTo(cx,y+h-16);ctx.stroke();drawArrow2D(ctx,cx,cy,cx+e[0]*scale,cy-e[1]*scale,'#efbd55','E');
  const bx=cx+w*.28,by=cy-h*.24,r=9,sign=b[1];ctx.beginPath();ctx.arc(bx,by,r,0,Math.PI*2);ctx.strokeStyle='#b69bf2';ctx.lineWidth=2;ctx.stroke();if(sign>=0){ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fillStyle='#b69bf2';ctx.fill();}else{ctx.beginPath();ctx.moveTo(bx-5,by-5);ctx.lineTo(bx+5,by+5);ctx.moveTo(bx+5,by-5);ctx.lineTo(bx-5,by+5);ctx.stroke();}ctx.fillStyle='#b69bf2';ctx.fillText(`Bz ${sign>=0?'⊙':'⊗'} ${Math.abs(sign).toFixed(2)}`,bx-33,by+28);ctx.fillStyle='#62a8e5';ctx.fillText(`Bx ${b[0].toFixed(2)} →`,x+14,y+h-16);
}

export function ElectromagneticBivectorLab(){
  const [beta,setBeta]=useState(.56),[ey,setEy]=useState(.82),[bz,setBz]=useState(.46),gamma=1/Math.sqrt(1-beta*beta),ex=.35,bx=.2,eyp=gamma*(ey-beta*bz),bzp=gamma*(bz-beta*ey),i1=ex*ex+ey*ey-bx*bx-bz*bz,i1p=ex*ex+eyp*eyp-bx*bx-bzp*bzp,i2=ex*bx,i2p=ex*bx;
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const gap=12,pad=14,w=(width-pad*2-gap)/2,h=height-28;drawFieldPanel(ctx,pad,14,w,h,'LAB OBSERVER · u',[ex,ey],[bx,bz]);drawFieldPanel(ctx,pad+w+gap,14,w,h,'MOVING OBSERVER · u′',[ex,eyp],[bx,bzp]);ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('same field bivector F · different observer split',width*.5-125,height-8);};
  return <LabFrame title="boost 不把两个独立场混在一起；它改变同一 F 的观察者分解" tag="LAB · ELECTROMAGNETIC BIVECTOR" metrics={[["E²−B²",`${i1.toFixed(3)} → ${i1p.toFixed(3)}`],["E·B",`${i2.toFixed(3)} → ${i2p.toFixed(3)}`],["max invariant error",Math.max(Math.abs(i1-i1p),Math.abs(i2-i2p)).toExponential(1)]]}>
    <InteractiveCanvas draw={draw} dependencies={[beta,ey,bz]} label="比较两个观察者测得的电场与磁场分量及场不变量" />
    <div className="lab-controls"><Slider label="观察者 boost β（沿 +x）" value={beta} min={-.88} max={.88} step={.01} onChange={setBeta}/><Slider label="实验室 Ey" value={ey} min={-1.2} max={1.2} step={.01} onChange={setEy}/><Slider label="实验室 Bz" value={bz} min={-1.2} max={1.2} step={.01} onChange={setBz}/></div>
    <div className="quaternion-readout"><code>E′∥=E∥, B′∥=B∥ &nbsp;·&nbsp; E′y=γ(Ey−βBz) &nbsp;·&nbsp; B′z=γ(Bz−βEy)</code><code>F²=(E²−B²)+2I(E·B) &nbsp;·&nbsp; c=1, signature (+−−−)</code></div>
  </LabFrame>;
}

export function SpinorDoubleCoverLab(){
  const [degrees,setDegrees]=useState(360),theta=degrees*Math.PI/180,half=theta/2,scalar=Math.cos(half),bivector=-Math.sin(half),sign=Math.abs(degrees%720-360)<.5?'−R₀':Math.abs(degrees%720)<.5?'R₀':'path';
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,36);const left:[number,number]=[width*.28,height*.54],right:[number,number]=[width*.73,height*.54],r=Math.min(width,height)*.23;
    for(const [c,title] of [[left,'observable frame · angle θ'],[right,'spinor representative · angle θ/2']] as const){ctx.beginPath();ctx.arc(c[0],c[1],r,0,Math.PI*2);ctx.strokeStyle='rgba(216,227,224,.2)';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#91a3a0';ctx.font='11px ui-monospace, monospace';ctx.fillText(title,c[0]-r,c[1]-r-13);}
    const phi=theta%(Math.PI*2),frameEnd:[number,number]=[left[0]+r*.82*Math.cos(phi),left[1]-r*.82*Math.sin(phi)],normalEnd:[number,number]=[left[0]+r*.58*Math.cos(phi+Math.PI/2),left[1]-r*.58*Math.sin(phi+Math.PI/2)];drawArrow2D(ctx,...left,...frameEnd,'#efbd55','e₁′');drawArrow2D(ctx,...left,...normalEnd,'#4bdab0','e₂′');
    const spinEnd:[number,number]=[right[0]+r*.84*Math.cos(half),right[1]-r*.84*Math.sin(half)];drawArrow2D(ctx,...right,...spinEnd,'#b69bf2','R');ctx.beginPath();ctx.arc(...spinEnd,6,0,Math.PI*2);ctx.fillStyle='#b69bf2';ctx.fill();ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('360°: frame closes, spinor reaches antipode',16,height-18);
  };
  return <LabFrame title="框架转一圈已经复原，承载它的 spinor 路径却要两圈才闭合" tag="LAB · SPINOR DOUBLE COVER" metrics={[["frame angle",`${(degrees%360).toFixed(0)}°`],["spinor half-angle",`${(degrees/2).toFixed(0)}°`],["representative",sign]]}>
    <InteractiveCanvas draw={draw} dependencies={[degrees]} label="观察时空 spinor 的 360 度变号与 720 度闭合" />
    <div className="lab-controls"><Slider label="框架旋转 θ" value={degrees} min={0} max={720} step={1} suffix="°" onChange={setDegrees}/></div>
    <div className="operation-tabs"><button onClick={()=>setDegrees(0)}><b>0°</b><span>R=+1，框架在起点</span></button><button onClick={()=>setDegrees(360)}><b>360°</b><span>R=−1，框架却已复原</span></button><button onClick={()=>setDegrees(720)}><b>720°</b><span>R 与框架同时闭合</span></button></div>
    <div className="quaternion-readout"><code>R=cos(θ/2)−B sin(θ/2) = {scalar.toFixed(3)} {bivector<0?'−':'+'} {Math.abs(bivector).toFixed(3)}B</code><code>eμ′=RγμR̃=(−R)γμ(−R̃) &nbsp;·&nbsp; R and −R encode the same frame</code></div>
  </LabFrame>;
}
