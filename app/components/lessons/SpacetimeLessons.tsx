'use client';

import { ElectromagneticBivectorLab, LorentzBoostLab, MinkowskiIntervalLab, ObserverSplitLab, SpinorDoubleCoverLab } from '../labs/SpacetimeLabs';

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

export function SpacetimeSplitLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · AN OBSERVER IS A TIMELIKE DIRECTION</span><h2>“空间”不是预先给定的三维盒子，而是观察者时间方向的正交补</h2><p>在 STA 中，一个惯性观察者由未来指向的单位 timelike 向量 <i>u</i> 表示，满足 <i>u²=1</i>。给定事件向量 <i>X</i>，沿 <i>u</i> 的投影是观察者读出的时间部分；剩余向量与 <i>u</i> 正交，位于该观察者的同时性空间。</p><p>因此改变观察者不是改变事件，而是改变用来切分事件的 <span>time axis + spatial slice</span>。两位观察者通常不同意时间分量和空间分量，却必须同意 <i>X²</i> 以及事件的因果类型。</p></section>
    <figure className="equation-card large"><code>X=(X·u)u + [X−(X·u)u] = X∥+X⊥, &nbsp;&nbsp; X⊥·u=0</code><figcaption>这里采用 u²=1。若使用相反 signature，投影公式中的符号也要随之调整。</figcaption></figure>
    <ObserverSplitLab />
    <section className="derivation-steps"><article><span>observer</span><h3>选择时间方向</h3><code>u=γ(γ₀+βγ₁)</code><p>u 位于未来光锥内；β 只决定它相对参考观察者的倾斜。</p></article><article><span>time</span><h3>收缩得到时钟读数</h3><code>ctᵤ=X·u</code><p>这是 Lorentz 标量，但它依赖你选择了哪一个 u。</p></article><article><span>space</span><h3>正交拒绝得到位置</h3><code>X⊥=X−(X·u)u</code><p>X⊥²≤0；其欧氏空间长度是 √(−X⊥²)。</p></article></section>
    <section className="prose-block compact"><span>02 · THE RELATIVE SPACE LIVES IN THE EVEN SUBALGEBRA</span><h2>把 γ₀ 选作观察者后，σₖ=γₖγ₀ 像三维欧氏基一样工作</h2><p>基双向量 <i>σₖ=γₖγ₀</i> 满足 <i>σₖ²=+1</i>，并生成 STA 的偶子代数。它们把“相对 γ₀ 的空间方向”编码成时空平面，而不是绝对的四维空间向量。换一位观察者，就会得到另一组相对基。</p><p>几何积 <i>Xu=X·u+X∧u</i> 也把观察者分解压缩成一个对象：标量项记录相对时间，双向量项记录相对空间方向。要把后者画成普通三维箭头，仍需通过 u 所定义的相对空间进行识别。</p></section>
    <div className="sign-table"><div><span>ABSOLUTE OBJECT</span><b>X</b><p>同一个时空向量；不依赖坐标表。</p></div><div><span>OBSERVER CHOICE</span><b>u</b><p>单位时间方向；决定同时性超平面。</p></div><div><span>RELATIVE DATA</span><b>X·u, X∧u</b><p>该观察者报告的时间与空间信息。</p></div></div>
    <section className="definition-callout"><span>不要把 observer 当成相机</span><p>相机只改变屏幕投影；这里的 u 决定时空中的 simultaneity slice。它改变哪些远处事件被归为“现在”，但不改变事件本身、光锥或 Lorentz 不变量。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>区分几何对象与观察者读数</h3><ul><li>固定事件并改变 β，记录 ctᵤ 与 xᵤ；说明究竟是哪一项保持不变。</li><li>把事件放到光锥上，验证任意允许的 β 都给出 ctᵤ²−xᵤ²=0。</li><li>寻找使 xᵤ=0 的 β，并解释为什么只有 timelike 事件能拥有这样的惯性观察者。</li></ul></section>
  </div>;
}

export function ElectromagneticBivectorLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · SIX COMPONENTS, ONE BIVECTOR</span><h2>电场和磁场是同一个时空双向量 F 的观察者分解</h2><p>时空双向量有六个独立分量：三个 time–space 平面和三个 space–space 平面。某位观察者 u 把前者称为电场、把后者称为磁场；另一位运动观察者重新划分时空平面，于是会得到不同的 E 与 B。</p><p>这不是两个真实场被 boost “搅拌”了，而是一个 frame-independent 的 <i>F</i> 被不同 u 分解。常用的协变定义是 <i>Eᵤ=F·u</i>，磁场可由 <i>F</i> 的对偶部分提取；磁项的整体符号取决于 signature、伪标量和 dual 的约定。</p></section>
    <figure className="equation-card large"><code>F ↦ (Eᵤ, Bᵤ), &nbsp;&nbsp; Eᵤ·u=Bᵤ·u=0</code><figcaption>在 u 的相对偶子代数中，常把这个分解简写为 F=Eᵤ+I Bᵤ；它不是把 F 降格为两个绝对三维向量。</figcaption></figure>
    <ElectromagneticBivectorLab />
    <section className="derivation-steps"><article><span>parallel</span><h3>沿 boost 的分量不变</h3><code>E′∥=E∥, B′∥=B∥</code><p>boost 发生在时间轴与 x 轴张成的平面中。</p></article><article><span>transverse</span><h3>横向 E/B 成对混合</h3><code>E′y=γ(Ey−βBz)</code><p>正负号来自 boost 方向和场分量约定。</p></article><article><span>sandwich</span><h3>主动变换仍是 rotor</h3><code>F′=RFR̃</code><p>主动变换 F 与固定 F、改换观察者 u 是互补的两种叙述。</p></article></section>
    <section className="prose-block compact"><span>02 · F² PACKS TWO LORENTZ INVARIANTS</span><h2>标量部与伪标量部分帮助分类电磁场</h2><p>在本页 <i>c=1</i> 与所示约定下，<i>F²=(E²−B²)+2I(E·B)</i>。boost 可以显著改变单独的 E² 或 B²，却不能改变这两个组合。因此某些场能找到纯电参考系、某些能找到纯磁参考系，而 plane wave 的两个不变量同时为零。</p></section>
    <div className="sign-table"><div><span>ELECTRIC-DOMINATED</span><b>E²−B² &gt; 0</b><p>若同时 E·B=0，可找到使 B 消失的惯性系。</p></div><div><span>MAGNETIC-DOMINATED</span><b>E²−B² &lt; 0</b><p>若同时 E·B=0，可找到使 E 消失的惯性系。</p></div><div><span>NULL FIELD</span><b>I₁=I₂=0</b><p>典型例子是理想平面波；没有静止参考系。</p></div></div>
    <section className="prose-block compact"><span>03 · MAXWELL BECOMES ONE MULTIVECTOR EQUATION</span><h2>几何导数会把四条 Maxwell 方程压缩为 ∇F=J</h2><p>这条式子的不同 grade 部分分别展开为带源与无源方程。本模块先把它当作路线图；7.1–7.2 建立几何导数后，再解释散度、旋度和外导数为何能同时出现在左边。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>用不变量而非单独分量判断场</h3><ul><li>改变 β，让 E′y 或 B′z 穿过零，并观察两个不变量仍固定。</li><li>设置 Ey≈Bz 且 Ex、Bx 较小，观察接近 null field 时 boost 如何放大/缩小分量。</li><li>说明为什么“某观察者测得 B=0”不等于“F 没有磁型时空平面”。</li></ul></section>
  </div>;
}

export function SpacetimeSpinorLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · A SPINOR CARRIES A FRAME</span><h2>向量被两侧夹心变换；spinor 本身只在一侧承受 Spin 作用</h2><p>在实 STA 的 Dirac–Hestenes 表述中，旋量可由偶多向量表示。偶子代数 <i>Cl⁺(1,3)</i> 有 8 个实维数，与四个复数分量的 Dirac column 数量匹配；具体对应仍依赖选择的参考框架和表示，不能只凭“8=8”忽略这些结构。</p><p>非零 spinor 可写成幅度、内部相位与 rotor 的乘积。rotor <i>R</i> 把参考正交框架搬到局部框架；可观测向量和双向量通常由 spinor 的双线性组合得到。</p></section>
    <figure className="equation-card large"><code>ψ=(ρeᴵᵝ)¹ᐟ²R, &nbsp; RR̃=1, &nbsp; eμ=RγμR̃</code><figcaption>ρ 给出幅度/密度尺度，β 是内部相位角，R 编码局部 Lorentz frame。不同文献对相位因子和基元的放置有所不同。</figcaption></figure>
    <SpinorDoubleCoverLab />
    <section className="derivation-steps"><article><span>amplitude</span><h3>ρ</h3><code>ψψ̃=ρeᴵᵝ</code><p>它控制双线性量的整体尺度；归一化 spinor 只保留内部几何。</p></article><article><span>phase</span><h3>eᴵᵝ/²</h3><code>I²=−1</code><p>STA 伪标量在偶子代数中提供复结构，但相位不能与空间转角简单混为一谈。</p></article><article><span>frame</span><h3>R</h3><code>eμ=RγμR̃</code><p>一个局部 rotor 同时携带 boost 与空间姿态。</p></article></section>
    <section className="prose-block compact"><span>02 · SPIN IS A DOUBLE-COVER PHENOMENON</span><h2>R 与 −R 给出同一个 Lorentz frame，但它们是 Spin 群中的两个点</h2><p>因为 sandwich 中符号出现两次，<i>(−R)γμ(−R̃)=RγμR̃</i>。框架旋转 360° 后已经回到起点，连续提升到 Spin 群的路径却到达 −R；再转一圈才回到 +R。实验展示的是覆盖空间的拓扑，不是声称“spinor 的孤立负号可直接被测量”。</p><p>量子态的相对相位可通过干涉产生后果，但那需要比较路径或态；本页只建立几何底座，不在此推导测量理论。</p></section>
    <div className="sign-table"><div><span>VECTOR / FRAME</span><b>SO⁺(1,3)</b><p>可见的正交框架变换；360° 空间旋转闭合。</p></div><div><span>ROTOR / SPINOR</span><b>Spin⁺(1,3)</b><p>到 Lorentz 群的双覆盖；R 与 −R 映到同一点。</p></div><div><span>EVEN ALGEBRA</span><b>Cl⁺(1,3)</b><p>容纳标量、双向量与伪标量等 8 个实自由度。</p></div></div>
    <section className="prose-block compact"><span>03 · WHERE THE DIRAC EQUATION ENTERS</span><h2>spinor 场让局部 frame、相位与动力学随事件变化</h2><p>把 ψ 写成事件 X 的函数，再用时空几何导数作用于它，就会得到 Dirac–Hestenes 方程。它把传统 gamma 矩阵运算重写为 STA 元素的几何积。这里先保留结构图景；下一单元从多向量导数开始补齐计算工具。</p></section>
    <section className="definition-callout"><span>表示与几何对象</span><p>Dirac column、最小左理想和 STA 偶多向量是彼此关联的表示方式，但并非无条件逐项相等。遇到不同教材时，先查清它选择了哪一个参考 spin frame、复结构和右乘基元。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>追踪覆盖映射，而不是只看最终姿态</h3><ul><li>从 0° 连续拖到 360°，确认框架回到原状而 R 到达单位圆对径点。</li><li>继续到 720°，说明为什么这次 spinor 路径也闭合。</li><li>用 sandwich 公式直接验证 R 与 −R 对任意 γμ 给出相同结果。</li></ul></section>
  </div>;
}
