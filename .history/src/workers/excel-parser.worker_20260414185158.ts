import * as XLSX from 'xlsx'
import type { DataRow, ColumnDef, Dataset } from '@/types/index'

type WorkerInMessage = {
  file: File
}

type WorkerOutMessage =
  | { ok: true; dataset: Dataset }
  | { ok: false; message: string }

function inferColumnType(key: string, data: Record<string, any>[]): ColumnDef['type'] {
  const sampleSize = Math.min(100, data.length)
  const values = data.slice(0, sampleSize).map((row) => row[key])
  const nonNull = values.filter((v) => v != null && v !== '')

  if (nonNull.length === 0) return 'string'

  const isNumber = nonNull.every((v) => typeof v === 'number' || !isNaN(Number(v)))
  if (isNumber) return 'number'

  const isDate = nonNull.every((v) => !isNaN(Date.parse(String(v))))
  if (isDate) return 'date'

  return 'string'
}

self.onmessage = async (event: MessageEvent<WorkerInMessage>) => {
  try {
    const { file } = event.data

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })

    if (!workbook.SheetNames.length) {
      throw new Error('Excel 文件中没有可用工作表')
    }

    const firstSheetName = workbook.SheetNames[0] as string
    const worksheet = workbook.Sheets[firstSheetName]

    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: null
    })

    const rows: DataRow[] = jsonData.map((row, index) => ({
      id: [row - ${ index }](http://_vscodecontentref_/1),
        ...row
    }))

    const firstRow = jsonData[0] || {}
    const columnKeys = Object.keys(firstRow)

    const columns: ColumnDef[] = columnKeys.map((column) => ({
      keyName: column,
      label: column,
      type: inferColumnType(column, jsonData),
      width: 150
    }))

    const dataset: Dataset = {
      id: [dataset - ${ Date.now() }](http://_vscodecontentref_/2),
        name: file.name,
        rows,
        columns,
        createAt: Date.now(),
        rowCount: rows.length,
        columnCount: columns.length
    }

    const out: WorkerOutMessage = { ok: true, dataset }
    self.postMessage(out)
  } catch (error) {
    const out: WorkerOutMessage = {
      ok: false,
      message: error instanceof Error ? error.message : '文件解析失败'
    }
    self.postMessage(out)
  }
}
