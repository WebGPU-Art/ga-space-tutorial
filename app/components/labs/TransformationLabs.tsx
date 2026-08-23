'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawAxes3D, drawDarkGrid, drawProjectedArrow, projectIso, rotateAroundAxis, toRad, type Vec3 } from './drawing';
import { LabFrame, Slider } from './LabChrome';

export function ReflectionLab(){
  const [mirrorAngle,setMirrorAngle]=useState(28),[vectorAngle,setVectorAngle]=useState(72),[length,setLength]=useState(1.25);
  const phi=toRad(mirrorAngle),theta=toRad(vectorAngle),reflectedAngle=2*phi-theta;
  const vector=[length*Math.cos(theta),length*Math.sin(theta)] as const,reflected=[length*Math.cos(reflectedAngle),length*Math.sin(reflectedAngle)] as const;
  const normalAngle=phi+Math.PI/2,normal=[Math.cos(normalAngle),Math.sin(normalAngle)] as const,normalPart=vector[0]*normal[0]+vector[1]*normal[1];
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const cx=width*.5,cy=height*.56,unit=Math.min(width,height)*.24,lineLength=Math.max(width,height);
    ctx.beginPath();ctx.moveTo(cx-lineLength*Math.cos(phi),cy+lineLength*Math.sin(phi));ctx.lineTo(cx+lineLength*Math.cos(phi),cy-lineLength*Math.sin(phi));ctx.strokeStyle='rgba(182,155,242,.85)';ctx.lineWidth=2;ctx.stroke();
    drawArrow2D(ctx,cx,cy,cx+normal[0]*unit*.75,cy-normal[1]*unit*.75,'#b69bf2','n',true);
    drawArrow2D(ctx,cx,cy,cx+vector[0]*unit,cy-vector[1]*unit,'#efbd55','x');drawArrow2D(ctx,cx,cy,cx+reflected[0]*unit,cy-reflected[1]*unit,'#4bdab0','−nxn⁻¹');
    const foot=[vector[0]-normalPart*normal[0],vector[1]-normalPart*normal[1]] as const;ctx.beginPath();ctx.setLineDash([4,5]);ctx.moveTo(cx+vector[0]*unit,cy-vector[1]*unit);ctx.lineTo(cx+foot[0]*unit,cy-foot[1]*unit);ctx.lineTo(cx+reflected[0]*unit,cy-reflected[1]*unit);ctx.strokeStyle='rgba(240,127,99,.6)';ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#98a8a6';ctx.font='10px ui-monospace, monospace';ctx.fillText('reflecting hyperplane',20,23);
  };
  return <LabFrame title="反射只翻转法向分量" tag="LAB · SINGLE REFLECTION" metrics={[["|x|",length.toFixed(3)],["|x′|",Math.hypot(...reflected).toFixed(3)],["normal flip",`${normalPart.toFixed(3)} → ${(-normalPart).toFixed(3)}`]]}>
    <InteractiveCanvas draw={draw} dependencies={[mirrorAngle,vectorAngle,length]} label="向量在超平面上的 GA sandwich 反射实验" />
    <div className="lab-controls"><Slider label="镜面方向" value={mirrorAngle} min={-90} max={90} suffix="°" onChange={setMirrorAngle}/><Slider label="向量方向" value={vectorAngle} min={-180} max={180} suffix="°" onChange={setVectorAngle}/><Slider label="|x|" value={length} min={.35} max={1.6} step={.01} onChange={setLength}/></div>
  </LabFrame>;
}

export function DoubleReflectionLab(){
  const [mirrorGap,setMirrorGap]=useState(34),[vectorAngle,setVectorAngle]=useState(18),[length,setLength]=useState(1.15);
  const alpha=toRad(mirrorGap),theta=toRad(vectorAngle),afterFirst=-theta,afterSecond=2*alpha+theta;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const cx=width*.5,cy=height*.57,unit=Math.min(width,height)*.25,lineLength=Math.max(width,height);
    const line=(angle:number,color:string,label:string)=>{ctx.beginPath();ctx.moveTo(cx-lineLength*Math.cos(angle),cy+lineLength*Math.sin(angle));ctx.lineTo(cx+lineLength*Math.cos(angle),cy-lineLength*Math.sin(angle));ctx.strokeStyle=color;ctx.lineWidth=1.8;ctx.stroke();ctx.fillStyle=color;ctx.font='10px ui-monospace, monospace';ctx.fillText(label,cx+Math.cos(angle)*unit*1.25,cy-Math.sin(angle)*unit*1.25);};
    line(0,'rgba(182,155,242,.75)','mirror a');line(alpha,'rgba(75,218,176,.75)','mirror b');
    const arrow=(angle:number,color:string,label:string,dashed=false)=>drawArrow2D(ctx,cx,cy,cx+length*unit*Math.cos(angle),cy-length*unit*Math.sin(angle),color,label,dashed);
    arrow(theta,'#efbd55','x',true);arrow(afterFirst,'rgba(240,127,99,.75)','after a',true);arrow(afterSecond,'#4bdab0','R x R̃');
    ctx.beginPath();ctx.arc(cx,cy,36,-theta,-afterSecond,afterSecond>theta);ctx.strokeStyle='#efbd55';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#9aa9a7';ctx.fillText(`net ${2*mirrorGap}°`,cx+42,cy-18);
  };
  return <LabFrame title="两次反射产生两倍夹角的旋转" tag="LAB · DOUBLE REFLECTION" metrics={[["mirror gap",`${mirrorGap}°`],["net rotation",`${2*mirrorGap}°`],["R",`${Math.cos(alpha).toFixed(3)} − ${Math.sin(alpha).toFixed(3)}e₁₂`]]}>
    <InteractiveCanvas draw={draw} dependencies={[mirrorGap,vectorAngle,length]} label="两次镜面反射生成 rotor 和双倍角旋转实验" />
    <div className="lab-controls"><Slider label="两镜夹角 α" value={mirrorGap} min={-85} max={85} suffix="°" onChange={setMirrorGap}/><Slider label="初始向量方向" value={vectorAngle} min={-180} max={180} suffix="°" onChange={setVectorAngle}/><Slider label="|x|" value={length} min={.35} max={1.5} step={.01} onChange={setLength}/></div>
    <div className="quaternion-readout"><code>R = ba = cos α − e₁₂ sin α</code><code>x″ = R x R̃ &nbsp;·&nbsp; physical angle = 2α</code></div>
  </LabFrame>;
}

type RotorObject='vector'|'bivector'|'trivector';
export function RotorActionLab(){
  const [angle,setAngle]=useState(74),[azimuth,setAzimuth]=useState(32),[elevation,setElevation]=useState(38),[object,setObject]=useState<RotorObject>('vector');
  const az=toRad(azimuth),el=toRad(elevation),axis:Vec3=[Math.cos(el)*Math.cos(az),Math.cos(el)*Math.sin(az),Math.sin(el)],rotation=toRad(angle);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const center=[width*.5,height*.56] as const,scale=Math.min(width,height)*.23;drawAxes3D(ctx,center,scale*.72);drawProjectedArrow(ctx,[axis[0]*1.45,axis[1]*1.45,axis[2]*1.45],center,scale,'#b69bf2','axis',true);
    if(object==='vector'){const v:Vec3=[1,.35,.28],rv=rotateAroundAxis(v,axis,rotation);drawProjectedArrow(ctx,v,center,scale,'rgba(239,189,85,.5)','v',true);drawProjectedArrow(ctx,rv,center,scale,'#4bdab0','RvR̃');}
    if(object==='bivector'){const u:Vec3=[.95,0,.15],v:Vec3=[0,.82,.38],ru=rotateAroundAxis(u,axis,rotation),rv=rotateAroundAxis(v,axis,rotation);const plane=(a:Vec3,b:Vec3,color:string)=>{const points:Vec3[]=[[0,0,0],a,[a[0]+b[0],a[1]+b[1],a[2]+b[2]],b];ctx.beginPath();points.forEach((p,i)=>{const q=projectIso(p,center[0],center[1],scale);if(i===0)ctx.moveTo(...q);else ctx.lineTo(...q);});ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=color.replace('.12','.7');ctx.stroke();};plane(u,v,'rgba(239,189,85,.12)');plane(ru,rv,'rgba(75,218,176,.22)');}
    if(object==='trivector'){const verts:Vec3[]=[];for(let i=0;i<8;i++)verts.push([(i&1)?.5:-.5,(i&2)?.5:-.5,(i&4)?.5:-.5]);const rotated=verts.map(v=>rotateAroundAxis(v,axis,rotation));for(let i=0;i<8;i++)for(let bit=0;bit<3;bit++){const j=i^(1<<bit);if(j<i)continue;const p=projectIso(rotated[i],center[0],center[1],scale),q=projectIso(rotated[j],center[0],center[1],scale);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.strokeStyle=['#efbd55','#4bdab0','#b69bf2'][bit];ctx.lineWidth=2;ctx.stroke();}}
    ctx.fillStyle='#9aa9a8';ctx.font='10px ui-monospace, monospace';ctx.fillText(`sandwich preserves grade ${object==='vector'?1:object==='bivector'?2:3}`,20,23);
  };
  const grade=object==='vector'?1:object==='bivector'?2:3;
  return <LabFrame title="同一个 rotor 作用于向量、平面和体积" tag="LAB · ROTOR SANDWICH" metrics={[["object",object],["grade",`${grade} → ${grade}`],["R R̃",'1.000']] }>
    <InteractiveCanvas draw={draw} dependencies={[angle,azimuth,elevation,object]} label="同一 GA rotor 夹心作用于不同 grade 对象实验" />
    <div className="operation-tabs rotor-object-tabs">{(['vector','bivector','trivector'] as RotorObject[]).map(key=><button key={key} className={object===key?'active':''} onClick={()=>setObject(key)}><b>{key}</b><span>grade {key==='vector'?1:key==='bivector'?2:3}</span></button>)}</div>
    <div className="lab-controls"><Slider label="物理旋转角 θ" value={angle} min={-180} max={180} suffix="°" onChange={setAngle}/><Slider label="旋转轴方位" value={azimuth} min={-180} max={180} suffix="°" onChange={setAzimuth}/><Slider label="旋转轴仰角" value={elevation} min={-85} max={85} suffix="°" onChange={setElevation}/></div>
  </LabFrame>;
}

export function BivectorExpLogLab(){
  const [angle,setAngle]=useState(210),[terms,setTerms]=useState(5),half=toRad(angle)/2;
  let scalar=0,bivector=0,termScalar=1,termBivector=0;
  for(let k=0;k<=terms;k++){if(k>0){const nextScalar=termBivector*half, nextBivector=-termScalar*half;termScalar=nextScalar/k;termBivector=nextBivector/k;}scalar+=termScalar;bivector+=termBivector;}
  const exactScalar=Math.cos(half),exactBivector=-Math.sin(half),error=Math.hypot(scalar-exactScalar,bivector-exactBivector),shortAngle=((angle+180)%360+360)%360-180;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const cx=width*.5,cy=height*.55,radius=Math.min(width,height)*.27;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.strokeStyle='rgba(210,222,219,.3)';ctx.stroke();ctx.beginPath();ctx.moveTo(cx-radius*1.2,cy);ctx.lineTo(cx+radius*1.2,cy);ctx.moveTo(cx,cy-radius*1.2);ctx.lineTo(cx,cy+radius*1.2);ctx.strokeStyle='rgba(210,222,219,.18)';ctx.stroke();
    const exact=[cx+exactScalar*radius,cy-exactBivector*radius] as const,approx=[cx+scalar*radius,cy-bivector*radius] as const;drawArrow2D(ctx,cx,cy,...exact,'#4bdab0','exp exact');drawArrow2D(ctx,cx,cy,...approx,'#b69bf2','Taylor',true);ctx.beginPath();ctx.moveTo(...exact);ctx.lineTo(...approx);ctx.strokeStyle='#f07f63';ctx.setLineDash([3,4]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#9cabaa';ctx.font='10px ui-monospace, monospace';ctx.fillText('scalar',width-72,cy-8);ctx.fillText('B coefficient',cx+8,22);
  };
  return <LabFrame title="双向量指数沿 rotor 单位圆前进" tag="LAB · BIVECTOR EXP / LOG" metrics={[["exact R",`${exactScalar.toFixed(3)} ${exactBivector<0?'−':'+'} ${Math.abs(exactBivector).toFixed(3)}B`],["series error",error.toExponential(2)],["short log",`${shortAngle}°`]]}>
    <InteractiveCanvas draw={draw} dependencies={[angle,terms]} label="双向量指数 Taylor 展开与 rotor 对数分支实验" />
    <div className="lab-controls"><Slider label="物理角 θ" value={angle} min={-540} max={540} suffix="°" onChange={setAngle}/><Slider label="Taylor 最高阶" value={terms} min={0} max={14} onChange={setTerms}/></div>
    <div className="quaternion-readout"><code>R = exp(−Bθ/2) = cos(θ/2) − B sin(θ/2)</code><code>principal physical log representative = {shortAngle}°</code></div>
  </LabFrame>;
}

export function RotorInterpolationLab(){
  const [targetAngle,setTargetAngle]=useState(145),[t,setT]=useState(.38),[azimuth,setAzimuth]=useState(42),[longPath,setLongPath]=useState(false);
  const axis:Vec3=[Math.cos(toRad(azimuth)),Math.sin(toRad(azimuth)),.32],norm=Math.hypot(...axis),n:Vec3=[axis[0]/norm,axis[1]/norm,axis[2]/norm],effectiveAngle=longPath?targetAngle-360:targetAngle,currentAngle=effectiveAngle*t;
  const source:Vec3=[1,.2,.15],rotated=rotateAroundAxis(source,n,toRad(currentAngle));
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const center=[width*.5,height*.56] as const,scale=Math.min(width,height)*.24;drawAxes3D(ctx,center,scale*.7);drawProjectedArrow(ctx,[n[0]*1.45,n[1]*1.45,n[2]*1.45],center,scale,'#b69bf2','B*',true);drawProjectedArrow(ctx,source,center,scale,'rgba(239,189,85,.5)','X₀',true);
    ctx.beginPath();for(let i=0;i<=80;i++){const v=rotateAroundAxis(source,n,toRad(effectiveAngle*i/80)),p=projectIso(v,center[0],center[1],scale);if(i===0)ctx.moveTo(...p);else ctx.lineTo(...p);}ctx.strokeStyle=longPath?'rgba(240,127,99,.65)':'rgba(75,218,176,.55)';ctx.lineWidth=2;ctx.stroke();drawProjectedArrow(ctx,rotated,center,scale,longPath?'#f07f63':'#4bdab0','R(t)X');
  };
  return <LabFrame title="在相对 rotor 的 log 空间中按弧长插值" tag="LAB · ROTOR INTERPOLATION" metrics={[["path",longPath?'long representative':'short representative'],["θ(t)",`${currentAngle.toFixed(1)}°`],["speed",`${Math.abs(effectiveAngle).toFixed(1)}° / t`]]}>
    <InteractiveCanvas draw={draw} dependencies={[targetAngle,t,azimuth,longPath]} label="Rotor 指数对数插值的长短路径实验" />
    <div className="lab-controls rotor-interp-controls"><Slider label="终点姿态角" value={targetAngle} min={20} max={170} suffix="°" onChange={setTargetAngle}/><Slider label="插值参数 t" value={t} min={0} max={1} step={.01} onChange={setT}/><Slider label="旋转平面方位" value={azimuth} min={-180} max={180} suffix="°" onChange={setAzimuth}/><button className={longPath?'active danger':''} onClick={()=>setLongPath(value=>!value)}>{longPath?'使用 −R 代表：长弧':'使用 R 代表：最短弧'}</button></div>
    <div className="quaternion-readout"><code>R(t)=R₀ exp(t log(R̃₀R₁))</code><code>endpoint representatives R₁ and −R₁ produce the same final orientation</code></div>
  </LabFrame>;
}

export function FourDRotationLab(){
  const [angleXY,setAngleXY]=useState(52),[angleZW,setAngleZW]=useState(-31),[depth,setDepth]=useState(.58);
  const a=toRad(angleXY),b=toRad(angleZW),vertices:number[][]=[];for(let i=0;i<16;i++)vertices.push([(i&1)?1:-1,(i&2)?1:-1,(i&4)?1:-1,(i&8)?1:-1]);
  const rotated=vertices.map(([x,y,z,w])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a),z*Math.cos(b)-w*Math.sin(b),z*Math.sin(b)+w*Math.cos(b)]);
  const kind=Math.abs(angleXY)<1||Math.abs(angleZW)<1?'simple rotation':Math.abs(Math.abs(angleXY)-Math.abs(angleZW))<1?'isoclinic':'double rotation';
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const cx=width*.5,cy=height*.54,scale=Math.min(width,height)*.105,project=([x,y,z,w]:number[])=>[cx+(x+depth*z+.28*w)*scale,cy-(y+.32*z-.48*w)*scale] as const;
    for(let i=0;i<16;i++)for(let bit=0;bit<4;bit++){const j=i^(1<<bit);if(j<i)continue;const p=project(rotated[i]),q=project(rotated[j]);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.strokeStyle=['#efbd55','#4bdab0','#b69bf2','#f07f63'][bit];ctx.globalAlpha=.68;ctx.lineWidth=1.5;ctx.stroke();}ctx.globalAlpha=1;for(const v of rotated){const p=project(v);ctx.beginPath();ctx.arc(...p,2.5,0,Math.PI*2);ctx.fillStyle='#d8e3e0';ctx.fill();}ctx.fillStyle='#9aaba9';ctx.font='10px ui-monospace, monospace';ctx.fillText('4D tesseract projected to 2D',20,23);ctx.fillText('XY plane · mint/yellow   ZW plane · violet/coral',20,height-18);
  };
  return <LabFrame title="四维旋转通常同时发生在两个独立平面" tag="LAB · 4D DOUBLE ROTATION" metrics={[["θXY",`${angleXY}°`],["θZW",`${angleZW}°`],["class",kind]]}>
    <InteractiveCanvas draw={draw} dependencies={[angleXY,angleZW,depth]} label="四维超立方体在 XY 与 ZW 平面的双旋转投影" />
    <div className="lab-controls"><Slider label="XY 平面角" value={angleXY} min={-180} max={180} suffix="°" onChange={setAngleXY}/><Slider label="ZW 平面角" value={angleZW} min={-180} max={180} suffix="°" onChange={setAngleZW}/><Slider label="4D 投影深度" value={depth} min={.1} max={1} step={.01} onChange={setDepth}/></div>
  </LabFrame>;
}

type Vec2 = readonly [number, number];

function reflect2D([x,y]:Vec2,mirrorAngle:number):Vec2{
  const c=Math.cos(2*mirrorAngle),s=Math.sin(2*mirrorAngle);
  return [c*x+s*y,s*x-c*y];
}

export function PinSpinCoverLab(){
  const [factorCount,setFactorCount]=useState(2),[mirrorGap,setMirrorGap]=useState(31),[representativeSign,setRepresentativeSign]=useState<1|-1>(1);
  const base=-toRad(mirrorGap)*(factorCount-1)/2,mirrors=Array.from({length:factorCount},(_,index)=>base+index*toRad(mirrorGap));
  const transform=(input:Vec2)=>mirrors.reduce((value,angle)=>reflect2D(value,angle),input);
  const xPrime=transform([1,0]),yPrime=transform([0,1]),det=xPrime[0]*yPrime[1]-xPrime[1]*yPrime[0],isSpin=factorCount%2===0;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const cx=width*.43,cy=height*.58,unit=Math.min(width,height)*.24,lineLength=Math.max(width,height)*.8;
    mirrors.forEach((angle,index)=>{ctx.beginPath();ctx.moveTo(cx-lineLength*Math.cos(angle),cy+lineLength*Math.sin(angle));ctx.lineTo(cx+lineLength*Math.cos(angle),cy-lineLength*Math.sin(angle));ctx.strokeStyle=`rgba(${index%2?'75,218,176':'182,155,242'},${.18+index*.08})`;ctx.lineWidth=1.2;ctx.stroke();});
    drawArrow2D(ctx,cx,cy,cx+unit,cy,'rgba(239,189,85,.38)','e₁',true);drawArrow2D(ctx,cx,cy,cx,cy-unit,'rgba(182,155,242,.38)','e₂',true);
    drawArrow2D(ctx,cx,cy,cx+xPrime[0]*unit,cy-xPrime[1]*unit,'#efbd55','ρ(V)e₁');drawArrow2D(ctx,cx,cy,cx+yPrime[0]*unit,cy-yPrime[1]*unit,'#4bdab0','ρ(V)e₂');
    const diagramX=width*.78,top=height*.18,row=height*.12;ctx.textAlign='center';ctx.font='11px ui-monospace, monospace';
    const node=(y:number,label:string,active:boolean)=>{ctx.fillStyle=active?'rgba(75,218,176,.16)':'rgba(216,227,224,.07)';ctx.strokeStyle=active?'#4bdab0':'rgba(216,227,224,.24)';ctx.lineWidth=1;ctx.fillRect(diagramX-58,y-17,116,34);ctx.strokeRect(diagramX-58,y-17,116,34);ctx.fillStyle=active?'#8fe5cd':'#a8b7b4';ctx.fillText(label,diagramX,y+4);};
    node(top,'Pin(2)',!isSpin);node(top+row,'O(2)',!isSpin);node(top+2.35*row,'Spin(2)',isSpin);node(top+3.35*row,'SO(2)',isSpin);
    ctx.strokeStyle='rgba(216,227,224,.35)';ctx.beginPath();ctx.moveTo(diagramX,top+18);ctx.lineTo(diagramX,top+row-18);ctx.moveTo(diagramX,top+2.35*row+18);ctx.lineTo(diagramX,top+3.35*row-18);ctx.stroke();ctx.fillStyle='#7e918d';ctx.font='9px ui-monospace, monospace';ctx.fillText('2 : 1',diagramX+29,top+row*.52);ctx.fillText('2 : 1',diagramX+29,top+row*2.87);ctx.textAlign='left';
    ctx.fillStyle='#9baba8';ctx.fillText(`${representativeSign>0?'V':'−V'} gives the same frame`,20,23);
  };
  return <LabFrame title="反射因子的奇偶性决定落在 Pin 还是 Spin" tag="LAB · PIN / SPIN COVER" metrics={[["factors",String(factorCount)],["det ρ(V)",det.toFixed(0)],["domain",isSpin?'Spin(2) ⊂ Pin(2)':'Pin(2) \\ Spin(2)']] }>
    <InteractiveCanvas draw={draw} dependencies={[factorCount,mirrorGap,representativeSign]} label="Pin 与 Spin 群覆盖正交群的反射复合实验" />
    <div className="lab-controls covering-controls"><Slider label="反射因子数 k" value={factorCount} min={1} max={4} onChange={value=>setFactorCount(Math.round(value))}/><Slider label="相邻镜面夹角" value={mirrorGap} min={-70} max={70} suffix="°" onChange={setMirrorGap}/><button className={representativeSign<0?'active danger':''} onClick={()=>setRepresentativeSign(value=>value===1?-1:1)}>{representativeSign>0?'当前代表：V':'当前代表：−V'}</button></div>
    <div className="quaternion-readout"><code>ρ(V)(x) = (−1)ᵏ V x V⁻¹</code><code>det ρ(V) = (−1)ᵏ = {det.toFixed(0)} &nbsp;·&nbsp; ρ(V) = ρ(−V)</code></div>
  </LabFrame>;
}

function expRotationVector(vector:Vec3,input:Vec3):Vec3{
  const angle=Math.hypot(...vector);if(angle<1e-9)return input;
  return rotateAroundAxis(input,[vector[0]/angle,vector[1]/angle,vector[2]/angle],angle);
}

export function LieAlgebraLab(){
  const [alpha,setAlpha]=useState(24),[beta,setBeta]=useState(31),[scale,setScale]=useState(1);
  const a=toRad(alpha)*scale,b=toRad(beta)*scale,source:Vec3=[.78,.5,.34];
  const afterA=rotateAroundAxis(source,[1,0,0],a),exact=rotateAroundAxis(afterA,[0,1,0],b),sum=expRotationVector([a,b,0],source),bch=expRotationVector([a,b,-a*b/2],source);
  const distance=(u:Vec3,v:Vec3)=>Math.hypot(u[0]-v[0],u[1]-v[1],u[2]-v[2]),sumError=distance(sum,exact),bchError=distance(bch,exact);
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const center=[width*.48,height*.58] as const,unit=Math.min(width,height)*.24;drawAxes3D(ctx,center,unit*.72);
    drawProjectedArrow(ctx,source,center,unit,'rgba(216,227,224,.38)','x',true);drawProjectedArrow(ctx,exact,center,unit,'#4bdab0','exact');drawProjectedArrow(ctx,sum,center,unit,'#f07f63','A+B',true);drawProjectedArrow(ctx,bch,center,unit,'#b69bf2','BCH₂',true);
    ctx.fillStyle='#9aaba8';ctx.font='10px ui-monospace, monospace';ctx.fillText('exp(B) exp(A) compared with one exponential',20,23);
    const x=width-154,y=height-82,w=112;ctx.fillStyle='rgba(216,227,224,.07)';ctx.fillRect(x,y,w,48);ctx.fillStyle='#829692';ctx.fillText('missing bracket',x+9,y+16);ctx.fillStyle='#f07f63';ctx.fillRect(x+9,y+26,Math.min(92,sumError*180),4);ctx.fillStyle='#b69bf2';ctx.fillRect(x+9,y+36,Math.min(92,bchError*180),4);
  };
  return <LabFrame title="BCH 用交换子修正“小旋转直接相加”的误差" tag="LAB · LIE ALGEBRA / BCH" metrics={[["|A+B error|",sumError.toExponential(2)],["|BCH₂ error|",bchError.toExponential(2)],["½[B,A] z",(-a*b/2).toFixed(3)]]}>
    <InteractiveCanvas draw={draw} dependencies={[alpha,beta,scale]} label="两个小旋转的精确复合、线性和与二阶 BCH 对照实验" />
    <div className="lab-controls"><Slider label="A：绕 x 的角" value={alpha} min={-55} max={55} suffix="°" onChange={setAlpha}/><Slider label="B：绕 y 的角" value={beta} min={-55} max={55} suffix="°" onChange={setBeta}/><Slider label="共同小量尺度 ε" value={scale} min={.05} max={1} step={.01} onChange={setScale}/></div>
    <div className="quaternion-readout"><code>log(exp B exp A) = A + B + ½[B,A] + O(ε³)</code><code>[B,A] points along −z for this order &nbsp;·&nbsp; noncommutativity enters at O(ε²)</code></div>
  </LabFrame>;
}
