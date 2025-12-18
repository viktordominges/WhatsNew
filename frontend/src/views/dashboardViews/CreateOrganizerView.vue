<!-- ============================================================================
     CreateOrganizerView.vue - Создание организатора
     ============================================================================ -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserOrganizersStore } from '@/stores/userOrganizersStore';
import OrganizerForm from '@/components/dashboard/organizers/OrganizerForm.vue'; // Исправить путь
import SuccessModal from '@/components/dashboard/shared/SuccessModal.vue';

const router = useRouter();
const organizersStore = useUserOrganizersStore();
const showSuccess = ref(false);

const handleSuccess = (data) => {
    showSuccess.value = true;
};

const closeSuccess = () => {
    showSuccess.value = false;
    router.push('/dashboard/organizers');
};
</script>

<template>
    <div class="create-organizer-page">
        <div class="page-header">
            <h1>Добавить организатора</h1>
        </div>

        <OrganizerForm @success="handleSuccess" />

        <SuccessModal
            v-if="showSuccess"
            title="Организатор создан!"
            message="Организатор успешно добавлен в вашу коллекцию"
            @close="closeSuccess"
        />
    </div>
</template>

<style scoped>
.create-organizer-page {
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
</style>