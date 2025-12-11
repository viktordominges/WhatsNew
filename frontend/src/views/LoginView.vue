<template>
  <section class="login-page">
    <div class="login-container">
      <h1 class="login-title">SE CONNECTER</h1>

      <!-- Success/Error notifications -->
      <transition name="fade">
        <div v-if="notification.show" :class="['notification', notification.type]">
          {{ notification.message }}
        </div>
      </transition>

      <form @submit.prevent="handleSubmit" class="login-form">

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
          class="login-button"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'CONNEXION...' : 'SE CONNECTER' }}
        </button>
      </form>

      <!-- Links -->
      <div class="login-links">
        <router-link to="/forgot-password" class="link">Oublié votre mot de passe?</router-link>

        <p>
          Vous n'avez pas de compte?
          <router-link to="/register" class="link underline">S'enregistrer</router-link>
        </p>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
  type: 'success', // 'success' or 'error'
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
    // Здесь вызываешь своё API
    // const response = await loginAPI({ email: email.value, password: password.value })
    
    // Имитируем задержку
    await new Promise(resolve => setTimeout(resolve, 600))

    showNotification('success', 'Connexion réussie!')
    
    // Редирект на профиль через 1 секунду
    setTimeout(() => {
      router.push('/profile')
    }, 1000)

  } catch (e) {
    console.error('Login error:', e)
    showNotification('error', 'Une erreur est survenue.')
    formError.value = "Impossible de se connecter. Vérifiez vos identifiants."
  } finally {
    isSubmitting.value = false
  }
}
</script>


<style scoped>
.login-page {
  background-color: #e6f9fc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.login-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 50px 40px;
  max-width: 450px;
  width: 100%;
  position: relative;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  letter-spacing: 1px;
}

/* Notification styles */
.notification {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  text-align: center;
}

.notification.success {
  background-color: #4caf50;
  color: white;
}

.notification.error {
  background-color: #f44336;
  color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  outline: none;
}

.input-field:focus {
  border-color: #00a8cc;
}

.input-field.error {
  border-color: #ff4444;
}

.password-wrapper .input-field {
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #00a8cc;
}

.error-msg {
  color: #ff4444;
  font-size: 13px;
  margin: 0;
}

.form-error-msg {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

.login-button {
  background-color: #00a8cc;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  background-color: #008fb3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 168, 204, 0.3);
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 30px;
  text-align: center;
}

.link {
  color: #00a8cc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.link:hover {
  color: #008fb3;
}

.link.underline {
  text-decoration: underline;
}

.login-links p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

@media (max-width: 480px) {
  .login-container {
    padding: 40px 25px;
  }

  .login-title {
    font-size: 24px;
  }

  .notification {
    top: -50px;
    min-width: 180px;
    font-size: 13px;
    padding: 12px 20px;
  }
}
</style>
