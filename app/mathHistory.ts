export type HistoryEra = {
  id: string;
  span: string;
  region: string;
  title: string;
  question: string;
  story: string;
  ideas: string[];
  bridge: string;
  lessonId: string;
};

export const historyEras: HistoryEra[] = [
  {
    id: 'measure', span: '约前 3000—前 500', region: '两河流域 · 埃及', title: '数从记录与测量中诞生',
    question: '怎样记录比手指更多的数量？',
    story: '账目、历法和土地丈量推动了记数与算法。六十进制留下了今天的 60 秒和 360 度；位置记数法让同一个符号因位置而改变价值。',
    ideas: ['位置记数', '六十进制', '测量算法'], bridge: '坐标也是“对象的记数法”，但对象本身不等于坐标。', lessonId: 'coordinates-vectors',
  },
  {
    id: 'proof', span: '约前 600—公元 200', region: '希腊化世界', title: '从会算走向为什么必然',
    question: '一个结论怎样不依赖测量误差？',
    story: '演绎证明把定义、公设和命题组织成可追溯的逻辑链。圆锥曲线、穷竭法和几何构造显示：图形不只是插图，也可以承担推理。',
    ideas: ['公理化', '演绎证明', '圆锥曲线'], bridge: '几何代数继续追问：能否让代数运算本身保存几何证明？', lessonId: 'geometric-product',
  },
  {
    id: 'algorithms', span: '前 200—公元 700', region: '中国 · 印度', title: '算法、负数与零改变计算',
    question: '空位、亏欠和联立问题如何进入数字？',
    story: '《九章算术》的方程术系统处理线性问题，印度数学传统发展十进位值制与零的运算。数学开始更像一套可复用的程序，而不只是孤立答案。',
    ideas: ['消元算法', '负数', '零与十进位值制'], bridge: '自动化步骤最终会通向矩阵、计算机程序与符号计算。', lessonId: 'product-tables',
  },
  {
    id: 'algebra', span: '约 800—1400', region: '伊斯兰世界及欧亚交流', title: '未知量获得自己的语言',
    question: '能否把不同题目化成同一种结构？',
    story: '代数学把配方法、方程分类和系统算法组织为独立学科；天文、光学与三角学在翻译、校订和新研究中共同推进。知识沿多条路线跨语言流动。',
    ideas: ['代数学', '三角学', '光学与模型'], bridge: '抽象不是离开图形，而是找出许多图形共享的运算骨架。', lessonId: 'outermorphisms',
  },
  {
    id: 'symbols', span: '约 1400—1650', region: '欧洲 · 印刷与跨洋交流', title: '符号、透视与方程塑造新空间',
    question: '当未知量和运算都有简洁符号，会发生什么？',
    story: '印刷帮助算法和符号趋于稳定，代数记号让长段文字推理压缩成可变形的式子。透视法把观看方式变成投影几何问题，三次与四次方程的求解又迫使数学家认真面对复数。',
    ideas: ['符号代数', '透视投影', '复数'], bridge: '更好的表示会把“难以想象”变成“可以运算”。', lessonId: 'complex-rotation',
  },
  {
    id: 'motion', span: '约 1500—1700', region: '欧洲科学革命', title: '坐标与微积分让运动可计算',
    question: '瞬间速度和连续变化怎样写成数学？',
    story: '解析几何把曲线翻译成方程；对数压缩计算；微积分把无穷小变化与总体积累联系起来。自然现象第一次可以被一套连续语言大规模建模。',
    ideas: ['解析几何', '对数', '微积分'], bridge: '导数描述局部生成元，积分把无数局部变化重新拼回整体。', lessonId: 'multivector-derivative',
  },
  {
    id: 'waves', span: '约 1700—1850', region: '欧洲与全球科学网络', title: '函数、概率与波动成为对象',
    question: '复杂声音能否由简单振动叠成？',
    story: '函数观念逐渐独立，概率连接不确定性，傅里叶方法用正弦波分解热与声音。数学对象从静态形状扩展到分布、场和频谱。',
    ideas: ['函数', '概率', '傅里叶分析'], bridge: '一个复杂状态可以按不同 grade、频率或基方向分解。', lessonId: 'blades-grades',
  },
  {
    id: 'structures', span: '约 1800—1930', region: '多中心现代数学', title: '非欧几何与结构观出现',
    question: '如果平行公设改变，几何还成立吗？',
    story: '非欧几何、群论、复分析、集合论与严格化运动改变了“数学真理”的含义：研究者不再只研究一种空间，而是比较一族由公理和变换定义的结构。',
    ideas: ['非欧几何', '群与对称', '严格化'], bridge: 'signature 改变时，同一套 Clifford 运算会生成不同几何。', lessonId: 'metric-signature',
  },
  {
    id: 'foundations', span: '约 1870—1936', region: '欧洲及国际学术网络', title: '集合、逻辑与无穷追问基础',
    question: '数学能否被一套无矛盾规则完全机械化？',
    story: '集合论为无穷建立层次，数理逻辑把证明本身变成研究对象。悖论、形式化和不完备性结果说明：严格规则极其强大，但“所有真命题都能由固定系统证明”是过高的期待。',
    ideas: ['集合与无穷', '形式逻辑', '可判定性边界'], bridge: '公理规定允许的操作，模型告诉我们这些规则描述了哪一种世界。', lessonId: 'pin-spin-groups',
  },
  {
    id: 'computation', span: '约 1930—1980', region: '全球数学共同体', title: '可计算性与信息成为数学对象',
    question: '什么能够被算法算出？',
    story: '可计算性理论划出算法边界，信息论把通信限制写成数学，电子计算机让迭代、模拟和离散算法进入日常研究。数学不再只问答案是什么，也问需要多少时间和信息才能得到。',
    ideas: ['可计算性', '信息与编码', '算法复杂度'], bridge: '数据结构和计算代价决定一个漂亮公式能否实时运行。', lessonId: 'ga-data-layout',
  },
  {
    id: 'nonlinear', span: '约 1960—2000', region: '全球计算科学', title: '混沌、分形与复杂系统显形',
    question: '完全确定的规则，为什么仍会难以预测？',
    story: '非线性动力系统、分形和计算实验揭示了初值敏感性：简单递推也能产生周期倍增与混沌。概率、几何和微分方程开始共同描述天气、生态和网络。',
    ideas: ['非线性', '混沌', '分形与尺度'], bridge: '不变量帮助我们在看似杂乱的轨迹中识别结构。', lessonId: 'dynamics',
  },
  {
    id: 'frontiers', span: '约 1980—今天', region: '全球协作与开放计算', title: '证明、模拟与数据共同探索前沿',
    question: '今天的数学如何连接量子、生命、智能与宇宙？',
    story: '现代研究把几何、概率、优化、数论和计算交叉使用：从安全通信、误差校正和医学成像，到几何流、量子信息与机器辅助证明。前沿并非突然出现，它们都能沿着早期观念找到先修阶梯。',
    ideas: ['几何与拓扑', '优化与学习', '机器辅助证明'], bridge: '前沿入口不是背名词，而是从一个可操作模型逐级增加结构。', lessonId: 'webgpu-ga',
  },
];

export const eraLearning: Record<string, { level: string; prerequisites: string; outcome: string; demoId: string }> = {
  measure: { level: '入门', prerequisites: '整数、除法', outcome: '区分“数量”与“表示数量的符号”', demoId: 'numerals' },
  proof: { level: '入门', prerequisites: '全等、面积', outcome: '理解图形如何承担可复核的证明', demoId: 'pythagoras' },
  algorithms: { level: '入门', prerequisites: '一次方程', outcome: '把解题过程看成可重复的算法', demoId: 'algebra' },
  algebra: { level: '基础', prerequisites: '因式分解、勾股定理', outcome: '看到代数与几何是两种互译语言', demoId: 'algebra' },
  symbols: { level: '基础', prerequisites: '复数初步、坐标系', outcome: '理解符号系统怎样扩展可思考的对象', demoId: 'complex' },
  motion: { level: '基础', prerequisites: '函数图像、极限直觉', outcome: '把局部变化和总体积累联系起来', demoId: 'calculus' },
  waves: { level: '进阶', prerequisites: '三角函数、概率初步', outcome: '用基分解理解函数、信号与分布', demoId: 'fourier' },
  structures: { level: '进阶', prerequisites: '平面几何、变换', outcome: '接受多种几何并比较它们的不变量', demoId: 'curvature' },
  foundations: { level: '进阶', prerequisites: '集合、充分必要条件', outcome: '区分真、可证与可计算', demoId: 'topology' },
  computation: { level: '进阶', prerequisites: '函数、二进制直觉', outcome: '理解算法也有边界与资源成本', demoId: 'optimization' },
  nonlinear: { level: '前沿入口', prerequisites: '函数迭代、数列', outcome: '识别确定性规则中的不可预测性', demoId: 'chaos' },
  frontiers: { level: '前沿入口', prerequisites: '完成任一进阶分支', outcome: '为前沿主题画出可执行的先修路线', demoId: 'optimization' },
};

export const knowledgeDomains = [
  { id: 'number', title: '数与代数', start: '整数、方程', expands: '数论、抽象代数', demos: ['进位记数', '配方法', '质数筛法', '复数旋转'] },
  { id: 'geometry', title: '几何与拓扑', start: '全等、圆与坐标', expands: '流形、拓扑、几何流', demos: ['勾股拼图', '圆锥曲线', '曲率', '欧拉示性数'] },
  { id: 'analysis', title: '变化与分析', start: '函数、数列、三角函数', expands: '微分方程、泛函分析', demos: ['切线与积分', '傅里叶合成'] },
  { id: 'chance', title: '概率与数据', start: '计数、平均数', expands: '统计推断、随机过程', demos: ['二项分布', '重复抽样', '优化轨迹'] },
  { id: 'logic', title: '逻辑与计算', start: '命题、算法', expands: '图论、可计算性、复杂度', demos: ['证明结构', '最短路', '迭代与混沌'] },
  { id: 'structure', title: '结构与对称', start: '变换、方程组', expands: '群、表示、范畴', demos: ['复乘法', '非欧测地线'] },
];

export const learningStages = [
  { number: '01', title: '看见模式', level: '只需初中—高中基础', goal: '先预测图形怎样变化，用语言描述不变量；公式只作为观察结果的压缩。', checkpoints: ['能读懂坐标与比例', '能解释一次方程', '愿意先猜再验证'] },
  { number: '02', title: '连接表示', level: '高中核心数学', goal: '在图形、表格、方程和算法之间来回翻译，理解同一对象可以有多种表示。', checkpoints: ['函数与图像', '三角函数', '复数与向量初步'] },
  { number: '03', title: '寻找结构', level: '大学入口', goal: '比较不同公理和运算下什么保持不变，进入线性代数、微积分、概率与群论。', checkpoints: ['极限直觉', '矩阵初步', '集合与逻辑'] },
  { number: '04', title: '走向前沿', level: '专题式深入', goal: '选择一条真实研究路线，补齐先修，再理解成果、限制和仍然开放的问题。', checkpoints: ['能追踪三层先修', '能区分定理与模型', '能用实验检验猜想'] },
];

export const frontierPaths = [
  { title: '数论 → 现代密码', start: '整除、余数、指数', bridge: '模运算 → 有限域 → 椭圆曲线', success: '让公开信道上的身份验证与加密成为可能', open: '量子计算时代如何设计高效且可信的新密码？', lessonId: 'algebra-atlas' },
  { title: '几何 → 拓扑与形状分析', start: '多边形、连续变形', bridge: '欧拉示性数 → 同伦 → 流形与几何流', success: '用拓扑不变量分类形状，并支持数据与材料中的结构识别', open: '高维空间的形状如何被有限计算可靠捕捉？', lessonId: 'non-euclidean-cga' },
  { title: '复数 → 量子信息', start: '概率、复数、向量', bridge: '复向量空间 → 张量积 → 测量与纠缠', success: '量子误差校正把脆弱量子态编码成可检测的结构', open: '哪些问题能获得可验证的量子优势？', lessonId: 'spacetime-spinors' },
  { title: '对称 → 数学物理', start: '旋转、守恒、方程', bridge: '群 → Lie 代数 → 表示与规范场', success: '用对称统一描述旋转、粒子状态和守恒律', open: '量子理论与弯曲时空如何进入同一个一致框架？', lessonId: 'lie-algebra' },
  { title: '微积分 → 优化与机器学习', start: '函数、导数、向量', bridge: '梯度 → 高维优化 → 泛化与概率模型', success: '从数据中训练可用于识别、预测与生成的模型', open: '怎样解释模型为何有效，并给出可靠的误差与安全保证？', lessonId: 'automatic-differentiation' },
  { title: '逻辑 → 机器辅助证明', start: '命题、反证法、算法', bridge: '形式系统 → 类型论 → 证明检查与搜索', success: '让复杂证明被计算机逐步核验，并复用为可信数学库', open: '自动搜索如何兼顾创造性、可读性与严格验证？', lessonId: 'product-tables' },
];

export const historyPrinciples = [
  ['不是单线进步', '同一观念常在不同地区独立出现、失传、翻译，再被重新组织。'],
  ['问题先于符号', '新记号成功，是因为它压缩了旧方法中的重复推理。'],
  ['抽象来自比较', '把多个具体问题并置，才会显出共同结构与不变量。'],
  ['图形可以推理', '好的互动图不只展示结果，还让你改变假设并检查什么保持不变。'],
] as const;
