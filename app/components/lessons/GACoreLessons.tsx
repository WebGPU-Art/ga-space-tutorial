'use client';

import { BladesGradesLab, DualityLab, GeometricProductLab, InvolutionsLab, MetricSignatureLab, OuterProductLab } from '../labs/GACoreLabs';

export function MetricSignatureLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · THE SQUARE OF A DIRECTION</span><h2>几何代数先规定如何测量，再规定如何相乘</h2><p>在 Clifford 几何代数中，向量的平方是标量。它由空间的二次型决定：欧氏单位方向平方为 +1，某些时空方向可平方为 −1，退化模型中的零方向则平方为 0。改变这些符号，就改变了长度、正交、可逆性与允许的变换。</p><p>对一组正交基，所有结构可从 <i>eᵢ² ∈ &#123;+1, −1, 0&#125;</i> 和不同基向量反交换得到。常用记号 <i>Cl(p,q,r)</i> 表示有 p 个正平方、q 个负平方、r 个零平方方向。</p></section>
    <figure className="equation-card large"><code>eᵢeⱼ + eⱼeᵢ = 2gᵢⱼ &nbsp;&nbsp;⇒&nbsp;&nbsp; v² = g(v,v)</code><figcaption>正交基中 gᵢⱼ=0（i≠j），所以 eᵢeⱼ=−eⱼeᵢ；对角项 gᵢᵢ 就是 eᵢ²。</figcaption></figure>
    <section className="derivation-steps"><article><span>+</span><h3>正平方方向</h3><code>e²=+1</code><p>欧氏空间的单位基最典型；非零向量平方通常为正。</p></article><article><span>−</span><h3>负平方方向</h3><code>e²=−1</code><p>产生双曲几何与 Lorentz 结构，使非零向量可能有负平方。</p></article><article><span>0</span><h3>零平方方向</h3><code>e²=0, e≠0</code><p>方向非零却没有普通逆；PGA 用它编码无穷远与平移。</p></article></section>
    <MetricSignatureLab />
    <section className="prose-block compact"><span>02 · NULL DOES NOT MEAN ZERO</span><h2>非零向量也可能具有零平方</h2><p>在不定度量中，正负贡献可以抵消，例如二维 Minkowski 平面中的 <i>e₁+e₂</i>；在退化度量中，零平方基方向本身就是 null。它们都满足 <i>v²=0</i>，却不是零向量。光锥、理想元素和共形点都依赖这种区别。</p></section>
    <section className="definition-callout"><span>符号约定</span><p>不同书籍会交换 p、q 的正负定义，也可能把时空写作 Cl(1,3) 或 Cl(3,1)。阅读资料时先查 <b>每个基向量的平方</b>，不要只凭代数名称推断公式符号。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>用单位轨迹识别度量</h3><ul><li>切换欧氏与 Lorentz signature，比较单位圆如何变成双曲线。</li><li>在 Lorentz 模式调节 v，找到 v²≈0 的光锥方向。</li><li>切到退化模式并只改变 z，解释为什么 v² 完全不变。</li></ul></section>
  </div>;
}

export function OuterProductLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · SPAN A DIRECTED PLANE</span><h2>两条向量的外积不是另一条向量</h2><p>外积 <i>a∧b</i> 表示 a、b 张成的定向平行四边形：它所在的平面、面积大小以及边的顺序都被保留下来。这个对象称为双向量，是 grade 2 的 blade，而不是“垂直于平面的箭头”。</p><p>交换两条边会翻转定向，所以 <i>a∧b=−b∧a</i>。令两条边相同立刻得到 <i>a∧a=0</i>；更一般地，两向量线性相关时外积为零。</p></section>
    <figure className="equation-card large"><code>a ∧ b = ½(ab − ba), &nbsp;&nbsp; |a∧b| = |a||b||sin θ|</code><figcaption>第一式取几何积的反对称 grade-2 部分；第二式给出欧氏二维平行四边形的面积。</figcaption></figure>
    <OuterProductLab />
    <section className="derivation-steps"><article><span>01</span><h3>双线性</h3><code>(αa+βc)∧b = αa∧b+βc∧b</code><p>面积随每条边线性变化，可按坐标分量展开。</p></article><article><span>02</span><h3>反对称</h3><code>a∧b = −b∧a</code><p>交换生成顺序只翻转定向，不改变平面与面积大小。</p></article><article><span>03</span><h3>检测相关性</h3><code>a∧b=0 ⇔ a,b dependent</code><p>外积消失说明两条边无法张成二维子空间。</p></article></section>
    <section className="prose-block compact"><span>02 · COORDINATES REVEAL A DETERMINANT</span><h2>二维外积系数就是有符号面积行列式</h2><p>若 <i>a=a₁e₁+a₂e₂</i>、<i>b=b₁e₁+b₂e₂</i>，展开并使用 <i>eᵢ∧eᵢ=0</i> 与反对称性，可得 <i>a∧b=(a₁b₂−a₂b₁)e₁₂</i>。括号中的行列式是有符号面积，<i>e₁₂</i> 则给它指定了定向平面基。</p></section>
    <figure className="equation-card"><code>a ∧ b = det([a b]) e₁₂ = (a₁b₂ − a₂b₁)e₁₂</code><figcaption>在三维中，叉积是双向量 a∧b 经过对偶后的表示；外积本身可直接推广到任意维。</figcaption></figure>
    <section className="definition-callout"><span>几何重点</span><p>双向量的“方向”是平面内部的环绕方向，而不是某条法向量。法向量需要借助三维空间的整体定向与度量才能从双向量对偶得到。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>从面积读回代数性质</h3><ul><li>令夹角趋近 0° 或 180°，确认两条向量相关时外积消失。</li><li>交换 a、b，观察面片不变但系数符号翻转。</li><li>保持夹角不变并把 |a| 加倍，解释面积为何也加倍。</li></ul></section>
  </div>;
}

export function BladesGradesLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · GEOMETRY COMES IN GRADES</span><h2>标量、方向、平面和体积是同一代数的不同层</h2><p>在三维几何代数中，grade 0 是标量，grade 1 是向量，grade 2 是双向量，grade 3 是三向量。一个同时含有多个 grade 的元素称为多向量。它不是把不同对象混成含糊的一团，而是像多项式按次数分层一样，每个 grade 都可以被精确投影出来。</p><p>记号 <i>⟨M⟩ₖ</i> 表示多向量 M 的 grade-k 部分。于是 <i>M=Σₖ⟨M⟩ₖ</i>；偶数 grade 与奇数 grade 还分别组成偶子代数和奇部分。</p></section>
    <figure className="equation-card large"><code>M = α + v + B + βI = ⟨M⟩₀ + ⟨M⟩₁ + ⟨M⟩₂ + ⟨M⟩₃</code><figcaption>在 Cl(3,0) 中共有 1+3+3+1=8 个实分量；一般 n 维 Clifford 代数有 2ⁿ 个基 blade。</figcaption></figure>
    <BladesGradesLab />
    <section className="derivation-steps"><article><span>0</span><h3>标量</h3><code>span&#123;1&#125;</code><p>没有方向的大小，可与每个元素相加或缩放。</p></article><article><span>1</span><h3>向量</h3><code>span&#123;e₁,e₂,e₃&#125;</code><p>表示有向的一维元素，也是代数的生成元。</p></article><article><span>2–3</span><h3>高 grade</h3><code>eᵢⱼ, I=e₁₂₃</code><p>双向量表示定向平面；三向量表示定向体积。</p></article></section>
    <section className="prose-block compact"><span>02 · BLADE IS MORE SPECIFIC THAN GRADE</span><h2>一个 blade 必须能由向量外积分解</h2><p>形如 <i>A=a₁∧…∧aₖ</i> 的元素称为 k-blade，它表示单一 k 维子空间。任意 grade-k 元素称为 k-vector，但在四维及更高维中，它可能是多个独立 blade 的和，不能分解成单一外积。三维中的双向量恰好总是简单的，这个低维巧合不应被误当成一般规律。</p></section>
    <section className="definition-callout"><span>数据布局</span><p>基 blade 可用位图索引：0 对应 1，001 对应 e₁，011 对应 e₁₂，111 对应 e₁₂₃。grade 就是位图中 1 的数量。第 8.1 课会用这一结构生成高效的数据布局。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>按 grade 拆解一个多向量</h3><ul><li>只保留 scalar 与 bivector，确认得到偶多向量。</li><li>逐个把系数归零，观察 active grades 如何变化。</li><li>解释为什么“一个双向量”在三维可以代表单一平面，在四维却未必。</li></ul></section>
  </div>;
}

export function GeometricProductLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ONE PRODUCT, TWO GEOMETRIC QUESTIONS</span><h2>几何积同时回答“多对齐”和“张开什么平面”</h2><p>对两个向量 a、b，几何积被分解为对称的点积与反对称的外积：<i>ab=a·b+a∧b</i>。标量部分测量平行程度，双向量部分记录定向平面。传统向量代数把这两种信息放进两个不相容的运算；几何积把它们保存在一个可继续相乘的元素里。</p><p>几何积是结合的、双线性的，并且对非 null 向量提供逆。这三点让反射、旋转和更一般的 versor 可以直接由向量乘积构造。</p></section>
    <figure className="equation-card large"><code>ab = a·b + a∧b &nbsp;·&nbsp; a·b = ½(ab+ba) &nbsp;·&nbsp; a∧b = ½(ab−ba)</code><figcaption>交换顺序时标量部不变，双向量部变号；因此 ab 与 ba 通常不同。</figcaption></figure>
    <GeometricProductLab />
    <section className="derivation-steps"><article><span>parallel</span><h3>平行向量</h3><code>a∧b=0 ⇒ ab=a·b</code><p>乘积只剩标量；同向为正，反向为负。</p></article><article><span>orthogonal</span><h3>正交向量</h3><code>a·b=0 ⇒ ab=a∧b</code><p>乘积是纯双向量，且 ab=−ba。</p></article><article><span>inverse</span><h3>非 null 向量</h3><code>a⁻¹ = a/a²</code><p>因为 a² 是非零标量，所以 aa⁻¹=1。</p></article></section>
    <section className="prose-block compact"><span>02 · PRODUCT AS A ROTATION BUILDING BLOCK</span><h2>单位向量的乘积已经是一个转子</h2><p>若 a、b 是同一平面内的单位向量，<i>ba=b·a+b∧a</i> 具有“标量 + 单位双向量”的形式，可写成平面角的三角函数。两次反射产生的旋转正由这样的偶多向量完成。后续 rotor 不是额外发明的数据结构，而是几何积自然产生的可逆偶元素。</p></section>
    <section className="definition-callout"><span>结合但不交换</span><p><b>(ab)c=a(bc)</b> 允许省略括号并把多个变换组织成乘积；但一般 <b>ab≠ba</b>。不要把“结合律”和“交换律”混为一谈。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>从边界情况识别两个部分</h3><ul><li>令 θ=0°、90°、180°，分别预测点积与外积。</li><li>交换 ab 与 ba，确认点积读数不变、双向量系数变号。</li><li>验证 |ab|=|a||b|，并解释为什么这使单位向量乘积仍为单位元素。</li></ul></section>
  </div>;
}

export function InvolutionsLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · THREE WAYS TO FLIP STRUCTURE</span><h2>reverse、grade involution 和 Clifford conjugation 不是同一个负号</h2><p>几何代数需要几种结构保持的“共轭”操作。Reverse 把向量因子的乘法顺序倒过来；grade involution 把所有奇 grade 变号；Clifford conjugation 是前两者的复合。它们都作用两次回到原元素，却对不同 grade 给出不同符号。</p><p>明确区分这些操作，是写出 rotor 的逆、versor 的夹心作用和多向量范数的前提。不同资料会使用波浪线、帽子、横线或星号，阅读时应先确认定义。</p></section>
    <figure className="equation-card large"><code>⟨M̃⟩ₖ=(−1)ᵏ⁽ᵏ⁻¹⁾⁄²⟨M⟩ₖ &nbsp;·&nbsp; ⟨M̂⟩ₖ=(−1)ᵏ⟨M⟩ₖ</code><figcaption>Clifford conjugation 满足 M̄=(M̃)̂，符号为 (−1)ᵏ⁽ᵏ⁺¹⁾⁄²。</figcaption></figure>
    <InvolutionsLab />
    <section className="derivation-steps"><article><span>reverse</span><h3>反转因子顺序</h3><code>~(a₁a₂…aₖ)=aₖ…a₂a₁</code><p>它是反自同构：<i>~(AB)=B̃Ã</i>。</p></article><article><span>grade</span><h3>翻转所有向量</h3><code>â = −a</code><p>它是自同构：<i>^(AB)=ÂB̂</i>。</p></article><article><span>conjugate</span><h3>组合两次翻转</h3><code>M̄=(M̃)̂</code><p>对 grade 1、2 变号，对 grade 0、3 保持。</p></article></section>
    <section className="prose-block compact"><span>02 · FROM REVERSE TO INVERSE</span><h2>versor 的逆可由 reverse 高效构造</h2><p>若 <i>V=a₁a₂…aₖ</i> 是可逆向量的乘积，那么 <i>V⁻¹=aₖ⁻¹…a₁⁻¹</i>。当 <i>VṼ</i> 是非零标量时，可写成 <i>V⁻¹=Ṽ/(VṼ)</i>；单位 rotor 满足 <i>RṘ=1</i>，所以 <i>R⁻¹=Ṙ</i>。</p><p>这条简式不能盲目套到任意多向量。一般多向量可能不可逆，即使可逆，其逆也可能需要解线性系统或使用更高阶伴随结构。</p></section>
    <section className="definition-callout"><span>四元数桥梁</span><p>Cl⁺(3,0) 中的 reverse 正好对应四元数共轭：它保持标量部并翻转双向量部。这就是单位四元数逆等于共轭的 GA 解释。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>不看公式预测符号</h3><ul><li>切换三种操作，为 grade 0–3 手写一张符号表并与画布核对。</li><li>对每个操作连续应用两次，解释为何必定回到 M。</li><li>说明为什么 rotor 的 reverse 容易计算，而一般多向量的逆未必。</li></ul></section>
  </div>;
}

export function DualityLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · A SUBSPACE AND ITS COMPLEMENT</span><h2>伪标量把一个子空间连接到正交补</h2><p>n 维空间的单位伪标量 <i>I=e₁e₂…eₙ</i> 表示整个定向空间。若 I 可逆，一个 k-blade A 与 I⁻¹ 相乘可得到一个 (n−k)-vector，表示 A 的正交补；这就是度量对偶。</p><p>在三维中，平面的对偶是一条法向方向，向量的对偶是垂直平面。这种 grade 2 与 grade 1 的对应让叉积看起来像“两个向量产生一个向量”，但真正先产生的是双向量 <i>a∧b</i>。</p></section>
    <figure className="equation-card large"><code>A* = A I⁻¹ &nbsp;&nbsp;·&nbsp;&nbsp; a×b = −I(a∧b) &nbsp; in Cl(3,0)</code><figcaption>本教程取 I=e₁₂₃、I²=−1，因此 I⁻¹=−I；在三维欧氏代数中 I 与所有元素交换。</figcaption></figure>
    <DualityLab />
    <section className="derivation-steps"><article><span>grade</span><h3>grade 互补</h3><code>k ↔ n−k</code><p>三维中标量对偶为体积，向量对偶为平面。</p></article><article><span>orientation</span><h3>依赖空间定向</h3><code>I → −I ⇒ A* → −A*</code><p>翻转整体手性会翻转对偶代表，而原 blade 不必改变。</p></article><article><span>metric</span><h3>依赖可逆伪标量</h3><code>I⁻¹ exists only if metric nondegenerate</code><p>退化度量中必须区分 metric dual 与纯关联的补空间操作。</p></article></section>
    <section className="prose-block compact"><span>02 · WHY CROSS PRODUCT IS DIMENSION-SPECIFIC</span><h2>外积普适，叉积依赖三维对偶</h2><p>两向量外积在任意维都得到一个双向量。只有当双向量空间与向量空间维数恰好对应时，才能借助对偶把结果编码成单个向量；三维正是最熟悉的情形。在四维中，双向量有 6 个分量，不能普遍压缩成 4 分量法向量。</p></section>
    <section className="definition-callout"><span>PGA 预告</span><p>PGA 的度量退化，伪标量不可逆，因此不能直接沿用 <b>AI⁻¹</b>。届时会引入不依赖度量逆的 Poincaré duality / complement，并明确 primal、dual 模型的约定。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>分离平面与法向量</h3><ul><li>改变夹角符号，观察 a∧b 与对偶向量如何同时翻转。</li><li>只翻转空间定向 I，确认双向量不变而对偶向量变号。</li><li>解释为什么 a∧b 在四维仍有意义，而普通三维叉积公式不能直接搬过去。</li></ul></section>
  </div>;
}
