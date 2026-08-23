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
