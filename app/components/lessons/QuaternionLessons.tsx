'use client';

import { AxisAngleLab, CompositionLab, DoubleCoverLab, QuaternionAnatomyLab } from '../labs/QuaternionConceptLabs';

export function QuaternionAnatomyLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · AN ALGEBRA, NOT JUST FOUR NUMBERS</span><h2>四个分量分属两种几何角色</h2><p>四元数写成 <i>q = w + xi + yj + zk</i>。其中 <i>w</i> 是标量部，<i>xi+yj+zk</i> 是虚部。它们可以用四个实数存储，却不能因此把四元数乘法当成普通的四维向量运算：真正决定结构的是 <i>i、j、k</i> 的乘法规则。</p><p>加法和数乘确实逐分量进行；乘法则会混合所有分量。这个乘法让四元数成为<span>可除代数</span>，也让单位四元数能够把旋转复合为一次乘法。</p></section>
    <figure className="equation-card large"><code>i² = j² = k² = ijk = −1</code><figcaption>从这一行可推出 ij = k、jk = i、ki = j；交换次序则变号，例如 ji = −k。</figcaption></figure>
    <div className="quaternion-table" role="table" aria-label="四元数基乘法表"><span>×</span><b>1</b><b>i</b><b>j</b><b>k</b><b>1</b><span>1</span><span>i</span><span>j</span><span>k</span><b>i</b><span>i</span><span>−1</span><span>k</span><span>−j</span><b>j</b><span>j</span><span>−k</span><span>−1</span><span>i</span><b>k</b><span>k</span><span>j</span><span>−i</span><span>−1</span></div>
    <section className="derivation-steps"><article><span>01</span><h3>共轭翻转虚部</h3><code>q* = w − xi − yj − zk</code><p>共轭会反转乘法顺序：<i>(pq)* = q*p*</i>。</p></article><article><span>02</span><h3>乘积给出实数模</h3><code>qq* = w²+x²+y²+z²</code><p>虚部互相抵消，得到非负标量 <i>|q|²</i>。</p></article><article><span>03</span><h3>非零元素都有逆</h3><code>q⁻¹ = q* / |q|²</code><p>若 <i>|q|=1</i>，逆就是共轭，这是旋转计算高效的原因。</p></article></section>
    <QuaternionAnatomyLab />
    <section className="definition-callout"><span>不要混淆</span><p>虚部看起来像三维向量，但在四元数乘法中，两个纯虚四元数满足 <b>uv = −u·v + u×v</b>。点积与叉积同时出现，说明乘积包含的远不止逐分量相乘。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>用共轭和模检查运算</h3><ul><li>只改变虚部符号，确认 q 与 q* 的模相同。</li><li>把四个分量调到单位球附近，确认 q⁻¹ 与 q* 数值一致。</li><li>在乘法表中比较 ij 与 ji，解释为什么四元数乘法不交换。</li></ul></section>
  </div>;
}

export function AxisAngleLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · FROM A GEOMETRIC MOTION TO FOUR NUMBERS</span><h2>旋转轴进入虚部，角度必须折半</h2><p>三维中的定向旋转可由单位轴 <i>n̂</i> 与角度 <i>θ</i> 描述。把轴写成纯虚单位四元数后，单位四元数由半角构造：标量部是 <i>cos(θ/2)</i>，虚部方向沿轴，长度是 <i>sin(θ/2)</i>。</p><p>之所以出现半角，不是为了记忆方便。向量通过 <i>qvq⁻¹</i> 被 q 从左、逆元从右共同作用；参数空间中的半角最终在物理空间形成完整的 θ。</p></section>
    <figure className="equation-card large"><code>q(θ,n̂) = cos(θ/2) + n̂ sin(θ/2), &nbsp; |n̂|=1</code><figcaption>因此 |q|² = cos²(θ/2)+sin²(θ/2)=1；单位长度正是保持向量长度的条件。</figcaption></figure>
    <section className="derivation-steps"><article><span>A</span><h3>轴先归一化</h3><code>n̂ = n / |n|</code><p>虚部方向负责“绕哪里转”，不应夹带缩放。</p></article><article><span>B</span><h3>角度编码在单位圆</h3><code>(w, |v|)=(cos θ/2, sin θ/2)</code><p>标量部与虚部长度组成一个二维单位圆。</p></article><article><span>C</span><h3>从 q 读回轴角</h3><code>θ=2 atan2(|v|,w)</code><p>当 |v|≠0 时，轴为 <i>v/|v|</i>；接近零角时轴并不唯一。</p></article></section>
    <AxisAngleLab />
    <section className="prose-block compact"><span>02 · EDGE CASES</span><h2>同一个姿态可能有多套轴角描述</h2><p><i>(n̂,θ)</i> 与 <i>(−n̂,−θ)</i> 表示同一旋转。再加上角度的周期性，轴角不是全局唯一坐标。特别是 θ 接近 0° 时，所有轴都趋向同一个恒等旋转，数值上不应该试图稳定恢复轴。</p></section>
    <section className="definition-callout"><span>约定提示</span><p>本教程使用右手定则和主动旋转，并把向量视作纯虚四元数。不同引擎可能采用左手坐标、被动旋转或相反乘法方向；公式外观会改变，但必须整体保持一致。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>从读数反推几何</h3><ul><li>令 θ=180°，确认标量部为 0、虚部正好等于旋转轴。</li><li>令 θ=360°，观察 q=−1；物理姿态虽回到原处，四元数并未回到 +1。</li><li>令 θ 接近 0° 后任意移动轴，解释为什么旋转结果几乎不变。</li></ul></section>
  </div>;
}

export function CompositionLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · MULTIPLICATION MEANS DO ONE MOTION AFTER ANOTHER</span><h2>复合顺序写在乘法的右到左</h2><p>设 <i>qₓ</i> 表示绕 x 轴旋转，<i>qᵧ</i> 表示绕 y 轴旋转。若先对向量施加 x 旋转、再施加 y 旋转，那么在本教程的主动旋转约定下，合成四元数是 <i>q = qᵧqₓ</i>。最先执行的变换写在最靠近向量的位置。</p><p>三维旋转通常不交换：<i>qᵧqₓ ≠ qₓqᵧ</i>。原因不是实现误差，而是第一次旋转已经改变了第二次动作所面对的几何状态。</p></section>
    <figure className="equation-card large"><code>v″ = qᵧ(qₓvqₓ⁻¹)qᵧ⁻¹ = (qᵧqₓ)v(qᵧqₓ)⁻¹</code><figcaption>逆元的顺序同时反转：<i>(qᵧqₓ)⁻¹ = qₓ⁻¹qᵧ⁻¹</i>。</figcaption></figure>
    <CompositionLab />
    <section className="derivation-steps"><article><span>01</span><h3>世界轴旋转</h3><code>q ← q_world q</code><p>新动作从左乘入，旋转轴固定在世界坐标中。</p></article><article><span>02</span><h3>局部轴旋转</h3><code>q ← q q_local</code><p>新动作从右乘入，轴会跟随对象当前姿态。</p></article><article><span>03</span><h3>共线轴是例外</h3><code>q(a,α)q(a,β)=q(a,α+β)</code><p>绕同一轴的旋转会交换，角度可直接相加。</p></article></section>
    <section className="definition-callout"><span>代码检查</span><p>看到“先 A 后 B”时，不要只凭文字猜乘法顺序。先写出 <b>B(A(v))</b>，展开夹心积，再决定合成对象。行向量/列向量、主动/被动旋转和库的 API 约定都会影响表面写法。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>找出不交换与交换的边界</h3><ul><li>把两个角都调为非零，比较左右终点之间的夹角。</li><li>把任意一个角归零，确认两种顺序重新相同。</li><li>想象把 y 轴改成 x 轴：为什么两次绕同轴旋转可以合并？</li></ul></section>
  </div>;
}

export function DoubleCoverLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · TWO QUATERNIONS, ONE ORIENTATION</span><h2>q 与 −q 对所有向量做出同一旋转</h2><p>把 q 换成 −q，夹心积中的两个负号会抵消：<i>(−q)v(−q)⁻¹ = qvq⁻¹</i>。因此单位四元数球上的一对对径点对应 SO(3) 中同一个旋转。这个二对一映射称为<span>双覆盖</span>。</p><p>它解释了看似奇怪的 720° 现象：物体转 360° 后姿态已经恢复，但连续追踪的四元数从 +1 走到了 −1；再转一圈才回到原来的 +1。</p></section>
    <figure className="equation-card large"><code>Spin(3) ≅ S³ &nbsp;— 2:1 →&nbsp; SO(3), &nbsp;&nbsp; q ∼ −q</code><figcaption>Spin(3) 是旋转的双覆盖群；“∼”表示两者在作用到空间向量时等价。</figcaption></figure>
    <DoubleCoverLab />
    <section className="derivation-steps"><article><span>0°</span><h3>从 +1 出发</h3><code>q = cos 0 + n̂ sin 0 = +1</code><p>单位四元数路径和物理姿态都位于起点。</p></article><article><span>360°</span><h3>姿态已返回</h3><code>q = cos π + n̂ sin π = −1</code><p>SO(3) 中是恒等姿态，在 S³ 上却到了对径点。</p></article><article><span>720°</span><h3>参数也返回</h3><code>q = cos 2π + n̂ sin 2π = +1</code><p>连续四元数路径完成闭环。</p></article></section>
    <section className="prose-block compact"><span>02 · PRACTICAL CONSEQUENCE</span><h2>插值前先选择同一半球</h2><p>姿态传感器或动画关键帧可能在 q 与 −q 之间任意选一个代表。若直接插值，数值路径可能绕单位球的长弧。常用处理是检查 <i>q₀·q₁</i>：若为负，就先把其中一个四元数整体变号，再沿较短弧插值。</p></section>
    <section className="definition-callout"><span>拓扑直觉</span><p>双覆盖不只是参数重复。SO(3) 中“转一圈”的闭合路径不能连续缩成一个点；提升到 Spin(3) 后它从 +1 走到 −1，并未闭合。转两圈的路径才可收缩。这是旋量与 720° 现象的几何根源。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>同时追踪两个空间</h3><ul><li>停在 360°，比较左侧物理方向与右侧四元数位置。</li><li>继续到 720°，确认两侧第一次同时回到各自起点。</li><li>解释为什么把 q 整体乘以 −1 不会改变夹心积结果。</li></ul></section>
  </div>;
}
