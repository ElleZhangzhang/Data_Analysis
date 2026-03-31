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
  <button @click="showValues">Show currentDataset and currentCharts</button>

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

      <!-- 数据列表 -->
      <div class="dataset-list">
        <!-- 在nav-item这里v-for -->
        <div
          class="nav-item"
          v-for="item in dataStore.datasets"
          :key="item.id"
          @click="dataStore.setCurrentDataset(item.id)"
        >
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
    <main class="main-content">
      <div
        v-if="dataStore.currentDataset"
        class="content-wrapper main-panel-editorial"
      >
        <div class="content-header">
          <div class="header-text-group">
            <h1 class="dataset-name editorial-font-weight">
              {{ dataStore.currentDataset?.name }}
            </h1>
            <div class="header-meta">
              <span class="meta-item"
                ><i class="icon-rows"></i
                >{{
                  dataStore.currentDataset?.rowCount.toLocaleString()
                }}
                行数据</span
              >
              <span class="meta-separator">✦</span>
              <span class="meta-item"
                ><i class="icon-columns"></i
                >{{ dataStore.currentDataset?.columnCount }} 列</span
              >
              <span class="meta-separator">✦</span>
              <!-- <span class="meta-item"
                ><i class="icon-time"></i
                >{{ formatTime(dataStore.currentDataset?.createAt) }}</span
              > -->
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
            <div
              class="table-cell"
              v-for="key in dataStore.currentDataset.columns"
              :key="key.label"
            >
              {{ key.keyName }}
            </div>
          </div>
        </div>

        <!-- VirtualTable展示区 -->
        <!-- #region -->
        <!-- <div class="table-body-mock"> -->

        <VirtualTable
          :data="dataStore.currentDataset.rows"
          :columns="dataStore.currentDataset.columns"
        ></VirtualTable>

        <!-- </div> -->
        <!-- #endregion -->

        <!-- 图表区域 -->
        <!-- #region -->

        <div class="charts-section">
          <div class="section-header">
            <h3>📊 数据可视化</h3>
            <button class="create-chart-btn" @click="showChartDialog = true">
              + 创建图表
            </button>
          </div>

          <!-- 图表网格 -->
          <div
            class="charts-grid"
            :class="{ 'has-charts': currentCharts.length > 0 }"
          >
            <!-- 空状态 -->
            <p v-if="currentCharts.length === 0" class="empty-hint">
              点击"创建图表"开始可视化分析
            </p>

            <!-- 图表列表 -->
            <div v-if="currentCharts.length !== 0">
              <BaseChart
                v-for="chart in currentCharts"
                :key="chart.id"
                :config="chart"
                :data="currentDataset?.rows"
                @delete="handleDeleteChart(chart.id)"
              />
            </div>
          </div>
        </div>

        <!-- #endregion -->

        <!-- 未选中状态 -->
        <!-- 暂时不知道要加到哪里 -->
        <!-- <div v-else class="empty-content">
        <div class="empty-icon">👈</div>
        <h2>选择一个数据集开始分析</h2>
        <p>从左侧列表中选择，或上传新的数据文件</p>
      </div> -->

        <!-- 弹窗 -->
        <ChartConfigDialog v-model="showChartDialog" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDataStore } from "@/stores/data";

import { useFileParser } from "@/composables/useFileParse";

import { useDashboardStore } from "@/stores/dashboard";
import { storeToRefs } from "pinia";
const dashboardStore = useDashboardStore();

const dataStore = useDataStore();
const { currentDataset, datasets } = storeToRefs(dataStore);
const { addDataset, setCurrentDataset } = dataStore;

// 控制弹窗显示
const showChartDialog = ref(false);

// 上传文件
//#region
const { parseFile } = useFileParser();

const fileInput = ref<HTMLInputElement>();

// ----------上传文件---------
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleUpload = async (event) => {
  const file = event.target.files[0]; // 获取文件
  if (!file) return;

  const data = await parseFile(file); // 传入 file 对象
};

//#endregion

// ✨ 新增：获取当前已经创建过的数据集的图表
const currentCharts = computed(() => {
  if (!currentDataset?.value) return [];
  console.log("currentDataset更新了呀呀呀");

  return dashboardStore.getChartsByDataset(currentDataset.value.id);
});
const showValues = function () {
  console.log("更新后的currentDataset:", currentDataset.value);
  console.log("更新后的currentCharts:", currentCharts.value);
};

// ✨ 新增：删除图表
const handleDeleteChart = (chartId: string) => {
  if (confirm("确定删除这个图表吗？")) {
    dashboardStore.deleteChart(chartId);
  }
};
</script>

<style scoped>
/* 已有样式 */
/* #region */
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
  overflow: auto;
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
  overflow: auto;
  position: relative;
  z-index: 5;
  padding: 40px;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
}

.content-wrapper {
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;

  gap: 0;
}

/* 顶部信息栏 */
.content-header {
  padding: 30px 40px;
  border-bottom: 1px solid rgba(191, 161, 117, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-pure-white);

  flex-shrink: 0;
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
  /* flex: 1; */
  padding: 25px;
  /* overflow: auto; */
  position: relative;
  background-color: var(--bg-pure-white);
}

.table-header-mock {
  display: flex;
  padding: 14px 25px;
  border-bottom: 1px solid rgba(191, 161, 117, 0.03);
  align-items: center;
  text-align: left;
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

.table-body-mock {
  position: relative;
  flex: 1;
  /* overflow: auto; */
}

/* 表格底部的古典虚化 */
/* .table-body-mock::after {
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
} */

/* 图标占位符 (古典金色) */
[class^="icon-"]::before {
  content: "✦";
  margin-right: 5px;
  opacity: 0.8;
  color: var(--color-gold-deep);
}
/* #endregion */

/* 图表区域样式 */
/* #region */
body {
  overflow: scroll;
}

.charts-section {
  /* height: 400px; */
  margin-top: 24px;
  padding: 24px 32px;
  background: white;
  border-radius: 8px;
  /* overflow: auto; */

  min-height: 200px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.create-chart-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.create-chart-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 图表网格样式 */
/* #region */
.charts-grid {
  min-height: 200px;
}

.charts-grid.has-charts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
}

.charts-grid:not(.has-charts) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-hint {
  color: #9ca3af;
  font-size: 14px;
}
/* #endregion */
/* #endregion */
</style>
