<!-- ============================================================================
MyOrganizersView.vue - Список организаторов
============================================================================ -->
<script setup>
import { useRouter } from 'vue-router';
import OrganizersList from '@/components/dashboard/organizers/OrganizersList.vue';

const router = useRouter();
</script>

<template>
    <div class="organizers-page">
        <div class="page-header">
            <h1>Мои организаторы</h1>
            <button class="btn orange-btn" @click="router.push('/dashboard/organizers/create')">
                + Добавить организатора
            </button>
        </div>

        <OrganizersList />
    </div>
</template>

<style scoped>
.organizers-page {
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