<template>
  <div class="virtual-table">
    <!-- 表头（固定） -->
    <div class="table-header">
      <div v-for="列" class="header-cell">列名</div>
    </div>

    <!-- 滚动容器 -->
    <div class="table-body" @scroll="handleScroll">
      <!-- 占位元素（撑起滚动条，高度 = totalHeight） -->
      <div :style="{ height: totalHeight + 'px' }">
        <!-- 实际渲染的行（通过 transform 定位） -->
        <div :style="{ transform: `translateY(${offsetY}px)` }">
          <div v-for="row in visibleData" class="table-row">
            <div v-for="col in columns" class="table-cell">
              {{ row[col.key] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVirtualScroll } from "@/components/DataTable/useVirtualScroll";

const virtualScroll = useVirtualScroll({
  data: T[],              // 完整数据
  itemHeight: 30px,     // 每行高度
  containerHeight: number
});
</script>

<style>
</style>
