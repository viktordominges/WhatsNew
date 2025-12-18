import { defineStore } from 'pinia';
import { fetchCategories } from '@/api/categories';

export const useCategoryStore = defineStore('categories', {
    state: () => ({
        items: [],
        loaded: false
    }),

    actions: {
        async load() {
            if (this.loaded) return;
            if (this.items.length) return
            this.items = await fetchCategories();
            this.loaded = true;
        }
    }
});
