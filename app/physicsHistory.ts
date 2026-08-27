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

export const physicsReferences = [
  { title: 'AIP Center for History of Physics', note: '物理学史的馆藏与主题导览', url: 'https://history.aip.org/' },
  { title: 'Einstein Online · Special Relativity', note: '相对论的概念与历史背景', url: 'https://www.einstein-online.info/en/spotlight/special_relativity/' },
  { title: 'CERN · The Standard Model', note: '标准模型的适用范围与实验地位', url: 'https://home.cern/science/physics/standard-model/' },
  { title: 'NASA · Big Bang and the Evolution of the Universe', note: '宇宙微波背景与宇宙演化的观测证据', url: 'https://science.nasa.gov/astrophysics/programs/physics-of-the-cosmos/big-bang-and-the-evolution-of-the-universe/' },
];
