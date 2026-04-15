import { openDB, type DBSchema } from 'idb' // node_modules有
import type { Dataset } from '@/types/index'

// 1. 定义数据库元信息
const DB_NAME = 'data-platform' // 库名
const DB_VERSION = 1 // 版本号
const STORE_NAME = 'datasets' // 对象仓库名

// 2. 用 idb 的 openDB 打开数据库，并在 upgrade 阶段创建对象仓库
//#region
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
//#endregion

// 3. 提供 4 个最小能力函数
//#region
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
//#endregion
