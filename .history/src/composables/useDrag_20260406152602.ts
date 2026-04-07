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
  targetRef: Ref<HTMLElement | null> = ref(null),
  options: UseDragOptions = {}
) {
  const { gridSize = 20, onDragEnd } = options

  const isDragging = ref(false)         // 是否正在拖拽
  const position = ref<Position>({ x: 0, y: 0 })  // 当前位置

  let startMouseX = 0 // 鼠标按下时的 X 坐标，这是初始位置
  let startMouseY = 0
  let initialX = 0 // 图表初始 X 位置
  let initialY = 0

  const handleMouseMove = (e: MouseEvent) => {
    // 如果没在拖拽，直接返回
    if (!isDragging.value) return

    // 鼠标移动距离
    const deltaX = e.clientX - startMouseX
    const deltaY = e.clientY - startMouseY

    // 图表新位置 = 图表初始位置 + 鼠标移动距离
    let newX = initialX + deltaX
    let newY = initialY + deltaY

    // 网格吸附（可选）
    // if (gridSize > 1) {
    //   newX = Math.round(newX / gridSize) * gridSize
    //   newY = Math.round(newY / gridSize) * gridSize
    // }

    // 边界限制（防止拖出容器）
    // 提示: 容器是 targetRef.value?.parentElement
    // 注意：查一下当前目标元素的parentElement
    const container = targetRef.value?.parentElement
    if (container) {
      const maxX = container.clientWidth - targetRef.value.clientWidth
      const maxY = container.clientHeight - targetRef.value.clientHeight
      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))
    }

    // 更新位置
    position.value = { x: newX, y: newY }
  }
}
