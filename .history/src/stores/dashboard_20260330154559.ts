import { defineStore } from 'pinia'
import type { ChartConfig } from '@/types'

interface DashboardState {
  charts: ChartConfig[]
}

export const useDashboardStore = defineStore('dashboard', () => {
  const charts: ChartConfig[] = []

  getters: {
    // 获取当前数据集的图表
    getChartsByDataset: (state) => (datasetId: string) => {
      return state.charts.filter(chart => chart.datasetId === datasetId)
    }
  },

  actions: {
    // 添加图表
    addChart(chart: ChartConfig) {
      this.charts.push(chart)
    },

    // 删除图表
    deleteChart(chartId: string) {
      this.charts = this.charts.filter(c => c.id !== chartId)
    }
  }
})
