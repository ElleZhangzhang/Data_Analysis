<script setup>
</script>

<template>
  <!-- ✨ 图表区域 -->
  <div class="charts-section">
    <div class="section-header">
      <h3>📊 数据可视化</h3>
      <button class="create-chart-btn" @click="showChartDialog = true">
        + 创建图表
      </button>
    </div>

    <!-- 图表网格 -->
    <div
      class="charts-grid"
      :class="{ 'has-charts': currentCharts.length > 0 }"
    >
      <!-- 空状态 -->
      <p v-if="currentCharts.length === 0" class="empty-hint">
        点击"创建图表"开始可视化分析
      </p>

      <!-- 图表列表 -->
      <BaseChart
        v-for="chart in currentCharts"
        :key="chart.id"
        :config="chart"
        :data="currentDataset.rows"
        @delete="handleDeleteChart(chart.id)"
      />
    </div>
  </div>
</template>
