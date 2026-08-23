'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid, toRad } from './drawing';
import { LabFrame, Slider } from './LabChrome';

type Line = readonly [number,number,number];
type Point2 = readonly [number,number];

function drawWorldLine(ctx:CanvasRenderingContext2D,line:Line,cx:number,cy:number,unit:number,range:number,color:string,label:string){
  const [a,b,c]=line,points:Point2[]=[];
  const add=(x:number,y:number)=>{if(Number.isFinite(x)&&Number.isFinite(y)&&x>=-range-.001&&x<=range+.001&&y>=-range-.001&&y<=range+.001)points.push([x,y]);};
  if(Math.abs(b)>1e-8){add(-range,-(c-a*range)/b);add(range,-(c+a*range)/b);}
  if(Math.abs(a)>1e-8){add(-(c-b*range)/a,-range);add(-(c+b*range)/a,range);}
  const unique=points.filter((point,index)=>points.findIndex(other=>Math.hypot(point[0]-other[0],point[1]-other[1])<1e-5)===index);
  if(unique.length<2)return;
  const [p,q]=unique;ctx.beginPath();ctx.moveTo(cx+p[0]*unit,cy-p[1]*unit);ctx.lineTo(cx+q[0]*unit,cy-q[1]*unit);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=color;ctx.font='11px ui-monospace, monospace';ctx.fillText(label,cx+q[0]*unit+6,cy-q[1]*unit-6);
}

export function PGA2DMeetLab(){
  const [angle1,setAngle1]=useState(24),[angle2,setAngle2]=useState(112),[offset1,setOffset1]=useState(-.42),[offset2,setOffset2]=useState(.58);
  const a1=Math.cos(toRad(angle1)),b1=Math.sin(toRad(angle1)),c1=-offset1,a2=Math.cos(toRad(angle2)),b2=Math.sin(toRad(angle2)),c2=-offset2;
  const w=a1*b2-b1*a2,x=b1*c2-c1*b2,y=c1*a2-a1*c2,ideal=Math.abs(w)<.025,euclidean=ideal?null:[x/w,y/w] as Point2;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.55,range=2.25,unit=Math.min(width,height)*.19;
    ctx.strokeStyle='rgba(216,227,224,.18)';ctx.beginPath();ctx.moveTo(cx-range*unit,cy);ctx.lineTo(cx+range*unit,cy);ctx.moveTo(cx,cy-range*unit);ctx.lineTo(cx,cy+range*unit);ctx.stroke();
    drawWorldLine(ctx,[a1,b1,c1],cx,cy,unit,range,'#b69bf2','ℓ₁');drawWorldLine(ctx,[a2,b2,c2],cx,cy,unit,range,'#4bdab0','ℓ₂');
    if(euclidean){const visible=Math.abs(euclidean[0])<=range&&Math.abs(euclidean[1])<=range,px=cx+Math.max(-range,Math.min(range,euclidean[0]))*unit,py=cy-Math.max(-range,Math.min(range,euclidean[1]))*unit;ctx.beginPath();ctx.arc(px,py,visible?7:5,0,Math.PI*2);ctx.fillStyle=visible?'#efbd55':'#f07f63';ctx.fill();ctx.strokeStyle='#111821';ctx.stroke();ctx.fillStyle=visible?'#efbd55':'#f07f63';ctx.font='11px ui-monospace, monospace';ctx.fillText(visible?'P = ℓ₁∧ℓ₂':'P leaves affine window',px+10,py-8);}
    else {const dx=-b1,dy=a1,startX=cx-width*.14,startY=height*.2;drawArrow2D(ctx,startX,startY,startX+dx*70,startY-dy*70,'#efbd55','ideal P');ctx.fillStyle='#9caca9';ctx.font='10px ui-monospace, monospace';ctx.fillText('w = 0 · common direction lives at infinity',20,23);}
    ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('dual PGA: lines are 1-vectors, intersection is the outer product',20,height-18);
  };
  const pointLabel=ideal?`${x.toFixed(2)}e₂₀ ${y<0?'−':'+'} ${Math.abs(y).toFixed(2)}e₀₁`:`(${(x/w).toFixed(2)}, ${(y/w).toFixed(2)})`;
  return <LabFrame title="两条直线的外积同时包含有限交点与无穷远交点" tag="LAB · 2D DUAL PGA" metrics={[["P=ℓ₁∧ℓ₂",pointLabel],["weight w",w.toFixed(3)],["kind",ideal?'ideal point':'Euclidean point']] }>
    <InteractiveCanvas draw={draw} dependencies={[angle1,angle2,offset1,offset2]} label="二维射影几何代数中两条直线外积求交点实验" />
    <div className="lab-controls"><Slider label="ℓ₁ 法向角" value={angle1} min={-180} max={180} suffix="°" onChange={setAngle1}/><Slider label="ℓ₁ 有向距离" value={offset1} min={-1.5} max={1.5} step={.01} onChange={setOffset1}/><Slider label="ℓ₂ 法向角" value={angle2} min={-180} max={180} suffix="°" onChange={setAngle2}/><Slider label="ℓ₂ 有向距离" value={offset2} min={-1.5} max={1.5} step={.01} onChange={setOffset2}/></div>
    <div className="quaternion-readout"><code>ℓᵢ = aᵢe₁ + bᵢe₂ + cᵢe₀ &nbsp;·&nbsp; aᵢ²+bᵢ²=1</code><code>P=ℓ₁∧ℓ₂ = x e₂₀ + y e₀₁ + w e₁₂ &nbsp;·&nbsp; affine point=(x/w,y/w)</code></div>
  </LabFrame>;
}

export function HomogeneousEmbeddingLab(){
  const [x,setX]=useState(.82),[y,setY]=useState(-.48),[lambda,setLambda]=useState(1.55),[ideal,setIdeal]=useState(false);
  const directionLength=Math.hypot(x,y)||1,canonical=ideal?[x/directionLength,y/directionLength,0]:[x,y,1],scaled=canonical.map(value=>value*lambda),kind=ideal?'ideal direction':'finite point';
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const divider=width*.47;ctx.beginPath();ctx.moveTo(divider,28);ctx.lineTo(divider,height-28);ctx.strokeStyle='rgba(216,227,224,.2)';ctx.stroke();ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('AFFINE VIEW',20,23);ctx.fillText('HOMOGENEOUS COORDINATE RAY',divider+20,23);
    const leftCenter=[divider*.5,height*.58] as const,leftUnit=Math.min(divider,height)*.22;ctx.strokeStyle='rgba(216,227,224,.18)';ctx.beginPath();ctx.moveTo(20,leftCenter[1]);ctx.lineTo(divider-20,leftCenter[1]);ctx.moveTo(leftCenter[0],45);ctx.lineTo(leftCenter[0],height-28);ctx.stroke();
    if(ideal){drawArrow2D(ctx,leftCenter[0],leftCenter[1],leftCenter[0]+canonical[0]*leftUnit*1.45,leftCenter[1]-canonical[1]*leftUnit*1.45,'#efbd55','w=0 direction');}
    else {const px=leftCenter[0]+x*leftUnit,py=leftCenter[1]-y*leftUnit;ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();ctx.fillStyle='#efbd55';ctx.fillText(`(${x.toFixed(2)}, ${y.toFixed(2)})`,px+11,py-8);}
    const origin=[width*.68,height*.72] as const,u=Math.min(width-divider,height)*.14,project=([hx,hy,hw]:number[])=>[origin[0]+hx*u+hw*u*.55,origin[1]-hy*u-hw*u*.42] as const;
    const plane=[[-1.45,-1,1],[1.45,-1,1],[1.45,1,1],[-1.45,1,1]].map(project);ctx.beginPath();plane.forEach((point,index)=>index?ctx.lineTo(...point):ctx.moveTo(...point));ctx.closePath();ctx.fillStyle='rgba(75,218,176,.08)';ctx.fill();ctx.strokeStyle='rgba(75,218,176,.35)';ctx.stroke();ctx.fillStyle='#6fae9d';ctx.fillText('w=1 affine slice',plane[3][0],plane[3][1]-8);
    drawArrow2D(ctx,...origin,...project([1.25,0,0]),'rgba(239,189,85,.55)','X');drawArrow2D(ctx,...origin,...project([0,1.25,0]),'rgba(182,155,242,.55)','Y');drawArrow2D(ctx,...origin,...project([0,0,1.45]),'rgba(75,218,176,.55)','w');
    const rayEnd=project(canonical.map(value=>value*2.4));ctx.beginPath();ctx.moveTo(...origin);ctx.lineTo(...rayEnd);ctx.strokeStyle='rgba(239,189,85,.45)';ctx.setLineDash([4,5]);ctx.stroke();ctx.setLineDash([]);
    const p=project(canonical),lp=project(scaled);ctx.beginPath();ctx.arc(...p,5,0,Math.PI*2);ctx.fillStyle='#4bdab0';ctx.fill();ctx.beginPath();ctx.arc(...lp,7,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();ctx.fillStyle='#efbd55';ctx.fillText('λP',lp[0]+9,lp[1]-7);ctx.fillStyle='#4bdab0';ctx.fillText('P',p[0]+8,p[1]+14);
  };
  return <LabFrame title="齐次坐标是一条射线：λP 与 P 表示同一几何元素" tag="LAB · HOMOGENEOUS EMBEDDING" metrics={[["representative",`λ=${lambda.toFixed(2)}`],["weight",scaled[2].toFixed(2)],["kind",kind]]}>
    <InteractiveCanvas draw={draw} dependencies={[x,y,lambda,ideal]} label="欧氏点的齐次嵌入、尺度等价与理想方向实验" />
    <div className="operation-tabs homogeneous-tabs"><button className={!ideal?'active':''} onClick={()=>setIdeal(false)}><b>w ≠ 0</b><span>有限点 · 可归一化到 w=1</span></button><button className={ideal?'active':''} onClick={()=>setIdeal(true)}><b>w = 0</b><span>理想点 · 只编码方向</span></button></div>
    <div className="lab-controls"><Slider label={ideal?'方向 x 分量':'欧氏坐标 x'} value={x} min={-1.4} max={1.4} step={.01} onChange={setX}/><Slider label={ideal?'方向 y 分量':'欧氏坐标 y'} value={y} min={-1.1} max={1.1} step={.01} onChange={setY}/><Slider label="代表尺度 λ" value={lambda} min={.35} max={2.2} step={.01} onChange={setLambda}/></div>
    <div className="quaternion-readout"><code>{ideal?'P∞ = dₓe₂₀ + dᵧe₀₁ + 0e₁₂':'P(x,y) = x e₂₀ + y e₀₁ + e₁₂'}</code><code>λP ∼ P for λ≠0 &nbsp;·&nbsp; e₀²=0 &nbsp;·&nbsp; e₁²=e₂²=1</code></div>
  </LabFrame>;
}
