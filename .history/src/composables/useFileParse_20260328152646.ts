import * as XLSX from 'xlsx'

import type { DataRow, ColumnDef, Dataset } from '@/types/index'

export function useFileParser() {
  const parseFile = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const binaryData = e.target?.result as string// 拿到二进制数据

          // 将二进制数据转换为XLSX对象
          //#region
          // 1. 读取 workbook（整个 Excel 文件）
          const workbook = XLSX.read(binaryData, { type: 'binary' })
          console.log(workbook);

          // 2. 拿到所有 sheet 名称
          const sheetNames = workbook.SheetNames // ['Sheet1', 'Sheet2', ...]

          // 3. 拿到第一个 sheet
          const firstSheetName = sheetNames[0] as string
          const worksheet: unknown = workbook.Sheets[firstSheetName]

          // 4. 转成 JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          //#endregion

          // 构造数据集
          //#region
          const rows: DataRow[] = jsonData.map((row, index) => ({
            id: `row-${index}`,
            ...(row as Record<string, any>)
          }))

          const firstRow = jsonData[0] as object

          // 推导类型：只看前 100 行，判断这一列是数字、日期还是字符串
          //#region
          const inferColumnType = (key: string, data: any[]): ColumnDef['type'] => {
            // 1. 拿到这一列的所有值（取前 100 行做样本）
            const sampleSize = Math.min(100, data.length)
            const values = data.slice(0, sampleSize).map(row => row[key])

            // 2. 过滤掉 null/undefined
            const nonNull = values.filter(v => v != null)

            if (nonNull.length === 0) return 'string'

            // 3. 判断是不是数字
            const isNumber = nonNull.every(v =>
              typeof v === 'number' || !isNaN(Number(v))
            )
            if (isNumber) return 'number'

            // 4. 判断是不是日期
            const isDate = nonNull.every(v =>
              !isNaN(Date.parse(String(v)))
            )
            if (isDate) return 'date'

            // 5. 默认字符串
            return 'string'
          }
          //#endregion

          let columnKeys = Object.keys(firstRow)
          const columns: ColumnDef[] = columnKeys.map(column => ({
            keyName: column,
            label: column,
            type: inferColumnType(column, jsonData),
            width: 150
          }))

          const dataset: Dataset = {
            id: `dataset-${Date.now()}`,
            name: 'test.xlsx',
            rows,
            columns,
            create: Date.now(),
            rowCount: rows.length,
            columnCount: columns.length,
          }
          //#endregion

          resolve(dataset)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('文件读取失败'))

      // 读成二进制字符串
      reader.readAsBinaryString(file)
      // 如果需要处理超大文件，考虑用分块读取或 Web Worker
    })
  }

  return { parseFile }
}
