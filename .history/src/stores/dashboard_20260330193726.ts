import { defineStore } from 'pinia'
import type { ChartConfig } from '@/types'

import { ref } from 'vue'
import type { Ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  const charts: Ref<ChartConfig[]> = ref([])

  const getChartsByDataset = (datasetId: string) => {
    return charts.value.filter(chart => chart.datasetId === datasetId)
  }

  // 添加图表
  const addChart = (chart: ChartConfig) => {
    charts.value.push(chart)
    console.log(charts.value);

  }

  // 删除图表
  const deleteChart = (chartId: string) => {
    charts.value = charts.value.filter(c => c.id !== chartId)
  }

  return {
    charts,
    getChartsByDataset,
    addChart,
    deleteChart
  }
}, {
  persist: true
})
