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
    margin-top: 20px;
    display: flex;
    gap: 40px;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: var(--font-size-xs); /* 16px */
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    text-transform: uppercase;
}

input[type="checkbox"] {
    cursor: pointer;
    width: 20px;
    height: 20px;
}
</style>
