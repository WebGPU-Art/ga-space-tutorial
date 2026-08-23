'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawAxes3D, drawDarkGrid, projectIso, rotateAroundAxis, toRad, type Vec3 } from './drawing';
import { LabFrame, Slider } from './LabChrome';

const add=(a:Vec3,b:Vec3):Vec3=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const scale=(a:Vec3,s:number):Vec3=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a:Vec3,b:Vec3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=(a:Vec3)=>Math.hypot(...a);
const unit=(a:Vec3):Vec3=>{const n=norm(a)||1;return scale(a,1/n);};
const line=(ctx:CanvasRenderingContext2D,a:Vec3,b:Vec3,center:readonly[number,number],unitScale:number,color:string,width=1.5,dashed=false)=>{const p=projectIso(a,...center,unitScale),q=projectIso(b,...center,unitScale);ctx.beginPath();ctx.setLineDash(dashed?[5,5]:[]);ctx.moveTo(...p);ctx.lineTo(...q);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();ctx.setLineDash([]);};
const point=(ctx:CanvasRenderingContext2D,p:Vec3,center:readonly[number,number],unitScale:number,color:string,label:string,r=5)=>{const q=projectIso(p,...center,unitScale);ctx.beginPath();ctx.arc(...q,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.font='11px ui-monospace, monospace';ctx.fillText(label,q[0]+8,q[1]-8);};

const cubeVertices:Vec3[]=[[-.45,-.45,-.45],[.45,-.45,-.45],[.45,.45,-.45],[-.45,.45,-.45],[-.45,-.45,.45],[.45,-.45,.45],[.45,.45,.45],[-.45,.45,.45]];
const cubeEdges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]] as const;

export function MotorDecompositionLab(){
  const [angle,setAngle]=useState(72),[tx,setTx]=useState(.9),[ty,setTy]=useState(.35),[tz,setTz]=useState(.42),[order,setOrder]=useState<'TR'|'RT'>('TR');
  const theta=toRad(angle),translation:Vec3=[tx,ty,tz],rotate=(p:Vec3)=>rotateAroundAxis(p,[0,0,1],theta);
  const transform=(p:Vec3)=>order==='TR'?add(rotate(p),translation):rotate(add(p,translation));
  const centerPoint=transform([0,0,0]);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,36);const center=[width*.48,height*.58] as const,u=Math.min(width,height)*.17;drawAxes3D(ctx,center,u);
    cubeEdges.forEach(([a,b])=>line(ctx,cubeVertices[a],cubeVertices[b],center,u,'rgba(216,227,224,.25)',1));
    const moved=cubeVertices.map(transform);cubeEdges.forEach(([a,b])=>line(ctx,moved[a],moved[b],center,u,'#4bdab0',2.2));
    const origin=projectIso([0,0,0],...center,u),end=projectIso(centerPoint,...center,u);drawArrow2D(ctx,...origin,...end,'#efbd55',order==='TR'?'t after R':'R(t) after T');
    point(ctx,centerPoint,center,u,'#efbd55','frame origin',6);ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('ghost = source frame · green = M-transformed frame',18,22);
  };
  return <LabFrame title="旋转和平移共享一个单位偶多向量，但因子顺序仍然重要" tag="LAB · MOTOR FACTORIZATION" metrics={[["factorization",`M=${order}`],["origin",`(${centerPoint.map(v=>v.toFixed(2)).join(', ')})`],["‖TR−RT‖",norm(sub(translation,rotate(translation))).toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[angle,tx,ty,tz,order]} label="三维 PGA motor 的旋转平移次序实验" />
    <div className="operation-tabs"><button className={order==='TR'?'active':''} onClick={()=>setOrder('TR')}><b>M=TR</b><span>先 R，后沿世界坐标 t 平移</span></button><button className={order==='RT'?'active':''} onClick={()=>setOrder('RT')}><b>M=RT</b><span>先 T，位移也被 R 旋转</span></button></div>
    <div className="lab-controls"><Slider label="绕 z 轴旋转 θ" value={angle} min={-180} max={180} suffix="°" onChange={setAngle}/><Slider label="tₓ" value={tx} min={-1.2} max={1.2} step={.01} onChange={setTx}/><Slider label="tᵧ" value={ty} min={-1.2} max={1.2} step={.01} onChange={setTy}/><Slider label="t_z" value={tz} min={-1} max={1} step={.01} onChange={setTz}/></div>
    <div className="quaternion-readout"><code>M M̃=1 &nbsp;·&nbsp; X′=MXM̃ &nbsp;·&nbsp; M={order==='TR'?'T(t)R(θ)':'R(θ)T(t)'}</code><code>{order==='TR'?'origin′=t':'origin′=R(t)'}=({centerPoint.map(v=>v.toFixed(2)).join(',')})</code></div>
  </LabFrame>;
}

type LineMode='finite'|'ideal'|'invalid';
export function PluckerLineLab(){
  const [mode,setMode]=useState<LineMode>('finite'),[azimuth,setAzimuth]=useState(28),[elevation,setElevation]=useState(20),[uOffset,setUOffset]=useState(.65),[vOffset,setVOffset]=useState(-.42),[violation,setViolation]=useState(.55);
  const az=toRad(azimuth),el=toRad(elevation),d:Vec3=[Math.cos(el)*Math.cos(az),Math.cos(el)*Math.sin(az),Math.sin(el)];
  const helper:Vec3=Math.abs(d[2])<.85?[0,0,1]:[1,0,0],u=unit(cross(d,helper)),v=cross(d,u),p=add(scale(u,uOffset),scale(v,vOffset)),baseMoment=cross(p,d);
  const direction:Vec3=mode==='ideal'?[0,0,0]:d,moment:Vec3=mode==='ideal'?unit([.7,-.35,.6]):mode==='invalid'?add(baseMoment,scale(d,violation)):baseMoment,residual=dot(direction,moment);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,36);const center=[width*.48,height*.58] as const,s=Math.min(width,height)*.18;drawAxes3D(ctx,center,s);
    if(mode==='ideal'){
      const c=[width*.5,height*.52] as const;ctx.beginPath();ctx.ellipse(c[0],c[1],s*1.75,s*.95,-.18,0,Math.PI*2);ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(182,155,242,.5)';ctx.stroke();ctx.setLineDash([]);const a=projectIso(scale(moment,1.2),...center,s),o=projectIso([0,0,0],...center,s);drawArrow2D(ctx,...o,...a,'#b69bf2','ideal line · pure moment');
    }else{
      line(ctx,sub(p,scale(d,2.2)),add(p,scale(d,2.2)),center,s,mode==='invalid'?'#f07f63':'#4bdab0',2.5);line(ctx,[0,0,0],p,center,s,'rgba(239,189,85,.55)',1.5,true);point(ctx,p,center,s,'#efbd55','closest p');
      const pp=projectIso(p,...center,s),pd=projectIso(add(p,scale(d,.8)),...center,s),pm=projectIso(add(p,scale(moment,.8)),...center,s);drawArrow2D(ctx,...pp,...pd,'#4bdab0','d');drawArrow2D(ctx,...pp,...pm,'#b69bf2','m=p×d');
      if(mode==='invalid'){ctx.fillStyle='#f07f63';ctx.font='11px ui-monospace, monospace';ctx.fillText('d·m ≠ 0 → this bivector is not one simple line',18,23);}
    }
  };
  return <LabFrame title="方向 d 与 moment m 必须满足 d·m=0，才能落在 Klein quadric 上" tag="LAB · PLÜCKER LINE" metrics={[["d·m",residual.toFixed(3)],["L∧L",(2*residual).toFixed(3)+" I"],["kind",mode==='finite'?'finite simple line':mode==='ideal'?'ideal line':'non-simple bivector']]}>
    <InteractiveCanvas draw={draw} dependencies={[mode,azimuth,elevation,uOffset,vOffset,violation]} label="三维 Plücker 直线方向 moment 与简单性约束实验" />
    <div className="operation-tabs"><button className={mode==='finite'?'active':''} onClick={()=>setMode('finite')}><b>d≠0</b><span>有限 simple line</span></button><button className={mode==='ideal'?'active':''} onClick={()=>setMode('ideal')}><b>d=0</b><span>理想线 · pure moment</span></button><button className={mode==='invalid'?'active':''} onClick={()=>setMode('invalid')}><b>d·m≠0</b><span>非简单双向量</span></button></div>
    <div className="lab-controls"><Slider label="方向方位角" value={azimuth} min={-180} max={180} suffix="°" onChange={setAzimuth}/><Slider label="方向仰角" value={elevation} min={-75} max={75} suffix="°" onChange={setElevation}/><Slider label="最近点 u 分量" value={uOffset} min={-1.2} max={1.2} step={.01} onChange={setUOffset}/><Slider label={mode==='invalid'?"约束破坏量":"最近点 v 分量"} value={mode==='invalid'?violation:vOffset} min={-1.2} max={1.2} step={.01} onChange={mode==='invalid'?setViolation:setVOffset}/></div>
    <div className="quaternion-readout"><code>L=dₓe₂₃+dᵧe₃₁+d_ze₁₂+mₓe₀₁+mᵧe₀₂+m_ze₀₃</code><code>m=p×d &nbsp;·&nbsp; d·m=0 ⇔ L∧L=0 <small>(此基与定向约定下)</small></code></div>
  </LabFrame>;
}

export function ScrewMotionLab(){
  const [angle,setAngle]=useState(250),[advance,setAdvance]=useState(1.15),[path,setPath]=useState(.62),[radius,setRadius]=useState(.72);
  const axis=unit([.18,.3,1]),center:Vec3=[-.35,-.15,-.25],basis=unit(cross(axis,[1,0,0])),start=add(center,scale(basis,radius));
  const pose=(t:number)=>add(center,add(rotateAroundAxis(sub(start,center),axis,toRad(angle)*t),scale(axis,advance*t))),current=pose(path),end=pose(1),pitch=Math.abs(angle)<1e-5?Infinity:advance/toRad(angle);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,36);const view=[width*.48,height*.6] as const,s=Math.min(width,height)*.17;drawAxes3D(ctx,view,s);line(ctx,sub(center,scale(axis,1.4)),add(center,scale(axis,2.4)),view,s,'rgba(182,155,242,.65)',2,true);
    let previous=pose(0);for(let i=1;i<=80;i++){const p=pose(i/80);line(ctx,previous,p,view,s,i/80<=path?'#4bdab0':'rgba(75,218,176,.22)',i/80<=path?2.2:1.2);previous=p;}
    point(ctx,start,view,s,'#efbd55','x(0)',6);point(ctx,current,view,s,'#f07f63','x(t)',7);point(ctx,end,view,s,'#4bdab0','x(1)',5);const a=projectIso(center,...view,s),b=projectIso(add(center,scale(axis,advance)),...view,s);drawArrow2D(ctx,...a,...b,'#b69bf2','δ along axis');
  };
  return <LabFrame title="一个参数同时推进绕轴角度与沿轴位移，轨迹自然成为螺旋" tag="LAB · SCREW / SCLERP" metrics={[["θ(t)",`${(angle*path).toFixed(1)}°`],["δ(t)",(advance*path).toFixed(2)],["pitch δ/θ",Number.isFinite(pitch)?pitch.toFixed(3):'∞ · translation']]}>
    <InteractiveCanvas draw={draw} dependencies={[angle,advance,path,radius]} label="motor 对数驱动的螺旋运动和 ScLERP 轨迹实验" />
    <div className="lab-controls"><Slider label="总旋转 θ" value={angle} min={-360} max={360} suffix="°" onChange={setAngle}/><Slider label="轴向总位移 δ" value={advance} min={-1.6} max={1.6} step={.01} onChange={setAdvance}/><Slider label="插值参数 t" value={path} min={0} max={1} step={.01} onChange={setPath}/><Slider label="离轴半径" value={radius} min={.1} max={1.2} step={.01} onChange={setRadius}/></div>
    <div className="quaternion-readout"><code>M(t)=M₀ exp(t log(M̃₀M₁))</code><code>x(t)=c+Rotᵤ(tθ)(x₀−c)+tδu &nbsp;·&nbsp; current=({current.map(v=>v.toFixed(2)).join(', ')})</code></div>
  </LabFrame>;
}
