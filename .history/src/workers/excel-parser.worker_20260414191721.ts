import * as XLSX from 'xlsx'
import type { DataRow, ColumnDef, Dataset } from '@/types/index'

type WorkerInMessage = {
  file: File
}

type WorkerOutMessage =
  | { ok: true; dataset: Dataset }
  | { ok: false; message: string }

const inferColumnType = (key: string, data: any[]): ColumnDef['type'] => {
  const sampleSize = Math.min(100, data.length)
  const values = data.slice(0, sampleSize).map(row => row[key])
  const nonNull = values.filter(v => v != null)

  if (nonNull.length === 0) return 'string'

  const isNumber = nonNull.every(v =>
    typeof v === 'number' || !isNaN(Number(v))
  )
  if (isNumber) return 'number'

  const isDate = nonNull.every(v =>
    !isNaN(Date.parse(String(v)))
  )
  if (isDate) return 'date'

  return 'string'
}

// Web Worker入口：主线程一发消息，这里就开始执行解析流程
self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  try {
    const { file } = event.data

    const reader = new FileReaderSync()
    const binaryData = reader.readAsBinaryString(file)

    const workbook = XLSX.read(binaryData, { type: 'binary' })
    const sheetNames = workbook.SheetNames
    const firstSheetName = sheetNames[0] as string
    const worksheet: unknown = workbook.Sheets[firstSheetName]

    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    const rows: DataRow[] = jsonData.map((row, index) => ({
      id: `row-${index}`,
      ...(row as Record<string, any>)
    }))

    const firstRow = jsonData[0] as object
    const columnKeys = Object.keys(firstRow)

    const columns: ColumnDef[] = columnKeys.map(column => ({
      keyName: column,
      label: column,
      type: inferColumnType(column, jsonData),
      width: 150
    }))

    const dataset: Dataset = {
      id: `dataset-${Date.now()}`,
      name: file.name,
      rows,
      columns,
      createAt: Date.now(),
      rowCount: rows.length,
      columnCount: columns.length,
    }

    const payload: WorkerOutMessage = { ok: true, dataset }
    self.postMessage(payload)
  } catch (error) {
    const payload: WorkerOutMessage = {
      ok: false,
      message: error instanceof Error ? error.message : '文件解析失败'
    }
    self.postMessage(payload)
  }
}

export { }
