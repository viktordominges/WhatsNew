import { defineStore } from 'pinia';

export const useHeaderStore = defineStore('header', {
    state: () => ({
        selectedCategory: '',
        currentTitle: ''
    }),
    
    actions: {
        setCategory(name) {
            this.selectedCategory = name;
            this.currentTitle = name;
        },

        setRouteTitle(path) {
            const map = {
                '/': 'Tous les événements',
                '/about': 'À propos du site',
                '/archives': 'Archives des événements'
            };

            this.selectedCategory = '';
            this.currentTitle = map[path] || '';
        }
    }
});
