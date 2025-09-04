import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'

const routes = [
  {
    path: '/search/:keyword/:page?',
    name: 'Search',
    component: Home,
  },
  {
    path: '/',
    redirect: 'search',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
