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
  createAt: number
  rowCount: number
  columnCount: number
}

// 图表配置类型
export interface ChartConfig {
  id: string
  datasetId: string      // 属于哪个数据集
  type: 'line' | 'bar' | 'pie' | 'scatter'
  title: string
  xAxis: string          // X 轴对应的列 key
  yAxis: string          // Y 轴对应的列 key
  createdAt: number

  position?: {
    x: number
    y: number
  }
  size?: {
    width: number
    height: number
  }
}

export type { DataRow, ColumnDef, Dataset, ChartConfig }
