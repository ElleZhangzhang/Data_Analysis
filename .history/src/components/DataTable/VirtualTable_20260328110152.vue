<template>
  <input type="file" name="" id="" />
</template>

<script setup>
import { useFileParser } from "@/composables/useFileParse";
const { parseFile } = useFileParser();

const handleUpload = async (event) => {
  const file = event.target.files[0]; // 获取文件
  if (!file) return;

  const data = await parseFile(file); // 传入 file 对象
  console.log(data); // 文件内容
};
</script>

<style>
</style>
