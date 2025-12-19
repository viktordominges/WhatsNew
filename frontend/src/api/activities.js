// API для событий
import { apiRequest } from '@/services/http.js'

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