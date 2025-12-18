<script setup>
import { ref, computed, reactive } from 'vue';
// import { organizersAPI } from '@/services/api';

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
    // Режим редактирования (передать данные организатора для обновления)
    editMode: {
        type: Boolean,
        default: false
    },
    // Данные организатора для редактирования
    organizerData: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['success', 'error', 'cancel']);

// ============================================================================
// STATE
// ============================================================================

const form = reactive({
    name: props.organizerData?.name || '',
    email: props.organizerData?.email || '',
    phone: props.organizerData?.phone || '',
    website: props.organizerData?.website || ''
});

const loading = ref(false);
const success = ref(false);
const errors = reactive({
    name: '',
    email: '',
    phone: '',
    website: '',
    general: ''
});

// ============================================================================
// COMPUTED
// ============================================================================

// Валидация формы
const isFormValid = computed(() => {
    return (
        form.name.trim().length > 0 &&
        isValidEmail(form.email) &&
        isValidPhone(form.phone) &&
        (form.website === '' || isValidUrl(form.website))
    );
});

// Заголовок формы
const formTitle = computed(() => {
    return props.editMode ? 'Редактировать организатора' : 'Добавить организатора';
});

// Текст кнопки
const submitButtonText = computed(() => {
    return props.editMode ? 'Сохранить изменения' : 'Добавить организатора';
});

// ============================================================================
// VALIDATION METHODS
// ============================================================================

/**
 * Валидация email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Валидация телефона (международный формат)
 */
function isValidPhone(phone) {
    // Разрешаем +, пробелы, дефисы, скобки и цифры
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(phone) && cleanPhone.length >= 7;
}

/**
 * Валидация URL
 */
function isValidUrl(url) {
    if (!url) return true; // website необязателен
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Очистить ошибки
 */
function clearErrors() {
    errors.name = '';
    errors.email = '';
    errors.phone = '';
    errors.website = '';
    errors.general = '';
}

/**
 * Валидация поля name
 */
function validateName() {
    if (!form.name.trim()) {
        errors.name = 'Название обязательно для заполнения';
        return false;
    }
    if (form.name.trim().length < 2) {
        errors.name = 'Название должно содержать минимум 2 символа';
        return false;
    }
    if (form.name.length > 200) {
        errors.name = 'Название не должно превышать 200 символов';
        return false;
    }
    errors.name = '';
    return true;
}

/**
 * Валидация поля email
 */
function validateEmail() {
    if (!form.email.trim()) {
        errors.email = 'Email обязателен для заполнения';
        return false;
    }
    if (!isValidEmail(form.email)) {
        errors.email = 'Введите корректный email адрес';
        return false;
    }
    errors.email = '';
    return true;
}

/**
 * Валидация поля phone
 */
function validatePhone() {
    if (!form.phone.trim()) {
        errors.phone = 'Телефон обязателен для заполнения';
        return false;
    }
    if (!isValidPhone(form.phone)) {
        errors.phone = 'Введите корректный номер телефона';
        return false;
    }
    if (form.phone.length > 20) {
        errors.phone = 'Номер телефона не должен превышать 20 символов';
        return false;
    }
    errors.phone = '';
    return true;
}

/**
 * Валидация поля website
 */
function validateWebsite() {
    // Website необязателен
    if (!form.website.trim()) {
        errors.website = '';
        return true;
    }
    
    if (!isValidUrl(form.website)) {
        errors.website = 'Введите корректный URL (например: https://example.com)';
        return false;
    }
    if (form.website.length > 200) {
        errors.website = 'URL не должен превышать 200 символов';
        return false;
    }
    errors.website = '';
    return true;
}

/**
 * Валидация всей формы
 */
function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isWebsiteValid = validateWebsite();
    
    return isNameValid && isEmailValid && isPhoneValid && isWebsiteValid;
}

// ============================================================================
// FORM METHODS
// ============================================================================

/**
 * Отправка формы
 */
async function submitForm() {
    clearErrors();
    success.value = false;
    
    // Валидация
    if (!validateForm()) {
        return;
    }
    
    loading.value = true;
    
    try {
        let response;
        
        if (props.editMode && props.organizerData) {
            // Режим редактирования
            response = await organizersAPI.update(props.organizerData.slug, form);
        } else {
            // Режим создания
            response = await organizersAPI.create(form);
        }
        
        // Успешная отправка
        success.value = true;
        emit('success', response.data);
        
        // Очищаем форму через 1.5 секунды (только для создания)
        if (!props.editMode) {
            setTimeout(() => {
                resetForm();
            }, 1500);
        }
        
    } catch (error) {
        console.error('Error submitting organizer form:', error);
        
        // Обработка ошибок от сервера
        if (error.response?.data) {
            const errorData = error.response.data;
            
            if (errorData.name) errors.name = Array.isArray(errorData.name) ? errorData.name[0] : errorData.name;
            if (errorData.email) errors.email = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
            if (errorData.phone) errors.phone = Array.isArray(errorData.phone) ? errorData.phone[0] : errorData.phone;
            if (errorData.website) errors.website = Array.isArray(errorData.website) ? errorData.website[0] : errorData.website;
            if (errorData.detail) errors.general = errorData.detail;
            if (errorData.non_field_errors) errors.general = errorData.non_field_errors[0];
        } else {
            errors.general = 'Произошла ошибка при отправке формы. Попробуйте позже.';
        }
        
        emit('error', error);
    } finally {
        loading.value = false;
    }
}

/**
 * Сброс формы
 */
function resetForm() {
    form.name = '';
    form.email = '';
    form.phone = '';
    form.website = '';
    clearErrors();
    success.value = false;
}

/**
 * Отмена действия
 */
function cancelForm() {
    emit('cancel');
}

/**
 * TO DO: Форматирование телефона при вводе

function formatPhone() {
    // Можно добавить автоформатирование номера
    // Например: +32 123 456 789
}
*/

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
    resetForm,
    submitForm
});
</script>

<template>
    <div class="organizer-form">
        <!-- Заголовок формы -->
        <div class="form-header">
            <h2>{{ formTitle }}</h2>
            <p v-if="!editMode">Заполните информацию о новом организаторе</p>
            <p v-else>Обновите информацию об организаторе</p>
        </div>

        <!-- Сообщение об успешной отправке -->
        <div v-if="success" class="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3>{{ editMode ? 'Организатор обновлен!' : 'Организатор добавлен!' }}</h3>
            <p>{{ editMode ? 'Изменения успешно сохранены' : 'Новый организатор успешно создан' }}</p>
        </div>

        <!-- Общая ошибка -->
        <div v-if="errors.general" class="error-message general">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ errors.general }}
        </div>

        <!-- Форма -->
        <form @submit.prevent="submitForm" class="form" :class="{ 'form-disabled': success }">
            
            <!-- Name -->
            <div class="form-group">
                <label for="name" class="form-label">
                    <span class="label-text">Название организации</span>
                    <span class="required">*</span>
                </label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.name }"
                    placeholder="Например: Grand Theatre Brussels"
                    @blur="validateName"
                    @input="validateName"
                    :disabled="loading || success"
                    maxlength="200"
                />
                <div class="field-footer">
                    <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                    <span v-else class="char-count">{{ form.name.length }} / 200</span>
                </div>
            </div>

            <!-- Email -->
            <div class="form-group">
                <label for="email" class="form-label">
                    <span class="label-text">Email</span>
                    <span class="required">*</span>
                </label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    :class="{ 'input-error': errors.email }"
                    placeholder="contact@organization.com"
                    @blur="validateEmail"
                    @input="validateEmail"
                    :disabled="loading || success"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <!-- Phone -->
            <div class="form-group">
                <label for="phone" class="form-label">
                    <span class="label-text">Телефон</span>
                    <span class="required">*</span>
                </label>
                <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    :class="{ 'input-error': errors.phone }"
                    placeholder="+32 123 456 789"
                    @blur="validatePhone"
                    @input="validatePhone"
                    :disabled="loading || success"
                    maxlength="20"
                />
                <div class="field-footer">
                    <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                    <span v-else class="field-hint">Укажите телефон с кодом страны</span>
                </div>
            </div>

            <!-- Website (optional) -->
            <div class="form-group">
                <label for="website" class="form-label">
                    <span class="label-text">Веб-сайт</span>
                    <span class="optional">(необязательно)</span>
                </label>
                <input
                    id="website"
                    v-model="form.website"
                    type="url"
                    class="form-input"
                    :class="{ 'input-error': errors.website }"
                    placeholder="https://organization.com"
                    @blur="validateWebsite"
                    @input="validateWebsite"
                    :disabled="loading || success"
                    maxlength="200"
                />
                <div class="field-footer">
                    <span v-if="errors.website" class="error-text">{{ errors.website }}</span>
                    <span v-else class="field-hint">Начните с http:// или https://</span>
                </div>
            </div>

            <!-- Кнопки -->
            <div class="form-actions">
                <button
                    type="submit"
                    class="btn primary-form-btn"
                    :disabled="loading || !isFormValid || success"
                >
                    <span v-if="loading" class="spinner"></span>
                    <span v-else>{{ submitButtonText }}</span>
                </button>
                
                <button
                    v-if="editMode"
                    type="button"
                    class="btn secondary-form-btn"
                    @click="cancelForm"
                    :disabled="loading || success"
                >
                    Отмена
                </button>
                
                <button
                    v-else
                    type="button"
                    class="btn secondary-form-btn"
                    @click="resetForm"
                    :disabled="loading || success"
                >
                    Очистить форму
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
/* ============================================================================
   ОСНОВНЫЕ СТИЛИ
   ============================================================================ */

.organizer-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
}

.form-header {
    text-align: center;
    margin-bottom: 40px;
}

.form-header h2 {
    margin-bottom: 10px;
}

.form-header p {
    font-size: var(--font-size-xs);
    color: var(--color-gray-light);
}

/* ============================================================================
   СООБЩЕНИЯ
   ============================================================================ */

.success-message {
    background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-green) 100%);
    color: var(--color-white);
    padding: 30px;
    border-radius: var(--form-border-radius);
    text-align: center;
    margin-bottom: 30px;
    animation: slideDown 0.5s ease;
}

.success-message svg {
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
    stroke-width: 2;
}

.success-message h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    margin-bottom: 8px;
}

.success-message p {
    font-size: var(--font-size-xs);
    opacity: 0.9;
}

.error-message.general {
    background-color: #fee;
    color: var(--color-error);
    padding: 15px;
    border-radius: var(--form-border-radius);
    margin-bottom: 20px;
    border-left: 4px solid var(--color-error);
    display: flex;
    align-items: center;
    gap: 12px;
}

.error-message.general svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

/* ============================================================================
   ФОРМА
   ============================================================================ */

.form {
    background: var(--color-white);
    padding: 40px;
    border-radius: var(--form-border-radius);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.form-disabled {
    opacity: 0.6;
    pointer-events: none;
}

.form-group {
    margin-bottom: 25px;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-dark-text);
    margin-bottom: 8px;
}

.label-text {
    flex: 1;
}

.required {
    color: var(--color-error);
    font-weight: var(--font-weight-bold);
}

.optional {
    color: var(--color-gray-light);
    font-size: var(--font-size-xxs);
    font-weight: var(--font-weight-regular);
}

.form-input {
    width: 100%;
    padding: 14px 16px;
    font-size: var(--font-size-xs);
    border: 2px solid var(--color-gray-light);
    border-radius: var(--btn-border-radius);
    transition: all 0.3s ease;
    font-family: inherit;
    background-color: var(--color-white);
    color: var(--color-dark-text);
}

.form-input::placeholder {
    color: var(--color-gray-light);
}

.form-input:focus {
    outline: none;
    border-color: var(--color-blue);
    box-shadow: 0 0 0 3px rgba(69, 188, 231, 0.1);
}

.form-input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.input-error {
    border-color: var(--color-error) !important;
}

.input-error:focus {
    box-shadow: 0 0 0 3px rgba(165, 27, 27, 0.1) !important;
}

/* ============================================================================
   ПОДСКАЗКИ И ОШИБКИ
   ============================================================================ */

.field-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    min-height: 20px;
}

.error-text {
    color: var(--color-error);
    font-size: var(--font-size-xxs);
    font-weight: var(--font-weight-medium);
}

.field-hint {
    color: var(--color-gray-light);
    font-size: var(--font-size-xxs);
}

.char-count {
    color: var(--color-gray-light);
    font-size: var(--font-size-xxs);
    margin-left: auto;
}

/* ============================================================================
   КНОПКИ
   ============================================================================ */

.form-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 30px;
}

.btn {
    position: relative;
}

/* Спиннер загрузки */
.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--color-white);
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

/* ============================================================================
   АДАПТИВНОСТЬ
   ============================================================================ */

@media (max-width: 768px) {
    .organizer-form {
        padding: 20px 15px;
    }

    .form {
        padding: 25px 20px;
    }

    .form-header h2 {
        font-size: var(--font-size-xl);
    }
}

/* Тёмная тема (опционально) */
@media (prefers-color-scheme: dark) {
    .form-header h2 {
        color: var(--color-light-text);
    }
    
    .form {
        background: var(--color-dark-card-background);
    }
    
    .form-label {
        color: var(--color-light-text);
    }
    
    .form-input {
        background-color: var(--color-dark-background);
        color: var(--color-light-text);
        border-color: var(--color-gray-dark);
    }
    
    .form-input::placeholder {
        color: var(--color-gray-light);
    }
}
</style>