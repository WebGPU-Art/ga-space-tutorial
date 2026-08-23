export type LessonStatus = 'ready' | 'outline' | 'advanced';

export type Lesson = {
  id: string;
  number: string;
  title: string;
  summary: string;
  concepts: string[];
  lab: string;
  status: LessonStatus;
  minutes: number;
};

export type Module = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  color: string;
  lessons: Lesson[];
};

export const modules: Module[] = [
  {
    id: 'orientation', number: '00', title: '建立旋转直觉', subtitle: '从熟悉的数系进入空间', color: '#e8b64b',
    lessons: [
      { id: 'why-ga', number: '0.1', title: '为什么需要几何代数？', summary: '从坐标、矩阵和叉积的局限出发，认识“对象与操作同属一种代数”的价值。', concepts: ['坐标无关', '几何对象', '结构保持'], lab: '同一旋转的三种表达对照', status: 'ready', minutes: 12 },
      { id: 'complex-rotation', number: '0.2', title: '复数：二维旋转的原型', summary: '把复数乘法看成平面中的缩放与旋转，第一次遇见指数形式。', concepts: ['复平面', '欧拉公式', '单位圆'], lab: '拖动复数观察乘法轨迹', status: 'ready', minutes: 18 },
      { id: 'coordinates-vectors', number: '0.3', title: '向量、基与坐标', summary: '区分几何向量与它在一组基中的坐标，为后续的基无关表达做准备。', concepts: ['向量空间', '基', '坐标变换'], lab: '切换基但保持向量不变', status: 'ready', minutes: 16 },
      { id: 'dot-norm-angle', number: '0.4', title: '点积、范数与角度', summary: '回顾度量如何从点积产生长度、角度与正交关系，为几何积的度量部分做准备。', concepts: ['点积', '范数', '正交'], lab: '拖动向量观察投影与夹角', status: 'ready', minutes: 18 },
      { id: 'orientation-handedness', number: '0.5', title: '定向、手性与坐标框架', summary: '区分空间的定向与坐标轴标签，理解换手性为何会改变伪向量符号。', concepts: ['orientation', 'handedness', 'frame'], lab: '左右手坐标系切换', status: 'ready', minutes: 18 },
    ],
  },
  {
    id: 'quaternions', number: '01', title: '四元数与三维旋转', subtitle: '先掌握可操作的旋转语言', color: '#4bdab0',
    lessons: [
      { id: 'quaternion-anatomy', number: '1.1', title: '四元数的四个分量', summary: '理解标量部与虚部，不把四元数误解成普通四维向量。', concepts: ['Hamilton 乘法', '共轭', '模'], lab: '四元数乘法表', status: 'ready', minutes: 20 },
      { id: 'axis-angle', number: '1.2', title: '轴角与单位四元数', summary: '从旋转轴和半角构造单位四元数，理解为什么角度必须折半。', concepts: ['轴角', '半角', '单位四元数'], lab: '轴角—四元数双向转换', status: 'ready', minutes: 24 },
      { id: 'quaternion-lab', number: '1.3', title: '实验：绕任意轴旋转', summary: '在三维空间中调节旋转角和旋转轴，观察 qvq⁻¹ 如何保持长度。', concepts: ['夹心积', '范数保持', '任意轴'], lab: 'WebGPU 任意轴旋转实验', status: 'ready', minutes: 25 },
      { id: 'composition', number: '1.4', title: '旋转复合与不可交换性', summary: '比较先绕 x 再绕 y 与相反顺序，建立群运算直觉。', concepts: ['复合', '非交换', '局部/世界坐标'], lab: '交换旋转顺序', status: 'ready', minutes: 20 },
      { id: 'double-cover', number: '1.5', title: '双覆盖：q 与 −q', summary: '理解两个相反四元数为何描述同一空间旋转，以及 720° 现象。', concepts: ['SO(3)', 'Spin(3)', '双覆盖'], lab: '四元数球上的 720° 路径', status: 'ready', minutes: 22 },
      { id: 'slerp', number: '1.6', title: 'SLERP 与旋转插值', summary: '沿单位四元数球的大圆，以恒定角速度在姿态之间插值。', concepts: ['球面插值', '最短弧', '姿态动画'], lab: '线性插值与 SLERP 对照', status: 'ready', minutes: 26 },
      { id: 'quaternion-to-ga', number: '1.7', title: '桥梁：四元数就是偶子代数', summary: '把 i、j、k 重新解释为三个定向平面，看到四元数正是 Cl⁺(3,0) 的一种写法。', concepts: ['Cl⁺(3,0)', '双向量基', '代数同构'], lab: '四元数基与双向量基对照', status: 'ready', minutes: 28 },
      { id: 'quaternion-numerics', number: '1.8', title: '归一化、漂移与数值稳健性', summary: '理解浮点误差如何让单位四元数偏离单位球，以及重归一化、符号选择和小角近似。', concepts: ['normalization', 'floating point', 'small angle'], lab: '累计旋转误差实验', status: 'ready', minutes: 22 },
    ],
  },
  {
    id: 'ga-core', number: '02', title: '几何代数核心', subtitle: '把方向、平面和体积变成可计算对象', color: '#b69bf2',
    lessons: [
      { id: 'metric-signature', number: '2.1', title: '基向量、度量与 signature', summary: '用基向量的平方规定空间度量，比较欧氏、退化与时空度量。', concepts: ['eᵢ²', '度量', 'Cl(p,q,r)'], lab: '切换空间 signature', status: 'ready', minutes: 24 },
      { id: 'outer-product', number: '2.2', title: '外积：张成有向子空间', summary: '从两条向量张出双向量，理解面积、方向与反对称性。', concepts: ['楔积', '双向量', '定向面积'], lab: '拖动向量张开平面', status: 'ready', minutes: 28 },
      { id: 'blades-grades', number: '2.3', title: 'Blade、grade 与多向量', summary: '建立标量、向量、双向量、三向量和多向量的分层图景。', concepts: ['blade', 'grade', 'multivector'], lab: '多向量分量检查器', status: 'ready', minutes: 25 },
      { id: 'geometric-product', number: '2.4', title: '几何积：度量与方向合一', summary: '理解 ab = a·b + a∧b，以及几何积为何可逆且可复合。', concepts: ['几何积', '内积', '外积'], lab: '几何积分解器', status: 'ready', minutes: 32 },
      { id: 'involutions', number: '2.5', title: '反演、共轭与逆', summary: '区分 reverse、grade involution 和 Clifford conjugation，并用于构造逆。', concepts: ['reverse', 'involution', 'inverse'], lab: '逐 grade 观察符号变化', status: 'ready', minutes: 24 },
      { id: 'duality', number: '2.6', title: '伪标量与对偶', summary: '把子空间与其正交补联系起来，解释三维叉积只是外积的对偶。', concepts: ['伪标量', 'dual', '叉积'], lab: '外积与叉积对照', status: 'ready', minutes: 24 },
      { id: 'projection', number: '2.7', title: '投影与拒绝', summary: '把向量分解成平行和垂直于子空间的部分，推广到任意 blade。', concepts: ['projection', 'rejection', 'contraction'], lab: '向量—平面分解', status: 'ready', minutes: 22 },
      { id: 'meet-join', number: '2.8', title: 'Join、meet 与相交', summary: '用代数表达张成和交集，为直线、平面、圆和球的统一运算铺路。', concepts: ['join', 'meet', 'regressive product'], lab: '平面相交生成直线', status: 'ready', minutes: 30 },
      { id: 'contractions', number: '2.9', title: '内积约定与 contraction', summary: '区分标量积、左收缩、右收缩和 Hestenes 内积，避免不同资料间符号不一致。', concepts: ['left contraction', 'right contraction', 'inner product'], lab: '按 grade 比较四种内积', status: 'ready', minutes: 26 },
      { id: 'outermorphisms', number: '2.10', title: '线性变换与 outermorphism', summary: '把向量上的线性变换自然扩展到 blade，保持外积结构与子空间意义。', concepts: ['linear map', 'outermorphism', 'determinant'], lab: '同一变换作用于向量与面积', status: 'ready', minutes: 30 },
      { id: 'blade-factorization', number: '2.11', title: '简单 blade、可分解性与秩', summary: '辨认一个多向量何时真正表示单一子空间，并理解高维双向量为何可能不是简单 blade。', concepts: ['simple blade', 'factorization', 'rank'], lab: '四维双向量可分解性测试', status: 'ready', minutes: 30 },
      { id: 'algebra-atlas', number: '2.12', title: '常见 Clifford 代数地图', summary: '把实数、复数、四元数、双数、矩阵代数和不同 signature 放到同一张周期结构图中。', concepts: ['classification', 'subalgebra', 'periodicity'], lab: '低维代数 Cayley 地图', status: 'ready', minutes: 26 },
    ],
  },
  {
    id: 'versors', number: '03', title: '反射、转子与变换', subtitle: '从一次反射走向 n 维旋转', color: '#f07f63',
    lessons: [
      { id: 'reflection', number: '3.1', title: '一次反射', summary: '从向量在超平面上的反射公式理解最基本的 versor 作用。', concepts: ['反射', 'sandwich', 'versor'], lab: '旋转镜面与反射向量', status: 'ready', minutes: 22 },
      { id: 'double-reflection', number: '3.2', title: '两次反射就是旋转', summary: '让两面镜子夹出旋转平面与半角，自然导出 rotor。', concepts: ['双反射', '半角', '旋转平面'], lab: '镜面对生成转子', status: 'ready', minutes: 26 },
      { id: 'rotor-sandwich', number: '3.3', title: 'Rotor 与夹心作用', summary: '用 R X R̃ 同时旋转向量、平面和其他多向量。', concepts: ['rotor', 'reverse', '结构保持'], lab: '同一转子作用于多种对象', status: 'ready', minutes: 28 },
      { id: 'bivector-exp', number: '3.4', title: '双向量指数与对数', summary: '从 exp(−Bθ/2) 构造转子，并由 log(R) 读回旋转生成元。', concepts: ['指数映射', '生成元', '对数'], lab: '双向量指数展开', status: 'ready', minutes: 32 },
      { id: 'rotor-interpolation', number: '3.5', title: '转子插值与平均', summary: '把四元数 SLERP 推广到 GA 转子，处理多姿态平均与估计。', concepts: ['插值', '平均', '估计'], lab: '多姿态转子平均', status: 'ready', minutes: 28 },
      { id: 'nd-rotation', number: '3.6', title: '高维旋转', summary: '理解四维及更高维旋转由多个独立旋转平面组成，而非单一旋转轴。', concepts: ['simple bivector', 'double rotation', 'n-D'], lab: '四维双旋转投影', status: 'ready', minutes: 30 },
      { id: 'pin-spin-groups', number: '3.7', title: 'Pin、Spin 与正交群', summary: '把反射、旋转和双覆盖组织成群，连接 versor、Pin(p,q)、Spin(p,q) 与 SO(p,q)。', concepts: ['Pin group', 'Spin group', 'SO(p,q)'], lab: '群覆盖关系可视化', status: 'ready', minutes: 32 },
      { id: 'lie-algebra', number: '3.8', title: '旋转的 Lie 代数', summary: '把双向量看作无穷小旋转生成元，理解交换子、BCH 与局部线性化。', concepts: ['Lie algebra', 'commutator', 'BCH'], lab: '小旋转复合误差', status: 'ready', minutes: 34 },
    ],
  },
  {
    id: 'pga', number: '04', title: 'PGA：位置与刚体运动', subtitle: '把无穷远加入欧氏空间', color: '#62a8e5',
    lessons: [
      { id: 'pga-2d', number: '4.1', title: '先在二维理解 PGA', summary: '以直线为 1-vector、点为 2-vector，在最小模型中学习 join、meet、距离与运动。', concepts: ['P(R*₂,₀,₁)', 'line-based', 'dual model'], lab: '二维点线几何沙盒', status: 'ready', minutes: 32 },
      { id: 'homogeneous-model', number: '4.2', title: '齐次模型与退化度量', summary: '引入平方为零的基向量，把方向与位置放进同一种代数。', concepts: ['homogeneous', 'null basis', 'PGA'], lab: '欧氏点的齐次嵌入', status: 'ready', minutes: 28 },
      { id: 'pga-primitives', number: '4.3', title: '点、线、平面与理想元素', summary: '理解 PGA 中不同 grade 的对象，以及 primal/dual 两种约定。', concepts: ['point', 'line', 'plane'], lab: '可拖动 PGA 对象检查器', status: 'ready', minutes: 30 },
      { id: 'pga-incidence', number: '4.4', title: '相交、连接、距离与角度', summary: '用 meet/join 计算关联关系，再从度量中读出角度和距离。', concepts: ['incidence', 'join', 'meet'], lab: '拖动点线观察 join/meet 与度量', status: 'ready', minutes: 32 },
      { id: 'pga-normalization', number: '4.5', title: '归一化、权重与退化范数', summary: '区分欧氏元素和理想元素的范数，理解退化代数中为什么不能套用普通归一化。', concepts: ['weight', 'ideal norm', 'degenerate metric'], lab: '欧氏/理想元素测量器', status: 'ready', minutes: 26 },
      { id: 'translators', number: '4.6', title: '平移器与理想元素', summary: '把平移理解为绕无穷远元素的旋转，统一旋转和平移。', concepts: ['translator', 'ideal element', 'nilpotent'], lab: '平移器指数', status: 'ready', minutes: 26 },
      { id: 'motors', number: '4.7', title: 'Motor 与刚体运动', summary: '用一个偶多向量同时表示旋转和平移，对应双四元数。', concepts: ['motor', 'dual quaternion', 'SE(3)'], lab: 'TR/RT 刚体运动分解', status: 'ready', minutes: 32 },
      { id: 'pga-lines-3d', number: '4.8', title: '三维线几何与 Plücker 坐标', summary: '把三维直线视为 2-blade，理解有限线、理想线和非简单双向量。', concepts: ['Plücker', 'line bivector', 'Klein quadric'], lab: '方向—moment 与 Klein 约束检查器', status: 'ready', minutes: 34 },
      { id: 'screw-motion', number: '4.9', title: '螺旋运动与插值', summary: '从 motor 的对数读出螺旋轴、角度与位移，实现自然姿态插值。', concepts: ['screw', 'motor log', 'ScLERP'], lab: 'Chasles 螺旋与 ScLERP 轨迹', status: 'ready', minutes: 34 },
    ],
  },
  {
    id: 'cga', number: '05', title: 'CGA：圆、球与共形变换', subtitle: '让弯曲对象成为线性元素', color: '#59c5d8',
    lessons: [
      { id: 'conformal-embedding', number: '5.1', title: '共形嵌入与 null cone', summary: '增加原点与无穷远两个零向量，把欧氏点嵌入更高维 null cone。', concepts: ['null cone', 'embedding', 'distance'], lab: '可拖动欧氏点的 null cone 归一化切片', status: 'ready', minutes: 30 },
      { id: 'rounds-flats', number: '5.2', title: '圆、球与平直对象', summary: '用 blade 直接表示点对、圆、球、线和平面。', concepts: ['round', 'flat', 'OPNS/IPNS'], lab: '三点圆、含 n∞ 的直线与四点球构造器', status: 'ready', minutes: 32 },
      { id: 'cga-intersections', number: '5.3', title: '统一相交与构造', summary: '用同一套 meet/join 处理线—球、圆—圆和球—球相交。', concepts: ['meet', 'point pair', 'tangent'], lab: '两圆 meet 的实、切、虚点对分类', status: 'ready', minutes: 34 },
      { id: 'cga-extraction', number: '5.4', title: '从 blade 读回几何参数', summary: '从直接/对偶表示中提取圆心、半径、方向和虚实状态，连接抽象元素与可见几何。', concepts: ['parameter extraction', 'OPNS', 'IPNS'], lab: '加权 IPNS 圆与 flat 分支解码器', status: 'ready', minutes: 30 },
      { id: 'cga-euclidean-motions', number: '5.5', title: 'CGA 中的欧氏运动', summary: '在共形模型中统一表示旋转、平移和 motor，并让它们作用于点、线、圆与球。', concepts: ['translator', 'rotor', 'motor'], lab: '同一 motor 变换点、直线、圆与坐标框架', status: 'ready', minutes: 32 },
      { id: 'conformal-operators', number: '5.6', title: '反演、缩放与特殊共形变换', summary: '从球反射出发，理解角度保持但距离可改变的变换。', concepts: ['inversion', 'dilation', 'conformal'], lab: '反演、缩放与特殊共形网格', status: 'ready', minutes: 34 },
      { id: 'non-euclidean-cga', number: '5.7', title: 'CGA 中的双曲与椭圆几何', summary: '通过重新选择无穷远对象，在同一共形代数里观察非欧几何的测地线与运动。', concepts: ['hyperbolic', 'elliptic', 'model geometry'], lab: '欧氏、Poincaré 与椭圆测地线对照', status: 'ready', minutes: 36 },
    ],
  },
  {
    id: 'spacetime', number: '06', title: '时空几何代数', subtitle: '旋转如何变成 Lorentz boost', color: '#8f9aee',
    lessons: [
      { id: 'minkowski-metric', number: '6.1', title: 'Minkowski 度量与事件', summary: '改变一个基向量的平方符号，空间旋转便延伸到时空几何。', concepts: ['event', 'proper time', 'signature'], lab: '可拖动事件的光锥与间隔分类', status: 'ready', minutes: 28 },
      { id: 'lorentz-boost', number: '6.2', title: 'Lorentz boost 是双曲旋转', summary: '用指数转子表达惯性系之间的 boost，并观察光锥保持不变。', concepts: ['rapidity', 'boost', 'hyperbolic rotor'], lab: 'rapidity、倾斜坐标轴与不变间隔', status: 'ready', minutes: 34 },
      { id: 'spacetime-split', number: '6.3', title: '观察者与时空分解', summary: '选择一个时间方向，把同一时空量分解成观察者测得的时间与空间部分。', concepts: ['observer', 'spacetime split', 'relative vector'], lab: '拖动事件并切换观察者的空间切片', status: 'ready', minutes: 32 },
      { id: 'spacetime-bivectors', number: '6.4', title: '时空双向量与电磁场', summary: '把电场和磁场视为同一个时空双向量在不同观察者下的分解。', concepts: ['spacetime bivector', 'observer split', 'field'], lab: 'E/B 混合与两个 Lorentz 不变量', status: 'ready', minutes: 36 },
      { id: 'spacetime-spinors', number: '6.5', title: '时空 Spinor 与 Dirac 结构', summary: '从偶子代数角度理解时空旋量、相位和 Dirac 代数的几何来源。', concepts: ['spinor', 'Dirac algebra', 'phase'], lab: 'spinor 的 360° 变号与 720° 闭合', status: 'ready', minutes: 38 },
    ],
  },
  {
    id: 'calculus', number: '07', title: '几何微积分与连续变化', subtitle: '让多向量随位置和时间变化', color: '#d58ec6',
    lessons: [
      { id: 'multivector-derivative', number: '7.1', title: '多向量导数', summary: '把标量和向量微积分推广到多向量值函数，建立方向导数与梯度的 GA 形式。', concepts: ['vector derivative', 'directional derivative', 'multivector field'], lab: '逐 grade 检查多向量场的局部变化', status: 'ready', minutes: 34 },
      { id: 'ga-vector-calculus', number: '7.2', title: '散度、旋度与外导数', summary: '把 grad、div、curl 和 differential forms 放进统一的几何导数分解中。', concepts: ['divergence', 'curl', 'exterior derivative'], lab: '局部 div/curl 与边界通量/环流对照', status: 'ready', minutes: 38 },
      { id: 'automatic-differentiation', number: '7.3', title: '自动微分与运动学', summary: '利用退化基与双数结构计算导数，并把结果用于姿态、motor 和约束系统。', concepts: ['dual number', 'automatic differentiation', 'Jacobian'], lab: 'dual number 传播姿态与点速度', status: 'ready', minutes: 34 },
      { id: 'differential-geometry', number: '7.4', title: '曲线、曲面与移动标架', summary: '用 rotor 描述 Frenet frame、曲面切空间和曲率，为流形上的 GA 建立入口。', concepts: ['moving frame', 'curvature', 'tangent space'], lab: '沿三维螺线运输 Frenet/rotor frame', status: 'ready', minutes: 38 },
    ],
  },
  {
    id: 'practice', number: '08', title: '计算、图形与工程实践', subtitle: '把几何公式落到程序里', color: '#a7b34b',
    lessons: [
      { id: 'ga-data-layout', number: '8.1', title: '多向量的数据布局', summary: '用位图索引 basis blade，理解稠密、稀疏和专用布局的取舍。', concepts: ['bitmask', 'basis blade', 'layout'], lab: '16 个 basis blades 的 bitmask 与布局检查器', status: 'ready', minutes: 26 },
      { id: 'product-tables', number: '8.2', title: '生成乘法表', summary: '由 metric 与位排列自动生成几何积符号和目标 blade。', concepts: ['Cayley table', 'metric', 'codegen'], lab: '切换 signature 的三维 Cayley table 生成器', status: 'ready', minutes: 30 },
      { id: 'numerical-validation', number: '8.3', title: '不变量、测试与数值稳定性', summary: '用范数、grade、sandwich 同态和退化度量不变量构建可验证的 GA 程序。', concepts: ['invariant', 'property testing', 'stability'], lab: 'float32 rotor 累计漂移与不变量监视器', status: 'ready', minutes: 30 },
      { id: 'webgpu-ga', number: '8.4', title: '在 WebGPU 中计算 GA', summary: '设计 WGSL 数据结构、批量 sandwich 运算与可视化管线。', concepts: ['WGSL', 'compute shader', 'instancing'], lab: '真实 WGSL instancing 批量转子实验', status: 'ready', minutes: 38 },
      { id: 'robotics', number: '8.5', title: '机器人学与骨骼动画', summary: '将 motors 用于正向运动学、逆运动学、skinning 与轨迹插值。', concepts: ['kinematics', 'skinning', 'optimization'], lab: '三连杆 motor IK', status: 'advanced', minutes: 40 },
      { id: 'cameras-rays', number: '8.6', title: '相机、射线与相交', summary: '用 PGA/CGA 表达投影相机、射线构造和统一几何相交。', concepts: ['camera', 'ray', 'intersection'], lab: 'PGA 针孔相机', status: 'advanced', minutes: 36 },
      { id: 'dynamics', number: '8.7', title: '刚体动力学与几何物理', summary: '用 bivector 表示角速度、动量与力矩，并让 motor 微分方程保持几何约束。', concepts: ['rigid body dynamics', 'momentum', 'wrench'], lab: '无约束刚体积分器', status: 'advanced', minutes: 40 },
    ],
  },
];

export const allLessons = modules.flatMap(module => module.lessons);
export const firstLesson = allLessons[0];

export const auditFindings = [
  { gap: '前置数学', before: '直接从向量跳入四元数', added: '补入点积、范数、定向与坐标框架' },
  { gap: '关键桥梁', before: '四元数与 GA 相邻但未连接', added: '新增 Cl⁺(3,0) 与双向量基的同构' },
  { gap: '代数结构', before: '缺少内积约定、outermorphism 与 blade 可分解性', added: '补齐 contraction、线性变换和简单 blade' },
  { gap: '变换理论', before: '转子之后直接进入几何模型', added: '补入 Pin/Spin、SO(p,q) 与 Lie 代数' },
  { gap: '几何模型', before: 'PGA 直接进入三维对象', added: '先学 2D PGA，再进入三维线和 motor' },
  { gap: '连续与计算', before: '缺少几何微积分和数值验证', added: '新增完整微积分单元与不变量测试' },
];

export const references = [
  { title: 'Geometric Algebra for Computer Science', note: '整体课程顺序与几何模型路线', url: 'https://geometricalgebra.org/tour.html' },
  { title: 'GA for Computer Graphics · SIGGRAPH 2019', note: 'PGA、计算实现与工程应用', url: 'https://arxiv.org/abs/2002.04509' },
  { title: 'ganja.js CoffeeShop', note: 'PGA/CGA/时空的互动实验主题', url: 'https://enkimute.github.io/ganja.js/examples/coffeeshop.html' },
  { title: "Introduction to Clifford's Geometric Algebra", note: '平面、三维、时空与共形模型总览', url: 'https://arxiv.org/abs/1306.1660' },
];
