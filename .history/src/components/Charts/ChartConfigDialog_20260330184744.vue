<template>
  <!-- 遮罩层 -->
  <div v-if="modelValue" class="dialog-mask" @click="handleCancel">
    <!-- 弹窗内容（点击时阻止冒泡，避免关闭） -->
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>创建图表</h3>
        <button class="close-btn" @click="handleCancel">×</button>
      </div>

      <div class="dialog-body">
        <!-- 图表标题 -->
        <div class="form-item">
          <label>图表标题</label>
          <input
            v-model="chartTitle"
            type="text"
            placeholder="例如：员工工资分布"
            class="form-input"
          />
        </div>

        <!-- 图表类型 -->
        <div class="form-item">
          <label>图表类型</label>
          <div class="radio-group">
            <label class="radio-item">
              <input v-model="chartType" type="radio" value="bar" />
              <span>📊 柱状图</span>
            </label>
            <label class="radio-item">
              <input v-model="chartType" type="radio" value="line" />
              <span>📈 折线图</span>
            </label>
            <label class="radio-item">
              <input v-model="chartType" type="radio" value="pie" />
              <span>🥧 饼图</span>
            </label>
          </div>
        </div>

        <!-- X 轴 -->
        <div class="form-item">
          <label>X 轴（横轴）</label>
          <select v-model="xAxisColumn" class="form-select">
            <option value="">-- 请选择列 --</option>
            <option
              v-for="col in availableColumns"
              :key="col.label"
              :value="col.label"
            >
              {{ col.keyName }}
            </option>
          </select>
          <p class="hint">例如：选择 NAME 列作为横轴</p>
        </div>

        <!-- Y 轴 -->
        <div class="form-item">
          <label>Y 轴（纵轴）</label>
          <select v-model="yAxisColumn" class="form-select">
            <option value="">-- 请选择列 --</option>
            <option
              v-for="col in availableColumns"
              :key="col.label"
              :value="col.label"
            >
              {{ col.keyName }}
            </option>
          </select>
          <p class="hint">例如：选择 SALARY 列作为纵轴</p>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn-cancel" @click="handleCancel">取消</button>
        <button class="btn-create" @click="handleCreate">创建</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";

// 控制弹窗显示/隐藏
const props = defineProps<{
  modelValue: boolean; // 是否显示弹窗
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const dataStore = useDataStore();
const { currentDataset } = storeToRefs(dataStore);

// 表单数据
const chartType = ref<"line" | "bar" | "pie">("bar");
const chartTitle = ref("");
const xAxisColumn = ref("");
const yAxisColumn = ref("");

// 可选的列（从当前数据集获取）
const availableColumns = computed(() => {
  return currentDataset.value?.columns || [];
});

// 创建图表
const handleCreate = () => {
  const handleCreate = () => {
  if (!chartTitle.value || !xAxisColumn.value || !yAxisColumn.value) {
    alert('请填写完整信息')
    return
  }

  if (!currentDataset.value) return

  // 创建图表配置对象
  const chartConfig: ChartConfig = {
    id: `chart-${Date.now()}`,
    datasetId: currentDataset.value.id,
    type: chartType.value,
    title: chartTitle.value,
    xAxis: xAxisColumn.value,
    yAxis: yAxisColumn.value,
    createdAt: Date.now()
  }

  // 保存到 store
  dashboardStore.addChart(chartConfig)

  console.log('图表已创建:', chartConfig)

  // 关闭弹窗
  emit('update:modelValue', false)

  // 清空表单
  chartTitle.value = ''
  xAxisColumn.value = ''
  yAxisColumn.value = ''
}
  }

  // TODO: 后面会把配置保存到 store
  console.log("创建图表:", {
    type: chartType.value,
    title: chartTitle.value,
    xAxis: xAxisColumn.value,
    yAxis: yAxisColumn.value,
  });

  // 关闭弹窗
  emit("update:modelValue", false);

  // 清空表单
  chartTitle.value = "";
  xAxisColumn.value = "";
  yAxisColumn.value = "";
};

// 取消
const handleCancel = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
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
  width: 500px;
  max-width: 90vw;
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

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.radio-group {
  display: flex;
  gap: 12px;
}

.radio-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.radio-item input {
  cursor: pointer;
}

.radio-item span {
  font-size: 14px;
}

.hint {
  margin-top: 6px;
  font-size: 12px;
  color: #9ca3af;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-create {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-create {
  background: #3b82f6;
  color: white;
}

.btn-create:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
</style>
