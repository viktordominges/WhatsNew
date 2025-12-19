<template>
    <section class="auth-page">
        <div class="auth-container">
        <h2 class="auth-title">SE CONNECTER</h2>

        <!-- Success/Error notifications -->
        <transition name="fade">
            <div v-if="notification.show" :class="['notification', notification.type]">
            {{ notification.message }}
            </div>
        </transition>

        <form @submit.prevent="handleSubmit" class="auth-form">

            <!-- Email -->
            <div class="form-group">
                <input
                    type="email"
                    v-model.trim="email"
                    class="input-field"
                    :class="{ error: errors.email }"
                    placeholder="Adresse e-mail *"
                    @blur="validateEmail"
                    required
                />
                <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="form-group">
                <div class="password-wrapper">
                    <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    class="input-field"
                    :class="{ error: errors.password }"
                    placeholder="Mot de passe *"
                    @blur="validatePassword"
                    required
                    />

                    <button 
                    type="button" 
                    class="password-toggle" 
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                    >
                    <svg
                        v-if="!showPassword"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>

                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a20.26 20.26 0 0 1 4.11-5.44"/>
                        <path d="M1 1l22 22"/>
                        <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/>
                        <path d="M21.17 21.17A20.26 20.26 0 0 0 23 12s-4-7-11-7a10.08 10.08 0 0 0-5.52 1.61"/>
                    </svg>
                    </button>
                </div>
                <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>
            </div>

            <!-- General error message -->
            <p v-if="formError" class="form-error-msg">{{ formError }}</p>

            <!-- Submit button -->
            <button 
            type="submit" 
            class="btn primary-form-btn"
            :disabled="isSubmitting"
            >
            {{ isSubmitting ? 'CONNEXION...' : 'SE CONNECTER' }}
            </button>
        </form>

        <!-- Links -->
        <div class="auth-links">
            <RouterLink to="/forgot-password" class="link">Oublié votre mot de passe?</RouterLink>

            <p>
                Vous n'avez pas de compte?
                <RouterLink to="/register" class="link underline">S'enregistrer</RouterLink>
            </p>
        </div>
        </div>
    </section>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'  // <-- импорт Pinia store

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)

const errors = ref({
    email: '',
    password: ''
})

const formError = ref('')

// Notification system
const notification = ref({
    show: false,
    type: 'success',
    message: ''
})

function showNotification(type, message) {
    notification.value = {
        show: true,
        type,
        message
    }
    
    setTimeout(() => {
        notification.value.show = false
    }, 3000)
}

function validateEmail() {
    const value = email.value.trim()
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!value) {
        errors.value.email = "L'email est obligatoire."
    } else if (!regex.test(value)) {
        errors.value.email = "L'adresse e-mail n'est pas valide."
    } else {
        errors.value.email = ''
    }
}

function validatePassword() {
    const value = password.value

    if (!value) {
        errors.value.password = "Le mot de passe est obligatoire."
    } else if (value.length < 6) {
        errors.value.password = "Le mot de passe doit contenir au moins 6 caractères."
    } else {
        errors.value.password = ''
    }
}

async function handleSubmit() {
    validateEmail()
    validatePassword()

    if (errors.value.email || errors.value.password) {
        formError.value = "Veuillez corriger les erreurs avant de continuer."
        showNotification('error', 'Formulaire invalide')
        return
    }

    formError.value = ''
    isSubmitting.value = true

    try {
        // Вызов Pinia store для логина
        await useAuthStore().login({
        email: email.value,
        password: password.value
        })

        showNotification('success', 'Connexion réussie!')

        setTimeout(() => {
        router.push('/dashboard')  // редирект после успешного логина
        }, 1000)

    } catch (e) {
        console.error('Login error:', e)
        showNotification('error', e.detail || 'Une erreur est survenue.')
        formError.value = "Impossible de se connecter. Vérifiez vos identifiants."
    } finally {
        isSubmitting.value = false
    }
}

</script>


<style scoped>
@import '@/assets/styles/auth.css';
</style>