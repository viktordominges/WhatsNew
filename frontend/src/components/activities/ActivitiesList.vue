<script setup>
import { computed, onMounted } from 'vue'
import ActivityCard from './ActivityCard.vue'

import { useActivityStore } from '@/stores/activitiesStore.js'

const store = useActivityStore()

onMounted(() => {
    store.load()
})

const activities = computed(() => store.items)


</script>

<template>
    <section class="activities-list">
        <div class="container">
            <div class="wrapper">

                <!-- <ActivityCard v-for="activity in activities" :key="activity.id" :activity="activity" /> -->

                <!-- <ActivityCard /> -->

            </div>
        </div>
    </section>
</template>

<style scoped>
    .activities-list {
        margin-top: 60px;
    }

    .wrapper {
        padding: 0 10px;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
