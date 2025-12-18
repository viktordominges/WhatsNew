<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCategoryStore } from '@/stores/categoriesStore.js'

const store = useCategoryStore()

onMounted(() => {
    store.load()
})
</script>

<template>
    <RouterView />
</template>

