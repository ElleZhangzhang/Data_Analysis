<!-- DataView.vue (父组件) -->
<!-- <script setup>
import { useDataStore } from "@/stores/data";
// import VirtualTable from '@/components/DataTable/VirtualTable.vue'

const dataStore = useDataStore();
const currentDataset = dataStore.currentDataset; // 目前默认是第一个
</script>

<template>
  <VirtualTable :data="currentDataset.rows" :columns="currentDataset.columns" />
</template> -->
<template>
  <div class="sc-analytics-container">
    <div class="cartoon-forest-bg">
      <img
        src="https://image.pollinations.ai/prompt/A%20cute%2C%20charming%20cartoon-style%20forest%20illustration.%20Flat%20design%20vector%20style.%20Various%20shades%20of%20soft%20greens%2C%20browns%2C%20and%20beiges.%20Features%20trees%20on%20the%20left%20and%20right%20sides%20matching%20image_1.png's%20sketch%20direction%2C%20with%20a%20clear%20path%20in%20the%20center.%20Mild%20rolling%20hills%20and%20some%20small%20wildflowers.%20Clear%20sky%20with%20a%20few%20puffy%20clouds.%20Friendly%20and%20serene%20atmosphere.%20Minimalist%20background%20behind%20the%20transparent%20elements."
        alt="卡通森林背景"
        class="bg-image"
      />
    </div>

    <aside class="sidebar-placeholder glass-panel">
      <div class="logo">Data<span class="logo-accent">Cosmos</span></div>
      <div class="nav-item">数据集 A</div>
      <div class="nav-item active">销售数据_2024_Q3</div>
      <div class="nav-item">用户行为分析</div>
    </aside>

    <main class="main-content">
      <div v-if="currentDataset" class="content-wrapper">
        <div class="content-header">
          <div class="header-text-group">
            <h1 class="dataset-name">{{ currentDataset.name }}</h1>
            <div class="header-meta">
              <span>{{ currentDataset.rowCount.toLocaleString() }} 行数据</span>
              <span>·</span>
              <span>{{ currentDataset.columnCount }} 列</span>
              <span>·</span>
              <span>{{ formatTime(currentDataset.createdAt) }}</span>
            </div>
          </div>

          <div class="header-actions">
            <button class="action-btn">筛选</button>
            <button class="action-btn">导出</button>
          </div>
        </div>

        <div class="table-container mock-virtual-table">
          <div class="table-header-mock">
            <div class="table-cell">订单ID</div>
            <div class="table-cell">产品名称</div>
            <div class="table-cell">金额</div>
            <div class="table-cell">日期</div>
            <div class="table-cell">状态</div>
          </div>
          <div class="table-body-mock">
            <div v-for="i in 10" :key="i" class="table-row-mock">
              <div class="table-cell">#ORD-{{ 1000 + i }}</div>
              <div class="table-cell product-name">星尘面霜</div>
              <div class="table-cell currency">
                ¥ {{ (Math.random() * 1000).toFixed(2) }}
              </div>
              <div class="table-cell">2023-10-27</div>
              <div class="table-cell status">
                <span class="status-tag shipped">已发货</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 模拟数据
const currentDataset = ref({
  name: "销售数据_2024_Q3",
  rowCount: 1250800,
  columnCount: 45,
  createdAt: new Date("2023-10-15T08:30:00"),
  rows: [],
  columns: [],
});

// 模拟格式化时间函数
const formatTime = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
/* =========================================
   4. 核心变量与背景设置
   ========================================= */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow: hidden;
}

.sc-analytics-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  /* 基础设计变量 */
  --bg-dark: #121212; /* 仍然需要一个深色背景来对比字体，但不再是填充色 */
  --text-primary: #f0f0f0;
  --text-secondary: #aaaaaa;
  --color-forest-green: #38c172; /* 森林绿 */
  --color-accent: #f8e71c; /* 金色点缀 */
}

/* =========================================
   5. **核心：全透明卡通森林背景**
   ========================================= */
.cartoon-forest-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 放置在最底层 */
  pointer-events: none; /* 防止点击背景图片 */
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 填充整个容器 */
  filter: blur(2px); /* 略微虚化背景，让文字更清晰 */
}

/* =========================================
   6. **关键：透明面板样式 (Glassmorphism)**
   ========================================= */
/* 通用透明面板样式 */
.glass-panel {
  background-color: rgba(30, 30, 30, 0.4); /* 半透明深色背景，用于保护文字 */
  backdrop-filter: blur(10px) saturate(180%); /* 高端虚化和色彩饱和度 */
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1); /* 极细的白色边框 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); /* 柔和阴影 */
}

/* =========================================
   7. 布局组件样式
   ========================================= */
.sidebar-placeholder {
  width: 260px;
  /* 侧边栏本身不使用 glass-panel，而是直接透明 */
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 10;
  border-right: 1px solid rgba(255, 255, 255, 0.05); /* 侧边栏和主内容的细分界限 */
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 40px;
  letter-spacing: 1px;
}

.logo-accent {
  color: var(--color-forest-green);
}

.nav-item {
  padding: 12px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-item.active {
  background-color: rgba(56, 193, 114, 0.2); /* 森林绿的透明版本 */
  color: #fff;
  border-left: 3px solid var(--color-forest-green);
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 5;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* =========================================
   8. 顶部信息栏样式
   ========================================= */
.content-header {
  padding: 20px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataset-name {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 600;
  color: #fff;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.08); /* 半透明按钮 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

/* =========================================
   9. **核心：透明数据表格样式**
   ========================================= */
.table-container {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  position: relative;
}

.mock-virtual-table {
  display: flex;
  flex-direction: column;
  /* 表格本身不使用 glass-panel，而是直接透明 */
  background-color: transparent;
}

.table-header-mock,
.table-row-mock {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03); /* 极淡的行分割线 */
  align-items: center;
}

.table-header-mock {
  background-color: rgba(0, 0, 0, 0.1); /* 淡淡的表头背景色，增加对比度 */
  color: #fff;
  font-weight: bold;
}

.table-cell {
  flex: 1;
  padding: 0 10px;
}

.table-row-mock {
  color: var(--text-primary);
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.table-row-mock:hover {
  background-color: rgba(255, 255, 255, 0.03); /* hover 时微微发光 */
}

/* 特定单元格样式，增加文字清晰度 */
.table-cell.currency {
  color: var(--color-accent); /* 金色数字 */
  font-weight: bold;
}

.table-cell.product-name {
  color: var(--text-primary);
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.shipped {
  background-color: rgba(56, 193, 114, 0.15); /* 森林绿的透明版本 */
  color: var(--color-forest-green);
}
</style>
