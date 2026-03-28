import { createRouter, createWebHistory } from 'vue-router'
import VirtualTable from '@/components/DataTable/VirtualTable.vue'  // 根据实际路径调整

const routes = [
  {
    path: '/',
    name: 'DataTable',
    component: VirtualTable  // 设置为首页
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
