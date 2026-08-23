'use client';

import { BivectorExpLogLab, DoubleReflectionLab, FourDRotationLab, LieAlgebraLab, PinSpinCoverLab, ReflectionLab, RotorActionLab, RotorInterpolationLab } from '../labs/TransformationLabs';

export function ReflectionLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · THE PRIMITIVE ORTHOGONAL MOTION</span><h2>反射保持切向分量，只翻转法向分量</h2><p>设超平面的非 null 法向量为 n。把 x 分成平行于 n 的法向分量和垂直于 n 的切向分量，反射只需把前者变号。向量公式是 <i>x′=x−2(x·n/n²)n</i>。</p><p>几何积把同一操作压缩为一次 sandwich：<i>x′=−nxn⁻¹</i>。n 不必是单位向量，因为逆会自动抵消尺度。</p></section>
    <figure className="equation-card large"><code>x′ = −n x n⁻¹ = x − 2(x·n/n²)n</code><figcaption>这是关于法向 n 所定义超平面的反射；若要关于 n 所在直线反射，整体符号约定会不同。</figcaption></figure>
    <ReflectionLab />
    <section className="derivation-steps"><article><span>normal</span><h3>平行于法向</h3><code>x∥n ⇒ −nxn⁻¹=−x</code><p>法向分量完全翻转。</p></article><article><span>tangent</span><h3>位于镜面内</h3><code>x·n=0 ⇒ nx=−xn</code><p>代入 sandwich 后两个负号抵消，x 保持不变。</p></article><article><span>metric</span><h3>长度保持</h3><code>x′²=x²</code><p>反射属于正交群 O(p,q)，但会翻转定向。</p></article></section>
    <section className="prose-block compact"><span>02 · VERSOR ACTION STARTS HERE</span><h2>一个向量既表示镜面，也生成变换</h2><p>在反射公式中，n 是代数中的向量，同时充当变换生成元。多个可逆向量的乘积称为 versor；它通过 sandwich 作用统一描述多次反射产生的正交变换。这是 Pin 群与 Spin 群的入口。</p></section>
    <section className="definition-callout"><span>null 限制</span><p>若 n²=0，则 n 没有普通逆，不能直接作为非退化超平面反射的 versor。时空与退化模型需要按对象类型使用专门构造。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>检查反射不变量</h3><ul><li>让 x 位于镜面内，确认反射结果与原向量重合。</li><li>让 x 平行法向，确认结果恰好反向。</li><li>同时旋转镜面与向量，保持两者夹角不变，观察反射关系是否改变。</li></ul></section>
  </div>;
}

export function DoubleReflectionLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ROTATION EMERGES FROM TWO MIRRORS</span><h2>两次反射把夹角放大成两倍旋转</h2><p>先用单位法向 a 反射，再用单位法向 b 反射。两个负号抵消，复合结果可写成 <i>x″=(ba)x(ab)</i>。定义 <i>R=ba</i>，因为 reverse 满足 <i>R̃=ab</i>，便得到标准 rotor sandwich <i>x″=RxR̃</i>。</p><p>若两镜面夹角为 α，最终旋转角是 2α。Rotor 本身只包含 α，这正是四元数和转子中半角反复出现的几何来源。</p></section>
    <figure className="equation-card large"><code>x″ = (ba)x(ab) = R x R̃, &nbsp;&nbsp; R=ba=cos α−B sin α=e⁻ᴮᵅ</code><figcaption>B 是两法向张成的单位旋转平面；符号取决于镜面顺序与平面定向。</figcaption></figure>
    <DoubleReflectionLab />
    <section className="derivation-steps"><article><span>01</span><h3>第一次反射</h3><code>x′=−axa</code><p>假设 a 是欧氏单位法向，因此 a⁻¹=a。</p></article><article><span>02</span><h3>第二次反射</h3><code>x″=−bx′b=baxa b</code><p>结合律允许把外侧因子组合。</p></article><article><span>03</span><h3>识别 rotor</h3><code>R=ba, R̃=ab, RR̃=1</code><p>两个单位向量的乘积是单位偶 versor。</p></article></section>
    <section className="prose-block compact"><span>02 · THE PLANE MATTERS MORE THAN AN AXIS</span><h2>反射对直接指定旋转平面</h2><p>a、b 张成的双向量给出旋转平面，α 给出 rotor 参数。三维中可把该平面对偶成旋转轴；高维中仍然直接使用平面，因此双反射构造不依赖三维特例。</p></section>
    <section className="definition-callout"><span>顺序</span><p>交换镜面顺序会把 <b>R=ba</b> 换成 <b>R̃=ab</b>，从而反转旋转方向。和四元数复合一样，最先执行的变换写在最靠近 x 的位置。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>从镜面预测 rotor</h3><ul><li>把夹角设为 0°，确认两次同一反射等于恒等变换。</li><li>把夹角改为正负相反，观察最终旋转方向如何翻转。</li><li>固定镜面，只改变初始向量，确认所有向量都被旋转同一个 2α。</li></ul></section>
  </div>;
}

export function RotorSandwichLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ONE TRANSFORMATION FOR EVERY GEOMETRIC OBJECT</span><h2>Rotor 不只旋转向量，也旋转向量张成的所有 blade</h2><p>单位 rotor R 是满足 <i>RṘ=1</i> 的偶 versor。它通过 <i>X′=RXṘ</i> 作用于向量、多向量和 blade。因为这是一种保持外积的正交 outermorphism，向量张成的平面、体积与复合对象会自动同步变换。</p><p>这避免了为点、方向、法向量和面片分别维护变换规则：先用同一 sandwich 作用，再按需要读取各 grade。</p></section>
    <figure className="equation-card large"><code>X′ = R X R̃, &nbsp;&nbsp; R R̃ = 1, &nbsp;&nbsp; R = exp(−Bθ/2)</code><figcaption>B 指定旋转平面，θ 是物理旋转角；单位条件保证 R̃=R⁻¹。</figcaption></figure>
    <RotorActionLab />
    <section className="derivation-steps"><article><span>vector</span><h3>方向旋转</h3><code>v′=RvR̃</code><p>长度与向量平方保持不变。</p></article><article><span>blade</span><h3>子空间同步旋转</h3><code>R(a∧b)R̃=(RaR̃)∧(RbR̃)</code><p>平面的面积与定向随生成向量一起变化。</p></article><article><span>multivector</span><h3>按 grade 线性作用</h3><code>⟨RMR̃⟩ₖ=R⟨M⟩ₖR̃</code><p>正交 rotor 不混合 grade。</p></article></section>
    <section className="prose-block compact"><span>02 · STRUCTURE PRESERVATION</span><h2>同一个 sandwich 保持几何积关系</h2><p>对 rotor 诱导的正交变换，有 <i>R(AB)Ṙ=(RAR̃)(RBR̃)</i>。因此正交、相交、面积和乘法关系不只是“看起来没变”，而是代数结构本身被保持。</p></section>
    <section className="definition-callout"><span>尺度提醒</span><p>若 R 未归一化，使用 <b>RXR̃</b> 会夹带尺度。一般可逆偶元素应使用 <b>RXR⁻¹</b>；旋转实现通常维护 RR̃=1，以便 reverse 直接充当逆。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>对三种 grade 使用同一 rotor</h3><ul><li>切换 vector、bivector、trivector，确认输入输出 grade 不变。</li><li>改变旋转轴，观察平面和体积框架如何同步改变。</li><li>解释为什么三向量的系数在保持定向旋转下不变，但立方体的投影视图仍会旋转。</li></ul></section>
  </div>;
}

export function BivectorExpLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · FROM AN INFINITESIMAL PLANE TO A FINITE ROTATION</span><h2>双向量是旋转生成元，指数把它积累成 rotor</h2><p>单位欧氏双向量 B 满足 <i>B²=−1</i>，其幂在标量与 B 之间循环。把指数级数按偶数项和奇数项分组，便得到余弦与正弦；因此 <i>exp(−Bθ/2)</i> 自动落在单位 rotor 圆上。</p><p>指数映射把线性的生成元空间连接到非线性的旋转群。θ 很小时，<i>R≈1−Bθ/2</i>，双向量直接描述无穷小旋转。</p></section>
    <figure className="equation-card large"><code>e⁻ᴮᶿ⁄² = 1 − Bθ/2 + B²(θ/2)²/2! + … = cos(θ/2) − B sin(θ/2)</code><figcaption>画布将有限阶 Taylor 和与精确 rotor 对照；角度越大，需要越多项。</figcaption></figure>
    <BivectorExpLogLab />
    <section className="derivation-steps"><article><span>B²=−1</span><h3>圆形旋转</h3><code>exp(Bt)=cos t+B sin t</code><p>对应欧氏旋转平面。</p></article><article><span>B²=+1</span><h3>双曲旋转</h3><code>exp(Bt)=cosh t+B sinh t</code><p>时空 boost 会使用这一结构。</p></article><article><span>B²=0</span><h3>幂零生成元</h3><code>exp(Bt)=1+Bt</code><p>PGA 平移器的指数在有限项终止。</p></article></section>
    <section className="prose-block compact"><span>02 · LOGARITHM HAS BRANCHES</span><h2>从 rotor 读回生成元不是全局唯一的</h2><p>旋转增加整圈后可得到同一姿态，而 R 与 −R 也产生同一 sandwich。因此 log(R) 必须选择分支。常用“最短旋转”会先统一 rotor 半球，再把物理角限制在 (−180°,180°]；若应用需要累计圈数，就必须额外保存路径信息。</p><p>接近 R=−1 时，旋转平面难以从微小的双向量部分稳定恢复，这是轴角在 180°/360° 邻域出现不适定性的同一问题。</p></section>
    <section className="definition-callout"><span>数值实现</span><p>小角时使用 sinc 展开，接近分支切口时保持历史连续性，并在调用 log 前归一化 rotor。不要只依赖单次 atan2 返回值重建累计运动。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>观察级数与分支</h3><ul><li>固定低阶 Taylor，增大角度并观察误差如何增长。</li><li>增加最高阶，确认近似点向单位圆上的精确点收敛。</li><li>让 θ 穿过 ±180°，观察最短 log 代表为何发生跳变。</li></ul></section>
  </div>;
}

export function RotorInterpolationLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · INTERPOLATE WITH THE RELATIVE ROTOR</span><h2>先求“还差多少旋转”，再按比例走完它</h2><p>从 R₀ 到 R₁ 的自然插值先构造相对 rotor <i>Δ=Ṙ₀R₁</i>，用 log(Δ) 读出生成平面与半角，再将生成元缩放 t 并指数回群。这样得到的路径具有恒定群速度，并始终保持单位 rotor。</p><p>在 Cl⁺(3,0) 中，这正是四元数 SLERP 的 GA 写法；在更高维中，公式仍直接使用双向量 log，不需要三维旋转轴。</p></section>
    <figure className="equation-card large"><code>R(t) = R₀ exp(t log(R̃₀R₁)), &nbsp;&nbsp; 0≤t≤1</code><figcaption>若 R₀、R₁ 为单位 rotor，则相对 rotor 也为单位；实际代码仍应处理归一化误差和分支。</figcaption></figure>
    <RotorInterpolationLab />
    <section className="derivation-steps"><article><span>relative</span><h3>移到局部起点</h3><code>Δ=R̃₀R₁</code><p>把问题化为从恒等 rotor 走到 Δ。</p></article><article><span>log</span><h3>进入线性生成元空间</h3><code>L=log Δ</code><p>L 是双向量，可按实数 t 缩放。</p></article><article><span>exp</span><h3>回到旋转群</h3><code>R(t)=R₀eᵗᴸ</code><p>每个中间状态仍满足单位约束。</p></article></section>
    <section className="prose-block compact"><span>02 · AVERAGING NEEDS A CHOSEN CHART</span><h2>多个 rotor 不能简单逐分量平均</h2><p>多个姿态的平均通常先选择参考 rotor，把每个相对旋转映到 log 空间，做加权平均后再 exponentiate；若姿态分散很大，则迭代求 Karcher mean。结果依赖分支、权重和距离定义，不存在适用于所有场景的唯一“平均姿态”。</p></section>
    <section className="definition-callout"><span>R 与 −R</span><p>两个代表产生相同终点姿态，却可能让插值走短弧或长弧。普通动画会选择与前一帧点积为正的代表；需要累计旋转的轨迹则不能丢掉圈数。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>比较同终点的两条路径</h3><ul><li>切换 R₁ 与 −R₁ 代表，观察终点相同但中间路径不同。</li><li>固定 t，改变目标角，确认路径速度与相对 log 大小成正比。</li><li>解释为什么线性平均 rotor 分量后必须归一化，而 log-exp 路径天然保持约束。</li></ul></section>
  </div>;
}

export function NDRotationLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ADVANCED OVERVIEW</span><h2>四维旋转围绕平面，而不是围绕一条轴</h2><p>三维旋转总能用一条固定轴描述，因为旋转平面的正交补恰好是一维。四维中，一个平面的正交补仍是另一个平面，因此最一般的旋转会同时在两个正交平面中以不同角速度进行。</p><p>画布把超立方体先在 XY 平面旋转 α，再在 ZW 平面旋转 β，最后投影到二维。两个旋转彼此交换，因为它们作用于互不相交的坐标平面。</p></section>
    <FourDRotationLab />
    <section className="derivation-steps"><article><span>simple</span><h3>简单旋转</h3><code>β=0</code><p>只在一个平面旋转，正交补平面逐点保持。</p></article><article><span>double</span><h3>双旋转</h3><code>α≠0, β≠0</code><p>两个正交平面同时旋转，通常没有非零固定向量。</p></article><article><span>isoclinic</span><h3>等斜旋转</h3><code>|α|=|β|</code><p>两个平面具有相同角速度，是四维特有的重要类别。</p></article></section>
    <section className="prose-block compact"><span>02 · BIVECTOR CANONICAL PLANES</span><h2>高维旋转生成元可分解为互相交换的简单双向量</h2><p>在欧氏空间中，一般反对称生成元可以在合适正交基下分解成若干互相正交的二维旋转块。四维最多出现两个块；更高维则继续增加。这里不展开谱分解，只需把“双向量指定旋转平面”作为高维直觉。</p></section>
    <section className="definition-callout"><span>不要寻找 4D 轴</span><p>四维双旋转通常没有一条像三维那样的固定轴。用两个平面角或双向量生成元描述，比强行类比三维轴角更准确。</p></section>
    <section className="checkpoint"><span>图形任务</span><h3>识别三类四维旋转</h3><ul><li>把任一平面角归零，观察分类变为 simple rotation。</li><li>令两个角绝对值相同，观察 isoclinic 状态。</li><li>改变投影深度，区分“投影形状改变”与“四维旋转参数改变”。</li></ul></section>
  </div>;
}

export function PinSpinLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · FROM INDIVIDUAL VERSORS TO TRANSFORMATION GROUPS</span><h2>Pin 收集全部正交变换，Spin 收集其中的偶数次反射</h2><p>前六课一直在构造单个变换；现在把所有可复合、可逆并含恒等元的变换组织成群。设空间度量非退化，Pin(p,q) 由平方为 ±1 的向量乘积生成。含 k 个向量因子的 versor V 通过 <i>ρ(V)(x)=(−1)ᵏVxV⁻¹</i> 作用于向量。</p><p>k 为奇数时，变换含奇数次反射，行列式为 −1；k 为偶数时定向保持，V 位于 Clifford 代数的偶部，这个子群就是 Spin(p,q)。</p></section>
    <figure className="equation-card large"><code>Spin(p,q) = Pin(p,q) ∩ Cl⁺(p,q), &nbsp;&nbsp; det ρ(V) = (−1)ᵏ</code><figcaption>显式因子分解并不唯一，但因子个数的奇偶性与变换是否保持定向一致。</figcaption></figure>
    <PinSpinCoverLab />
    <section className="derivation-steps"><article><span>one vector</span><h3>一次反射</h3><code>ρ(n)(x)=−nxn⁻¹</code><p>属于 O(p,q)，但不属于 SO(p,q)。</p></article><article><span>even versor</span><h3>偶数次反射</h3><code>R=n₂n₁, ρ(R)(x)=RxR⁻¹</code><p>两个奇次符号抵消，得到定向保持的 rotor。</p></article><article><span>composition</span><h3>群乘法</h3><code>ρ(V₂V₁)=ρ(V₂)∘ρ(V₁)</code><p>代数乘法顺序直接编码变换复合。</p></article></section>
    <section className="prose-block compact"><span>02 · WHY IT IS A DOUBLE COVER</span><h2>V 与 −V 是不同群元素，却投影到同一正交变换</h2><p>在 sandwich 中，左右两个负号总会抵消，所以 <i>ρ(V)=ρ(−V)</i>。覆盖映射的核恰好是 &#123;+1,−1&#125;，因此每个正交变换有两个 Pin 代表，每个特殊正交变换有两个 Spin 代表。</p></section>
    <div className="formula-bridge"><div><span>全部正交变换</span><code>1 → &#123;±1&#125; → Pin(p,q)</code><code>Pin(p,q) → O(p,q) → 1</code></div><i>⊃</i><div><span>定向保持部分</span><code>1 → &#123;±1&#125; → Spin(p,q)</code><code>Spin(p,q) → SO(p,q) → 1</code></div></div>
    <section className="definition-callout"><span>twisted adjoint</span><p>奇 versor 不能直接沿用 rotor 的 <b>VxV⁻¹</b>：一次反射需要额外负号。统一写法是 <b>(−1)ᵏVxV⁻¹</b>，等价地使用 grade involution 定义 twisted adjoint。不同教材可能把 involution 放在左因子或逆上，比较公式时应先核对约定。</p></section>
    <section className="prose-block compact"><span>03 · FAMILIAR SPECIAL CASES</span><h2>复数、单位四元数和一般 rotor 是同一张图上的不同维数</h2><p><i>Spin(2)≅U(1)</i>，单位复数覆盖二维旋转；<i>Spin(3)≅SU(2)</i>，单位四元数覆盖 SO(3)；<i>Spin(4)≅SU(2)×SU(2)</i>，对应上一课看到的两个独立四维旋转平面。Spin 不是额外添加的表示，而是 Clifford 乘法内部已经存在的旋转群。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>用奇偶性预测群与不变量</h3><ul><li>把反射因子数从 1 调到 4，先预测 det ρ(V)，再看读数。</li><li>切换 V 与 −V，确认画布中的最终坐标框架完全不变。</li><li>解释为什么“属于偶子代数”是进入 Spin 的必要条件，但任意偶多向量并不自动是单位 rotor。</li></ul></section>
  </div>;
}

export function LieAlgebraLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · LINEARIZE THE GROUP NEAR IDENTITY</span><h2>旋转群是弯曲的，但恒等元附近由双向量线性描述</h2><p>有限 rotor 位于非线性的单位约束曲面上；把时间参数 t 取很小，<i>R(t)=exp(−tB/2)≈1−tB/2</i>。所有可能的双向量 B 构成 Spin(p,q) 在恒等元处的切空间，也就是旋转的 Lie 代数。</p><p>对欧氏 n 维空间，这个双向量空间有 n(n−1)/2 个独立分量，恰好对应反对称矩阵的自由度。GA 直接把每个自由度解释成一个定向旋转平面。</p></section>
    <figure className="equation-card large"><code>R(t)=e⁻ᵗᴮ⁄², &nbsp;&nbsp; ẋ(0)=½(xB−Bx), &nbsp;&nbsp; dim Λ²(ℝⁿ)=n(n−1)/2</code><figcaption>双向量不是有限旋转本身，而是旋转路径在恒等元处的速度。</figcaption></figure>
    <LieAlgebraLab />
    <section className="derivation-steps"><article><span>tangent</span><h3>生成元</h3><code>B = −2 Ṙ(0)</code><p>在单位 rotor 曲面的切空间中，reverse 使双向量变号。</p></article><article><span>bracket</span><h3>交换子封闭</h3><code>[A,B]=AB−BA</code><p>两个双向量的交换子仍是双向量，因此可作为 Lie bracket。</p></article><article><span>action</span><h3>无穷小作用</h3><code>δx=½(xB−Bx)δt</code><p>它是 sandwich 作用对时间求导的结果。</p></article></section>
    <section className="prose-block compact"><span>02 · BCH MEASURES NONCOMMUTATIVITY</span><h2>两个小旋转的生成元只在一阶近似下直接相加</h2><p>若 A 与 B 交换，则 <i>exp(B)exp(A)=exp(A+B)</i>。一般旋转平面并不交换，Baker–Campbell–Hausdorff 公式会加入 <i>½[B,A]</i> 及更高嵌套交换子。画布中先绕 x 再绕 y，缺失的二阶项指向 z 方向；这就是有限旋转顺序差异在局部的第一道痕迹。</p></section>
    <figure className="equation-card"><code>log(eᴮeᴬ)=A+B+½[B,A]+1/12([B,[B,A]]+[A,[A,B]])+⋯</code><figcaption>这里 [A,B]=AB−BA。若资料把 GA commutator product 定义为 A×B=(AB−BA)/2，系数会随之改写。</figcaption></figure>
    <section className="prose-block compact"><span>03 · LOCAL COORDINATES, NOT GLOBAL ADDITION</span><h2>log 把附近姿态放进同一张局部坐标图</h2><p>状态估计、角速度积分和优化常在 log 空间更新：先把相对 rotor 映为双向量增量，再进行线性运算，最后 exp 回群。该做法只在选定分支和局部邻域内可靠；跨过 log 分支或姿态分散太大时，需要重新选参考点。</p></section>
    <section className="definition-callout"><span>量级检查</span><p>将 A、B 同时缩小为 εA、εB：直接相加的误差从 <b>O(ε²)</b> 开始；加入 ½[B,A] 后，剩余误差从 <b>O(ε³)</b> 开始。实验里的共同尺度滑块正是用来验证这个阶数关系。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>读出 BCH 的误差阶</h3><ul><li>逐步减小 ε，比较红色 A+B 误差与紫色 BCH₂ 误差谁下降得更快。</li><li>令 A 或 B 为零，确认交换子修正与两种误差都消失。</li><li>交换 α、β 的角色并思考：为什么二阶 z 分量会改变符号？</li></ul></section>
  </div>;
}
