<script setup>
import { useEventsFilterStore } from '@/stores/eventsFilterStore';

const store = useEventsFilterStore();
</script>

<template>
    <div class="filters">
        <label class="filter-item">
            <input type="checkbox" v-model="store.filters.favorites">
            <span>Mes favoris</span>
        </label>

        <label class="filter-item">
            <input type="checkbox" v-model="store.filters.recommended">
            <span>Recommandé</span>
        </label>

        <label class="filter-item">
            <input type="checkbox" v-model="store.filters.free">
            <span>Gratuit</span>
        </label>
    </div>
</template>

<style scoped>
.filters {
    display: flex;
    gap: 16px;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    cursor: pointer;
}

input[type="checkbox"] {
    cursor: pointer;
}
</style>
