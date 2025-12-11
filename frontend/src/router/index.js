import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/layouts/MainLayout.vue'
import AuthLayout from '../views/layouts/AuthLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // ============================================================
        // MAIN LAYOUT
        // ============================================================
        {
            path: '/',
            component: MainLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('../views/HomeView.vue'),
                },
                {
                    path: 'about',
                    name: 'about',
                    component: () => import('../views/AboutView.vue'),
                },
                {
                    path: 'archives',
                    name: 'archives',
                    component: () => import('../views/ArchivesView.vue'),
                },
                {
                    path: 'geo-map',
                    name: 'geo-map',
                    component: () => import('../views/GeoMapView.vue'),
                },
            ],
        },
        // ============================================================
        // AUTH LAYOUT
        // ============================================================
        {
            path: '/',
            component: AuthLayout,
            children: [
                {
                path: 'login',
                name: 'login',
                component: () => import('../views/LoginView.vue'),
                },
                {
                path: 'register',
                name: 'register',
                component: () => import('../views/RegisterView.vue'),
                },
                {
                path: 'profile',
                name: 'profile',
                component: () => import('../views/ProfileView.vue'),
                },
                {
                    path: 'add-activity',
                    name: 'add-activity',
                    component: () => import('../views/AddActivityView.vue'),
                },
            ],
        },
        // ============================================================
        // NOT FOUND ROUTE
        // ============================================================
        {
            path: '/:pathMatch(.*)*',
            children: [
                {
                    path: '',
                    name: 'not-found',
                    component: () => import('../views/NotFoundView.vue'),
                }
            ]
        }

    ],
})

export default router
