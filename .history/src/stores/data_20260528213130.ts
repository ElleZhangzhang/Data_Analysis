import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Dataset } from '@/types/index.ts'

import {
  getAllDatasetsFromDB,
  getDatasetFromDB,
  upsertDatasetToDB,
  // deleteDatasetFromDB
} from '@/utils/datasetDB'

const LAST_DATASET_KEY = 'lastDatasetId'

// 定义每个数据集

// 等价于
// type row=Record<string,any>

export const useDataStore = defineStore('data', () => {
  // 定义存储多个数据集的数组（仅元数据，不含 rows）
  const datasets = ref<Dataset[]>([])
  const currentDataset = ref<Dataset | null>(null)

  // IndexedDB之初始化回填
  //#region
  const hydrated = ref(false) // 是否已从 IndexedDB 完成初始化回填
  // 首次进入时从 IndexedDB 拉全量数据到 dataset
  async function hydrateDatasets() {
    if (hydrated.value) return
    const all = await getAllDatasetsFromDB()
    // 仅存储元数据（不含行数据），选中数据集时才按需加载
    datasets.value = all.map(d => ({ ...d, rows: [] }))
    hydrated.value = true

    // 回填完成后，尝试恢复上次使用的数据集
    const lastId = localStorage.getItem(LAST_DATASET_KEY)
    if (lastId) {
      const found = datasets.value.find(d => d.id === lastId)
      if (found) {
        await loadDatasetRows(lastId)
      }
    }
  }
  //#endregion

  // 双写入模式，平衡IndexedDB和Pinia
  function addDataset(data: Dataset): boolean {
    // 完整数据写入 IndexedDB
    void upsertDatasetToDB(data)
    // 内存仅存元数据
    datasets.value.push({ ...data, rows: [] })
    return true
  }

  // 异步按需加载某数据集的完整行数据
  async function loadDatasetRows(id: string) {
    const full = await getDatasetFromDB(id)
    if (full && currentDataset.value?.id === id) {
      currentDataset.value = full
    }
  }

  function setCurrentDataset(id: string) {
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

  // 初始化时需要一个 hydrate 过程（就是初始化时读取存储）
  void hydrateDatasets()

  return {
    datasets,
    currentDataset,
    hydrateDatasets,
    addDataset,
    setCurrentDataset,
    // removeDataset,
  }
  // 不再依赖 data store 的 persist localStorage，持久化职责转移给 IndexedDB
  // }, {
  //   persist: true
  //
})
