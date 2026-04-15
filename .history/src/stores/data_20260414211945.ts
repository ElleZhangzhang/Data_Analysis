import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Dataset } from '@/types/index.ts'

import {
  getAllDatasetsFromDB,
  upsertDatasetToDB,
  deleteDatasetFromDB
} from '@/utils/datasetDB'

// 定义每个数据集

// 等价于
// type row=Record<string,any>

export const useDataStore = defineStore('data', () => {
  // 定义存储多个数据集的数组
  const datasets = ref<Dataset[]>([])
  const currentDataset = ref<Dataset | null>(null)
  const loading = ref(false)

  const hydrated = ref(false)
  async function hydrateDatasets() {
    if (hydrated.value) return
    datasets.value = await getAllDatasetsFromDB()
    hydrated.value = true
  }


  function addDataset(data: Dataset): boolean {
    // datasets.value.push(data)
    // return true
    const index = datasets.value.findIndex(item => item.id === data.id)
    if (index >= 0) {
      datasets.value[index] = data
    } else {
      datasets.value.push(data)
    }
    void upsertDatasetToDB(data)
    return true
  }

  // 那个那个，文件删除功能我还没做，先放在这里了（其实很简单，但我懒）
  // function removeDataset(id: string): boolean {
  //   datasets.value = datasets.value.filter(item => item.id !== id)
  //   if (currentDataset.value?.id === id) {
  //     currentDataset.value = null
  //   }
  //   void deleteDatasetFromDB(id)
  //   return true
  // }


  function setCurrentDataset(id: string) {
    const dataset = datasets.value.filter(dataset => dataset.id === id)

    currentDataset.value = dataset[0]
  }

  void hydrateDatasets()

  return {
    datasets,
    currentDataset,
    hydrateDatasets,
    addDataset,
    setCurrentDataset,
    // removeDataset,
  }
}, {
  persist: true
})
