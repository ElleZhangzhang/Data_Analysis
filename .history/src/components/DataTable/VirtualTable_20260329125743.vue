<template>
  <div class="virtual-table">
    <!-- 表头（固定） -->
    <!-- <div class="table-header">
      <div v-for="列" class="header-cell">列名</div>
    </div> -->

    <!-- 滚动容器 -->
    <div class="table-body" @scroll="handleScroll">
      <!-- 占位元素（撑起滚动条，高度 = totalHeight） -->
      <div :style="{ height: totalHeight + 'px' }">
        <!-- 实际渲染的行（通过 transform 定位） -->
        <div :style="{ transform: `translateY(${offsetY}px)` }">
          <div class="virtual-table">
            <div
              v-for="(item, index) in visibleData"
              :key="index"
              class="virtual-table-row"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
interface Props {
  data: DataRow[] // 10000 行数据
  columns:ColumnDef[]
}
const props = defineProps<Props>();

import { useVirtualScroll } from "@/components/DataTable/useVirtualScroll";
const { visibleData } = useVirtualScroll(
  props.data, // 10000 行完整数据
  30,
  600
);
// props.data是数组
</script>

<style>
</style>
