import { openDB, type DBSchema } from 'idb'
import type { DataRow, Dataset } from '@/types/index'

const DB_NAME = 'data-platform'
const DB_VERSION = 2
const STORE_DATASETS = 'datasets' // 元数据（不含行数据）
const STORE_ROWS = 'rows'         // 行数据（每 500 行一个 chunk）
const ROWS_PER_CHUNK = 500

// ============================================================
// 数据库 Schema 定义
// ============================================================
interface DatasetMeta {
  id: string
  name: string
  columns: Dataset['columns']
  createAt: number
  rowCount: number
  columnCount: number
}

interface DataPlatformDB extends DBSchema {
  datasets: {
    key: string
    value: DatasetMeta
  }
  rows: {
    key: [string, number] // [datasetId, chunkIndex]
    value: DataRow[]
  }
}

let _dbPromise: ReturnType<typeof openDB<DataPlatformDB>> | null = null

function getDB() {
  if (!_dbPromise) {
    _dbPromise = openDB<DataPlatformDB>(DB_NAME, DB_VERSION, {
      // 当存储数据的形式发生改变，则一般要提升数据库版本，而已存入旧版本的数据无需迁到新版本中，只需将旧版本的存储形式也改变即可，所以在openDB的同时需要配合自定义的upgrade函数，以便修改旧版本的存储形式
      async upgrade(db, oldVersion, _newVersion, transaction) {
        // v1: datasets store
        if (oldVersion < 1) {
          db.createObjectStore(STORE_DATASETS, { keyPath: 'id' })
        }

        // v2: rows store + 迁移旧数据
        if (oldVersion < 2) {
          const rowsStore = db.createObjectStore(STORE_ROWS)

          // 读旧格式的 datasets（v1 把 rows 嵌在 Dataset 里）
          const oldStore = transaction.objectStore(STORE_DATASETS)
          const all = await oldStore.getAll()

          for (const record of all) {
            const ds = record as unknown as Dataset
            if (ds.rows && Array.isArray(ds.rows)) {
              const rows = ds.rows

              // 元数据（去掉 rows）
              const meta: DatasetMeta = {
                id: ds.id,
                name: ds.name,
                columns: ds.columns,
                createAt: ds.createAt,
                rowCount: ds.rowCount,
                columnCount: ds.columnCount,
              }
              await oldStore.put(meta)

              // 行数据分块写入 rows store
              for (let i = 0; i < rows.length; i += ROWS_PER_CHUNK) {
                const chunk = rows.slice(i, i + ROWS_PER_CHUNK)
                await rowsStore.put(chunk, [ds.id, Math.floor(i / ROWS_PER_CHUNK)])
              }
            }
          }
        }
      },
    })
  }
  return _dbPromise
}

// ============================================================
// API
// ============================================================

/** 获取全部数据集的元数据（不含行数据） */
export async function getAllDatasetsFromDB(): Promise<Dataset[]> {
  const db = await getDB()
  const metas = await db.getAll(STORE_DATASETS)
  // 补上 rows 空数组调用方无需感知存储变化
  return metas.map((m) => ({ ...m, rows: [] })) as unknown as Dataset[]
}

/** 获取单个数据集（含全部行数据 — 并行读取所有 chunk） */
export async function getDatasetFromDB(
  id: string
): Promise<Dataset | undefined> {
  const db = await getDB()
  const meta = await db.get(STORE_DATASETS, id)
  if (!meta) return undefined

  // 并行读取所有 chunk
  const chunkCount = Math.ceil(meta.rowCount / ROWS_PER_CHUNK)
  if (chunkCount === 0) {
    return { ...meta, rows: [] } as unknown as Dataset
  }

  const promises: Promise<DataRow[] | undefined>[] = []
  for (let c = 0; c < chunkCount; c++) {
    promises.push(db.get(STORE_ROWS, [id, c]))
  }
  const chunks = await Promise.all(promises)

  const rows = chunks
    .filter((chunk): chunk is DataRow[] => chunk !== undefined)
    .flat()

  return { ...meta, rows } as unknown as Dataset
}

/** 获取某个数据集的部分行（用于虚拟滚动按需加载） */
export async function getDatasetRowsFromDB(
  id: string,
  start: number,
  count: number
): Promise<DataRow[]> {
  if (count <= 0) return []

  const db = await getDB()

  // 计算涉及哪些 chunk
  const startChunk = Math.floor(start / ROWS_PER_CHUNK)
  const endChunk = Math.floor((start + count - 1) / ROWS_PER_CHUNK)

  // 并行读取涉及的 chunk
  const promises: Promise<DataRow[] | undefined>[] = []
  for (let c = startChunk; c <= endChunk; c++) {
    promises.push(db.get(STORE_ROWS, [id, c]))
  }
  const chunks = await Promise.all(promises)

  // 合并、切片到精确范围
  const merged = chunks
    .filter((chunk): chunk is DataRow[] => chunk !== undefined)
    .flat()
  const offset = start - startChunk * ROWS_PER_CHUNK
  return merged.slice(offset, offset + count)
}

/** 保存完整数据集（元数据 + 行数据分块存储） */
export async function upsertDatasetToDB(dataset: Dataset): Promise<void> {
  const db = await getDB()
  const tx = db.transaction([STORE_DATASETS, STORE_ROWS], 'readwrite')

  // 元数据（不含 rows）
  const meta: DatasetMeta = {
    id: dataset.id,
    name: dataset.name,
    columns: dataset.columns,
    createAt: dataset.createAt,
    rowCount: dataset.rowCount,
    columnCount: dataset.columnCount,
  }
  await tx.objectStore(STORE_DATASETS).put(meta)

  // 行数据分块写入
  for (let i = 0; i < dataset.rows.length; i += ROWS_PER_CHUNK) {
    const chunk = dataset.rows.slice(i, i + ROWS_PER_CHUNK)
    await tx.objectStore(STORE_ROWS).put(chunk, [
      dataset.id,
      Math.floor(i / ROWS_PER_CHUNK),
    ])
  }

  await tx.done
}

/** 删除数据集（元数据 + 所有行 chunk） */
export async function deleteDatasetFromDB(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction([STORE_DATASETS, STORE_ROWS], 'readwrite')

  await tx.objectStore(STORE_DATASETS).delete(id)

  // 删除该数据集的所有行 chunk
  const rowsStore = tx.objectStore(STORE_ROWS)
  const keys = await rowsStore.getAllKeys(
    IDBKeyRange.bound([id, 0], [id, Infinity])
  )
  for (const key of keys) {
    await rowsStore.delete(key)
  }

  await tx.done
}
