import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/layouts/MainLayout.vue'
import AuthLayout from '../views/layouts/AuthLayout.vue'
import DashboardLayout from '../views/layouts/DashboardLayout.vue'

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
                    component: () => import('../views/authViews/LoginView.vue'),
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => import('../views/authViews/RegisterView.vue'),
                },
                // {
                //     path: 'profile',
                //     name: 'profile',
                //     component: () => import('../views/dashboardViews/ProfileView.vue'),
                // },
                // {
                //     path: 'add-activity',
                //     name: 'add-activity',
                //     component: () => import('../views/dashboardViews/AddActivityView.vue'),
                // },
            ],
        },
        // ============================================================
        // DASHBOARD LAYOUT
        // ============================================================
        {
            path: '/dashboard',
            component: DashboardLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/DashboardView.vue'),
                },
                {
                    path: 'account',
                    name: 'dashboard-account',
                    component: () => import('../views/AccountSettingsView.vue'),
                },
                {
                    path: 'organizers',
                    name: 'dashboard-organizers',
                    component: () => import('../views/MyOrganizersView.vue'),
                },
                {
                    path: 'organizers/create',
                    name: 'dashboard-organizers-create',
                    component: () => import('../views/CreateOrganizerView.vue'),
                },
                {
                    path: 'organizers/:slug/edit',
                    name: 'dashboard-organizers-edit',
                    component: () => import('../views/EditOrganizerView.vue'),
                },
                {
                    path: 'organizers/:slug/events',
                    name: 'dashboard-organizer-events',
                    component: () => import('../views/OrganizerEventsView.vue'),
                },
                {
                    path: 'organizers/:organizerSlug/events/create',
                    name: 'dashboard-events-create',
                    component: () => import('../views/CreateEventView.vue'),
                },
                {
                    path: 'organizers/:organizerSlug/events/:eventSlug/edit',
                    name: 'dashboard-events-edit',
                    component: () => import('../views/EditEventView.vue'),
                }
            ]
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



// ============================================================================
// frontend/src/router/dashboard.js
// ============================================================================

import { useAuthStore } from '@/stores/authStore';

// Layout
const DashboardLayout = () => import('@/components/dashboard/DashboardLayout.vue');

// Views
const DashboardView = () => import('@/views/dashboard/DashboardView.vue');
const AccountSettingsView = () => import('@/views/dashboard/AccountSettingsView.vue');
const MyOrganizersView = () => import('@/views/dashboard/MyOrganizersView.vue');
const CreateOrganizerView = () => import('@/views/dashboard/CreateOrganizerView.vue');
const EditOrganizerView = () => import('@/views/dashboard/EditOrganizerView.vue');
const OrganizerEventsView = () => import('@/views/dashboard/OrganizerEventsView.vue');
const CreateEventView = () => import('@/views/dashboard/CreateEventView.vue');
const EditEventView = () => import('@/views/dashboard/EditEventView.vue');

/**
 * Проверка авторизации
 */
const requireAuth = async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Проверяем авторизацию
    if (!authStore.isLoggedIn) {
        await authStore.checkAuth();
    }

    if (authStore.isLoggedIn) {
        next();
    } else {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }
};

export const dashboardRoutes = [
    {
        path: '/dashboard',
        component: DashboardLayout,
        beforeEnter: requireAuth,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: DashboardView,
                meta: {
                    title: 'Личный кабинет'
                }
            },
            {
                path: 'settings',
                name: 'dashboard-settings',
                component: AccountSettingsView,
                meta: {
                    title: 'Настройки аккаунта'
                }
            },
            {
                path: 'organizers',
                name: 'dashboard-organizers',
                component: MyOrganizersView,
                meta: {
                    title: 'Мои организаторы'
                }
            },
            {
                path: 'organizers/create',
                name: 'dashboard-organizers-create',
                component: CreateOrganizerView,
                meta: {
                    title: 'Создать организатора'
                }
            },
            {
                path: 'organizers/:slug/edit',
                name: 'dashboard-organizers-edit',
                component: EditOrganizerView,
                meta: {
                    title: 'Редактировать организатора'
                }
            },
            {
                path: 'organizers/:slug/events',
                name: 'dashboard-organizer-events',
                component: OrganizerEventsView,
                meta: {
                    title: 'События организатора'
                }
            },
            {
                path: 'events/create',
                name: 'dashboard-events-create',
                component: CreateEventView,
                meta: {
                    title: 'Создать событие'
                }
            },
            {
                path: 'events/:slug/edit',
                name: 'dashboard-events-edit',
                component: EditEventView,
                meta: {
                    title: 'Редактировать событие'
                }
            }
        ]
    }
];

// ============================================================================
// Интеграция в main router
// frontend/src/router/index.js
// ============================================================================

/*
import { createRouter, createWebHistory } from 'vue-router'
import { dashboardRoutes } from './dashboard'
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
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    
    // Dashboard routes
    ...dashboardRoutes,
    
    // Category route
    {
      path: '/category/:slug',
      name: 'category',
      component: HomeView,
    },
  ],
  
  // Scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
})

// Global navigation guard for page titles
router.beforeEach((to, from, next) => {
  document.title = to.meta.title 
    ? `${to.meta.title} | Quoi de neuf` 
    : 'Quoi de neuf';
  next();
});

export default router
*/
