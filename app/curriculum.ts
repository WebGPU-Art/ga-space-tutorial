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
      { id: 'complex-rotation', number: '0.2', title: '复数：二维旋转的原型', summary: '把复数乘法看成平面中的缩放与旋转，第一次遇见指数形式。', concepts: ['复平面', '欧拉公式', '单位圆'], lab: '拖动复数观察乘法轨迹', status: 'outline', minutes: 18 },
      { id: 'coordinates-vectors', number: '0.3', title: '向量、基与坐标', summary: '区分几何向量与它在一组基中的坐标，为后续的基无关表达做准备。', concepts: ['向量空间', '基', '坐标变换'], lab: '切换基但保持向量不变', status: 'outline', minutes: 16 },
    ],
  },
  {
    id: 'quaternions', number: '01', title: '四元数与三维旋转', subtitle: '先掌握可操作的旋转语言', color: '#4bdab0',
    lessons: [
      { id: 'quaternion-anatomy', number: '1.1', title: '四元数的四个分量', summary: '理解标量部与虚部，不把四元数误解成普通四维向量。', concepts: ['Hamilton 乘法', '共轭', '模'], lab: '四元数乘法表', status: 'outline', minutes: 20 },
      { id: 'axis-angle', number: '1.2', title: '轴角与单位四元数', summary: '从旋转轴和半角构造单位四元数，理解为什么角度必须折半。', concepts: ['轴角', '半角', '单位四元数'], lab: '轴角—四元数双向转换', status: 'outline', minutes: 24 },
      { id: 'quaternion-lab', number: '1.3', title: '实验：绕任意轴旋转', summary: '在三维空间中调节旋转角和旋转轴，观察 qvq⁻¹ 如何保持长度。', concepts: ['夹心积', '范数保持', '任意轴'], lab: 'WebGPU 任意轴旋转实验', status: 'ready', minutes: 25 },
      { id: 'composition', number: '1.4', title: '旋转复合与不可交换性', summary: '比较先绕 x 再绕 y 与相反顺序，建立群运算直觉。', concepts: ['复合', '非交换', '局部/世界坐标'], lab: '交换旋转顺序', status: 'outline', minutes: 20 },
      { id: 'double-cover', number: '1.5', title: '双覆盖：q 与 −q', summary: '理解两个相反四元数为何描述同一空间旋转，以及 720° 现象。', concepts: ['SO(3)', 'Spin(3)', '双覆盖'], lab: '四元数球上的 720° 路径', status: 'outline', minutes: 22 },
      { id: 'slerp', number: '1.6', title: 'SLERP 与旋转插值', summary: '沿单位四元数球的大圆，以恒定角速度在姿态之间插值。', concepts: ['球面插值', '最短弧', '姿态动画'], lab: '线性插值与 SLERP 对照', status: 'outline', minutes: 26 },
    ],
  },
  {
    id: 'ga-core', number: '02', title: '几何代数核心', subtitle: '把方向、平面和体积变成可计算对象', color: '#b69bf2',
    lessons: [
      { id: 'metric-signature', number: '2.1', title: '基向量、度量与 signature', summary: '用基向量的平方规定空间度量，比较欧氏、退化与时空度量。', concepts: ['eᵢ²', '度量', 'Cl(p,q,r)'], lab: '切换空间 signature', status: 'outline', minutes: 24 },
      { id: 'outer-product', number: '2.2', title: '外积：张成有向子空间', summary: '从两条向量张出双向量，理解面积、方向与反对称性。', concepts: ['楔积', '双向量', '定向面积'], lab: '拖动向量张开平面', status: 'outline', minutes: 28 },
      { id: 'blades-grades', number: '2.3', title: 'Blade、grade 与多向量', summary: '建立标量、向量、双向量、三向量和多向量的分层图景。', concepts: ['blade', 'grade', 'multivector'], lab: '多向量分量检查器', status: 'outline', minutes: 25 },
      { id: 'geometric-product', number: '2.4', title: '几何积：度量与方向合一', summary: '理解 ab = a·b + a∧b，以及几何积为何可逆且可复合。', concepts: ['几何积', '内积', '外积'], lab: '几何积分解器', status: 'outline', minutes: 32 },
      { id: 'involutions', number: '2.5', title: '反演、共轭与逆', summary: '区分 reverse、grade involution 和 Clifford conjugation，并用于构造逆。', concepts: ['reverse', 'involution', 'inverse'], lab: '逐 grade 观察符号变化', status: 'outline', minutes: 24 },
      { id: 'duality', number: '2.6', title: '伪标量与对偶', summary: '把子空间与其正交补联系起来，解释三维叉积只是外积的对偶。', concepts: ['伪标量', 'dual', '叉积'], lab: '外积与叉积对照', status: 'outline', minutes: 24 },
      { id: 'projection', number: '2.7', title: '投影与拒绝', summary: '把向量分解成平行和垂直于子空间的部分，推广到任意 blade。', concepts: ['projection', 'rejection', 'contraction'], lab: '向量—平面分解', status: 'outline', minutes: 22 },
      { id: 'meet-join', number: '2.8', title: 'Join、meet 与相交', summary: '用代数表达张成和交集，为直线、平面、圆和球的统一运算铺路。', concepts: ['join', 'meet', 'regressive product'], lab: '平面相交生成直线', status: 'outline', minutes: 30 },
    ],
  },
  {
    id: 'versors', number: '03', title: '反射、转子与变换', subtitle: '从一次反射走向 n 维旋转', color: '#f07f63',
    lessons: [
      { id: 'reflection', number: '3.1', title: '一次反射', summary: '从向量在超平面上的反射公式理解最基本的 versor 作用。', concepts: ['反射', 'sandwich', 'versor'], lab: '旋转镜面与反射向量', status: 'outline', minutes: 22 },
      { id: 'double-reflection', number: '3.2', title: '两次反射就是旋转', summary: '让两面镜子夹出旋转平面与半角，自然导出 rotor。', concepts: ['双反射', '半角', '旋转平面'], lab: '镜面对生成转子', status: 'outline', minutes: 26 },
      { id: 'rotor-sandwich', number: '3.3', title: 'Rotor 与夹心作用', summary: '用 R X R̃ 同时旋转向量、平面和其他多向量。', concepts: ['rotor', 'reverse', '结构保持'], lab: '同一转子作用于多种对象', status: 'outline', minutes: 28 },
      { id: 'bivector-exp', number: '3.4', title: '双向量指数与对数', summary: '从 exp(−Bθ/2) 构造转子，并由 log(R) 读回旋转生成元。', concepts: ['指数映射', '生成元', '对数'], lab: '双向量指数展开', status: 'outline', minutes: 32 },
      { id: 'rotor-interpolation', number: '3.5', title: '转子插值与平均', summary: '把四元数 SLERP 推广到 GA 转子，处理多姿态平均与估计。', concepts: ['插值', '平均', '估计'], lab: '多姿态转子平均', status: 'outline', minutes: 28 },
      { id: 'nd-rotation', number: '3.6', title: '高维旋转', summary: '理解四维及更高维旋转由多个独立旋转平面组成，而非单一旋转轴。', concepts: ['simple bivector', 'double rotation', 'n-D'], lab: '四维双旋转投影', status: 'advanced', minutes: 30 },
    ],
  },
  {
    id: 'pga', number: '04', title: 'PGA：位置与刚体运动', subtitle: '把无穷远加入欧氏空间', color: '#62a8e5',
    lessons: [
      { id: 'homogeneous-model', number: '4.1', title: '齐次模型与退化度量', summary: '引入平方为零的基向量，把方向与位置放进同一种代数。', concepts: ['homogeneous', 'null basis', 'PGA'], lab: '欧氏点的齐次嵌入', status: 'outline', minutes: 28 },
      { id: 'pga-primitives', number: '4.2', title: '点、线与平面', summary: '理解 PGA 中不同 grade 的对象，以及 primal/dual 两种约定。', concepts: ['point', 'line', 'plane'], lab: '点击生成点线面', status: 'outline', minutes: 30 },
      { id: 'pga-incidence', number: '4.3', title: '相交、连接与距离', summary: '用 meet/join 计算关联关系，再从度量中读出角度和距离。', concepts: ['incidence', 'join', 'meet'], lab: '拖动平面观察交线', status: 'outline', minutes: 32 },
      { id: 'translators', number: '4.4', title: '平移器与理想元素', summary: '把平移理解为绕无穷远元素的旋转，统一旋转和平移。', concepts: ['translator', 'ideal element', 'nilpotent'], lab: '平移器指数', status: 'outline', minutes: 26 },
      { id: 'motors', number: '4.5', title: 'Motor 与刚体运动', summary: '用一个偶多向量同时表示旋转和平移，对应双四元数。', concepts: ['motor', 'dual quaternion', 'SE(3)'], lab: '刚体运动分解', status: 'outline', minutes: 32 },
      { id: 'screw-motion', number: '4.6', title: '螺旋运动与插值', summary: '从 motor 的对数读出螺旋轴、角度与位移，实现自然姿态插值。', concepts: ['screw', 'motor log', 'ScLERP'], lab: '螺旋轨迹实验', status: 'advanced', minutes: 34 },
    ],
  },
  {
    id: 'cga', number: '05', title: 'CGA：圆、球与共形变换', subtitle: '让弯曲对象成为线性元素', color: '#59c5d8',
    lessons: [
      { id: 'conformal-embedding', number: '5.1', title: '共形嵌入与 null cone', summary: '增加原点与无穷远两个零向量，把欧氏点嵌入更高维 null cone。', concepts: ['null cone', 'embedding', 'distance'], lab: '抬升二维点到 null cone', status: 'outline', minutes: 30 },
      { id: 'rounds-flats', number: '5.2', title: '圆、球与平直对象', summary: '用 blade 直接表示点对、圆、球、线和平面。', concepts: ['round', 'flat', 'OPNS/IPNS'], lab: '多点张成圆与球', status: 'outline', minutes: 32 },
      { id: 'cga-intersections', number: '5.3', title: '统一相交与构造', summary: '用同一套 meet/join 处理线—球、圆—圆和球—球相交。', concepts: ['meet', 'point pair', 'tangent'], lab: '圆与球的实时相交', status: 'outline', minutes: 34 },
      { id: 'conformal-operators', number: '5.4', title: '反演、缩放与特殊共形变换', summary: '从球反射出发，理解角度保持但距离可改变的变换。', concepts: ['inversion', 'dilation', 'conformal'], lab: '网格的圆反演', status: 'advanced', minutes: 34 },
    ],
  },
  {
    id: 'spacetime', number: '06', title: '时空几何代数', subtitle: '旋转如何变成 Lorentz boost', color: '#8f9aee',
    lessons: [
      { id: 'minkowski-metric', number: '6.1', title: 'Minkowski 度量与事件', summary: '改变一个基向量的平方符号，空间旋转便延伸到时空几何。', concepts: ['event', 'proper time', 'signature'], lab: '光锥与时空间隔', status: 'advanced', minutes: 28 },
      { id: 'lorentz-boost', number: '6.2', title: 'Lorentz boost 是双曲旋转', summary: '用指数转子表达惯性系之间的 boost，并观察光锥保持不变。', concepts: ['rapidity', 'boost', 'hyperbolic rotor'], lab: '可调速度的光锥实验', status: 'advanced', minutes: 34 },
      { id: 'spacetime-bivectors', number: '6.3', title: '时空双向量与电磁场', summary: '把电场和磁场视为同一个时空双向量在不同观察者下的分解。', concepts: ['spacetime bivector', 'observer split', 'field'], lab: '观察者变换下的 E/B 混合', status: 'advanced', minutes: 36 },
    ],
  },
  {
    id: 'practice', number: '07', title: '计算、图形与工程实践', subtitle: '把几何公式落到程序里', color: '#a7b34b',
    lessons: [
      { id: 'ga-data-layout', number: '7.1', title: '多向量的数据布局', summary: '用位图索引 basis blade，理解稠密、稀疏和专用布局的取舍。', concepts: ['bitmask', 'basis blade', 'layout'], lab: '16 分量 multivector 检查器', status: 'advanced', minutes: 26 },
      { id: 'product-tables', number: '7.2', title: '生成乘法表', summary: '由 metric 与位排列自动生成几何积符号和目标 blade。', concepts: ['Cayley table', 'metric', 'codegen'], lab: '交互式乘法表生成器', status: 'advanced', minutes: 30 },
      { id: 'webgpu-ga', number: '7.3', title: '在 WebGPU 中计算 GA', summary: '设计 WGSL 数据结构、批量 sandwich 运算与可视化管线。', concepts: ['WGSL', 'compute shader', 'instancing'], lab: 'GPU 批量转子实验', status: 'advanced', minutes: 38 },
      { id: 'robotics', number: '7.4', title: '机器人学与骨骼动画', summary: '将 motors 用于正向运动学、逆运动学、skinning 与轨迹插值。', concepts: ['kinematics', 'skinning', 'optimization'], lab: '三连杆 motor IK', status: 'advanced', minutes: 40 },
      { id: 'cameras-rays', number: '7.5', title: '相机、射线与相交', summary: '用 PGA/CGA 表达投影相机、射线构造和统一几何相交。', concepts: ['camera', 'ray', 'intersection'], lab: 'PGA 针孔相机', status: 'advanced', minutes: 36 },
    ],
  },
];

export const allLessons = modules.flatMap(module => module.lessons);
export const firstLesson = allLessons[0];

export const references = [
  { title: 'Geometric Algebra for Computer Science', note: '整体课程顺序与几何模型路线', url: 'https://geometricalgebra.org/tour.html' },
  { title: 'GA for Computer Graphics · SIGGRAPH 2019', note: 'PGA、计算实现与工程应用', url: 'https://arxiv.org/abs/2002.04509' },
  { title: 'ganja.js CoffeeShop', note: 'PGA/CGA/时空的互动实验主题', url: 'https://enkimute.github.io/ganja.js/examples/coffeeshop.html' },
  { title: "Introduction to Clifford's Geometric Algebra", note: '平面、三维、时空与共形模型总览', url: 'https://arxiv.org/abs/1306.1660' },
];
