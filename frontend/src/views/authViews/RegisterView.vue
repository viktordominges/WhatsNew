<template>
  <section class="auth-page">
    <div class="auth-container">
      <h2 class="auth-title">S'ENREGISTRER</h2>

      <!-- Success/Error notifications -->
      <transition name="fade">
        <div v-if="notification.show" :class="['notification', notification.type]">
          {{ notification.message }}
        </div>
      </transition>

      <form @submit.prevent="handleSubmit" class="auth-form">

        <!-- Username -->
        <div class="form-group">
          <input
            type="text"
            v-model.trim="username"
            class="input-field"
            :class="{ error: errors.username }"
            placeholder="Nom d'utilisateur *"
            @blur="validateUsername"
            required
          />
          <p v-if="errors.username" class="error-msg">{{ errors.username }}</p>
        </div>

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
              @input="checkPasswordStrength"
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
          
          <!-- Password strength indicator -->
          <div v-if="password" class="password-strength">
            <div 
              class="strength-bar" 
              :class="{ active: passwordStrength >= 1, [strengthLevel]: passwordStrength >= 1 }"
            ></div>
            <div 
              class="strength-bar" 
              :class="{ active: passwordStrength >= 2, [strengthLevel]: passwordStrength >= 2 }"
            ></div>
            <div 
              class="strength-bar" 
              :class="{ active: passwordStrength >= 3, [strengthLevel]: passwordStrength >= 3 }"
            ></div>
            <div 
              class="strength-bar" 
              :class="{ active: passwordStrength >= 4, [strengthLevel]: passwordStrength >= 4 }"
            ></div>
          </div>
          <p v-if="password && strengthText" :class="['strength-text', strengthLevel]">
            {{ strengthText }}
          </p>
          
          <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <div class="password-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              class="input-field"
              :class="{ error: errors.confirmPassword }"
              placeholder="Confirmer le mot de passe *"
              @blur="validateConfirmPassword"
              required
            />

            <button 
              type="button" 
              class="password-toggle" 
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            >
              <svg
                v-if="!showConfirmPassword"
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
          <p v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</p>
        </div>

        <!-- General error message -->
        <p v-if="formError" class="form-error-msg">{{ formError }}</p>

        <!-- Submit button -->
        <button 
          type="submit" 
          class="btn primary-form-btn"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'INSCRIPTION...' : "S'ENREGISTRER" }}
        </button>
      </form>

      <!-- Links -->
      <div class="auth-links">
        <p>
          Vous avez déjà un compte?
          <RouterLink to="/login" class="link underline">Se connecter</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>

 
<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const passwordStrength = ref(0)

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
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

// Password strength
const strengthLevel = computed(() => {
  if (passwordStrength.value <= 1) return 'weak'
  if (passwordStrength.value <= 2) return 'medium'
  return 'strong'
})

const strengthText = computed(() => {
  if (passwordStrength.value <= 1) return 'Faible'
  if (passwordStrength.value <= 2) return 'Moyen'
  if (passwordStrength.value <= 3) return 'Fort'
  return 'Très fort'
})

function checkPasswordStrength() {
  const pwd = password.value
  let strength = 0

  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++

  passwordStrength.value = strength
}

// Validation functions
function validateUsername() {
  const value = username.value.trim()

  if (!value) {
    errors.value.username = "Le nom d'utilisateur est obligatoire."
  } else if (value.length < 2) {
    errors.value.username = "Le nom d'utilisateur doit contenir au moins 2 caractères."
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    errors.value.username = "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores."
  } else {
    errors.value.username = ''
  }
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
  } else if (value.length < 8) {
    errors.value.password = "Le mot de passe doit contenir au moins 8 caractères."
  } else if (passwordStrength.value < 2) {
    errors.value.password = "Le mot de passe est trop faible. Ajoutez des majuscules, chiffres ou caractères spéciaux."
  } else {
    errors.value.password = ''
  }
}

function validateConfirmPassword() {
  if (!confirmPassword.value) {
    errors.value.confirmPassword = "La confirmation du mot de passe est obligatoire."
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = "Les mots de passe ne correspondent pas."
  } else {
    errors.value.confirmPassword = ''
  }
}

async function handleSubmit() {
  validateUsername()
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  if (errors.value.username || errors.value.email || errors.value.password || errors.value.confirmPassword) {
    formError.value = "Veuillez corriger les erreurs avant de continuer."
    showNotification('error', 'Formulaire invalide')
    return
  }

  formError.value = ''
  isSubmitting.value = true

  try {
    // API call here
    // const response = await registerAPI({ username: username.value, email: email.value, password: password.value })
    
    await new Promise(resolve => setTimeout(resolve, 800))

    showNotification('success', 'Inscription réussie!')
    
    setTimeout(() => {
      router.push('/login')
    }, 1500)

  } catch (e) {
    console.error('Registration error:', e)
    showNotification('error', 'Une erreur est survenue.')
    formError.value = "Impossible de créer le compte. Réessayez."
  } finally {
    isSubmitting.value = false
  }
}
</script>


<style scoped>
@import '@/assets/styles/auth.css';
</style>
