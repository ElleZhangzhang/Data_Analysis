interface DataRow {
  id: string
  [key: string]: any
}

interface ColumnDef {
  keyName: string
  label: string
  type: any
  width: number
}

interface Dataset {
  id: string
  name: string
  rows: DataRow[]
  columns: ColumnDef[]
  create: string
  rowCount: number
  columnCount: number
}

export type { DataRow, ColumnDef, Dataset }
