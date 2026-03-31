import { defineStore } from 'pinia'
import type { ChartConfig } from '@/types'

import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  const charts: ref<ChartConfig[]> = ref([])

  const getChartsByDataset = (datasetId: string) => {
    return charts.value.filter(chart => chart.datasetId === datasetId)
  }

  // 添加图表
  addChart(chart: ChartConfig) {
    charts.push(chart)
  }

  // 删除图表
  deleteChart(chartId: string) {
    charts = charts.filter(c => c.id !== chartId)
  }

  return {
    charts,
    getChartsByDataset,
    addChart,
    deleteChart
  }
})
