
// frontend/src/stores/headerStore.js
import { defineStore } from 'pinia';
import { getCategoryName } from '@/config/categoriesConfig';

export const useHeaderStore = defineStore('header', {
    state: () => ({
        selectedCategorySlug: '',
        currentTitle: ''
    }),
    
    actions: {
        setCategoryBySlug(slug) {
            this.selectedCategorySlug = slug;
            this.currentTitle = getCategoryName(slug);
        },

        setRouteTitle(path) {
            const map = {
                '/': 'Tous les événements',
                '/about': 'À propos du site',
                '/archives': 'Archives des événements'
            };

            this.selectedCategorySlug = '';
            this.currentTitle = map[path] || '';
        }
    }
});
