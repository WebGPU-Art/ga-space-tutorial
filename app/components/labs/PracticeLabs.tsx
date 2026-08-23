'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame, type CanvasPointer } from './InteractiveCanvas';
import { drawDarkGrid } from './drawing';
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
