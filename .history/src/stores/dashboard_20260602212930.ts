import { defineStore } from 'pinia'
import type { ChartConfig } from '@/types'

import { ref } from 'vue'
import type { Ref } from 'vue'


// import { useDataStore } from '@/stores/data'
// const dataStore = useDataStore();
// const { currentDataset } = dataStore;


export const useDashboardStore = defineStore('dashboard', () => {
  const charts: Ref<ChartConfig[]> = ref([])

  // AI推荐缓存的相关函数
  //#region
  const chartRecommendations = ref<Record<string, any[]>>({})

  const saveRecommendations = (datasetId: string, recs: any[]) => {
    chartRecommendations.value[datasetId] = recs
  }

  const getRecommendations = (datasetId: string): any[] | null => {
    return chartRecommendations.value[datasetId] ?? null
  }
  // #endregion

  // 一会儿再看
  const getChartsByDataset = (datasetId: string) => {
    const getCharts = charts.value.filter(chart => chart.datasetId === datasetId)

    return getCharts
  }

  // 图表相关函数
  // #region
  // 添加图表
  const addChart = (chart: ChartConfig) => {
    charts.value.push(chart)
  }

  // 删除图表
  const deleteChart = (chartId: string) => {
    charts.value = charts.value.filter(c => c.id !== chartId)
  }
  //#endregion

  const updateChartPosition = function (chartId: string, position: { x: number; y: number }) {
    // 提示:
    // 1. 用 find 找到对应的图表
    const newPostionChart = charts.value.find(c => c.id === chartId)
    // 2. 更新它的 position 属性
    if (newPostionChart) {
      newPostionChart.position = position
    }
  }

  // 分析报告相关函数
  //#region
  // 分析报告内容缓存，keyed by datasetId
  interface ReportContent {
    content: any      // TipTap JSON content
    updatedAt: number
  }
  const reportContents = ref<Record<string, ReportContent>>({})

  // 保存分析报告内容
  const saveReportContent = (datasetId: string, content: any) => {
    reportContents.value[datasetId] = { content, updatedAt: Date.now() }
  }

  // 获取分析报告内容
  const getReportContent = (datasetId: string): ReportContent | null => {
    return reportContents.value[datasetId] ?? null
  }

  // 删除分析报告内容
  const removeReportContent = (datasetId: string) => {
    delete reportContents.value[datasetId]
  }
  // #endregion

  return {
    charts,
    getChartsByDataset,
    addChart,
    deleteChart,
    updateChartPosition,
    reportContents,
    saveReportContent,
    getReportContent,
    removeReportContent,
    chartRecommendations,
    saveRecommendations,
    getRecommendations,
  }
}, {
  persist: true
})
