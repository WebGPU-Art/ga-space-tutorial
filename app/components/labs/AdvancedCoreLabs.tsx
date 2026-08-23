'use client';

import { useState } from 'react';
import { InteractiveCanvas, type CanvasFrame } from './InteractiveCanvas';
import { drawArrow2D, drawDarkGrid } from './drawing';
import { LabFrame, Slider } from './LabChrome';

export function BladeFactorizationLab() {
  const [alpha, setAlpha] = useState(.85), [beta, setBeta] = useState(.52);
  const plucker = 2 * alpha * beta, simple = Math.abs(plucker) < .015;
  const draw = ({ ctx, width, height }: CanvasFrame) => {
    drawDarkGrid(ctx, width, height); const left = [width * .29, height * .54] as const, right = [width * .71, height * .54] as const, radius = Math.min(width, height) * .17;
    const plane = (center: readonly [number, number], value: number, color: string, label: string, axes: [string,string]) => {
      ctx.save(); ctx.translate(...center); ctx.rotate(-.28); ctx.scale(1,.48); ctx.beginPath(); ctx.arc(0,0,radius,0,Math.PI*2); ctx.fillStyle=color; ctx.globalAlpha=.12+.3*Math.min(1,Math.abs(value));ctx.fill();ctx.globalAlpha=.85;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.restore();
      drawArrow2D(ctx,center[0]-radius*.72,center[1]+radius*.22,center[0]+radius*.72,center[1]-radius*.22,color,axes[0]);
      drawArrow2D(ctx,center[0]-radius*.35,center[1]-radius*.35,center[0]+radius*.35,center[1]+radius*.35,color,axes[1]);
      ctx.fillStyle='#a1afae';ctx.font='10px ui-monospace, monospace';ctx.textAlign='center';ctx.fillText(`${label} · ${value.toFixed(2)}`,center[0],25);ctx.textAlign='start';
    };
    plane(left,alpha,'#4bdab0','αe₁₂',['e₁','e₂']);plane(right,beta,'#b69bf2','βe₃₄',['e₃','e₄']);
    ctx.fillStyle=simple?'#75e4c3':'#f39780';ctx.font='12px ui-monospace, monospace';ctx.textAlign='center';ctx.fillText(simple?'one plane survives · simple blade':'two independent planes · not simple',width/2,height-26);ctx.textAlign='start';
    ctx.beginPath();ctx.moveTo(width/2,45);ctx.lineTo(width/2,height-50);ctx.strokeStyle='rgba(205,218,215,.14)';ctx.stroke();
  };
  return <LabFrame title="四维双向量可能同时包含两个独立平面" tag="LAB · BLADE FACTORIZATION" metrics={[["B",`${alpha.toFixed(2)}e₁₂ + ${beta.toFixed(2)}e₃₄`],["B∧B",`${plucker.toFixed(3)}I₄`],["simple?",simple?'yes':'no']] }>
    <InteractiveCanvas draw={draw} dependencies={[alpha,beta]} label="四维双向量可分解性与 Plücker 条件实验" />
    <div className="lab-controls"><Slider label="e₁₂ 平面权重 α" value={alpha} min={-1} max={1} step={.01} onChange={setAlpha}/><Slider label="e₃₄ 平面权重 β" value={beta} min={-1} max={1} step={.01} onChange={setBeta}/></div>
    <div className="quaternion-readout"><code>B = αe₁₂ + βe₃₄</code><code>B∧B = 2αβe₁₂₃₄</code></div>
  </LabFrame>;
}

type AtlasKey='r'|'split'|'complex'|'cl20'|'cl11'|'quaternion'|'cl30'|'cl03';
const atlas:Record<AtlasKey,{signature:string;name:string;iso:string;dimension:number;squares:string;note:string}>={
  r:{signature:'Cl(0,0)',name:'real numbers',iso:'ℝ',dimension:1,squares:'no generators',note:'scalar starting point'},
  split:{signature:'Cl(1,0)',name:'split-complex',iso:'ℝ ⊕ ℝ',dimension:2,squares:'e₁² = +1',note:'idempotents and zero divisors'},
  complex:{signature:'Cl(0,1)',name:'complex numbers',iso:'ℂ',dimension:2,squares:'e₁² = −1',note:'circular rotation generator'},
  cl20:{signature:'Cl(2,0)',name:'plane GA',iso:'Mat(2,ℝ)',dimension:4,squares:'e₁²=e₂²=+1',note:'even part is ℂ'},
  cl11:{signature:'Cl(1,1)',name:'split plane GA',iso:'Mat(2,ℝ)',dimension:4,squares:'(+1, −1)',note:'same algebra, different vector embedding'},
  quaternion:{signature:'Cl(0,2)',name:'quaternions',iso:'ℍ',dimension:4,squares:'e₁²=e₂²=−1',note:'three negative-square bivector-like units'},
  cl30:{signature:'Cl(3,0)',name:'3D Euclidean GA',iso:'Mat(2,ℂ)',dimension:8,squares:'(+1,+1,+1)',note:'even part is ℍ'},
  cl03:{signature:'Cl(0,3)',name:'negative 3D GA',iso:'ℍ ⊕ ℍ',dimension:8,squares:'(−1,−1,−1)',note:'semisimple split'},
};

export function AlgebraAtlasLab(){
  const [selected,setSelected]=useState<AtlasKey>('cl30'),item=atlas[selected],basisCount=item.dimension;
  const draw=({ctx,width,height}:CanvasFrame)=>{
    drawDarkGrid(ctx,width,height);const cols=Math.min(8,basisCount),cell=Math.min((width-80)/Math.max(cols,1),54),startX=(width-cols*cell)/2,cy=height*.48;
    for(let i=0;i<basisCount;i++){const x=startX+(i%cols)*cell,y=cy+(Math.floor(i/cols)-.5)*cell;ctx.fillStyle=i===0?'rgba(239,189,85,.85)':i%2?'rgba(75,218,176,.72)':'rgba(182,155,242,.72)';ctx.fillRect(x+3,y+3,cell-6,cell-6);ctx.fillStyle='#111821';ctx.font='10px ui-monospace, monospace';ctx.textAlign='center';ctx.fillText(i===0?'1':`b${i}`,x+cell/2,y+cell/2+4);}
    ctx.textAlign='center';ctx.fillStyle='#a1afae';ctx.font='11px ui-monospace, monospace';ctx.fillText(`${item.signature} · ${basisCount}=2ⁿ real basis blades`,width/2,27);ctx.fillStyle='#75e4c3';ctx.fillText(`${item.iso} · ${item.squares}`,width/2,height-27);ctx.textAlign='start';
  };
  return <LabFrame title="低维 Clifford 代数连接熟悉的数系与矩阵" tag="LAB · ALGEBRA ATLAS" metrics={[["selected",item.signature],["real dim",String(item.dimension)],["isomorphic to",item.iso]]}>
    <InteractiveCanvas draw={draw} dependencies={[selected]} label="低维实 Clifford 代数分类地图" />
    <div className="atlas-grid">{(Object.keys(atlas) as AtlasKey[]).map(key=><button key={key} className={selected===key?'active':''} onClick={()=>setSelected(key)}><b>{atlas[key].signature}</b><span>{atlas[key].iso}</span><small>{atlas[key].name}</small></button>)}</div>
    <div className="quaternion-readout"><code>{item.signature} ≅ {item.iso}</code><code>{item.note}</code></div>
  </LabFrame>;
}
