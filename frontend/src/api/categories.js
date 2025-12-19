// API для категорий
import { apiRequest } from '@/services/http.js'

export const categoriesAPI = {
    getAll: async () => {
        try {
            return await apiRequest('/categories/');
        } catch (e) {
            console.error('Failed to fetch categories', e);
            return [];
        }
    },

    getCategoryActivitiesBySlug: async (slug) => {
        try {
            return await apiRequest(`/categories/${slug}/activities/`);
        } catch (e) {
            console.error('Failed to fetch activities by category slug', e);
            return [];
        }
    },
};