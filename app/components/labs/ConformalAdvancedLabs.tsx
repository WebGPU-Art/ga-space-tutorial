'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawDarkGrid } from './drawing';
import { LabFrame, Slider } from './LabChrome';

type Point2=readonly[number,number];
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
const dot=(a:Point2,b:Point2)=>a[0]*b[0]+a[1]*b[1];
const norm=(a:Point2)=>Math.hypot(a[0],a[1]);
const sub=(a:Point2,b:Point2):Point2=>[a[0]-b[0],a[1]-b[1]];
const unit=(a:Point2):Point2=>{const n=norm(a)||1;return[a[0]/n,a[1]/n];};

function worldToScreen(p:Point2,cx:number,cy:number,u:number){return[cx+p[0]*u,cy-p[1]*u] as const;}
function screenToWorld(e:CanvasPointer,uFactor=.18):Point2{const cx=e.width*.5,cy=e.height*.56,u=Math.min(e.width,e.height)*uFactor;return[clamp((e.x-cx)/u,-2.55,2.55),clamp((cy-e.y)/u,-2.05,2.05)];}

type OperatorMode='inversion'|'dilation'|'special';
export function ConformalOperatorsLab(){
  const [mode,setMode]=useState<OperatorMode>('inversion'),[amount,setAmount]=useState(1),[probe,setProbe]=useState<Point2>([1.35,.62]);
  const center:Point2=[.2,-.12];
  const transform=(p:Point2):Point2|null=>{
    if(mode==='inversion'){const q=sub(p,center),d2=dot(q,q);return d2<.003?null:[center[0]+amount*amount*q[0]/d2,center[1]+amount*amount*q[1]/d2];}
    if(mode==='dilation')return[p[0]*amount,p[1]*amount];
    const b:Point2=[amount*.36,amount*.16],x2=dot(p,p),den=1-2*dot(b,p)+dot(b,b)*x2;return Math.abs(den)<.018?null:[(p[0]-b[0]*x2)/den,(p[1]-b[1]*x2)/den];
  };
  const transformedProbe=transform(probe),eps=.008,px=transform([probe[0]+eps,probe[1]]),py=transform([probe[0],probe[1]+eps]);
  const localAngle=transformedProbe&&px&&py?Math.acos(clamp(Math.abs(dot(sub(px,transformedProbe),sub(py,transformedProbe)))/(norm(sub(px,transformedProbe))*norm(sub(py,transformedProbe))||1),-1,1))*180/Math.PI:NaN;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.56,u=Math.min(width,height)*.18;
    const curve=(sample:(t:number)=>Point2,color:string,widthPx=1)=>{let previous:readonly[number,number]|null=null;for(let i=0;i<=160;i++){const q=transform(sample(i/160));if(!q||Math.abs(q[0])>3.2||Math.abs(q[1])>2.6){previous=null;continue;}const s=worldToScreen(q,cx,cy,u);if(previous&&Math.hypot(s[0]-previous[0],s[1]-previous[1])<u*.55){ctx.beginPath();ctx.moveTo(...previous);ctx.lineTo(...s);ctx.strokeStyle=color;ctx.lineWidth=widthPx;ctx.stroke();}previous=s;}};
    for(let k=-6;k<=6;k++){const v=k/3;curve(t=>[-2.8+5.6*t,v],'rgba(89,197,216,.27)');curve(t=>[v,-2.3+4.6*t],'rgba(182,155,242,.23)');}
    curve(t=>[.65+Math.cos(t*Math.PI*2)*.72,.18+Math.sin(t*Math.PI*2)*.72],'#4bdab0',2.2);
    if(mode==='inversion'){const c=worldToScreen(center,cx,cy,u);ctx.beginPath();ctx.arc(...c,amount*u,0,Math.PI*2);ctx.strokeStyle='rgba(239,189,85,.55)';ctx.setLineDash([6,5]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#efbd55';ctx.font='10px ui-monospace, monospace';ctx.fillText('inversion sphere',c[0]+amount*u+8,c[1]);}
    const p=worldToScreen(probe,cx,cy,u);ctx.beginPath();ctx.arc(...p,5,0,Math.PI*2);ctx.fillStyle='rgba(216,227,224,.45)';ctx.fill();if(transformedProbe){const q=worldToScreen(transformedProbe,cx,cy,u);ctx.beginPath();ctx.arc(...q,7,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();ctx.fillStyle='#efbd55';ctx.font='11px ui-monospace, monospace';ctx.fillText('f(p)',q[0]+9,q[1]-8);}
    ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('drag p · cyan/purple grid is the transformed Euclidean chart',18,22);
  };
  const move=(e:CanvasPointer)=>{if(e.phase!=='up')setProbe(screenToWorld(e));};
  const parameter=mode==='inversion'?`R=${amount.toFixed(2)}`:mode==='dilation'?`α=${amount.toFixed(2)}`:`‖b‖=${Math.abs(amount).toFixed(2)}`;
  return <LabFrame title="圆和直线可以互换，局部直角却始终保持" tag="LAB · CONFORMAL OPERATORS" metrics={[["operator",mode],["parameter",parameter],["local angle",Number.isFinite(localAngle)?`${localAngle.toFixed(2)}°`:'singular']]}>
    <InteractiveCanvas draw={draw} dependencies={[mode,amount,probe]} onPointer={move} label="反演缩放和特殊共形变换作用于网格与圆的实验" />
    <div className="operation-tabs"><button className={mode==='inversion'?'active':''} onClick={()=>{setMode('inversion');setAmount(1);}}><b>sphere inversion</b><span>中心与无穷远互换</span></button><button className={mode==='dilation'?'active':''} onClick={()=>{setMode('dilation');setAmount(1.35);}}><b>dilation</b><span>等角缩放</span></button><button className={mode==='special'?'active':''} onClick={()=>{setMode('special');setAmount(.8);}}><b>I · T · I</b><span>特殊共形变换</span></button></div>
    <div className="lab-controls one-slider"><Slider label={mode==='inversion'?'反演半径 R':mode==='dilation'?'缩放 α':'特殊共形强度 b'} value={amount} min={mode==='special'?-.95:.35} max={mode==='special'?.95:2} step={.01} onChange={setAmount}/></div>
    <div className="quaternion-readout"><code>{mode==='inversion'?"x′=c+R²(x−c)/‖x−c‖²":mode==='dilation'?"x′=αx":"x′=(x−b‖x‖²)/(1−2b·x+‖b‖²‖x‖²)"}</code><code>X′∼VXṼ &nbsp;·&nbsp; conformal means local angles survive, not global distances</code></div>
  </LabFrame>;
}

type GeometryMode='euclidean'|'hyperbolic'|'elliptic';
export function ModelGeometryLab(){
  const [mode,setMode]=useState<GeometryMode>('hyperbolic'),[a,setA]=useState<Point2>([-.55,-.25]),[b,setB]=useState<Point2>([.43,.52]),[active,setActive]=useState<'A'|'B'>('B');
  const lift=(p:Point2):readonly[number,number,number]=>[p[0],p[1],Math.sqrt(Math.max(0,1-dot(p,p)))];
  const A=lift(a),B=lift(b),euclideanDistance=norm(sub(a,b)),hyperbolicDistance=Math.acosh(Math.max(1,1+2*euclideanDistance**2/((1-dot(a,a))*(1-dot(b,b))))),sphereDot=clamp(A[0]*B[0]+A[1]*B[1]+A[2]*B[2],-1,1),sphereAngle=Math.acos(sphereDot),ellipticDistance=Math.min(sphereAngle,Math.PI-sphereAngle),metricDistance=mode==='euclidean'?euclideanDistance:mode==='hyperbolic'?hyperbolicDistance:ellipticDistance;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.56,u=Math.min(width,height)*.205;
    if(mode!=='euclidean'){ctx.beginPath();ctx.arc(cx,cy,u,0,Math.PI*2);ctx.fillStyle=mode==='hyperbolic'?'rgba(89,197,216,.055)':'rgba(182,155,242,.06)';ctx.fill();ctx.strokeStyle=mode==='hyperbolic'?'rgba(89,197,216,.6)':'rgba(182,155,242,.6)';ctx.lineWidth=2;ctx.stroke();}
    if(mode==='euclidean'){
      const d=unit(sub(b,a)),p:Point2=[a[0]-d[0]*3,a[1]-d[1]*3],q:Point2=[a[0]+d[0]*3,a[1]+d[1]*3],P=worldToScreen(p,cx,cy,u),Q=worldToScreen(q,cx,cy,u);ctx.beginPath();ctx.moveTo(...P);ctx.lineTo(...Q);ctx.strokeStyle='#4bdab0';ctx.lineWidth=2.6;ctx.stroke();
    }else if(mode==='hyperbolic'){
      const rhsA=(dot(a,a)+1)/2,rhsB=(dot(b,b)+1)/2,det=a[0]*b[1]-a[1]*b[0];
      if(Math.abs(det)<.018){const d=unit(norm(a)>norm(b)?a:b),P=worldToScreen([-d[0],-d[1]],cx,cy,u),Q=worldToScreen(d,cx,cy,u);ctx.beginPath();ctx.moveTo(...P);ctx.lineTo(...Q);ctx.strokeStyle='#4bdab0';ctx.lineWidth=2.6;ctx.stroke();}
      else{const c:Point2=[(rhsA*b[1]-a[1]*rhsB)/det,(a[0]*rhsB-rhsA*b[0])/det],r=Math.sqrt(Math.max(0,dot(c,c)-1));let previous:readonly[number,number]|null=null;for(let i=0;i<=260;i++){const t=i/260*Math.PI*2,p:Point2=[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];if(norm(p)>=1.001){previous=null;continue;}const s=worldToScreen(p,cx,cy,u);if(previous){ctx.beginPath();ctx.moveTo(...previous);ctx.lineTo(...s);ctx.strokeStyle='#4bdab0';ctx.lineWidth=2.6;ctx.stroke();}previous=s;}}
    }else{
      const cross3=(x:readonly[number,number,number],y:readonly[number,number,number])=>[x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]] as const,n=cross3(A,B),nn=Math.hypot(...n)||1,N=[n[0]/nn,n[1]/nn,n[2]/nn] as const,U=A,V0=cross3(N,U),vn=Math.hypot(...V0)||1,V=[V0[0]/vn,V0[1]/vn,V0[2]/vn] as const;let previous:readonly[number,number]|null=null,previousFront=true;for(let i=0;i<=240;i++){const t=i/240*Math.PI*2,p=[U[0]*Math.cos(t)+V[0]*Math.sin(t),U[1]*Math.cos(t)+V[1]*Math.sin(t),U[2]*Math.cos(t)+V[2]*Math.sin(t)] as const,s=worldToScreen([p[0],p[1]],cx,cy,u),front=p[2]>=0;if(previous){ctx.beginPath();ctx.moveTo(...previous);ctx.lineTo(...s);ctx.strokeStyle=front&&previousFront?'#4bdab0':'rgba(75,218,176,.35)';ctx.lineWidth=front&&previousFront?2.6:1.5;ctx.setLineDash(front&&previousFront?[]:[5,5]);ctx.stroke();ctx.setLineDash([]);}previous=s;previousFront=front;}
    }
    const drawP=(p:Point2,label:string,color:string,selected:boolean)=>{const s=worldToScreen(p,cx,cy,u);ctx.beginPath();ctx.arc(...s,selected?9:7,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(selected){ctx.strokeStyle='#fff5d6';ctx.lineWidth=2;ctx.stroke();}ctx.fillStyle=color;ctx.font='11px ui-monospace, monospace';ctx.fillText(label,s[0]+9,s[1]-8);};drawP(a,'A','#efbd55',active==='A');drawP(b,'B','#b69bf2',active==='B');ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText(mode==='elliptic'?'solid/dashed = front/back great circle · antipodes identified':'drag A or B · the curve is intrinsically straight',18,22);
  };
  const move=(e:CanvasPointer)=>{if(e.phase==='up')return;let p=screenToWorld(e,.205);if(mode!=='euclidean'){const n=norm(p);if(n>.88)p=[p[0]*.88/n,p[1]*.88/n];}if(active==='A')setA(p);else setB(p);};
  const curvature=mode==='euclidean'?'0':mode==='hyperbolic'?'−1':'+1',geodesic=mode==='euclidean'?'straight line':mode==='hyperbolic'?'boundary-orthogonal arc':'great circle / antipodal';
  return <LabFrame title="同一个“直线”概念随模型度量变成线、正交圆弧或大圆" tag="LAB · MODEL GEOMETRIES" metrics={[["curvature K",curvature],["geodesic",geodesic],["intrinsic d(A,B)",metricDistance.toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[mode,a,b,active]} onPointer={move} label="欧氏双曲和椭圆几何测地线对照实验" />
    <div className="operation-tabs"><button className={mode==='euclidean'?'active':''} onClick={()=>setMode('euclidean')}><b>K=0</b><span>Euclidean plane</span></button><button className={mode==='hyperbolic'?'active':''} onClick={()=>setMode('hyperbolic')}><b>K=−1</b><span>Poincaré disk</span></button><button className={mode==='elliptic'?'active':''} onClick={()=>setMode('elliptic')}><b>K=+1</b><span>sphere / RP² chart</span></button></div>
    <div className="operation-tabs"><button className={active==='A'?'active':''} onClick={()=>setActive('A')}><b>drag A</b><span>第一端点</span></button><button className={active==='B'?'active':''} onClick={()=>setActive('B')}><b>drag B</b><span>第二端点</span></button></div>
    <div className="quaternion-readout"><code>geodesic = locally shortest path under the selected metric</code><code>same projective/conformal machinery · different absolute / infinity element · different invariant distance</code></div>
  </LabFrame>;
}
