<!-- ============================================================================
     DeleteOrganizerModal.vue - Модалка удаления организатора
     ============================================================================ -->
<script setup>
import { ref } from 'vue';
import { organizersAPI } from '@/services/api';

const props = defineProps({
    organizer: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'deleted']);

const loading = ref(false);
const error = ref(null);

const deleteOrganizer = async () => {
    loading.value = true;
    error.value = null;

    try {
        await organizersAPI.delete(props.organizer.slug);
        emit('deleted');
        emit('close');
    } catch (err) {
        error.value = err.response?.data?.detail || 'Ошибка удаления организатора';
        console.error(err);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal">
            <div class="modal-header">
                <h3>Удалить организатора?</h3>
                <button class="close-btn" @click="emit('close')">✕</button>
            </div>

            <div class="modal-body">
                <p class="warning-text">
                    Вы уверены, что хотите удалить организатора <strong>{{ organizer.name }}</strong>?
                </p>
                <p class="info-text">
                    Это действие нельзя отменить. Все связанные события также будут удалены.
                </p>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>
            </div>

            <div class="modal-footer">
                <button 
                    class="btn secondary-form-btn"
                    @click="emit('close')"
                    :disabled="loading"
                >
                    Отмена
                </button>
                <button 
                    class="btn btn-danger"
                    @click="deleteOrganizer"
                    :disabled="loading"
                >
                    <span v-if="loading" class="spinner"></span>
                    <span v-else>Удалить</span>
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

.modal {
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

.warning-text {
    font-size: var(--font-size-xs);
    color: var(--color-dark-text);
    margin-bottom: 15px;
}

.info-text {
    font-size: var(--font-size-xxs);
    color: var(--color-gray-light);
    margin-bottom: 0;
}

.error-message {
    margin-top: 15px;
    padding: 12px;
    background-color: #fee;
    color: var(--color-error);
    border-radius: var(--btn-border-radius);
    font-size: var(--font-size-xxs);
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
    background-color: var(--color-error);
    color: var(--color-white);
    padding: 14px 16px;
    border: none;
    border-radius: var(--btn-border-radius);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-danger:hover:not(:disabled) {
    background-color: #8a1515;
}

.btn-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>