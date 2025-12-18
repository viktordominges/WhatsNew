import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import MainLayout from '../views/layouts/MainLayout.vue'
import AuthLayout from '../views/layouts/AuthLayout.vue'
import DashboardLayout from '../views/layouts/DashboardLayout.vue'

/**
 * Navigation guard для защищенных маршрутов
 */
const requireAuth = async (to, from, next) => {
    const authStore = useAuthStore();
    
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
                    meta: { title: 'Tous les événements' }
                },
                {
                    path: 'about',
                    name: 'about',
                    component: () => import('../views/AboutView.vue'),
                    meta: { title: 'À propos du site' }
                },
                {
                    path: 'archives',
                    name: 'archives',
                    component: () => import('../views/ArchivesView.vue'),
                    meta: { title: 'Archives des événements' }
                },
                {
                    path: 'geo-map',
                    name: 'geo-map',
                    component: () => import('../views/GeoMapView.vue'),
                    meta: { title: 'Carte géographique' }
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
                    meta: { title: 'Se connecter' }
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => import('../views/authViews/RegisterView.vue'),
                    meta: { title: "S'enregistrer" }
                },
            ],
        },
        // ============================================================
        // DASHBOARD LAYOUT
        // ============================================================
        {
            path: '/dashboard',
            component: DashboardLayout,
            beforeEnter: requireAuth,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/dashboardViews/DashboardView.vue'),
                    meta: { title: 'Tableau de bord' }
                },
                {
                    path: 'settings',
                    name: 'dashboard-settings',
                    component: () => import('../views/dashboardViews/AccountSettingsView.vue'),
                    meta: { title: 'Paramètres du compte' }
                },
                {
                    path: 'organizers',
                    name: 'dashboard-organizers',
                    component: () => import('../views/dashboardViews/MyOrganizersView.vue'),
                    meta: { title: 'Mes organisateurs' }
                },
                {
                    path: 'organizers/create',
                    name: 'dashboard-organizers-create',
                    component: () => import('../views/dashboardViews/CreateOrganizerView.vue'),
                    meta: { title: 'Créer un organisateur' }
                },
                {
                    path: 'organizers/:slug/edit',
                    name: 'dashboard-organizers-edit',
                    component: () => import('../views/dashboardViews/EditOrganizerView.vue'),
                    meta: { title: "Modifier l'organisateur" }
                },
                {
                    path: 'organizers/:slug/activities',
                    name: 'dashboard-organizer-activities',
                    component: () => import('../views/dashboardViews/OrganizerEventsView.vue'),
                    meta: { title: "Événements de l'organisateur" }
                },
                {
                    path: 'activities',
                    name: 'dashboard-activities',
                    component: () => import('../views/dashboardViews/ActivitiesListView.vue'),
                    meta: { title: 'Mes événements' }
                },
                {
                    path: 'activities/create',
                    name: 'dashboard-activities-create',
                    component: () => import('../views/dashboardViews/CreateActivityView.vue'),
                    meta: { title: 'Créer un événement' }
                },
                {
                    path: 'activities/:slug/edit',
                    name: 'dashboard-activities-edit',
                    component: () => import('../views/dashboardViews/EditActivityView.vue'),
                    meta: { title: "Modifier l'événement" }
                }
            ]
        },
        // ============================================================
        // NOT FOUND ROUTE
        // ============================================================
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/NotFoundView.vue'),
            meta: { title: 'Page non trouvée' }
        }
    ],
    
    // Поведение прокрутки
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
})

// Global navigation guard для заголовков страниц
router.beforeEach((to, from, next) => {
    document.title = to.meta.title 
        ? `${to.meta.title} | Quoi de neuf` 
        : 'Quoi de neuf';
    next();
});

export default router