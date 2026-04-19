import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Dataset } from '@/types/index.ts'

import {
  getAllDatasetsFromDB,
  upsertDatasetToDB,
  // deleteDatasetFromDB
} from '@/utils/datasetDB'

// 定义每个数据集

// 等价于
// type row=Record<string,any>

export const useDataStore = defineStore('data', () => {
  // 定义存储多个数据集的数组
  const datasets = ref<Dataset[]>([])
  const currentDataset = ref<Dataset | null>(null)

  // IndexedDB之初始化回填
  //#region
  const hydrated = ref(false) // 是否已从 IndexedDB 完成初始化回填
  // 首次进入时从 IndexedDB 拉全量数据到 dataset
  async function hydrateDatasets() {
    if (hydrated.value) return
    datasets.value = await getAllDatasetsFromDB() // await发起异步任务，关心返回结果
    hydrated.value = true
  }
  //#endregion

  function addDataset(data: Dataset): boolean {
    datasets.value.push(data)
    void upsertDatasetToDB(data) // void发起异步任务，但不关心返回结果，避免 eslint 报错
    // 异步任务总得有个东西标识是异步任务，要么await，要么void，不能什么都没有，不然 eslint 会报错
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
  // 不再依赖 data store 的 persist localStorage，持久化职责转移给 IndexedDB
  // }, {
  //   persist: true
  //
})

// 定义数据库元信息：库名、版本号、对象仓库名（datasets）。
// 用 idb 的 openDB 打开数据库，并在 upgrade 阶段创建对象仓库。
// 提供 4 个最小能力函数：
// getAllDatasetsFromDB：一次性读取全部数据集。
// upsertDatasetToDB：新增或覆盖同 id 的数据集。
// getDatasetFromDB：按 id 读取单个数据集。
// deleteDatasetFromDB：按 id 删除。
