// src/api/auth.js

import { apiRequest } from '../services/http';

/* ============================
   REGISTER
============================ */
export async function registerUser(data) {
    return apiRequest('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/* ============================
   LOGIN
============================ */
export async function loginUser(data) {
    const response = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(data)
    });

    localStorage.setItem('access', response.access);
    localStorage.setItem('refresh', response.refresh);

    return response;
}

/* ============================
   LOGOUT
============================ */
export async function logoutUser() {
    const refresh = localStorage.getItem('refresh');

    await apiRequest('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refresh })
    });

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
}

/* ============================
   REFRESH TOKEN
============================ */
export async function refreshToken() {
    const refresh = localStorage.getItem('refresh');

    const response = await apiRequest('/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh })
    });

    localStorage.setItem('access', response.access);
    return response.access;
}


/* ============================
   GET CURRENT USER
============================ */
export async function getCurrentUser() {
    return apiRequest('/auth/profile/', {
        method: 'GET'
    })
}
