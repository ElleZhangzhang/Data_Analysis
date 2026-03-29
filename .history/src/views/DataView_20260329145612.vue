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
  <div class="forest-enchantment-container">
    <div class="forest-particles-system">
      <div v-for="n in 60" :key="'firefly-' + n" class="firefly"></div>
      <div v-for="n in 20" :key="'leaf-' + n" class="magic-leaf"></div>
    </div>

    <div class="forest-bg-enchantment">
      <div class="light-beam beam-1"></div>
      <div class="light-beam beam-2"></div>
      <div class="magic-mist"></div>
    </div>

    <aside class="sidebar-placeholder glass-panel_light">
      <div class="logo">
        <div class="logo-icon">🌿</div>
        Fairy<span class="logo-accent">Forest</span>
      </div>

      <div class="dataset-list">
        <div class="nav-item">
          <span class="item-icon">🍄</span>
          苔藓样本 A
        </div>
        <div class="nav-item active">
          <span class="item-icon">✨</span>
          魔法露水_2024_Q3
          <span class="active-indicator"></span>
        </div>
        <div class="nav-item">
          <span class="item-icon">🍃</span>
          风之语分析
        </div>
        <div class="nav-item">
          <span class="item-icon">🐛</span>
          甲虫旅行日志
        </div>
      </div>

      <div class="sidebar-actions">
        <button class="action-btn_sidebar btn-add">
          <i class="icon-add">+</i> 采集新魔法
        </button>
        <button class="action-btn_sidebar btn-delete">
          <i class="icon-delete">✕</i> 归还自然
        </button>
      </div>
    </aside>

    <main class="main-content">
      <div
        v-if="currentDataset"
        class="content-wrapper glass-panel_white main-panel-enchant"
      >
        <div class="content-header">
          <div class="header-text-group">
            <h1 class="dataset-name dynamic-text-glow">
              {{ currentDataset.name }}
              <span class="fairy-wing_title">🧚‍♀️</span>
            </h1>
            <div class="header-meta">
              <span class="meta-item"
                ><i class="icon-rows"></i
                >{{ currentDataset.rowCount.toLocaleString() }} 滴露水</span
              >
              <span class="meta-separator">✦</span>
              <span class="meta-item"
                ><i class="icon-columns"></i
                >{{ currentDataset.columnCount }} 个音符</span
              >
              <span class="meta-separator">✦</span>
              <span class="meta-item"
                ><i class="icon-time"></i
                >{{ formatTime(currentDataset.createdAt) }}</span
              >
            </div>
          </div>

          <div class="header-actions">
            <button class="action-btn_main btn-filter main-glow-btn">
              <i class="icon-filter"></i> 编织
              <span class="btn-flare"></span>
            </button>
            <button class="action-btn_main btn-export main-glow-btn">
              <i class="icon-export"></i> 飞散
              <span class="btn-flare"></span>
            </button>
          </div>
        </div>

        <div class="table-container mock-virtual-table">
          <div class="table-header-mock">
            <div class="table-cell">精灵编号</div>
            <div class="table-cell">采集者</div>
            <div class="table-cell">魔法值</div>
            <div class="table-cell">诞生日期</div>
            <div class="table-cell">状态</div>
          </div>
          <div class="table-body-mock">
            <div v-for="i in 10" :key="i" class="table-row-mock vine-row">
              <div class="table-cell id-cell">#FAIRY-{{ 1000 + i }}</div>
              <div class="table-cell product-name">
                <span class="fairy-avatar">✨</span>
                小铃铛 [光系]
              </div>
              <div class="table-cell currency">
                <span class="mana-crystal">💎</span>
                {{ (Math.random() * 500 + 50).toFixed(1) }} MP
              </div>
              <div class="table-cell date-cell">2023-10-27</div>
              <div class="table-cell status">
                <span class="status-tag tag-shipped">已苏醒</span>
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
  name: "魔法露水_2024_Q3_初夏清晨",
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
   3. 核心变量与治愈森林设计系统 (White, Light Green)
   ========================================= */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow: hidden;
  background-color: #fdfdfd; /* 纯净白背景 */
  color: #555; /* 深灰文字，非纯黑 */
}

.forest-enchantment-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  --bg-forest-white: #fdfdfd;
  --bg-panel-light: rgba(255, 255, 255, 0.6); /* 高透明毛玻璃 */
  --text-primary: #333;
  --text-muted: #777;
  --color-fairy-green: #a8e6cf; /* 核心仙子绿 */
  --color-moss-green: #c1e1c1; /* 苔藓绿 */
  --color-sun-gold: #fdfd96; /* 阳光金 */
  --color-crystal-blue: #d4f1f4; /* 晶石蓝 */
  --border-green-muted: rgba(168, 230, 207, 0.4);
  --border-green-bright: rgba(168, 230, 207, 0.8);
  --glass-blur: blur(15px);
}

/* =========================================
   4. 大幅度魔法粒子系统 (Soul of Romance)
   ========================================= */
.forest-particles-system {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* 4.1 萤火虫 */
.firefly {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: var(--color-sun-gold);
  border-radius: 50%;
  box-shadow: 0 0 10px 2px var(--color-sun-gold);
  opacity: 0;
  /* **核心：大幅度、不规则乱舞动画** */
  animation: fireflyDance 30s linear infinite;
  will-change: transform, opacity;
}

@keyframes fireflyDance {
  0% {
    transform: translateY(100vh) translateX(0) scale(1);
    opacity: 0;
  }
  5% {
    opacity: 0.8;
  }
  15% {
    transform: translateY(70vh) translateX(30vw) scale(1.2);
  }
  30% {
    transform: translateY(40vh) translateX(-20vw) scale(1);
  }
  50% {
    transform: translateY(10vh) translateX(40vw) scale(0.8);
  }
  70% {
    transform: translateY(-10vh) translateX(-30vw) scale(1.1);
  }
  85% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-20vh) translateX(0) scale(1);
    opacity: 0;
  }
}

/* 为每个萤火虫设置随机起始位置、延时和持续时间，制造混乱感 */
.firefly:nth-child(n) {
  left: calc(100% * random());
  top: calc(100% * random());
  animation-delay: calc(20s * random());
  animation-duration: calc(20s + 20s * random());
}
/* 此处 random() 需要预处理器支持，实际CSS中可用具体数值代替，如：
.firefly:nth-child(1) { left: 10%; animation-delay: 2s; animation-duration: 25s; }
... 生成 60 个不同版本的 CSS ... */

/* 4.2 魔法叶子 */
.magic-leaf {
  position: absolute;
  width: 15px;
  height: 10px;
  background-color: var(--color-moss-green);
  border-radius: 0 100% 0 100%; /* 叶子形状 */
  opacity: 0.6;
  animation: leafFall 25s linear infinite;
}

@keyframes leafFall {
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(20vh) translateX(10vw) rotate(90deg) scale(1.1);
  }
  50% {
    transform: translateY(50vh) translateX(-15vw) rotate(180deg) scale(1);
  }
  75% {
    transform: translateY(80vh) translateX(5vw) rotate(270deg) scale(0.9);
  }
  100% {
    transform: translateY(110vh) translateX(0) rotate(360deg) scale(1);
  }
}

.magic-leaf:nth-child(n) {
  left: calc(100% * random());
  animation-delay: calc(15s * random());
  animation-duration: calc(20s + 10s * random());
}

/* 4.3 森林背景迷雾与光影 */
.forest-bg-enchantment {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.light-beam {
  position: absolute;
  width: 200px;
  height: 100vh;
  background: linear-gradient(
    0deg,
    rgba(253, 253, 150, 0) 0%,
    rgba(253, 253, 150, 0.1) 50%,
    rgba(253, 253, 150, 0) 100%
  );
  filter: blur(50px);
  transform: rotate(-30deg);
  animation: beamMove 15s ease-in-out infinite alternate;
}

.beam-1 {
  left: 10%;
  animation-delay: -5s;
}
.beam-2 {
  left: 60%;
}

@keyframes beamMove {
  0% {
    transform: rotate(-30deg) translateX(0);
  }
  100% {
    transform: rotate(-30deg) translateX(100px);
  }
}

.magic-mist {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(168, 230, 207, 0.05) 0%,
    rgba(253, 253, 253, 0) 70%
  );
  animation: mistBreathe 8s ease-in-out infinite alternate;
}

@keyframes mistBreathe {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* =========================================
   5. 通用毛玻璃与森林悬浮面板 (Light & Airy)
   ========================================= */
/* 高透明白毛玻璃（侧边栏） */
.glass-panel_light {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-right: 1px solid rgba(168, 230, 207, 0.1);
}

/* 晶石面板（主面板） */
.glass-panel_white {
  background-color: var(--bg-panel-light);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-green-muted);
  box-shadow: 0 10px 40px rgba(168, 230, 207, 0.1),
    inset 0 0 20px rgba(168, 230, 207, 0.03);
}

/* 主面板的动态金色霓虹呼吸边框 */
.main-panel-enchant {
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  animation: panelFairyGlow 6s ease-in-out infinite alternate;
}

@keyframes panelFairyGlow {
  0% {
    border-color: var(--border-green-muted);
    box-shadow: 0 0 15px rgba(168, 230, 207, 0.05);
  }
  100% {
    border-color: var(--border-green-bright);
    box-shadow: 0 0 30px rgba(168, 230, 207, 0.1);
  }
}

/* =========================================
   6. 侧边栏样式 (魔法树干)
   ========================================= */
.sidebar-placeholder {
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 40px 25px;
  z-index: 10;
}

.logo {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 60px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: var(--color-fairy-green);
  font-size: 24px;
}

.logo-accent {
  color: var(--color-fairy-green);
  text-shadow: 0 0 10px var(--color-fairy-green);
}

.dataset-list {
  flex: 1;
}

.nav-item {
  padding: 18px 20px;
  margin-bottom: 15px;
  border-radius: 12px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.4s ease;
  font-size: 15px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid transparent;
}

.nav-item:hover {
  background-color: rgba(168, 230, 207, 0.1);
  color: #fff;
  border-color: rgba(168, 230, 207, 0.3);
  transform: translateX(5px) scale(1.02);
}

.nav-item.active {
  background: linear-gradient(
    90deg,
    rgba(168, 230, 207, 0.3) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  color: var(--text-primary);
  font-weight: 600;
  border: 1px solid var(--border-green-muted);
  box-shadow: 0 5px 15px rgba(168, 230, 207, 0.1);
}

.active-indicator {
  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 28px;
  background-color: var(--color-fairy-green);
  border-radius: 2px;
  box-shadow: 0 0 15px var(--color-fairy-green);
}

.item-icon {
  font-size: 16px;
  opacity: 0.8;
}

/* =========================================
   7. 侧边栏操作按钮 (森林道具)
   ========================================= */
.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 30px;
  border-top: 1px solid rgba(168, 230, 207, 0.1);
}

.action-btn_sidebar {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 采集新魔法按钮 - 仙子绿渐变 */
.btn-add {
  background: linear-gradient(
    135deg,
    var(--color-moss-green) 0%,
    var(--color-fairy-green) 100%
  );
  color: #fff;
  border: none;
  box-shadow: 0 5px 15px rgba(168, 230, 207, 0.2);
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(168, 230, 207, 0.4);
}

/* 归还自然按钮 - 柔和色调 */
.btn-delete {
  background-color: rgba(168, 230, 207, 0.05);
  color: #b9d8ca;
  border: 1px solid rgba(168, 230, 207, 0.2);
}

.btn-delete:hover {
  background-color: rgba(255, 100, 100, 0.05);
  border-color: rgba(255, 100, 100, 0.2);
  color: #ffcccc;
}

/* =========================================
   8. 主内容区域与表格 (晶石面板与藤蔓画卷)
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

/* 顶部信息栏 (阳光露台) */
.content-header {
  padding: 30px 45px;
  border-bottom: 1px solid rgba(168, 230, 207, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataset-name {
  margin: 0 0 15px 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.fairy-wing_title {
  font-size: 20px;
  opacity: 0.6;
}

/* 动态仙子绿文字光晕 */
.dynamic-text-glow {
  text-shadow: 0 0 10px rgba(168, 230, 207, 0.5),
    0 0 20px var(--color-moss-green);
  animation: textGlowPulse 3s ease-in-out infinite alternate;
}

@keyframes textGlowPulse {
  0% {
    text-shadow: 0 0 10px rgba(168, 230, 207, 0.3),
      0 0 20px var(--color-moss-green);
  }
  100% {
    text-shadow: 0 0 15px rgba(168, 230, 207, 0.6),
      0 0 30px var(--color-fairy-green);
  }
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--text-muted);
  font-size: 14px;
}

.meta-separator {
  color: rgba(168, 230, 207, 0.4);
}

/* 主操作按钮 (魔法道具) */
.header-actions {
  display: flex;
  gap: 20px;
}

.action-btn_main {
  position: relative;
  padding: 15px 35px;
  border-radius: 25px;
  background: rgba(168, 230, 207, 0.05);
  border: 1px solid var(--border-green-muted);
  color: var(--color-fairy-green);
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* hover时的魔法光爆发效果 */
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
  transform: translateY(-2px) scale(1.03);
  border-color: var(--color-fairy-green);
  box-shadow: 0 0 25px rgba(168, 230, 207, 0.3);
}

.action-btn_main:hover .btn-flare {
  animation: flareBurst 0.6s ease-out;
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

/* 表格区域 (藤蔓画卷) */
.table-container {
  flex: 1;
  padding: 30px;
  overflow: hidden;
  position: relative;
}

.table-header-mock,
.table-row-mock {
  display: flex;
  padding: 18px 25px;
  border-bottom: 1px solid rgba(168, 230, 207, 0.05);
  align-items: center;
}

.table-header-mock {
  background-color: rgba(168, 230, 207, 0.03);
  border-radius: 15px;
  color: var(--color-moss-green);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.5px;
}

.table-cell {
  flex: 1;
  padding: 0 10px;
}

/* **核心：每一行都是一串长了发光叶子的藤蔓** */
.vine-row {
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.vine-row::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 0;
  background-color: var(--color-fairy-green);
  transition: height 0.3s ease;
}

.vine-row:hover {
  background-color: rgba(168, 230, 207, 0.06);
  color: #fff;
  transform: translateX(8px); /* 大幅度移位 */
  border-radius: 8px;
}

.vine-row:hover::before {
  height: 80%;
}

.vine-row:hover::after {
  content: "🍃"; /* 隐藏的魔法叶子滑出 */
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.7;
  animation: leafSlide 0.4s ease-out;
}

@keyframes leafSlide {
  0% {
    transform: translateY(-50%) translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(-50%) translateX(0);
    opacity: 0.7;
  }
}

.id-cell {
  color: var(--text-muted);
}
.date-cell {
  color: var(--text-muted);
}

.product-name {
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fairy-avatar {
  font-size: 16px;
  opacity: 0.8;
}

.table-cell.currency {
  color: var(--color-crystal-blue);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.mana-crystal {
  font-size: 16px;
  opacity: 0.7;
}

.status-tag {
  padding: 6px 16px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 600;
}

.tag-shipped {
  background-color: rgba(168, 230, 207, 0.1);
  color: var(--color-moss-green);
  border: 1px solid var(--border-green-muted);
  box-shadow: 0 0 15px rgba(168, 230, 207, 0.1);
}

/* 表格底部的森林迷雾虚化 */
.table-body-mock::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  background: linear-gradient(
    0deg,
    var(--bg-panel-light) 15%,
    rgba(253, 253, 253, 0) 100%
  );
  pointer-events: none;
}

/* 图标占位符 (森林符号) */
[class^="icon-"]::before {
  content: "🌿";
  margin-right: 6px;
  opacity: 0.9;
  color: var(--color-moss-green);
}
</style>
