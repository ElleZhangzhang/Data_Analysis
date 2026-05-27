<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import { useDataStore } from '@/stores/data'
import { useDashboardStore } from '@/stores/dashboard'
import type { DataRow } from '@/types'

const props = defineProps<NodeViewProps>()

const chartRef = ref<HTMLDivElement>()
const dataStore = useDataStore()
const dashboardStore = useDashboardStore()

const chartConfig = computed(() => {
  return dashboardStore.charts.find(c => c.id === props.node.attrs.chartId)
})

const dataset = computed(() => {
  const cfg = chartConfig.value
  if (!cfg) return null
  return dataStore.datasets.find(d => d.id === cfg.datasetId)
})

let chartInstance: ECharts | null = null
let resizeObserver: ResizeObserver | null = null

// Sampling & binning (from BaseChart.vue)
const MAX_POINTS = 1000
function sampleCategorySeries(xData: (string | number)[], yData: (string | number)[]) {
  if (xData.length <= MAX_POINTS) return { xData, yData, sampled: false }
  const step = Math.ceil(xData.length / MAX_POINTS)
  const sampledX: (string | number)[] = []
  const sampledY: (string | number)[] = []
  for (let i = 0; i < xData.length; i += step) {
    sampledX.push(xData[i]!)
    sampledY.push(yData[i]!)
  }
  return { xData: sampledX, yData: sampledY, sampled: true }
}

function buildBinningSeries(data: DataRow[], field: string, binCount = 8) {
  const values = data.map(row => Number(row[field])).filter(v => Number.isFinite(v))
  if (values.length === 0) return { xData: [] as string[], yData: [] as number[] }
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return { xData: [`${min}`], yData: [values.length] }
  const safeBinCount = Math.max(3, Math.min(20, Math.floor(binCount)))
  const step = (max - min) / safeBinCount
  const counts = new Array(safeBinCount).fill(0)
  values.forEach(value => {
    const rawIndex = Math.floor((value - min) / step)
    const index = Math.min(safeBinCount - 1, Math.max(0, rawIndex))
    counts[index]!++
  })
  const xData = counts.map((_, i) => {
    const start = min + i * step
    const end = i === safeBinCount - 1 ? max : min + (i + 1) * step
    return `${start.toFixed(0)}-${end.toFixed(0)}`
  })
  return { xData, yData: counts }
}

function buildChartOption() {
  const config = chartConfig.value
  const data = dataset.value?.rows || []
  if (!config) return {}
  const binning = config.transform?.binning
  const titleOpt = { text: config.title, left: 'center' as const, textStyle: { fontSize: 14, fontWeight: 600 } }
  const gridOpt = { left: '3%', right: '4%', bottom: '3%', containLabel: true }

  switch (config.type) {
    case 'bar': {
      if (binning?.field) {
        const binned = buildBinningSeries(data, binning.field, binning.binCount ?? 8)
        return { title: titleOpt, tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } }, grid: gridOpt, xAxis: { type: 'category' as const, data: binned.xData, axisLabel: { rotate: 45, interval: 0 } }, yAxis: { type: 'value' as const }, series: [{ name: `${binning.field} 区间人数`, type: 'bar' as const, data: binned.yData, itemStyle: { color: '#3b82f6' } }] }
      }
      const rawX = data.map(row => row[config.xAxis] as string | number)
      const rawY = data.map(row => row[config.yAxis] as string | number)
      const opt = sampleCategorySeries(rawX, rawY)
      return { title: titleOpt, tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } }, grid: gridOpt, xAxis: { type: 'category' as const, data: opt.xData, axisLabel: { rotate: 45, interval: 0 } }, yAxis: { type: 'value' as const }, series: [{ name: config.yAxis, type: 'bar' as const, data: opt.yData, itemStyle: { color: '#3b82f6' } }] }
    }
    case 'line': {
      if (binning?.field) {
        const binned = buildBinningSeries(data, binning.field, binning.binCount ?? 8)
        return { title: titleOpt, tooltip: { trigger: 'axis' as const }, grid: gridOpt, xAxis: { type: 'category' as const, data: binned.xData, boundaryGap: false }, yAxis: { type: 'value' as const }, series: [{ name: `${binning.field} 区间人数`, type: 'line' as const, data: binned.yData, smooth: true, itemStyle: { color: '#3b82f6' }, areaStyle: { color: 'rgba(59, 130, 246, 0.1)' } }] }
      }
      const rawX = data.map(row => row[config.xAxis] as string | number)
      const rawY = data.map(row => row[config.yAxis] as string | number)
      const opt = sampleCategorySeries(rawX, rawY)
      return { title: titleOpt, tooltip: { trigger: 'axis' as const }, grid: gridOpt, xAxis: { type: 'category' as const, data: opt.xData, boundaryGap: false }, yAxis: { type: 'value' as const }, series: [{ name: config.yAxis, type: 'line' as const, data: opt.yData, smooth: true, itemStyle: { color: '#3b82f6' }, areaStyle: { color: 'rgba(59, 130, 246, 0.1)' } }] }
    }
    case 'pie': {
      const dataMap = new Map<string, number>()
      data.forEach(row => {
        const key = String(row[config.xAxis])
        const value = Number(row[config.yAxis]) || 1
        dataMap.set(key, (dataMap.get(key) || 0) + value)
      })
      return { title: titleOpt, tooltip: { trigger: 'item' as const, formatter: '{b}: {c} ({d}%)' }, legend: { orient: 'vertical' as const, left: 'left' }, series: [{ name: config.xAxis, type: 'pie' as const, radius: '60%', data: Array.from(dataMap.entries()).map(([name, value]) => ({ name, value })), emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }] }
    }
    case 'scatter': {
      const points = data.map(row => {
        const x = Number(row[config.xAxis])
        const y = Number(row[config.yAxis])
        return Number.isFinite(x) && Number.isFinite(y) ? [x, y] as [number, number] : null
      }).filter((p): p is [number, number] => p !== null)
      return { title: titleOpt, tooltip: { trigger: 'item' as const }, grid: gridOpt, xAxis: { type: 'value' as const, name: config.xAxis }, yAxis: { type: 'value' as const, name: config.yAxis }, series: [{ name: `${config.xAxis} vs ${config.yAxis}`, type: 'scatter' as const, data: points, itemStyle: { color: '#3b82f6' } }] }
    }
    default:
      return {}
  }
}

function renderChart() {
  if (!chartInstance) return
  const option = buildChartOption()
  if (Object.keys(option).length > 0) {
    chartInstance.setOption(option, true)
  }
}

watch([chartConfig, dataset], () => {
  nextTick(() => renderChart())
}, { deep: true })

onMounted(() => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  renderChart()
  resizeObserver = new ResizeObserver(() => chartInstance?.resize())
  resizeObserver.observe(chartRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
})
</script>

<template>
  <NodeViewWrapper class="chart-embed-nodeview" :class="{ 'is-selected': selected }">
    <div v-if="!chartConfig" class="chart-embed-error">
      图表未找到 (ID: {{ node.attrs.chartId }})
      <button class="embed-delete-btn" @click="deleteNode">删除</button>
    </div>
    <div v-else-if="!dataset" class="chart-embed-error">
      数据集未找到
      <button class="embed-delete-btn" @click="deleteNode">删除</button>
    </div>
    <div v-else class="chart-embed-body">
      <div ref="chartRef" class="chart-embed-canvas"></div>
      <div class="chart-embed-header">
        <span class="chart-embed-title">{{ chartConfig.title }}</span>
        <span class="chart-embed-type">[{{ chartConfig.type }}]</span>
        <button v-if="selected" class="embed-delete-btn" @click="deleteNode">删除</button>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.chart-embed-nodeview {
  margin: 16px 0;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: border-color 0.2s;
  overflow: hidden;
}
.chart-embed-nodeview.is-selected {
  border-color: #409eff;
}
.chart-embed-error {
  padding: 24px;
  text-align: center;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 8px;
  font-size: 14px;
}
.chart-embed-body {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
}
.chart-embed-canvas {
  width: 100%;
  height: 340px;
}
.chart-embed-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
.chart-embed-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.chart-embed-type {
  font-size: 11px;
  color: #999;
  flex: 1;
}
.embed-delete-btn {
  padding: 4px 10px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.embed-delete-btn:hover {
  background: #fecaca;
}
</style>
