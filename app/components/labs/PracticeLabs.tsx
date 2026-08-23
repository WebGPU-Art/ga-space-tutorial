'use client';

import { useMemo, useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid } from './drawing';
import { LabFrame, Slider } from './LabChrome';

const grade=(mask:number)=>{let n=mask,count=0;while(n){count+=n&1;n>>=1;}return count;};
const subs=['₁','₂','₃','₄'];
const bladeName=(mask:number)=>mask===0?'1':`e${[0,1,2,3].filter(i=>mask&(1<<i)).map(i=>subs[i]).join('')}`;
const binary=(mask:number)=>mask.toString(2).padStart(4,'0');
const gradeColors=['#91a3a0','#4bdab0','#b69bf2','#efbd55','#f07f63'];
const natural=Array.from({length:16},(_,i)=>i);
const graded=[...natural].sort((a,b)=>grade(a)-grade(b)||a-b);
const activity=[0,1,2,4,8,3,5,6,9,10,12,7,11,13,14,15];

export function DataLayoutLab(){
  const [selected,setSelected]=useState(3),[layout,setLayout]=useState<'binary'|'graded'|'sparse'>('binary'),[nonzero,setNonzero]=useState(6),active=activity.slice(0,nonzero),order=layout==='binary'?natural:layout==='graded'?graded:active;
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const pad=18,top=38,cols=4,rows=layout==='sparse'?Math.ceil(order.length/2):4,cellW=(width-pad*2)/(layout==='sparse'?2:cols),cellH=(height-top-20)/rows;ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText(layout==='binary'?'ARRAY INDEX = BITMASK':layout==='graded'?'GROUPED BY POPCOUNT / GRADE':'ONLY NONZERO (MASK, VALUE) PAIRS',pad,20);
    order.forEach((mask,index)=>{const c=layout==='sparse'?index%2:index%4,r=layout==='sparse'?Math.floor(index/2):Math.floor(index/4),x=pad+c*cellW,y=top+r*cellH,isActive=active.includes(mask),isSelected=mask===selected,color=gradeColors[grade(mask)];ctx.fillStyle=isSelected?'rgba(239,189,85,.18)':isActive?'rgba(75,218,176,.09)':'rgba(255,255,255,.025)';ctx.fillRect(x+3,y+3,cellW-6,cellH-6);ctx.strokeStyle=isSelected?'#efbd55':'rgba(216,227,224,.15)';ctx.lineWidth=isSelected?2:1;ctx.strokeRect(x+3.5,y+3.5,cellW-7,cellH-7);ctx.fillStyle=color;ctx.font='15px ui-monospace, monospace';ctx.fillText(bladeName(mask),x+13,y+25);ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText(`${binary(mask)} · g${grade(mask)}`,x+13,y+42);if(layout!=='sparse'){ctx.fillStyle=isActive?'#4bdab0':'rgba(145,163,160,.35)';ctx.fillText(isActive?'nonzero':'0',x+13,y+58);}else{ctx.fillStyle='#4bdab0';ctx.fillText(`{ mask:${mask}, value:c${mask} }`,x+13,y+58);}});
  };
  const pick=(p:CanvasPointer)=>{if(p.phase==='up')return;const pad=18,top=38,cols=layout==='sparse'?2:4,rows=layout==='sparse'?Math.ceil(order.length/2):4,cellW=(p.width-pad*2)/cols,cellH=(p.height-top-20)/rows,c=Math.floor((p.x-pad)/cellW),r=Math.floor((p.y-top)/cellH),index=layout==='sparse'?r*2+c:r*4+c;if(c>=0&&c<cols&&r>=0&&r<rows&&order[index]!==undefined)setSelected(order[index]);};
  const sparseWords=nonzero*2;
  return <LabFrame title="一个整数同时编码 blade 中有哪些基向量；popcount 直接给出 grade" tag="LAB · BASIS BLADE BITMASK" metrics={[["selected",`${bladeName(selected)} / ${binary(selected)}`],["grade",String(grade(selected))],["storage",layout==='sparse'?`${sparseWords} words`:'16 float slots']]}>
    <InteractiveCanvas draw={draw} dependencies={[selected,layout,nonzero]} onPointer={pick} label="切换多向量存储布局并点击检查 4D basis blade 的 bitmask 与 grade" />
    <div className="lab-controls"><Slider label="非零系数数量 nnz" value={nonzero} min={1} max={16} step={1} onChange={setNonzero}/></div>
    <div className="operation-tabs"><button onClick={()=>setLayout('binary')}><b>dense / binary</b><span>mask 直接作为数组下标</span></button><button onClick={()=>setLayout('graded')}><b>grade-grouped</b><span>便于逐 grade 批处理</span></button><button onClick={()=>setLayout('sparse')}><b>sparse pairs</b><span>只存 mask 与非零 value</span></button></div>
    <div className="operation-tabs">{[0,1,2,3].map(i=><button key={i} onClick={()=>setSelected(selected^(1<<i))}><b>toggle e{subs[i]}</b><span>bit {i}: {selected&(1<<i)?'on':'off'}</span></button>)}</div>
    <div className="quaternion-readout"><code>mask({bladeName(selected)})=0b{binary(selected)}={selected} &nbsp;·&nbsp; grade=popcount(mask)={grade(selected)}</code><code>dense: 2⁴=16 coefficients &nbsp;·&nbsp; sparse: 2×nnz={sparseWords} words &nbsp;·&nbsp; sparse wins here when nnz&lt;8</code></div>
  </LabFrame>;
}

const productSign=(a:number,b:number)=>{let swaps=0;for(let i=0;i<4;i++)if(a&(1<<i))swaps+=grade(b&((1<<i)-1));return swaps%2?-1:1;};
function basisProduct(a:number,b:number,metric:readonly number[]){let factor=productSign(a,b),overlap=a&b;for(let i=0;i<metric.length;i++)if(overlap&(1<<i))factor*=metric[i];return{mask:a^b,factor};}
const signedBlade=(factor:number,mask:number)=>factor===0?'0':`${factor<0?'−':''}${bladeName(mask)}`;

export function MultiplicationTableLab(){
  const [signature,setSignature]=useState<'euclidean'|'minkowski'|'degenerate'>('euclidean'),[left,setLeft]=useState(3),[right,setRight]=useState(6),metric=signature==='euclidean'?[1,1,1]:signature==='minkowski'?[1,1,-1]:[1,1,0],size=8,result=basisProduct(left,right,metric);
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const pad=46,top=35,cell=Math.min((width-pad-12)/(size+1),(height-top-12)/(size+1));ctx.font=`${Math.max(8,Math.min(11,cell*.3))}px ui-monospace, monospace`;for(let r=-1;r<size;r++)for(let c=-1;c<size;c++){const x=pad+(c+1)*cell,y=top+(r+1)*cell;if(r===-1&&c===-1)continue;if(r===-1||c===-1){const mask=r===-1?c:r;ctx.fillStyle='rgba(143,154,238,.11)';ctx.fillRect(x+1,y+1,cell-2,cell-2);ctx.fillStyle='#b6c3c0';ctx.fillText(bladeName(mask),x+5,y+cell*.62);continue;}const p=basisProduct(r,c,metric),selected=r===left&&c===right;ctx.fillStyle=selected?'rgba(239,189,85,.2)':p.factor===0?'rgba(240,127,99,.08)':'rgba(255,255,255,.025)';ctx.fillRect(x+1,y+1,cell-2,cell-2);ctx.strokeStyle=selected?'#efbd55':'rgba(216,227,224,.09)';ctx.strokeRect(x+1.5,y+1.5,cell-3,cell-3);ctx.fillStyle=p.factor===0?'#f07f63':gradeColors[grade(p.mask)];ctx.fillText(signedBlade(p.factor,p.mask),x+4,y+cell*.62);}};
  const pick=(p:CanvasPointer)=>{if(p.phase==='up')return;const pad=46,top=35,cell=Math.min((p.width-pad-12)/(size+1),(p.height-top-12)/(size+1)),c=Math.floor((p.x-pad)/cell)-1,r=Math.floor((p.y-top)/cell)-1;if(r>=0&&r<size&&c>=0&&c<size){setLeft(r);setRight(c);}};
  return <LabFrame title="metric 改变重复基向量的因子；XOR 目标与交换奇偶性保持同一算法" tag="LAB · GENERATED CAYLEY TABLE" metrics={[["selected",`${bladeName(left)} · ${bladeName(right)}`],["result",signedBlade(result.factor,result.mask)],["target mask",binary(result.mask).slice(1)]]}>
    <InteractiveCanvas draw={draw} dependencies={[signature,left,right]} onPointer={pick} label="点击三维 Clifford 代数乘法表，检查 bitmask、符号与 metric" />
    <div className="operation-tabs"><button onClick={()=>setSignature('euclidean')}><b>Cl(3,0)</b><span>e₁²=e₂²=e₃²=+1</span></button><button onClick={()=>setSignature('minkowski')}><b>Cl(2,1)</b><span>e₃²=−1</span></button><button onClick={()=>setSignature('degenerate')}><b>Cl(2,0,1)</b><span>e₃²=0，出现零因子</span></button></div>
    <div className="quaternion-readout"><code>target={left.toString(2).padStart(3,'0')} XOR {right.toString(2).padStart(3,'0')} = {result.mask.toString(2).padStart(3,'0')}</code><code>coefficient = reorderSign × ∏ metric[repeated bits] = {result.factor}</code></div>
  </LabFrame>;
}

type Rotor2=readonly[number,number];
function f32Rotor(count:number,step:number,normalizeEvery:number):Rotor2{let c=1,s=0,rc=Math.fround(Math.cos(step/2)),rs=Math.fround(Math.sin(step/2));for(let i=1;i<=count;i++){const nc=Math.fround(Math.fround(c*rc)-Math.fround(s*rs)),ns=Math.fround(Math.fround(c*rs)+Math.fround(s*rc));c=nc;s=ns;if(normalizeEvery>0&&i%normalizeEvery===0){const n=Math.hypot(c,s);c=Math.fround(c/n);s=Math.fround(s/n);}}return[c,s];}
const angleDistance=(a:number,b:number)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));

export function NumericalValidationLab(){
  const [count,setCount]=useState(24000),[stepDegrees,setStepDegrees]=useState(.73),[normalizeEvery,setNormalizeEvery]=useState(500),step=stepDegrees*Math.PI/180,raw=f32Rotor(count,step,0),stable=f32Rotor(count,step,normalizeEvery),rawNorm=raw[0]*raw[0]+raw[1]*raw[1],stableNorm=stable[0]*stable[0]+stable[1]*stable[1],idealAngle=(count*step)%(Math.PI*2),rawAngle=2*Math.atan2(raw[1],raw[0]),stableAngle=2*Math.atan2(stable[1],stable[0]);
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const centers:[[number,number],string,Rotor2,string][]=[[[width*.27,height*.54],'raw float32',raw,'#f07f63'],[[width*.73,height*.54],normalizeEvery?`renorm / ${normalizeEvery}`:'renorm disabled',stable,'#4bdab0']],r=Math.min(width,height)*.24;for(const [center,title,rotor,color] of centers){ctx.beginPath();ctx.arc(...center,r,0,Math.PI*2);ctx.strokeStyle='rgba(216,227,224,.18)';ctx.stroke();const theta=2*Math.atan2(rotor[1],rotor[0]),ideal:[number,number]=[center[0]+r*.8*Math.cos(idealAngle),center[1]-r*.8*Math.sin(idealAngle)],actual:[number,number]=[center[0]+r*.8*Math.cos(theta),center[1]-r*.8*Math.sin(theta)];drawArrow2D(ctx,...center,...ideal,'rgba(239,189,85,.52)','ideal',true);drawArrow2D(ctx,...center,...actual,color,'f32');ctx.fillStyle='#91a3a0';ctx.font='11px ui-monospace, monospace';ctx.fillText(title,center[0]-r,center[1]-r-14);const norm=rotor[0]*rotor[0]+rotor[1]*rotor[1];ctx.fillText(`RR̃−1 = ${(norm-1).toExponential(2)}`,center[0]-r,center[1]+r+22);}}
  return <LabFrame title="结构测试捕捉的是几何语义漂移，不只是某个样例输出是否接近" tag="LAB · FLOAT32 INVARIANTS" metrics={[["raw |RR̃−1|",Math.abs(rawNorm-1).toExponential(2)],["renorm |RR̃−1|",Math.abs(stableNorm-1).toExponential(2)],["angle errors",`${angleDistance(rawAngle,idealAngle).toExponential(1)} / ${angleDistance(stableAngle,idealAngle).toExponential(1)}`]]}>
    <InteractiveCanvas draw={draw} dependencies={[count,stepDegrees,normalizeEvery]} label="比较累计 float32 rotor 在无归一化和周期归一化下的不变量漂移" />
    <div className="lab-controls"><Slider label="累计乘法次数" value={count} min={1000} max={100000} step={1000} onChange={setCount}/><Slider label="每步旋转角" value={stepDegrees} min={.05} max={2} step={.01} suffix="°" onChange={setStepDegrees}/><Slider label="每 N 步归一化（0=关闭）" value={normalizeEvery} min={0} max={5000} step={100} onChange={setNormalizeEvery}/></div>
    <div className="quaternion-readout"><code>unit rotor invariant: RR̃=1 &nbsp;·&nbsp; length invariant: |RvR̃|=|v|</code><code>raw vector scale={rawNorm.toFixed(8)} &nbsp;·&nbsp; maintained scale={stableNorm.toFixed(8)} &nbsp;·&nbsp; compute path uses Math.fround</code></div>
  </LabFrame>;
}

export function WebGPURotorLab(){
  const [angle,setAngle]=useState(38),[grid,setGrid]=useState(32),theta=angle*Math.PI/180,instances=grid*grid;
  const shaderCode=useMemo(()=>`const GRID:u32=${grid}u;\nconst ANGLE:f32=${theta.toFixed(8)};\nstruct Out{@builtin(position) position:vec4f,@location(0) color:vec3f}\n@vertex fn vertexMain(@builtin(vertex_index) vi:u32,@builtin(instance_index) ii:u32)->Out{var o:Out;let n=f32(GRID);let gx=f32(ii%GRID);let gy=f32(ii/GRID);let p=vec2f((gx/(n-1.0)*2.0-1.0)*0.72,(gy/(n-1.0)*2.0-1.0)*0.72);let rc=cos(ANGLE*0.5);let rb=-sin(ANGLE*0.5);let c2=rc*rc-rb*rb;let s2=-2.0*rc*rb;let r=vec2f(c2*p.x-s2*p.y,s2*p.x+c2*p.y);let tri=array<vec2f,3>(vec2f(-0.006,-0.005),vec2f(0.007,-0.005),vec2f(0.0,0.008));o.position=vec4f(r+tri[vi],0.0,1.0);o.color=vec3f(0.25+0.65*(gx/n),0.55+0.35*(gy/n),0.82);return o;}\n@fragment fn fragmentMain(i:Out)->@location(0) vec4f{return vec4f(i.color,0.88);}`, [grid,theta]);
  const draw=({ctx,width,height}:CanvasFrame)=>{drawDarkGrid(ctx,width,height,34);const cx=width*.5,cy=height*.5,r=Math.min(width,height)*.34;ctx.strokeStyle='rgba(216,227,224,.16)';ctx.strokeRect(cx-r,cy-r,r*2,r*2);drawArrow2D(ctx,cx,cy,cx+r*.82,cy,'rgba(239,189,85,.45)','input x');drawArrow2D(ctx,cx,cy,cx+r*.82*Math.cos(theta),cy-r*.82*Math.sin(theta),'#efbd55','rotated x');ctx.fillStyle='#91a3a0';ctx.font='10px ui-monospace, monospace';ctx.fillText('bright point batch: WGSL instancing · grid and axes: Canvas fallback',16,20);};
  return <LabFrame title="一个 rotor 参数被成千上万个 shader invocation 复用；每个 instance 独立完成 sandwich 等价运算" tag="LAB · WEBGPU INSTANCED ROTOR" metrics={[["instances",instances.toLocaleString()],["draw call","1"],["CPU point upload","0 B / procedural"]]}>
    <InteractiveCanvas draw={draw} shaderCode={shaderCode} gpuVertexCount={3} gpuInstanceCount={instances} dependencies={[angle,grid]} label="WebGPU 实例化批量旋转点阵并与 Canvas 坐标轴对照" />
    <div className="lab-controls"><Slider label="rotor angle θ" value={angle} min={-180} max={180} step={1} suffix="°" onChange={setAngle}/><Slider label="grid dimension N" value={grid} min={8} max={64} step={4} onChange={setGrid}/></div>
    <div className="quaternion-readout"><code>R=cos(θ/2)−e₁₂sin(θ/2) &nbsp;·&nbsp; v′=RvR̃</code><code>@vertex(instance_index) &nbsp;·&nbsp; draw(3, {instances}) &nbsp;·&nbsp; {instances} independent GA-equivalent rotations</code></div>
  </LabFrame>;
}
