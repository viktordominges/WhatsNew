<!-- ============================================================================
     EditOrganizerView.vue - Редактирование организатора
     ============================================================================ -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserOrganizersStore } from '@/stores/userOrganizersStore';
import OrganizerForm from '@/components/OrganizerForm.vue';
import SuccessModal from '@/components/dashboard/shared/SuccessModal.vue';

const route = useRoute();
const router = useRouter();
const organizersStore = useUserOrganizersStore();

const organizer = ref(null);
const loading = ref(true);
const showSuccess = ref(false);

onMounted(async () => {
    try {
        organizer.value = await organizersStore.fetchOrganizer(route.params.slug);
    } catch (error) {
        console.error('Error loading organizer:', error);
        router.push('/dashboard/organizers');
    } finally {
        loading.value = false;
    }
});

const handleSuccess = () => {
    showSuccess.value = true;
};

const closeSuccess = () => {
    showSuccess.value = false;
    router.push('/dashboard/organizers');
};

const handleCancel = () => {
    router.push('/dashboard/organizers');
};
</script>

<template>
    <div class="edit-organizer-page">
        <div class="page-header">
            <h1>Редактировать организатора</h1>
        </div>

        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Загрузка...</p>
        </div>

        <OrganizerForm
            v-else-if="organizer"
            :edit-mode="true"
            :organizer-data="organizer"
            @success="handleSuccess"
            @cancel="handleCancel"
        />

        <SuccessModal
            v-if="showSuccess"
            title="Изменения сохранены!"
            message="Информация об организаторе успешно обновлена"
            @close="closeSuccess"
        />
    </div>
</template>

<style scoped>
.edit-organizer-page {
    max-width: 700px;
    margin: 0 auto;
}

.page-header {
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
</style>