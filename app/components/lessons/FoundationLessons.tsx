'use client';

import { BasisChangeLab, ComplexRotationLab, DotProductLab, OrientationLab } from '../labs/FoundationLabs';

export function ComplexRotationLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · A ROTATION YOU ALREADY KNOW</span><h2>复数不是一对数，而是平面上的乘法</h2><p>把复数 <i>z = x + yi</i> 画在复平面上，它既可以看成点，也可以看成从原点出发的有向线段。关键不在加法，而在乘法：乘以 <i>i</i> 会把任意向量旋转 90°，因为 <i>i² = −1</i> 又会再旋转 90°。</p><p>这给出本教程反复出现的模式：一个<span>平方为 −1 的元素</span>可以生成圆形旋转。稍后，双向量会扮演同样角色。</p></section>
    <figure className="equation-card large"><code>z = r(cos φ + i sin φ) = r eⁱᶲ</code><figcaption>模长 r 决定缩放，相角 φ 决定方向；极坐标把这两个作用拆开。</figcaption></figure>
    <section className="derivation-steps"><article><span>01</span><h3>模长相乘</h3><code>|wz| = |w||z|</code><p>乘数 w 的模长决定结果离原点变远还是变近。</p></article><article><span>02</span><h3>相角相加</h3><code>arg(wz) = arg(w) + arg(z)</code><p>旋转复合从“做两次动作”变成普通加法。</p></article><article><span>03</span><h3>单位复数</h3><code>|w| = 1 ⇒ 只旋转</code><p>单位圆上的复数保持所有向量的长度。</p></article></section>
    <ComplexRotationLab />
    <section className="definition-callout"><span>连接到 GA</span><p>二维欧氏几何代数中的单位双向量 <b>I = e₁e₂</b> 同样满足 <b>I² = −1</b>。因此复数旋转可写成 <b>R = e⁻ᴵᶿ⁄²</b>；它不是一个偶然类比，而是旋转代数的第一个实例。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>验证三件事</h3><ul><li>固定 |w| = 1，改变相角；确认结果长度始终等于原向量。</li><li>固定相角，改变 |w|；确认方向差不变而长度按比例变化。</li><li>令 arg(w) = 180°，解释为什么这等价于乘以 −1。</li></ul></section>
  </div>;
}

export function CoordinatesLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · OBJECT VS DESCRIPTION</span><h2>向量是对象，坐标是描述</h2><p>几何向量 <i>v</i> 不依赖你选择哪一组坐标轴。写成 <i>(1.35, 0.82)</i> 只是它在某组基中的坐标。如果转动或倾斜坐标基，向量本身没有移动，但表示它的两个数字会同时改变。</p><p>这一区分是“坐标无关”计算的起点。几何代数不会消灭坐标；它让公式先表达对象之间的关系，最后才选择坐标执行计算。</p></section>
    <figure className="equation-card large"><code>v = v¹b₁ + v²b₂ &nbsp;&nbsp;⇔&nbsp;&nbsp; [v]ᵦ = B⁻¹[v]ₑ</code><figcaption>B 的列是新基向量。主动变换改变对象；被动换基只改变坐标，两者不能混淆。</figcaption></figure>
    <BasisChangeLab />
    <section className="derivation-steps"><article><span>A</span><h3>基必须独立</h3><code>det B ≠ 0</code><p>两条基向量若共线，便不能唯一描述整个平面。</p></article><article><span>B</span><h3>正交基更方便</h3><code>B⁻¹ = Bᵀ</code><p>只有正交归一基才能直接用点积读取坐标。</p></article><article><span>C</span><h3>对象保持</h3><code>B[v]ᵦ = v</code><p>把新坐标乘回基矩阵，必须重建同一个几何向量。</p></article></section>
    <section className="definition-callout"><span>常见误区</span><p>“旋转一个向量”和“旋转坐标轴”会给出互为逆的坐标公式。前者是主动变换，后者是被动变换；代码里局部坐标与世界坐标的混乱通常来自这里。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>观察不变量</h3><ul><li>旋转基时，记录坐标如何变化，同时确认绿色向量不动。</li><li>增大基倾斜；观察 det B 接近零时坐标为何迅速变大。</li><li>将倾斜恢复为 0，验证正交基中的坐标等于与基向量的点积。</li></ul></section>
  </div>;
}

export function DotProductLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · METRIC INFORMATION</span><h2>点积回答：两个方向有多对齐？</h2><p>点积把两个向量压缩成一个标量。正值表示锐角方向，零表示正交，负值表示钝角方向。它同时携带长度与夹角信息，因此是欧氏空间度量的核心。</p><p>在几何代数中，点积不会消失；它成为几何积的标量部分。另一部分 <i>a∧b</i> 则保存点积丢掉的定向平面信息。</p></section>
    <figure className="equation-card large"><code>a · b = |a||b| cos θ</code><figcaption>如果 a 是单位向量，那么 a·b 就是 b 在 a 方向上的有符号投影长度。</figcaption></figure>
    <DotProductLab />
    <div className="sign-table"><div><span>θ &lt; 90°</span><b>a·b &gt; 0</b><p>大体同向</p></div><div><span>θ = 90°</span><b>a·b = 0</b><p>彼此正交</p></div><div><span>θ &gt; 90°</span><b>a·b &lt; 0</b><p>大体反向</p></div></div>
    <section className="prose-block compact"><span>02 · PROJECTION AND REJECTION</span><h2>把一个向量拆成平行与垂直</h2><p>若 <i>a</i> 不一定是单位向量，则 <i>projₐ(b) = (b·a / a·a)a</i>。剩下的 <i>b − projₐ(b)</i> 与 a 正交，称为 rejection。第 2.7 课会把这套分解推广到任意 blade 表示的子空间。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>从符号预测图形</h3><ul><li>不看读数，先根据夹角判断点积正负，再用仪表验证。</li><li>在 90° 附近微调角度，观察点积过零时投影方向如何翻转。</li><li>保持夹角不变，改变 |b|；解释点积为何线性变化。</li></ul></section>
  </div>;
}

export function OrientationLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ORIENTED SPACE</span><h2>定向不是坐标轴的颜色</h2><p>一组有序基 <i>(e₁,e₂,e₃)</i> 不只给出三个方向，也给出空间的手性。交换任意两条基向量会翻转定向；普通旋转不会。代数上，这由基矩阵行列式的符号区分。</p><p>几何代数用伪标量 <i>I = e₁e₂e₃</i> 记录整体定向。镜像会让 <i>I</i> 变号，而保持定向的旋转不会。</p></section>
    <figure className="equation-card large"><code>I′ = det(B) I &nbsp;&nbsp;·&nbsp;&nbsp; det(B) = +1 rotation, −1 reflection</code><figcaption>行列式的绝对值描述体积缩放，符号描述定向是否翻转。</figcaption></figure>
    <OrientationLab />
    <section className="derivation-steps"><article><span>01</span><h3>旋转保持定向</h3><code>det R = +1</code><p>旋转属于特殊正交群 SO(3)。</p></article><article><span>02</span><h3>反射翻转定向</h3><code>det M = −1</code><p>反射属于 O(3)，但不属于 SO(3)。</p></article><article><span>03</span><h3>叉积是伪向量</h3><code>a × b = −I(a ∧ b)</code><p>镜像下 I 变号，因此叉积不像普通向量那样变换。</p></article></section>
    <section className="definition-callout"><span>为什么 GA 更清楚</span><p>外积 <b>a∧b</b> 直接表示由 a、b 张出的定向平面，不需要先借助空间整体定向把它转换成“法向量”。因此它在二维、三维和更高维中都保持同一种含义。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>分辨旋转与镜像</h3><ul><li>只改变观察角，确认 det B 和 I 的符号都不变。</li><li>点击镜像，观察绿色面片的定向和伪标量同时翻转。</li><li>思考：为什么在二维中没有普通三维叉积，但 a∧b 仍然存在？</li></ul></section>
  </div>;
}
