// src/stores/categoriesStore.js
import { defineStore } from 'pinia';
import { categoriesAPI } from '@/api/categories';

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [],
        activitiesByCategory: {}, // { [slug]: [activities] }
        loading: false,
        error: null
    }),

    getters: {
        getActivities: (state) => (slug) => state.activitiesByCategory[slug] || []
    },

    actions: {
        // Получить все категории
        async fetchCategories() {
            if (this.categories.length) return this.categories; // кеширование

            this.loading = true;
            this.error = null;
            try {
                const data = await categoriesAPI.getAll();
                this.categories = data.results || []; // <--- здесь получаем results т.к. с бекэнда получили объект с пагинацией
                return this.categories; // <-- возвращаем массив, а не объект с count/next/previous
            } catch (e) {
                console.error('Failed to fetch categories', e);
                this.error = 'Erreur lors du chargement des catégories.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Получить активности по категории (slug)
        async fetchActivitiesByCategory(slug) {
            if (this.activitiesByCategory[slug]) return this.activitiesByCategory[slug]; // кеш

            this.loading = true;
            this.error = null;
            try {
                const activities = await categoriesAPI.getCategoryActivitiesBySlug(slug);
                this.activitiesByCategory[slug] = activities;
                return activities;
            } catch (e) {
                console.error(`Failed to fetch activities for category ${slug}`, e);
                this.error = 'Erreur lors du chargement des activités.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Очистить кеш (опционально)
        clearCache() {
            this.categories = [];
            this.activitiesByCategory = {};
        }
    }
});

