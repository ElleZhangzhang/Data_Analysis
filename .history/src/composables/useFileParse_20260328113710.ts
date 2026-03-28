export function useFileParser() {
  const parseFile = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const data = e.target?.result  // 拿到二进制数据
        console.log('文件数据:', data)  // 先打印看看
        resolve(data)
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
