<script setup>
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEventsFilterStore } from '@/stores/eventsFilterStore';
import { useHeaderStore } from '@/stores/headerStore';
import ActivitiesList from '@/components/activities/ActivitiesList.vue';
import AdditionalFilters from '@/components/AdditionalFilters.vue';

const route = useRoute();
const filterStore = useEventsFilterStore();
const headerStore = useHeaderStore();

// Синхронизация slug из URL с store
const syncCategoryFromRoute = () => {
    const slug = route.params.slug;
    
    if (slug) {
        filterStore.setCategoryBySlug(slug);
        headerStore.setCategoryBySlug(slug);
    } else if (route.path === '/') {
        // На главной странице сбрасываем категорию
        filterStore.clearCategory();
        headerStore.setRouteTitle('/');
    }
};

// При монтировании компонента
onMounted(() => {
    syncCategoryFromRoute();
});

// При изменении маршрута
watch(() => route.params.slug, () => {
    syncCategoryFromRoute();
});

watch(() => route.path, (newPath) => {
    if (newPath === '/') {
        filterStore.clearCategory();
        headerStore.setRouteTitle('/');
    }
});
</script>

<template>
    <main>
        <div class="filters-section">
            <AdditionalFilters />
        </div>

        <ActivitiesList />
    </main>
</template>

<style scoped>
main {
    min-height: 100vh;
    padding: 20px 0;
}

.filters-section {
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}
</style>
