import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { HTMLAttributes } from 'vue'
import ChartEmbedNodeView from './ChartEmbedNodeView.vue'

export const ChartEmbedExtension = Node.create({
  name: 'chartEmbed',   // 唯一标识符：给这个节点起个名字，后续调用都靠它。
  group: 'block',        // 块级元素
  atom: true,            // 原子节点——内容不可编辑，只能整体选中/ 删除
  draggable: true,       // 可以在编辑器里拖拽移动

  addAttributes() {
    return {
      chartId: {
        default: null,
        // 2. 内部parseHTML得出chartId='data-chart-id'的值
        parseHTML: (el: HTMLElement) => el.getAttribute('data-chart-id'),
        renderHTML: (attrs: Record<string, any>) => ({ 'data-chart-id': attrs.chartId }),
      },
      chartTitle: {
        default: '',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-chart-title') || '',
        renderHTML: (attrs: Record<string, any>) => ({ 'data-chart-title': attrs.chartTitle }),
      },
      chartType: {
        default: 'bar',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-chart-type') || 'bar',
        renderHTML: (attrs: Record<string, any>) => ({ 'data-chart-type': attrs.chartType }),
      },
    }
  },

  // 遇到什么样的 HTML 标签时，应该把它识别为 chartEmbed 节点：
  // 1. 外部parseHTML 匹配到 <div data-chart-id="123">
  parseHTML() {
    return [{ tag: 'div[data-chart-id]' }]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const chartTitle = HTMLAttributes['chartTitle'] as string || '图表'
    const chartType = HTMLAttributes['chartType'] as string || 'chart'
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'chart-embed-node' }),
      ['div', { class: 'chart-embed-placeholder' }, `📊 ${chartTitle} [${chartType}]`],
    ] as any
  },

  addNodeView() {
    // 每当 TipTap 在文档中遇到一个 chartEmbed类型的节点，不要自己渲染它，交给 ChartEmbedNodeView.vue 这个 Vue组件来渲染。
    return VueNodeViewRenderer(ChartEmbedNodeView)
  },
})
