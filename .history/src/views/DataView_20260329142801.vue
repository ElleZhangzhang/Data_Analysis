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
  <div class="sc-analytics-container" @mousemove="handleMouseMove">
    <div class="cosmos-background" :style="backgroundStyle">
      <div class="nebula-layer_1"></div>
      <div class="nebula-layer_2"></div>

      <div class="starfield_tinystars"></div>

      <div class="floating-dust-system">
        <span
          v-for="particle in particles"
          :key="particle.id"
          class="dust-particle"
          :style="particle.style"
        ></span>
      </div>

      <div class="shooting-stars-system">
        <div v-for="n in 3" :key="n" class="shooting-star"></div>
      </div>
    </div>

    <aside class="sidebar-placeholder glass-panel">
      <div class="logo">
        Data<span class="logo-accent">Cosmos</span>
        <div class="logo-glow"></div>
      </div>
      <div class="nav-item">数据集 A</div>
      <div class="nav-item active">
        销售数据_2024_Q3
        <span class="active-indicator"></span>
      </div>
      <div class="nav-item">用户行为分析</div>
    </aside>

    <main class="main-content">
      <div
        v-if="currentDataset"
        class="content-wrapper glass-panel main-panel-neon"
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
            <button class="action-btn btn-filter dynamic-glow-btn">
              <i class="icon-filter"></i> 筛选
              <span class="btn-streamer"></span>
            </button>
            <button class="action-btn btn-export dynamic-glow-btn">
              <i class="icon-export"></i> 导出
              <span class="btn-streamer"></span>
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
              <div class="table-cell product-name">星尘面霜 [梦幻系列]</div>
              <div class="table-cell currency">
                ¥ {{ (Math.random() * 1000 + 100).toFixed(2) }}
              </div>
              <div class="table-cell">2023-10-27</div>
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
import { ref, onMounted, computed } from "vue";

// 模拟数据
const currentDataset = ref({
  name: "销售数据_2024_Q3_梦幻美妆系",
  rowCount: 1250800,
  columnCount: 45,
  createdAt: new Date("2023-10-15T08:30:00"),
  rows: [],
  columns: [],
});

// =========================================
// 2. 动态粒子生成逻辑
// =========================================
const particles = ref([]);
const PARTICLE_COUNT = 80; // 粒子数量

const generateParticles = () => {
  const types = ["pink", "blue", "gold"];
  const newParticles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const size = Math.random() * 5 + 1; // 1px 到 6px
    newParticles.push({
      id: i,
      style: {
        "--p-color": `var(--color-${type})`,
        "--p-size": `${size}px`,
        "--p-left": `${Math.random() * 100}%`,
        "--p-top": `${Math.random() * 100}%`,
        "--p-duration": `${Math.random() * 20 + 10}s`, // 漂浮持续时间
        "--p-delay": `${Math.random() * 10}s`,
        "--p-depth": Math.random() + 0.5, // 视差深度感
        opacity: Math.random() * 0.7 + 0.3,
      },
    });
  }
  particles.value = newParticles;
};

// =========================================
// 3. 鼠标视差交互逻辑
// =========================================
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (event) => {
  // 获取相对于屏幕中心的坐标 (-1 到 1)
  mouseX.value = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY.value = (event.clientY / window.innerHeight) * 2 - 1;
};

// 计算背景视差样式
const backgroundStyle = computed(() => {
  const moveX = mouseX.value * 15; // 移动幅度
  const moveY = mouseY.value * 15;
  return {
    transform: `translate(${moveX}px, ${moveY}px) scale(1.1)`, // 略微放大防止露边
  };
});

// 初始化
onMounted(() => {
  generateParticles();
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
   4. 基础变量与设计系统 (Romantic & Tech)
   ========================================= */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow: hidden;
  background-color: #03010a; /* 极深的夜空黑 */
  color: #f0eaff;
}

.sc-analytics-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  --bg-dark: #03010a;
  --bg-panel: rgba(15, 8, 30, 0.5); /* 更透明的毛玻璃 */
  --text-primary: #f0eaff;
  --text-secondary: #b9a9df;
  --color-pink: #ff79c6; /* 核心浪漫粉 */
  --color-blue: #8be9fd; /* 梦幻青 */
  --color-gold: #f1fa8c; /* 金沙黄 */
  --color-purple: #bd93f9; /* 魅惑紫 */
  --border-neon-pink: rgba(255, 121, 198, 0.4);
  --border-neon-blue: rgba(139, 233, 253, 0.4);
  --glass-blur: blur(25px) saturate(200%);
}

/* =========================================
   5. 深度动态星空背景代码 (The Soul of Romance)
   ========================================= */
.cosmos-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  transition: transform 0.1s ease-out; /* 视差顺滑 */
  will-change: transform;
}

/* 5.1 深邃星云渐变 (从紫到藏青的浪漫过渡) */
.nebula-layer_1 {
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(189, 147, 249, 0.15) 0%,
      rgba(5, 2, 18, 0) 60%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(139, 233, 253, 0.1) 0%,
      rgba(5, 2, 18, 0) 50%
    );
  filter: blur(80px);
}

.nebula-layer_2 {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(15, 8, 30, 0) 0%,
    #03010a 100%
  );
}

/* 5.2 远景：静态微小星field */
.starfield_tinystars {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    white,
    rgba(255, 255, 255, 0.2) 2px,
    transparent 3px
  );
  background-size: 150px 150px;
  background-position: 0 0;
  opacity: 0.1;
}

/* 5.3 近景：动态漂浮星尘粒子 */
.floating-dust-system {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dust-particle {
  position: absolute;
  width: var(--p-size);
  height: var(--p-size);
  background-color: var(--p-color);
  border-radius: 50%;
  left: var(--p-left);
  top: var(--p-top);
  box-shadow: 0 0 calc(var(--p-size) * 3) calc(var(--p-size) / 2) var(--p-color);
  opacity: 0;
  animation: particleFloat var(--p-duration) linear infinite,
    particleTwinkle 4s ease-in-out infinite;
  animation-delay: var(--p-delay);
}

@keyframes particleFloat {
  0% {
    transform: translateY(0vh) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-30vh) scale(0.5);
    opacity: 0;
  } /* 向上漂浮 */
}

@keyframes particleTwinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 5.4 浪漫流星系统 */
.shooting-stars-system {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotateZ(-45deg); /* 流星倾斜角度 */
}

.shooting-star {
  position: absolute;
  height: 2px;
  background: linear-gradient(
    -45deg,
    var(--color-blue),
    rgba(139, 233, 253, 0)
  );
  border-radius: 999px;
  filter: drop-shadow(0 0 6px var(--color-blue));
  animation: tail 5s ease-in-out infinite, shooting 5s ease-in-out infinite;
  opacity: 0;
}

@keyframes tail {
  0% {
    width: 0;
  }
  30% {
    width: 100px;
  }
  100% {
    width: 0;
  }
}

@keyframes shooting {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30% {
    transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    transform: translateX(1000px);
    opacity: 0;
  }
}

/* 设置每条流星的不同位置和延时 */
.shooting-star:nth-child(1) {
  top: 10%;
  left: 30%;
  animation-delay: 0s;
}
.shooting-star:nth-child(2) {
  top: 50%;
  left: 10%;
  animation-delay: 2s;
  animation-duration: 7s;
}
.shooting-star:nth-child(3) {
  top: 80%;
  left: 60%;
  animation-delay: 4s;
  animation-duration: 6s;
}

/* =========================================
   6. 通用毛玻璃和霓虹悬浮面板
   ========================================= */
.glass-panel {
  background-color: var(--bg-panel);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

/* 主面板的动态霓虹呼吸边框 */
.main-panel-neon {
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-neon-pink);
  animation: panelNeonGlow 4s ease-in-out infinite alternate;
}

@keyframes panelNeonGlow {
  0% {
    border-color: var(--border-neon-pink);
    box-shadow: 0 0 15px rgba(255, 121, 198, 0.1);
  }
  100% {
    border-color: var(--border-neon-blue);
    box-shadow: 0 0 30px rgba(139, 233, 253, 0.2);
  }
}

/* =========================================
   7. 布局与具体组件样式
   ========================================= */
/* 7.1 侧边栏 */
.sidebar-placeholder {
  width: 260px;
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column;
  padding: 30px;
  z-index: 10;
  border-right: 1px solid rgba(255, 121, 198, 0.1);
}

.logo {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 50px;
  letter-spacing: 1px;
  position: relative;
}

.logo-accent {
  color: var(--color-pink);
}

.logo-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--color-pink);
  filter: blur(20px);
  opacity: 0.3;
  z-index: -1;
}

.nav-item {
  padding: 14px 18px;
  margin-bottom: 12px;
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: #fff;
}

.nav-item.active {
  background: linear-gradient(
    90deg,
    rgba(255, 121, 198, 0.2) 0%,
    rgba(139, 233, 253, 0.05) 100%
  );
  color: #fff;
  font-weight: 600;
  border: 1px solid var(--border-neon-pink);
}

.active-indicator {
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: var(--color-pink);
  border-radius: 2px;
  box-shadow: 0 0 10px var(--color-pink);
}

/* 7.2 主内容区域 */
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
}

/* 7.3 顶部信息栏 */
.content-header {
  padding: 25px 35px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataset-name {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

/* 动态文字光晕 */
.dynamic-text-glow {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px var(--color-purple);
  animation: textGlowPulse 2s ease-in-out infinite alternate;
}

@keyframes textGlowPulse {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px var(--color-purple);
  }
  100% {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px var(--color-pink);
  }
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-separator {
  color: rgba(255, 121, 198, 0.3);
}

/* 7.4 动态流光按钮 */
.header-actions {
  display: flex;
  gap: 20px;
}

.action-btn {
  position: relative;
  padding: 12px 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 持续流动的能量流光效果 */
.dynamic-glow-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: btnStreamer 3s linear infinite;
}

@keyframes btnStreamer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.btn-filter:hover {
  border-color: var(--color-blue);
  box-shadow: 0 0 20px rgba(139, 233, 253, 0.4);
}

.btn-export:hover {
  border-color: var(--color-pink);
  box-shadow: 0 0 20px rgba(255, 121, 198, 0.4);
}

/* 7.5 表格区域 */
.table-container {
  flex: 1;
  padding: 25px;
  overflow: hidden;
  position: relative;
}

.table-header-mock,
.table-row-mock {
  display: flex;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  align-items: center;
}

.table-header-mock {
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  color: var(--color-blue);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
}

.table-cell {
  flex: 1;
  padding: 0 10px;
}

.table-row-mock {
  color: var(--text-primary);
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 14px;
}

.table-row-mock:hover {
  background-color: rgba(255, 121, 198, 0.08);
  color: #fff;
  transform: translateX(5px); /* 微小移位 */
}

.product-name {
  color: var(--color-purple);
}

.table-cell.currency {
  color: var(--color-gold);
  font-weight: 600;
}

.status-tag {
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
}

.tag-shipped {
  background-color: rgba(139, 233, 253, 0.1);
  color: var(--color-blue);
  border: 1px solid rgba(139, 233, 253, 0.3);
  box-shadow: 0 0 10px rgba(139, 233, 253, 0.2);
}

/* 表格底部的梦幻虚化 */
.table-body-mock::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(
    0deg,
    var(--bg-panel) 10%,
    rgba(20, 10, 35, 0) 100%
  );
  pointer-events: none;
}

/* 图标占位符 */
[class^="icon-"]::before {
  content: "✦";
  margin-right: 4px;
  opacity: 0.8;
}
</style>
