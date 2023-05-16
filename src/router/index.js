import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // {path: '', name: 'loginpage', component: () => import('@/views/Home.vue')},
  // {path: '/login', name: 'loginpage', component: () => import('../views/Login.vue')},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

// history: createWebHistory(import.meta.env.BASE_URL),