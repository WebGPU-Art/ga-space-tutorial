'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid } from './drawing';
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
