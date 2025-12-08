// stores/eventsFilterStore.js
import { defineStore } from 'pinia';

export const useEventsFilterStore = defineStore('eventsFilter', {
    state: () => ({
        mode: 'current', // 'current' | 'archive'
        category: null,  // null или id категории
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

        setCategory(name) {
            this.category = name;
        },

        toggleFilter(name) {
            this.filters[name] = !this.filters[name];
        },

        resetFilters() {
            this.category = null;
            this.filters.favorites = false;
            this.filters.recommended = false;
            this.filters.free = false;
        }
    }
});
