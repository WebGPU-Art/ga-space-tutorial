'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid, toRad } from './drawing';
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
