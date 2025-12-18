import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        username: localStorage.getItem('username') || null,
        email: localStorage.getItem('email') || null,
        loading: false,
        error: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        currentUser: (state) => state.user
    },

    actions: {
        async checkAuth() {
            if (!this.token) {
                return false;
            }

            try {
                // TODO: Проверка токена на бэкенде
                // const response = await fetch('/api/v1/auth/me', {
                //     headers: { 'Authorization': `Bearer ${this.token}` }
                // });
                // if (response.ok) {
                //     this.user = await response.json();
                //     return true;
                // }
                
                // Временная заглушка
                return !!this.token;
            } catch (error) {
                this.logout();
                return false;
            }
        },

        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                // TODO: Реальный API запрос
                // const response = await fetch('/api/v1/auth/login', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(credentials)
                // });
                
                // Временная заглушка
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const mockToken = 'mock-token-' + Date.now();
                const mockUser = {
                    username: credentials.email.split('@')[0],
                    email: credentials.email
                };

                this.token = mockToken;
                this.user = mockUser;
                this.username = mockUser.username;
                this.email = mockUser.email;

                localStorage.setItem('token', mockToken);
                localStorage.setItem('username', mockUser.username);
                localStorage.setItem('email', mockUser.email);

                return mockUser;
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;

            try {
                // TODO: Реальный API запрос
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // После успешной регистрации можно сразу логинить
                return await this.login({
                    email: userData.email,
                    password: userData.password
                });
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.username = null;
            this.email = null;
            
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
        }
    }
});