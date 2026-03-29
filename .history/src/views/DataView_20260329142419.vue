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
    <div class="stars-parallax">
      <div class="star-layer layer1"></div>
      <div class="star-layer layer2"></div>
      <div class="star-layer layer3"></div>
    </div>
    <div class="nebula-glow"></div>
    <div class="floating-particles">
      <span v-for="n in 20" :key="n" class="particle"></span>
    </div>

    <aside class="sidebar-placeholder">
      <div class="logo">DataCosmos</div>
      <div class="nav-item">数据集 A</div>
      <div class="nav-item active">销售数据_2024_Q3</div>
      <div class="nav-item">用户行为分析</div>
    </aside>

    <main class="main-content">
      <div v-if="currentDataset" class="content-wrapper glass-panel">
        <div class="content-header">
          <div class="header-text-group">
            <h1 class="dataset-name">{{ currentDataset.name }}</h1>
            <div class="header-meta">
              <span class="meta-item">
                <i class="icon-rows"></i>
                {{ currentDataset.rowCount.toLocaleString() }} 行数据
              </span>
              <span class="meta-separator">✦</span>
              <span class="meta-item">
                <i class="icon-columns"></i>
                {{ currentDataset.columnCount }} 列
              </span>
              <span class="meta-separator">✦</span>
              <span class="meta-item">
                <i class="icon-time"></i>
                {{ formatTime(currentDataset.createdAt) }}
              </span>
            </div>
          </div>

          <div class="header-actions">
            <button class="action-btn btn-filter">
              <span class="btn-glow"></span>
              <i class="icon-filter"></i> 筛选
            </button>
            <button class="action-btn btn-export">
              <span class="btn-glow"></span>
              <i class="icon-export"></i> 导出
            </button>
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
              <div class="table-cell">星尘面霜</div>
              <div class="table-cell currency">
                ¥ {{ (Math.random() * 1000).toFixed(2) }}
              </div>
              <div class="table-cell">2023-10-27</div>
              <div class="table-cell status">
                <span class="status-tag">已发货</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-content glass-panel">
        <div class="empty-visual">
          <div class="empty-icon-galaxy">
            <div class="orbit"></div>
            <div class="star center"></div>
            <div class="star sat-1"></div>
            <div class="star sat-2"></div>
          </div>
        </div>
        <h2 class="empty-title">选择一个数据集开始分析</h2>
        <p class="empty-desc">从左侧列表中选择，或上传新的数据文件</p>
        <button class="upload-btn-magic">
          <span class="btn-text">上传新数据</span>
          <span class="btn-flare"></span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 模拟 Vue 逻辑，你可以通过修改这里来测试 "未选中" 状态
// 将 null 改为下面的对象即可看到有数据的样子
const currentDataset = ref({
  name: "销售数据_2024_Q3_梦幻美妆系",
  rowCount: 1250800,
  columnCount: 45,
  createdAt: new Date("2023-10-15T08:30:00"),
  rows: [], // 实际使用时传给 VirtualTable
  columns: [], // 实际使用时传给 VirtualTable
});

// 如果要测试空状态，请取消注释下一行，并注释掉上面的 currentDataset 定义
// const currentDataset = ref(null);

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
   1. 基础变量与重置 (Aesthetic Variables)
   ========================================= */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow: hidden; /* 防止星空背景溢出 */
  background-color: #050212; /* 极深的夜空紫 */
  color: #e0d9f0;
}

.sc-analytics-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  /* 定义主题色 */
  --bg-dark: #050212;
  --bg-panel: rgba(20, 10, 35, 0.6); /* 半透明面板 */
  --text-primary: #e0d9f0; /* 柔和的浅紫白 */
  --text-secondary: #b0a4d0;
  --color-primary: #ff79c6; /* 浪漫粉 */
  --color-secondary: #8be9fd; /* 梦幻蓝 */
  --color-accent: #f1fa8c; /* 明亮黄/金 */
  --border-color: rgba(255, 121, 198, 0.2); /* 粉色微光边框 */
  --glass-blur: blur(20px) saturate(180%);
}

/* =========================================
   2. 星空与粒子动画 (Romantic Cosmos)
   ========================================= */
/* 2.1 星层 */
.stars-parallax {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.star-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      1px 1px at 20px 30px,
      #fff,
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(
      2px 2px at 50px 160px,
      var(--color-secondary),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(1px 1px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(
      2px 2px at 130px 80px,
      var(--color-primary),
      rgba(0, 0, 0, 0)
    );
  background-repeat: repeat;
  opacity: 0.4;
}

/* 简单的模拟视差和不同亮度的星星 */
.layer1 {
  background-size: 200px 200px;
  animation: starMove 150s linear infinite;
}
.layer2 {
  background-size: 300px 300px;
  animation: starMove 100s linear infinite;
  opacity: 0.6;
}
.layer3 {
  background-size: 500px 500px;
  animation: starMove 60s linear infinite;
  opacity: 0.8;
}

@keyframes starMove {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 10000px 5000px;
  }
}

/* 2.2 星云光晕 */
.nebula-glow {
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(
    circle,
    rgba(139, 233, 253, 0.15) 0%,
    rgba(255, 121, 198, 0.08) 40%,
    rgba(5, 2, 18, 0) 70%
  );
  border-radius: 50%;
  top: -200px;
  right: -200px;
  z-index: 0;
  filter: blur(50px);
  animation: nebulaPulse 20s ease-in-out infinite alternate;
}

@keyframes nebulaPulse {
  0% {
    transform: scale(1) translate(0, 0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.2) translate(-50px, 50px);
    opacity: 1;
  }
}

/* 2.3 浮动粒子 */
.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: #fff;
  border-radius: 50%;
  opacity: 0;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.5);
}

/* 生成 20 个不同位置和动画的粒子 */
.particle:nth-child(5n + 1) {
  background-color: var(--color-primary);
  box-shadow: 0 0 10px 2px rgba(255, 121, 198, 0.5);
}
.particle:nth-child(5n + 2) {
  background-color: var(--color-secondary);
  box-shadow: 0 0 10px 2px rgba(139, 233, 253, 0.5);
}
.particle:nth-child(5n + 3) {
  background-color: var(--color-accent);
  box-shadow: 0 0 10px 2px rgba(241, 250, 140, 0.5);
}

/* 简单的循环浮动动画 */
@keyframes floatParticle {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* 为每个粒子设置随机的左侧位置、延时和持续时间 */
.particle:nth-child(1) {
  left: 5%;
  animation: floatParticle 15s infinite 1s;
  width: 3px;
  height: 3px;
}
.particle:nth-child(2) {
  left: 15%;
  animation: floatParticle 20s infinite 5s;
  width: 5px;
  height: 5px;
}
.particle:nth-child(3) {
  left: 25%;
  animation: floatParticle 18s infinite 2s;
  width: 2px;
  height: 2px;
}
.particle:nth-child(4) {
  left: 35%;
  animation: floatParticle 25s infinite 8s;
}
.particle:nth-child(5) {
  left: 45%;
  animation: floatParticle 12s infinite 0s;
  width: 6px;
  height: 6px;
}
.particle:nth-child(6) {
  left: 55%;
  animation: floatParticle 22s infinite 3s;
}
.particle:nth-child(7) {
  left: 65%;
  animation: floatParticle 16s infinite 7s;
  width: 3px;
  height: 3px;
}
.particle:nth-child(8) {
  left: 75%;
  animation: floatParticle 19s infinite 4s;
}
.particle:nth-child(9) {
  left: 85%;
  animation: floatParticle 21s infinite 10s;
  width: 4px;
  height: 4px;
}
.particle:nth-child(10) {
  left: 95%;
  animation: floatParticle 14s infinite 6s;
}
/* ... 可以添加更多，这里简化 */

/* =========================================
   3. 核心布局与通用样式
   ========================================= */
.sidebar-placeholder {
  width: 260px;
  background-color: rgba(10, 5, 25, 0.8);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 10;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
  text-shadow: 0 0 15px var(--color-primary);
  margin-bottom: 40px;
  letter-spacing: 1px;
}

.nav-item {
  padding: 12px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item.active {
  background: linear-gradient(
    90deg,
    rgba(255, 121, 198, 0.15) 0%,
    rgba(139, 233, 253, 0.05) 100%
  );
  color: #fff;
  border-left: 3px solid var(--color-primary);
  box-shadow: inset 0 0 10px rgba(255, 121, 198, 0.1);
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

/* 毛玻璃面板效果 */
.glass-panel {
  background-color: var(--bg-panel);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(255, 121, 198, 0.05);
}

/* =========================================
   4. 有选中数据时的样式 (Data View)
   ========================================= */
.content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 4.1 顶部信息栏 */
.content-header {
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}

.dataset-name {
  margin: 0 0 10px 0;
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-separator {
  color: rgba(255, 121, 198, 0.4);
  font-size: 10px;
}

/* 4.2 操作按钮 */
.header-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  position: relative;
  padding: 10px 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  overflow: hidden; /* 为了btn-glow */
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 特殊样式的按钮，带霓虹光晕 */
.btn-filter:hover {
  border-color: var(--color-secondary);
  box-shadow: 0 0 15px rgba(139, 233, 253, 0.3);
  color: var(--color-secondary);
}

.btn-export:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 15px rgba(255, 121, 198, 0.3);
  color: var(--color-primary);
}

/* 按钮内部的流动光晕效果 */
.btn-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: -100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.action-btn:hover .btn-glow {
  left: 100%;
}

/* 4.3 表格容器 (这里模拟虚拟表格的幻像感) */
.table-container {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  position: relative;
}

.mock-virtual-table {
  display: flex;
  flex-direction: column;
}

.table-header-mock,
.table-row-mock {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  align-items: center;
}

.table-header-mock {
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  color: var(--color-secondary);
  font-weight: bold;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 1px;
}

.table-cell {
  flex: 1;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-row-mock {
  color: var(--text-primary);
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.table-row-mock:hover {
  background-color: rgba(255, 121, 198, 0.05);
  color: #fff;
}

.table-cell.currency {
  color: var(--color-accent);
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  background-color: rgba(139, 233, 253, 0.15);
  color: var(--color-secondary);
  font-size: 12px;
  border: 1px solid rgba(139, 233, 253, 0.3);
}

/* 表格底部虚幻的“未完待续”效果 */
.table-body-mock::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(
    0deg,
    var(--bg-panel) 0%,
    rgba(20, 10, 35, 0) 100%
  );
  pointer-events: none;
}

/* =========================================
   5. 未选中状态的样式 (Empty State)
   ========================================= */
.empty-content {
  width: 80%;
  max-width: 600px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 50px;
  /* 更强烈的毛玻璃和光晕 */
  box-shadow: 0 0 60px rgba(139, 233, 253, 0.1),
    inset 0 0 30px rgba(139, 233, 253, 0.05);
}

/* 5.1 梦幻银河图标 */
.empty-visual {
  margin-bottom: 40px;
}

.empty-icon-galaxy {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orbit {
  position: absolute;
  width: 100%;
  height: 40%;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  transform: rotateX(70deg) rotateY(10deg);
  animation: orbitRotate 10s linear infinite;
}

.star {
  position: absolute;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 10px #fff;
}

.star.center {
  width: 20px;
  height: 20px;
  background-color: var(--color-accent);
  box-shadow: 0 0 20px 5px rgba(241, 250, 140, 0.5);
}

.star.sat-1 {
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary);
  offset-path: path(
    "M 0,20 a 50,20 0 1,0 100,0 a 50,20 0 1,0 -100,0"
  ); /* 使用路径动画模拟轨道 */
  animation: satelliteFollow 4s linear infinite;
}

.star.sat-2 {
  width: 6px;
  height: 6px;
  background-color: var(--color-secondary);
  box-shadow: 0 0 10px var(--color-secondary);
  offset-path: path("M 100,20 a 50,20 0 1,0 -100,0 a 50,20 0 1,0 100,0");
  animation: satelliteFollow 6s linear infinite reverse;
}

@keyframes orbitRotate {
  0% {
    transform: rotateX(70deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(70deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes satelliteFollow {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}

/* 5.2 空状态文字 */
.empty-title {
  font-size: 28px;
  color: #fff;
  margin: 0 0 15px 0;
  text-shadow: 0 0 15px rgba(255, 121, 198, 0.5);
}

.empty-desc {
  color: var(--text-secondary);
  font-size: 16px;
  max-width: 300px;
  line-height: 1.6;
  margin: 0 0 40px 0;
}

/* 5.3 幻彩上传按钮 */
.upload-btn-magic {
  position: relative;
  padding: 15px 40px;
  border-radius: 30px;
  border: none;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    #bd93f9 50%,
    var(--color-secondary) 100%
  );
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(255, 121, 198, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
}

.upload-btn-magic:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 121, 198, 0.5);
}

.btn-text {
  position: relative;
  z-index: 2;
  letter-spacing: 1px;
}

.btn-flare {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.upload-btn-magic:hover .btn-flare {
  opacity: 0.5;
  animation: flarePulse 1s ease-in-out infinite;
}

@keyframes flarePulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
}

/* 简单的图标占位符样式，实际使用可以替换为 iconfont 或 SVG */
[class^="icon-"]::before {
  content: "✦"; /* 临时使用星星符号代替图标 */
  font-style: normal;
  margin-right: 2px;
  opacity: 0.7;
}

.icon-rows::before {
  content: "≣";
}
.icon-columns::before {
  content: "║";
}
.icon-time::before {
  content: "◔";
}
.icon-filter::before {
  content: "⛚";
}
.icon-export::before {
  content: "⍋";
}
</style>
