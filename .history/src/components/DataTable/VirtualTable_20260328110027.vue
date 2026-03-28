<template>
  <input type="file" name="" id="" />
</template>

<script setup>
import { useFileParser } from "@/composables/useFileParse";
const { parseFile } = useFileParser();
const content = parseFile();
</script>

<style>
</style>
