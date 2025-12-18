<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <div class="greetings">
        <h1>{{ title }}</h1>
    </div>
</template>

<style scoped>

.greetings {
    margin-top: 170px;
}

.greetings h1 {
    text-align: center;
    color: var(--color-white);
}

</style>
