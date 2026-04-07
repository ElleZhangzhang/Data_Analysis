import { defineStore } from 'pinia'
import type { ChartConfig } from '@/types'

import { ref } from 'vue'
import type { Ref } from 'vue'


// import { useDataStore } from '@/stores/data'
// const dataStore = useDataStore();
// const { currentDataset } = dataStore;


export const useDashboardStore = defineStore('dashboard', () => {
  const charts: Ref<ChartConfig[]> = ref([])

  // 一会儿再看
  const getChartsByDataset = (datasetId: string) => {
    const getCharts = charts.value.filter(chart => chart.datasetId === datasetId)

    return getCharts
  }

  // 添加图表
  const addChart = (chart: ChartConfig) => {
    charts.value.push(chart)
  }

  // 删除图表
  const deleteChart = (chartId: string) => {
    charts.value = charts.value.filter(c => c.id !== chartId)
  }

  const updateChartPosition = function (chartId: string, position: { x: number; y: number }) {
    // 提示:
    // 1. 用 find 找到对应的图表
    // 2. 更新它的 position 属性
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
