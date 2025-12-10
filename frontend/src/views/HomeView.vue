<script setup lang="ts">
import ActivitiesList from '@/components/activities/ActivitiesList.vue';
import AdditionalFilters from '@/components/AdditionalFilters.vue';

</script>

<template>
  <section class="activities-list">
    <div class="container">
        <AdditionalFilters />
        <h2>Envie de vous amuser ? <br> Choisissez simplement un événement qui vous plaît.</h2>
        <ActivitiesList />
    </div>
  </section>
</template>

<style>
.activities-list h2 {
    margin-top: 60px;
}
</style>
