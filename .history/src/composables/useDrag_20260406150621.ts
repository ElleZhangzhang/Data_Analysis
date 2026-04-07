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

  let startMouseX = 0    // 鼠标按下时的 X 坐标
  let startMouseY = 0    // 鼠标按下时的 Y 坐标
  let initialX = 0       // 图表初始 X 位置
  let initialY = 0       // 图表初始 Y 位置
}
