// API для организаторов
import { apiRequest } from '@/services/http.js'

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