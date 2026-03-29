<template>
  <div class="virtual-table">
    <!-- 表头（固定） -->
    <!-- <div class="table-header">
      <div v-for="列" class="header-cell">列名</div>
    </div> -->

    <!-- 滚动容器 -->
    <div class="table-body" @scroll="virtualScroll.handleScroll">
      <!-- 占位元素（撑起滚动条，高度 = totalHeight） -->
      <div :style="{ height: virtualScroll.totalHeight + 'px' }">
        <!-- 实际渲染的行（通过 transform 定位） -->
        <div :style="{ transform: `translateY(${virtualScroll.offsetY}px)` }">
          <div class="virtual-table">
            <div
              v-for="(obj, index) in virtualScroll.visibleData"
              :key="index"
              class="table-row-mock"
            >
              <div v-for="(value, index) in obj" :key="index" table-cell>
                {{ value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-for="i in 10" :key="i" class="table-row-mock">
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
    </div>
  </div>
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
  30,
  600
);

const keyValue = computed(() => {
  return props.data.map((obj) => {
    return;
  }); // 取第一列的值作为key
});
</script>

<style>
</style>
