'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawAxes3D, drawDarkGrid, projectIso, type Vec3 } from './drawing';
import { LabFrame, Slider } from './LabChrome';

type Point2=readonly[number,number];
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
const distance=(a:Point2,b:Point2)=>Math.hypot(a[0]-b[0],a[1]-b[1]);

function drawPoint(ctx:CanvasRenderingContext2D,p:Point2,cx:number,cy:number,unit:number,color:string,label:string,active=false){
  const x=cx+p[0]*unit,y=cy-p[1]*unit;ctx.beginPath();ctx.arc(x,y,active?9:6,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(active){ctx.strokeStyle='#fff5d6';ctx.lineWidth=2;ctx.stroke();}ctx.fillStyle=color;ctx.font='11px ui-monospace, monospace';ctx.fillText(label,x+9,y-8);
}

function drawCircle(ctx:CanvasRenderingContext2D,c:Point2,r:number,cx:number,cy:number,unit:number,color:string,dashed=false){
  ctx.beginPath();ctx.arc(cx+c[0]*unit,cy-c[1]*unit,Math.abs(r)*unit,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=2.2;ctx.setLineDash(dashed?[5,5]:[]);ctx.stroke();ctx.setLineDash([]);
}

function drawInfiniteLine(ctx:CanvasRenderingContext2D,a:Point2,b:Point2,cx:number,cy:number,unit:number,color:string,dashed=false){
  const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy)||1,ux=dx/n,uy=dy/n,p:Point2=[a[0]-ux*4,a[1]-uy*4],q:Point2=[a[0]+ux*4,a[1]+uy*4];ctx.beginPath();ctx.moveTo(cx+p[0]*unit,cy-p[1]*unit);ctx.lineTo(cx+q[0]*unit,cy-q[1]*unit);ctx.strokeStyle=color;ctx.lineWidth=2.2;ctx.setLineDash(dashed?[6,5]:[]);ctx.stroke();ctx.setLineDash([]);
}

function pointerWorld(e:CanvasPointer,factor=.19):Point2{const cx=e.width*.5,cy=e.height*.56,unit=Math.min(e.width,e.height)*factor;return [clamp((e.x-cx)/unit,-2.2,2.2),clamp((cy-e.y)/unit,-1.8,1.8)];}

export function ConformalEmbeddingLab(){
  const [p,setP]=useState<Point2>([-.85,.38]),[q,setQ]=useState<Point2>([.72,-.48]),[active,setActive]=useState<'P'|'Q'>('P');
  const dx=p[0]-q[0],dy=p[1]-q[1],distance2=dx*dx+dy*dy,dot=-distance2/2;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const split=width*.44;ctx.beginPath();ctx.moveTo(split,28);ctx.lineTo(split,height-28);ctx.strokeStyle='rgba(216,227,224,.2)';ctx.stroke();ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('EUCLIDEAN PLANE',18,22);ctx.fillText('NORMALIZED NULL-CONE SLICE',split+18,22);
    const lc=[split*.5,height*.56] as const,lu=Math.min(split,height)*.25;ctx.strokeStyle='rgba(216,227,224,.18)';ctx.beginPath();ctx.moveTo(18,lc[1]);ctx.lineTo(split-18,lc[1]);ctx.moveTo(lc[0],40);ctx.lineTo(lc[0],height-30);ctx.stroke();
    const leftPoint=(x:Point2,label:string,color:string,selected:boolean)=>{const sx=lc[0]+x[0]*lu,sy=lc[1]-x[1]*lu;ctx.beginPath();ctx.arc(sx,sy,selected?9:7,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(selected){ctx.strokeStyle='#fff5d6';ctx.lineWidth=2;ctx.stroke();}ctx.fillStyle=color;ctx.font='11px ui-monospace, monospace';ctx.fillText(label,sx+10,sy-8);return [sx,sy] as const;};
    const pp=leftPoint(p,'p','#efbd55',active==='P'),qq=leftPoint(q,'q','#4bdab0',active==='Q');ctx.beginPath();ctx.moveTo(...pp);ctx.lineTo(...qq);ctx.strokeStyle='rgba(216,227,224,.45)';ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    const rc=[width*.72,height*.69] as const,ru=Math.min(width-split,height)*.145,lift=([x,y]:Point2):Vec3=>[x,y,.5*(x*x+y*y)];
    for(let k=-5;k<=5;k++){let prev:Vec3|undefined;for(let i=-30;i<=30;i++){const x=i/15,y=k/3.5,z=lift([x,y]);if(prev){const a=projectIso(prev,...rc,ru,-.7,.52),b=projectIso(z,...rc,ru,-.7,.52);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.strokeStyle='rgba(75,218,176,.15)';ctx.stroke();}prev=z;}prev=undefined;for(let i=-30;i<=30;i++){const y=i/15,x=k/3.5,z=lift([x,y]);if(prev){const a=projectIso(prev,...rc,ru,-.7,.52),b=projectIso(z,...rc,ru,-.7,.52);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.strokeStyle='rgba(182,155,242,.13)';ctx.stroke();}prev=z;}}
    const liftedPoint=(x:Point2,label:string,color:string)=>{const z=projectIso(lift(x),...rc,ru,-.7,.52);ctx.beginPath();ctx.arc(...z,7,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.fillText(label,z[0]+9,z[1]-8);return z;},P=liftedPoint(p,'P(p)','#efbd55'),Q=liftedPoint(q,'P(q)','#4bdab0');ctx.beginPath();ctx.moveTo(...P);ctx.lineTo(...Q);ctx.strokeStyle='rgba(216,227,224,.38)';ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#91a3a0';ctx.fillText('z=½(x²+y²) is an affine chart, not the full 4D cone',split+18,height-18);
  };
  const move=(e:CanvasPointer)=>{if(e.phase==='up')return;const split=e.width*.44,lc=[split*.5,e.height*.56],lu=Math.min(split,e.height)*.25;const next:Point2=[clamp((e.x-lc[0])/lu,-1.6,1.6),clamp((lc[1]-e.y)/lu,-1.3,1.3)];if(active==='P')setP(next);else setQ(next);};
  return <LabFrame title="欧氏点被抬升为 null 向量，而两点内积直接编码平方距离" tag="LAB · CONFORMAL EMBEDDING" metrics={[["P²","0"],["P·n∞","−1"],["‖p−q‖",Math.sqrt(distance2).toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[p,q,active]} onPointer={move} label="拖动二维点并观察共形 null cone 归一化切片中的抬升" />
    <div className="operation-tabs"><button className={active==='P'?'active':''} onClick={()=>setActive('P')}><b>drag p</b><span>黄色欧氏点与嵌入 P</span></button><button className={active==='Q'?'active':''} onClick={()=>setActive('Q')}><b>drag q</b><span>绿色欧氏点与嵌入 Q</span></button></div>
    <div className="quaternion-readout"><code>P(p)=n₀+p+½‖p‖²n∞ &nbsp;·&nbsp; P²=0</code><code>P·Q=−½‖p−q‖²={dot.toFixed(3)} &nbsp;·&nbsp; n₀²=n∞²=0, n₀·n∞=−1</code></div>
  </LabFrame>;
}

type BuilderMode='circle'|'line'|'sphere';
type BuilderTarget='A'|'B'|'C';
export function RoundFlatBuilderLab(){
  const [mode,setMode]=useState<BuilderMode>('circle'),[a,setA]=useState<Point2>([-.9,-.48]),[b,setB]=useState<Point2>([.82,-.38]),[c,setC]=useState<Point2>([-.12,.82]),[active,setActive]=useState<BuilderTarget>('C'),[sphereRadius,setSphereRadius]=useState(.82);
  const determinant=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1])),degenerate=Math.abs(determinant)<.045;
  const circleCenter:Point2=degenerate?[0,0]:[
    ((a[0]**2+a[1]**2)*(b[1]-c[1])+(b[0]**2+b[1]**2)*(c[1]-a[1])+(c[0]**2+c[1]**2)*(a[1]-b[1]))/determinant,
    ((a[0]**2+a[1]**2)*(c[0]-b[0])+(b[0]**2+b[1]**2)*(a[0]-c[0])+(c[0]**2+c[1]**2)*(b[0]-a[0]))/determinant,
  ],circleRadius=degenerate?0:distance(circleCenter,a);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.56,u=Math.min(width,height)*.19;ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText(mode==='sphere'?'3D CGA · four points span one sphere':'2D CGA · drag the selected defining point',18,22);
    if(mode==='sphere'){
      const view=[width*.5,height*.61] as const,s=Math.min(width,height)*.17,center:Vec3=[a[0]*.55,a[1]*.55,0];drawAxes3D(ctx,view,s);const project=(p:Vec3)=>projectIso(p,...view,s,-.62,.48);
      for(let band=-3;band<=3;band++){const z=sphereRadius*band/3,rr=Math.sqrt(Math.max(0,sphereRadius*sphereRadius-z*z));let prev:readonly[number,number]|undefined;for(let i=0;i<=48;i++){const t=i/48*Math.PI*2,p=project([center[0]+rr*Math.cos(t),center[1]+rr*Math.sin(t),z]);if(prev){ctx.beginPath();ctx.moveTo(...prev);ctx.lineTo(...p);ctx.strokeStyle='rgba(89,197,216,.3)';ctx.stroke();}prev=p;}}
      for(let meridian=0;meridian<3;meridian++){let prev:readonly[number,number]|undefined;const phi=meridian*Math.PI/3;for(let i=0;i<=48;i++){const t=i/48*Math.PI*2,p=project([center[0]+sphereRadius*Math.cos(t)*Math.cos(phi),center[1]+sphereRadius*Math.cos(t)*Math.sin(phi),sphereRadius*Math.sin(t)]);if(prev){ctx.beginPath();ctx.moveTo(...prev);ctx.lineTo(...p);ctx.strokeStyle='rgba(182,155,242,.25)';ctx.stroke();}prev=p;}}
      const samples:Vec3[]=[[center[0]+sphereRadius,center[1],0],[center[0]-sphereRadius,center[1],0],[center[0],center[1]+sphereRadius,0],[center[0],center[1],sphereRadius]];samples.forEach((p,index)=>{const q=project(p);ctx.beginPath();ctx.arc(...q,6,0,Math.PI*2);ctx.fillStyle=index===3?'#efbd55':'#4bdab0';ctx.fill();ctx.fillText(`P${index+1}`,q[0]+8,q[1]-7);});
    }else{
      ctx.strokeStyle='rgba(216,227,224,.16)';ctx.beginPath();ctx.moveTo(18,cy);ctx.lineTo(width-18,cy);ctx.moveTo(cx,38);ctx.lineTo(cx,height-28);ctx.stroke();
      if(mode==='line'||degenerate)drawInfiniteLine(ctx,a,b,cx,cy,u,mode==='line'?'#4bdab0':'#f07f63',degenerate);else drawCircle(ctx,circleCenter,circleRadius,cx,cy,u,'#59c5d8');
      drawPoint(ctx,a,cx,cy,u,'#efbd55','A',active==='A');drawPoint(ctx,b,cx,cy,u,'#4bdab0','B',active==='B');if(mode==='circle')drawPoint(ctx,c,cx,cy,u,'#b69bf2','C',active==='C');
      if(degenerate&&mode==='circle'){ctx.fillStyle='#f07f63';ctx.fillText('A, B, C collinear → round blade reaches the flat limit',18,height-18);}
    }
  };
  const move=(e:CanvasPointer)=>{if(e.phase==='up')return;const next=pointerWorld(e);if(mode==='sphere'){setA(next);return;}if(active==='A')setA(next);else if(active==='B')setB(next);else setC(next);};
  const kind=mode==='sphere'?'sphere · round':mode==='line'||degenerate?'line · flat':'circle · round',grade=mode==='sphere'?'4':'3',factors=mode==='sphere'?'4 conformal points':mode==='line'?'2 points + n∞':'3 conformal points';
  return <LabFrame title="外积因子决定对象：普通共形点生成 round，加入 n∞ 生成 flat" tag="LAB · ROUND / FLAT BUILDER" metrics={[["OPNS grade",grade],["factors",factors],["decoded kind",kind]]}>
    <InteractiveCanvas draw={draw} dependencies={[mode,a,b,c,active,sphereRadius]} onPointer={move} label="用共形点外积构造点对圆球和直线的实验" />
    <div className="operation-tabs"><button className={mode==='circle'?'active':''} onClick={()=>setMode('circle')}><b>A∧B∧C</b><span>圆 · 共线时趋于 flat</span></button><button className={mode==='line'?'active':''} onClick={()=>setMode('line')}><b>A∧B∧n∞</b><span>直线 · 显式包含无穷远</span></button><button className={mode==='sphere'?'active':''} onClick={()=>setMode('sphere')}><b>P₁∧P₂∧P₃∧P₄</b><span>四点张成球</span></button></div>
    {mode!=='sphere'?<div className="operation-tabs">{(['A','B',...(mode==='circle'?['C']:[])] as BuilderTarget[]).map(target=><button key={target} className={active===target?'active':''} onClick={()=>setActive(target)}><b>drag {target}</b><span>选择定义点</span></button>)}</div>:<div className="lab-controls one-slider"><Slider label="球半径" value={sphereRadius} min={.25} max={1.25} step={.01} onChange={setSphereRadius}/></div>}
    <div className="quaternion-readout"><code>{mode==='circle'?'C=P(A)∧P(B)∧P(C)':mode==='line'?'L=P(A)∧P(B)∧n∞':'Σ=P₁∧P₂∧P₃∧P₄'}</code><code>flat test: F∧n∞=0 &nbsp;·&nbsp; direct/OPNS objects encode points lying on the object</code></div>
  </LabFrame>;
}

export function CGAIntersectionLab(){
  const [c1,setC1]=useState<Point2>([-.58,.08]),[c2,setC2]=useState<Point2>([.68,-.04]),[r1,setR1]=useState(.92),[r2,setR2]=useState(.72),[active,setActive]=useState<'S1'|'S2'>('S2');
  const d=distance(c1,c2),concentric=d<1e-5,coincident=concentric&&Math.abs(r1-r2)<1e-5,a=concentric?0:(r1*r1-r2*r2+d*d)/(2*d),h2=coincident?0:concentric?-((r1-r2)**2):r1*r1-a*a;
  const base:Point2=concentric?c1:[c1[0]+a*(c2[0]-c1[0])/d,c1[1]+a*(c2[1]-c1[1])/d],perp:Point2=concentric?[0,1]:[-(c2[1]-c1[1])/d,(c2[0]-c1[0])/d];
  const eps=.002,status=coincident?'coincident circles':concentric?'concentric · no real points':h2>eps?'two real points':Math.abs(h2)<=eps?'tangent / double point':'imaginary point pair';
  const intersections:Point2[]=h2>=-eps&&!coincident?[ [base[0]+perp[0]*Math.sqrt(Math.max(0,h2)),base[1]+perp[1]*Math.sqrt(Math.max(0,h2))], [base[0]-perp[0]*Math.sqrt(Math.max(0,h2)),base[1]-perp[1]*Math.sqrt(Math.max(0,h2))] ]:[];
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.56,u=Math.min(width,height)*.2;ctx.strokeStyle='rgba(216,227,224,.15)';ctx.beginPath();ctx.moveTo(18,cy);ctx.lineTo(width-18,cy);ctx.moveTo(cx,38);ctx.lineTo(cx,height-28);ctx.stroke();drawCircle(ctx,c1,r1,cx,cy,u,'#59c5d8');drawCircle(ctx,c2,r2,cx,cy,u,'#b69bf2');drawPoint(ctx,c1,cx,cy,u,'#59c5d8','c₁',active==='S1');drawPoint(ctx,c2,cx,cy,u,'#b69bf2','c₂',active==='S2');
    if(!coincident&&d>1e-5)drawInfiniteLine(ctx,[base[0]-perp[0],base[1]-perp[1]],[base[0]+perp[0],base[1]+perp[1]],cx,cy,u,'rgba(216,227,224,.35)',true);
    if(intersections.length){drawPoint(ctx,intersections[0],cx,cy,u,'#efbd55',h2<=eps?'tangent P':'P₊');if(h2>eps)drawPoint(ctx,intersections[1],cx,cy,u,'#4bdab0','P₋');}
    if(h2< -eps){const x=cx+base[0]*u,y=cy-base[1]*u,rr=Math.min(18,Math.sqrt(-h2)*u*.2+6);ctx.strokeStyle='#f07f63';ctx.beginPath();ctx.moveTo(x-rr,y-rr);ctx.lineTo(x+rr,y+rr);ctx.moveTo(x+rr,y-rr);ctx.lineTo(x-rr,y+rr);ctx.stroke();ctx.fillStyle='#f07f63';ctx.fillText('no real factorization',x+rr+7,y);}
    ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('dashed line = radical axis / carrier of the point pair',18,22);
  };
  const move=(e:CanvasPointer)=>{if(e.phase==='up')return;const next=pointerWorld(e,.2);if(active==='S1')setC1(next);else setC2(next);};
  return <LabFrame title="同一个 meet 结果连续穿过相交、相切与无实交点三种状态" tag="LAB · CIRCLE MEET" metrics={[["center distance",d.toFixed(3)],["h²",h2.toFixed(3)],["factorization",status]]}>
    <InteractiveCanvas draw={draw} dependencies={[c1,c2,r1,r2,active]} onPointer={move} label="两个共形圆的 meet 与实切虚点对分类实验" />
    <div className="operation-tabs"><button className={active==='S1'?'active':''} onClick={()=>setActive('S1')}><b>drag S₁</b><span>蓝色圆心</span></button><button className={active==='S2'?'active':''} onClick={()=>setActive('S2')}><b>drag S₂</b><span>紫色圆心</span></button></div>
    <div className="lab-controls"><Slider label="圆 S₁ 半径" value={r1} min={.2} max={1.45} step={.01} onChange={setR1}/><Slider label="圆 S₂ 半径" value={r2} min={.2} max={1.45} step={.01} onChange={setR2}/></div>
    <div className="quaternion-readout"><code>Sᵢ=P(cᵢ)−½rᵢ²n∞ &nbsp;·&nbsp; PP=(S₁∧S₂)*</code><code>h²&gt;0: P₊∧P₋ &nbsp;·&nbsp; h²=0: tangent &nbsp;·&nbsp; h²&lt;0: imaginary point pair</code></div>
  </LabFrame>;
}

export function CGAObjectDecoderLab(){
  const [weight,setWeight]=useState(1.2),[ux,setUx]=useState(.72),[uy,setUy]=useState(-.36),[beta,setBeta]=useState(-.45);
  const valid=Math.abs(weight)>.025,c:Point2=valid?[ux/weight,uy/weight]:[0,0],r2=valid?c[0]*c[0]+c[1]*c[1]-2*beta/weight:NaN,kind=!valid?'dual flat (line)':r2>.015?'real circle':r2>=-.015?'point circle':'imaginary circle';
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.56,u=Math.min(width,height)*.2;ctx.strokeStyle='rgba(216,227,224,.15)';ctx.beginPath();ctx.moveTo(18,cy);ctx.lineTo(width-18,cy);ctx.moveTo(cx,38);ctx.lineTo(cx,height-28);ctx.stroke();
    if(!valid){const n=Math.hypot(ux,uy)||1,anchor:Point2=[ux*beta/(n*n),uy*beta/(n*n)],dir:Point2=[-uy/n,ux/n];drawInfiniteLine(ctx,[anchor[0]-dir[0],anchor[1]-dir[1]],[anchor[0]+dir[0],anchor[1]+dir[1]],cx,cy,u,'#4bdab0');ctx.fillStyle='#4bdab0';ctx.font='11px ui-monospace, monospace';ctx.fillText('w=0 → X·S=0 is linear',18,22);
    }else if(r2>0){drawCircle(ctx,c,Math.sqrt(r2),cx,cy,u,'#59c5d8');drawPoint(ctx,c,cx,cy,u,'#efbd55','decoded center');
    }else if(r2>=-.015){drawPoint(ctx,c,cx,cy,u,'#efbd55','radius²=0',true);
    }else{drawCircle(ctx,c,Math.sqrt(-r2),cx,cy,u,'rgba(240,127,99,.45)',true);drawPoint(ctx,c,cx,cy,u,'#f07f63','imaginary radius');ctx.fillStyle='#f07f63';ctx.fillText('dashed radius = √(−r²), not a real locus',18,22);}
    ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('raw coefficients are decoded only after projective normalization',18,height-18);
  };
  return <LabFrame title="从任意加权 IPNS 系数恢复对象，而不是把系数直接当几何参数" tag="LAB · CGA OBJECT DECODER" metrics={[["w=−S·n∞",weight.toFixed(3)],["center",valid?`(${c[0].toFixed(2)}, ${c[1].toFixed(2)})`:'not finite'],["radius²",valid?r2.toFixed(3):'flat branch']]}>
    <InteractiveCanvas draw={draw} dependencies={[weight,ux,uy,beta]} label="从加权 IPNS 圆系数提取中心半径和对象类型的实验" />
    <div className="lab-controls"><Slider label="n₀ 系数 w" value={weight} min={-2} max={2} step={.01} onChange={setWeight}/><Slider label="e₁ 系数 uₓ" value={ux} min={-1.8} max={1.8} step={.01} onChange={setUx}/><Slider label="e₂ 系数 uᵧ" value={uy} min={-1.5} max={1.5} step={.01} onChange={setUy}/><Slider label="n∞ 系数 β" value={beta} min={-1.5} max={1.5} step={.01} onChange={setBeta}/></div>
    <div className="quaternion-readout"><code>S=w n₀+uₓe₁+uᵧe₂+βn∞ &nbsp;·&nbsp; kind={kind}</code><code>ĉ=u/w &nbsp;·&nbsp; r²=‖ĉ‖²−2β/w &nbsp;·&nbsp; Ŝ=S/w=P(ĉ)−½r²n∞</code></div>
  </LabFrame>;
}

export function CGAEuclideanMotionLab(){
  const [angle,setAngle]=useState(58),[tx,setTx]=useState(.72),[ty,setTy]=useState(.46);
  const theta=angle*Math.PI/180,rot=(p:Point2):Point2=>[p[0]*Math.cos(theta)-p[1]*Math.sin(theta),p[0]*Math.sin(theta)+p[1]*Math.cos(theta)],move=(p:Point2):Point2=>{const q=rot(p);return[q[0]+tx,q[1]+ty];};
  const center:Point2=[.38,-.18],radius=.48,onCircle:Point2=[center[0]+radius*Math.cos(.55),center[1]+radius*Math.sin(.55)],lineA:Point2=[-1.15,-.62],lineB:Point2=[.66,.52],movedCenter=move(center),movedPoint=move(onCircle),residual=Math.abs(distance(movedCenter,movedPoint)-radius);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.57,u=Math.min(width,height)*.2;ctx.strokeStyle='rgba(216,227,224,.15)';ctx.beginPath();ctx.moveTo(18,cy);ctx.lineTo(width-18,cy);ctx.moveTo(cx,38);ctx.lineTo(cx,height-28);ctx.stroke();
    drawCircle(ctx,center,radius,cx,cy,u,'rgba(89,197,216,.24)');drawInfiniteLine(ctx,lineA,lineB,cx,cy,u,'rgba(216,227,224,.2)',true);drawPoint(ctx,onCircle,cx,cy,u,'rgba(239,189,85,.55)','P source');
    drawCircle(ctx,movedCenter,radius,cx,cy,u,'#59c5d8');drawInfiniteLine(ctx,move(lineA),move(lineB),cx,cy,u,'#4bdab0');drawPoint(ctx,movedPoint,cx,cy,u,'#efbd55','MPM̃');
    const o:Point2=[0,0],x:Point2=[.65,0],y:Point2=[0,.65],O=move(o),X=move(x),Y=move(y);ctx.beginPath();ctx.moveTo(cx+O[0]*u,cy-O[1]*u);ctx.lineTo(cx+X[0]*u,cy-X[1]*u);ctx.moveTo(cx+O[0]*u,cy-O[1]*u);ctx.lineTo(cx+Y[0]*u,cy-Y[1]*u);ctx.strokeStyle='#b69bf2';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('ghost = source objects · solid = one motor applied to every blade',18,22);
  };
  return <LabFrame title="同一个 CGA motor 同时搬运点、直线与圆，并保持关联和半径" tag="LAB · UNIVERSAL EUCLIDEAN MOTOR" metrics={[["M","T(t)R(θ)"],["n∞′","n∞"],["circle residual",residual.toExponential(1)]]}>
    <InteractiveCanvas draw={draw} dependencies={[angle,tx,ty]} label="同一共形 motor 变换点直线圆与坐标框架的实验" />
    <div className="lab-controls"><Slider label="旋转 θ" value={angle} min={-180} max={180} suffix="°" onChange={setAngle}/><Slider label="平移 tₓ" value={tx} min={-1.3} max={1.3} step={.01} onChange={setTx}/><Slider label="平移 tᵧ" value={ty} min={-1.1} max={1.1} step={.01} onChange={setTy}/></div>
    <div className="quaternion-readout"><code>R=exp(−θe₁₂/2) &nbsp;·&nbsp; T=exp(½n∞t)=1+½n∞t &nbsp;·&nbsp; M=TR</code><code>X′=MXM̃ for point, line, circle, sphere &nbsp;·&nbsp; Mn∞M̃=n∞</code></div>
  </LabFrame>;
}
