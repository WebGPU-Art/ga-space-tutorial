'use client';

import { HomogeneousEmbeddingLab, PGA2DMeetLab } from '../labs/PGALabs';

export function PGA2DLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · WHY PROJECTIVIZE EUCLIDEAN SPACE</span><h2>平行线的交点不是异常，而是一个理想点</h2><p>普通二维解析几何把相交与平行分成两套分支：两线斜率不同就解方程，斜率相同则报告“无交点”。射影几何补上一条理想线，每一族平行线在其共同方向对应的理想点相交。这样，任意两条不同直线都有统一的交点。</p><p>PGA 将这套射影结构放入带度量的 Clifford 代数。我们先采用二维的 <span>dual、line-based</span> 约定：直线是 1-vector，点是 2-vector。它让最常见的构造“两个超平面的相交”直接使用外积。</p></section>
    <figure className="equation-card large"><code>ℓ = a e₁ + b e₂ + c e₀ &nbsp;↔&nbsp; ax+by+c=0, &nbsp;&nbsp; e₁²=e₂²=1, e₀²=0</code><figcaption>(a,b,c) 是直线的齐次坐标；e₀ 的平方为零，将欧氏度量扩展成 signature (2,0,1) 的退化度量。</figcaption></figure>
    <PGA2DMeetLab />
    <section className="derivation-steps"><article><span>line</span><h3>直线是一向量</h3><code>ℓ=a e₁+b e₂+c e₀</code><p>(a,b) 是法向，c 决定相对原点的有向偏移。</p></article><article><span>point</span><h3>点是二向量</h3><code>P=x e₂₀+y e₀₁+w e₁₂</code><p>w≠0 表示有限点；归一化后坐标为 (x/w,y/w)。</p></article><article><span>incidence</span><h3>外积求交</h3><code>P=ℓ₁∧ℓ₂</code><p>w=0 时结果仍存在，只是位于理想线上。</p></article></section>
    <section className="prose-block compact"><span>02 · COMPUTE THE MEET WITHOUT A PARALLEL BRANCH</span><h2>外积展开就是齐次形式的二维叉积</h2><p>将两条直线系数代入外积，会得到三个 2-blade 分量。若 <i>w=a₁b₂−b₁a₂</i> 非零，除以 w 就得到熟悉的笛卡尔交点；若 w=0，x、y 分量仍给出平行线的共同方向。算法不需要在代数层面删除结果。</p></section>
    <figure className="equation-card"><code>ℓ₁∧ℓ₂ = (b₁c₂−c₁b₂)e₂₀ + (c₁a₂−a₁c₂)e₀₁ + (a₁b₂−b₁a₂)e₁₂</code><figcaption>同一个公式覆盖有限交点、远处交点和精确理想点；数值代码仍应根据 |w| 判断如何显示与归一化。</figcaption></figure>
    <section className="prose-block compact"><span>03 · JOIN IS THE DUAL CONSTRUCTION</span><h2>相交用 ∧，连接用 regressive product ∨</h2><p>在当前 dual 模型中，两条线的 meet 是 <i>ℓ₁∧ℓ₂</i>；两个点的 join 则是 <i>P₁∨P₂</i>，得到穿过两点的直线。两者是一对射影对偶操作。不要只凭对象 grade 猜运算符：换到 primal/point-based 约定时，∧ 与 ∨ 的几何读法会交换。</p></section>
    <div className="sign-table"><div><span>MEET</span><b>ℓ₁ ∧ ℓ₂ = P</b><p>两条直线相交成一个点。</p></div><div><span>JOIN</span><b>P₁ ∨ P₂ = ℓ</b><p>两个点连接成一条直线。</p></div><div><span>INCIDENCE</span><b>ℓ ∧ P = 0</b><p>零表示点 P 位于直线 ℓ 上；这是 line-based 模型的外积判据。</p></div></div>
    <section className="definition-callout"><span>本教程约定</span><p>后续 PGA 页面默认使用 <b>dual PGA</b>：二维直线是一向量、点是二向量；三维平面是一向量、线是二向量、点是三向量。遇到采用 primal 模型的资料时，请先翻转对象 grade 与 meet/join 约定，再比较公式。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>让有限交点连续走向无穷远</h3><ul><li>固定 ℓ₁，逐渐令 ℓ₂ 的法向角接近 ℓ₁，观察 |w| 变小、仿射坐标变大。</li><li>让两线角度完全相同但偏移不同，确认 P 成为 w=0 的理想点。</li><li>让角度和偏移都相同：此时外积为零。解释为什么“同一条线的交点”不是唯一点。</li></ul></section>
  </div>;
}

export function HomogeneousModelLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · A GEOMETRIC OBJECT IS AN EQUIVALENCE CLASS</span><h2>齐次坐标不是多一个普通坐标，而是用一条射线代表同一对象</h2><p>在射影空间中，非零倍数的坐标代表同一个几何元素：<i>P∼λP</i>。有限点 (x,y) 可嵌入为齐次三元组 (x,y,1)，也可写成 (λx,λy,λ)。恢复仿射坐标时除以最后一个分量 w，所以尺度 λ 完全消失。</p><p>当 w=0 时无法除回有限坐标；这些元素不是错误值，而是编码方向的理想点。它们使平行关系成为普通的相交关系。</p></section>
    <figure className="equation-card large"><code>(x,y) ↦ P=x e₂₀+y e₀₁+e₁₂, &nbsp;&nbsp; P∼λP (λ≠0)</code><figcaption>二维 dual PGA 的点是 2-vector；e₁₂ 系数就是齐次权重 w。</figcaption></figure>
    <HomogeneousEmbeddingLab />
    <section className="derivation-steps"><article><span>embed</span><h3>嵌入有限点</h3><code>(x,y) ↦ (x,y,1)</code><p>选择 w=1 是方便的规范，不是几何对象本身的一部分。</p></article><article><span>rescale</span><h3>更换代表</h3><code>(x,y,w)∼λ(x,y,w)</code><p>缩放沿同一齐次射线移动，不改变射影点。</p></article><article><span>dehomogenize</span><h3>回到仿射切片</h3><code>(x,y,w)↦(x/w,y/w)</code><p>只对 w≠0 有效；w=0 留在理想线上。</p></article></section>
    <section className="prose-block compact"><span>02 · THE NULL BASIS MAKES THE METRIC EUCLIDEAN</span><h2>e₀ 负责位置偏移，却不贡献直线的欧氏法向长度</h2><p>对直线 <i>ℓ=ae₁+be₂+ce₀</i>，由于 e₀²=0 且基正交，平方为 <i>ℓ²=a²+b²</i>。常数项 c 改变直线离原点的距离，却不改变其法向长度。这正是平移不应改变方向度量的代数编码。</p></section>
    <figure className="equation-card"><code>ℓ²=(ae₁+be₂+ce₀)²=a²+b², &nbsp;&nbsp; e₀²=0</code><figcaption>归一化直线令 a²+b²=1 后，c 就是带符号的原点距离（整体符号取决于直线定向）。</figcaption></figure>
    <section className="prose-block compact"><span>03 · DEGENERATE DOES NOT MEAN BROKEN</span><h2>退化度量有意保留了理想元素</h2><p>因为存在非零向量 e₀ 但 e₀²=0，PGA 的度量是退化的。结果是某些元素没有普通逆，伪标量 <i>I=e₀₁₂</i> 也满足 I²=0，不能照搬非退化 GA 中“乘 I⁻¹ 做对偶”的公式。PGA 通常使用基互补定义的 Poincaré duality，以及针对欧氏元素和理想元素分别设计的范数。</p></section>
    <section className="definition-callout"><span>三个“零”</span><p><b>零向量</b>没有方向；<b>null 向量</b>可以非零但平方为零；<b>理想元素</b>是在齐次权重 w=0 的射影元素。三者不是同一个概念，后续平移器正是利用非零幂零元素构造有限平移。</p></section>
    <section className="prose-block compact"><span>04 · WHY THIS PREPARES RIGID MOTION</span><h2>位置一旦进入代数，旋转与平移就能共享 sandwich 语言</h2><p>在普通向量 GA 中，向量自然描述方向，却没有内建“点在何处”。齐次嵌入将位置放进 blade；退化基产生的理想元素又会成为平移生成元。后续页面将依次构造点线面、欧氏/理想归一化、translator 与 motor。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>区分几何对象与坐标代表</h3><ul><li>保持 x、y 不变并移动 λ，确认仿射视图不变而齐次代表沿射线移动。</li><li>切到 w=0，观察左侧从有限点变成方向箭头，右侧射线落在理想平面。</li><li>说明为什么 λ=0 被排除：所有对象都会坍缩成同一个零多向量，无法再区分。</li></ul></section>
  </div>;
}
