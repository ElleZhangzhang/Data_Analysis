<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";
import { useFileParser } from "@/composables/useFileParser";
import VirtualTable from "@/components/DataTable/VirtualTable.vue";
import { ref } from "vue";

const dataStore = useDataStore();
const { datasets, currentDataset } = storeToRefs(dataStore);
const { parseFile } = useFileParser();

const uploading = ref(false);
const fileInput = ref<HTMLInputElement>();

// 上传文件
const handleUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploading.value = true;
  try {
    const dataset = await parseFile(file);
    dataStore.addDataset(dataset);
    dataStore.setCurrentDataset(dataset.id);
  } catch (error) {
    alert("文件解析失败：" + (error as Error).message);
  } finally {
    uploading.value = false;
    // 清空 input，允许重复上传同一文件
    input.value = "";
  }
};

// 选择数据集
const selectDataset = (id: string) => {
  dataStore.setCurrentDataset(id);
};

// 删除数据集
const deleteDataset = (id: string, event: Event) => {
  event.stopPropagation(); // 阻止触发选中
  if (confirm("确定删除这个数据集吗？")) {
    dataStore.deleteDataset(id);
  }
};

// 触发文件选择
const triggerUpload = () => {
  fileInput.value?.click();
};

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="data-view">
    <!-- 左侧：数据集列表 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>我的数据集</h2>
        <span class="count">{{ datasets.length }}</span>
      </div>

      <!-- 数据集列表 -->
      <div class="dataset-list">
        <div
          v-for="dataset in datasets"
          :key="dataset.id"
          class="dataset-item"
          :class="{ active: currentDataset?.id === dataset.id }"
          @click="selectDataset(dataset.id)"
        >
          <!-- 图标 -->
          <div class="dataset-icon">📊</div>

          <!-- 信息 -->
          <div class="dataset-info">
            <div class="dataset-name">{{ dataset.name }}</div>
            <div class="dataset-meta">
              <span>{{ dataset.rowCount.toLocaleString() }} 行</span>
              <span>·</span>
              <span>{{ dataset.columnCount }} 列</span>
            </div>
            <div class="dataset-time">{{ formatTime(dataset.createdAt) }}</div>
          </div>

          <!-- 删除按钮 -->
          <button
            class="delete-btn"
            @click="deleteDataset(dataset.id, $event)"
            title="删除"
          >
            ×
          </button>
        </div>

        <!-- 空状态 -->
        <div v-if="datasets.length === 0" class="empty-state">
          <div class="empty-icon">📂</div>
          <p>还没有数据集</p>
          <p class="empty-hint">上传 Excel 或 CSV 文件开始</p>
        </div>
      </div>

      <!-- 上传按钮 -->
      <div class="upload-area">
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          @change="handleUpload"
          style="display: none"
        />
        <button class="upload-btn" :disabled="uploading" @click="triggerUpload">
          <span v-if="uploading">上传中...</span>
          <span v-else>+ 上传数据</span>
        </button>
      </div>
    </aside>

    <!-- 右侧：数据表格 -->
    <main class="main-content">
      <!-- 有选中的数据集 -->
      <div v-if="currentDataset" class="content-wrapper">
        <!-- 顶部信息栏 -->
        <div class="content-header">
          <div>
            <h1>{{ currentDataset.name }}</h1>
            <div class="header-meta">
              <span>{{ currentDataset.rowCount.toLocaleString() }} 行数据</span>
              <span>·</span>
              <span>{{ currentDataset.columnCount }} 列</span>
              <span>·</span>
              <span>{{ formatTime(currentDataset.createdAt) }}</span>
            </div>
          </div>

          <!-- 操作按钮（后续扩展） -->
          <div class="header-actions">
            <button class="action-btn">筛选</button>
            <button class="action-btn">导出</button>
          </div>
        </div>

        <!-- 虚拟滚动表格 -->
        <div class="table-container">
          <VirtualTable
            :data="currentDataset.rows"
            :columns="currentDataset.columns"
          />
        </div>
      </div>

      <!-- 未选中状态 -->
      <div v-else class="empty-content">
        <div class="empty-icon">👈</div>
        <h2>选择一个数据集开始分析</h2>
        <p>从左侧列表中选择，或上传新的数据文件</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 整体布局 */
.data-view {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
}

/* ===== 左侧边栏 ===== */
.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px 20px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.count {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

/* 数据集列表 */
.dataset-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.dataset-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
  position: relative;
}

.dataset-item:hover {
  background: #f9fafb;
}

.dataset-item.active {
  background: #eff6ff;
  border: 1px solid #3b82f6;
}

.dataset-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.dataset-info {
  flex: 1;
  min-width: 0; /* 允许文本截断 */
}

.dataset-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dataset-meta {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  gap: 6px;
  margin-bottom: 2px;
}

.dataset-time {
  font-size: 12px;
  color: #9ca3af;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.dataset-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 8px 0;
  font-size: 14px;
}

.empty-hint {
  font-size: 13px;
  color: #d1d5db;
}

/* 上传按钮 */
.upload-area {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.upload-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== 右侧主内容 ===== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-header {
  background: white;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.content-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.header-meta {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.table-container {
  flex: 1;
  padding: 24px 32px;
  overflow: hidden;
}

/* 未选中状态 */
.empty-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.empty-content .empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.empty-content h2 {
  font-size: 20px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.empty-content p {
  font-size: 14px;
  color: #9ca3af;
}

/* 滚动条样式 */
.dataset-list::-webkit-scrollbar {
  width: 6px;
}

.dataset-list::-webkit-scrollbar-track {
  background: transparent;
}

.dataset-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dataset-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
