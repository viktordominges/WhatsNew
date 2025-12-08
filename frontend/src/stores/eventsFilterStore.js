// frontend/src/stores/eventsFilterStore.js
import { defineStore } from 'pinia';

export const useEventsFilterStore = defineStore('eventsFilter', {
    state: () => ({
        mode: 'current', // 'current' | 'archive'
        categorySlug: null,  // null или slug категории (concerts, festivals, etc.)
        filters: {
            favorites: false,
            recommended: false,
            free: false
        } 
    }),

    getters: {
        isArchive: (s) => s.mode === 'archive',

        activeFilters: (s) => {
            return Object.entries(s.filters)
                .filter(([, v]) => v)
                .map(([k]) => k);
        }
    },

    actions: {
        setMode(mode) {
            this.mode = mode;
        },

        setCategoryBySlug(slug) {
            this.categorySlug = slug;
        },

        clearCategory() {
            this.categorySlug = null;
        },

        toggleFilter(name) {
            this.filters[name] = !this.filters[name];
        },

        resetFilters() {
            this.categorySlug = null;
            this.filters.favorites = false;
            this.filters.recommended = false;
            this.filters.free = false;
        }
    }
});