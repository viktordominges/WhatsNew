<script setup>
import { RouterLink } from 'vue-router'
import SearchBar from './SearchBar.vue'
</script>

<template>
    <div class="header-bar">
        <div class="container">
            <div class="bar-wrapper">
                <h1 class="logo">Quoi de neuf</h1>

                <SearchBar
                    v-model="searchQuery"
                    placeholder="Recherche d'événements..."
                    :debounce="300"
                    @search="onSearch"
                />

                <nav>
                    <RouterLink class="btn blue-transparent-btn" to="/add-activity">Ajouter un événement</RouterLink>
                    <RouterLink class="btn orange-btn" to="/login">
                        Entrée
                    </RouterLink>
                </nav>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .header-bar {
        width: 100%;
        height: 70px;
        margin-top: 30px;
        background-color: var(--color-gray-dark);
        display: flex;
        align-items: center;
    }

    .bar-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        font-size: 48px;
        font-weight: 700;
        color: var(--color-light-text);
        text-transform: uppercase;
    }

    nav {
        display: flex;
        gap: 20px;
    }

    
</style>