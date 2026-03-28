import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Dataset } from '@/types/index.ts'

// 定义每个数据集

// 等价于
// type row=Record<string,any>

export const useDataStore = defineStore('data', () => {
  // 定义存储多个数据集的数组
  const datasets = ref<Dataset[]>([])

  const loading = ref(false)

  function addDataset(data: Dataset): boolean {
    datasets.value.push(data)
    return true
  }

  function setCurrentDataset(id: string) {
    const dataset = datasets.value.filter(dataset => dataset.id === id)
    return dataset
  }

  return {
    datasets,
    addDataset,
    setCurrentDataset
  }
})
