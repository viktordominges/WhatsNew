<script setup>
import { computed } from 'vue';
import { useEventsFilterStore } from '@/stores/eventsFilterStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
// временные данные
import data from '@/mock-data.json';

const filterStore = useEventsFilterStore();
const favoritesStore = useFavoritesStore();

const filteredActivities = computed(() => {
    let result = data.activities;

    const now = new Date();

    // 1. Архив / актуальные
    if (filterStore.isArchive) {
        result = result.filter(a => new Date(a.date) < now);
    } else {
        result = result.filter(a => new Date(a.date) >= now);
    }

    // 2. Фильтр по категории (через slug)
    if (filterStore.categorySlug) {
        const category = data.categories.find(
            c => c.slug === filterStore.categorySlug
        );

        if (category) {
            result = result.filter(
                a => a.category_id === category.id
            );
        }
    }

    // 3. Избранные
    if (filterStore.filters.favorites) {
        result = result.filter(a => favoritesStore.isFavorite(a.id));
    }

    // 4. Рекомендованные
    if (filterStore.filters.recommended) {
        result = result.filter(a => a.recommended === true);
    }

    // 5. Бесплатные
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
