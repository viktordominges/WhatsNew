<script setup>
import { computed } from 'vue';
import { useEventsFilterStore } from '@/stores/eventsFilterStore';
import { useFavoritesStore } from '@/stores/favoritesStore';

// временные данные
import activities from '@/data/activities.json';

const filterStore = useEventsFilterStore();
const favoritesStore = useFavoritesStore();

const filteredActivities = computed(() => {
    let result = activities;

    // 1. фильтр по режиму (архив/актуальные)
    if (filterStore.isArchive) {
        const now = new Date();
        result = result.filter(a => new Date(a.date) < now);
    } else {
        const now = new Date();
        result = result.filter(a => new Date(a.date) >= now);
    }

    // 2. фильтр по категории
    if (filterStore.category) {
        result = result.filter(a => a.category_id === filterStore.category);
    }

    // 3. favorites (через localStorage / Pinia)
    if (filterStore.filters.favorites) {
        result = result.filter(a => favoritesStore.isFavorite(a.id));
    }

    // 4. recommended
    if (filterStore.filters.recommended) {
        result = result.filter(a => a.recommended === true);
    }

    // 5. free
    if (filterStore.filters.free) {
        result = result.filter(a => a.price === null);
    }

    return result;
});
</script>

<template>
    <div class="activities">
        <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="activity-card"
        >
        <h3>{{ activity.name }}</h3>

        <button @click="favoritesStore.toggle(activity.id)">
            {{ favoritesStore.isFavorite(activity.id) ? '★' : '☆' }}
        </button>
        </div>
    </div>
</template>
