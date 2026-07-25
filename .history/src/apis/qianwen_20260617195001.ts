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

// 用户友好的 API 错误信息
export function getUserFriendlyMessage(error: unknown): string {
  const msg = (error as Error)?.message || String(error)
  if (msg.includes('401')) return 'API 凭证无效或已过期，请联系管理员'
  if (msg.includes('403')) return 'API 凭证无权限，请联系管理员'
  if (msg.includes('429')) return '请求太频繁，请稍后重试'
  if (/余额|quota|insufficient|exceed|超过/.test(msg)) return 'AI 服务账户余额不足，请充值后使用'
  if (/fetch|NetworkError|network|Failed to fetch/.test(msg)) return '网络连接异常，请检查网络'
  if (/timeout|timed ?out/.test(msg)) return '请求超时，请重试'
  if (/model.*not|not.*model|model.*found/.test(msg)) return 'AI 模型暂不可用'
  const clean = msg.replace(/^Error:\s*/i, '').trim()
  return clean.length > 50 ? 'AI 服务暂不可用，请稍后重试' : clean
}

// 带指数退避的 fetch 重试（支持重试进度回调）
async function requestWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  onRetry?: (attempt: number, max: number) => void
): Promise<Response> {
  for (let i = 0; ; i++) {
    try {
      // 1.
      // (1) 成功 → 直接返回
      const res = await fetch(url, options)
      if (res.ok) return res

      // (2) 429/5xx → 重试，指数退避
      if ((res.status === 429 || res.status >= 500) && i < maxRetries) {
        const delay = Math.min(1000 * 2 ** i, 8000)

        // 2.
        // (1) 通知UI正在尝试重试
        onRetry?.(i + 1, maxRetries)
        console.warn(`API ${res.status}，第${i + 1}次重试，等待${delay}ms...`)

        // (2) 让代码停 delay ms
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      // 非可重试错误 → 读 body 抛异常，让调用方看到具体错误信息
      const body = await res.text()
      throw new Error(`API ${res.status}: ${body.slice(0, 200)}`)
    } catch (err) {
      if (i < maxRetries) {
        const delay = Math.min(1000 * 2 ** i, 8000)
        onRetry?.(i + 1, maxRetries)
        console.warn(`网络错误，第${i + 1}次重试，等待${delay}ms...`, err)
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      throw err
    }
  }
}

// #region AI推荐相关函数
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

    // 2. 确保字段存在，以能否找到对应的 keyName 为准
    const xAxis = normalizeFieldName(rec?.xAxis, columns)
    const yAxis = normalizeFieldName(rec?.yAxis, columns)
    if (!xAxis || !yAxis) continue

    // 3. 去重：同type x y组合的话，只保留一条
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

// 兜底规则推荐（AI 失败时使用）
export function fallbackRecommendCharts(columns: ColumnDef[], sampleData: DataRow[]): Recommendation[] {
  const stats = getDataStats(columns, sampleData)
  const result: Recommendation[] = []

  const numericFields = stats.filter(s => s.type === 'number' && s.stats.uniqueRatio > 0.01)
  const categoryFields = stats.filter(s => s.stats.uniqueRatio <= 0.05 && s.stats.uniqueCount >= 2 && s.stats.uniqueCount <= 20)

  // 规则1：前两个数值字段 → 散点图
  if (numericFields.length >= 2) {
    const a = numericFields[0]!
    const b = numericFields[1]!
    result.push({
      type: 'scatter',
      title: `${a.label} 与 ${b.label} 关系`,
      xAxis: a.name,
      yAxis: b.name,
      reason: '两个数值字段，适合观察相关性和离群点'
    })
  }

  // 规则2：单个数值字段 → 分箱柱状图
  if (numericFields.length >= 1) {
    const f = numericFields[0]!
    result.push({
      type: 'bar',
      title: `${f.label} 区间分布`,
      xAxis: f.name,
      yAxis: f.name,
      reason: `对${f.label}做分箱统计可观察集中区间`,
      transform: { binning: { field: f.name, binCount: 8 } }
    })
  }

  // 规则3：类别字段 + 数值字段 → 分类柱状图
  if (categoryFields.length >= 1 && numericFields.length >= 1) {
    const cat = categoryFields[0]!
    const num = numericFields[0]!
    result.push({
      type: 'bar',
      title: `各${cat.label}的${num.label}对比`,
      xAxis: cat.name,
      yAxis: num.name,
      reason: `对比不同${cat.label}的${num.label}分布`
    })
  }

  // 规则4：少类别字段 + 数值 → 饼图
  if (categoryFields.length >= 1 && categoryFields[0]!.stats.uniqueCount <= 8) {
    const cat = categoryFields[0]!
    const num = numericFields.length >= 1 ? numericFields[0]! : stats.find(s => s.type === 'number')
    if (num) {
      result.push({
        type: 'pie',
        title: `${cat.label} 占比`,
        xAxis: cat.name,
        yAxis: num.name,
        reason: `${cat.label}类别较少，适合用饼图展示占比`
      })
    }
  }

  return result.slice(0, 3)
}

// 图表推荐（支持重试进度回调）
export async function recommendCharts(
  columns: ColumnDef[],
  sampleData: DataRow[],
  onRetry?: (attempt: number, max: number) => void
) {
  const dataDescription = getDataStats(columns, sampleData)

  // 步骤2: 构建 Prompt
  const prompt = `你是高级数据分析师和可视化专家。请根据字段语义与样本统计，输出可执行的图表推荐。

数据列信息：
${JSON.stringify(dataDescription, null, 2)}

要求：
1. 输出 3 条推荐，图表类型只能是 bar、line、pie、scatter。
2. 每条都必须给出：type、title、xAxis、yAxis、reason。
3. xAxis、yAxis 必须来自已有字段名。
4. 唯一率接近0的，适合用 pie ；唯一率接近1且都是数值的，适合用 scatter 来分析关系，或用bar展示统计区间分，或用line展示数据变化。
4. 如果适合做“数值关系分析”图表，如年龄-工资，那么优先 scatter。
5. 如果适合做区间分布，如“工资区间有多少人”这样的分析，至少一条加入 transform.binning：
   { "field": "某数值字段", "binCount": 8 }
6. 注意饼图仅用于少类别占比场景，防止灾难饼图。
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
    const res = await requestWithRetry("/api/compatible-mode/v1/chat/completions", {
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
    }, onRetry);

    // 步骤4: 解析返回的 JSON
    // 提示：AI 返回可能包含 ```json 标记，需要清理
    const data = await res.json()  // 先把 Response 转成 JSON

    const content = data.choices[0].message.content  // ✅ 再取出 AI 的文本
    const cleanedResponse = content.replace(/```json|```/g, '').trim()

    const result = JSON.parse(cleanedResponse)
    return validateRecommendations(result.recommendations, columns)
  } catch (error) {
    console.error('AI 推荐失败:', error)
    throw error
  }
}
// #endregion

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
  charts: ChartConfig[],
  onRetry?: (attempt: number, max: number) => void
) {

  // 1. 数据准备 --后续放到prompt内
  const dataDescription = statsToText(columns, sampleData) ////
  const chartList = charts.map((c, i) =>
    `- 图表"${c.title}"(c${i}): X轴=${c.xAxis}, Y轴=${c.yAxis}，类型=${c.type}`
  ).join('\n') || '（暂无图表）'
  // - 图表"年龄与工资关系"(c0): X轴=age, Y轴=salary，类型=scatter
  // - 图表"工资分布"(c1): X轴=salary, Y轴=salary，类型=bar



  // 2. 构建prompt
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
    const res = await requestWithRetry("/api/compatible-mode/v1/chat/completions", {
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
    }, onRetry);

    const data = await res.json()
    const content = data.choices[0].message.content as string
    const cleaned = content.replace(/```html|```/g, '').trim()
    return cleaned
  } catch (error) {
    console.error('AI 报告生成失败:', error)
    throw error
  }
}
