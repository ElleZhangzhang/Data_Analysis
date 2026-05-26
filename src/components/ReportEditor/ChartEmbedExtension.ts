import { Node, mergeAttributes } from '@tiptap/core'
import type { HTMLAttributes } from 'vue'

export const ChartEmbedExtension = Node.create({
  name: 'chartEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      chartId: {
        default: null,
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
})
