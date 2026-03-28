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
  create: Date
  rowCount: number
  columnCount: number
}
