'use client';

import { QuaternionNumericsLab, SlerpLab } from '../labs/QuaternionAdvancedLabs';

export function SlerpLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · INTERPOLATE ON THE SPACE OF ROTATIONS</span><h2>姿态之间的直线，不在四维坐标空间里</h2><p>两个单位四元数 <i>q₀、q₁</i> 都位于四维单位球 <i>S³</i> 上。直接对四个分量做线性插值会穿过球内部，使中间结果不再是单位四元数；逐点归一化虽可修复长度，却不会带来恒定角速度。</p><p>SLERP 沿 <i>S³</i> 上连接两点的大圆弧前进。参数 <i>t</i> 每增加相同的量，走过的弧长也相同，因此对应<span>恒定的旋转角速度</span>。</p></section>
    <figure className="equation-card large"><code>q(t) = sin((1−t)Ω)/sin Ω · q₀ + sin(tΩ)/sin Ω · q₁</code><figcaption>其中 cos Ω = q₀·q₁，且 0≤t≤1。Ω 是四元数球上的夹角，物理姿态夹角为 2Ω。</figcaption></figure>
    <section className="derivation-steps"><article><span>01</span><h3>先测球面夹角</h3><code>d = q₀·q₁, Ω = acos(d)</code><p>两端都应先归一化，并把 d 限制到 [−1,1] 以抵抗舍入误差。</p></article><article><span>02</span><h3>选择最短代表</h3><code>d&lt;0 ⇒ q₁←−q₁, d←−d</code><p>q 与 −q 是同一姿态；翻转符号可避免沿 S³ 长弧绕行。</p></article><article><span>03</span><h3>小角时切换算法</h3><code>Ω≈0 ⇒ normalize(lerp)</code><p>当 sin Ω 很小时，直接使用 SLERP 公式会产生数值消减。</p></article></section>
    <SlerpLab />
    <section className="prose-block compact"><span>02 · NLERP IS USEFUL, BUT DIFFERENT</span><h2>归一化线性插值保持路径，不保持速度</h2><p>NLERP 将线性混合结果重新投到单位球。对于两个端点，它仍沿同一大圆平面前进，并且计算便宜；但 <i>t</i> 到弧长的映射是非线性的。短角度、帧间差异很小时，这种速度误差通常可接受；相机匀速转场和时间精确的姿态轨迹则更适合 SLERP。</p></section>
    <section className="definition-callout"><span>实现约定</span><p>若业务必须保留“长弧”或连续累计圈数，就不能无条件执行 q₁ 的半球翻转。普通姿态关键帧通常需要最短弧；包含绕轴圈数的运动应额外存储相位或路径信息。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>比较路径与速度</h3><ul><li>把目标夹角调小，观察 NLERP 曲线为何逐渐靠近直线。</li><li>固定大角度并移动 t，找到 NLERP 比 SLERP 超前和落后的区间。</li><li>解释为什么 t=0、0.5、1 时两种方法恰好给出相同角度。</li></ul></section>
  </div>;
}

export function QuaternionNumericsLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · THE UNIT NORM IS AN INVARIANT</span><h2>公式在单位球上成立，浮点计算却会慢慢离开它</h2><p>旋转四元数必须满足 <i>|q|=1</i>。理论上，两个单位四元数的乘积仍是单位四元数；实际程序中的每次乘法都会舍入。数千次姿态积分后，微小误差可能累积成可见的尺度漂移。</p><p>常用旋转写成 <i>qvq*</i>，隐含使用了“单位四元数的逆等于共轭”。一旦 q 偏离单位球，<i>qvq*</i> 会把向量额外缩放 <i>|q|²</i>；真正的 <i>qvq⁻¹</i> 虽能消去尺度，但仍不应让姿态状态长期失去规范化。</p></section>
    <figure className="equation-card large"><code>|q|=1 ⇒ q⁻¹=q* &nbsp;&nbsp;·&nbsp;&nbsp; |qvq*|=|q|²|v|</code><figcaption>重归一化不是改变目标姿态，而是把数值代表重新投回单位四元数球 S³。</figcaption></figure>
    <QuaternionNumericsLab />
    <section className="derivation-steps"><article><span>A</span><h3>定期重归一化</h3><code>q ← q / √(q·q)</code><p>按固定间隔或当 <i>||q|²−1|</i> 超过阈值时执行。</p></article><article><span>B</span><h3>保持符号连续</h3><code>qₜ·qₜ₋₁&lt;0 ⇒ qₜ←−qₜ</code><p>避免传感器输出在等价的 q/−q 之间跳变，影响差分与插值。</p></article><article><span>C</span><h3>小角使用稳定展开</h3><code>sin(x)/x ≈ 1−x²/6</code><p>旋转向量转四元数时，接近零角应避免除以极小的角度。</p></article></section>
    <section className="prose-block compact"><span>02 · A ROBUST UPDATE LOOP</span><h2>先明确误差模型，再选择修复频率</h2><p>惯性积分通常以角速度构造小增量 <i>δq</i>，再按局部或世界坐标约定更新 q。每次归一化最稳妥，但在大批量 GPU 计算中可按误差预算降低频率。关键是持续监视 <i>|q|²</i>、确保零范数不会进入除法，并在插值前统一半球。</p></section>
    <section className="definition-callout"><span>实验模型</span><p>画布把每步舍入抽象成可调的 ppm 尺度误差，以便放大趋势。真实误差不会总朝同一方向，但“不变量必须被监视和修复”的工程结论相同。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>建立误差预算</h3><ul><li>关闭重归一化，比较正、负每步误差如何让 |q| 增长或衰减。</li><li>重新开启后改变间隔，观察锯齿峰值与计算频率的权衡。</li><li>解释为什么使用真正的 q⁻¹ 可消去尺度，却仍不能替代姿态归一化策略。</li></ul></section>
  </div>;
}
