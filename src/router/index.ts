import { createRouter, createWebHistory } from 'vue-router'
import DataView from '@/views/DataView.vue'

const routes = [
  {
    path: '/',
    name: 'DataView',
    component: DataView
  },
  {
    path: '/report-editor',
    name: 'ReportEditor',
    component: () => import('@/views/ReportEditor.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
