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
    <div class="cosmos-dome-wrapper">
      <div class="cosmos-dome">
        <div class="star-layer far-stars"></div>
        <div class="star-layer mid-stars"></div>
        <div class="floating-gold-dust">
          <span v-for="n in 50" :key="n" class="gold-particle"></span>
        </div>
      </div>
      <div class="void-gradient"></div>
    </div>

    <aside class="sidebar-placeholder glass-panel_dark">
      <div class="logo">
        <div class="logo-icon">✦</div>
        Data<span class="logo-accent">Cosmos</span>
      </div>

      <div class="dataset-list">
        <div class="nav-item">数据集 A</div>
        <div class="nav-item active">
          销售数据_2024_Q3
          <span class="active-indicator"></span>
        </div>
        <div class="nav-item">用户行为分析</div>
        <div class="nav-item">市场趋势_Nov</div>
      </div>

      <div class="sidebar-actions">
        <button class="action-btn_sidebar btn-add">
          <i class="icon-add">+</i> 添加数据
        </button>
        <button class="action-btn_sidebar btn-delete">
          <i class="icon-delete">✕</i> 删除
        </button>
      </div>
    </aside>

    <main class="main-content">
      <div
        v-if="currentDataset"
        class="content-wrapper glass-panel_gold main-panel-neon"
      >
        <div class="content-header">
          <div class="header-text-group">
            <h1 class="dataset-name dynamic-text-glow">
              {{ currentDataset.name }}
            </h1>
            <div class="header-meta">
              <span class="meta-item"
                ><i class="icon-rows"></i
                >{{ currentDataset.rowCount.toLocaleString() }} 行数据</span
              >
              <span class="meta-separator">✦</span>
              <span class="meta-item"
                ><i class="icon-columns"></i
                >{{ currentDataset.columnCount }} 列</span
              >
              <span class="meta-separator">✦</span>
              <span class="meta-item"
                ><i class="icon-time"></i
                >{{ formatTime(currentDataset.createdAt) }}</span
              >
            </div>
          </div>

          <div class="header-actions">
            <button class="action-btn_main btn-filter gold-glow-btn">
              <i class="icon-filter"></i> 筛选
              <span class="btn-flare"></span>
            </button>
            <button class="action-btn_main btn-export gold-glow-btn">
              <i class="icon-export"></i> 导出
              <span class="btn-flare"></span>
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
              <div class="table-cell id-cell">#ORD-{{ 1000 + i }}</div>
              <div class="table-cell product-name">星尘面霜 [梦幻系列]</div>
              <div class="table-cell currency">
                ¥ {{ (Math.random() * 1000 + 100).toFixed(2) }}
              </div>
              <div class="table-cell date-cell">2023-10-27</div>
              <div class="table-cell status">
                <span class="status-tag tag-shipped">已发货</span>
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
  name: "销售数据_2024_Q3_梦幻美妆系",
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
   3. 核心变量与设计系统 (Black, White, Gold)
   ========================================= */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow: hidden;
  background-color: #000000; /* 纯黑夜空 */
  color: #ffffff;
}

.sc-analytics-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  --bg-pure-black: #000000;
  --bg-panel-dark: rgba(5, 5, 5, 0.7); /* 接近黑色的半透明 */
  --text-pure-white: #ffffff;
  --text-muted-white: #dcdcdc;
  --color-gold-bright: #ffd700; /* 纯金 */
  --color-gold-deep: #daa520; /* 深金 */
  --color-gold-pale: #fff8dc; /* 浅金沙 */
  --border-gold-muted: rgba(218, 165, 32, 0.3);
  --border-gold-bright: rgba(255, 215, 0, 0.5);
  --glass-blur: blur(20px);
}

/* =========================================
   4. 模拟自转的星空穹顶 (The Soul)
   ========================================= */
.cosmos-dome-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  perspective: 1000px; /* 增加3D透视 */
}

.cosmos-dome {
  position: absolute;
  width: 300vw; /* 极大的穹顶，确保旋转时不露边 */
  height: 300vh;
  top: -100vh;
  left: -100vw;
  background-color: var(--bg-pure-black);
  transform-style: preserve-3d;
  /* **核心：地球自转式缓慢滑动动画** */
  animation: cosmosRotation 180s linear infinite;
  will-change: transform;
}

@keyframes cosmosRotation {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  } /* 围绕中心极慢旋转 */
}

.star-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: repeat;
}

/* 4.1 远景微星（CSS Radial Gradient 生成数千个小点） */
.far-stars {
  background-image: radial-gradient(
      1px 1px at 20px 30px,
      #fff,
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(1px 1px at 40px 70px, #ddd, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 50px 160px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 80px 120px, #aaa, rgba(0, 0, 0, 0)),
    radial-gradient(1.5px 1.5px at 110px 40px, #fff, rgba(0, 0, 0, 0));
  background-size: 200px 200px;
  opacity: 0.3;
}

/* 4.2 中景闪烁金星 */
.mid-stars {
  background-image: radial-gradient(
      2px 2px at 30px 50px,
      var(--color-gold-bright),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(
      2px 2px at 150px 80px,
      var(--color-gold-pale),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(2.5px 2.5px at 200px 150px, #fff, rgba(0, 0, 0, 0));
  background-size: 300px 300px;
  animation: starsTwinkle 6s ease-in-out infinite alternate;
}

@keyframes starsTwinkle {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* 4.3 近景漂浮金沙（这里使用 CSS 粒子模拟灵动感） */
.floating-gold-dust {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateZ(50px); /* 向用户推进，产生深度 */
}

.gold-particle {
  position: absolute;
  border-radius: 50%;
  background-color: var(--color-gold-pale);
  box-shadow: 0 0 5px var(--color-gold-bright);
  opacity: 0;
  animation: goldParticleFloat 20s linear infinite;
}

/* 生成不同大小和位置的粒子 */
.gold-particle:nth-child(5n + 1) {
  width: 3px;
  height: 3px;
  animation-duration: 25s;
}
.gold-particle:nth-child(5n + 2) {
  width: 5px;
  height: 5px;
  animation-duration: 18s;
  animation-delay: 2s;
}
.gold-particle:nth-child(5n + 3) {
  width: 2px;
  height: 2px;
  animation-duration: 30s;
  animation-delay: 5s;
}

@keyframes goldParticleFloat {
  0% {
    transform: translateY(100vh) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-10vh) translateX(20px) scale(0.5);
    opacity: 0;
  }
}

/* 为每个粒子设置随机位置 */
.gold-particle:nth-child(1) {
  left: 5%;
  top: 20%;
  animation-delay: 1s;
}
.gold-particle:nth-child(2) {
  left: 15%;
  top: 50%;
  animation-delay: 3s;
}
.gold-particle:nth-child(3) {
  left: 25%;
  top: 10%;
  animation-delay: 0s;
}
.gold-particle:nth-child(4) {
  left: 35%;
  top: 70%;
  animation-delay: 6s;
}
.gold-particle:nth-child(5) {
  left: 45%;
  top: 30%;
  animation-delay: 2s;
}
/* ... 此处省略其余粒子的独立位置设置，实际开发可用JS生成 ... */

/* 4.4 底部虚化 gradients */
.void-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  background: linear-gradient(
    0deg,
    var(--bg-pure-black) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
}

/* =========================================
   5. 通用毛玻璃和金色悬浮面板
   ========================================= */
/* 暗色毛玻璃（侧边栏） */
.glass-panel_dark {
  background-color: var(--bg-panel-dark);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-right: 1px solid rgba(255, 255, 255, 0.03);
}

/* 金色毛玻璃（主面板） */
.glass-panel_gold {
  background-color: var(--bg-panel-dark);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-gold-muted);
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8),
    inset 0 0 15px rgba(218, 165, 32, 0.05);
}

/* 主面板的动态金色霓虹呼吸边框 */
.main-panel-neon {
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  animation: panelGoldGlow 5s ease-in-out infinite alternate;
}

@keyframes panelGoldGlow {
  0% {
    border-color: var(--border-gold-muted);
    box-shadow: 0 0 15px rgba(218, 165, 32, 0.1);
  }
  100% {
    border-color: var(--border-gold-bright);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
  }
}

/* =========================================
   6. 侧边栏样式
   ========================================= */
.sidebar-placeholder {
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  z-index: 10;
}

.logo {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 60px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  color: var(--color-gold-bright);
  font-size: 20px;
  text-shadow: 0 0 10px var(--color-gold-bright);
}

.logo-accent {
  color: var(--color-gold-bright);
  text-shadow: 0 0 10px var(--color-gold-bright);
}

.dataset-list {
  flex: 1;
}

.nav-item {
  padding: 16px 20px;
  margin-bottom: 12px;
  border-radius: 10px;
  color: var(--text-muted-white);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  position: relative;
}

.nav-item:hover {
  background-color: rgba(255, 215, 0, 0.03);
  color: #fff;
}

.nav-item.active {
  background: linear-gradient(
    90deg,
    rgba(218, 165, 32, 0.15) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  color: #fff;
  font-weight: 600;
  border: 1px solid var(--border-gold-muted);
}

.active-indicator {
  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background-color: var(--color-gold-bright);
  border-radius: 2px;
  box-shadow: 0 0 15px var(--color-gold-bright);
}

/* =========================================
   **7. 新增：侧边栏操作按钮**
   ========================================= */
.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.action-btn_sidebar {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 添加数据按钮 - 古典金色质感 */
.btn-add {
  background: linear-gradient(
    135deg,
    var(--color-gold-deep) 0%,
    var(--color-gold-bright) 100%
  );
  color: #000; /* 黑字 */
  border: none;
  box-shadow: 0 5px 15px rgba(218, 165, 32, 0.3);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(218, 165, 32, 0.5);
}

/* 删除按钮 - 幽暗色调 */
.btn-delete {
  background-color: rgba(255, 255, 255, 0.03);
  color: #ffcccc; /* 柔和的警示色 */
  border: 1px solid rgba(255, 204, 204, 0.2);
}

.btn-delete:hover {
  background-color: rgba(255, 0, 0, 0.05);
  border-color: rgba(255, 0, 0, 0.3);
  color: #ffaaaa;
}

/* =========================================
   8. 主内容区域与表格
   ========================================= */
.main-content {
  flex: 1;
  position: relative;
  z-index: 5;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部信息栏 */
.content-header {
  padding: 30px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataset-name {
  margin: 0 0 15px 0;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
}

/* 动态金色文字光晕 */
.dynamic-text-glow {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
    0 0 20px var(--color-gold-bright);
  animation: textGlowPulse 2.5s ease-in-out infinite alternate;
}

@keyframes textGlowPulse {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
      0 0 20px var(--color-gold-bright);
  }
  100% {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
      0 0 30px var(--color-gold-bright);
  }
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--text-muted-white);
  font-size: 14px;
}

.meta-separator {
  color: rgba(218, 165, 32, 0.4);
}

/* 主操作按钮（带金色闪光） */
.header-actions {
  display: flex;
  gap: 20px;
}

.action-btn_main {
  position: relative;
  padding: 14px 30px;
  border-radius: 24px;
  background: rgba(218, 165, 32, 0.05);
  border: 1px solid var(--border-gold-muted);
  color: var(--color-gold-bright);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* hover时的瞬间强光爆发效果 */
.btn-flare {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #fff 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0;
  z-index: 1;
}

.action-btn_main:hover {
  transform: translateY(-2px);
  border-color: var(--color-gold-bright);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}

.action-btn_main:hover .btn-flare {
  animation: flareBurst 0.5s ease-out;
}

@keyframes flareBurst {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 表格区域 */
.table-container {
  flex: 1;
  padding: 30px;
  overflow: hidden;
  position: relative;
}

.table-header-mock,
.table-row-mock {
  display: flex;
  padding: 16px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.015);
  align-items: center;
}

.table-header-mock {
  background-color: rgba(255, 255, 255, 0.01);
  border-radius: 12px;
  color: var(--color-gold-bright);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.table-cell {
  flex: 1;
  padding: 0 10px;
}

.table-row-mock {
  color: var(--text-pure-white);
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 14px;
}

.table-row-mock:hover {
  background-color: rgba(218, 165, 32, 0.08);
  color: #fff;
}

.id-cell {
  color: var(--text-muted-white);
}
.date-cell {
  color: var(--text-muted-white);
}

.product-name {
  color: var(--color-gold-pale);
}

.table-cell.currency {
  color: var(--color-gold-bright);
  font-weight: 600;
  font-family: "Courier New", Courier, monospace; /* 增加古典数字感 */
}

.status-tag {
  padding: 5px 14px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.tag-shipped {
  background-color: rgba(218, 165, 32, 0.1);
  color: var(--color-gold-pale);
  border: 1px solid var(--border-gold-muted);
  box-shadow: 0 0 10px rgba(218, 165, 32, 0.1);
}

/* 表格底部的古典黑洞虚化 */
.table-body-mock::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(
    0deg,
    var(--bg-panel-dark) 10%,
    rgba(5, 5, 5, 0) 100%
  );
  pointer-events: none;
}

/* 图标占位符 */
[class^="icon-"]::before {
  content: "✦";
  margin-right: 5px;
  opacity: 0.9;
  color: var(--color-gold-bright);
}
</style>
