import { ref, Ref } from 'vue'

interface Position {
  x: number
  y: number
}

interface UseDragOptions {
  gridSize?: number // 网格大小
  onDragEnd?: (pos: Position) => void // 拖拽结束的回调
}

export function useDrag(
  options: UseDragOptions = {},
  targetRef: Ref<HTMLElement | null> = ref(null)
) {
  const { gridSize = 20, onDragEnd } = options

  const isDragging = ref(false)         // 是否正在拖拽
  const position = ref<Position>({ x: 0, y: 0 })  // 当前位置
}
