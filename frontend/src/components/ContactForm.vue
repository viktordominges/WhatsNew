<script setup>
import { ref, computed, reactive } from 'vue';

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
    // Опциональный API endpoint (по умолчанию /api/v1/contact/)
    apiEndpoint: {
        type: String,
        default: '/api/v1/contact/'
    }
});

const emit = defineEmits(['success', 'error']);

// ============================================================================
// STATE
// ============================================================================

const form = reactive({
    username: '',
    email: '',
    topic: '',
    text: ''
});

const loading = ref(false);
const success = ref(false);
const errors = reactive({
    username: '',
    email: '',
    topic: '',
    text: '',
    general: ''
});

// ============================================================================
// COMPUTED
// ============================================================================

// Количество символов в тексте
const textLength = computed(() => form.text.length);

// Осталось символов до максимума
const remainingChars = computed(() => {
    return 1000 - textLength.value;
});

// Прогресс заполнения текста (0-100%)
const textProgress = computed(() => {
    return (textLength.value / 1000) * 100;
});

// Проверка превышения лимита
const isOverLimit = computed(() => {
    return textLength.value >= 1000;
});

// Валидация формы
const isFormValid = computed(() => {
    return (
        form.username.trim().length > 0 &&
        isValidEmail(form.email) &&
        form.topic.trim().length > 0 &&
        form.text.trim().length > 0 &&
        form.text.trim().length <= 1000
    );
});

// ============================================================================
// METHODS
// ============================================================================

/**
 * Валидация email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Очистить ошибки
 */
function clearErrors() {
    errors.username = '';
    errors.email = '';
    errors.topic = '';
    errors.text = '';
    errors.general = '';
}

/**
 * Валидация поля username
 */
function validateUsername() {
    if (!form.username.trim()) {
        errors.username = 'Le nom est requis.';
        return false;
    }
    if (form.username.trim().length < 2) {
        errors.username = 'Le nom doit contenir au moins 2 caractères.';
        return false;
    }
    errors.username = '';
    return true;
}

/**
 * Валидация поля email
 */
function validateEmail() {
    if (!form.email.trim()) {
        errors.email = 'Email est requis.';
        return false;
    }
    if (!isValidEmail(form.email)) {
        errors.email = "S'il vous plaît, mettez une adresse email valide.";
        return false;
    }
    errors.email = '';
    return true;
}

/**
 * Валидация поля topic
 */
function validateTopic() {
    if (!form.topic.trim()) {
        errors.topic = 'Le sujet est obligatoire.';
        return false;
    }
    if (form.topic.trim().length < 5) {
        errors.topic = 'Le sujet doit comporter au moins 5 caractères.';
        return false;
    }
    errors.topic = '';
    return true;
}

/**
 * Валидация поля text
 */
function validateText() {
    if (!form.text.trim()) {
        errors.text = 'Le message est obligatoire.';
        return false;
    }
    if (form.text.trim().length < 10) {
        errors.text = 'Le texte doit contenir au moins 10 caractères.';
        return false;
    }
    if (form.text.trim().length > 1000) {
        errors.text = `Limite de caractères dépassée. Supprimez ${form.text.trim().length - 1000} caractères.`;
        return false;
    }
    errors.text = '';
    return true;
}

/**
 * Валидация всей формы
 */
function validateForm() {
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isTopicValid = validateTopic();
    const isTextValid = validateText();
    
    return isUsernameValid && isEmailValid && isTopicValid && isTextValid;
}

/**
 * Отправка формы
 */
async function submitForm() {
    // Очищаем предыдущие ошибки
    clearErrors();
    success.value = false;
    
    // Валидируем форму
    if (!validateForm()) {
        return;
    }
    
    loading.value = true;
    
    try {
        // Отправляем данные на сервер
        const response = await fetch(props.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        });
        
        if (!response.ok) {
            // Обрабатываем ошибки валидации от сервера
            const errorData = await response.json();
            
            if (errorData.username) errors.username = errorData.username[0];
            if (errorData.email) errors.email = errorData.email[0];
            if (errorData.topic) errors.topic = errorData.topic[0];
            if (errorData.text) errors.text = errorData.text[0];
            if (errorData.detail) errors.general = errorData.detail;
            
            emit('error', errorData);
            return;
        }
        
        const data = await response.json();
        
        // Успешная отправка
        success.value = true;
        emit('success', data);
        
        // Очищаем форму через 2 секунды
        setTimeout(() => {
            resetForm();
        }, 2000);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        errors.general = "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer plus tard.";
        emit('error', error);
    } finally {
        loading.value = false;
    }
}

/**
 * Сброс формы
 */
function resetForm() {
    form.username = '';
    form.email = '';
    form.topic = '';
    form.text = '';
    clearErrors();
    success.value = false;
}

// ============================================================================
// EXPOSE (опционально, для доступа извне)
// ============================================================================

defineExpose({
    resetForm,
    submitForm
});
</script>

<template>
    <div class="contact-form">

        <!-- Сообщение об успешной отправке -->
        <div v-if="success" class="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3>Message envoyé !</h3>
            <p>Merci pour votre message. Nous vous répondrons prochainement.</p>
        </div>

        <!-- Общая ошибка -->
        <div v-if="errors.general" class="error-message general">
            {{ errors.general }}
        </div>

        <!-- Форма -->
        <form @submit.prevent="submitForm" class="form" :class="{ 'form-disabled': success }">
            
            <!-- Username -->
            <div class="form-group">
                <label for="username" class="form-label">
                    Votre nom <span class="required">*</span>
                </label>
                <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.username }"
                    placeholder="John Doe"
                    @blur="validateUsername"
                    :disabled="loading || success"
                />
                <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
            </div>

            <!-- Email -->
            <div class="form-group">
                <label for="email" class="form-label">
                    Email adresse <span class="required">*</span>
                </label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    :class="{ 'input-error': errors.email }"
                    placeholder="example@email.com"
                    @blur="validateEmail"
                    :disabled="loading || success"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <!-- Topic -->
            <div class="form-group">
                <label for="topic" class="form-label">
                    Sujet du message <span class="required">*</span>
                </label>
                <input
                    id="topic"
                    v-model="form.topic"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.topic }"
                    placeholder="De quoi voulez-vous écrire ?"
                    @blur="validateTopic"
                    :disabled="loading || success"
                />
                <span v-if="errors.topic" class="error-text">{{ errors.topic }}</span>
            </div>

            <!-- Text -->
            <div class="form-group">
                <label for="text" class="form-label">
                    Votre message <span class="required">*</span>
                </label>

                <textarea
                    id="text"
                    v-model="form.text"
                    class="form-textarea"
                    :class="{ 'input-error': errors.text || isOverLimit }"
                    placeholder="Rédigez votre message (minimum 10, maximum 1000 caractères)..."
                    rows="10"
                    @blur="validateText"
                    @input="validateText"
                    :disabled="loading || success"
                    maxlength="1000"
                ></textarea>
                
                <!-- Информация о символах -->
                <div class="char-info" :class="{ 'char-info-error': isOverLimit }">
                    <div class="char-count-wrapper">
                        <span class="char-current">{{ textLength }}</span>
                        <span class="char-separator">/</span>
                        <span class="char-max">1000</span>
                        <span class="char-label">caractères</span>
                    </div>
                    <div 
                        class="char-remaining"
                        :class="{ 
                            'warning': remainingChars < 100 && remainingChars >= 0,
                            'danger': isOverLimit 
                        }"
                    >
                        <span v-if="!isOverLimit && remainingChars > 0">
                            Il reste: {{ remainingChars }}
                        </span>
                        <span v-else-if="remainingChars === 0">
                            La limite a été atteinte.
                        </span>
                        <span v-else class="over-limit">
                            Dépassé de {{ Math.abs(remainingChars) }} caractères
                        </span>
                    </div>
                </div>
                
                <!-- Прогресс-бар -->
                <div class="text-progress-bar">
                    <div 
                        class="progress-fill" 
                        :style="{ width: `${Math.min(textProgress, 100)}%` }"
                        :class="{ 
                            'progress-normal': textProgress < 80,
                            'progress-warning': textProgress >= 80 && textProgress < 100,
                            'progress-danger': textProgress >= 100
                        }"
                    ></div>
                </div>
                
                <span v-if="errors.text" class="error-text">{{ errors.text }}</span>
            </div>

            <!-- Кнопки -->
            <div class="form-actions">
                <button
                    type="submit"
                    class="btn primary-form-btn"
                    :disabled="loading || !isFormValid || success"
                >
                    <span v-if="loading" class="spinner"></span>
                    <span v-else>Envoyer un message</span>
                </button>
                
                <button
                    type="button"
                    class="btn secondary-form-btn"
                    @click="resetForm"
                    :disabled="loading || success"
                >
                    Effacer le formulaire
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
/* ============================================================================
   ОСНОВНЫЕ СТИЛИ
   ============================================================================ */

.contact-form {
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
}

/* ============================================================================
   УСПЕШНОЕ СООБЩЕНИЕ
   ============================================================================ */

.success-message {
    background-color: var(--color-success);
    color: var(--color-white);
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 30px;
    animation: slideDown 0.5s ease;
}

.success-message svg {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
    stroke-width: 2;
}

.success-message h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    margin-bottom: 10px;
}

.success-message p {
    font-size: var(--font-size-xs);
}

/* ============================================================================
   ОШИБКИ
   ============================================================================ */

.error-message.general {
    background-color: #fee;
    color: var(--color-error);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid var(--color-error);
}

.error-text {
    display: block;
    color: var(--color-error);
    font-size: var(--font-size-xs);
    margin-top: 5px;
}

/* ============================================================================
   ФОРМА
   ============================================================================ */

.form {
    /* background: white; */
    /* padding: 40px; */
    border-radius: 12px;
    /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); */
}

.form-disabled {
    opacity: 0.6;
    pointer-events: none;
}

.form-group {
    margin-bottom: 15px;
}

.form-label {
    display: block;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin-bottom: 5px;
}

.required {
    color: #e74c3c;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 3px solid var(--color-text);
    border-radius: 8px;
    transition: all 0.3s ease;
    font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--color-blue);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled,
.form-textarea:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.input-error {
    border-color: var(--color-error) !important;
}

.input-error:focus {
    box-shadow: 0 0 0 3px rgba(204, 51, 51, 0.1) !important;
}

.form-textarea {
    resize: vertical;
    min-height: 200px;
}

/* ============================================================================
   ИНФОРМАЦИЯ О СИМВОЛАХ
   ============================================================================ */

.char-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding: 10px 12px;
    background-color: transparent;
    border-radius: 6px;
    font-size: var(--font-size-xxs);
    transition: all 0.3s ease;
}

.char-info-error {
    background-color: #fee;
    border: 1px solid #fcc;
}

.char-count-wrapper {
    display: flex;
    align-items: baseline;
    gap: 4px;
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-xxs);
    color: var(--color-text);
}


.char-label {
    margin-left: 2px;
}

.char-remaining {
    font-weight: var(--font-weight-medium);
    color: var(--color-success);
    transition: color 0.3s ease;
}

.char-remaining.warning {
    color: var(--color-warning);
    font-weight: var(--font-weight-semibold);
}

.char-remaining.danger {
    color: var(--color-error);
    font-weight: var(--font-weight-bold);
}

.over-limit {
    animation: pulse 1s infinite;
}

/* ============================================================================
   ПРОГРЕСС-БАР ТЕКСТА
   ============================================================================ */

.text-progress-bar {
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 8px;
}

.progress-fill {
    height: 100%;
    transition: width 0.3s ease, background 0.3s ease;
}

.progress-normal {
    background: var(--color-success);
}

.progress-warning {
    background: var(--color-warning);
}

.progress-danger {
    background: var(--color-error);
}

/* ============================================================================
   КНОПКИ
   ============================================================================ */

.form-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 30px;
}

/* .btn {
    flex: 1;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
} */

/* .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
} */

/* .btn-secondary {
    background: #f0f0f0;
    color: #333;
}

.btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
} */

/* ============================================================================
   СПИННЕР ЗАГРУЗКИ
   ============================================================================ */

.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* ============================================================================
   АНИМАЦИИ
   ============================================================================ */

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

/* ============================================================================
   АДАПТИВНОСТЬ
   ============================================================================ */

@media (max-width: 768px) {
    .contact-form {
        padding: 20px 15px;
    }

    .form {
        padding: 25px 20px;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
</style>