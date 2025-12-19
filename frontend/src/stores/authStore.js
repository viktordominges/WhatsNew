// src/stores/authStore.js
import { defineStore } from 'pinia';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../api/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        access: localStorage.getItem('access') || null,
        refresh: localStorage.getItem('refresh') || null,
        loading: false,
        error: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.access,
        currentUser: (state) => state.user
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                const response = await loginUser(credentials);

                this.access = response.access;
                this.refresh = response.refresh;
                this.user = response.user;

                localStorage.setItem('access', response.access);
                localStorage.setItem('refresh', response.refresh);

                return response.user;
            } catch (error) {
                this.error = error.detail || 'Login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await registerUser(userData);

                this.access = response.access;
                this.refresh = response.refresh;
                this.user = response.user;

                localStorage.setItem('access', response.access);
                localStorage.setItem('refresh', response.refresh);

                return response.user;
            } catch (error) {
                this.error = error.detail || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                if (this.refresh) {
                    await logoutUser();
                }
            } catch (e) {
                console.warn('Logout failed', e);
            } finally {
                this.user = null;
                this.access = null;
                this.refresh = null;

                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            }
        },

        async checkAuth() {
            if (!this.access) return false

            this.loading = true
            try {
                this.user = await getCurrentUser()
                return true
            } catch (e) {
                await this.logout()
                return false
            } finally {
                this.loading = false
            }
        }

    }
});
