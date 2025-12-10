// frontend/src/services/api.js

import axios from 'axios';

// ============================================================================
// КОНФИГУРАЦИЯ AXIOS
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 секунд
});

// ============================================================================
// INTERCEPTORS - Перехватчики запросов и ответов
// ============================================================================

// Перехватчик запросов - добавляет токен авторизации
apiClient.interceptors.request.use(
    (config) => {
        // Получаем токен из localStorage
        const token = localStorage.getItem('access_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Перехватчик ответов - обрабатывает ошибки
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если 401 и это не повторный запрос - пытаемся обновить токен
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                if (refreshToken) {
                    // Обновляем токен
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/token/refresh/`,
                        { refresh: refreshToken }
                    );

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);

                    // Повторяем оригинальный запрос с новым токеном
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Если обновление токена не удалось - разлогиниваем
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ============================================================================
// CATEGORIES API
// ============================================================================

export const categoriesAPI = {
    /**
     * Получить все категории
     * GET /api/v1/categories/
     * 
     * Query params:
     * - search: поиск по названию
     * - ordering: сортировка (name, -name, created_at, -created_at)
     */
    getAll(params = {}) {
        return apiClient.get('/categories/', { params });
    },

    /**
     * Получить категорию по slug
     * GET /api/v1/categories/{slug}/
     */
    getBySlug(slug) {
        return apiClient.get(`/categories/${slug}/`);
    },

    /**
     * Получить все активности категории
     * GET /api/v1/categories/{slug}/activities/
     * 
     * Возвращает только опубликованные активности с date >= сегодня
     */
    getActivities(slug) {
        return apiClient.get(`/categories/${slug}/activities/`);
    },

    /**
     * Создать категорию (только admin)
     * POST /api/v1/categories/
     * 
     * Body: { name, slug, description, icon }
     */
    create(data) {
        return apiClient.post('/categories/', data);
    },

    /**
     * Обновить категорию (только admin)
     * PUT/PATCH /api/v1/categories/{slug}/
     */
    update(slug, data) {
        return apiClient.patch(`/categories/${slug}/`, data);
    },

    /**
     * Удалить категорию (только admin)
     * DELETE /api/v1/categories/{slug}/
     */
    delete(slug) {
        return apiClient.delete(`/categories/${slug}/`);
    },
};

// ============================================================================
// ORGANIZERS API
// ============================================================================

export const organizersAPI = {
    /**
     * Получить всех организаторов
     * GET /api/v1/organizers/
     * 
     * Query params:
     * - search: поиск по названию
     * - ordering: сортировка (name, -name, created_at, -created_at)
     * 
     * Note: Обычные пользователи видят только публичную информацию,
     * staff/admin видят полную информацию
     */
    getAll(params = {}) {
        return apiClient.get('/organizers/', { params });
    },

    /**
     * Получить организатора по slug
     * GET /api/v1/organizers/{slug}/
     */
    getBySlug(slug) {
        return apiClient.get(`/organizers/${slug}/`);
    },

    /**
     * Получить все активности организатора
     * GET /api/v1/organizers/{slug}/activities/
     * 
     * staff видит все активности, остальные - только published с date >= сегодня
     */
    getActivities(slug) {
        return apiClient.get(`/organizers/${slug}/activities/`);
    },

    /**
     * Создать организатора (требуется авторизация)
     * POST /api/v1/organizers/
     * 
     * Body: { name, slug, description, email, phone, website, logo }
     */
    create(data) {
        return apiClient.post('/organizers/', data);
    },

    /**
     * Обновить организатора (требуется авторизация)
     * PATCH /api/v1/organizers/{slug}/
     */
    update(slug, data) {
        return apiClient.patch(`/organizers/${slug}/`, data);
    },

    /**
     * Удалить организатора (только admin)
     * DELETE /api/v1/organizers/{slug}/
     */
    delete(slug) {
        return apiClient.delete(`/organizers/${slug}/`);
    },
};

// ============================================================================
// ACTIVITIES API
// ============================================================================

export const activitiesAPI = {
    /**
     * Получить все активности
     * GET /api/v1/activities/
     * 
     * Query params:
     * - category: фильтр по категории (id)
     * - organizer: фильтр по организатору (id)
     * - status: фильтр по статусу (draft/published/cancelled)
     * - search: поиск по названию, описанию
     * - ordering: сортировка (date, -date, created_at, -created_at, views_count, -views_count, price, -price)
     * - date_from: фильтр от даты (YYYY-MM-DD)
     * - date_to: фильтр до даты (YYYY-MM-DD)
     * - filter: upcoming (будущие) / past (прошедшие)
     * - price: free (бесплатные) / paid (платные)
     * 
     * Note: Обычные пользователи видят только published активности
     */
    getAll(params = {}) {
        return apiClient.get('/activities/', { params });
    },

    /**
     * Получить активность по slug
     * GET /api/v1/activities/{slug}/
     * 
     * Увеличивает счетчик просмотров для published активностей
     * (кроме просмотров автора)
     */
    getBySlug(slug) {
        return apiClient.get(`/activities/${slug}/`);
    },

    /**
     * Создать активность (требуется авторизация)
     * POST /api/v1/activities/
     * 
     * Body: {
     *   name, slug, summary, description, date, time,
     *   category, organizer, price, image, status
     * }
     */
    create(data) {
        return apiClient.post('/activities/', data);
    },

    /**
     * Обновить активность (только автор)
     * PATCH /api/v1/activities/{slug}/
     */
    update(slug, data) {
        return apiClient.patch(`/activities/${slug}/`, data);
    },

    /**
     * Удалить активность (только автор)
     * DELETE /api/v1/activities/{slug}/
     */
    delete(slug) {
        return apiClient.delete(`/activities/${slug}/`);
    },

    // ========================================================================
    // ADDRESS - Работа с адресом активности
    // ========================================================================

    /**
     * Получить адрес активности
     * GET /api/v1/activities/{slug}/address/
     */
    getAddress(slug) {
        return apiClient.get(`/activities/${slug}/address/`);
    },

    /**
     * Создать или обновить адрес активности (только автор)
     * POST/PATCH /api/v1/activities/{slug}/address_update/
     * 
     * Body: {
     *   street, city, postal_code, country,
     *   latitude, longitude, place_name
     * }
     */
    updateAddress(slug, data) {
        return apiClient.post(`/activities/${slug}/address_update/`, data);
    },

    /**
     * Удалить адрес активности (только автор)
     * DELETE /api/v1/activities/{slug}/address_delete/
     */
    deleteAddress(slug) {
        return apiClient.delete(`/activities/${slug}/address_delete/`);
    },

    // ========================================================================
    // COMMENTS - Работа с комментариями через activity
    // ========================================================================

    /**
     * Получить комментарии активности
     * GET /api/v1/activities/{slug}/comments/
     * 
     * Возвращает только активные комментарии
     */
    getComments(slug) {
        return apiClient.get(`/activities/${slug}/comments/`);
    },

    /**
     * Добавить комментарий к активности (требуется авторизация)
     * POST /api/v1/activities/{slug}/add_comment/
     * 
     * Body: { text }
     * 
     * Note: Можно комментировать только published активности
     */
    addComment(slug, data) {
        return apiClient.post(`/activities/${slug}/add_comment/`, data);
    },
};

// ============================================================================
// COMMENTS API (NESTED ROUTES)
// ============================================================================

export const commentsAPI = {
    /**
     * Получить все комментарии для активности
     * GET /api/v1/activities/{activity_slug}/comments/
     */
    getAll(activitySlug) {
        return apiClient.get(`/activities/${activitySlug}/comments/`);
    },

    /**
     * Получить конкретный комментарий
     * GET /api/v1/activities/{activity_slug}/comments/{id}/
     */
    getById(activitySlug, commentId) {
        return apiClient.get(`/activities/${activitySlug}/comments/${commentId}/`);
    },

    /**
     * Создать комментарий (требуется авторизация)
     * POST /api/v1/activities/{activity_slug}/comments/
     * 
     * Body: { text }
     */
    create(activitySlug, data) {
        return apiClient.post(`/activities/${activitySlug}/comments/`, data);
    },

    /**
     * Обновить комментарий (только автор)
     * PATCH /api/v1/activities/{activity_slug}/comments/{id}/
     * 
     * Body: { text }
     */
    update(activitySlug, commentId, data) {
        return apiClient.patch(`/activities/${activitySlug}/comments/${commentId}/`, data);
    },

    /**
     * Удалить комментарий (только автор) - soft delete
     * DELETE /api/v1/activities/{activity_slug}/comments/{id}/
     * 
     * Note: Комментарий не удаляется физически, а помечается как неактивный
     */
    delete(activitySlug, commentId) {
        return apiClient.delete(`/activities/${activitySlug}/comments/${commentId}/`);
    },
};

// ============================================================================
// AUTH API (предполагаемые endpoints из apps.accounts.urls)
// ============================================================================

export const authAPI = {
    /**
     * Регистрация пользователя
     * POST /api/v1/auth/register/
     * 
     * Body: { username, email, password, password2 }
     */
    register(data) {
        return apiClient.post('/auth/register/', data);
    },

    /**
     * Логин (получение токенов)
     * POST /api/v1/auth/login/ или /api/v1/auth/token/
     * 
     * Body: { username, password }
     * Response: { access, refresh }
     */
    login(credentials) {
        return apiClient.post('/auth/login/', credentials);
    },

    /**
     * Обновление access токена
     * POST /api/v1/auth/token/refresh/
     * 
     * Body: { refresh }
     * Response: { access }
     */
    refreshToken(refreshToken) {
        return apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
    },

    /**
     * Логаут (опционально, если есть на бэкенде)
     * POST /api/v1/auth/logout/
     */
    logout() {
        return apiClient.post('/auth/logout/');
    },

    /**
     * Получить информацию о текущем пользователе
     * GET /api/v1/auth/me/ или /api/v1/auth/user/
     */
    getCurrentUser() {
        return apiClient.get('/auth/me/');
    },
};

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Сохранить токены после логина
 */
export const saveTokens = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
};

/**
 * Удалить токены при логауте
 */
export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

/**
 * Проверить, авторизован ли пользователь
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

// Экспортируем apiClient для прямого использования если нужно
export default apiClient;