<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
// ECharts渲染_import
//#region
import * as echarts from "echarts";
import type { ECharts } from "echarts";
import type { ChartConfig, DataRow } from "@/types/index";

import { useDataStore } from "@/stores/data";
//#endregion
const dataStore = useDataStore();
const { currentDataset } = dataStore;

interface Props {
  config: ChartConfig; // 图表配置
  data: DataRow[]; // 数据源
}

const props = defineProps<Props>();

const chartRef = ref<HTMLDivElement>();
let chartInstance: ECharts | null = null;

// 初始化图表
onMounted(() => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);
  renderChart();

  // 窗口大小变化时，图表自动调整大小
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance?.dispose();
});

const handleResize = () => {
  chartInstance?.resize();
};

// 渲染图表
// #region
const renderChart = () => {
  if (!chartInstance) return;

  // 根据图表类型生成不同的 option
  let option: any;

  switch (props.config.type) {
    case "bar":
      option = generateBarChart();
      break;
    case "line":
      option = generateLineChart();
      break;
    case "pie":
      option = generatePieChart();
      break;
    default:
      option = generateBarChart();
  }

  chartInstance.setOption(option); //
};

// 生成柱状图配置
const generateBarChart = () => {
  // 从数据中提取 X 轴和 Y 轴的值
  const xData = props.data.map((row) => row[props.config.xAxis]);
  const yData = props.data.map((row) => row[props.config.yAxis]);

  return {
    title: {
      text: props.config.title,
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xData,
      axisLabel: {
        rotate: 45, // 标签旋转 45 度，避免重叠
        interval: 0, // 显示所有标签
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: props.config.yAxis,
        type: "bar",
        data: yData,
        itemStyle: {
          color: "#3b82f6",
        },
      },
    ],
  };
};

// 生成折线图配置
const generateLineChart = () => {
  const xData = props.data.map((row) => row[props.config.xAxis]);
  const yData = props.data.map((row) => row[props.config.yAxis]);

  return {
    title: {
      text: props.config.title,
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xData,
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: props.config.yAxis,
        type: "line",
        data: yData,
        smooth: true, // 平滑曲线
        itemStyle: {
          color: "#3b82f6",
        },
        areaStyle: {
          // 填充区域
          color: "rgba(59, 130, 246, 0.1)",
        },
      },
    ],
  };
};

// 生成饼图配置
const generatePieChart = () => {
  // 饼图需要聚合数据
  // 例如：统计每个年龄段的人数
  const dataMap = new Map<string, number>();

  props.data.forEach((row) => {
    const key = String(row[props.config.xAxis]);
    const value = Number(row[props.config.yAxis]) || 1;

    dataMap.set(key, (dataMap.get(key) || 0) + value);
  });

  const pieData = Array.from(dataMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    title: {
      text: props.config.title,
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: props.config.xAxis,
        type: "pie",
        radius: "60%",
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
};

// 监听配置和数据变化，重新渲染
watch(
  [() => props.config, () => props.data],
  () => {
    renderChart();
  },
  { deep: true }
);
//#endregion
</script>

<template>
  <div class="chart-card">
    <!-- 图表容器 -->
    <div ref="chartRef" class="chart-container"></div>

    <!-- 操作按钮 -->
    <div class="chart-actions">
      <button class="delete-btn" @click="$emit('delete')">删除</button>
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.chart-card:hover .chart-actions {
  opacity: 1;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.chart-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0;
  transition: opacity 0.2s;
}

.delete-btn {
  padding: 6px 12px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fecaca;
}
</style>
