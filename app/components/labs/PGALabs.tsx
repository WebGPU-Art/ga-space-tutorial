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

type PrimitiveMode='point'|'line'|'ideal-point'|'ideal-line';

function canvasToWorld(pointer:{x:number;y:number;width:number;height:number},factor=.19):Point2{
  const cx=pointer.width*.5,cy=pointer.height*.55,unit=Math.min(pointer.width,pointer.height)*factor;
  return [Math.max(-2.25,Math.min(2.25,(pointer.x-cx)/unit)),Math.max(-2.25,Math.min(2.25,(cy-pointer.y)/unit))];
}

export function PGAPrimitiveInspectorLab(){
  const [mode,setMode]=useState<PrimitiveMode>('point'),[position,setPosition]=useState<Point2>([.72,-.46]),[angle,setAngle]=useState(34);
  const theta=toRad(angle),normal:Point2=[Math.cos(theta),Math.sin(theta)],c=-(normal[0]*position[0]+normal[1]*position[1]);
  const data:{grade:string;square:string;coords:string;kind:string}=mode==='point'
    ?{grade:'2',square:'−1',coords:`${position[0].toFixed(2)}e₂₀ ${position[1]<0?'−':'+'} ${Math.abs(position[1]).toFixed(2)}e₀₁ + e₁₂`,kind:'Euclidean point'}
    :mode==='line'?{grade:'1',square:'＋1',coords:`${normal[0].toFixed(2)}e₁ ${normal[1]<0?'−':'+'} ${Math.abs(normal[1]).toFixed(2)}e₂ ${c<0?'−':'+'} ${Math.abs(c).toFixed(2)}e₀`,kind:'Euclidean line'}
    :mode==='ideal-point'?{grade:'2',square:'0',coords:`${Math.cos(theta).toFixed(2)}e₂₀ ${Math.sin(theta)<0?'−':'+'} ${Math.abs(Math.sin(theta)).toFixed(2)}e₀₁`,kind:'ideal point / direction'}
    :{grade:'1',square:'0',coords:'e₀',kind:'ideal line ω'};
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.55,unit=Math.min(width,height)*.19,range=2.25;
    ctx.strokeStyle='rgba(216,227,224,.18)';ctx.beginPath();ctx.moveTo(cx-range*unit,cy);ctx.lineTo(cx+range*unit,cy);ctx.moveTo(cx,cy-range*unit);ctx.lineTo(cx,cy+range*unit);ctx.stroke();ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('click or drag to place the active primitive',20,23);
    if(mode==='point'){const px=cx+position[0]*unit,py=cy-position[1]*unit;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,py);ctx.lineTo(cx,py);ctx.strokeStyle='rgba(239,189,85,.35)';ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();ctx.fillStyle='#efbd55';ctx.fillText('P · grade 2',px+12,py-9);}
    if(mode==='line'){drawWorldLine(ctx,[normal[0],normal[1],c],cx,cy,unit,range,'#4bdab0','ℓ · grade 1');const px=cx+position[0]*unit,py=cy-position[1]*unit;ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle='#efbd55';ctx.fill();drawArrow2D(ctx,px,py,px+normal[0]*55,py-normal[1]*55,'#b69bf2','normal');}
    if(mode==='ideal-point'){drawArrow2D(ctx,cx,cy,cx+Math.cos(theta)*unit*1.55,cy-Math.sin(theta)*unit*1.55,'#efbd55','P∞ · direction');ctx.beginPath();ctx.arc(cx,cy,unit*1.72,-theta-.15,-theta+.15);ctx.strokeStyle='rgba(239,189,85,.38)';ctx.stroke();}
    if(mode==='ideal-line'){ctx.fillStyle='rgba(182,155,242,.11)';ctx.fillRect(0,0,width,32);ctx.fillRect(0,height-32,width,32);ctx.strokeStyle='#b69bf2';ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(0,32);ctx.lineTo(width,32);ctx.moveTo(0,height-32);ctx.lineTo(width,height-32);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#b69bf2';ctx.fillText('ω=e₀ · the projective boundary, not a finite drawable line',20,height*.52);}
  };
  const onPointer=(pointer:{x:number;y:number;width:number;height:number;phase:string})=>{if(pointer.phase==='up')return;const world=canvasToWorld(pointer);if(mode==='point'||mode==='line')setPosition(world);if(mode==='ideal-point')setAngle(Math.atan2(world[1],world[0])*180/Math.PI);};
  return <LabFrame title="选择一个 PGA blade，并把坐标、grade 与几何对象对齐" tag="LAB · PGA PRIMITIVE INSPECTOR" metrics={[["grade",data.grade],["square",data.square],["kind",data.kind]]}>
    <InteractiveCanvas draw={draw} dependencies={[mode,position,angle]} onPointer={onPointer} label="可点击拖动的二维 PGA 点线与理想元素检查器" />
    <div className="operation-tabs primitive-tabs"><button className={mode==='point'?'active':''} onClick={()=>setMode('point')}><b>P</b><span>有限点 · grade 2</span></button><button className={mode==='line'?'active':''} onClick={()=>setMode('line')}><b>ℓ</b><span>有限线 · grade 1</span></button><button className={mode==='ideal-point'?'active':''} onClick={()=>setMode('ideal-point')}><b>P∞</b><span>方向 · grade 2</span></button><button className={mode==='ideal-line'?'active':''} onClick={()=>setMode('ideal-line')}><b>ω</b><span>理想线 · grade 1</span></button></div>
    {(mode==='line'||mode==='ideal-point')&&<div className="lab-controls one-slider"><Slider label={mode==='line'?'直线法向角':'理想方向角'} value={angle} min={-180} max={180} suffix="°" onChange={setAngle}/></div>}
    <div className="quaternion-readout"><code>{data.coords}</code><code>dual PGA dictionary: hyperplanes are 1-vectors · intersections raise grade</code></div>
  </LabFrame>;
}

type DragTarget='A'|'B'|'X';
export function PGAIncidenceMetricLab(){
  const [aPoint,setAPoint]=useState<Point2>([-1.05,-.62]),[bPoint,setBPoint]=useState<Point2>([.92,.72]),[testPoint,setTestPoint]=useState<Point2>([.88,-.78]),[active,setActive]=useState<DragTarget>('A'),[testAngle,setTestAngle]=useState(112);
  const dx=bPoint[0]-aPoint[0],dy=bPoint[1]-aPoint[1],distance=Math.hypot(dx,dy),valid=distance>1e-5;
  const line:Line=valid?[(aPoint[1]-bPoint[1])/distance,(bPoint[0]-aPoint[0])/distance,(aPoint[0]*bPoint[1]-aPoint[1]*bPoint[0])/distance]:[0,0,0];
  const ma=Math.cos(toRad(testAngle)),mb=Math.sin(toRad(testAngle)),mc=-(ma*testPoint[0]+mb*testPoint[1]),angle=valid?Math.atan2(line[0]*mb-line[1]*ma,line[0]*ma+line[1]*mb)*180/Math.PI:0,signedDistance=valid?line[0]*testPoint[0]+line[1]*testPoint[1]+line[2]:0;
  const meetWeight=line[0]*mb-line[1]*ma,meetX=line[1]*mc-line[2]*mb,meetY=line[2]*ma-line[0]*mc,intersection=Math.abs(meetWeight)>1e-4?[meetX/meetWeight,meetY/meetWeight] as Point2:null;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.55,unit=Math.min(width,height)*.18,range=2.35;
    ctx.strokeStyle='rgba(216,227,224,.18)';ctx.beginPath();ctx.moveTo(cx-range*unit,cy);ctx.lineTo(cx+range*unit,cy);ctx.moveTo(cx,cy-range*unit);ctx.lineTo(cx,cy+range*unit);ctx.stroke();
    if(valid)drawWorldLine(ctx,line,cx,cy,unit,range,'#4bdab0','ℓ=A∨B');drawWorldLine(ctx,[ma,mb,mc],cx,cy,unit,range,'#b69bf2','m');
    const point=(value:Point2,label:string,color:string,selected:boolean)=>{const px=cx+value[0]*unit,py=cy-value[1]*unit;ctx.beginPath();ctx.arc(px,py,selected?9:7,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(selected){ctx.strokeStyle='#fff5d6';ctx.lineWidth=2;ctx.stroke();}ctx.fillStyle=color;ctx.font='11px ui-monospace, monospace';ctx.fillText(label,px+11,py-9);};
    point(aPoint,'A','#efbd55',active==='A');point(bPoint,'B','#efbd55',active==='B');point(testPoint,'X','#f07f63',active==='X');
    if(valid){const foot:Point2=[testPoint[0]-signedDistance*line[0],testPoint[1]-signedDistance*line[1]];ctx.beginPath();ctx.moveTo(cx+testPoint[0]*unit,cy-testPoint[1]*unit);ctx.lineTo(cx+foot[0]*unit,cy-foot[1]*unit);ctx.strokeStyle='rgba(240,127,99,.75)';ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);}
    if(intersection&&Math.abs(intersection[0])<range&&Math.abs(intersection[1])<range){ctx.beginPath();ctx.arc(cx+intersection[0]*unit,cy-intersection[1]*unit,5,0,Math.PI*2);ctx.fillStyle='#d8e3e0';ctx.fill();ctx.fillStyle='#d8e3e0';ctx.fillText('ℓ∧m',cx+intersection[0]*unit+8,cy-intersection[1]*unit+15);}
    ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('select A, B, or X below, then drag it in the canvas',20,23);
  };
  const move=(pointer:{x:number;y:number;width:number;height:number;phase:string})=>{if(pointer.phase==='up')return;const world=canvasToWorld(pointer,.18);if(active==='A')setAPoint(world);if(active==='B')setBPoint(world);if(active==='X')setTestPoint(world);};
  return <LabFrame title="同一组点线同时产生 join、meet、距离、角度与关联残差" tag="LAB · INCIDENCE + METRIC" metrics={[["‖A∨B‖",distance.toFixed(3)],["d(X,ℓ)",signedDistance.toFixed(3)],["angle(ℓ,m)",`${angle.toFixed(1)}°`]]}>
    <InteractiveCanvas draw={draw} dependencies={[aPoint,bPoint,testPoint,active,testAngle]} onPointer={move} label="可拖动点的 PGA 连接相交距离角度综合实验" />
    <div className="operation-tabs incidence-targets">{(['A','B','X'] as DragTarget[]).map(target=><button key={target} className={active===target?'active':''} onClick={()=>setActive(target)}><b>{target}</b><span>{target==='X'?'测试点与直线 m':'定义 join 直线 ℓ'}</span></button>)}</div>
    <div className="lab-controls one-slider"><Slider label="测试线 m 的法向角" value={testAngle} min={-180} max={180} suffix="°" onChange={setTestAngle}/></div>
    <div className="quaternion-readout"><code>ℓ=A∨B &nbsp;·&nbsp; ‖ℓ‖=distance(A,B) for normalized points</code><code>ℓ∧m = intersection &nbsp;·&nbsp; ℓ∧X = d_signed(X,ℓ) I</code></div>
  </LabFrame>;
}

type NormMode='euclidean-point'|'ideal-point'|'euclidean-line'|'ideal-line';
export function PGANormalizationLab(){
  const [mode,setMode]=useState<NormMode>('euclidean-point'),[weight,setWeight]=useState(1.7),[angle,setAngle]=useState(38),[offset,setOffset]=useState(.62);
  const theta=toRad(angle),isIdeal=mode.startsWith('ideal'),isPoint=mode.endsWith('point'),magnitude=Math.abs(weight),valid=magnitude>1e-6;
  const bulkNorm=isIdeal?0:magnitude,idealNorm=isIdeal?magnitude:NaN,normalizedWeight=valid?(weight<0?-1:1):0;
  const pointY=-weight*.42;
  const coords=mode==='euclidean-point'?`${(weight*.75).toFixed(2)}e₂₀ ${pointY<0?'−':'+'} ${Math.abs(pointY).toFixed(2)}e₀₁ ${weight<0?'−':'+'} ${magnitude.toFixed(2)}e₁₂`
    :mode==='ideal-point'?`${(weight*Math.cos(theta)).toFixed(2)}e₂₀ ${weight*Math.sin(theta)<0?'−':'+'} ${Math.abs(weight*Math.sin(theta)).toFixed(2)}e₀₁`
    :mode==='euclidean-line'?`${(weight*Math.cos(theta)).toFixed(2)}e₁ ${weight*Math.sin(theta)<0?'−':'+'} ${Math.abs(weight*Math.sin(theta)).toFixed(2)}e₂ ${-weight*offset<0?'−':'+'} ${Math.abs(weight*offset).toFixed(2)}e₀`
    :`${weight.toFixed(2)}e₀`;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const split=width*.66,cx=split*.48,cy=height*.57,unit=Math.min(split,height)*.19,range=2.25,color=weight<0?'#f07f63':'#4bdab0';ctx.beginPath();ctx.moveTo(split,28);ctx.lineTo(split,height-28);ctx.strokeStyle='rgba(216,227,224,.2)';ctx.stroke();
    ctx.strokeStyle='rgba(216,227,224,.16)';ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(split-20,cy);ctx.moveTo(cx,45);ctx.lineTo(cx,height-30);ctx.stroke();ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('PROJECTIVE SUPPORT',20,23);ctx.fillText('NORM ROUTING',split+18,23);
    if(!valid){ctx.fillStyle='#f07f63';ctx.font='13px ui-monospace, monospace';ctx.fillText('λ=0 is not a projective representative',cx-145,cy);}
    else if(mode==='euclidean-point'){const px=cx+.75*unit,py=cy+.42*unit;ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.fillStyle=color;ctx.fillText(weight<0?'−P · reversed orientation':'P · positive orientation',px+11,py-8);}
    else if(mode==='ideal-point'){drawArrow2D(ctx,cx,cy,cx+Math.cos(theta)*unit*1.5,cy-Math.sin(theta)*unit*1.5,color,'P∞');}
    else if(mode==='euclidean-line'){drawWorldLine(ctx,[Math.cos(theta),Math.sin(theta),-offset],cx,cy,unit,range,color,'ℓ');drawArrow2D(ctx,cx+Math.cos(theta)*offset*unit,cy-Math.sin(theta)*offset*unit,cx+Math.cos(theta)*(offset+.55)*unit,cy-Math.sin(theta)*(offset+.55)*unit,color,weight<0?'−n':'n');}
    else {ctx.strokeStyle=color;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(25,42);ctx.lineTo(split-25,42);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=color;ctx.fillText(weight<0?'−ω':'ω',30,35);}
    const bx=split+22,bw=Math.max(30,width-split-48),bar=(y:number,label:string,value:number,colorValue:string)=>{ctx.fillStyle='#8da09c';ctx.fillText(label,bx,y);ctx.fillStyle='rgba(216,227,224,.09)';ctx.fillRect(bx,y+9,bw,8);ctx.fillStyle=colorValue;ctx.fillRect(bx,y+9,bw*Math.min(1,value/2.5),8);ctx.fillStyle=colorValue;ctx.fillText(value.toFixed(3),bx,y+34);};bar(height*.25,'bulk / Euclidean norm',bulkNorm,'#4bdab0');bar(height*.49,'ideal norm',Number.isNaN(idealNorm)?0:idealNorm,'#b69bf2');bar(height*.73,'|projective weight|',magnitude,'#efbd55');
  };
  const normalizer=!valid?'undefined':isIdeal?'ideal norm':'bulk norm';
  return <LabFrame title="先判定有限或理想，再选择能看见该元素的范数" tag="LAB · DEGENERATE NORMALIZATION" metrics={[["bulk norm",bulkNorm.toFixed(3)],["ideal norm",Number.isNaN(idealNorm)?'not used':idealNorm.toFixed(3)],["divide by",normalizer]]}>
    <InteractiveCanvas draw={draw} dependencies={[mode,weight,angle,offset]} label="PGA 有限元素与理想元素的两种范数和归一化实验" />
    <div className="operation-tabs norm-mode-tabs">{(['euclidean-point','ideal-point','euclidean-line','ideal-line'] as NormMode[]).map(key=><button key={key} className={mode===key?'active':''} onClick={()=>setMode(key)}><b>{key==='euclidean-point'?'P':key==='ideal-point'?'P∞':key==='euclidean-line'?'ℓ':'ω'}</b><span>{key.replace('-',' ')}</span></button>)}</div>
    <div className="lab-controls"><Slider label="代表权重 λ" value={weight} min={-2.5} max={2.5} step={.05} onChange={setWeight}/>{(mode==='ideal-point'||mode==='euclidean-line')&&<Slider label={isPoint?'理想方向':'直线法向'} value={angle} min={-180} max={180} suffix="°" onChange={setAngle}/>} {mode==='euclidean-line'&&<Slider label="直线有向距离" value={offset} min={-1.4} max={1.4} step={.01} onChange={setOffset}/>}</div>
    <div className="quaternion-readout"><code>{coords}</code><code>{valid?`normalized weight = ${normalizedWeight>0?'+1':'−1'} · geometry fixed, orientation ${weight<0?'reversed':'preserved'}`:'zero multivector cannot be normalized'}</code></div>
  </LabFrame>;
}

type TranslateObject='point'|'line'|'frame';
export function TranslatorExponentialLab(){
  const [tx,setTx]=useState(1.05),[ty,setTy]=useState(.58),[progress,setProgress]=useState(.72),[object,setObject]=useState<TranslateObject>('frame');
  const shift:Point2=[tx*progress,ty*progress],length=Math.hypot(...shift),source:Point2=[-.85,-.55],moved:Point2=[source[0]+shift[0],source[1]+shift[1]];
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height,34);const cx=width*.47,cy=height*.58,unit=Math.min(width,height)*.18,range=2.35,map=(point:Point2)=>[cx+point[0]*unit,cy-point[1]*unit] as const;
    ctx.strokeStyle='rgba(216,227,224,.16)';ctx.beginPath();ctx.moveTo(cx-range*unit,cy);ctx.lineTo(cx+range*unit,cy);ctx.moveTo(cx,cy-range*unit);ctx.lineTo(cx,cy+range*unit);ctx.stroke();drawArrow2D(ctx,...map(source),...map(moved),'rgba(239,189,85,.65)','s·t',true);
    if(object==='point'){for(let i=0;i<=8;i++){const q:Point2=[source[0]+shift[0]*i/8,source[1]+shift[1]*i/8],p=map(q);ctx.beginPath();ctx.arc(...p,i===8?8:3,0,Math.PI*2);ctx.fillStyle=i===8?'#4bdab0':'rgba(239,189,85,.45)';ctx.fill();}ctx.fillStyle='#4bdab0';ctx.fillText('T P T̃',map(moved)[0]+10,map(moved)[1]-8);}
    if(object==='line'){const angle=toRad(32),a=Math.cos(angle),b=Math.sin(angle),c=-(a*source[0]+b*source[1]),movedC=c-a*shift[0]-b*shift[1];drawWorldLine(ctx,[a,b,c],cx,cy,unit,range,'rgba(239,189,85,.42)','ℓ');drawWorldLine(ctx,[a,b,movedC],cx,cy,unit,range,'#4bdab0','TℓT̃');}
    if(object==='frame'){const shape:Point2[]=[[-1.25,-.88],[-.45,-.88],[-.45,-.1],[-1.25,-.88]],translated=shape.map(([x,y])=>[x+shift[0],y+shift[1]] as Point2),poly=(points:Point2[],color:string,dashed=false)=>{ctx.beginPath();points.forEach((point,index)=>index?ctx.lineTo(...map(point)):ctx.moveTo(...map(point)));ctx.strokeStyle=color;ctx.lineWidth=2;ctx.setLineDash(dashed?[5,5]:[]);ctx.stroke();ctx.setLineDash([]);};poly(shape,'rgba(239,189,85,.42)',true);poly(translated,'#4bdab0');drawArrow2D(ctx,...map(translated[0]),...map([translated[0][0]+.55,translated[0][1]]),'#efbd55','x');drawArrow2D(ctx,...map(translated[0]),...map([translated[0][0],translated[0][1]+.55]),'#b69bf2','y');}
    const panelX=width-192,panelY=42;ctx.fillStyle='rgba(216,227,224,.07)';ctx.fillRect(panelX,panelY,166,104);ctx.fillStyle='#8da09c';ctx.font='10px ui-monospace, monospace';ctx.fillText('EXPONENTIAL SERIES',panelX+12,panelY+18);ctx.fillStyle='#d8e3e0';ctx.fillText('1',panelX+12,panelY+43);ctx.fillStyle='#4bdab0';ctx.fillText('− sB / 2',panelX+12,panelY+66);ctx.fillStyle='#71837f';ctx.fillText('+ 0 + 0 + ⋯',panelX+12,panelY+89);ctx.strokeStyle='rgba(75,218,176,.45)';ctx.beginPath();ctx.moveTo(panelX+93,panelY+62);ctx.lineTo(panelX+145,panelY+62);ctx.stroke();
  };
  return <LabFrame title="理想双向量平方为零，所以 translator 的指数精确终止" tag="LAB · TRANSLATOR EXPONENTIAL" metrics={[["|s·t|",length.toFixed(3)],["B²",'0 exactly'],["T T̃",'1 exactly']] }>
    <InteractiveCanvas draw={draw} dependencies={[tx,ty,progress,object]} label="PGA 平移器指数和统一 sandwich 作用实验" />
    <div className="operation-tabs translator-tabs">{(['point','line','frame'] as TranslateObject[]).map(key=><button key={key} className={object===key?'active':''} onClick={()=>setObject(key)}><b>{key}</b><span>同一 translator sandwich</span></button>)}</div>
    <div className="lab-controls"><Slider label="平移 x 分量" value={tx} min={-1.8} max={1.8} step={.01} onChange={setTx}/><Slider label="平移 y 分量" value={ty} min={-1.4} max={1.4} step={.01} onChange={setTy}/><Slider label="路径参数 s" value={progress} min={0} max={1} step={.01} onChange={setProgress}/></div>
    <div className="quaternion-readout"><code>B=e₀(tₓe₁+tᵧe₂), B²=0 &nbsp;·&nbsp; T(s)=exp(−sB/2)=1−sB/2</code><code>X′=T X T̃ &nbsp;·&nbsp; this sign convention produces active translation by +s(tₓ,tᵧ)</code></div>
  </LabFrame>;
}
