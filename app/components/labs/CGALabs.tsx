'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawDarkGrid, projectIso, type Vec3 } from './drawing';
import { LabFrame } from './LabChrome';

type Point2=readonly[number,number];
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));

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
