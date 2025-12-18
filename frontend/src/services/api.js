const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Общий метод для API запросов
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

// API для организаторов
export const organizersAPI = {
    getAll: () => apiRequest('/organizers/'),
    getBySlug: (slug) => apiRequest(`/organizers/${slug}/`),
    create: (data) => apiRequest('/organizers/', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (slug, data) => apiRequest(`/organizers/${slug}/`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (slug) => apiRequest(`/organizers/${slug}/`, {
        method: 'DELETE'
    })
};

// API для событий
export const activitiesAPI = {
    getAll: () => apiRequest('/activities/'),
    getBySlug: (slug) => apiRequest(`/activities/${slug}/`),
    create: (data) => apiRequest('/activities/', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (slug, data) => apiRequest(`/activities/${slug}/`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (slug) => apiRequest(`/activities/${slug}/`, {
        method: 'DELETE'
    })
};