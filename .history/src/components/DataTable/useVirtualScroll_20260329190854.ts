// composables/useVirtualScroll.ts
import { ref, computed, toRaw } from 'vue'

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

  // 计算起始索引
  const startIndex = computed(() => {
    const index = Math.floor(scrollTop.value / itemHeight) - bufferSize
    return Math.max(0, index)  // 不能小于 0
  })

  // 计算结束索引
  const endIndex = computed(() => {
    const index = startIndex.value + visibleCount + bufferSize * 2
    return Math.min(data.length, index)  // 不能超过总长度
  })

  // 当前可见的数据，它是dataset.rows
  const visibleData = computed(() => {
    return data.slice(startIndex.value, endIndex.value)
    // return sliced.map(item => toRaw(item)) // 转换为普通对象，避免性能问题
  })

  // 总高度
  const totalHeight = computed(() => {
    return data.length * itemHeight
  })

  // Y 轴偏移量
  const offsetY = computed(() => {
    return startIndex.value * itemHeight
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
