import type { Dataset } from '@/types/index'
import { useDataStore } from '@/stores/data'

type WorkerOutMessage =
  | { ok: true; dataset: Dataset }
  | { ok: false; message: string }

export function useFileParser() {
  const dataStore = useDataStore()

  const parseFile = async (file: File): Promise<Dataset> => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL('@/workers/excel-parser.worker.ts', import.meta.url),
        { type: 'module' }
      )

      const cleanup = () => {
        worker.onmessage = null
        worker.onerror = null
        worker.terminate()
      }

      worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
        const payload = event.data

        if (!payload.ok) {
          cleanup()
          reject(new Error(payload.message || '文件解析失败'))
          return
        }

        dataStore.addDataset(payload.dataset)
        cleanup()
        resolve(payload.dataset)
      }

      worker.onerror = () => {
        cleanup()
        reject(new Error('Worker 解析失败'))
      }

      worker.postMessage({ file })
    })
  }

  return { parseFile }
}
