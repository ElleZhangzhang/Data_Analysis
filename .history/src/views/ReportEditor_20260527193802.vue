<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useDataStore } from '@/stores/data'
import { useDashboardStore } from '@/stores/dashboard'
import { generateReport } from '@/apis/qianwen'
import { ChartEmbedExtension } from '@/components/ReportEditor/ChartEmbedExtension'
import type { ChartConfig } from '@/types'

const router = useRouter()
const dataStore = useDataStore()
const dashboardStore = useDashboardStore()

const loading = ref(false)
const error = ref('')
const exporting = ref(false)

const currentDataset = computed(() => dataStore.currentDataset)
const charts = computed(() => {
  if (!currentDataset.value) return []
  return dashboardStore.getChartsByDataset(currentDataset.value.id)
})

// TipTap Editor
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Placeholder.configure({
      placeholder: '在此编辑分析报告内容...',
    }),
    Table,
    TableRow,
    TableCell,
    TableHeader,
    ChartEmbedExtension,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none',
    },
  },
})

// Generate AI report
async function handleGenerateReport() {
  if (!currentDataset.value) {
    error.value = '请先选择一个数据集'
    return
  }

  loading.value = true
  error.value = ''

  try {
    let html = await generateReport(
      currentDataset.value.name,
      currentDataset.value.columns,
      currentDataset.value.rows.slice(0, 100),
      charts.value
    )

    // 将 AI 返回的 data-chart-id="c0" / "c1" 等替换为实际的 chart UUID
    charts.value.forEach((chart, index) => {
      const pattern = new RegExp(`data-chart-id="c${index}"`, 'g')
      html = html.replace(pattern, `data-chart-id="${chart.id}" data-chart-title="${chart.title}" data-chart-type="${chart.type}"`)
    })

    editor.value?.commands.setContent(html)
    // Save after generation
    if (editor.value && currentDataset.value) {
      dashboardStore.saveReportContent(currentDataset.value.id, editor.value.getJSON())
    }
  } catch (e) {
    error.value = 'AI 报告生成失败，请重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Insert a chart embed at cursor
function insertChart(chart: ChartConfig) {
  if (!editor.value) return
  editor.value.chain().focus().insertContent({
    type: 'chartEmbed',
    attrs: {
      chartId: chart.id,
      chartTitle: chart.title,
      chartType: chart.type,
    },
  }).run()
}

// Navigate back
function goBack() {
  router.push('/')
}

// Auto-save editor content with debounce
let saveTimer: ReturnType<typeof setTimeout> | null = null

function setupAutoSave() {
  if (!editor.value) return
  editor.value.on('update', () => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      if (editor.value && currentDataset.value) {
        dashboardStore.saveReportContent(currentDataset.value.id, editor.value.getJSON())
      }
    }, 2000)
  })
}

onMounted(() => {
  if (!currentDataset.value) {
    error.value = '未选择数据集，请先返回选择数据集'
    return
  }

  // Check if saved content exists for this dataset
  const saved = dashboardStore.getReportContent(currentDataset.value.id)
  if (saved) {
    // Restore saved content instead of re-generating
    nextTick(() => {
      if (editor.value) {
        editor.value.commands.setContent(saved.content)
      }
    })
  } else {
    handleGenerateReport()
  }

  // Set up auto-save after editor is ready
  nextTick(() => setupAutoSave())
})

onUnmounted(() => {
  if (saveTimer) clearTimeout(saveTimer)
})

// Chart type icon
function chartIcon(type: string) {
  const map: Record<string, string> = {
    bar: '📊',
    line: '📈',
    pie: '🥧',
    scatter: '🔵',
  }
  return map[type] || '📊'
}

// Export PDF
async function exportPDF() {
  const proseMirror = document.querySelector('.ProseMirror') as HTMLElement | null
  if (!proseMirror || !currentDataset.value) return

  exporting.value = true

  try {
    const { default: html2canvas } = await import('html2canvas')
    const { jsPDF } = await import('jspdf')

    const canvas = await html2canvas(proseMirror, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = 210
    const pdfHeight = 297
    const imgWidth = pdfWidth - 16 // 8mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Center image horizontally with 8mm left margin
    const xOffset = 8
    pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position -= pdfHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    pdf.save(`${currentDataset.value.name}_分析报告.pdf`)
  } catch (e) {
    console.error('PDF 导出失败', e)
    error.value = 'PDF 导出失败，请重试'
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="report-editor">
    <!-- Header -->
    <header class="editor-header">
      <button class="btn-back" @click="goBack">← 返回</button>
      <h2 class="report-title">
        {{ currentDataset?.name || '数据分析报告' }}
      </h2>
      <div class="header-actions">
        <button
          class="btn btn-primary"
          :disabled="loading"
          @click="handleGenerateReport"
        >
          {{ loading ? '⏳ 生成中...' : '🔄 重新生成' }}
        </button>
        <button class="btn btn-export" :disabled="exporting" @click="exportPDF">
          {{ exporting ? '⏳ 导出中...' : '📄 导出 PDF' }}
        </button>
      </div>
    </header>

    <!-- Error banner -->
    <div v-if="error" class="error-banner">
      {{ error }}
      <button v-if="currentDataset" class="retry-link" @click="handleGenerateReport">重试</button>
    </div>

    <!-- Main layout -->
    <div class="editor-layout">
      <!-- Left sidebar: chart list -->
      <aside class="chart-sidebar">
        <h3>📊 图表列表</h3>
        <p class="sidebar-hint">点击图表插入到报告</p>

        <div
          v-for="chart in charts"
          :key="chart.id"
          class="chart-card"
          @click="insertChart(chart)"
        >
          <span class="chart-icon">{{ chartIcon(chart.type) }}</span>
          <div class="chart-info">
            <div class="chart-card-title">{{ chart.title }}</div>
            <div class="chart-card-meta">{{ chart.xAxis }} × {{ chart.yAxis }}</div>
          </div>
        </div>

        <div v-if="charts.length === 0" class="empty-charts">
          <p>暂无图表</p>
          <p class="sub">请先返回创建可视化图表</p>
        </div>
      </aside>

      <!-- Editor area -->
      <main class="editor-main">
        <!-- Toolbar -->
        <div v-if="editor" class="editor-toolbar">
          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()"
            title="加粗"
          >
            <strong>B</strong>
          </button>
          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
            title="斜体"
          >
            <em>I</em>
          </button>
          <span class="toolbar-divider"></span>

          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            title="标题1"
          >
            H1
          </button>
          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            title="标题2"
          >
            H2
          </button>
          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('heading', { level: 3 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            title="标题3"
          >
            H3
          </button>
          <span class="toolbar-divider"></span>

          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()"
            title="无序列表"
          >
            ≡
          </button>
          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('orderedList') }"
            @click="editor.chain().focus().toggleOrderedList().run()"
            title="有序列表"
          >
            1.
          </button>
          <span class="toolbar-divider"></span>

          <button
            class="toolbar-btn"
            :class="{ active: editor.isActive('blockquote') }"
            @click="editor.chain().focus().toggleBlockquote().run()"
            title="引用"
          >
            ❝
          </button>
          <button
            class="toolbar-btn"
            @click="editor.chain().focus().setHorizontalRule().run()"
            title="分割线"
          >
            —
          </button>
          <span class="toolbar-divider"></span>

          <button
            class="toolbar-btn"
            @click="editor.chain().focus().undo().run()"
            title="撤销"
          >
            ↩
          </button>
          <button
            class="toolbar-btn"
            @click="editor.chain().focus().redo().run()"
            title="重做"
          >
            ↪
          </button>
        </div>

        <!-- Loading overlay -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>AI 正在分析数据并生成报告...</p>
        </div>

        <!-- PDF export overlay -->
        <div v-if="exporting" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在导出 PDF...</p>
        </div>

        <!-- Editor content -->
        <div class="editor-content-wrapper">
          <EditorContent :editor="editor" class="editor-content" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.report-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* Header */
.editor-header {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  gap: 16px;
  flex-shrink: 0;
  z-index: 10;
}

.btn-back {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: all 0.2s;
}

.btn-back:hover {
  border-color: #409eff;
  color: #409eff;
}

.report-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #337ecc;
}

.btn-export {
  background: white;
  color: #555;
  border: 1px solid #d9d9d9;
}

.btn-export:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

/* Error banner */
.error-banner {
  padding: 10px 24px;
  background: #fef0f0;
  color: #f56c6c;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.retry-link {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

/* Main layout */
.editor-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Chart sidebar */
.chart-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 20px 16px;
  overflow-y: auto;
  flex-shrink: 0;
}

.chart-sidebar h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #1f2937;
}

.sidebar-hint {
  margin: 0 0 16px 0;
  font-size: 12px;
  color: #999;
}

.chart-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.chart-card:hover {
  border-color: #409eff;
  background: #f0f7ff;
  transform: translateX(2px);
}

.chart-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.chart-info {
  flex: 1;
  min-width: 0;
}

.chart-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-card-meta {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.empty-charts {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

.empty-charts .sub {
  font-size: 12px;
  margin-top: 4px;
}

/* Editor main area */
.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  gap: 2px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.toolbar-btn.active {
  background: #e6f4ff;
  color: #409eff;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e0e0e0;
  margin: 0 6px;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  z-index: 20;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e8e8e8;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #666;
  font-size: 15px;
}

/* Editor content area */
.editor-content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 32px 48px;
  background: #fafafa;
}

:deep(.editor-content) {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 48px 64px;
  min-height: 600px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  outline: none;
}

/* TipTap prose styling */
:deep(.ProseMirror) {
  outline: none;
  min-height: 600px;
}

:deep(.ProseMirror p) {
  margin: 0 0 12px;
  line-height: 1.8;
  font-size: 15px;
  color: #333;
}

:deep(.ProseMirror h1) {
  font-size: 26px;
  font-weight: 700;
  margin: 32px 0 16px;
  color: #1f2937;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

:deep(.ProseMirror h2) {
  font-size: 20px;
  font-weight: 600;
  margin: 28px 0 12px;
  color: #1f2937;
}

:deep(.ProseMirror h3) {
  font-size: 17px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: #374151;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  margin: 8px 0 16px;
  padding-left: 24px;
}

:deep(.ProseMirror li) {
  margin-bottom: 4px;
  line-height: 1.7;
  font-size: 15px;
}

:deep(.ProseMirror blockquote) {
  margin: 16px 0;
  padding: 12px 20px;
  border-left: 4px solid #409eff;
  background: #f9fafb;
  color: #555;
  font-style: normal;
}

:deep(.ProseMirror hr) {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

:deep(.ProseMirror table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

:deep(.ProseMirror th),
:deep(.ProseMirror td) {
  border: 1px solid #d9d9d9;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
}

:deep(.ProseMirror th) {
  background: #f5f7fa;
  font-weight: 600;
}

/* Chart embed node styles */
:deep(.chart-embed-node) {
  margin: 16px 0;
  padding: 16px;
  border: 2px dashed #409eff;
  border-radius: 8px;
  background: #f0f7ff;
  cursor: move;
  transition: all 0.2s;
}

:deep(.chart-embed-node:hover) {
  background: #e6f4ff;
  border-color: #337ecc;
}

:deep(.chart-embed-placeholder) {
  font-size: 15px;
  color: #409eff;
  font-weight: 500;
  text-align: center;
}

/* Placeholder styling */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #bbb;
  pointer-events: none;
  height: 0;
}
</style>
