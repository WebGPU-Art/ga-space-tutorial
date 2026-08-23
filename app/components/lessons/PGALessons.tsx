'use client';

import { HomogeneousEmbeddingLab, PGA2DMeetLab, PGAIncidenceMetricLab, PGANormalizationLab, PGAPrimitiveInspectorLab, TranslatorExponentialLab } from '../labs/PGALabs';

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

export function PGAPrimitivesLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · READ THE ALGEBRA AS A GEOMETRIC DICTIONARY</span><h2>在 dual PGA 中，grade 表示“多少个超平面相交”</h2><p>本教程采用 plane-based、dual PGA：一向量直接表示超平面。二维的超平面是直线，所以直线是 grade 1；两条直线相交成点，所以点是 grade 2。三维中，平面是 grade 1，两平面相交的直线是 grade 2，三平面相交的点是 grade 3。</p><p>这条规律让外积与几何构造完全同步：每加入一个独立超平面因子，grade 增加一，并把可行子空间再降低一维。</p></section>
    <figure className="equation-card large"><code>2D: line ℓ (grade 1) ∧ line m (grade 1) = point P (grade 2)</code><figcaption>3D 中同理：plane∧plane=line，plane∧plane∧plane=point。</figcaption></figure>
    <PGAPrimitiveInspectorLab />
    <section className="derivation-steps"><article><span>2D · grade 1</span><h3>直线</h3><code>ℓ=ae₁+be₂+ce₀</code><p>有限线满足 (a,b)≠(0,0)；e₀ 本身是理想线 ω。</p></article><article><span>2D · grade 2</span><h3>点</h3><code>P=xe₂₀+ye₀₁+we₁₂</code><p>w≠0 是有限点，w=0 是理想点，也就是方向。</p></article><article><span>2D · grade 3</span><h3>伪标量</h3><code>I=e₀₁₂, I²=0</code><p>表示整个射影平面及其定向；它不是一个有限点。</p></article></section>
    <section className="prose-block compact"><span>02 · THE BASIS ELEMENTS ARE ALREADY GEOMETRIC</span><h2>e₁、e₂ 是坐标线，e₀ 是理想线</h2><p><i>e₁</i> 表示 x=0，<i>e₂</i> 表示 y=0，二者相交得到原点 <i>E₀=e₁₂</i>。<i>E₁=e₂₀</i> 与 <i>E₂=e₀₁</i> 位于理想线 e₀ 上，分别编码 x、y 方向。一般点因此写成 <i>P=xE₁+yE₂+wE₀</i>。</p></section>
    <div className="basis-correspondence"><div><span>LINE BASIS</span><b>e₀</b><p>理想线 ω</p></div><div><span>POINT BASIS</span><b>E₀=e₁₂</b><p>坐标原点</p></div><div><span>LINE BASIS</span><b>e₁</b><p>x=0 直线</p></div><div><span>POINT BASIS</span><b>E₁=e₂₀</b><p>x 理想方向</p></div><div><span>LINE BASIS</span><b>e₂</b><p>y=0 直线</p></div><div><span>POINT BASIS</span><b>E₂=e₀₁</b><p>y 理想方向</p></div></div>
    <section className="prose-block compact"><span>03 · GENERALIZE TO 3D WITHOUT CHANGING THE RULE</span><h2>三维对象只是把“相交层数”再延长一级</h2><p>三维 dual PGA 使用四个一向量基：<i>e₁,e₂,e₃</i> 对应坐标平面，<i>e₀</i> 对应理想平面。一般平面 <i>π=ae₁+be₂+ce₃+de₀</i> 对应方程 ax+by+cz+d=0；线是两个平面的外积，点是三个平面的外积。</p></section>
    <div className="sign-table"><div><span>GRADE 1</span><b>π</b><p>平面 · 3 个欧氏法向分量与 1 个偏移分量。</p></div><div><span>GRADE 2</span><b>L=π₁∧π₂</b><p>直线 · 同时包含方向与相对原点的 moment。</p></div><div><span>GRADE 3</span><b>P=π₁∧π₂∧π₃</b><p>点 · 有限位置或理想方向。</p></div></div>
    <section className="definition-callout"><span>primal / dual</span><p>有些资料让点成为一向量，再由点外积张成线与面；那是 primal/point-based 模型。本教程让超平面成为一向量。两种模型射影对偶，但对象 grade、∧ 与 ∨ 的读法不同，不能逐符号混用。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>从坐标预测对象类型</h3><ul><li>拖动有限点，观察只有 e₂₀、e₀₁ 系数改变，而 e₁₂ 权重保持 1。</li><li>拖动有限线并旋转法向，区分“改变位置 c”与“改变方向 (a,b)”。</li><li>切换理想点和理想线，说明为什么它们虽非零却都平方为零。</li></ul></section>
  </div>;
}

export function PGAIncidenceLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · INCIDENCE FIRST, METRIC SECOND</span><h2>先用 Grassmann 结构回答“相交或连接在哪里”</h2><p>关联关系不需要长度和角度。两条线的 meet 用外积 <i>ℓ∧m</i>；两点的 join 用 regressive product <i>A∨B</i>。点 X 是否在直线 ℓ 上，则检查最高 grade 的关联残差 <i>ℓ∧X</i> 是否为零。</p><p>这部分只依赖射影结构，因此有限元素和理想元素无需分支。度量随后从同一 PGA 的几何积与规范化结果中读出。</p></section>
    <figure className="equation-card large"><code>meet: ℓ∧m=P &nbsp;&nbsp;·&nbsp;&nbsp; join: A∨B=ℓ &nbsp;&nbsp;·&nbsp;&nbsp; incidence: ℓ∧X=0</code><figcaption>∧ 与 ∨ 的几何名称以当前 dual 模型为准。</figcaption></figure>
    <PGAIncidenceMetricLab />
    <section className="derivation-steps"><article><span>join</span><h3>两点决定直线</h3><code>ℓ=A∨B</code><p>交换 A、B 会翻转直线定向，但不改变其支撑集合。</p></article><article><span>meet</span><h3>两线决定交点</h3><code>P=ℓ∧m</code><p>平行时 P 自动成为理想点；重合时结果为零。</p></article><article><span>incidence</span><h3>点在线上</h3><code>ℓ∧X=0</code><p>非零结果的伪标量系数给出带符号关联残差。</p></article></section>
    <section className="prose-block compact"><span>02 · NORMALIZATION TURNS WEIGHTS INTO MEASUREMENTS</span><h2>规范化之后，join 的大小就是距离，内积就是角度余弦</h2><p>设 A、B 是权重为 1 的有限点，那么直线 <i>A∨B</i> 的欧氏范数等于两点距离。设 ℓ、m 是欧氏范数为 1 的有向直线，则 <i>ℓ·m=cos α</i>；外积可写成 <i>ℓ∧m=(sin α)P</i>，其中 P 是规范化交点。</p></section>
    <figure className="equation-card"><code>distance(A,B)=‖A∨B‖, &nbsp;&nbsp; ℓ·m=cos α, &nbsp;&nbsp; ℓ∧m=(sin α)P</code><figcaption>若输入没有规范化，结果会同时携带输入权重，不能直接当作距离或角度。</figcaption></figure>
    <section className="prose-block compact"><span>03 · POINT–LINE DISTANCE IS AN INCIDENCE RESIDUAL</span><h2>ℓ∧X 的伪标量系数测量点离线多远</h2><p>对规范化直线 <i>ℓ=ae₁+be₂+ce₀</i> 与权重为 1 的点 <i>X=(x,y,1)</i>，外积为 <i>(ax+by+c)I</i>。括号里的系数正是传统解析几何的带符号点线距离；为零时就退化成 incidence 条件。</p></section>
    <section className="definition-callout"><span>顺序与符号</span><p><b>A∨B=−B∨A</b>，交换点会反转连接线的方向。二维中 <b>ℓ∧m=−m∧ℓ</b>，交点的权重也翻转。距离通常取范数，但计算链中保留符号可持续携带定向、内外侧与行进方向。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>把几何构造和度量读数同时验证</h3><ul><li>选择 A、B 并拖动，确认 ‖A∨B‖ 与画面中的线段长度同步。</li><li>选择 X，把它拖到 ℓ 上，观察带符号距离穿过零并变号。</li><li>令测试线 m 与 ℓ 平行，观察交点消失到理想方向，但角度仍可计算。</li></ul></section>
  </div>;
}

export function PGANormalizationLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · PROJECTIVE SCALE BECOMES COMPUTATIONAL WEIGHT</span><h2>同一支撑集合可以有不同权重，但度量公式需要标准代表</h2><p>射影上 X 与 λX 表示同一对象，然而几何积会把 λ 带进后续结果。规范化就是从等价类中选择权重为 ±1 的代表，使角度、距离与 sandwich 公式拥有可比较的数值。负权重通常保留相反定向，不应被无条件抹掉。</p><p>退化度量带来关键区别：有限元素能被 bulk/欧氏范数看见；理想元素的 bulk 范数恰为零，必须使用单独的 ideal norm。</p></section>
    <figure className="equation-card large"><code>finite element: X̂=X/‖X‖ &nbsp;&nbsp;·&nbsp;&nbsp; ideal element: X̂=X/‖X‖∞</code><figcaption>先分类，再归一化；绝不能对理想元素除以它的零 bulk norm。</figcaption></figure>
    <PGANormalizationLab />
    <section className="derivation-steps"><article><span>Euclidean line</span><h3>有限直线</h3><code>‖ae₁+be₂+ce₀‖=√(a²+b²)</code><p>偏移 c 不改变法向长度。</p></article><article><span>Euclidean point</span><h3>有限点</h3><code>P²=−w², ‖P‖=|w|</code><p>规范化到 w=±1，再由 x/w、y/w 读位置。</p></article><article><span>ideal point</span><h3>理想方向</h3><code>‖xe₂₀+ye₀₁‖∞=√(x²+y²)</code><p>虽然 P∞²=0，方向仍有普通二维长度。</p></article></section>
    <section className="prose-block compact"><span>02 · THE IDEAL LINE HAS ITS OWN ONE-DIMENSIONAL NORM</span><h2>ce₀ 的平方总为零，但系数 c 仍是可归一化的权重</h2><p>二维所有理想线都与 e₀ 射影等价，所以理想线空间是一维。对 <i>ω_c=ce₀</i> 定义 <i>‖ω_c‖∞=|c|</i>，即可选出 ±e₀ 作为规范代表。伪标量 aI 也可类似用系数 a 定义 ideal magnitude。</p></section>
    <div className="convention-table"><div><span>对象</span><span>坐标形式</span><span>使用的范数</span></div><div><b>有限线</b><code>[a,b,c]</code><p>√(a²+b²)</p></div><div><b>理想线</b><code>[0,0,c]</code><p>ideal: |c|</p></div><div><b>有限点</b><code>(x,y,w), w≠0</code><p>bulk: |w|</p></div><div><b>理想点</b><code>(x,y,0)</code><p>ideal: √(x²+y²)</p></div></div>
    <section className="prose-block compact"><span>03 · NUMERICAL CLASSIFICATION NEEDS A SCALE-AWARE THRESHOLD</span><h2>浮点代码不能只写 w===0</h2><p>接近平行的直线会产生很小但非零的点权重；直接除以 w 会得到巨大坐标并放大误差。实现时先根据输入尺度构造相对阈值，再决定保留齐次结果、切换理想解释，还是安全地反齐次化。零多向量本身不代表任何射影对象，也不能规范化。</p></section>
    <section className="definition-callout"><span>不要混淆</span><p><b>support</b> 决定对象在哪里，<b>weight magnitude</b> 决定代表缩放，<b>weight sign</b> 携带定向。归一化只标准化后两者，不改变 support。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>故意把错误范数用在理想元素上</h3><ul><li>切换有限点与理想点，比较 bulk norm 为什么从 |λ| 变成严格的 0。</li><li>把 λ 穿过零，观察几何支撑不变、定向翻转，而 λ=0 瞬间无有效对象。</li><li>切换理想线，说明为何系数范数不是从 e₀² 推出的普通平方根。</li></ul></section>
  </div>;
}

export function TranslatorsLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · TRANSLATION IS A ROTATION WITH ITS CENTER AT INFINITY</span><h2>两次平行反射产生平移，对应一个理想生成元</h2><p>两条相交镜线的双反射产生有限中心旋转；当镜线平行时，它们在理想点相交，复合变成平移。PGA 不需要为这个极限切换表示：有限中心逐渐走向无穷远，rotor 的双向量生成元自然变成平方为零的理想双向量。</p><p>令欧氏位移向量为 <i>t=tₓe₁+tᵧe₂</i>，并取 <i>B=e₀t</i>。因为 e₀²=0 且与欧氏基正交，B²=0。</p></section>
    <figure className="equation-card large"><code>T(s)=exp(−sB/2)=1−sB/2, &nbsp;&nbsp; B=e₀(tₓe₁+tᵧe₂), &nbsp;&nbsp; B²=0</code><figcaption>本教程采用 X′=TXT̃ 的主动变换约定；负号使坐标点沿 +(tₓ,tᵧ) 移动。</figcaption></figure>
    <TranslatorExponentialLab />
    <section className="derivation-steps"><article><span>nilpotent</span><h3>高阶项消失</h3><code>B²=B³=⋯=0</code><p>指数不是近似：只剩常数项和一次项。</p></article><article><span>unit versor</span><h3>reverse 就是逆</h3><code>T̃=1+sB/2, TT̃=1</code><p>两个一次项抵消，二次项因 B²=0 消失。</p></article><article><span>sandwich</span><h3>统一作用</h3><code>X′=TXT̃</code><p>点、线、理想元素和复合 blade 使用同一个 translator。</p></article></section>
    <section className="prose-block compact"><span>02 · VERIFY THE ACTION ON A COORDINATE POINT</span><h2>sandwich 精确地只修改位置系数</h2><p>把 <i>P=xe₂₀+ye₀₁+e₁₂</i> 代入 sandwich，得到 <i>P′=(x+stₓ)e₂₀+(y+stᵧ)e₀₁+e₁₂</i>。齐次权重保持 1，理想方向不变，说明平移只改变位置而不改变方向。</p></section>
    <figure className="equation-card"><code>TPT̃=(x+stₓ)e₂₀+(y+stᵧ)e₀₁+e₁₂</code><figcaption>对直线执行同一 sandwich 会改变偏移 c，却保持法向 (a,b) 和直线范数。</figcaption></figure>
    <section className="prose-block compact"><span>03 · TRANSLATORS FORM AN ABELIAN SUBGROUP</span><h2>平移生成元彼此交换，所以位移直接相加</h2><p>二维任意两个理想平移生成元 B₁、B₂ 的乘积为零，因此彼此交换。由此 <i>T(t₂)T(t₁)=T(t₁+t₂)</i>，平移顺序不会改变终点。下一课会把 translator 与有限 rotor 相乘得到 motor；此时旋转和平移一般不再交换。</p></section>
    <section className="definition-callout"><span>符号约定</span><p>有些资料使用 <b>X′=T̃XT</b> 或把点基写成 e₀₂ 而非 e₂₀，translator 指数的正负号会随之变化。实现时不要孤立抄写 T；应同时用一个已知点验证 sandwich 的实际位移方向。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>验证指数终止与结构保持</h3><ul><li>把路径参数 s 从 0 调到 1，确认轨迹对点、线和坐标框架都是直线。</li><li>令 t=(0,0)，确认 B=0、T=1，所有对象保持不动。</li><li>比较先平移 x 再平移 y 与相反顺序；预测为何它们相同，而下一课的旋转加平移不同。</li></ul></section>
  </div>;
}
