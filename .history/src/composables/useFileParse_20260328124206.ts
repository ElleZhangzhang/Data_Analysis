import * as XLSX from 'xlsx'

import { DataRow, ColumnDef, Dataset } from '@/types/index'

export function useFileParser() {
  const parseFile = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
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
        const rows: Record<string, any> = jsonData.map((row, index) => ({
          id: `row-${index}`,
          ...(row as Record<string, any>)
        }))


        //#endregion

        resolve(jsonData)
      }

      reader.onerror = () => {
        reject(new Error('文件读取失败'))
      }

      // 读成二进制字符串
      reader.readAsBinaryString(file)
      // 如果需要处理超大文件，考虑用分块读取或 Web Worker
    })
  }

  return { parseFile }
}
