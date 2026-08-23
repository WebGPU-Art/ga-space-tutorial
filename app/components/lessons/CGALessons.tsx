'use client';

import { CGAEuclideanMotionLab, CGAIntersectionLab, CGAObjectDecoderLab, ConformalEmbeddingLab, RoundFlatBuilderLab } from '../labs/CGALabs';
import { ConformalOperatorsLab, ModelGeometryLab } from '../labs/ConformalAdvancedLabs';

export function ConformalEmbeddingLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ADD TWO NULL DIRECTIONS</span><h2>共形模型把 n 维欧氏空间嵌入到 G(n+1,1)</h2><p>CGA 在欧氏基之外加入一个正平方和一个负平方方向，再组合成两个 null 向量 <i>n₀</i> 与 <i>n∞</i>。它们各自平方为零，但互相不正交：<i>n₀·n∞=−1</i>。n₀ 负责原点，n∞ 负责无穷远与尺度规范。</p><p>这与 PGA 的单个退化基不同：CGA 的整体度量是非退化的，null 性来自光锥结构，而不是度量矩阵缺秩。</p></section>
    <figure className="equation-card large"><code>n₀²=n∞²=0, &nbsp;&nbsp; n₀·n∞=−1, &nbsp;&nbsp; x·n₀=x·n∞=0</code><figcaption>二维欧氏平面进入 G(3,1)，三维欧氏空间进入 G(4,1)。</figcaption></figure>
    <ConformalEmbeddingLab />
    <section className="derivation-steps"><article><span>embed</span><h3>抬升欧氏点</h3><code>P(x)=n₀+x+½x²n∞</code><p>二次项把位置放到 null cone 上。</p></article><article><span>null</span><h3>验证平方为零</h3><code>P²=x²+2(½x²)(−1)=0</code><p>每个有限欧氏点都对应一个 null 向量。</p></article><article><span>normalize</span><h3>固定射影尺度</h3><code>P·n∞=−1</code><p>这是画布所显示的仿射切片。</p></article></section>
    <section className="prose-block compact"><span>02 · DISTANCE BECOMES AN INNER PRODUCT</span><h2>两点之间的欧氏平方距离藏在共形内积里</h2><p>将两个嵌入点展开，欧氏分量给出 x·y，两个 null 交叉项给出 <i>−(x²+y²)/2</i>，合起来正是 <i>−‖x−y‖²/2</i>。因此距离约束能被写成线性内积关系，随后圆、球、平面等对象也能统一成 blade 与 IPNS/OPNS 表示。</p></section>
    <figure className="equation-card"><code>P(x)·P(y)=−½‖x−y‖²</code><figcaption>若共形点没有先规范化到 P·n∞=−1，右侧还会携带两个射影权重。</figcaption></figure>
    <section className="prose-block compact"><span>03 · WHAT THE CANVAS CAN AND CANNOT SHOW</span><h2>抛物面只是 null cone 的一个归一化坐标图</h2><p>二维 CGA 已有四个代数坐标，浏览器画布无法直接展示完整的 4D null cone。实验右侧绘制的是固定 <i>P·n∞=−1</i> 后，把 n₀ 与 n∞ 系数压成高度 <i>z=‖x‖²/2</i> 的仿射图。它准确展示二次抬升，却不应被误认成完整共形空间。</p></section>
    <section className="definition-callout"><span>射影恢复</span><p>一般非零 null 代表 X 若满足 <b>X·n∞≠0</b>，先除以 <b>−X·n∞</b> 即可回到标准点规范。比例缩放不改变几何点，但会改变未经规范化的内积数值。</p></section>
    <section className="prose-block compact"><span>04 · WHY THIS MODEL IS WORTH TWO DIMENSIONS</span><h2>下一步将让点、圆、球、平面和共形变换进入同一外积语言</h2><p>多个共形点的外积可以直接张成点对、圆与球；与 n∞ 的关系区分圆和平面、球和超平面。反射、旋转、平移、缩放与反演随后都可写成 versor sandwich。本课只建立点嵌入和距离不变量，避免在理解 null 规范之前堆叠高级公式。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>用拖动验证三条不变量</h3><ul><li>分别拖动 p、q，确认每个嵌入点始终满足 P²=0 与 P·n∞=−1。</li><li>让 p=q，观察 P·Q 与欧氏距离同时归零。</li><li>将两点距离加倍，验证 P·Q 的绝对值变为原来的四倍。</li></ul></section>
  </div>;
}

export function RoundsFlatsLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · BLADES BECOME GEOMETRIC DATA TYPES</span><h2>外积几个共形点，就得到经过这些点的最小 round</h2><p>共形点都是 1-vector，但它们的外积不再只表示线性子空间。两个点 <i>P₁∧P₂</i> 是点对，三个非共线点 <i>P₁∧P₂∧P₃</i> 是圆，四个非共面点 <i>P₁∧P₂∧P₃∧P₄</i> 是球。它们统称 round：拥有有限中心和半径的弯曲对象。</p><p>这种写法称为 OPNS（outer-product null-space）或直接表示。任意共形点 X 位于对象 A 上，当且仅当 <i>X∧A=0</i>；构造式与关联测试使用同一外积语言。</p></section>
    <figure className="equation-card large"><code>PP=P₁∧P₂, &nbsp; C=P₁∧P₂∧P₃, &nbsp; Σ=P₁∧P₂∧P₃∧P₄</code><figcaption>点对、圆、球分别是 0-sphere、1-sphere、2-sphere。</figcaption></figure>
    <RoundFlatBuilderLab />
    <section className="derivation-steps"><article><span>grade 2</span><h3>点对</h3><code>PP=P₁∧P₂</code><p>可分解为两个实点、一个重合点，或一对共轭虚点。</p></article><article><span>grade 3</span><h3>二维圆 / 三维圆</h3><code>C=P₁∧P₂∧P₃</code><p>在三维中还携带圆所在载体平面。</p></article><article><span>grade 4</span><h3>三维球</h3><code>Σ=P₁∧P₂∧P₃∧P₄</code><p>四点共面时结果退化，不能唯一确定球。</p></article></section>
    <section className="prose-block compact"><span>02 · FLATS ARE ROUNDS THROUGH INFINITY</span><h2>把 n∞ 加入外积，就把弯曲对象拉直</h2><p>经过两个有限点的直线写成 <i>L=P₁∧P₂∧n∞</i>；经过三个不共线点的平面写成 <i>π=P₁∧P₂∧P₃∧n∞</i>。它们统称 flat。因为 n∞ 已是外积因子，flat 必满足 <i>F∧n∞=0</i>；一般 round 则不满足。</p></section>
    <div className="convention-table"><div><span>对象</span><span>OPNS / direct</span><span>关联条件</span></div><div><b>点对</b><code>P₁∧P₂</code><p>X∧PP=0</p></div><div><b>圆</b><code>P₁∧P₂∧P₃</code><p>X∧C=0</p></div><div><b>直线</b><code>P₁∧P₂∧n∞</code><p>X∧L=0，L∧n∞=0</p></div><div><b>球</b><code>P₁∧P₂∧P₃∧P₄</code><p>X∧Σ=0</p></div></div>
    <section className="prose-block compact"><span>03 · IPNS IS THE DUAL VIEW</span><h2>直接表示列出“哪些点张成对象”，对偶表示列出“哪些点与对象正交”</h2><p>对环境伪标量取对偶可在 OPNS 与 IPNS 之间切换。二维圆或三维球的 IPNS 是一个向量 <i>S=P(c)−r²n∞/2</i>，点 X 在其上时 <i>X·S=0</i>。同一个几何对象的直接与对偶表示适合不同运算，不存在永远更高级的一方。</p></section>
    <section className="definition-callout"><span>同 grade 不等于同类型</span><p>二维 CGA 中，圆与直线都可表现为 grade-3 OPNS blade。真正的分类需结合与 <b>n∞</b> 的关系及 blade 的平方；不能只看 grade。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>让 round 连续进入 flat 极限</h3><ul><li>在圆模式拖动 C，使 A、B、C 精确共线，观察圆心与半径走向无穷远。</li><li>切换直线，说明为何加入 n∞ 后不再需要“巨大半径”的数值表示。</li><li>切换三维球，确认四个定义点都在同一球面上且 grade 增加为 4。</li></ul></section>
  </div>;
}

export function CGAIntersectionsLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · MEET IS A TYPE-GENERIC INTERSECTION</span><h2>先把对象转到对偶空间做外积，再转回直接表示</h2><p>设 A、B 是 OPNS blades。它们的交集可用 regressive product 写成 <i>A∨B</i>；在固定环境维度与对偶约定下，可理解为 <i>(A*∧B*)*</i>。公式不需要预先判断是圆—圆、线—球还是球—球，结果的 grade 与代数性质会告诉我们交集类型。</p><p>二维圆的 IPNS 表示 S₁、S₂ 都是向量，因此 <i>(S₁∧S₂)*</i> 是 grade-2 点对：恰好装下最多两个交点。</p></section>
    <figure className="equation-card large"><code>meet(A,B)=A∨B=(A*∧B*)*, &nbsp;&nbsp; PP=(S₁∧S₂)*</code><figcaption>对偶和 meet 的整体符号随伪标量定向变化，但支撑集合不变。</figcaption></figure>
    <CGAIntersectionLab />
    <section className="derivation-steps"><article><span>h² &gt; 0</span><h3>两个实交点</h3><code>PP=P₊∧P₋</code><p>点对可在实数 CGA 中分解为两个不同 null 向量。</p></article><article><span>h² = 0</span><h3>相切</h3><code>P₊=P₋</code><p>交点合并为重根；数值上需用尺度相关阈值。</p></article><article><span>h² &lt; 0</span><h3>虚点对</h3><code>no real null factors</code><p>meet 仍非零，只是没有实欧氏点支撑。</p></article></section>
    <section className="prose-block compact"><span>02 · THE RADICAL AXIS IS THE CARRIER</span><h2>两个圆的公共弦位于一个 flat 上，即使交点已经变成虚数</h2><p>把两圆方程相减，二次项消去，得到一条直线：根轴。相交时它穿过两个交点，相切时经过切点；无实交点时它仍存在，并承载虚点对的方向和位置。CGA 中这对应先从 meet 结果提取 carrier，再判断 point pair 能否实分解。</p></section>
    <figure className="equation-card"><code>a=(r₁²−r₂²+d²)/(2d), &nbsp;&nbsp; h²=r₁²−a²</code><figcaption>画布用传统标量公式绘制同一个 CGA meet 的欧氏解码结果，便于观察实性判别。</figcaption></figure>
    <section className="prose-block compact"><span>03 · DEGENERACIES ARE PART OF THE ALGEBRA</span><h2>重合圆的交集不是一个点对，而是整圆</h2><p>当圆心与半径都相同时，<i>S₁∧S₂=0</i>：零 blade 表示输入约束线性相关，并不是“没有交点”。工程实现必须区分零结果、虚结果和切触结果。类似地，球—球 meet 通常是圆，球—平面 meet 也是圆，而相切时会降维为点。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>穿过交集类型的边界</h3><ul><li>移动 S₂，让 h² 从正值穿过 0 到负值，观察点对如何失去实因子。</li><li>固定圆心距离，改变半径使一个圆完全包含另一个，比较“外离”和“内含”都为何得到虚点对。</li><li>让两圆完全重合，解释 meet 为零与空交集的差别。</li></ul></section>
  </div>;
}

export function CGAExtractionLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · NORMALIZE BEFORE READING PARAMETERS</span><h2>blade 是射影对象，原始系数带着任意权重</h2><p>二维圆或三维球的 IPNS 向量可写成任意非零倍数 <i>S=λ[P(c)−r²n∞/2]</i>。先计算权重 <i>w=−S·n∞</i>，再令 <i>Ŝ=S/w</i>；只有归一化后，欧氏分量才是中心坐标，Ŝ 的平方才是半径平方。</p><p>负 λ 会翻转对象定向，但不改变支撑集合。直接对未归一化的 S 求平方会得到 <i>λ²r²</i>，不能当作实际半径。</p></section>
    <figure className="equation-card large"><code>w=−S·n∞, &nbsp; Ŝ=S/w, &nbsp; r²=Ŝ², &nbsp; P(c)=Ŝ+½r²n∞</code><figcaption>最后一式恢复的是规范化 null 中心点，而不是普通欧氏向量。</figcaption></figure>
    <CGAObjectDecoderLab />
    <section className="derivation-steps"><article><span>weight</span><h3>取出射影尺度</h3><code>w=−S·n∞</code><p>w≠0 才是有限中心的 dual round。</p></article><article><span>center</span><h3>读取欧氏位置</h3><code>c=u/w</code><p>u 是 S 的欧氏向量部分。</p></article><article><span>radius</span><h3>判别实性</h3><code>r²=‖c‖²−2β/w</code><p>正、零、负分别对应实 round、点 round、虚 round。</p></article></section>
    <section className="prose-block compact"><span>02 · ZERO WEIGHT CHANGES THE OBJECT FAMILY</span><h2>w=0 时不能继续除法；同一个 IPNS 向量分支为 flat</h2><p>一般 IPNS 向量写成 <i>S=w n₀+u+βn∞</i>。若 w=0，关联方程 <i>X·S=0</i> 中的二次项消失，变成欧氏线性方程 <i>x·u−β=0</i>：二维是直线，三维是平面。round 的“中心走向无穷远”在代数上正好落入 flat。</p></section>
    <div className="sign-table"><div><span>r² &gt; 0</span><b>real round</b><p>存在真实圆周或球面。</p></div><div><span>r² = 0</span><b>point round</b><p>半径收缩为零，仍是合法 null 点。</p></div><div><span>r² &lt; 0</span><b>imaginary round</b><p>代数对象存在，但没有实点满足 X·S=0。</p></div></div>
    <section className="prose-block compact"><span>03 · OPNS EXTRACTION STARTS WITH DUALIZATION</span><h2>环境满维 sphere 最容易；低维 circle 还需提取 carrier</h2><p>在二维环境，圆的 OPNS 对偶是一个 IPNS 向量，可直接套用本课公式；在三维环境，球同样如此。三维圆的对偶是 2-blade，同时编码 dual sphere 与载体平面，需先分解或用 <i>C∧n∞</i> 提取 carrier，再恢复圆心、半径和姿态。</p></section>
    <section className="definition-callout"><span>数值实现</span><p>分类阈值应相对于 blade 范数与输入尺度设置。先判断 <b>|w|</b>，再判断 <b>r²</b>；不要在 w 接近零时计算巨大中心后才试图修复。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>从系数而非图形预测对象</h3><ul><li>保持几何比例近似不变，同时整体缩放四个系数，确认解码参数不变。</li><li>调节 β 让 r² 穿过零，观察实圆、点圆和虚圆的连续变化。</li><li>令 w 接近零，解释为何正确处理是切换 flat 分支，而不是报告无限大圆心。</li></ul></section>
  </div>;
}

export function CGAEuclideanMotionsLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · EUCLIDEAN MOTIONS ARE A CONFORMAL SUBGROUP</span><h2>旋转沿用欧氏 rotor，平移成为含 n∞ 的 rotor</h2><p>欧氏旋转生成元完全位于原来的欧氏子空间，所以 <i>R=exp(−θB/2)</i> 原样进入 CGA。位移 t 的 translator 则写成 <i>T=exp(n∞t/2)</i>；因为 <i>(n∞t)²=0</i>，指数精确终止为一次式。组合 <i>M=TR</i> 就是 CGA 中的 Euclidean motor。</p><p>采用主动 sandwich <i>X′=MXM̃</i> 时，M 不只作用于点；任何由点外积构造的线、圆、球都被同一 outermorphism 一起搬运。</p></section>
    <figure className="equation-card large"><code>T(t)=exp(½n∞t)=1+½n∞t, &nbsp; M=TR, &nbsp; X′=MXM̃</code><figcaption>等价写法 1−tn∞/2 只利用了 n∞t=−tn∞。</figcaption></figure>
    <CGAEuclideanMotionLab />
    <section className="derivation-steps"><article><span>point</span><h3>位置改变</h3><code>P(x)↦P(Rx+t)</code><p>结果仍满足 P²=0 与 P·n∞=−1。</p></article><article><span>flat</span><h3>方向与偏移同步</h3><code>L↦MLM̃</code><p>无需提取端点再重建直线。</p></article><article><span>round</span><h3>中心移动、半径保持</h3><code>S↦MSM̃</code><p>圆球关联与切触关系随变换保持。</p></article></section>
    <section className="prose-block compact"><span>02 · FIXING INFINITY CHARACTERIZES THE EUCLIDEAN SUBGROUP</span><h2>欧氏 motor 保持 n∞，因此也保持距离尺度</h2><p>旋转和平移都满足 <i>Mn∞M̃=n∞</i>。于是共形点内积 <i>P·Q=−‖p−q‖²/2</i> 不变，圆球半径不变，flat 仍是 flat。后续反演与一般共形变换可以改变 n∞，保持角度却不再保持所有距离。</p></section>
    <figure className="equation-card"><code>Mn∞M̃=n∞ ⇒ (MPM̃)·(MQM̃)=P·Q</code><figcaption>这把“刚体运动保持距离”变成一个代数不变量。</figcaption></figure>
    <section className="prose-block compact"><span>03 · PGA OR CGA?</span><h2>只做刚体运动时 PGA 更紧凑；涉及圆球约束时 CGA 更直接</h2><p>PGA motor 与 CGA Euclidean motor 都覆盖 SE(n)，并可互相转换。PGA 使用更少维度，适合姿态、机器人链和图形变换；CGA 增加两维的成本换来圆、球、点对、反演和统一相交。模型选择应由需要表达的对象决定，而不是把 CGA 当作 PGA 的“升级版”。</p></section>
    <section className="definition-callout"><span>复合次序</span><p><b>M=TR</b> 在 X′=MXM̃ 约定下仍表示先 R 后 T。切换到被动变换、反向 sandwich 或其他基次序时，translator 的符号和阅读顺序必须一起核对。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>验证一个 motor 对多种对象的通用性</h3><ul><li>调节 θ 与 t，确认黄色点始终位于移动后的蓝色圆上。</li><li>观察圆半径残差保持数值零，同时直线仍无限延伸。</li><li>比较上一模块 PGA motor：列出 CGA 多出的对象能力和代数维度成本。</li></ul></section>
  </div>;
}

export function ConformalOperatorsLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · BEYOND EUCLIDEAN MOTIONS</span><h2>共形变换保持局部角度，却可以改变长度、曲率与无穷远</h2><p>上一课的 Euclidean motor 固定 n∞，因而保持距离。一般 CGA versor 不必固定 n∞；它仍把 null 点映成 null 点，并保持两个曲线相交时的夹角，但线段长度和圆半径可以随位置改变。反演、缩放与特殊共形变换都属于这一更大的群。</p><p>“共形”是局部性质：在非奇异点附近，Jacobian 等于一个正缩放乘一个正交变换。因此一个很小的正方形会变成旋转或反射后的正方形，而大网格可以弯成圆弧族。</p></section>
    <figure className="equation-card large"><code>X′∼VXṼ, &nbsp;&nbsp; X²=0 ⇒ X′²=0, &nbsp;&nbsp; angle′=angle</code><figcaption>符号 ∼ 提醒我们：变换后的 null 向量仍需按 −X′·n∞ 重新规范化。</figcaption></figure>
    <ConformalOperatorsLab />
    <section className="derivation-steps"><article><span>inversion</span><h3>球反射</h3><code>x′=c+R²(x−c)/‖x−c‖²</code><p>反演中心与无穷远互换，方向定向翻转。</p></article><article><span>dilation</span><h3>均匀缩放</h3><code>Dα=exp[−½(ln α)E₀]</code><p>E₀=n∞∧n₀；原点固定，距离整体乘 α。</p></article><article><span>transversion</span><h3>特殊共形变换</h3><code>K=I T I</code><p>反演—平移—反演，产生位置相关缩放。</p></article></section>
    <section className="prose-block compact"><span>02 · SPHERE REFLECTION LINEARIZES IN CGA</span><h2>欧氏分式映射在共形空间里只是一次 sandwich</h2><p>以 IPNS 球向量 S 作为反射器，点的反演可写成 <i>X′∼−SXS⁻¹</i>。在欧氏坐标中它含有除以距离平方的分母；在 CGA 中，分母被吸收到 null 向量的射影权重，sandwich 本身保持线性。最后重新规范化才回到有限坐标。</p></section>
    <div className="sign-table"><div><span>POINT</span><b>point ↔ point</b><p>球心映到 n∞；球面上的点保持不动。</p></div><div><span>LINE</span><b>line ↔ circle</b><p>不过反演中心的线变圆；通过中心的线仍是线。</p></div><div><span>CIRCLE</span><b>circle ↔ circle/line</b><p>是否经过反演中心决定结果类型。</p></div></div>
    <section className="prose-block compact"><span>03 · SINGULARITIES ARE PROJECTIVE EVENTS</span><h2>分母为零不是实现异常，而是结果落到无穷远</h2><p>反演中心没有有限像；特殊共形变换的某个圆或点集也可能被送到 n∞。绘图代码必须在反齐次化之前检查权重，分段绘制穿过无穷远的曲线。画布遇到这一情况会中断屏幕折线，而不是跨越整个窗口连接两个巨大坐标。</p></section>
    <section className="definition-callout"><span>反射符号</span><p>有些资料写 <b>SXS⁻¹</b>，有些写 <b>−SXS⁻¹</b> 或使用 grade involution。对 null 点而言整体负号代表同一射影点；但处理有定向的线、圆与切向量时必须保留所选约定。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>用网格检查“等角但不等距”</h3><ul><li>拖动 probe 接近反演中心，观察局部尺度急剧增大而局部直角仍约为 90°。</li><li>切换 dilation，确认网格保持直线且所有位置缩放相同。</li><li>切换 I·T·I，找出分母接近零的区域，并解释曲线为何经过无穷远。</li></ul></section>
  </div>;
}

export function NonEuclideanCGALesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · GEOMETRY IS OBJECTS PLUS AN ABSOLUTE</span><h2>同一射影/共形对象库，换一个“无穷远”就会改变度量</h2><p>欧氏 CGA 把 n∞ 选作特殊 null 向量：固定它的 versor 形成欧氏运动群。更一般地，可选择另一个 1-blade 或绝对二次曲面来定义哪些点属于边界、哪些变换算作运动。选择的平方与签名不同，会得到零、负、正常曲率模型。</p><p>本课只建立结构直觉，不推导完整的 Cayley–Klein 距离公式。画布使用三个熟悉坐标图：欧氏平面、Poincaré 圆盘和球面/椭圆射影图；曲线看起来弯曲，不代表内在空间嵌在更高维后真的“受力弯曲”。</p></section>
    <figure className="equation-card large"><code>geometry = projective/conformal points + chosen absolute Ω + transformations that preserve Ω</code><figcaption>Ω 扮演无穷远、边界或极面的角色；它决定距离、测地线和运动群。</figcaption></figure>
    <ModelGeometryLab />
    <section className="derivation-steps"><article><span>K=0</span><h3>Euclidean</h3><code>geodesic = line</code><p>平行线共享理想点，三角形内角和为 π。</p></article><article><span>K&lt;0</span><h3>Hyperbolic</h3><code>disk geodesic ⟂ boundary</code><p>Poincaré 圆盘中测地线是与边界正交的圆弧或直径。</p></article><article><span>K&gt;0</span><h3>Elliptic</h3><code>geodesic = great circle</code><p>对径点认同后任意两条“直线”相交，没有平行线。</p></article></section>
    <section className="prose-block compact"><span>02 · THE CHART DISTORTS, THE METRIC CORRECTS</span><h2>圆盘边界看似有限远，在双曲度量中却无限遥远</h2><p>Poincaré 坐标把整个双曲平面压进单位圆。越靠近边界，同样的屏幕位移对应越大的内在距离；因此测地线虽显示为圆弧，局部仍是最直路径。球面正投影也会压缩背面，本实验用虚线显示后半段，并提醒椭圆几何认同对径点。</p></section>
    <figure className="equation-card"><code>d_H(A,B)=arcosh(1+2‖A−B‖²/[(1−‖A‖²)(1−‖B‖²)])</code><figcaption>画布只在单位圆内部使用此曲率归一化为 −1 的距离。</figcaption></figure>
    <section className="prose-block compact"><span>03 · GEODESICS ARE MODEL BLADES</span><h2>“直线”仍可由代数中的 blade 表示，只是关联条件改由 Ω 解释</h2><p>在常曲率模型中，测地线可以看作通过模型原点/极点关系裁出的圆或平面；保持 Ω 的 versor 会把测地线映成测地线。于是交点、反射和运动仍使用 meet、join 与 sandwich，只是从 blade 提取“距离”的公式随模型变化。</p></section>
    <section className="definition-callout"><span>CGA 与 PGA</span><p>椭圆和双曲几何也可直接使用非退化 PGA 签名建模，通常更紧凑。本页采用 CGA 视角，是为了比较“选择不同 absolute”如何复用共形对象与 versor；这不是唯一实现。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>区分屏幕弯曲与内在弯曲</h3><ul><li>在三种模式保持 A、B 屏幕位置相同，比较三种内在距离。</li><li>双曲模式把端点推向边界，观察距离发散和圆弧仍保持边界正交。</li><li>椭圆模式追踪大圆背面虚线，解释为何对径认同后路径长度取 θ 与 π−θ 的较小者。</li></ul></section>
  </div>;
}
