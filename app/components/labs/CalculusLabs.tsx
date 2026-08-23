'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid, projectIso, type Vec3 } from './drawing';
import { LabFrame, Slider } from './LabChrome';

type Point=readonly[number,number];
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));

export function MultivectorDerivativeLab(){
  const [expansion,setExpansion]=useState(.34),[rotation,setRotation]=useState(.72),[direction,setDirection]=useState(28),[probe,setProbe]=useState<Point>([.75,.58]);
  const k=.35,q=.3,angle=direction*Math.PI/180,d:Point=[Math.cos(angle),Math.sin(angle)];
  const directionalScalar=2*k*(probe[0]*d[0]-probe[1]*d[1]);
  const directionalVector:Point=[expansion*d[0]-rotation*d[1],rotation*d[0]+expansion*d[1]];
  const directionalBivector=q*(probe[1]*d[0]+probe[0]*d[1]);
  const derivativeVector:Point=[(2*k-q)*probe[0],(-2*k+q)*probe[1]];
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.52,scale=Math.min(width,height)*.2;
    const field=(x:number,y:number):Point=>[expansion*x-rotation*y,rotation*x+expansion*y];
    for(let iy=-2;iy<=2;iy++)for(let ix=-3;ix<=3;ix++){const x=ix*.58,y=iy*.58,phi=k*(x*x-y*y),alpha=Math.min(.13,.025+Math.abs(phi)*.035);ctx.fillStyle=phi>=0?`rgba(239,189,85,${alpha})`:`rgba(98,168,229,${alpha})`;ctx.fillRect(cx+x*scale-17,cy-y*scale-17,34,34);const v=field(x,y),mag=Math.hypot(...v)||1,len=15*Math.min(1.45,mag);drawArrow2D(ctx,cx+x*scale,cy-y*scale,cx+x*scale+v[0]/mag*len,cy-y*scale-v[1]/mag*len,'rgba(75,218,176,.68)','');const b=q*x*y;if(Math.abs(b)>.035){ctx.beginPath();ctx.arc(cx+x*scale,cy-y*scale,3+Math.min(5,Math.abs(b)*4),0,Math.PI*2);ctx.strokeStyle=b>0?'rgba(182,155,242,.68)':'rgba(240,127,99,.68)';ctx.stroke();}}
    ctx.strokeStyle='rgba(216,227,224,.24)';ctx.beginPath();ctx.moveTo(16,cy);ctx.lineTo(width-16,cy);ctx.moveTo(cx,18);ctx.lineTo(cx,height-18);ctx.stroke();
    const px=cx+probe[0]*scale,py=cy-probe[1]*scale;ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();drawArrow2D(ctx,px,py,px+d[0]*scale*.62,py-d[1]*scale*.62,'#efbd55','d');drawArrow2D(ctx,px,py,px+directionalVector[0]*scale*.5,py-directionalVector[1]*scale*.5,'#b69bf2','(d·∇)v');ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('gold/blue: scalar φ · arrows: vector v · rings: bivector bI',16,20);ctx.fillText('drag the probe · change direction and field below',16,height-14);
  };
  const move=(p:CanvasPointer)=>{if(p.phase==='up')return;const cx=p.width*.5,cy=p.height*.52,scale=Math.min(p.width,p.height)*.2;setProbe([clamp((p.x-cx)/scale,-2.15,2.15),clamp((cy-p.y)/scale,-1.8,1.8)]);};
  return <LabFrame title="方向导数保持 grade；几何导数把各 grade 的局部变化重新组合" tag="LAB · MULTIVECTOR DERIVATIVE" metrics={[["⟨∇F⟩₀",(2*expansion).toFixed(3)],["⟨∇F⟩₁",`(${derivativeVector[0].toFixed(2)}, ${derivativeVector[1].toFixed(2)})`],["⟨∇F⟩₂",`${(2*rotation).toFixed(3)} I`]]}>
    <InteractiveCanvas draw={draw} dependencies={[expansion,rotation,direction,probe]} onPointer={move} label="拖动探针观察多向量场的方向导数和几何导数分级结果" />
    <div className="lab-controls"><Slider label="向量场膨胀 a" value={expansion} min={-.9} max={.9} step={.01} onChange={setExpansion}/><Slider label="向量场旋转 ω" value={rotation} min={-.9} max={.9} step={.01} onChange={setRotation}/><Slider label="方向 d 的角度" value={direction} min={0} max={360} step={1} suffix="°" onChange={setDirection}/></div>
    <div className="quaternion-readout"><code>F=φ+v+bI, &nbsp; φ=.35(x²−y²), &nbsp; v=(ax−ωy)e₁+(ωx+ay)e₂, &nbsp; b=.3xy</code><code>(d·∇)F = {directionalScalar.toFixed(3)} + ({directionalVector[0].toFixed(3)}e₁ {directionalVector[1]<0?'−':'+'} {Math.abs(directionalVector[1]).toFixed(3)}e₂) {directionalBivector<0?'−':'+'} {Math.abs(directionalBivector).toFixed(3)}I</code></div>
  </LabFrame>;
}

export function VectorCalculusLab(){
  const [expansion,setExpansion]=useState(.52),[rotation,setRotation]=useState(.64),[radius,setRadius]=useState(.86);
  const divergence=2*expansion,curl=2*rotation,area=Math.PI*radius*radius,flux=divergence*area,circulation=curl*area;
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.52,scale=Math.min(width,height)*.2,field=(x:number,y:number):Point=>[expansion*x-rotation*y,rotation*x+expansion*y];
    for(let iy=-3;iy<=3;iy++)for(let ix=-4;ix<=4;ix++){const x=ix*.48,y=iy*.48,v=field(x,y),m=Math.hypot(...v)||1,len=17*Math.min(1.35,m);drawArrow2D(ctx,cx+x*scale,cy-y*scale,cx+x*scale+v[0]/m*len,cy-y*scale-v[1]/m*len,'rgba(75,218,176,.56)','');}
    ctx.beginPath();ctx.arc(cx,cy,radius*scale,0,Math.PI*2);ctx.fillStyle='rgba(143,154,238,.06)';ctx.fill();ctx.strokeStyle='#8f9aee';ctx.lineWidth=2;ctx.stroke();
    for(let i=0;i<12;i++){const t=i*Math.PI/6,x=Math.cos(t),y=Math.sin(t),v=field(radius*x,radius*y),normal=v[0]*x+v[1]*y,tangent=-v[0]*y+v[1]*x,px=cx+radius*x*scale,py=cy-radius*y*scale;drawArrow2D(ctx,px,py,px+x*normal*scale*.12,py-y*normal*scale*.12,'#efbd55','');drawArrow2D(ctx,px,py,px-y*tangent*scale*.12,py-x*tangent*scale*.12,'#b69bf2','');}
    ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('green: v · gold: normal flux · violet: tangential circulation',16,20);ctx.fillText('boundary integral = area × constant local derivative',16,height-14);
  };
  return <LabFrame title="同一个向量场导数，同时给出穿出边界的通量与沿边界的环流" tag="LAB · DIV / CURL / STOKES" metrics={[["∇·v",divergence.toFixed(3)],["∇∧v",`${curl.toFixed(3)} I`],["area",area.toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[expansion,rotation,radius]} label="调节膨胀、旋转与区域大小，比较散度、外导数和边界积分" />
    <div className="lab-controls"><Slider label="膨胀率 a" value={expansion} min={-.9} max={.9} step={.01} onChange={setExpansion}/><Slider label="旋转率 ω" value={rotation} min={-.9} max={.9} step={.01} onChange={setRotation}/><Slider label="积分区域半径 r" value={radius} min={.35} max={1.25} step={.01} onChange={setRadius}/></div>
    <div className="operation-tabs"><button onClick={()=>{setExpansion(.72);setRotation(0);}}><b>pure source</b><span>只有通量，没有环流</span></button><button onClick={()=>{setExpansion(0);setRotation(.72);}}><b>pure vortex</b><span>只有环流，没有通量</span></button><button onClick={()=>{setExpansion(.48);setRotation(-.64);}}><b>spiral</b><span>两个 grade 同时存在</span></button></div>
    <div className="quaternion-readout"><code>v=(ax−ωy)e₁+(ωx+ay)e₂ &nbsp;·&nbsp; ∇v=2a+2ωI</code><code>∮∂A n·v ds={flux.toFixed(3)}=∬A ∇·v dA &nbsp;·&nbsp; ∮∂A v·dx={circulation.toFixed(3)}=∬A 2ω dA</code></div>
  </LabFrame>;
}

type Dual={v:number;d:number};
const dAdd=(a:Dual,b:Dual):Dual=>({v:a.v+b.v,d:a.d+b.d});
const dMul=(a:Dual,b:Dual):Dual=>({v:a.v*b.v,d:a.d*b.v+a.v*b.d});
const dScale=(a:Dual,s:number):Dual=>({v:a.v*s,d:a.d*s});
const dSin=(a:Dual):Dual=>({v:Math.sin(a.v),d:Math.cos(a.v)*a.d});
const dCos=(a:Dual):Dual=>({v:Math.cos(a.v),d:-Math.sin(a.v)*a.d});

function motionAt(t:number,seed=1){const td={v:t,d:seed},theta=dAdd(dSin(dScale(td,1.3)),dScale(dMul(td,td),.22)),tx=dScale(td,.35),ty=dScale(dMul(td,td),.18),x=dAdd(dCos(theta),tx),y=dAdd(dSin(theta),ty);return{theta,x,y};}

export function AutomaticDifferentiationLab(){
  const [time,setTime]=useState(1.18),[seed,setSeed]=useState(1),state=motionAt(time,seed),unit=motionAt(time,1),speed=Math.hypot(unit.x.d,unit.y.d);
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const split=width*.64,cx=split*.48,cy=height*.58,scale=Math.min(split,height)*.22;ctx.beginPath();for(let i=0;i<=120;i++){const s=i/120*2.8,p=motionAt(s);const x=cx+p.x.v*scale,y=cy-p.y.v*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='rgba(75,218,176,.45)';ctx.lineWidth=2;ctx.stroke();const px=cx+state.x.v*scale,py=cy-state.y.v*scale;ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();drawArrow2D(ctx,px,py,px+state.x.d*scale*.2,py-state.y.d*scale*.2,'#b69bf2','dP/dt × seed');
    const nodes=[['INPUT',`t = ${time.toFixed(2)} + ${seed.toFixed(2)}ε`],['ANGLE',`θ = ${state.theta.v.toFixed(2)} + ${state.theta.d.toFixed(2)}ε`],['COS / SIN',`R point = (${Math.cos(state.theta.v).toFixed(2)}, ${Math.sin(state.theta.v).toFixed(2)})`],['OUTPUT',`P = (${state.x.v.toFixed(2)}, ${state.y.v.toFixed(2)})`]];nodes.forEach(([title,value],i)=>{const x=split+16,y=24+i*66,w=width-split-30;ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(x,y,w,48);ctx.strokeStyle='rgba(216,227,224,.14)';ctx.strokeRect(x+.5,y+.5,w-1,47);ctx.fillStyle=i===0?'#efbd55':i===nodes.length-1?'#4bdab0':'#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText(title,x+10,y+16);ctx.fillStyle='#d8e3e0';ctx.fillText(value,x+10,y+34);if(i<nodes.length-1){ctx.fillStyle='#8f9aee';ctx.fillText('↓ chain rule',x+10,y+61);}});};
  return <LabFrame title="一次普通函数求值同时传播 primal 与 tangent；ε 系数就是方向导数" tag="LAB · DUAL NUMBER AD" metrics={[["θ(t)",state.theta.v.toFixed(3)],["dθ/dt",unit.theta.d.toFixed(3)],["point speed",speed.toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[time,seed]} label="沿运动轨迹观察 dual number 自动传播姿态与点速度" />
    <div className="lab-controls"><Slider label="时间 t" value={time} min={0} max={2.8} step={.01} onChange={setTime}/><Slider label="tangent seed ṫ" value={seed} min={-.2} max={2} step={.01} onChange={setSeed}/></div>
    <div className="quaternion-readout"><code>ε²=0 &nbsp;·&nbsp; (a+ȧε)(b+ḃε)=ab+(ȧb+aḃ)ε</code><code>f(t+ṫε)=f(t)+f′(t)ṫε &nbsp;·&nbsp; θ(t)=sin(1.3t)+0.22t²</code></div>
  </LabFrame>;
}

export function MovingFrameLab(){
  const [turn,setTurn]=useState(1.35),[radius,setRadius]=useState(1),[pitch,setPitch]=useState(.14),den=radius*radius+pitch*pitch,kappa=radius/den,torsion=pitch/den;
  const point=(t:number):Vec3=>[radius*Math.cos(t),radius*Math.sin(t),pitch*(t-Math.PI*2)];
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const center:[number,number]=[width*.5,height*.53],scale=Math.min(width,height)*.19;ctx.beginPath();for(let i=0;i<=180;i++){const t=i/180*Math.PI*4,p=projectIso(point(t),center[0],center[1],scale);i?ctx.lineTo(...p):ctx.moveTo(...p);}ctx.strokeStyle='rgba(75,218,176,.58)';ctx.lineWidth=2.2;ctx.stroke();const t=turn*Math.PI*2,p3=point(t),s=Math.sqrt(den),T:Vec3=[-radius*Math.sin(t)/s,radius*Math.cos(t)/s,pitch/s],N:Vec3=[-Math.cos(t),-Math.sin(t),0],B:Vec3=[pitch*Math.sin(t)/s,-pitch*Math.cos(t)/s,radius/s],p=projectIso(p3,center[0],center[1],scale);ctx.beginPath();ctx.arc(...p,7,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();for(const [v,color,label] of [[T,'#efbd55','T'],[N,'#b69bf2','N'],[B,'#62a8e5','B']] as const){const e=projectIso([p3[0]+v[0]*.75,p3[1]+v[1]*.75,p3[2]+v[2]*.75],center[0],center[1],scale);drawArrow2D(ctx,...p,...e,color,label);}ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('Frenet frame rides the curve · T,N,B remain orthonormal',16,20);ctx.fillText('helix: constant curvature and torsion',16,height-14);};
  return <LabFrame title="曲线不是只有位置：移动 frame 把切向、弯曲平面与扭转一起沿路径运输" tag="LAB · FRENET / ROTOR FRAME" metrics={[["curve parameter",`${turn.toFixed(2)} turns`],["curvature κ",kappa.toFixed(3)],["torsion τ",torsion.toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[turn,radius,pitch]} label="沿三维螺线移动 Frenet frame，观察曲率和挠率" />
    <div className="lab-controls"><Slider label="沿曲线位置" value={turn} min={0} max={2} step={.01} suffix=" turns" onChange={setTurn}/><Slider label="螺线半径 R" value={radius} min={.45} max={1.35} step={.01} onChange={setRadius}/><Slider label="每弧度轴向增量 h" value={pitch} min={-.28} max={.28} step={.01} onChange={setPitch}/></div>
    <div className="operation-tabs"><button onClick={()=>setPitch(0)}><b>circle</b><span>τ=0，frame 留在固定平面</span></button><button onClick={()=>setPitch(.14)}><b>right-handed helix</b><span>κ&gt;0，τ&gt;0</span></button><button onClick={()=>setPitch(-.14)}><b>left-handed helix</b><span>曲率不变，挠率反号</span></button></div>
    <div className="quaternion-readout"><code>dT/ds=κN &nbsp;·&nbsp; dN/ds=−κT+τB &nbsp;·&nbsp; dB/ds=−τN</code><code>eᵢ(s)=R(s)EᵢR̃(s) &nbsp;·&nbsp; dR/ds=−½Ω(s)R(s)</code></div>
  </LabFrame>;
}
