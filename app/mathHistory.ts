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
    id: 'computation', span: '约 1930—今天', region: '全球数学共同体', title: '可计算性、信息与新几何',
    question: '什么能够被算法算出？',
    story: '可计算性理论划出算法边界，计算机把数值实验变成发现工具；拓扑、范畴、动力系统、优化与机器学习继续重组数学分支。证明、模拟和数据如今彼此协作。',
    ideas: ['可计算性', '拓扑与抽象结构', '数值实验'], bridge: 'WebGPU 让数百万次几何运算成为实时可见的思想实验。', lessonId: 'webgpu-ga',
  },
];

export const historyPrinciples = [
  ['不是单线进步', '同一观念常在不同地区独立出现、失传、翻译，再被重新组织。'],
  ['问题先于符号', '新记号成功，是因为它压缩了旧方法中的重复推理。'],
  ['抽象来自比较', '把多个具体问题并置，才会显出共同结构与不变量。'],
  ['图形可以推理', '好的互动图不只展示结果，还让你改变假设并检查什么保持不变。'],
] as const;
