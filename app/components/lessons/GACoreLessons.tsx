'use client';

import { MetricSignatureLab, OuterProductLab } from '../labs/GACoreLabs';

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
