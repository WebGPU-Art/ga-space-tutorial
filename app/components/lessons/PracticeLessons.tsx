'use client';

import { DataLayoutLab, MultiplicationTableLab, NumericalValidationLab, WebGPURotorLab } from '../labs/PracticeLabs';

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

export function ProductTablesLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · GENERATE THE ALGEBRA FROM TWO SMALL RULES</span><h2>basis-blade 几何积由规范重排与 metric 决定</h2><p>上一课用 bitmask 表示 basis blade。要计算 <i>A B</i>，先数出把两组基向量排回升序需要多少次交换；奇数次给 −1，偶数次给 +1。随后找出两边重复出现的位，每个重复 eₖ 消去并贡献 <i>eₖ²=gₖₖ</i>。</p><p>结果 mask 是 XOR，因为只出现一次的基向量保留、出现两次的消去。对于正交对角 metric，两个 basis blades 的乘积仍是“一个 basis blade × 一个标量”，所以整张 Cayley table 可以在初始化或代码生成阶段一次构造。</p></section>
    <figure className="equation-card large"><code>gp(a,b) = reorderSign(a,b) · ∏ₖ₍a&amp;b₎ gₖₖ · blade(a XOR b)</code><figcaption>公式假设所用 basis 让 metric 对角化；非正交基中 eᵢeⱼ 同时含点积与外积，结果可能展开成多项。</figcaption></figure>
    <MultiplicationTableLab />
    <section className="derivation-steps"><article><span>01 · reorder</span><h3>统计 inversion parity</h3><code>sign=(−1)^swaps</code><p>只需奇偶性，不必真的构造和排序字符串。</p></article><article><span>02 · cancel</span><h3>重复位贡献 metric</h3><code>overlap=a &amp; b</code><p>正、负、零平方分别产生 +1、−1 或零因子。</p></article><article><span>03 · emit</span><h3>XOR 给出结果 lane</h3><code>target=a XOR b</code><p>将 factor 累加到输出 multivector 的 target 系数。</p></article></section>
    <section className="prose-block compact"><span>02 · OTHER PRODUCTS ARE FILTERS OR RESTRICTIONS</span><h2>outer product 先检查独立性，contraction 再按输入输出 grade 过滤</h2><p>若 <i>aMask &amp; bMask≠0</i>，两者共享基方向，basis-blade 外积立即为零；否则外积与几何积的 basis 结果相同。各种 contraction 可以先算几何积，再依据输入 grades 与结果 grade 保留允许的项。这样一套底层 gp 表就能服务多种高级运算，但必须明确所采用的内积约定。</p></section>
    <figure className="equation-card"><code>a∧b = 0 if (aMask &amp; bMask)≠0; otherwise gp(a,b)</code><figcaption>这是 basis blades 的规则。一般 multivector 的乘积通过双重循环、表查找与同 lane 累加得到。</figcaption></figure>
    <section className="prose-block compact"><span>03 · TABLE, LOOP OR GENERATED KERNEL?</span><h2>通用解释器适合教学，专用 codegen 适合热点路径</h2><p>完整 dense gp 在 n 维最多检查 <i>4ⁿ</i> 对系数。低维可以预存 target/sign 表；已知输入类型时，生成器应删除恒零项并把剩余乘加展开。例如两个 3D rotors 只需偶子代数的四条 lane，而无需遍历全部 8×8 组合。8.4 的 shader 会采用这种专用表示。</p></section>
    <div className="sign-table"><div><span>INTERPRETED</span><b>double loop + table</b><p>最通用、便于调试；分支和间接索引较多。</p></div><div><span>PRECOMPUTED</span><b>target/sign LUT</b><p>正交 metric 下简单；表大小随维数快速增长。</p></div><div><span>GENERATED</span><b>straight-line FMA</b><p>已知类型最快；需要用不变量测试守住正确性。</p></div></div>
    <section className="checkpoint"><span>实验任务</span><h3>从表格反推代数公理</h3><ul><li>比较 Cl(3,0) 与 Cl(2,1) 的 e₃e₃，确认只有 metric factor 改变。</li><li>在退化 signature 中选择任何同时含 e₃ 的重复乘积，解释为何结果变零。</li><li>点击 e₁₂e₂₃，手工完成重排、重复位消去与 XOR 三步。</li></ul></section>
  </div>;
}

export function NumericalValidationLesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · TEST THE GEOMETRY, NOT ONLY EXAMPLE NUMBERS</span><h2>GA 程序最有价值的 oracle 是代数恒等式与几何不变量</h2><p>几个手算样例只能证明那几个输入没有出错。更强的测试会随机生成受约束对象，并验证所有合法输入都应满足的性质：reverse 的 involution、几何积结合律、grade 投影完备性、unit rotor 的 <i>RR̃=1</i>，以及 sandwich 对几何积的同态。</p><p>这些性质同时覆盖符号表、lane 排序、reverse、metric 与变换代码。CPU 与 GPU 即使都输出“看起来合理”的图形，只要它们在某个不变量上分歧，就说明实现层存在语义错误。</p></section>
    <figure className="equation-card large"><code>R(AB)R̃ = (RAR̃)(RBR̃), &nbsp;&nbsp; ⟨R Aₖ R̃⟩ⱼ=0 for j≠k</code><figcaption>unit versor 的 sandwich 保持乘法结构与 grade；在浮点实现中使用与数值尺度相称的 tolerance。</figcaption></figure>
    <NumericalValidationLab />
    <section className="derivation-steps"><article><span>algebra</span><h3>离散结构应精确</h3><code>mask, grade, target lane</code><p>bitmask 与表索引是整数逻辑，不应使用浮点 tolerance。</p></article><article><span>floating point</span><h3>系数恒等式近似比较</h3><code>|a−b| ≤ atol+rtol·scale</code><p>只用绝对误差会误判大数，只用相对误差会误判接近零的量。</p></article><article><span>geometry</span><h3>模型不变量按对象选择</h3><code>point²=0, RR̃=1, incidence=0</code><p>CGA null 点、PGA 理想元素和 Euclidean rotor 不能套用同一个 norm 测试。</p></article></section>
    <section className="prose-block compact"><span>02 · DRIFT IS EXPECTED; SILENT STRUCTURE LOSS IS NOT</span><h2>重复乘法会积累舍入误差，维护步骤必须显式、可测量</h2><p>实验强制每次乘法落回 float32。未维护的 rotor 会缓慢离开单位流形，于是 <i>RvR̃</i> 不再只旋转，还附带微小缩放。周期归一化把 <i>RR̃</i> 拉回 1；更高要求的积分器可以直接在 Lie algebra 中更新，再通过指数映射回到群上。</p></section>
    <figure className="equation-card"><code>R ← normalize(ΔR R), &nbsp;&nbsp; normalize(R)=R/√⟨RR̃⟩₀</code><figcaption>只在 RR̃ 为正、非零标量且对象确实应为 rotor 时使用；退化 PGA 元素和 null point 不能照搬。</figcaption></figure>
    <section className="prose-block compact"><span>03 · A PRACTICAL PROPERTY SUITE</span><h2>从 basis blades 到应用对象分层测试</h2><p>第一层穷举低维 basis-blade 表，与独立的慢速参考实现对照。第二层随机多向量检查双线性、结合律、reverse 与 grade。第三层生成 normalized rotors、motors、CGA points，检查长度、incidence、nullness 与 sandwich 同态。最后让同一向量在 CPU 与 WGSL kernel 中运行，比较每个 lane，而不是只比较屏幕像素。</p></section>
    <div className="sign-table"><div><span>EXACT</span><b>mask / grade / sign</b><p>整数和枚举约定；失败通常是实现 bug。</p></div><div><span>APPROXIMATE</span><b>coefficient identities</b><p>记录误差尺度与执行精度；避免魔法 epsilon。</p></div><div><span>CONDITIONED</span><b>meet / inverse / normalize</b><p>接近退化输入时应分类或报告，而非制造巨大有限数。</p></div></div>
    <section className="checkpoint"><span>实验任务</span><h3>把“定期归一化”变成可审计策略</h3><ul><li>增加累计次数，观察 raw 的 RR̃ 漂移是否近似单调；解释为什么角误差不必同样单调。</li><li>逐步减小归一化间隔，比较 norm error 与额外计算成本。</li><li>把归一化关闭，说明哪个读数直接预测 sandwich 后向量的缩放。</li></ul></section>
  </div>;
}

export function WebGPUGALesson(){
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · MOVE A CLOSED GA TYPE, NOT THE WHOLE ALGEBRA</span><h2>shader 热点通常只需要 rotor、motor 或 point 的专用 lanes</h2><p>把 Cl(4) 的 16 个系数全部送进每个 vertex 虽然通用，却浪费带宽和乘加。若 kernel 只做二维 rotor sandwich，R 只有 scalar 与 e₁₂ 两条 lane；三维 rotor 也只有四条偶分量，正好放进一个 <i>vec4f</i>。先证明运算在该子空间闭合，再生成无分支公式。</p><p>实验的 WGSL vertex shader 从半角 rotor 系数重建 sandwich 的二倍角结果，并用一次 instanced draw 旋转最多 4096 个程序生成点。Canvas 层只画坐标与 fallback，亮色点阵由 WebGPU 管线实际绘制。</p></section>
    <figure className="equation-card large"><code>struct Rotor3 &#123; lanes: vec4f &#125; &nbsp; // scalar, e₂₃, e₃₁, e₁₂</code><figcaption>vec4f 的 16-byte 对齐适合 host-shareable buffer；真实 lane 次序必须与 CPU、WGSL 和序列化 ABI 完全一致。</figcaption></figure>
    <WebGPURotorLab />
    <section className="derivation-steps"><article><span>host</span><h3>准备数据与 pipeline</h3><code>adapter → device → buffers</code><p>CPU 创建 shader module、bind group 与 render/compute pipeline。</p></article><article><span>dispatch</span><h3>批量并行调用</h3><code>draw(vertices, instances)</code><p>本实验用 instance_index；通用数据可改从 storage buffer 读取。</p></article><article><span>shader</span><h3>执行专用 sandwich</h3><code>out[i]=R in[i] R̃</code><p>每个 invocation 处理独立对象，避免跨线程写同一输出 lane。</p></article></section>
    <section className="prose-block compact"><span>02 · BUFFER LAYOUT IS PART OF THE MATHEMATICS</span><h2>WGSL 对 storage/uniform 的对齐要求必须与 JavaScript 写入视图一致</h2><p>WGSL 的 host-shareable struct 成员偏移和 array stride 必须满足 address-space alignment。尤其 uniform buffer 常有更严格的 16-byte 布局要求；storage buffer 更适合大批量对象。不要根据“系数数量 × 4 bytes”猜偏移，应从实际 WGSL 类型的 alignment/size 推导并在 host 端复现。</p></section>
    <div className="sign-table"><div><span>UNIFORM</span><b>small shared params</b><p>rotor、相机和少量常量；容量较小、布局限制更严格。</p></div><div><span>STORAGE</span><b>large object arrays</b><p>批量 points/motors；compute shader 可读写输出。</p></div><div><span>PROCEDURAL</span><b>builtin indices</b><p>本实验从 instance_index 生成点，因此不上传 point buffer。</p></div></div>
    <section className="prose-block compact"><span>03 · RENDER OR COMPUTE?</span><h2>直接参与绘制的数据可在 vertex stage 变换；复用结果则用 compute stage</h2><p>如果旋转结果只用于当前 draw，在 vertex shader 中即时 sandwich 可省去中间 buffer。若结果要参与碰撞、归约、多个 pass 或回读，compute pipeline 将输出写入 storage buffer 更合适。选择取决于数据生命周期，不是“compute 一定更快”。</p><p>WebGPU 主流数值路径是 f32；部署前应使用上一课的 property suite 比较 CPU 与 GPU lane，并记录设备限制。对于小批量，pipeline 与 command submission 开销可能超过并行收益。</p></section>
    <section className="definition-callout"><span>渐进增强</span><p>WebGPU 不可用时，教程仍保留 Canvas 坐标、公式和控制器；但批量亮色点阵只在成功获得 GPU adapter 后出现。产品代码应把 capability detection 与数学结果验证分开处理。</p></section>
    <section className="checkpoint"><span>实验任务</span><h3>区分数学工作量、带宽与 draw 开销</h3><ul><li>增大 grid，确认 draw call 保持 1，而 shader invocation 按 N² 增长。</li><li>把角度调到 180°，用 rotor 半角系数解释为何点阵整体取反。</li><li>设计 storage-buffer 版本：列出输入 point stride、rotor uniform 与输出 buffer 各自需要的 WGSL 类型。</li></ul></section>
  </div>;
}
