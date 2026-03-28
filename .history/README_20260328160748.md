# 包
1. `pnpm add element-plus @element-plus/icons-vue xlsx idb`
2. `pnpm add pinia-plugin-persistedstate` 持久化

# 项目结构
src/
├── api/
│   └── qianwen.ts          # 千问 API 封装
├── components/
│   ├── DataTable/
│   │   ├── VirtualTable.vue      # 虚拟滚动表格
│   │   └── useVirtualScroll.ts   # 虚拟滚动 Hook
│   ├── Dashboard/
│   │   ├── GridLayout.vue        # 拖拽网格布局
│   │   ├── ChartWidget.vue       # 图表组件
│   │   └── useDrag.ts            # 拖拽 Hook
│   └── AIAnalysis/
│       └── AIInsight.vue         # AI 分析面板
├── composables/
│   ├── useChart.ts         # 图表封装
│   ├── useFileParser.ts    # 文件解析
│   └── useAI.ts            # AI 调用封装
├── stores/
│   ├── data.ts             # 数据状态
│   └── dashboard.ts        # 仪表盘状态
├── types/
│   └── index.ts            # TS 类型定义
├── utils/
│   ├── dataProcessor.ts    # 数据处理
│   └── chartConfig.ts      # 图表配置
└── views/
    ├── Upload.vue          # 上传页面
    ├── DataView.vue        # 数据查看
    └── Dashboard.vue       # 仪表盘
