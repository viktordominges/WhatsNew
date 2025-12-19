<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCategoriesStore } from '@/stores/categoriesStore.js'

const categoriesStore = useCategoriesStore()

onMounted(async () => {
    try {
        await categoriesStore.fetchCategories()
    } catch (e) {
        console.error('Failed to load categories', e)
    }
})

</script>

<template>
    <RouterView />
</template>

