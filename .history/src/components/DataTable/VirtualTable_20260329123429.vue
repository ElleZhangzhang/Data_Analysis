<template></template>

<script setup>
import { useVirtualScroll } from "@/components/DataTable/useVirtualScroll";
const { visibleData } = useVirtualScroll(
  props.data, // 10000 行完整数据
  48,
  600
);
</script>

<style>
</style>
