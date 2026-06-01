import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Dataset } from '@/types/index.ts'

import {
  getAllDatasetsFromDB,
  getDatasetFromDB,
  upsertDatasetToDB,
} from '@/utils/datasetDB'

const LAST_DATASET_KEY = 'lastDatasetId'

export const useDataStore = defineStore('data', () => {
  const datasets = ref<Dataset[]>([])
  const currentDataset = ref<Dataset | null>(null)

  // IndexedDB 初始化回填
  //#region
  const hydrated = ref(false) // 是否已从 IndexedDB 完成初始化回填
  let pendingDatasetId: string | null = null // hydration 完成前的切换请求暂存

  async function hydrateDatasets() {
    if (hydrated.value) return
    try {
      const all = await getAllDatasetsFromDB()
      // 仅存储元数据（不含行数据），选中数据集时才按需加载
      datasets.value = all.map(d => ({ ...d, rows: [] }))

      // 回填完成后，尝试恢复上次使用的数据集
      const lastId = localStorage.getItem(LAST_DATASET_KEY)
      if (lastId) {
        const found = datasets.value.find(d => d.id === lastId)
        if (found) {
          await loadDatasetRows(lastId)
        }
      }
    } catch (e) {
      console.error('数据集回填失败:', e)
    } finally {
      hydrated.value = true
      // hydration 完成，处理暂存的切换请求（优先级高于 localStorage 恢复）
      if (pendingDatasetId) {
        setCurrentDataset(pendingDatasetId)
        pendingDatasetId = null
      }
    }
  }
  //#endregion

  function addDataset(data: Dataset): boolean {
    void upsertDatasetToDB(data)
    datasets.value.push({ ...data, rows: [] })
    return true
  }

  async function loadDatasetRows(id: string) {
    try {
      const full = await getDatasetFromDB(id)
      if (full && currentDataset.value?.id === id) {
        currentDataset.value = full
      }
    } catch (e) {
      console.error(`加载数据集 ${id} 的行数据失败:`, e)
    }
  }

  function setCurrentDataset(id: string) {
    // 如果 hydration 未完成，暂存请求，等完成后自动切换
    if (!hydrated.value) {
      pendingDatasetId = id
      currentDataset.value = null
      return
    }

    const meta = datasets.value.find(d => d.id === id)
    if (!meta) {
      currentDataset.value = null
      return
    }
    // 先设置元数据（columns、name 等立即可用），rows 异步加载
    currentDataset.value = { ...meta, rows: [] }
    void loadDatasetRows(id)
  }

  // 持久化 currentDataset 到 localStorage，刷新后恢复
  watch(currentDataset, (ds) => {
    if (ds) {
      localStorage.setItem(LAST_DATASET_KEY, ds.id)
    } else {
      localStorage.removeItem(LAST_DATASET_KEY)
    }
  })

  void hydrateDatasets()

  return {
    datasets,
    currentDataset,
    hydrated,
    hydrateDatasets,
    addDataset,
    setCurrentDataset,
  }
})
