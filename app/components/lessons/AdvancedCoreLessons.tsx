'use client';

import { AlgebraAtlasLab, BladeFactorizationLab } from '../labs/AdvancedCoreLabs';

export function BladeFactorizationLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ADVANCED OVERVIEW</span><h2>同一个 grade，不一定代表单一子空间</h2><p>一个 k-blade 能写成 k 个向量的外积，因此对应一个明确的 k 维子空间。任意 grade-k 元素则可能是多个 blade 的和。三维双向量总能代表单一平面，但进入四维后，两个互相独立的平面可以同时出现在一个双向量中。</p><p>这一区分会影响投影、求逆、指数映射和几何解释：只有 simple blade 才能直接被当成一个子空间。</p></section>
    <BladeFactorizationLab />
    <section className="prose-block compact"><span>02 · THE FOUR-DIMENSIONAL TEST</span><h2>B∧B 检测双向量是否包含多于一个平面</h2><p>在四维中，双向量 B 是 simple 的充要条件是 <i>B∧B=0</i>。画布采用最简单的正交规范形 <i>B=αe₁₂+βe₃₄</i>：如果 α、β 都非零，两个独立平面共同出现，外平方就产生非零四维体积。</p></section>
    <figure className="equation-card"><code>B = αe₁₂ + βe₃₄ &nbsp;⇒&nbsp; B∧B = 2αβe₁₂₃₄</code><figcaption>这只是四维规范形的可视化入口；一般坐标中的条件对应一组 Plücker relation。</figcaption></figure>
    <section className="definition-callout"><span>为何后面需要</span><p>四维旋转可同时在两个正交平面中进行。若旋转生成元不是 simple bivector，就不能用单一“旋转轴”理解；第 3.6 课会展示 double rotation。</p></section>
    <section className="checkpoint"><span>图形任务</span><h3>以现象为主，不展开分解算法</h3><ul><li>把任意一个权重调为零，确认 B∧B 消失并只剩一个平面。</li><li>同时改变两个权重，观察 Plücker 检测量如何随乘积变化。</li><li>解释为什么三维中没有足够维数容纳 e₁₂ 与完全独立的 e₃₄。</li></ul></section>
  </div>;
}

export function AlgebraAtlasLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · ADVANCED OVERVIEW</span><h2>复数、四元数和矩阵代数都出现在 Clifford 地图里</h2><p>改变生成向量数量与平方符号，会得到不同的实 Clifford 代数。低维情形与熟悉的数系、直和及实/复矩阵代数同构。这里的“同构”表示加法和乘法结构完全对应，不是数值近似。</p><p>这张地图的目的不是背表，而是建立方向感：复数来自一个负平方生成元，四元数来自两个负平方生成元，而三维欧氏 GA 的偶子代数再次出现四元数。</p></section>
    <AlgebraAtlasLab />
    <section className="derivation-steps"><article><span>dimension</span><h3>分量数指数增长</h3><code>dim Cl(p,q)=2ᵖ⁺ᑫ</code><p>每个基 blade 对应生成元集合的一个子集。</p></article><article><span>signature</span><h3>同维不同 signature</h3><code>Cl(2,0), Cl(1,1), Cl(0,2)</code><p>实维都为 4，但代数结构或向量嵌入并不相同。</p></article><article><span>periodicity</span><h3>八重周期预告</h3><code>Cl(p+8,q) ∼ Mat(16,Cl(p,q))</code><p>更高维分类呈现 Bott periodicity；本课不证明。</p></article></section>
    <section className="prose-block compact"><span>02 · ISOMORPHIC ALGEBRA, DIFFERENT GEOMETRIC MODEL</span><h2>代数相同不等于几何解释相同</h2><p><i>Cl(2,0)</i> 与 <i>Cl(1,1)</i> 都同构于 2×2 实矩阵代数，但 grade-1 向量的平方与度量不同。代数同构可能混合 grade，因此不能只看矩阵表示就忽略几何模型的 signature 和嵌入。</p></section>
    <section className="definition-callout"><span>学习策略</span><p>当前只需记住三条主线：<b>Cl(0,1)≅ℂ</b>、<b>Cl(0,2)≅ℍ</b>、<b>Cl⁺(3,0)≅ℍ</b>。完整分类和周期性作为查表工具，不作为进入 rotor、PGA 或 CGA 的前置证明。</p></section>
    <section className="checkpoint"><span>图形任务</span><h3>在地图中寻找熟悉结构</h3><ul><li>比较 Cl(1,0) 与 Cl(0,1)，观察 e₁² 的符号如何区分 split-complex 与 complex。</li><li>比较三个四维实代数，确认“分量数相同”不足以判断乘法结构。</li><li>找到 Cl(3,0) 的偶子代数与四元数之间的桥梁。</li></ul></section>
  </div>;
}
