<template>
  <!-- 表头（固定） -->
  <!-- <div class="table-header">
      <div v-for="列" class="header-cell">列名</div>
    </div> -->

  <!-- 滚动容器 -->
  <div class="table-body">
    <!-- 占位元素（撑起滚动条，高度 = totalHeight） -->
    <div
      :style="{ height: totalHeight + 'px' }"
      class="zhanweiHeight"
      @scroll="handleScroll"
    >
      <!-- 实际渲染的行（通过 transform 定位） -->
      <div :style="{ transform: `translateY(${offsetY}px)` }">
        <!-- 注意：这里的virtualScroll.visibleData数组是proxy对象，其内部的每个元素也是proxy对象，所以在模板中访问时会触发响应式系统，导致性能问题。 -->
        <!-- 解决方法：在useVirtualScroll中将visibleData转换为普通数组，或者在模板中使用toRaw()函数将其转换为普通数组。 -->
        <div
          v-for="(obj, index) in visibleData"
          :key="index"
          class="table-row-mock"
        >
          <div
            v-for="(value, index) in getValuesWithoutId(obj)"
            :key="index"
            class="table-cell"
          >
            {{ value }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div v-for="i in 10" :key="i" class="table-row-mock">
      <div class="table-cell id-cell">#CR-{{ 2000 + i }}</div>
      <div class="table-cell product-name editorial-font-weight">
        Stardust Series [Essentials]
      </div>
      <div class="table-cell currency">
        ¥ {{ (Math.random() * 1000 + 100).toFixed(2) }}
      </div>
      <div class="table-cell date-cell">2023.10.27</div>
      <div class="table-cell status">
        <span class="status-tag tag-shipped-chic">已送达</span>
      </div>
    </div> -->
</template>

<script setup lang="ts">
import { useVirtualScroll } from "@/components/DataTable/useVirtualScroll";
import { ColumnDef, DataRow } from "@/types/data";
import { computed } from "vue";

interface Props {
  data: DataRow[]; // 10000 行数据
  columns: ColumnDef[];
}
const props = defineProps<Props>();

const virtualScroll = useVirtualScroll(
  props.data, // 10000 行完整数据   dataset.rows
  51,
  592
);

const keyValue = computed(() => {
  return props.data.map((obj) => {
    return;
  }); // 取第一列的值作为key
});

const { visibleData, totalHeight, offsetY, handleScroll } = virtualScroll;

console.log(visibleData.value);

// 过滤掉id
const getValuesWithoutId = (obj: Record<string, unknown>) => {
  return Object.entries(obj)
    .filter(([key]) => key !== "id")
    .map(([, value]) => value);
};
</script>

<style>
.table-row-mock {
  display: flex;
  padding: 14px 25px;
  border-bottom: 1px solid rgba(191, 161, 117, 0.03);
  align-items: center;
}

.table-cell {
  flex: 1;
  padding: 0 10px;
}

/* .table-body {
  overflow: auto;
} */

.zhanweiHeight {
  overflow: auto !important;
}
</style>
