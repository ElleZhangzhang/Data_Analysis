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
  <div class="sc-analytics-container editorial-style">
    <div class="editorial-background">
      <div class="sunlight-spotlight"></div>
      <div class="woven-texture-layer"></div>
    </div>

    <aside class="sidebar-placeholder glass-panel_cream">
      <div class="logo">
        <span class="logo-mark">C</span>
        Data<span class="logo-accent">Cosmos</span>
      </div>

      <div class="dataset-list">
        <!-- 在nav-item这里v-for -->
        <div class="nav-item" v-for="item in dataStore.datasets" :key="item.id">
          <span class="item-icon">✦</span>
          {{ item.name }}
        </div>
      </div>

      <div class="sidebar-actions">
        <!-- 隐藏的 file input -->
        <input
          ref="fileInput"
          type="file"
          @change="handleUpload"
          style="display: none"
        />

        <button
          class="action-btn_sidebar btn-add-chic"
          @click="triggerFileInput"
        >
          <i class="icon-add">+</i> 添加新档案
        </button>
        <button class="action-btn_sidebar btn-delete-chic">
          <i class="icon-delete">✕</i> 移除
        </button>
      </div>
    </aside>

    <!-- currentDataset展示区 -->
    <!-- DataTable组件展示区 -->
    <main class="main-content">
      <div v-if="currentDataset" class="content-wrapper main-panel-editorial">
        <div class="content-header">
          <div class="header-text-group">
            <h1 class="dataset-name editorial-font-weight">
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
            <button class="action-btn_main btn-filter-chic gold-glow-btn">
              <i class="icon-filter"></i> 筛选
              <span class="btn-streamer"></span>
            </button>
            <button class="action-btn_main btn-export-chic gold-glow-btn">
              <i class="icon-export"></i> 导出
              <span class="btn-streamer"></span>
            </button>
          </div>
        </div>

        <div class="table-container mock-virtual-table">
          <div class="table-header-mock">
            <div class="table-cell">编号</div>
            <div class="table-cell">产品</div>
            <div class="table-cell">金额</div>
            <div class="table-cell">日期</div>
            <div class="table-cell">状态</div>
          </div>
          <div class="table-body-mock">
            <div v-for="i in 10" :key="i" class="table-row-mock">
              <div class="table-cell id-cell">#CR-{{ 2000 + i }}</div>
              <div class="table-cell product-name editorial-font-weight">
                Stardust Series [Essentials]
              </div>
              <div class="table-cell currency">
                ¥ {{ (Math.random() * 1000 + 100).toFixed(2) }}
              </div>
              <div class="table-cell date-cell">2023.10.27</div>
              <div class="table-cell status">
                <span class="status-tag tag-shipped-chic">已送达</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDataStore } from "@/stores/data";

import { useFileParser } from "@/composables/useFileParse";
const { parseFile } = useFileParser();

const dataStore = useDataStore();

const fileInput = ref<HTMLInputElement>()

// ----------上传文件---------
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleUpload = async (event) => {
  const file = event.target.files[0]; // 获取文件
  if (!file) return;

  const data = await parseFile(file); // 传入 file 对象
};

//#region
// 模拟数据
const currentDataset = ref({
  name: "销售数据_2024_Q3_Essential系列",
  rowCount: 1250800,
  columnCount: 45,
  createdAt: new Date("2023-10-15T08:30:00"),
  rows: [],
  columns: [],
});

// 模拟格式化时间函数
const formatTime = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
//#endregion
</script>

<style scoped>
/* =========================================
   3. 核心变量与设计系统 (Chic & Editiorial)
   ========================================= */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow: hidden;
  background-color: #fafafa; /* 干净的浅灰白背景 */
  color: #333;
}

.sc-analytics-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  --bg-pure-white: #ffffff;
  --bg-cream: #f9f6f1; /* 干净的米色背景 */
  --text-primary: #333;
  --text-muted: #888;
  --color-gold-deep: #bfa175; /* 深金（古典金色，模拟 image_3 纹理色） */
  --color-gold-pale: #daa520; /* 金色（亮金沙色，模拟 image_2 的金属光泽） */
  --border-gold-muted: rgba(191, 161, 117, 0.3);
  --border-cream: rgba(249, 246, 241, 0.5);
  --glass-blur: blur(20px);
}

/* 强调字重的辅助类 */
.editorial-font-weight {
  font-weight: 600;
  letter-spacing: -0.5px;
}

/* =========================================
   4. 风格核心：日光背景 (The Soul of Editorial)
   ========================================= */
.editorial-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  background-color: #fafafa;
}

/* 4.1 模拟柔和日光 (模拟 image_2 和 image_3) */
.sunlight-spotlight {
  position: absolute;
  width: 1000px;
  height: 1000px;
  top: -200px;
  right: -200px;
  background: radial-gradient(
    circle,
    rgba(253, 253, 246, 0.6) 0%,
    rgba(250, 250, 250, 0) 70%
  );
  filter: blur(50px);
}

/* 4.2 极淡的编织纹理 (模拟 image_2 的网兜袋) */
.woven-texture-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.03; /* 极淡 */
  background-image: linear-gradient(
      45deg,
      var(--color-gold-deep) 25%,
      transparent 25%
    ),
    linear-gradient(-45deg, var(--color-gold-deep) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--color-gold-deep) 75%),
    linear-gradient(-45deg, transparent 75%, var(--color-gold-deep) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* =========================================
   5. 通用毛玻璃和金色悬浮面板
   ========================================= */
/* 暗色毛玻璃（侧边栏） */
.glass-panel_cream {
  background-color: var(--bg-cream);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-right: 1px solid rgba(191, 161, 117, 0.1);
}

/* 主面板的动态金色霓虹呼吸边框 */
.main-panel-editorial {
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-pure-white);
  border: 1px solid var(--border-cream);
  box-shadow: 0 5px 20px rgba(191, 161, 117, 0.05),
    inset 0 0 15px rgba(218, 165, 32, 0.01);
  animation: panelEditorialGlow 5s ease-in-out infinite alternate;
}

@keyframes panelEditorialGlow {
  0% {
    box-shadow: 0 5px 20px rgba(191, 161, 117, 0.05);
  }
  100% {
    box-shadow: 0 10px 30px rgba(191, 161, 117, 0.15);
  }
}

/* =========================================
   6. 侧边栏样式
   ========================================= */
.sidebar-placeholder {
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 40px 25px;
  z-index: 10;
}

.logo {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 60px;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
}

.logo-mark {
  color: var(--color-gold-pale);
  font-size: 28px;
  text-shadow: 0 0 10px rgba(218, 165, 32, 0.2);
}

.logo-accent {
  color: var(--color-gold-deep);
}

.dataset-list {
  flex: 1;
}

.nav-item {
  padding: 16px 20px;
  margin-bottom: 10px;
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.nav-item:hover {
  background-color: rgba(191, 161, 117, 0.03);
  color: var(--text-primary);
}

.nav-item.active {
  background: linear-gradient(
    90deg,
    rgba(191, 161, 117, 0.1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  color: var(--text-primary);
  font-weight: 600;
  border: 1px solid rgba(191, 161, 117, 0.1);
}

.active-indicator {
  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background-color: var(--color-gold-deep);
  border-radius: 2px;
  box-shadow: 0 0 15px var(--color-gold-deep);
}

.item-icon {
  color: var(--color-gold-deep);
  font-size: 14px;
  opacity: 0.6;
}

/* =========================================
   **7. 新增：侧边栏操作按钮 (Chic & Editiorial)**
   ========================================= */
.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 30px;
  border-top: 1px solid rgba(191, 161, 117, 0.1);
}

.action-btn_sidebar {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: -0.2px;
}

/* 添加数据按钮 - 古典金色质感 */
.btn-add-chic {
  background: linear-gradient(135deg, var(--color-gold-deep) 0%, #d8b08a 100%);
  color: #fff;
  border: none;
  box-shadow: 0 5px 15px rgba(191, 161, 117, 0.15);
}

.btn-add-chic:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(191, 161, 117, 0.25);
}

/* 删除按钮 - 幽暗色调 */
.btn-delete-chic {
  background-color: rgba(191, 161, 117, 0.03);
  color: #a9a9a9; /* 柔和的警示色 */
  border: 1px solid rgba(191, 161, 117, 0.1);
}

.btn-delete-chic:hover {
  background-color: rgba(191, 161, 117, 0.05);
  border-color: rgba(191, 161, 117, 0.2);
  color: var(--text-primary);
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
  border-bottom: 1px solid rgba(191, 161, 117, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-pure-white);
}

.dataset-name {
  margin: 0 0 10px 0;
  font-size: 26px;
  color: var(--text-primary);
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--text-muted);
  font-size: 14px;
}

.meta-separator {
  color: rgba(191, 161, 117, 0.3);
}

/* 主操作按钮（带金色闪光） */
.header-actions {
  display: flex;
  gap: 15px;
}

.action-btn_main {
  position: relative;
  padding: 12px 26px;
  border-radius: 20px;
  background: rgba(191, 161, 117, 0.05);
  border: 1px solid rgba(191, 161, 117, 0.1);
  color: var(--color-gold-deep);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 持续流动的能量流光效果 */
.gold-glow-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(218, 165, 32, 0.1),
    transparent
  );
  animation: btnEditorialStreamer 3s linear infinite;
}

@keyframes btnEditorialStreamer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.action-btn_main:hover {
  transform: translateY(-2px);
  border-color: var(--color-gold-pale);
  box-shadow: 0 0 15px rgba(218, 165, 32, 0.15);
}

/* 表格区域 */
.table-container {
  flex: 1;
  padding: 25px;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-pure-white);
}

.table-header-mock,
.table-row-mock {
  display: flex;
  padding: 14px 25px;
  border-bottom: 1px solid rgba(191, 161, 117, 0.03);
  align-items: center;
}

.table-header-mock {
  background-color: rgba(191, 161, 117, 0.02);
  border-radius: 6px;
  color: var(--color-gold-deep);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.table-cell {
  flex: 1;
  padding: 0 10px;
}

.table-row-mock {
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-size: 14px;
  border-radius: 4px;
}

.table-row-mock:hover {
  background-color: rgba(191, 161, 117, 0.03);
  color: var(--color-gold-deep);
  transform: scale(1.005);
}

.id-cell {
  color: var(--text-muted);
}
.date-cell {
  color: var(--text-muted);
}

.product-name {
  color: var(--color-gold-deep);
}

.table-cell.currency {
  color: var(--color-gold-deep);
  font-weight: 600;
}

.status-tag {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.tag-shipped-chic {
  background-color: rgba(218, 165, 32, 0.05);
  color: var(--color-gold-pale);
  border: 1px solid rgba(218, 165, 32, 0.1);
  box-shadow: 0 0 10px rgba(218, 165, 32, 0.05);
}

/* 表格底部的古典虚化 */
.table-body-mock::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(
    0deg,
    var(--bg-pure-white) 10%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

/* 图标占位符 (古典金色) */
[class^="icon-"]::before {
  content: "✦";
  margin-right: 5px;
  opacity: 0.8;
  color: var(--color-gold-deep);
}
</style>
