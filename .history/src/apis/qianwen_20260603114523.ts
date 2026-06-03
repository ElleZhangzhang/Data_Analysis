import type { ColumnDef, DataRow, ChartTransform, ChartConfig } from '@/types/index'

type Recommendation = {
  type: 'bar' | 'line' | 'pie' | 'scatter'
  title: string
  xAxis: string
  yAxis: string
  reason: string
  transform?: ChartTransform
}

const CHART_TYPES = new Set(['bar', 'line', 'pie', 'scatter'])

// 确定ai推荐的x、y轴合法
function normalizeFieldName(field: string, columns: ColumnDef[]): string {
  const target = String(field || '').trim().toLowerCase()
  if (!target) return ''

  // 先按 keyName 匹配
  const byKey = columns.find(c => c.keyName.toLowerCase() === target)
  if (byKey) return byKey.keyName

  // 再按 label 匹配
  const byLabel = columns.find(c => c.label.toLowerCase() === target)
  if (byLabel) return byLabel.keyName

  return '' // 都找不到 → 这条推荐作废
}

function toNumber(value: unknown): number | null {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

// 深入计算数据关键点：唯一值、min、max，用于辅助分析和推荐
function getDataStats(columns: ColumnDef[], sampleData: DataRow[]) {
  return columns.map(col => {
    // 过滤null
    const values = sampleData.map(row => row[col.keyName]).filter(v => v != null)
    // 如果是数值字段，尝试转换成数字并计算min、max
    const numbers = values.map(v => toNumber(v)).filter((v): v is number => v !== null)
    // 去重，用于计算唯一值比例
    const uniqueCount = new Set(values.map(v => String(v))).size

    return {
      name: col.keyName,
      label: col.label,
      type: col.type,
      sampleValues: values.slice(0, 20), // 存疑
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
    // 1. 校验图表类型合法
    const type = String(rec?.type || '').toLowerCase()
    if (!CHART_TYPES.has(type)) continue

    // 2. 确保字段存在
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

function statsToText(columns: ColumnDef[], sampleData: DataRow[]): string {
  const stats = getDataStats(columns, sampleData)
  return stats.map(col => {
    const s = col.stats
    let line = `- ${col.label || col.name} (${col.type}): ${s.count}个值`
    if (s.uniqueCount > 0) line += `, 去重后${s.uniqueCount}个`
    if (s.min != null && s.max != null) line += `, 范围[${s.min}, ${s.max}]`
    return line
  }).join('\n')
}

export async function generateReport(
  datasetName: string,
  columns: ColumnDef[],
  sampleData: DataRow[],
  charts: ChartConfig[]
) {
  const dataDescription = statsToText(columns, sampleData)
  const chartList = charts.map((c, i) =>
    `- 图表"${c.title}"(c${i}): X轴=${c.xAxis}, Y轴=${c.yAxis}，类型=${c.type}`
  ).join('\n') || '（暂无图表）'

  const prompt = `你是专业数据分析报告撰写专家。根据以下数据集信息和图表，生成一份完整的数据分析报告。

## 数据集：${datasetName}

### 字段统计
${dataDescription}

### 已有图表
${chartList}

## 输出要求
1. 输出完整的 HTML 文档片段（不要\`\`\`html标记，不要<html><body>，直接输出内容）。
2. 报告结构必须包含：
   - <h1>报告标题</h1>
   - <h2>概述</h2> —— 一段总体分析
   - <h2>数据概况</h2> —— 描述数据量、字段构成等
   - <h2>可视化分析</h2> —— 逐一分析已有图表的洞察，用 <div data-chart-id="c0"></div>、<div data-chart-id="c1"></div> 等标记图表插入位置（使用上面已有图表中括号内的id），每个图表前加<h3>小节
   - <h2>核心发现</h2> —— <ul><li>发现1</li>...</ul>
   - <h2>建议</h2> —— <ul><li>建议1</li>...</ul>
3. 使用规范的 HTML 标签：<p>、<strong>、<ul>/<ol>、<li>、<table>（如需）、<br>。
4. 语言风格专业、严谨、中文。
5. 分析要有数据支撑，结合字段统计给出具体洞察。
6. 不要在图表 div 中写额外文字，空着就好。`

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
    });

    const data = await res.json()
    const content = data.choices[0].message.content as string
    const cleaned = content.replace(/```html|```/g, '').trim()
    return cleaned
  } catch (error) {
    console.error('AI 报告生成失败:', error)
    throw error
  }
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


