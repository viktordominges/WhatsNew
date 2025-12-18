// frontend/src/stores/activitiesStore.js

import { defineStore } from 'pinia';
import { activitiesAPI } from '@/services/api';

export const useActivitiesStore = defineStore('activities', {
    state: () => ({
        activities: [],
        currentActivity: null,
        loading: false,
        error: null,
        filters: {
            category: null,
            organizer: null,
            search: '',
            dateFrom: null,
            dateTo: null,
            price: null,
            filter: 'upcoming',
            ordering: '-date'
        }
    }),

    getters: {
        // Получить активности по категории
        getByCategory: (state) => (categoryId) => {
            return state.activities.filter(a => a.category === categoryId);
        },

        // Будущие активности
        upcomingActivities: (state) => {
            const now = new Date();
            return state.activities.filter(a => new Date(a.date) >= now);
        },

        // Прошедшие активности
        pastActivities: (state) => {
            const now = new Date();
            return state.activities.filter(a => new Date(a.date) < now);
        },

        // Бесплатные активности
        freeActivities: (state) => {
            return state.activities.filter(a => !a.price || a.price === 0);
        },

        // Рекомендованные активности
        recommendedActivities: (state) => {
            return state.activities.filter(a => a.recommended === true);
        },
    },

    actions: {
        /**
         * Получить все активности с фильтрами
         */
        async fetchActivities(params = {}) {
            this.loading = true;
            this.error = null;
            
            try {
                // Объединяем filters из state с переданными params
                const queryParams = {
                    ...this.filters,
                    ...params
                };

                // Удаляем пустые параметры
                Object.keys(queryParams).forEach(key => {
                    if (queryParams[key] === null || queryParams[key] === '') {
                        delete queryParams[key];
                    }
                });

                const response = await activitiesAPI.getAll(queryParams);
                this.activities = response.data.results || response.data;
                
                return this.activities;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Получить активность по slug
         */
        async fetchActivity(slug) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await activitiesAPI.getBySlug(slug);
                this.currentActivity = response.data;
                
                // Добавляем/обновляем в общем списке
                const index = this.activities.findIndex(a => a.slug === slug);
                if (index !== -1) {
                    this.activities[index] = response.data;
                } else {
                    this.activities.push(response.data);
                }
                
                return this.currentActivity;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Создать активность
         */
        async createActivity(data) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await activitiesAPI.create(data);
                this.activities.push(response.data);
                return response.data;
            } catch (err) {
                this.error = err.response?.data || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Обновить активность
         */
        async updateActivity(slug, data) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await activitiesAPI.update(slug, data);
                
                const index = this.activities.findIndex(a => a.slug === slug);
                if (index !== -1) {
                    this.activities[index] = response.data;
                }
                
                if (this.currentActivity?.slug === slug) {
                    this.currentActivity = response.data;
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
         * Удалить активность
         */
        async deleteActivity(slug) {
            this.loading = true;
            this.error = null;
            
            try {
                await activitiesAPI.delete(slug);
                
                this.activities = this.activities.filter(a => a.slug !== slug);
                
                if (this.currentActivity?.slug === slug) {
                    this.currentActivity = null;
                }
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Установить фильтры
         */
        setFilters(filters) {
            this.filters = {
                ...this.filters,
                ...filters
            };
        },

        /**
         * Сбросить фильтры
         */
        resetFilters() {
            this.filters = {
                category: null,
                organizer: null,
                search: '',
                dateFrom: null,
                dateTo: null,
                price: null,
                filter: 'upcoming',
                ordering: '-date'
            };
        },

        /**
         * Установить фильтр категории
         */
        setCategoryFilter(categoryId) {
            this.filters.category = categoryId;
        },

        /**
         * Очистить текущую активность
         */
        clearCurrentActivity() {
            this.currentActivity = null;
        },
    }
});

// frontend/src/stores/categoriesStore.js

import { defineStore } from 'pinia';
import { categoriesAPI } from '@/services/api';

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [],
        currentCategory: null,
        loading: false,
        error: null
    }),

    getters: {
        // Получить категорию по slug
        getCategoryBySlug: (state) => (slug) => {
            return state.categories.find(c => c.slug === slug);
        },

        // Получить категорию по ID
        getCategoryById: (state) => (id) => {
            return state.categories.find(c => c.id === id);
        },

        // Отсортированные категории
        sortedCategories: (state) => {
            return [...state.categories].sort((a, b) => 
                a.name.localeCompare(b.name)
            );
        }
    },

    actions: {
        /**
         * Получить все категории
         */
        async fetchCategories(params = {}) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await categoriesAPI.getAll(params);
                this.categories = response.data.results || response.data;
                return this.categories;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Получить категорию по slug
         */
        async fetchCategory(slug) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await categoriesAPI.getBySlug(slug);
                this.currentCategory = response.data;
                
                // Обновляем в списке
                const index = this.categories.findIndex(c => c.slug === slug);
                if (index !== -1) {
                    this.categories[index] = response.data;
                } else {
                    this.categories.push(response.data);
                }
                
                return this.currentCategory;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },
    }
});

// frontend/src/stores/authStore.js

import { defineStore } from 'pinia';
import { authAPI, saveTokens, clearTokens, isAuthenticated } from '@/services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        isStaff: (state) => state.user?.is_staff || false,
        isAdmin: (state) => state.user?.is_superuser || false,
        username: (state) => state.user?.username || null,
        email: (state) => state.user?.email || null,
    },

    actions: {
        /**
         * Логин
         */
        async login(credentials) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await authAPI.login(credentials);
                
                // Сохраняем токены
                saveTokens(response.data.access, response.data.refresh);
                
                // Получаем информацию о пользователе
                await this.fetchCurrentUser();
                
                return this.user;
            } catch (err) {
                this.error = err.response?.data?.detail || 'Ошибка входа';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Регистрация
         */
        async register(data) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await authAPI.register(data);
                
                // Если бэкенд возвращает токены сразу
                if (response.data.access && response.data.refresh) {
                    saveTokens(response.data.access, response.data.refresh);
                    await this.fetchCurrentUser();
                }
                
                return response.data;
            } catch (err) {
                this.error = err.response?.data || 'Ошибка регистрации';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Логаут
         */
        async logout() {
            this.loading = true;
            
            try {
                await authAPI.logout();
            } catch (err) {
                console.error('Logout error:', err);
            } finally {
                clearTokens();
                this.user = null;
                this.loading = false;
            }
        },

        /**
         * Получить текущего пользователя
         */
        async fetchCurrentUser() {
            if (!isAuthenticated()) {
                this.user = null;
                return null;
            }
            
            this.loading = true;
            this.error = null;
            
            try {
                const response = await authAPI.getCurrentUser();
                this.user = response.data;
                return this.user;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                
                if (err.response?.status === 401) {
                    clearTokens();
                    this.user = null;
                }
                
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Проверить авторизацию при загрузке приложения
         */
        async checkAuth() {
            if (isAuthenticated()) {
                await this.fetchCurrentUser();
            }
        },
    }
});

// frontend/src/stores/commentsStore.js

import { defineStore } from 'pinia';
import { activitiesAPI, commentsAPI } from '@/services/api';

export const useCommentsStore = defineStore('comments', {
    state: () => ({
        commentsByActivity: {}, // { activitySlug: [comments] }
        loading: false,
        error: null
    }),

    getters: {
        // Получить комментарии для конкретной активности
        getCommentsForActivity: (state) => (activitySlug) => {
            return state.commentsByActivity[activitySlug] || [];
        },
    },

    actions: {
        /**
         * Получить комментарии для активности
         */
        async fetchComments(activitySlug) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await activitiesAPI.getComments(activitySlug);
                this.commentsByActivity[activitySlug] = response.data;
                return response.data;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Добавить комментарий
         */
        async addComment(activitySlug, text) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await activitiesAPI.addComment(activitySlug, { text });
                
                // Добавляем в store
                if (!this.commentsByActivity[activitySlug]) {
                    this.commentsByActivity[activitySlug] = [];
                }
                this.commentsByActivity[activitySlug].push(response.data);
                
                return response.data;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Обновить комментарий
         */
        async updateComment(activitySlug, commentId, text) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await commentsAPI.update(activitySlug, commentId, { text });
                
                // Обновляем в store
                const comments = this.commentsByActivity[activitySlug];
                if (comments) {
                    const index = comments.findIndex(c => c.id === commentId);
                    if (index !== -1) {
                        comments[index] = response.data;
                    }
                }
                
                return response.data;
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Удалить комментарий
         */
        async deleteComment(activitySlug, commentId) {
            this.loading = true;
            this.error = null;
            
            try {
                await commentsAPI.delete(activitySlug, commentId);
                
                // Удаляем из store
                const comments = this.commentsByActivity[activitySlug];
                if (comments) {
                    this.commentsByActivity[activitySlug] = comments.filter(
                        c => c.id !== commentId
                    );
                }
            } catch (err) {
                this.error = err.response?.data?.detail || err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },
    }
});