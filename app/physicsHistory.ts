export type PhysicsEra = {
  id: string;
  span: string;
  title: string;
  question: string;
  evidence: string;
  model: string;
  limit: string;
  bridge: string;
  lessonId: string;
};

export const physicsEras: PhysicsEra[] = [
  {
    id: 'sky', span: '古代—1600', title: '先把天空与运动测准',
    question: '天体与地面物体的运动，能否被同一套可重复的测量描述？',
    evidence: '历法、日食预测、行星位置与落体实验把“看见”逐渐变成可比较的数据。',
    model: '从几何天文到日心模型，运动开始用位置、时间和轨道来表达。',
    limit: '精确描述轨迹，还没有说明“为什么会这样运动”。',
    bridge: '先把位置、位移和参考系分开，才谈得上运动。', lessonId: 'coordinates-vectors',
  },
  {
    id: 'mechanics', span: '1600—1750', title: '力学把地面和天空连成一套规律',
    question: '掉落的苹果与绕行的月亮，能否服从同一规律？',
    evidence: '斜面、摆、炮弹轨迹和行星数据让速度、加速度、周期可被量化。',
    model: '牛顿力学用运动定律与万有引力把受力和轨迹联系起来。',
    limit: '它默认时间绝对、速度远低于光速，并没有说明引力如何传播。',
    bridge: '向量记录方向；导数把位置变化成速度与加速度。', lessonId: 'ga-vector-calculus',
  },
  {
    id: 'waves', span: '1650—1900', title: '振动、流体与波把局部运动连成整体',
    question: '一根弦、一池水与空气中的声音，为何会出现相似的模式？',
    evidence: '摆、弦振动、声速、驻波、干涉与流体实验让频率、波长和共振可被精确比较。',
    model: '连续介质模型用局部耦合解释波的传播；边界条件选择允许出现的正常模。',
    limit: '连续模型忽略物质的原子结构；强非线性、湍流和冲击波需要更复杂理论。',
    bridge: '微分方程描述局部变化，频率分解把复杂振动拆成简单模式。', lessonId: 'ga-vector-calculus',
  },
  {
    id: 'energy', span: '1750—1850', title: '能量、热与不可逆过程',
    question: '热为何能做功？又为何不能把一切过程倒放？',
    evidence: '蒸汽机效率、气体压强和热量实验显示：能量会转化，却有方向性的限制。',
    model: '热力学把能量守恒与熵增分开；统计观点将温度连接到大量微观运动。',
    limit: '宏观定律本身不直接告诉我们单个原子或分子的具体轨迹。',
    bridge: '连续变化与守恒量，是几何微积分进入物理的第一道门。', lessonId: 'multivector-derivative',
  },
  {
    id: 'fields', span: '1800—1905', title: '电、磁、光成为同一个场',
    question: '隔着真空，影响如何传播？',
    evidence: '电流偏转磁针、电磁感应、光速测量与干涉实验表明：电和磁不是孤立现象。',
    model: 'Maxwell 方程把电场、磁场和光组织为会传播的电磁场。',
    limit: '经典场论不能解释原子光谱、光电效应与微观测量的概率性。',
    bridge: '在时空 GA 中，电场与磁场可看作同一双向量的不同观察者分解。', lessonId: 'spacetime-bivectors',
  },
  {
    id: 'relativity', span: '1905—1916', title: '时间与空间不再各自绝对',
    question: '若光速对所有惯性观察者相同，哪些量必须改变？',
    evidence: '电磁学、精密钟、粒子寿命与后来的导航系统都检验了相对论效应。',
    model: '狭义相对论以不变时空间隔替代绝对时间；广义相对论把引力描述为时空几何。',
    limit: '广义相对论在极端微观尺度尚未与量子理论统一。',
    bridge: 'Lorentz boost 不是普通旋转，而是保持 Minkowski 度量的双曲旋转。', lessonId: 'lorentz-boost',
  },
  {
    id: 'quantum', span: '1900—1935', title: '微观世界用振幅而非确定轨道说话',
    question: '为什么原子稳定？为什么干涉图样会一粒一粒累积？',
    evidence: '原子光谱、黑体辐射、光电效应、电子衍射与双缝实验迫使理论改变。',
    model: '量子理论先计算概率振幅，再由测量结果检验统计分布。',
    limit: '量子理论并不让所有解释问题自动消失；测量、引力和量子信息仍有开放问题。',
    bridge: '复数相位、旋转和线性叠加，是读懂量子振幅的最低数学准备。', lessonId: 'complex-rotation',
  },
  {
    id: 'particles', span: '1930—1970', title: '原子核与粒子：从“许多粒子”到标准模型',
    question: '原子核里有什么？不同粒子又为何会互相转化？',
    evidence: '放射性、散射实验、粒子加速器和衰变产物让微观结构变得可测。',
    model: '量子场论与标准模型组织已知基本粒子，并精确描述电磁、弱和强相互作用。',
    limit: '标准模型不包含量子化的引力，也未说明暗物质和中微子质量的全部来源。',
    bridge: '自旋、对称性和 Lorentz 变换是从空间几何走向粒子物理的共同语言。', lessonId: 'spacetime-spinors',
  },
  {
    id: 'matter', span: '1900—今天', title: '凝聚态物理解释材料与电子时代',
    question: '为什么同样由电子和原子组成，有些材料导电、有些绝缘、有些超导？',
    evidence: '晶体衍射、比热、电阻、半导体结与量子霍尔等实验显示：大量粒子会形成新的集体现象。',
    model: '能带、准粒子、序参量和自发对称破缺把微观量子规律连接到材料性质。',
    limit: '强关联材料、高温超导和远离平衡态的集体行为仍包含重要开放问题。',
    bridge: '局部微观自由度经过对称与集体组织，能产生宏观上全新的有效规律。', lessonId: 'algebra-atlas',
  },
  {
    id: 'complexity', span: '1950—今天', title: '信息、非线性与复杂系统进入物理',
    question: '简单定律为什么会产生湍流、天气和难以预测的集体行为？',
    evidence: '计算机模拟、混沌实验、临界现象、网络数据和地球观测揭示跨尺度关联与初值敏感性。',
    model: '非线性动力学、统计场论、信息论和多尺度模型研究从局部规则涌现出的宏观结构。',
    limit: '可模拟不等于可长期预测；模型必须给出误差、不确定性和适用尺度。',
    bridge: '守恒量、不变量与尺度分析帮助我们在复杂轨迹中辨认可复用结构。', lessonId: 'dynamics',
  },
  {
    id: 'cosmology', span: '1920—今天', title: '宇宙学：让整个宇宙成为可检验对象',
    question: '宇宙一直如此，还是会演化？',
    evidence: '星系红移、宇宙微波背景、轻元素丰度和引力波天文观测提供彼此独立的线索。',
    model: '广义相对论下的膨胀宇宙模型解释多项观测；早期热宇宙留下可测的微波背景。',
    limit: '暗物质、暗能量、暴胀的微观机制与最早期条件仍不清楚。',
    bridge: '先理解时空间隔与曲率，才能分清“宇宙在膨胀”并不是普通爆炸。', lessonId: 'minkowski-metric',
  },
  {
    id: 'frontier', span: '今天', title: '成功的框架，也清楚标出边界',
    question: '粒子、宇宙与引力能否成为同一幅图？',
    evidence: '加速器散射、宇宙微波背景、引力波和精密天文观测不断缩小可行理论的空间。',
    model: '研究者提出多种量子引力、暗物质和早期宇宙模型，并以新数据筛选，而非把猜想当结论。',
    limit: '目前没有一个被实验证实的“万有理论”；未知是可研究的边界，不是填空题。',
    bridge: 'GA 是统一表示的强工具；它不自动给出自然界最终理论。', lessonId: 'algebra-atlas',
  },
];

export const physicsEraLearning: Record<string, { level: string; prerequisites: string; outcome: string; demoId: string }> = {
  sky: { level: '入门', prerequisites: '比例、角度、读图', outcome: '区分一次观察与可重复测量', demoId: 'measure' },
  mechanics: { level: '入门', prerequisites: '一次函数、向量初步', outcome: '用状态、变化率和力解释运动', demoId: 'fall' },
  waves: { level: '基础', prerequisites: '三角函数、周期', outcome: '从边界条件理解驻波与共振', demoId: 'resonance' },
  energy: { level: '基础', prerequisites: '功、能量、平均值', outcome: '区分能量守恒与过程方向', demoId: 'heat' },
  fields: { level: '基础', prerequisites: '向量、正弦函数', outcome: '把场理解为空间中可传播的状态', demoId: 'field' },
  relativity: { level: '进阶', prerequisites: '勾股定理、函数图像', outcome: '用不变量替代绝对时空直觉', demoId: 'clock' },
  quantum: { level: '进阶', prerequisites: '概率、复数初步', outcome: '区分振幅演化与测量概率', demoId: 'quantum' },
  particles: { level: '进阶', prerequisites: '能量、动量、量子初步', outcome: '从散射和衰变读出微观结构', demoId: 'decay' },
  matter: { level: '前沿入口', prerequisites: '原子、波、能级', outcome: '理解集体行为与能带为何产生材料差异', demoId: 'matter' },
  complexity: { level: '前沿入口', prerequisites: '函数迭代、误差', outcome: '区分确定性、可预测性与模型不确定性', demoId: 'chaos' },
  cosmology: { level: '前沿入口', prerequisites: '引力、光谱、相对论初步', outcome: '用多类观测约束宇宙演化模型', demoId: 'cosmos' },
  frontier: { level: '前沿入口', prerequisites: '完成任一现代物理分支', outcome: '区分已验证框架与真正开放问题', demoId: 'atom' },
};

export const physicsDomains = [
  { title: '运动与引力', start: '速度、加速度、向量', expands: '轨道、连续介质、广义相对论', labs: ['落体', '轨道', '光钟'] },
  { title: '能量与热统计', start: '功、能量、平均数', expands: '熵、统计力学、临界现象', labs: ['热平衡', '分子气体'] },
  { title: '波、光与场', start: '三角函数、波长', expands: 'Maxwell 场、光学、规范场', labs: ['共振', '电磁波', '电磁感应'] },
  { title: '量子与微观结构', start: '概率、复数、能量', expands: '量子场论、核物理、量子信息', labs: ['双缝', '原子光谱', '衰变'] },
  { title: '物质与技术', start: '原子、晶体、电路', expands: '能带、超导、拓扑物态', labs: ['半导体能隙', '集体行为'] },
  { title: '宇宙与复杂系统', start: '引力、函数迭代、误差', expands: '宇宙学、气候、非线性动力学', labs: ['双摆混沌', '宇宙膨胀'] },
];

export const physicsLearningStages = [
  { number: '01', title: '从测量开始', level: '高中基础', goal: '读坐标、估计误差、识别控制变量，先问数据究竟支持什么。', checks: ['能区分精度与准确度', '能读斜率和面积', '能陈述理想化条件'] },
  { number: '02', title: '建立经典模型', level: '高中核心', goal: '用力、能量、动量、波和场解释一组现象，并知道模型的适用范围。', checks: ['向量与三角函数', '守恒关系', '函数随时间变化'] },
  { number: '03', title: '跨过现代物理门槛', level: '大学入口', goal: '用不变量、概率振幅、能级和统计规律替代不再适用的日常直觉。', checks: ['复数与概率', '极限与微分直觉', '能区分模型与解释'] },
  { number: '04', title: '阅读真实前沿', level: '专题深入', goal: '沿先修路线理解一个成功理论、关键证据、预测能力和仍未解决的问题。', checks: ['追踪三层先修', '比较独立证据', '明确未知而不夸大'] },
];

export const physicsFrontierPaths = [
  { title: '相对论 → 引力波与黑洞', start: '光、勾股定理、加速度', bridge: '时空间隔 → 曲率 → 波动时空', success: '引力波探测与黑洞成像让强引力现象可以被多种观测交叉检验', open: '黑洞内部与量子效应如何一致描述？', lessonId: 'lorentz-boost' },
  { title: '量子 → 量子信息', start: '概率、复数、向量', bridge: '叠加 → 纠缠 → 量子门与误差校正', success: '精密量子传感、量子通信实验和可编程量子处理器已能操控小型量子系统', open: '怎样规模化并获得可验证、容错的量子优势？', lessonId: 'spacetime-spinors' },
  { title: '粒子 → 标准模型之外', start: '能量、动量、概率', bridge: '对称性 → 量子场 → 散射与衰变', success: '标准模型统一描述三种非引力相互作用并通过大量精密实验', open: '暗物质、中微子质量和物质—反物质不对称来自哪里？', lessonId: 'lie-algebra' },
  { title: '凝聚态 → 新型量子材料', start: '原子、晶体、电流', bridge: '能带 → 多体与对称性 → 拓扑物态', success: '半导体、激光、磁存储和量子霍尔效应把量子规律转化为材料功能', open: '强关联与高温超导能否获得统一、可预测的微观解释？', lessonId: 'algebra-atlas' },
  { title: '统计物理 → 气候与生命', start: '热、概率、反馈', bridge: '随机过程 → 非线性与尺度 → 多体涌现', success: '多尺度模型能综合物理定律与观测，给出带不确定性的天气和气候预测', open: '如何可靠描述跨越巨大时空尺度的极端事件与生命系统？', lessonId: 'dynamics' },
  { title: '宇宙学 → 暗宇宙与早期宇宙', start: '引力、光谱、膨胀', bridge: '广义相对论 → 热宇宙 → 结构形成', success: '红移、微波背景、轻元素和大尺度结构共同支持演化宇宙图景', open: '暗物质、暗能量与最早期条件究竟是什么？', lessonId: 'minkowski-metric' },
];

export const physicsReferences = [
  { title: 'AIP Center for History of Physics', note: '物理学史的馆藏与主题导览', url: 'https://history.aip.org/' },
  { title: 'Einstein Online · Special Relativity', note: '相对论的概念与历史背景', url: 'https://www.einstein-online.info/en/spotlight/special_relativity/' },
  { title: 'CERN · The Standard Model', note: '标准模型的适用范围与实验地位', url: 'https://home.cern/science/physics/standard-model/' },
  { title: 'NASA · Big Bang and the Evolution of the Universe', note: '宇宙微波背景与宇宙演化的观测证据', url: 'https://science.nasa.gov/astrophysics/programs/physics-of-the-cosmos/big-bang-and-the-evolution-of-the-universe/' },
];
