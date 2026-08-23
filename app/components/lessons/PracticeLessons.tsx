'use client';

import { DataLayoutLab } from '../labs/PracticeLabs';

export function DataLayoutLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · EVERY BASIS BLADE IS A SUBSET</span><h2>n 个基向量产生 2ⁿ 个 basis blades；bitmask 正好编码这个幂集</h2><p>在固定正交基 <i>e₁,…,eₙ</i> 中，一个 basis blade 只需记录哪些基向量出现。令第 k 位表示 eₖ：标量 1 是全零 mask，e₁₂ 是低两位同时置一，pseudoscalar 则所有位都为一。blade 的 grade 就是 mask 中 1 的数量。</p><p>因此 n=4 的完整多向量有 16 个系数。用 mask 直接作数组下标，<i>coeff[0b0101]</i> 就是 e₁₃ 的系数；代数对象与机器整数之间没有字符串解析层。</p></section>
    <figure className="equation-card large"><code>e₁↔0001, &nbsp; e₂↔0010, &nbsp; e₁₂↔0011, &nbsp; I=e₁₂₃₄↔1111</code><figcaption>本页从最低位对应 e₁；某些库使用不同基顺序或 grade-major 索引，序列化数据前必须记录约定。</figcaption></figure>
    <DataLayoutLab />
    <section className="derivation-steps"><article><span>membership</span><h3>bit k 是否置位</h3><code>(mask &amp; (1&lt;&lt;k)) ≠ 0</code><p>它回答 blade 是否包含基向量 eₖ。</p></article><article><span>grade</span><h3>统计置位数</h3><code>grade=popcount(mask)</code><p>grade projection 可以预先生成 mask 列表，无需检查符号名。</p></article><article><span>product target</span><h3>重复基向量抵消</h3><code>targetMask=aMask XOR bMask</code><p>这只给结果 blade；符号与 metric 还需另外计算。</p></article></section>
    <section className="prose-block compact"><span>02 · XOR FINDS THE DESTINATION, NOT THE COEFFICIENT</span><h2>几何积还要计算交换奇偶性与重复基向量的平方</h2><p>把两个 basis blades 合并并排回规范次序时，每交换一对不同基向量就改变一次符号；两边都出现的位通过 XOR 消失，但会贡献对应的 <i>eₖ²</i>。在对角 metric 中，这让 basis-blade 乘法成为“位运算 + 一个符号/度量因子”。</p></section>
    <figure className="equation-card"><code>e₁₂e₂₃ = e₁(e₂²)e₃ = g₂₂ e₁₃</code><figcaption>target mask 是 0011 XOR 0110 = 0101；若 e₂²=−1，系数还要乘 −1。8.2 会把这套规则生成完整乘法表。</figcaption></figure>
    <section className="prose-block compact"><span>03 · LAYOUT IS A WORKLOAD DECISION</span><h2>dense、sparse 与 specialized 表示没有永远的赢家</h2><p>dense 数组用固定 2ⁿ 个槽，索引和 SIMD/GPU 批处理简单，但高维时指数增长。sparse 表示只存非零的 (mask,value)，适合很稀疏的 blade，却增加索引、排序和合并成本。专用 rotor、motor、point 类型只保留已知子空间的分量，最快也最紧凑，但失去“任意多向量”通用性。</p></section>
    <div className="sign-table"><div><span>DENSE</span><b>Float[2ⁿ]</b><p>固定布局、无分支访问；低维与 GPU 批量计算常见。</p></div><div><span>SPARSE</span><b>(mask,value)[]</b><p>nnz 很小时省空间；乘法中需要收集同 mask 项。</p></div><div><span>SPECIALIZED</span><b>named lanes</b><p>只表达 rotor/motor 等已知类型；API 可直接保证结构约束。</p></div></div>
    <section className="prose-block compact"><span>04 · ORDERING IS PART OF THE ABI</span><h2>binary order 与 grade-major order 都合理，但不能暗中混用</h2><p>binary order 让 mask 等于数组下标；grade-major order 把相同 grade 连续放置，便于投影和专用 kernel。代码生成器可以维护 mask→lane 映射，但 WGSL buffer、WASM、CPU 与文件格式必须共享同一份表。否则程序不会报类型错误，只会把 e₁₂ 的数值悄悄当成另一个 blade。</p></section>
    <section className="definition-callout"><span>规模预警</span><p>Cl(n) 的通用 dense 多向量有 <b>2ⁿ</b> 个系数：n=4 是 16，n=8 已是 256，n=16 则是 65,536。工程上应先确认实际计算闭合在哪个子代数或专用对象集合中，再决定是否分配完整 dense 表示。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>把几何分类翻译成数据布局</h3><ul><li>逐个 toggle eₖ，观察 mask 的 XOR 行为与 grade 的 popcount 变化。</li><li>在 dense 与 grade-grouped 间切换，说明数据内容为何不变、lane 顺序却不同。</li><li>改变 nnz，找出实验模型中 sparse 何时比 16 个 dense float 使用更少 word，并指出真实程序还需计算哪些额外开销。</li></ul></section>
  </div>;
}
