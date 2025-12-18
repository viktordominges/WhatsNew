<!-- ============================================================================
     EmptyOrganizers.vue - Пустой список организаторов
     ============================================================================ -->
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const createOrganizer = () => {
    router.push('/dashboard/organizers/create');
};
</script>

<template>
    <div class="empty-state">
        <div class="empty-icon">🏢</div>
        <h3>У вас пока нет организаторов</h3>
        <p>Создайте своего первого организатора, чтобы начать добавлять события</p>
        <button class="btn primary-form-btn" @click="createOrganizer">
            Создать организатора
        </button>
    </div>
</template>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
    margin-bottom: 10px;
}

.empty-state p {
    font-size: var(--font-size-xs);
    color: var(--color-gray-light);
    margin-bottom: 30px;
    max-width: 400px;
}

.empty-state .btn {
    max-width: 300px;
}
</style>