'use client';

import { AutomaticDifferentiationLab, MovingFrameLab, MultivectorDerivativeLab, VectorCalculusLab } from '../labs/CalculusLabs';

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

export function VectorCalculusLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ONE PRODUCT, TWO KINDS OF CHANGE</span><h2>向量场的完整局部导数不是一个向量，而是 scalar + bivector</h2><p>对向量场 <i>v(x)</i>，几何积自动把 <i>∇v</i> 分成 grade 0 与 grade 2。标量部分 <i>∇·v</i> 测量一个微小体积的净膨胀率；双向量部分 <i>∇∧v</i> 测量局部环流的定向平面。二者合起来才是向量场的一阶变化。</p><p>在定向三维欧氏空间中，可以用伪标量 I 把 bivector 对偶成传统 curl 向量，因此常写 <i>∇∧v=I(∇×v)</i>。但 GA 保留 bivector 后，旋转发生在哪个平面里已经直接写在结果中，不需要把它伪装成垂直轴。</p></section>
    <figure className="equation-card large"><code>∇v = ∇·v + ∇∧v &nbsp;&nbsp; [grade 0 + grade 2]</code><figcaption>curl 向量依赖维数与定向；outer derivative ∇∧v 作为 bivector 可以直接推广到 n 维。</figcaption></figure>
    <VectorCalculusLab />
    <section className="derivation-steps"><article><span>normal flux</span><h3>散度读边界法向分量</h3><code>∮∂A n·v ds = ∬A ∇·v dA</code><p>源与汇只关心穿出边界多少，不关心沿边界滑动多少。</p></article><article><span>circulation</span><h3>外导数读切向环流</h3><code>∮∂A v·dx = ∬A curl(v) dA</code><p>二维时结果可用 pseudoscalar I 保留旋转定向。</p></article><article><span>geometric derivative</span><h3>两个通道同时存在</h3><code>∇v=2a+2ωI</code><p>螺旋场既膨胀又旋转，不必在两个互不相关的算子间切换。</p></article></section>
    <section className="prose-block compact"><span>02 · THE FUNDAMENTAL THEOREM IS THE COMMON SOURCE</span><h2>Gauss、Stokes 与 Green 是同一个有向边界定理的 grade 投影</h2><p>几何微积分把区域的 directed measure 与几何导数组合，得到“内部导数积分 = 有向边界上的场积分”。选择不同维数、不同 grade，并取相应投影，就恢复熟悉的散度定理、Stokes 定理和 Green 定理。实验用常导数线性场，让边界积分精确等于局部读数乘面积。</p></section>
    <figure className="equation-card"><code>∫ₘ dX (∂F) = ∫∂ₘ dS F</code><figcaption>乘法次序、有向测度和左右作用在完整理论中都重要；这里展示结构，不用无向 dA、ds 掩盖它们。</figcaption></figure>
    <section className="prose-block compact"><span>03 · CONNECTION TO DIFFERENTIAL FORMS</span><h2>grade-raising 部分对应 exterior derivative；grade-lowering 部分与 codifferential 相连</h2><p>把 k-vector 场通过度量识别为 k-form 后，<i>∇∧</i> 对应外导数 d。收缩部分 <i>∇·</i> 与 codifferential δ 的关系还包含 signature、grade 与 Hodge dual 的符号约定。因而“GA 包含 differential forms”是结构上的统一，不代表可以忽略度量与 convention。</p></section>
    <div className="sign-table"><div><span>GRAD</span><b>∇φ</b><p>0-form 到 1-form；只有 grade-raising 分量。</p></div><div><span>DIV</span><b>∇·v</b><p>依赖度量的 contraction；测量法向通量密度。</p></div><div><span>CURL / d</span><b>∇∧v</b><p>定向面积量；无需三维特有的叉积。</p></div></div>
    <section className="checkpoint"><span>实验任务</span><h3>用边界读回局部导数</h3><ul><li>选择 pure source，改变区域半径，验证通量按 r² 缩放而散度不变。</li><li>选择 pure vortex，确认每个边界点的法向通量抵消，但环流非零。</li><li>把 ω 改为负值，解释为什么 ∇∧v 的大小可不变而定向反转。</li></ul></section>
  </div>;
}

export function AutomaticDifferentiationLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · DIFFERENTIATE THE PROGRAM, NOT A PRINTED FORMULA</span><h2>forward-mode AD 让每个数同时携带 primal value 与 tangent</h2><p>有限差分要选择步长并做相近数相减；符号微分先构造一棵新表达式。自动微分则把程序中的每个基本运算提升到 dual number 上：<i>a+ȧε</i> 携带当前值 a 与沿某个输入方向的变化率 ȧ，并规定 <i>ε²=0</i>。</p><p>乘法展开后，二阶小量自动消失，ε 系数恰好是乘法法则。只要 sin、cos、乘法等基本操作都正确传播二元组，任意程序复合就会自动执行 chain rule。</p></section>
    <figure className="equation-card large"><code>f(x+ẋε)=f(x)+J(x)ẋ ε, &nbsp;&nbsp; ε²=0</code><figcaption>ε 不是“很小的浮点数”，而是代数上精确 nilpotent 的基元；结果仍只精确到所用浮点运算的舍入误差。</figcaption></figure>
    <AutomaticDifferentiationLab />
    <section className="derivation-steps"><article><span>seed</span><h3>选择输入切向量</h3><code>x ↦ x+ẋε</code><p>单变量设 ẋ=1 得普通导数；多变量 seed 是方向向量。</p></article><article><span>propagate</span><h3>重载每个基本运算</h3><code>(ab)̇=ȧb+aḃ</code><p>primal 与 tangent 在同一次前向执行中同行。</p></article><article><span>extract</span><h3>读取 ε 系数</h3><code>dual(f).tangent=Jẋ</code><p>一次 forward pass 得到 Jacobian-vector product，而非默认得到整个 Jacobian。</p></article></section>
    <section className="prose-block compact"><span>02 · FROM ROTOR TO KINEMATICS</span><h2>让 rotor 或 motor 的参数成为 dual，速度会穿过 sandwich 自动传播</h2><p>若 <i>M(t)</i> 是 motor，点或其他 PGA 对象按 <i>P′=MPM̃</i> 变换。把 t 替换为 <i>t+ε</i> 后，几何积、reverse 与指数的 dual 实现会同时给出 P′ 和 <i>dP′/dt</i>；手写展开时，这正是对三个因子应用 product rule。</p></section>
    <figure className="equation-card"><code>d(MPM̃)/dt = ṀPM̃ + MṖM̃ + MPM̃̇</code><figcaption>刚性附着点通常 Ṗ=0；关节链中的局部对象也随时间变化时不能漏掉中间项。</figcaption></figure>
    <section className="prose-block compact"><span>03 · TWO NILPOTENT IDEAS, DIFFERENT JOBS</span><h2>AD 的 ε 与 PGA 的 null generator 形式相似，但属于不同层次</h2><p>PGA 中某些理想 bivector N 满足 <i>N²=0</i>，使 translator 指数精确截断为 <i>1+N/2</i>；forward AD 的 ε 则附着在系数上，记录参数方向导数。实现中可以把两种结构组合，却不应把“空间的退化度量”和“程序的 tangent 通道”当成同一个基。</p></section>
    <div className="sign-table"><div><span>FINITE DIFFERENCE</span><b>[f(x+h)−f(x)]/h</b><p>简单通用，但有截断与相消误差。</p></div><div><span>FORWARD AD</span><b>Jẋ</b><p>输入方向少时高效；每个 seed 做一次前向传播。</p></div><div><span>REVERSE AD</span><b>ȳJ</b><p>标量输出、输入很多时常更合适；需要反向记录。</p></div></div>
    <section className="checkpoint"><span>实验任务</span><h3>检查 seed 的线性作用</h3><ul><li>把 seed 从 1 改为 2，确认轨迹位置不变而所有 tangent 分量加倍。</li><li>令 seed=0，解释为什么仍计算出正确位置但速度为零。</li><li>沿时间拖动，找到 dθ/dt 过零处，观察点速度为何不一定同时为零。</li></ul></section>
  </div>;
}

export function DifferentialGeometryLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · A CURVE CARRIES A LOCAL FRAME</span><h2>从位置的一阶、二阶、三阶变化读出切向、曲率与挠率</h2><p>对正则曲线 <i>r(u)</i>，先用弧长 s 消除参数走得快慢的影响。单位切向 <i>T=dr/ds</i> 描述前进方向；T 的变化率大小是曲率 κ，方向定义主法向 N；<i>𝓑=T∧N</i> 是 osculating plane 的单位 bivector，在三维里可对偶成下式所用的 binormal 向量 B。</p><p>挠率 τ 测量这个密切平面沿曲线如何扭转。圆的 κ 为常数、τ=0；圆螺线同时具有常曲率与常挠率，因此是观察移动 frame 的理想实验对象。</p></section>
    <figure className="equation-card large"><code>dT/ds=κN, &nbsp; dN/ds=−κT+τB, &nbsp; dB/ds=−τN</code><figcaption>这里把 B 画成三维 binormal 向量；GA 中等价的定向平面是 T∧N。两种表示通过三维 pseudoscalar 对偶。</figcaption></figure>
    <MovingFrameLab />
    <section className="derivation-steps"><article><span>first order</span><h3>切向 T</h3><code>T=r′/|r′|</code><p>只描述曲线当下朝哪里走，不记录参数速度。</p></article><article><span>second order</span><h3>曲率 κ 与主法向 N</h3><code>dT/ds=κN</code><p>κ 是方向变化率；N 指向局部弯曲中心。</p></article><article><span>third order</span><h3>挠率 τ</h3><code>dB/ds=−τN</code><p>τ 的符号区分左右手扭转，依赖所选空间定向。</p></article></section>
    <section className="prose-block compact"><span>02 · A ROTOR TRANSPORTS THE WHOLE FRAME</span><h2>不用分别积分三根轴，只积分一个保持正交性的 rotor</h2><p>选定初始 frame <i>Eᵢ</i> 后，可用 <i>eᵢ(s)=R(s)EᵢR̃(s)</i> 生成沿曲线的所有轴。局部 angular-velocity bivector Ω(s) 编码 frame 正在哪些平面内转动；rotor 微分方程自动保持 <i>RR̃=1</i>，比独立积分三根向量后再做 Gram–Schmidt 更贴近几何约束。</p></section>
    <figure className="equation-card"><code>dR/ds=−½ΩR &nbsp; ⇒ &nbsp; deᵢ/ds=eᵢ·Ω</code><figcaption>Ω 的正负号随 rotor 作用和 contraction 约定改变；比较实现时应以 frame 微分方程为最终检查。</figcaption></figure>
    <section className="prose-block compact"><span>03 · FRENET IS NOT THE ONLY FRAME</span><h2>曲率过零时 Frenet normal 失去定义，Bishop frame 更稳定</h2><p>直线段或 inflection point 上 <i>dT/ds=0</i>，主法向没有唯一方向，Frenet frame 会跳变。parallel-transport/Bishop frame 选择最小扭转的两个法向轴，适合相机轨迹、管线挤出与机器人路径。到了曲面上，切向 pseudoscalar、法向和 shape operator 会把曲率推广到每个切向方向。</p></section>
    <div className="sign-table"><div><span>FRENET</span><b>T, N, B</b><p>由导数直接决定；κ≠0 时自然，但过拐点可能翻转。</p></div><div><span>BISHOP</span><b>T, N₁, N₂</b><p>最小扭转运输；需要一个初始法向选择。</p></div><div><span>SURFACE FRAME</span><b>T₁∧T₂</b><p>切平面的单位 blade；shape operator 记录弯曲。</p></div></div>
    <section className="checkpoint"><span>实验任务</span><h3>分开观察弯曲与扭转</h3><ul><li>将 h 调到 0，验证曲线退化为平面圆且 τ=0。</li><li>只改变 h 的符号，确认 κ 不变、τ 反号，并观察 frame 手性变化。</li><li>增大半径，解释为什么同样一圈的方向变化被分摊到更长弧长，κ 因而下降。</li></ul></section>
  </div>;
}
