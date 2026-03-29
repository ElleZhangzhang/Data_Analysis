// composables/useVirtualScroll.ts
import { ref, computed } from 'vue'

export function useVirtualScroll<T>(
  data: T[],              // 完整数据
  itemHeight: number,     // 每行高度
  containerHeight: number // 容器高度
) {
  // 1. 当前滚动位置
  const scrollTop = ref(0)

  // 2. 缓冲区大小
  const bufferSize = 5

  // 3. 计算可见行数
  const visibleCount = Math.ceil(containerHeight / itemHeight)

  // TODO: 计算起始索引（computed）
  const startIndex = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    return Math.max(0, start - bufferSize)
  })

  // TODO: 计算结束索引（computed）
  const endIndex = computed(() => {
    const end = Math.ceil((scrollTop.value + containerHeight) / itemHeight)
    return Math.min(data.length, end + bufferSize)
  })

  // TODO: 当前可见的数据（computed）
  const visibleData = computed(() => {
    return data.slice(startIndex.value, endIndex.value)
  })

  // TODO: 总高度（computed）
  const totalHeight = computed(() => {
    return data.length * itemHeight
  })

  // TODO: Y 轴偏移量（computed）
  const offsetY = computed(() => {
    // 起始索引 * 每行高度
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
