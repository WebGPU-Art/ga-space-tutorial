'use client';

import { useMemo, useState } from 'react';
import { CourseSidebar } from './components/CourseSidebar';
import { FormulaTypesetter } from './components/FormulaTypesetter';
import { QuaternionRotationLab } from './components/labs/QuaternionRotationLab';
import { RepresentationComparisonLab } from './components/labs/FoundationLabs';
import { QuaternionGABridgeLab } from './components/labs/QuaternionConceptLabs';
import { ComplexRotationLesson, CoordinatesLesson, DotProductLesson, OrientationLesson } from './components/lessons/FoundationLessons';
import { AlgebraAtlasLesson, BladeFactorizationLesson } from './components/lessons/AdvancedCoreLessons';
import { BladesGradesLesson, ContractionsLesson, DualityLesson, GeometricProductLesson, InvolutionsLesson, MeetJoinLesson, MetricSignatureLesson, OuterProductLesson, OutermorphismLesson, ProjectionLesson } from './components/lessons/GACoreLessons';
import { QuaternionNumericsLesson, SlerpLesson } from './components/lessons/QuaternionAdvancedLessons';
import { AxisAngleLesson, CompositionLesson, DoubleCoverLesson, QuaternionAnatomyLesson } from './components/lessons/QuaternionLessons';
import { HomogeneousModelLesson, MotorsLesson, PGA2DLesson, PGAIncidenceLesson, PGALines3DLesson, PGANormalizationLesson, PGAPrimitivesLesson, ScrewMotionLesson, TranslatorsLesson } from './components/lessons/PGALessons';
import { CGAEuclideanMotionsLesson, CGAExtractionLesson, CGAIntersectionsLesson, ConformalEmbeddingLesson, ConformalOperatorsLesson, NonEuclideanCGALesson, RoundsFlatsLesson } from './components/lessons/CGALessons';
import { ElectromagneticBivectorLesson, LorentzBoostLesson, MinkowskiMetricLesson, SpacetimeSpinorLesson, SpacetimeSplitLesson } from './components/lessons/SpacetimeLessons';
import { AutomaticDifferentiationLesson, DifferentialGeometryLesson, MultivectorDerivativeLesson, VectorCalculusLesson } from './components/lessons/CalculusLessons';
import { CamerasRaysLesson, DataLayoutLesson, DynamicsLesson, NumericalValidationLesson, ProductTablesLesson, RoboticsLesson, WebGPUGALesson } from './components/lessons/PracticeLessons';
import { BivectorExpLesson, DoubleReflectionLesson, LieAlgebraLesson, NDRotationLesson, PinSpinLesson, ReflectionLesson, RotorInterpolationLesson, RotorSandwichLesson } from './components/lessons/TransformationLessons';
import { allLessons, auditFindings, modules, references, type Lesson } from './curriculum';

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>('');
  const lesson = useMemo(() => allLessons.find(item => item.id === selectedId), [selectedId]);
  const activeModule = lesson ? modules.find(item => item.lessons.some(entry => entry.id === lesson.id)) : undefined;

  return <main className="textbook-shell">
    <CourseSidebar modules={modules} selectedId={selectedId} onSelect={setSelectedId} onHome={() => setSelectedId('')} />
    <div className="textbook-main">
      <header className="textbook-topbar">
        <div><span className="signal-dot" /> <b>GA / SPACE</b><span className="crumb">{lesson ? `${activeModule?.number} · ${lesson.number} ${lesson.title}` : '课程总览'}</span></div>
        <div><span>中文</span><span>数学 · 图形 · 代码</span></div>
      </header>
      <div className="reader-scroll">
        {!lesson ? <CourseOverview onSelect={setSelectedId} /> : <LessonPage lesson={lesson} moduleTitle={activeModule?.title ?? ''} onNext={setSelectedId} />}
      </div>
    </div>
  </main>;
}

function CourseOverview({ onSelect }: { onSelect: (id: string) => void }) {
  const totalMinutes = allLessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  return <div className="course-overview">
    <section className="overview-hero">
      <div className="overview-kicker"><span>INTERACTIVE TEXTBOOK · V0.2</span><i>课程骨架已建立</i></div>
      <div className="overview-title-row"><div><h1>几何代数<br /><em>空间教程</em></h1><p>从四元数进入旋转，再沿着几何积、转子、PGA、CGA 与时空模型逐层展开。每一课按“直觉 → 图形 → 公式 → 实验 → 练习”组织。</p></div><div className="overview-orbit"><span>scalar</span><span>vector</span><span>bivector</span><i>R X R̃</i></div></div>
      <div className="course-stats"><div><b>{modules.length}</b><span>学习单元</span></div><div><b>{allLessons.length}</b><span>递进课次</span></div><div><b>{Math.round(totalMinutes / 60)}</b><span>小时预计内容</span></div><div><b>{allLessons.length}</b><span>实验设计</span></div></div>
    </section>

    <section className="audit-section">
      <div className="section-heading"><div><span>CURRICULUM REVIEW</span><h2>知识链缺口审查</h2></div><p>不是简单增加章节：每一项新增内容都修复一个会导致后续理解跳跃的前置关系。</p></div>
      <div className="audit-table"><div className="audit-head"><span>缺口</span><span>此前问题</span><span>本轮补齐</span></div>{auditFindings.map(item => <div key={item.gap}><b>{item.gap}</b><p>{item.before}</p><p><i />{item.added}</p></div>)}</div>
    </section>

    <section className="curriculum-section">
      <div className="section-heading"><div><span>CURRICULUM MAP</span><h2>完整学习路径</h2></div><p>绿色圆点表示已有可交互正文；其余课次先展示学习目标与实验规划，随后逐页填充。</p></div>
      <div className="module-map">
        {modules.map(module => <article key={module.id} className="module-card" style={{ '--module-color': module.color } as React.CSSProperties}>
          <button onClick={() => onSelect(module.lessons[0].id)}>
            <div className="module-card-head"><span>{module.number}</span><i>{module.lessons.length} lessons</i></div>
            <h3>{module.title}</h3><p>{module.subtitle}</p>
            <div className="lesson-mini-list">{module.lessons.map(lesson => <span key={lesson.id}><i className={lesson.status} />{lesson.number} {lesson.title}</span>)}</div>
          </button>
        </article>)}
      </div>
    </section>

    <section className="learning-contract">
      <div><span>每一课如何工作</span><h2>不是阅读页面，<br />而是推演过程。</h2></div>
      <ol><li><span>01</span><b>先观察</b><p>从可拖动图形建立几何直觉。</p></li><li><span>02</span><b>再命名</b><p>用 blade、grade、metric 等词准确描述。</p></li><li><span>03</span><b>后推导</b><p>公式紧贴刚才看到的空间关系。</p></li><li><span>04</span><b>做实验</b><p>改变参数，检验不变量与边界情况。</p></li></ol>
    </section>

    <section className="reference-section">
      <div className="section-heading"><div><span>COURSE REFERENCES</span><h2>课程结构依据</h2></div><p>课程顺序参考系统教材与作者维护的互动资源，再针对 WebGPU 学习体验重新编排。</p></div>
      <div className="reference-list">{references.map((reference, index) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><span>0{index + 1}</span><div><b>{reference.title}</b><p>{reference.note}</p></div><i>↗</i></a>)}</div>
    </section>
  </div>;
}

function LessonPage({ lesson, moduleTitle, onNext }: { lesson: Lesson; moduleTitle: string; onNext: (id: string) => void }) {
  const currentIndex = allLessons.findIndex(item => item.id === lesson.id);
  const previous = allLessons[currentIndex - 1], next = allLessons[currentIndex + 1];
  return <article className="lesson-page">
    <header className="lesson-header">
      <div className="lesson-meta"><span>{lesson.number}</span><span>{moduleTitle}</span><span>{lesson.minutes} min</span><span className={`status ${lesson.status}`}>{lesson.status === 'ready' ? '已有正文' : lesson.status === 'advanced' ? '高级 · 待写' : '大纲 · 待写'}</span></div>
      <h1>{lesson.title}</h1><p>{lesson.summary}</p>
      <div className="concept-row">{lesson.concepts.map(concept => <span key={concept}>{concept}</span>)}</div>
    </header>

    {lesson.id === 'why-ga' ? <WhyGALesson />
      : lesson.id === 'complex-rotation' ? <ComplexRotationLesson />
      : lesson.id === 'coordinates-vectors' ? <CoordinatesLesson />
      : lesson.id === 'dot-norm-angle' ? <DotProductLesson />
      : lesson.id === 'orientation-handedness' ? <OrientationLesson />
      : lesson.id === 'quaternion-anatomy' ? <QuaternionAnatomyLesson />
      : lesson.id === 'axis-angle' ? <AxisAngleLesson />
      : lesson.id === 'quaternion-lab' ? <QuaternionLesson />
      : lesson.id === 'composition' ? <CompositionLesson />
      : lesson.id === 'double-cover' ? <DoubleCoverLesson />
      : lesson.id === 'slerp' ? <SlerpLesson />
      : lesson.id === 'quaternion-to-ga' ? <QuaternionBridgeLesson />
      : lesson.id === 'quaternion-numerics' ? <QuaternionNumericsLesson />
      : lesson.id === 'metric-signature' ? <MetricSignatureLesson />
      : lesson.id === 'outer-product' ? <OuterProductLesson />
      : lesson.id === 'blades-grades' ? <BladesGradesLesson />
      : lesson.id === 'geometric-product' ? <GeometricProductLesson />
      : lesson.id === 'involutions' ? <InvolutionsLesson />
      : lesson.id === 'duality' ? <DualityLesson />
      : lesson.id === 'projection' ? <ProjectionLesson />
      : lesson.id === 'meet-join' ? <MeetJoinLesson />
      : lesson.id === 'contractions' ? <ContractionsLesson />
      : lesson.id === 'outermorphisms' ? <OutermorphismLesson />
      : lesson.id === 'blade-factorization' ? <BladeFactorizationLesson />
      : lesson.id === 'algebra-atlas' ? <AlgebraAtlasLesson />
      : lesson.id === 'reflection' ? <ReflectionLesson />
      : lesson.id === 'double-reflection' ? <DoubleReflectionLesson />
      : lesson.id === 'rotor-sandwich' ? <RotorSandwichLesson />
      : lesson.id === 'bivector-exp' ? <BivectorExpLesson />
      : lesson.id === 'rotor-interpolation' ? <RotorInterpolationLesson />
      : lesson.id === 'nd-rotation' ? <NDRotationLesson />
      : lesson.id === 'pin-spin-groups' ? <PinSpinLesson />
      : lesson.id === 'lie-algebra' ? <LieAlgebraLesson />
      : lesson.id === 'pga-2d' ? <PGA2DLesson />
      : lesson.id === 'homogeneous-model' ? <HomogeneousModelLesson />
      : lesson.id === 'pga-primitives' ? <PGAPrimitivesLesson />
      : lesson.id === 'pga-incidence' ? <PGAIncidenceLesson />
      : lesson.id === 'pga-normalization' ? <PGANormalizationLesson />
      : lesson.id === 'translators' ? <TranslatorsLesson />
      : lesson.id === 'motors' ? <MotorsLesson />
      : lesson.id === 'pga-lines-3d' ? <PGALines3DLesson />
      : lesson.id === 'screw-motion' ? <ScrewMotionLesson />
      : lesson.id === 'conformal-embedding' ? <ConformalEmbeddingLesson />
      : lesson.id === 'rounds-flats' ? <RoundsFlatsLesson />
      : lesson.id === 'cga-intersections' ? <CGAIntersectionsLesson />
      : lesson.id === 'cga-extraction' ? <CGAExtractionLesson />
      : lesson.id === 'cga-euclidean-motions' ? <CGAEuclideanMotionsLesson />
      : lesson.id === 'conformal-operators' ? <ConformalOperatorsLesson />
      : lesson.id === 'non-euclidean-cga' ? <NonEuclideanCGALesson />
      : lesson.id === 'minkowski-metric' ? <MinkowskiMetricLesson />
      : lesson.id === 'lorentz-boost' ? <LorentzBoostLesson />
      : lesson.id === 'spacetime-split' ? <SpacetimeSplitLesson />
      : lesson.id === 'spacetime-bivectors' ? <ElectromagneticBivectorLesson />
      : lesson.id === 'spacetime-spinors' ? <SpacetimeSpinorLesson />
      : lesson.id === 'multivector-derivative' ? <MultivectorDerivativeLesson />
      : lesson.id === 'ga-vector-calculus' ? <VectorCalculusLesson />
      : lesson.id === 'automatic-differentiation' ? <AutomaticDifferentiationLesson />
      : lesson.id === 'differential-geometry' ? <DifferentialGeometryLesson />
      : lesson.id === 'ga-data-layout' ? <DataLayoutLesson />
      : lesson.id === 'product-tables' ? <ProductTablesLesson />
      : lesson.id === 'numerical-validation' ? <NumericalValidationLesson />
      : lesson.id === 'webgpu-ga' ? <WebGPUGALesson />
      : lesson.id === 'robotics' ? <RoboticsLesson />
      : lesson.id === 'cameras-rays' ? <CamerasRaysLesson />
      : lesson.id === 'dynamics' ? <DynamicsLesson />
      : <LessonBlueprint lesson={lesson} />}
    <FormulaTypesetter lessonId={lesson.id} />

    <nav className="lesson-pagination" aria-label="前后课程">
      {previous ? <button onClick={() => onNext(previous.id)}><span>← 上一课</span><b>{previous.number} {previous.title}</b></button> : <span />}
      {next ? <button onClick={() => onNext(next.id)}><span>下一课 →</span><b>{next.number} {next.title}</b></button> : <span />}
    </nav>
  </article>;
}

function WhyGALesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · MOTIVATION</span><h2>同一种旋转，为什么需要三套语言？</h2><p>传统三维图形学常同时使用向量描述方向、矩阵描述线性变换、四元数描述姿态，再为直线、平面和刚体运动引入额外数据结构。问题并不在于它们不能工作，而在于几何关系被分散到了不同表示与转换规则里。</p><p>几何代数尝试反过来：先让<span>方向、平面、体积和变换</span>成为同一种代数中的元素，再让乘法本身携带几何意义。</p></section>
    <section className="comparison-table"><div><span>传统工具</span><span>主要对象</span><span>常见断点</span></div><div><b>向量 + 叉积</b><p>方向、法向量</p><p>叉积局限于三维，平面被伪装成法向量</p></div><div><b>矩阵</b><p>线性变换</p><p>参数多，几何生成元不直观</p></div><div><b>四元数</b><p>三维旋转</p><p>难以直接作用于线、面与更高维对象</p></div><div className="highlight"><b>几何代数</b><p>对象 + 变换</p><p>同一乘法、同一夹心形式、可推广到 n 维</p></div></section>
    <figure className="equation-card large"><code>geometric product = metric information + oriented subspace</code><figcaption>核心问题不是“换一种符号”，而是让表示与几何结构保持一致。</figcaption></figure>
    <RepresentationComparisonLab />
    <section className="checkpoint"><span>本课检查点</span><h3>学完后，你应该能回答</h3><ul><li>为什么双向量比法向量更直接地表示旋转平面？</li><li>“坐标无关”不等于“不使用坐标”，两者差别是什么？</li><li>为什么一个通用的 sandwich 变换形式值得追求？</li></ul></section>
  </div>;
}

function QuaternionLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · SETUP</span><h2>把旋转轴写进四元数</h2><p>单位四元数由一个标量部和一个三维虚部组成。虚部的方向是旋转轴 <i>n̂</i>，长度是 <i>sin(θ/2)</i>；标量部是 <i>cos(θ/2)</i>。因此它把“绕哪里转”和“转多少”压缩成一个可乘的对象。</p></section>
    <figure className="equation-card large"><code>q = cos(θ/2) + (nₓi + nᵧj + n_zk) sin(θ/2)</code><figcaption>向量 v 被看成纯虚四元数，通过 v′ = qvq⁻¹ 完成旋转。</figcaption></figure>
    <QuaternionRotationLab />
    <section className="checkpoint"><span>实验任务</span><h3>不要只拖动滑块</h3><ul><li>固定旋转轴，将 θ 从 0° 拉到 360°，观察 q 的标量部何时变号。</li><li>保持 θ = 180°，移动轴向，观察此时 q 的标量部恒为多少。</li><li>让旋转轴接近原向量，验证平行分量为什么几乎不动。</li></ul></section>
  </div>;
}

function QuaternionBridgeLesson() {
  return <div className="lesson-body">
    <section className="prose-block"><span>01 · THE BRIDGE</span><h2>虚数单位其实是定向平面</h2><p>四元数的 <i>i、j、k</i> 常被介绍成三个新的“虚方向”。几何代数给出更具体的解释：它们可以对应三维空间中的三个基双向量。每一个双向量都代表一个<span>带方向的旋转平面</span>。</p></section>
    <div className="basis-correspondence">
      <div><span>QUATERNION</span><b>1</b><p>标量</p></div><div><span>Cl⁺(3,0)</span><b>1</b><p>grade 0</p></div>
      <div><span>QUATERNION</span><b>i</b><p>i² = −1</p></div><div><span>Cl⁺(3,0)</span><b>−e₂₃</b><p>yz 旋转平面</p></div>
      <div><span>QUATERNION</span><b>j</b><p>j² = −1</p></div><div><span>Cl⁺(3,0)</span><b>−e₃₁</b><p>zx 旋转平面</p></div>
      <div><span>QUATERNION</span><b>k</b><p>k² = −1</p></div><div><span>Cl⁺(3,0)</span><b>−e₁₂</b><p>xy 旋转平面</p></div>
    </div>
    <figure className="equation-card large"><code>ℍ ≅ Cl⁺(3,0) = span&#123;1, e₂₃, e₃₁, e₁₂&#125;</code><figcaption>同构意味着乘法结构完全对应；四元数不是被“近似”为 GA，而是三维欧氏 GA 偶子代数的一种基表示。</figcaption></figure>
    <QuaternionGABridgeLab />
    <section className="prose-block"><span>02 · FROM AXIS TO PLANE</span><h2>旋转轴只是三维里的对偶说法</h2><p>在三维中，单位轴 <i>n̂</i> 与垂直于它的旋转平面可以通过伪标量 <i>I = e₁₂₃</i> 互相转换：<i>B = I n̂</i>。四元数把旋转编码成“轴 + 半角”；转子则直接写成“平面 + 半角”。后者不依赖三维特有的轴—平面对偶，因此可以自然推广到更高维。</p></section>
    <div className="formula-bridge"><div><span>四元数</span><code>q = cos(θ/2) + n̂ sin(θ/2)</code><code>v′ = qvq⁻¹</code></div><i>≅</i><div><span>几何代数转子</span><code>R = exp(−Bθ/2)</code><code>v′ = RvR̃</code></div></div>
    <section className="checkpoint"><span>本课检查点</span><h3>这一桥梁解决三个疑问</h3><ul><li>四元数乘法为什么会自然地产生旋转复合？因为双向量本来就是旋转的生成元。</li><li>为什么要使用半角？因为 rotor 通过左右两次乘法完成夹心作用。</li><li>为什么 GA 能推广到高维？因为它用旋转平面而非三维特有的旋转轴来参数化。</li></ul></section>
  </div>;
}

function LessonBlueprint({ lesson }: { lesson: Lesson }) {
  return <div className="lesson-body blueprint-body">
    <div className="blueprint-notice"><span>CONTENT BLUEPRINT</span><div><b>本页已完成教学设计，正文与实验将在下一轮逐页实现。</b><p>课程骨架先确定依赖关系，避免后续内容重复、跳步或把高级模型过早塞进基础部分。</p></div></div>
    <section className="blueprint-grid"><article><span>学习目标</span><h3>完成本课后</h3><ul>{lesson.concepts.map(concept => <li key={concept}>能用自己的话解释 <b>{concept}</b>，并在图形中辨认它。</li>)}</ul></article><article><span>互动实验</span><h3>{lesson.lab}</h3><p>实验将采用统一的 Canvas/WebGPU 组件，实现参数控制、公式同步、状态读数与兼容回退。</p></article><article><span>页面结构</span><h3>直觉 → 公式 → 验证</h3><ol><li>几何情景与问题</li><li>可操作图形</li><li>最小公式推导</li><li>边界案例与练习</li></ol></article><article><span>预计学习时间</span><h3>{lesson.minutes} 分钟</h3><p>包含阅读、两次参数实验与一个自检问题；高级课会提供基础路径和深入路径。</p></article></section>
  </div>;
}
