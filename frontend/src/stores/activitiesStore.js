import { defineStore } from 'pinia';
import { fetchActivities } from '@/api/activities';

export const useActivityStore = defineStore('activities', {
    state: () => ({
        items: [],
        loaded: false
    }),

    actions: {
        async load() {
            if (this.loaded) return;
            if (this.items.length) return
            this.items = await fetchActivities();
            this.loaded = true;
        }
    }
});
