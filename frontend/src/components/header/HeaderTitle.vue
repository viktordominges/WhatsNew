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
        <h2>{{ title }}</h2>
    </div>
</template>

<style scoped>

.greetings {
    margin-top: 170px;
}

.greetings h2 {
    text-align: center;
    font-size: 36px;
    font-weight: 700;
    color: var(--color-white);
    text-transform: uppercase;
}

</style>
