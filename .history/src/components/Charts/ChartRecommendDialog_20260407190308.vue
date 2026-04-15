<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";
import { useDashboardStore } from "@/stores/dashboard";
import { recommendCharts } from "@/api/qianwen.ts";
import type { ChartConfig } from "@/types";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const dataStore = useDataStore();
const dashboardStore = useDashboardStore();
const { currentDataset } = storeToRefs(dataStore);

// TODO: 状态定义
const loading = ref(false);
const recommendations = ref<any[]>([]); // AI 推荐结果

// TODO: 获取 AI 推荐
const fetchRecommendations = async () => {
  if (!currentDataset.value) return;

  loading.value = true;
  try {
    // 调用 AI API
    const result = await recommendCharts(
      currentDataset.value.columns,
      currentDataset.value.rows.slice(0, 10) // 只传前 10 行样本
    );

    recommendations.value = result;
  } catch (error) {
    alert("AI 推荐失败：" + (error as Error).message);
  } finally {
    loading.value = false;
  }
};

// TODO: 创建图表
const createChart = (recommendation: any) => {
  if (!currentDataset.value) return;

  const chartConfig: ChartConfig = {
    id: `chart-${Date.now()}`,
    datasetId: currentDataset.value.id,
    type: recommendation.type,
    title: recommendation.title,
    xAxis: recommendation.xAxis,
    yAxis: recommendation.yAxis,
    createdAt: Date.now(),
    position: { x: 20, y: 20 },
    size: { width: 500, height: 450 },
  };

  dashboardStore.addChart(chartConfig);
  emit("update:modelValue", false);
};

// 弹窗打开时自动获取推荐
import { watch } from "vue";
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      fetchRecommendations();
    }
  }
);
</script>

<template>
  <div
    v-if="modelValue"
    class="dialog-mask"
    @click="emit('update:modelValue', false)"
  >
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>🤖 AI 图表推荐</h3>
        <button class="close-btn" @click="emit('update:modelValue', false)">
          ×
        </button>
      </div>

      <div class="dialog-body">
        <!-- TODO: 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>AI 正在分析数据...</p>
        </div>

        <!-- TODO: 推荐列表 -->
        <div v-else class="recommendations-list">
          <div
            v-for="(rec, index) in recommendations"
            :key="index"
            class="recommendation-card"
          >
            <!-- 图表图标 -->
            <div class="chart-icon">
              {{
                rec.type === "bar" ? "📊" : rec.type === "line" ? "📈" : "🥧"
              }}
            </div>

            <!-- 推荐信息 -->
            <div class="recommendation-info">
              <h4>{{ rec.title }}</h4>
              <div class="chart-details">
                <span
                  >类型：{{
                    rec.type === "bar"
                      ? "柱状图"
                      : rec.type === "line"
                      ? "折线图"
                      : "饼图"
                  }}</span
                >
                <span>X轴：{{ rec.xAxis }}</span>
                <span>Y轴：{{ rec.yAxis }}</span>
              </div>
              <p class="reason">{{ rec.reason }}</p>
            </div>

            <!-- 创建按钮 -->
            <button class="create-btn" @click="createChart(rec)">创建</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* TODO: 样式（参考 ChartConfigDialog 的样式） */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  width: 700px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dialog-body {
  padding: 24px;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 推荐列表 */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.recommendation-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.chart-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.recommendation-info {
  flex: 1;
}

.recommendation-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.chart-details {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #6b7280;
}

.reason {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.create-btn {
  padding: 8px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.create-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
</style>
