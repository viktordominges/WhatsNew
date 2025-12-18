<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <section class="not-found">
        <h1>404</h1>
        <p>Page non trouvée</p>

        <RouterLink to="/">
        Retour à l'accueil
        </RouterLink>

    </section>
</template>

<style scoped>
.not-found {
    padding: 80px 20px; 
    text-align: center;
}

.not-found h1 {
    font-size:42px; 
    font-weight:700;
}

.not-found p {
    font-size:18px; 
    margin-top:10px;
}

.not-found a {
    margin-top:20px; 
    display:inline-block; 
    text-decoration:underline;
}
</style>