<!-- DataView.vue (父组件) -->
<script setup>
import { useDataStore } from "@/stores/data";
// import VirtualTable from '@/components/DataTable/VirtualTable.vue'

const dataStore = useDataStore();
const currentDataset = dataStore.currentDataset;
</script>

<template>
  <VirtualTable :data="currentDataset.rows" :columns="currentDataset.columns" />
</template>
