<!-- ============================================================================
     ConfirmModal.vue - Модалка подтверждения
     ============================================================================ -->
<script setup>
defineProps({
    title: {
        type: String,
        default: 'Подтвердите действие'
    },
    message: {
        type: String,
        required: true
    },
    confirmText: {
        type: String,
        default: 'Подтвердить'
    },
    cancelText: {
        type: String,
        default: 'Отмена'
    },
    danger: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
    <div class="modal-overlay" @click.self="emit('cancel')">
        <div class="confirm-modal">
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="close-btn" @click="emit('cancel')">✕</button>
            </div>

            <div class="modal-body">
                <p>{{ message }}</p>
            </div>

            <div class="modal-footer">
                <button class="btn secondary-form-btn" @click="emit('cancel')">
                    {{ cancelText }}
                </button>
                <button 
                    class="btn primary-form-btn"
                    :class="{ 'btn-danger': danger }"
                    @click="emit('confirm')"
                >
                    {{ confirmText }}
                </button>
            </div>
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
    padding: 20px;
}

.confirm-modal {
    background: var(--color-white);
    border-radius: var(--form-border-radius);
    max-width: 500px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--color-light-background);
}

.modal-header h3 {
    margin: 0;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--color-gray-light);
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: var(--color-dark-text);
}

.modal-body {
    padding: 20px;
}

.modal-body p {
    font-size: var(--font-size-xs);
    color: var(--color-dark-text);
    margin: 0;
    line-height: 1.6;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid var(--color-light-background);
}

.modal-footer .btn {
    flex: 1;
}

.btn-danger {
    background-color: var(--color-error) !important;
}

.btn-danger:hover {
    background-color: #8a1515 !important;
}
</style>