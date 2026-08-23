'use client';

import { DoubleReflectionLab, ReflectionLab } from '../labs/TransformationLabs';

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
