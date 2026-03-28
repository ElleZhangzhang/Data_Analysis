interface Dataset {
  id: string
  name: string
  rows: DataRow[]
  columns: ColumnDef[]
  create: Date
  rowCount: number
  columnCount: number
}
