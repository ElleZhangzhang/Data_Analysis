import type { ColumnDef, DataRow } from '@/types'
// TODO: 新增图表推荐函数
export async function recommendCharts(columns: ColumnDef[], sampleData: DataRow[]) {
  // 步骤1: 构建数据描述
  const dataDescription = columns.map(col => {
    // 从样本数据中提取这一列的值
    const values = sampleData.slice(0, 5).map(row => row[col.key])
    return {
      name: col.label,
      type: col.type,
      samples: values
    }
  })

  // 步骤2: 构建 Prompt
  const prompt = `你是一个数据可视化专家。请根据以下数据列信息，推荐 3 种最合适的图表类型。

数据列信息：
${JSON.stringify(dataDescription, null, 2)}

要求：
1. 推荐 3 种不同的图表（从柱状图、折线图、饼图中选择）
2. 每个推荐要包含：图表类型、X轴列、Y轴列、推荐理由
3. 只返回 JSON 格式，不要任何其他文字

返回格式示例：
{
  "recommendations": [
    {
      "type": "bar",
      "title": "员工工资对比",
      "xAxis": "name",
      "yAxis": "salary",
      "reason": "适合对比不同员工的工资差异"
    }
  ]
}`

  // 步骤3: 调用 API
  try {
    const response = await callQianwen({
      model: 'qwen-plus',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    // 步骤4: 解析返回的 JSON
    // 提示：AI 返回可能包含 ```json 标记，需要清理
    const cleanedResponse = response.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanedResponse)

    return result.recommendations
  } catch (error) {
    console.error('AI 推荐失败:', error)
    throw error
  }
}
