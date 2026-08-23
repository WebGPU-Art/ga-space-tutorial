'use client';

import { LorentzBoostLab, MinkowskiIntervalLab } from '../labs/SpacetimeLabs';

export function MinkowskiMetricLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ONE SIGN CHANGES THE GEOMETRY</span><h2>时间基平方为正，空间基平方为负</h2><p>本模块采用 STA 常见签名 <i>(+−−−)</i>：<i>γ₀²=+1</i>，三个空间基满足 <i>γᵢ²=−1</i>。事件不再只是“时间标签加三维位置”，而是一个时空向量 <i>X=ctγ₀+xγ₁+yγ₂+zγ₃</i>。它的平方是 Lorentz 标量。</p><p>在一维空间切片中，<i>X²=(ct)²−x²</i>。正定欧氏范数只有“长度大小”；Minkowski 平方的正、零、负则把事件分成三种因果类型。</p></section>
    <figure className="equation-card large"><code>X²=(ct)²−x²−y²−z²</code><figcaption>画布设置 c=1，并只显示 (x,ct) 平面；物理量恢复单位时将时间坐标写成 ct。</figcaption></figure>
    <MinkowskiIntervalLab />
    <section className="derivation-steps"><article><span>X² &gt; 0</span><h3>timelike</h3><code>c²τ²=X²</code><p>存在惯性系让两事件发生在同一空间位置；可由亚光速因果信号连接。</p></article><article><span>X² = 0</span><h3>null / lightlike</h3><code>|x|=|ct|</code><p>非零向量也可平方为零；它描述光线方向。</p></article><article><span>X² &lt; 0</span><h3>spacelike</h3><code>σ²=−X²</code><p>存在惯性系让两事件同时，但不存在因果信号连接。</p></article></section>
    <section className="prose-block compact"><span>02 · THE LIGHT CONE IS THE NULL SET</span><h2>X²=0 把未来、过去与不可因果到达区域分开</h2><p>从原点出发的 null 方向构成光锥。锥内是 timelike 区域，分为未来与过去；锥外是 spacelike 区域。任何保持 Minkowski 几何积的连续、保时向 Lorentz 变换都必须把光锥映回自身，因此因果类型不会因观察者改变。</p></section>
    <div className="sign-table"><div><span>EUCLIDEAN</span><b>x²+y²</b><p>除零向量外严格为正；等距轨迹是圆。</p></div><div><span>MINKOWSKI</span><b>(ct)²−x²</b><p>可正、零、负；等间隔轨迹是双曲线。</p></div><div><span>NULL</span><b>X≠0 but X²=0</b><p>退化的是向量的平方，不是整个 STA 度量。</p></div></div>
    <section className="prose-block compact"><span>03 · PROPER TIME IS THE TRAVELER’S OWN CLOCK</span><h2>timelike 路径上的固有时由时空间隔决定</h2><p>对相邻事件差 <i>dX</i>，固有时满足 <i>c²dτ²=dX²</i>。惯性世界线的积分给出两事件间最大固有时；加速路径会积累更少固有时。后续观察者分解会说明坐标时间与固有时为何不是同一个量。</p></section>
    <section className="definition-callout"><span>签名约定</span><p>许多教材采用 <b>(−+++)</b>，所有间隔符号会整体翻转，但光锥和物理分类不变。比较公式前必须先确认签名，不能只看 “timelike 是正还是负”。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>拖动事件穿过光锥</h3><ul><li>固定 ct，增加 |x|，观察 X² 从正值经过零变为负值。</li><li>沿光锥拖动，验证非零 X 的平方始终为零。</li><li>选择两个具有相同正 X² 的事件，确认它们位于同一条双曲线上而非圆上。</li></ul></section>
  </div>;
}

export function LorentzBoostLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · A BOOST IS A ROTATION IN A MIXED-SIGNATURE PLANE</span><h2>生成元 γ₁₀ 平方为 +1，所以指数展开成 cosh 与 sinh</h2><p>普通空间旋转的单位双向量平方为 −1，指数产生 cos、sin；时空平面生成元 <i>B=γ₁₀</i> 满足 <i>B²=+1</i>，因此 boost rotor 展开为双曲函数。快速参数 η 称为 rapidity，速度满足 <i>β=v/c=tanh η</i>。</p><p>采用主动变换时，<i>R=exp(ηγ₁₀/2)</i> 把静止时间轴 γ₀ 推向运动观察者的 γ₀′。画布同时使用被动坐标公式读取同一个事件在新基下的 (ct′,x′)。</p></section>
    <figure className="equation-card large"><code>R=exp(ηγ₁₀/2)=cosh(η/2)+γ₁₀sinh(η/2), &nbsp; RR̃=1</code><figcaption>η=artanh β；有限质量观察者要求 |β|&lt;1。</figcaption></figure>
    <LorentzBoostLab />
    <section className="derivation-steps"><article><span>active</span><h3>变换观察者基</h3><code>γ₀′=Rγ₀R̃=γ(γ₀+βγ₁)</code><p>运动时间轴始终位于光锥内部。</p></article><article><span>passive</span><h3>读取事件新坐标</h3><code>ct′=γ(ct−βx)</code><p>同一几何事件不变，分量随基改变。</p></article><article><span>space</span><h3>同时性轴倾斜</h3><code>x′=γ(x−βct)</code><p>ct′=0 的事件组成运动观察者的空间切片。</p></article></section>
    <section className="prose-block compact"><span>02 · THE HYPERBOLA PLAYS THE ROLE OF A CIRCLE</span><h2>boost 沿等间隔双曲线移动，光锥是其渐近线</h2><p>sandwich 保持几何积，所以 <i>(RXR̃)²=X²</i>。timelike 单位向量的集合满足 <i>(ct)²−x²=1</i>，正是双曲线；rapidity η 是这条双曲线上的有向双曲角。随着 |β|→1，|η|→∞，时间轴只能无限接近光锥而不能跨过。</p></section>
    <figure className="equation-card"><code>(ct′)²−x′²=(ct)²−x², &nbsp;&nbsp; γ=coshη=1/√(1−β²)</code><figcaption>光锥保持不变是 Lorentz 变换保持最大信号速度的几何表达。</figcaption></figure>
    <section className="prose-block compact"><span>03 · COLLINEAR RAPIDITIES ADD</span><h2>rotor 相乘让速度合成变成指数参数相加</h2><p>同一 γ₁₀ 平面中的生成元彼此交换，因此 <i>R(η₂)R(η₁)=R(η₁+η₂)</i>。换回速度得到 Einstein 合成 <i>β=(β₁+β₂)/(1+β₁β₂)</i>。非共线 boost 的生成元不交换，会额外产生空间旋转，也就是后续高级部分的 Wigner/Thomas 旋转。</p></section>
    <section className="definition-callout"><span>主动 / 被动</span><p>主动 rotor 把向量和基实际推到新方向；被动公式给同一向量换坐标。二者的 η 或 β 符号相反是常见现象。本页用 <b>γ₀′=Rγ₀R̃</b> 定义正向运动基，并用标准被动坐标式显示读数。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>把矩阵公式读回几何图形</h3><ul><li>增大 β，观察 ct′ 轴与 x′ 轴同时向光锥倾斜，但从不越过光锥。</li><li>改变事件坐标，确认 interval error 保持浮点零。</li><li>选择 ct′=0 附近的事件，说明为什么不同观察者对“同时”给出不同切片。</li></ul></section>
  </div>;
}
