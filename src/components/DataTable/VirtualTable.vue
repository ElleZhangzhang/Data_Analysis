<template>
  <!-- 表头（固定） -->
  <!-- <div class="table-header">
      <div v-for="列" class="header-cell">列名</div>
    </div> -->

  <!-- 滚动容器 -->
  <div class="table-body" @scroll="handleScroll">
    <!-- 占位元素（撑起滚动条，高度 = totalHeight） -->
    <div :style="{ height: totalHeight + 'px' }" class="zhanweiHeight">
      <!-- 实际渲染的行（通过 transform 定位） -->
      <div :style="{ transform: `translateY(${offsetY}px)` }">
        <!-- 注意：这里的virtualScroll.visibleData数组是proxy对象，其内部的每个元素也是proxy对象，所以在模板中访问时会触发响应式系统，导致性能问题。 -->
        <!-- 解决方法：在useVirtualScroll中将visibleData转换为普通数组，或者在模板中使用toRaw()函数将其转换为普通数组。 -->
        <div
          v-for="(obj, index) in visibleData"
          :key="index"
          class="table-row-mock"
        >
          <el-tooltip
            v-for="(value, index) in getValuesWithoutId(obj)"
            :key="index"
            :content="String(value ?? '')"
            placement="top"
            :show-after="300"
          >
            <div class="table-cell">
              {{ value }}
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVirtualScroll } from "@/components/DataTable/useVirtualScroll";
import { ColumnDef, DataRow } from "@/types";

interface Props {
  data: DataRow[]; // 10000 行数据
  columns: ColumnDef[];
}
const props = defineProps<Props>();

const virtualScroll = useVirtualScroll(
  () => props.data, // 改为 getter 函数，保证数据切换时响应式更新
  51,
  592
);

const { visibleData, totalHeight, offsetY, handleScroll } = virtualScroll;

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
  text-align: left;
}

.table-cell {
  flex: 1;
  padding: 0 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* .zhanweiHeight {
  overflow: auto;
} */

.table-body {
  overflow: auto;
  height: 200px;
  /* flex: 1; */
  min-height: 0; /* ✅ 加上这个 */
}
</style>
