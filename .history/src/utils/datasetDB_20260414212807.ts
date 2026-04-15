import { openDB, type DBSchema } from 'idb' // node_modules有
import type { Dataset } from '@/types/index'

const DB_NAME = 'data-platform'
const DB_VERSION = 1
const STORE_NAME = 'datasets'

interface DataPlatformDB extends DBSchema {
  datasets: {
    key: string
    value: Dataset
  }
}

const dbPromise = openDB<DataPlatformDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
  }
})

// 一次性读取全部数据集
export async function getAllDatasetsFromDB(): Promise<Dataset[]> {
  const db = await dbPromise
  return db.getAll(STORE_NAME)
}
// 按 id 读取单个数据集
export async function getDatasetFromDB(id: string): Promise<Dataset | undefined> {
  const db = await dbPromise
  return db.get(STORE_NAME, id)
}
// 新增或覆盖同 id 的数据集
export async function upsertDatasetToDB(dataset: Dataset): Promise<void> {
  const db = await dbPromise
  await db.put(STORE_NAME, dataset)
}

// export async function deleteDatasetFromDB(id: string): Promise<void> {
//   const db = await dbPromise
//   await db.delete(STORE_NAME, id)
// }
