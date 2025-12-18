// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getCategoryBySlug } from '@/config/categoriesConfig'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/archives',
      name: 'archives',
      component: () => import('../views/ArchivesView.vue'),
    },
    {
      path: '/add-activity',
      name: 'add-activity',
      component: () => import('../views/AddActivityView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    // Маршрут для категорий через slug
    {
      path: '/category/:slug',
      name: 'category',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const category = getCategoryBySlug(to.params.slug);
        if (!category) {
          // Если категория не найдена, редирект на главную
          next('/');
        } else {
          next();
        }
      }
    },
  ],
})

export default router