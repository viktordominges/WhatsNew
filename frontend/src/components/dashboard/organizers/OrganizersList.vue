<!-- ============================================================================
     OrganizersList.vue - Список организаторов
     ============================================================================ -->
<script setup>
import { ref, onMounted } from 'vue';
import OrganizerCard from './OrganizerCard.vue';
import EmptyOrganizers from './EmptyOrganizers.vue';
import { organizersAPI } from '@/services/http';

const organizers = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchOrganizers = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        const response = await organizersAPI.getAll();
        organizers.value = response.data.results || response.data;
    } catch (err) {
        error.value = 'Ошибка загрузки организаторов';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const handleDelete = (slug) => {
    organizers.value = organizers.value.filter(o => o.slug !== slug);
};

onMounted(() => {
    fetchOrganizers();
});

defineExpose({ fetchOrganizers });
</script>

<template>
    <div class="organizers-list">
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Загрузка организаторов...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button class="btn primary-form-btn" @click="fetchOrganizers">
                Попробовать снова
            </button>
        </div>

        <EmptyOrganizers v-else-if="organizers.length === 0" />

        <div v-else class="organizers-grid">
            <OrganizerCard
                v-for="organizer in organizers"
                :key="organizer.id"
                :organizer="organizer"
                @deleted="handleDelete"
            />
        </div>
    </div>
</template>

<style scoped>
.organizers-list {
    margin-top: 20px;
}

.organizers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
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

.error-state {
    text-align: center;
    padding: 60px 20px;
}

.error-state p {
    color: var(--color-error);
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .organizers-grid {
        grid-template-columns: 1fr;
    }
}
</style>