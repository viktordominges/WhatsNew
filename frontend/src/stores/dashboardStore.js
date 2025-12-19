// ============================================================================
// frontend/src/stores/dashboardStore.js
// ============================================================================

import { defineStore } from 'pinia';
import { activitiesAPI } from '@/api/activities';
import { organizersAPI } from '@/api/organizers';

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        stats: {
            totalOrganizers: 0,
            totalActivities: 0,
            publishedActivities: 0,
            draftActivities: 0
        },
        recentActivities: [],
        loading: false,
        error: null
    }),

    actions: {
        /**
         * Загрузить статистику дашборда
         */
        async fetchStats() {
            this.loading = true;
            this.error = null;

            try {
                // Получаем организаторы пользователя
                const organizersResponse = await organizersAPI.getAll();
                const organizers = organizersResponse.data.results || organizersResponse.data;
                this.stats.totalOrganizers = organizers.length;

                // Получаем события пользователя
                const activitiesResponse = await activitiesAPI.getAll();
                const activities = activitiesResponse.data.results || activitiesResponse.data;
                
                this.stats.totalActivities = activities.length;
                this.stats.publishedActivities = activities.filter(e => e.status === 'published').length;
                this.stats.draftActivities = activities.filter(e => e.status === 'draft').length;

                // Последние 5 событий
                this.recentActivities = activities.slice(0, 5);

            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                console.error('Error fetching dashboard stats:', err);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Сбросить состояние
         */
        reset() {
            this.stats = {
                totalOrganizers: 0,
                totalActivities: 0,
                publishedActivities: 0,
                draftActivities: 0
            };
            this.recentActivities = [];
            this.loading = false;
            this.error = null;
        }
    }
});