import { ref } from 'vue'
import type { Ref } from 'vue'

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
  const position = ref<Position>({ x: 0, y: 0 })  // 图表位置

  let startMouseX = 0 // 鼠标按下时的 X 坐标，这是初始位置
  let startMouseY = 0
  let initialX = 0 // 图表初始 X 位置，怀疑：相对父元素
  let initialY = 0

  let isConstPostion = true

  // TODO: 实现鼠标按下事件
  const handleMouseDown = (e: MouseEvent) => {
    // 步骤1: 检查是否点击了调整大小手柄，如果是则返回
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return

    // 步骤2: 阻止默认行为
    e.preventDefault()

    // 步骤3: 记录鼠标起始位置
    startMouseX = e.clientX
    startMouseY = e.clientY

    // 步骤4: 记录图表初始位置
    initialX = position.value.x
    initialY = position.value.y

    // 步骤5: 设置拖拽状态
    isDragging.value = true

    // 步骤6: 添加全局鼠标事件监听
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

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
      // 获取子元素相对于父元素顶部的距离
      let childRect = null
      let parentRect = null
      let yInParent = 0
      if (isConstPostion === true) {
        childRect = targetRef.value?.getBoundingClientRect()
        parentRect = container.getBoundingClientRect()
        yInParent = parentRect.top - childRect.top
        isConstPostion = false
        console.log(yInParent);

      }
      console.log(Math.min(newY, maxY), ' vs ', yInParent);

      newY = Math.max(yInParent, Math.min(newY, maxY))
    }


    // 更新位置
    position.value = { x: newX, y: newY }
  }

  const handleMouseUp = () => {
    // 如果没在拖拽，直接返回
    if (!isDragging.value) return

    // 设置拖拽状态为 false
    isDragging.value = false

    // 移除全局鼠标事件监听
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    // 调用结束回调
    onDragEnd?.(position.value)
  }

  // 用于初始化位置
  const setPosition = (newPos: Position) => {
    position.value = newPos
  }

  return {
    isDragging,
    position,
    setPosition,
    handleMouseDown  // 需要手动绑定到元素上
  }
}
