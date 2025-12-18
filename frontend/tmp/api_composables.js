// frontend/src/composables/useActivities.js

import { ref, computed } from 'vue';
import { activitiesAPI } from '@/services/api';

/**
 * Composable для работы с активностями
 */
export function useActivities() {
    const activities = ref([]);
    const currentActivity = ref(null);
    const loading = ref(false);
    const error = ref(null);
    
    // Computed для фильтрации
    const upcomingActivities = computed(() => {
        const now = new Date();
        return activities.value.filter(a => new Date(a.date) >= now);
    });
    
    const pastActivities = computed(() => {
        const now = new Date();
        return activities.value.filter(a => new Date(a.date) < now);
    });

    /**
     * Получить все активности
     */
    const fetchActivities = async (params = {}) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await activitiesAPI.getAll(params);
            activities.value = response.data.results || response.data;
            return activities.value;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Получить активность по slug
     */
    const fetchActivity = async (slug) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await activitiesAPI.getBySlug(slug);
            currentActivity.value = response.data;
            return currentActivity.value;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Создать активность
     */
    const createActivity = async (data) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await activitiesAPI.create(data);
            activities.value.push(response.data);
            return response.data;
        } catch (err) {
            error.value = err.response?.data || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Обновить активность
     */
    const updateActivity = async (slug, data) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await activitiesAPI.update(slug, data);
            
            // Обновляем в массиве
            const index = activities.value.findIndex(a => a.slug === slug);
            if (index !== -1) {
                activities.value[index] = response.data;
            }
            
            // Обновляем текущую если она открыта
            if (currentActivity.value?.slug === slug) {
                currentActivity.value = response.data;
            }
            
            return response.data;
        } catch (err) {
            error.value = err.response?.data || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Удалить активность
     */
    const deleteActivity = async (slug) => {
        loading.value = true;
        error.value = null;
        
        try {
            await activitiesAPI.delete(slug);
            
            // Удаляем из массива
            activities.value = activities.value.filter(a => a.slug !== slug);
            
            // Очищаем текущую если она удалена
            if (currentActivity.value?.slug === slug) {
                currentActivity.value = null;
            }
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        activities,
        currentActivity,
        loading,
        error,
        
        // Computed
        upcomingActivities,
        pastActivities,
        
        // Actions
        fetchActivities,
        fetchActivity,
        createActivity,
        updateActivity,
        deleteActivity
    };
}

// frontend/src/composables/useComments.js

import { ref } from 'vue';
import { activitiesAPI, commentsAPI } from '@/services/api';

/**
 * Composable для работы с комментариями
 */
export function useComments(activitySlug) {
    const comments = ref([]);
    const loading = ref(false);
    const error = ref(null);

    /**
     * Получить все комментарии
     */
    const fetchComments = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await activitiesAPI.getComments(activitySlug);
            comments.value = response.data;
            return comments.value;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Добавить комментарий
     */
    const addComment = async (text) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await activitiesAPI.addComment(activitySlug, { text });
            comments.value.push(response.data);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Обновить комментарий
     */
    const updateComment = async (commentId, text) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await commentsAPI.update(activitySlug, commentId, { text });
            
            // Обновляем в массиве
            const index = comments.value.findIndex(c => c.id === commentId);
            if (index !== -1) {
                comments.value[index] = response.data;
            }
            
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Удалить комментарий
     */
    const deleteComment = async (commentId) => {
        loading.value = true;
        error.value = null;
        
        try {
            await commentsAPI.delete(activitySlug, commentId);
            
            // Удаляем из массива (soft delete на бэке, убираем с фронта)
            comments.value = comments.value.filter(c => c.id !== commentId);
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        comments,
        loading,
        error,
        
        // Actions
        fetchComments,
        addComment,
        updateComment,
        deleteComment
    };
}

// frontend/src/composables/useCategories.js

import { ref } from 'vue';
import { categoriesAPI } from '@/services/api';

/**
 * Composable для работы с категориями
 */
export function useCategories() {
    const categories = ref([]);
    const currentCategory = ref(null);
    const loading = ref(false);
    const error = ref(null);

    /**
     * Получить все категории
     */
    const fetchCategories = async (params = {}) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await categoriesAPI.getAll(params);
            categories.value = response.data.results || response.data;
            return categories.value;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Получить категорию по slug
     */
    const fetchCategory = async (slug) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await categoriesAPI.getBySlug(slug);
            currentCategory.value = response.data;
            return currentCategory.value;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Получить активности категории
     */
    const fetchCategoryActivities = async (slug) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await categoriesAPI.getActivities(slug);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        categories,
        currentCategory,
        loading,
        error,
        
        // Actions
        fetchCategories,
        fetchCategory,
        fetchCategoryActivities
    };
}

// frontend/src/composables/useAuth.js

import { ref, computed } from 'vue';
import { authAPI, saveTokens, clearTokens, isAuthenticated } from '@/services/api';

/**
 * Composable для работы с аутентификацией
 */
export function useAuth() {
    const user = ref(null);
    const loading = ref(false);
    const error = ref(null);
    
    const isLoggedIn = computed(() => isAuthenticated() && user.value !== null);
    const isStaff = computed(() => user.value?.is_staff || false);

    /**
     * Логин
     */
    const login = async (credentials) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await authAPI.login(credentials);
            
            // Сохраняем токены
            saveTokens(response.data.access, response.data.refresh);
            
            // Получаем информацию о пользователе
            await fetchCurrentUser();
            
            return user.value;
        } catch (err) {
            error.value = err.response?.data?.detail || 'Ошибка входа';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Регистрация
     */
    const register = async (data) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await authAPI.register(data);
            
            // После регистрации логинимся
            if (response.data.access && response.data.refresh) {
                saveTokens(response.data.access, response.data.refresh);
                await fetchCurrentUser();
            }
            
            return response.data;
        } catch (err) {
            error.value = err.response?.data || 'Ошибка регистрации';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Логаут
     */
    const logout = async () => {
        loading.value = true;
        
        try {
            await authAPI.logout();
        } catch (err) {
            // Игнорируем ошибки логаута
            console.error('Logout error:', err);
        } finally {
            // Очищаем токены и пользователя
            clearTokens();
            user.value = null;
            loading.value = false;
        }
    };

    /**
     * Получить текущего пользователя
     */
    const fetchCurrentUser = async () => {
        if (!isAuthenticated()) {
            user.value = null;
            return null;
        }
        
        loading.value = true;
        error.value = null;
        
        try {
            const response = await authAPI.getCurrentUser();
            user.value = response.data;
            return user.value;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            
            // Если ошибка 401 - очищаем токены
            if (err.response?.status === 401) {
                clearTokens();
                user.value = null;
            }
            
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Проверить авторизацию при загрузке приложения
     */
    const checkAuth = async () => {
        if (isAuthenticated()) {
            await fetchCurrentUser();
        }
    };

    return {
        // State
        user,
        loading,
        error,
        
        // Computed
        isLoggedIn,
        isStaff,
        
        // Actions
        login,
        register,
        logout,
        fetchCurrentUser,
        checkAuth
    };
}

// frontend/src/composables/useSearch.js

import { ref, watch } from 'vue';
import { activitiesAPI } from '@/services/api';

/**
 * Composable для поиска и фильтрации активностей
 */
export function useSearch() {
    const query = ref('');
    const filters = ref({
        category: null,
        organizer: null,
        dateFrom: null,
        dateTo: null,
        price: null,      // 'free' | 'paid' | null
        filter: 'upcoming', // 'upcoming' | 'past' | null
        ordering: '-date'
    });
    
    const results = ref([]);
    const loading = ref(false);
    const error = ref(null);

    /**
     * Выполнить поиск
     */
    const search = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const params = {
                search: query.value,
                ...filters.value
            };
            
            // Удаляем пустые параметры
            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === '') {
                    delete params[key];
                }
            });
            
            const response = await activitiesAPI.getAll(params);
            results.value = response.data.results || response.data;
            return results.value;
        } catch (err) {
            error.value = err.response?.data?.detail || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Сбросить фильтры
     */
    const resetFilters = () => {
        filters.value = {
            category: null,
            organizer: null,
            dateFrom: null,
            dateTo: null,
            price: null,
            filter: 'upcoming',
            ordering: '-date'
        };
    };

    /**
     * Установить фильтр категории
     */
    const setCategory = (categoryId) => {
        filters.value.category = categoryId;
    };

    /**
     * Установить фильтр цены
     */
    const setPriceFilter = (priceFilter) => {
        filters.value.price = priceFilter;
    };

    return {
        // State
        query,
        filters,
        results,
        loading,
        error,
        
        // Actions
        search,
        resetFilters,
        setCategory,
        setPriceFilter
    };
}