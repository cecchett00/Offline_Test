import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/search/:keyword/:page?',
    name: 'Search',
    component: Home,
  },
  {
    path: '/',
    redirect: '/search',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
