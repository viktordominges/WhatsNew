// src/api/avatar.js

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export async function uploadAvatar(file) {
    const token = localStorage.getItem('access');

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: 'PATCH',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}
