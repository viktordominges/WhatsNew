// favoritesStore.js
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        ids: JSON.parse(localStorage.getItem('favorites')) || []
    }),

    actions: {
        toggle(id) {
            if (this.ids.includes(id)) {
                this.ids = this.ids.filter(f => f !== id);
            } else {
                this.ids.push(id);
            }
            
            localStorage.setItem('favorites', JSON.stringify(this.ids));
        },

        isFavorite(id) {
            return this.ids.includes(id);
        }
    }
});
