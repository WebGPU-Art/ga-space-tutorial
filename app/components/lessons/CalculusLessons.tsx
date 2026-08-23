'use client';

import { MultivectorDerivativeLab } from '../labs/CalculusLabs';

export function MultivectorDerivativeLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · A FIELD RETURNS GEOMETRY AT EVERY POINT</span><h2>多向量场可以同时携带标量、方向、定向面积和更高 grade</h2><p>普通标量场把每个位置映到一个数，向量场映到一支箭头；多向量场 <i>F(x)</i> 则可写成各 grade 分量之和。导数的任务是回答：当输入点沿某个方向移动时，这些几何分量各自如何变化？</p><p>先固定单位方向 <i>a</i>。方向导数 <i>(a·∇)F</i> 是一个标量微分算子作用于 F，因此它逐 grade 求导并保持 grade，不会凭空把向量变成标量或双向量。</p></section>
    <figure className="equation-card large"><code>(a·∇)F(x)=lim[h→0] [F(x+ha)−F(x)]/h</code><figcaption>这里 a·∇ 必须整体看作算子；一般不能把它改写成 a·(∇F)，因为后者先形成多向量再做内积，运算范围不同。</figcaption></figure>
    <MultivectorDerivativeLab />
    <section className="derivation-steps"><article><span>sample</span><h3>沿方向取两点</h3><code>F(x), F(x+ha)</code><p>h 越小越接近局部变化，但浮点差分也会更容易受舍入误差影响。</p></article><article><span>difference</span><h3>同 grade 相减</h3><code>ΔF=F(x+ha)−F(x)</code><p>标量、向量、双向量分量分别比较。</p></article><article><span>limit</span><h3>除以步长并取极限</h3><code>lim ΔF/h</code><p>结果仍是与 F 相同 grade 组合的多向量。</p></article></section>
    <section className="prose-block compact"><span>02 · THE VECTOR DERIVATIVE USES THE RECIPROCAL FRAME</span><h2>∇ 本身是一个带向量方向的微分算子</h2><p>在坐标框架 <i>eₖ</i> 中，几何导数写成 <i>∇=eᵏ∂ₖ</i>，其中 <i>eᵏ</i> 是 reciprocal frame，满足 <i>eᵏ·eⱼ=δᵏⱼ</i>。笛卡尔正交单位基里 reciprocal frame 与原基相同，所以这个细节很容易被隐藏；在斜基或曲线坐标里它不可省略。</p><p>让 ∇ 通过几何积作用于纯 r-vector 场，结果只能落在相邻的 <i>r−1</i> 与 <i>r+1</i> grade。这正是 contraction 与 outer derivative 的统一来源。</p></section>
    <figure className="equation-card large"><code>∇Fᵣ = ∇·Fᵣ + ∇∧Fᵣ = ⟨∇Fᵣ⟩ᵣ₋₁ + ⟨∇Fᵣ⟩ᵣ₊₁</code><figcaption>本式按 homogeneous r-vector 场陈述；对一般多向量，先按 grade 线性展开。</figcaption></figure>
    <div className="sign-table"><div><span>SCALAR FIELD φ</span><b>∇φ</b><p>只有 grade 1：熟悉的梯度向量。</p></div><div><span>VECTOR FIELD v</span><b>∇·v + ∇∧v</b><p>grade 0 是散度；grade 2 是定向旋转密度。</p></div><div><span>BIVECTOR FIELD B</span><b>∇·B + ∇∧B</b><p>分别产生 vector 与 trivector；无需另外发明算子。</p></div></div>
    <section className="prose-block compact"><span>03 · READ THE LAB GRADE BY GRADE</span><h2>同一个 ∇F 读数同时包含膨胀、标量坡度和局部旋转</h2><p>实验使用 <i>F=φ+v+bI</i>。标量场 φ 的梯度与双向量场 bI 的收缩共同形成 <i>⟨∇F⟩₁</i>；向量场 v 的散度形成 <i>⟨∇F⟩₀</i>，外导数形成 <i>⟨∇F⟩₂</i>。滑动 a 与 ω，可以独立改变膨胀和旋转，而拖动探针主要改变由 φ、b 产生的向量项。</p></section>
    <section className="derivation-steps"><article><span>grade 0</span><h3>散度</h3><code>⟨∇F⟩₀=∇·v=2a</code><p>a&gt;0 表示局部源，a&lt;0 表示局部汇。</p></article><article><span>grade 1</span><h3>梯度 + bivector 收缩</h3><code>⟨∇F⟩₁=∇φ+∇·(bI)</code><p>这个分量随探针位置变化。</p></article><article><span>grade 2</span><h3>外导数</h3><code>⟨∇F⟩₂=∇∧v=2ωI</code><p>符号给出局部旋转的定向。</p></article></section>
    <section className="definition-callout"><span>算子作用域</span><p><b>(a·∇)F</b> 中的点属于方向导数算子；<b>a·(∇F)</b> 中的点属于多向量积的 grade 选择。几何积结合，但 dot/收缩不是独立的结合乘法，省略括号会把正确公式变成另一种运算。</p></section>
    <section className="prose-block compact"><span>04 · WHAT CHANGES OUTSIDE CARTESIAN SPACE</span><h2>基随位置变化时，还要对基本身求导</h2><p>本课画布使用固定二维笛卡尔基，所以只需微分分量函数。在曲线坐标、曲面或时空流形上，frame 也随位置变化，导数会产生 connection 项。7.4 的移动标架会重新遇到它；现在先牢固掌握固定 frame 中的 grade 分解。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>把方向导数与几何导数分开验证</h3><ul><li>固定探针，将方向转 180°，确认整个 (d·∇)F 变号，但 ∇F 不变。</li><li>令 a=0，只改变 ω，观察 grade 0 保持零而 grade 2 线性变化。</li><li>拖动探针穿过原点，找出哪些读数依赖位置，哪些只依赖场的全局参数。</li></ul></section>
  </div>;
}
