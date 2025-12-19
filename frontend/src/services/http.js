// src/services/http.js
import { refreshToken } from '../api/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function apiRequest(endpoint, options = {}, retry = true) {
    let accessToken = localStorage.getItem('access');

    const config = {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...options.headers
        }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401 && retry && accessToken) {
        // Access token истек — обновляем
        try {
            const newAccess = await refreshToken();
            accessToken = newAccess;
            config.headers.Authorization = `Bearer ${newAccess}`;
            return apiRequest(endpoint, options, false); // повтор запроса один раз
        } catch (err) {
            // Если refresh не сработал — чистим токены
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            throw { detail: 'Authentication failed' };
        }
    }

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { detail: response.statusText || 'Unknown error' };
        }
        throw errorData;
    }

    try {
        return await response.json();
    } catch {
        return null; // если нет тела ответа
    }
}
