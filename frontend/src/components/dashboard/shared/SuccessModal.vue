<!-- ============================================================================
     SuccessModal.vue - Модалка успеха
     ============================================================================ -->
<script setup>
import { onMounted } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Успешно!'
    },
    message: {
        type: String,
        required: true
    },
    autoClose: {
        type: Number,
        default: 3000
    }
});

const emit = defineEmits(['close']);

onMounted(() => {
    if (props.autoClose > 0) {
        setTimeout(() => {
            emit('close');
        }, props.autoClose);
    }
});
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="success-modal">
            <div class="success-icon">✓</div>
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <button class="btn primary-form-btn" @click="emit('close')">
                Закрыть
            </button>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.success-modal {
    background: var(--color-white);
    border-radius: var(--form-border-radius);
    padding: 40px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.success-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, var(--color-blue), var(--color-green));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: white;
    font-weight: bold;
}

.success-modal h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
    margin-bottom: 12px;
}

.success-modal p {
    font-size: var(--font-size-xs);
    color: var(--color-gray-light);
    margin-bottom: 30px;
}

.success-modal .btn {
    width: 100%;
}
</style>