import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../views/SettingView.vue'),
    },
    {
      path: '/translate',
      name: 'translate',
      component: () => import('../views/TranslateView.vue'),
    },
    {
      path: '/translate-check',
      name: 'translate-check',
      component: () => import('../views/TranslateCheckView.vue'),
    },
    {
      path: '/tts',
      name: 'tts',
      component: () => import('../views/TTSView.vue'),
    },
    {
      path: '/tts-check',
      name: 'tts-check',
      component: () => import('../views/TTSCheckView.vue'),
    },
    {
      path: '/model-test',
      name: 'model-test',
      component: () => import('../views/ModelTestView.vue'),
    },
  ],
})

export default router
