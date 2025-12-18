// ============================================================================
// frontend/src/stores/userOrganizersStore.js
// ============================================================================

import { defineStore } from 'pinia';
import { organizersAPI } from '@/services/api';

export const useUserOrganizersStore = defineStore('userOrganizers', {
    state: () => ({
        organizers: [],
        currentOrganizer: null,
        loading: false,
        error: null
    }),

    getters: {
        /**
         * Получить организатора по slug
         */
        getBySlug: (state) => (slug) => {
            return state.organizers.find(o => o.slug === slug);
        },

        /**
         * Количество организаторов
         */
        count: (state) => state.organizers.length,

        /**
         * Есть ли организаторы
         */
        hasOrganizers: (state) => state.organizers.length > 0
    },

    actions: {
        /**
         * Получить всех организаторов пользователя
         */
        async fetchOrganizers() {
            this.loading = true;
            this.error = null;

            try {
                const response = await organizersAPI.getAll();
                this.organizers = response.data.results || response.data;
                return this.organizers;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Получить организатора по slug
         */
        async fetchOrganizer(slug) {
            this.loading = true;
            this.error = null;

            try {
                const response = await organizersAPI.getBySlug(slug);
                this.currentOrganizer = response.data;

                // Обновляем в списке
                const index = this.organizers.findIndex(o => o.slug === slug);
                if (index !== -1) {
                    this.organizers[index] = response.data;
                } else {
                    this.organizers.push(response.data);
                }

                return this.currentOrganizer;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Создать организатора
         */
        async createOrganizer(data) {
            this.loading = true;
            this.error = null;

            try {
                const response = await organizersAPI.create(data);
                this.organizers.push(response.data);
                return response.data;
            } catch (err) {
                this.error = err.response?.data || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Обновить организатора
         */
        async updateOrganizer(slug, data) {
            this.loading = true;
            this.error = null;

            try {
                const response = await organizersAPI.update(slug, data);

                // Обновляем в списке
                const index = this.organizers.findIndex(o => o.slug === slug);
                if (index !== -1) {
                    this.organizers[index] = response.data;
                }

                // Обновляем текущий
                if (this.currentOrganizer?.slug === slug) {
                    this.currentOrganizer = response.data;
                }

                return response.data;
            } catch (err) {
                this.error = err.response?.data || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Удалить организатора
         */
        async deleteOrganizer(slug) {
            this.loading = true;
            this.error = null;

            try {
                await organizersAPI.delete(slug);

                // Удаляем из списка
                this.organizers = this.organizers.filter(o => o.slug !== slug);

                // Очищаем текущий
                if (this.currentOrganizer?.slug === slug) {
                    this.currentOrganizer = null;
                }
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Очистить текущего организатора
         */
        clearCurrent() {
            this.currentOrganizer = null;
        },

        /**
         * Сбросить состояние
         */
        reset() {
            this.organizers = [];
            this.currentOrganizer = null;
            this.loading = false;
            this.error = null;
        }
    }
});