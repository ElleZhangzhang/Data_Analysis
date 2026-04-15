import type { ColumnDef, DataRow } from '@/types/index'
// TODO: 新增图表推荐函数
export async function recommendCharts(columns: ColumnDef[], sampleData: DataRow[]) {
  // 步骤1: 构建数据描述
  const dataDescription = columns.map(col => {
    // 从样本数据中提取这一列的值
    const values = sampleData.slice(0, 5).map(row => row[col.keyName])
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
        stream: true,
      }),
      // 注意是messages.value不是messages，一天在这里栽了两回
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder(); // 将二进制转为字符串

    const queue = [];
    let timer = null;

    function startTypewriter() {
      if (timer) return; // 已经在跑了就不重复开启
      timer = setInterval(() => {
        if (queue.length === 0) {
          clearInterval(timer);
          timer = null;
          return;
        }
        const char = queue.shift();
        messages.value[messages.value.length - 1].content += char;
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
      }, 30);
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        loading.value = false;
        break;
      }

      const text = decoder.decode(value);

      // 第一步：按换行分割，可能有多行
      const lines = text.split("\n");

      // 第二步：遍历每一行
      for (const line of lines) {
        // 第三步：跳过空行和 [DONE]
        if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;

        // 第四步：去掉 'data: ' 前缀，再 JSON.parse
        const json = JSON.parse(line.slice(6));

        // 第五步：取内容
        const text = json.choices?.[0]?.delta?.content;
        console.log(text);

        if (text) {
          queue.push(...text); // 把字符推进队列
          // 1. push(...'你好')
          // 2. queue.push('你', '好');  // 等价于下面这种写法
          // 3. queue.push('你');
          //    queue.push('好');

          startTypewriter(); // 启动打字机（已启动则忽略）
        }
      }
    }

    localStorage.setItem(
      "bb97507d-a94c-4aa5-be91-fd291ddd93d8",
      JSON.stringify({
        messages: messages.value,
        model: "qwen-turbo",
        stream: true,
      })
    );

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
