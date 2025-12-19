// src/api/profile.js

import { apiRequest } from './http';

/* ============================
   GET PROFILE
============================ */
export async function getProfile() {
    return apiRequest('/auth/profile/');
}

/* ============================
   UPDATE PROFILE
============================ */
export async function updateProfile(data) {
    return apiRequest('/auth/profile/', {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

/* ============================
   CHANGE PASSWORD
============================ */
export async function changePassword(data) {
    return apiRequest('/auth/change-password/', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}
