'use client';

import { ConformalEmbeddingLab } from '../labs/CGALabs';

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
