<script setup>
import ActivityCard from './ActivityCard.vue'
</script>

<template>
    <section class="activities-list">
        <div class="container">
            <div class="wrapper">
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />

                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
                <ActivityCard />
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
