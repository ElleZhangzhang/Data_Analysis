// composables/useVirtualScroll.ts
import { ref, computed, watch } from 'vue'

export function useVirtualScroll<T>(
  getData: () => T[],      // 改为 getter 函数，保证响应式
  itemHeight: number,       // 每行高度
  containerHeight: number   // 容器高度
) {
  // 将 getter 包装为 computed，确保数据变化时重新计算
  const data = computed(getData)

  // 1. 当前滚动位置
  const scrollTop = ref(0)

  // 2. 缓冲区大小
  const bufferSize = 5

  // 3. 计算可见行数
  const visibleCount = Math.ceil(containerHeight / itemHeight)

  // 计算起始索引
  const startIndex = computed(() => {
    const index = Math.floor(scrollTop.value / itemHeight) - bufferSize
    return Math.max(0, index)  // 不能小于 0
  })

  // 计算结束索引
  const endIndex = computed(() => {
    const index = startIndex.value + visibleCount + bufferSize * 2
    return Math.min(data.value.length, index)  // 不能超过总长度
  })

  // 当前可见的数据，它是dataset.rows
  const visibleData = computed(() => {
    return data.value.slice(startIndex.value, endIndex.value)
  })

  // 总高度
  const totalHeight = computed(() => {
    return data.value.length * itemHeight
  })

  // Y 轴偏移量
  const offsetY = computed(() => {
    return startIndex.value * itemHeight
  })

  // 数据变化时重置滚动位置
  watch(data, () => {
    scrollTop.value = 0
  })

  // 滚动事件处理
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }


  return {
    visibleData,
    totalHeight,
    offsetY,
    handleScroll
  }
}
