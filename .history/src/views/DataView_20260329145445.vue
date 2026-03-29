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
    <div class="forest-art-background">
      <div class="forest-mist"></div>

      <div class="drifting-leaves-layer">
        <div v-for="n in 30" :key="'leaf-' + n" class="magic-leaf">🍃</div>
      </div>

      <div class="fairy-dust-system">
        <span v-for="n in 50" :key="'fairy-' + n" class="fairy-dust"></span>
      </div>

      <div class="fixed-decor décor-mushrooms">🍄</div>
      <div class="fixed-decor décor-acorn">🌰</div>
    </div>

    <aside class="sidebar-placeholder forest-border-left">
      <div class="logo">
        <div class="logo-icon-sprite">✨</div>
        Sprite<span class="logo-accent">Cosmos</span>
      </div>

      <div class="dataset-list">
        <div class="nav-item"><i class="icon-sprite-home">🏠</i> 精灵部落</div>
        <div class="nav-item active">
          <i class="icon-magic-scroll">📜</i> 销售数据_Q3_魔法系
          <span class="active-indicator-sprout">🌱</span>
        </div>
        <div class="nav-item"><i class="icon-potion">🧪</i> 药水配方清单</div>
      </div>

      <div class="sidebar-actions">
        <button class="action-btn_sidebar btn-add">
          <i class="icon-add-seed">+</i> 播种数据
        </button>
        <button class="action-btn_sidebar btn-delete">
          <i class="icon-delete-dust">✕</i> 净化
        </button>
      </div>
    </aside>

    <main class="main-content">
      <div
        v-if="currentDataset"
        class="content-wrapper forest-border-main main-panel-enchantment"
      >
        <div class="content-header">
          <div class="header-text-group">
            <h1 class="dataset-name dynamic-forest-glow">
              {{ currentDataset.name }}
            </h1>
            <div class="header-meta">
              <span class="meta-item"
                ><i class="icon-rows">🍃</i
                >{{ currentDataset.rowCount.toLocaleString() }} 片叶子(行)</span
              >
              <span class="meta-separator">✦</span>
              <span class="meta-item"
                ><i class="icon-columns">🌿</i
                >{{ currentDataset.columnCount }} 条藤蔓(列)</span
              >
              <span class="meta-separator">✦</span>
              <span class="meta-item"
                ><i class="icon-time">🕒</i
                >{{ formatTime(currentDataset.createdAt) }} 采摘</span
              >
            </div>
          </div>

          <div class="header-actions">
            <button class="action-btn_main btn-filter magic-glow-btn">
              <i class="icon-filter">🦋</i> 蝴蝶筛选
              <span class="btn-flare-sprout"></span>
            </button>
            <button class="action-btn_main btn-export magic-glow-btn">
              <i class="icon-export">📦</i> 打包传送
              <span class="btn-flare-sprout"></span>
            </button>
          </div>
        </div>

        <div class="table-container mock-virtual-table">
          <div class="table-header-mock">
            <div class="table-cell">精灵订单</div>
            <div class="table-cell">魔法物品</div>
            <div class="table-cell">魔力(金额)</div>
            <div class="table-cell">采摘日期</div>
            <div class="table-cell">状态</div>
          </div>
          <div class="table-body-mock">
            <div v-for="i in 10" :key="'order-' + i" class="table-row-mock">
              <div class="table-cell id-cell">✨ #ORDS-{{ 1000 + i }}</div>
              <div class="table-cell product-name">星尘面霜 [梦幻系列]</div>
              <div class="table-cell currency">
                💧 {{ (Math.random() * 1000 + 100).toFixed(2) }} 魔力
              </div>
              <div class="table-cell date-cell">2023-10-27</div>
              <div class="table-cell status">
                <span class="status-tag tag-shipped">由精灵派送中</span>
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
   3. 核心变量与清新森林设计系统 (Fresh Forest)
   ========================================= */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow: hidden;
  background-color: #fbfbf2; /* 乳牙白，温和的清晨感 */
  color: #2c3e50;
}

.forest-enchantment-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  --bg-forest-white: #fbfbf2;
  --bg-panel-ivory: rgba(255, 255, 240, 0.7); /* 牙白色半透明 */
  --text-main: #2c3e50;
  --text-forest-green: #27ae60;
  --color-mint-light: #f0fff4; /* 极浅薄荷绿 */
  --color-green-sage: #95a5a6; /* 鼠尾草绿 */
  --color-green-active: #2ecc71; /* 活力绿 */
  --color-gold-fairy: #f1c40f; /* 精灵金 */
  --color-blue-fairy: #3498db; /* 精灵蓝 */
  --border-forest-green: rgba(39, 174, 96, 0.2);
  --glass-blur-forest: blur(15px) saturate(150%);
}

/* =========================================
   4. 魔法森林大幅度动态背景 (The Moving Art)
   ========================================= */
.forest-art-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
}

/* 4.1 清晨雾气 (大幅度柔和流动) */
.forest-mist {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(
    circle at center,
    rgba(240, 255, 244, 0.8) 0%,
    rgba(251, 251, 242, 0) 70%
  );
  animation: mistDrift 60s ease-in-out infinite alternate;
}

@keyframes mistDrift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(50px, 50px) scale(1.1);
  }
}

/* 4.2 大幅度流动的叶片 */
.drifting-leaves-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.magic-leaf {
  position: absolute;
  font-size: 20px;
  color: rgba(39, 174, 96, 0.15); /* 极低不透明度的蕨绿 */
  opacity: 0;
  animation: leafDrift var(--drift-duration) linear infinite;
}

@keyframes leafDrift {
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift-x))
      rotate(var(--drift-rotate));
    opacity: 0;
  }
}

/* 随机生成叶片的动态参数，模拟大幅度随机性 */
.magic-leaf:nth-child(5n + 1) {
  --drift-duration: 35s;
  --drift-x: 100px;
  --drift-rotate: 360deg;
  left: 5%;
  font-size: 15px;
}
.magic-leaf:nth-child(5n + 2) {
  --drift-duration: 40s;
  --drift-x: -80px;
  --drift-rotate: -180deg;
  left: 25%;
  font-size: 25px;
}
.magic-leaf:nth-child(5n + 3) {
  --drift-duration: 30s;
  --drift-x: 150px;
  --drift-rotate: 720deg;
  left: 45%;
  font-size: 18px;
}
.magic-leaf:nth-child(5n + 4) {
  --drift-duration: 45s;
  --drift-x: -120px;
  --drift-rotate: 180deg;
  left: 65%;
  font-size: 30px;
}
.magic-leaf:nth-child(5n + 5) {
  --drift-duration: 25s;
  --drift-x: 50px;
  --drift-rotate: 540deg;
  left: 85%;
  font-size: 22px;
}
/* 更多的叶片设置可以通过脚本生成 */

/* 4.3 飞舞的小精灵 */
.fairy-dust-system {
  position: absolute;
  width: 100%;
  height: 100%;
}

.fairy-dust {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  box-shadow: 0 0 10px 3px rgba(241, 196, 15, 0.6);
  opacity: 0;
  animation: fairyFlight 15s linear infinite;
}

.fairy-dust:nth-child(3n + 1) {
  background-color: var(--color-gold-fairy);
  box-shadow: 0 0 10px 3px rgba(241, 196, 15, 0.6);
  animation-duration: 18s;
}
.fairy-dust:nth-child(3n + 2) {
  background-color: var(--color-blue-fairy);
  box-shadow: 0 0 10px 3px rgba(52, 152, 219, 0.6);
  animation-duration: 12s;
  animation-delay: 2s;
}
.fairy-dust:nth-child(3n + 3) {
  background-color: #fff;
  box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.6);
  animation-duration: 20s;
  animation-delay: 4s;
}

@keyframes fairyFlight {
  0% {
    transform: translateY(100vh) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  25% {
    transform: translateY(75vh) translateX(150px);
  }
  50% {
    transform: translateY(50vh) translateX(-100px) scale(1.2);
  }
  75% {
    transform: translateY(25vh) translateX(120px);
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-10vh) translateX(0) scale(0.5);
    opacity: 0;
  }
}

/* 为每个精灵设置独立位置 */
.fairy-dust:nth-child(1) {
  left: 10%;
  top: 20%;
  animation-delay: 1s;
}
.fairy-dust:nth-child(2) {
  left: 30%;
  top: 50%;
  animation-delay: 3s;
}
.fairy-dust:nth-child(3) {
  left: 50%;
  top: 10%;
  animation-delay: 0s;
}
/* ... 此处省略其余精灵的设置 ... */

/* 4.4 固定的可爱植被装饰 */
.fixed-decor {
  position: absolute;
  font-size: 40px;
  opacity: 0.2;
}
.décor-mushrooms {
  bottom: 10%;
  right: 10%;
}
.décor-acorn {
  top: 10%;
  left: 5%;
}

/* =========================================
   5. 侧边栏样式 (Mossy Trunk)
   ========================================= */
.sidebar-placeholder {
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 50px 30px;
  z-index: 10;
}

/* 侧边栏的藤蔓装饰边框 */
.forest-border-left {
  background-color: var(--bg-panel-ivory);
  backdrop-filter: var(--glass-blur-forest);
  -webkit-backdrop-filter: var(--glass-blur-forest);
  border-right: 2px solid var(--border-forest-green);
  box-shadow: 5px 0 15px rgba(39, 174, 96, 0.05);
}

.logo {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 60px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-sprite {
  color: var(--color-gold-fairy);
  font-size: 22px;
  text-shadow: 0 0 15px var(--color-gold-fairy);
}

.logo-accent {
  color: var(--text-forest-green);
}

.dataset-list {
  flex: 1;
}

.nav-item {
  padding: 18px 20px;
  margin-bottom: 15px;
  border-radius: 12px;
  color: var(--color-green-sage);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.nav-item:hover {
  background-color: var(--color-mint-light);
  color: var(--text-main);
}

.nav-item.active {
  background: linear-gradient(
    90deg,
    var(--color-mint-light) 0%,
    rgba(255, 255, 240, 0) 100%
  );
  color: var(--text-forest-green);
  font-weight: 600;
  border: 1px solid var(--border-forest-green);
}

.active-indicator-sprout {
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 28px;
  background-color: var(--color-green-active);
  border-radius: 3px;
  box-shadow: 0 0 15px var(--color-green-active);
}

/* =========================================
   6. 新增：侧边栏操作按钮 (Seed Actions)
   ========================================= */
.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 35px;
  border-top: 1px solid var(--border-forest-green);
}

.action-btn_sidebar {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* 播种数据按钮 - 活力绿色质感 */
.btn-add {
  background: linear-gradient(
    135deg,
    var(--text-forest-green) 0%,
    var(--color-green-active) 100%
  );
  color: #fff;
  border: none;
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.2);
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(39, 174, 96, 0.4);
}

/* 净化按钮 - 柔和色调 */
.btn-delete {
  background-color: #fff;
  color: #ff9966; /* 柔和的警示色 */
  border: 1px solid rgba(255, 153, 102, 0.3);
}

.btn-delete:hover {
  background-color: #fffaf0;
  border-color: rgba(255, 153, 102, 0.5);
  color: #ff7733;
}

/* =========================================
   7. 主内容区域 (The Glade)
   ========================================= */
.main-content {
  flex: 1;
  position: relative;
  z-index: 5;
  padding: 50px;
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

/* 主面板的藤蔓装饰边框 */
.forest-border-main {
  background-color: var(--bg-panel-ivory);
  backdrop-filter: var(--glass-blur-forest);
  -webkit-backdrop-filter: var(--glass-blur-forest);
  border: 2px solid var(--border-forest-green);
  border-radius: 24px;
  box-shadow: 0 15px 50px rgba(39, 174, 96, 0.1),
    inset 0 0 25px rgba(39, 174, 96, 0.05);
}

/* 主面板的魔法呼吸光晕 */
.main-panel-enchantment {
  animation: panelMagicGlow 6s ease-in-out infinite alternate;
}

@keyframes panelMagicGlow {
  0% {
    border-color: var(--border-forest-green);
    box-shadow: 0 15px 50px rgba(39, 174, 96, 0.1);
  }
  100% {
    border-color: rgba(39, 174, 96, 0.4);
    box-shadow: 0 20px 60px rgba(39, 174, 96, 0.2);
  }
}

/* 7.1 顶部信息栏 (Fairy Scroll) */
.content-header {
  padding: 35px 45px;
  border-bottom: 1px solid var(--border-forest-green);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataset-name {
  margin: 0 0 18px 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-main);
}

/* 动态森林魔法光晕 */
.dynamic-forest-glow {
  text-shadow: 0 0 10px rgba(39, 174, 96, 0.4), 0 0 20px var(--color-gold-fairy);
  animation: textMagicPulse 3s ease-in-out infinite alternate;
}

@keyframes textMagicPulse {
  0% {
    text-shadow: 0 0 10px rgba(39, 174, 96, 0.4),
      0 0 20px var(--color-gold-fairy);
  }
  100% {
    text-shadow: 0 0 15px rgba(39, 174, 96, 0.6),
      0 0 30px var(--color-gold-fairy);
  }
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--color-green-sage);
  font-size: 15px;
}

.meta-separator {
  color: rgba(39, 174, 96, 0.3);
}

/* 7.2 主操作按钮 (Magic Flare Buttons) */
.header-actions {
  display: flex;
  gap: 25px;
}

.action-btn_main {
  position: relative;
  padding: 16px 35px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid var(--border-forest-green);
  color: var(--text-forest-green);
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* hover时的精灵萌发效果 */
.btn-flare-sprout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    var(--color-gold-fairy) 0%,
    rgba(251, 251, 242, 0) 60%
  );
  opacity: 0;
  z-index: 1;
}

.action-btn_main:hover {
  transform: translateY(-4px);
  border-color: var(--color-green-active);
  box-shadow: 0 10px 25px rgba(39, 174, 96, 0.2);
}

.action-btn_main:hover .btn-flare-sprout {
  animation: sproutGlow 0.6s ease-out;
}

@keyframes sproutGlow {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* =========================================
   8. 表格区域：精灵叶片市集 (A Festive Ground)
   不当成数据表格，当成一幅画来创作
   ========================================= */
.table-container {
  flex: 1;
  padding: 35px;
  overflow: hidden;
  position: relative;
}

/* 表格的幻象背景 */
.mock-virtual-table::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
    135deg,
    rgba(251, 251, 242, 0.8) 0%,
    rgba(240, 255, 244, 0.3) 100%
  );
  z-index: -1;
  opacity: 0.2;
}

.table-header-mock,
.table-row-mock {
  display: flex;
  padding: 18px 30px;
  border-bottom: 1px solid var(--border-forest-green);
  align-items: center;
}

.table-header-mock {
  background-color: var(--color-mint-light);
  border-radius: 14px;
  color: var(--text-forest-green);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px; /* 增加与内容的间距 */
}

.table-cell {
  flex: 1;
  padding: 0 12px;
}

.table-row-mock {
  color: var(--text-main);
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 15px;
}

.table-row-mock:hover {
  background-color: var(--color-mint-light);
  color: var(--text-forest-green);
  transform: translateX(5px); /* 微小移位，增加灵动感 */
}

.id-cell {
  color: var(--color-green-sage);
}
.date-cell {
  color: var(--color-green-sage);
}

.product-name {
  color: #c0392b; /* 柔和的小莓红，作为花朵装饰 */
}

.table-cell.currency {
  color: var(--color-blue-fairy); /* 精灵蓝数字，模拟魔力 */
  font-weight: 600;
}

.status-tag {
  padding: 6px 16px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 600;
}

.tag-shipped {
  background-color: var(--color-mint-light);
  color: var(--text-forest-green);
  border: 1px solid var(--border-forest-green);
  box-shadow: 0 0 15px rgba(39, 174, 96, 0.1);
}

/* 表格底部的森林魔法虚化 */
.table-body-mock::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  background: linear-gradient(
    0deg,
    var(--bg-panel-ivory) 10%,
    rgba(251, 251, 242, 0) 100%
  );
  pointer-events: none;
}

/* 图标占位符 */
[class^="icon-"] {
  display: inline-flex;
  margin-right: 6px;
  opacity: 0.9;
  color: var(--text-forest-green);
}
</style>
