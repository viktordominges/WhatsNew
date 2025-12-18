<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EmptyActivities from '@/components/dashboard/activities/EmptyActivities.vue';

const router = useRouter();
const activities = ref([]);
const loading = ref(true);

onMounted(async () => {
    // TODO: Загрузка событий из API
    await new Promise(resolve => setTimeout(resolve, 500));
    activities.value = [];
    loading.value = false;
});
</script>

<template>
    <div class="activities-page">
        <div class="page-header">
            <h1>Mes événements</h1>
            <button class="btn orange-btn" @click="router.push('/dashboard/activities/create')">
                + Créer un événement
            </button>
        </div>

        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Chargement...</p>
        </div>

        <EmptyActivities v-else-if="activities.length === 0" />

        <div v-else class="activities-grid">
            <!-- TODO: Activity cards -->
        </div>
    </div>
</template>

<style scoped>
.activities-page {
    max-width: 1200px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.page-header h1 {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: var(--color-gray-light);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-light-background);
    border-top-color: var(--color-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .page-header .btn {
        width: 100%;
    }
}
</style>