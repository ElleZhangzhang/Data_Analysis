import type { ColumnDef, DataRow, ChartTransform } from '@/types/index'

type Recommendation = {
  type: 'bar' | 'line' | 'pie' | 'scatter'
  title: string
  xAxis: string
  yAxis: string
  reason: string
  transform?: ChartTransform
}

const CHART_TYPES = new Set(['bar', 'line', 'pie', 'scatter'])

function normalizeFieldName(field: string, columns: ColumnDef[]): string {
  const target = String(field || '').trim().toLowerCase()
  if (!target) return ''

  const byKey = columns.find(c => c.keyName.toLowerCase() === target)
  if (byKey) return byKey.keyName

  const byLabel = columns.find(c => c.label.toLowerCase() === target)
  if (byLabel) return byLabel.keyName

  return ''
}

function toNumber(value: unknown): number | null {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function getDataStats(columns: ColumnDef[], sampleData: DataRow[]) {
  return columns.map(col => {
    const values = sampleData.map(row => row[col.keyName]).filter(v => v != null)
    const numbers = values.map(v => toNumber(v)).filter((v): v is number => v !== null)
    const uniqueCount = new Set(values.map(v => String(v))).size

    return {
      name: col.keyName,
      label: col.label,
      type: col.type,
      sampleValues: values.slice(0, 20),
      stats: {
        count: values.length,
        uniqueCount,
        uniqueRatio: values.length ? Number((uniqueCount / values.length).toFixed(3)) : 0,
        min: numbers.length ? Math.min(...numbers) : null,
        max: numbers.length ? Math.max(...numbers) : null
      }
    }
  })
}

function validateRecommendations(
  recommendations: any[],
  columns: ColumnDef[]
): Recommendation[] {
  const dedup = new Set<string>()
  const valid: Recommendation[] = []

  for (const rec of recommendations || []) {
    const type = String(rec?.type || '').toLowerCase()
    if (!CHART_TYPES.has(type)) continue

    const xAxis = normalizeFieldName(rec?.xAxis, columns)
    const yAxis = normalizeFieldName(rec?.yAxis, columns)
    if (!xAxis || !yAxis) continue

    const dedupKey = `${type}:${xAxis}:${yAxis}`
    if (dedup.has(dedupKey)) continue
    dedup.add(dedupKey)

    const normalized: Recommendation = {
      type: type as Recommendation['type'],
      title: String(rec?.title || `${xAxis} 与 ${yAxis}分析`),
      xAxis,
      yAxis,
      reason: String(rec?.reason || '根据字段语义与样本分布推荐')
    }

    const rawBinningField = rec?.transform?.binning?.field
    const normalizedBinField = normalizeFieldName(rawBinningField, columns)
    if (normalizedBinField) {
      const rawBinCount = Number(rec?.transform?.binning?.binCount)
      normalized.transform = {
        binning: {
          field: normalizedBinField,
          binCount: Number.isFinite(rawBinCount)
            ? Math.max(3, Math.min(20, Math.floor(rawBinCount)))
            : 8
        }
      }
    }

    valid.push(normalized)
  }

  return valid.slice(0, 3)
}

// TODO: 新增图表推荐函数
export async function recommendCharts(columns: ColumnDef[], sampleData: DataRow[]) {
  const dataDescription = getDataStats(columns, sampleData)

  // 步骤2: 构建 Prompt
  const prompt = `你是高级数据分析师和可视化专家。请根据字段语义与样本统计，输出可执行的图表推荐。

数据列信息：
${JSON.stringify(dataDescription, null, 2)}

要求：
1. 输出 3 条推荐，图表类型只能是 bar、line、pie、scatter。
2. 每条都必须给出：type、title、xAxis、yAxis、reason。
3. xAxis、yAxis 必须来自已有字段名。
4. 至少一条是“数值关系分析”（如年龄-工资，优先 scatter）。
5. 如果适合做区间分布，至少一条加入 transform.binning：
   { "field": "某数值字段", "binCount": 8 }
   这用于“工资区间有多少人”这种分析。
6. 饼图仅用于少类别占比场景。
7. 只返回 JSON，不要 markdown，不要其他文字。

返回格式示例：
{
  "recommendations": [
    {
      "type": "scatter",
      "title": "年龄与工资关系",
      "xAxis": "age",
      "yAxis": "salary",
      "reason": "年龄与工资都是数值字段，适合观察相关性和离群点"
    },
    {
      "type": "bar",
      "title": "工资区间人数分布",
      "xAxis": "salary",
      "yAxis": "salary",
      "reason": "对工资做分箱统计可观察集中区间",
      "transform": {
        "binning": {
          "field": "salary",
          "binCount": 8
        }
      }
    }
  ]
}`

  // 步骤3: 调用 API
  try {
    const res = await fetch("/api/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: "qwen-turbo",
        stream: false,
      }),
      // 注意是messages.value不是messages，一天在这里栽了两回
    });

    // 步骤4: 解析返回的 JSON
    // 提示：AI 返回可能包含 ```json 标记，需要清理
    const data = await res.json()  // ✅ 先把 Response 转成 JSON
    console.log('data: ', data);

    const content = data.choices[0].message.content  // ✅ 再取出 AI 的文本
    const cleanedResponse = content.replace(/```json|```/g, '').trim()

    const result = JSON.parse(cleanedResponse)
    return validateRecommendations(result.recommendations, columns)
  } catch (error) {
    console.error('AI 推荐失败:', error)
    throw error
  }
}


