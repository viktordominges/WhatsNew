<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEventsFilterStore } from '@/stores/eventsFilterStore';
import { useHeaderStore } from '@/stores/headerStore';

const route = useRoute();
const filterStore = useEventsFilterStore();
const headerStore = useHeaderStore();

watch(
    () => route.path,
    (path) => {
        if (path === '/archives') {
            filterStore.setMode('archive');
        } else {
            filterStore.setMode('current');
        }

        headerStore.setRouteTitle(path);
    },
    { immediate: true }
);
</script>

<template>
    <nav class="nav-1">
        <RouterLink to="/">Tous les événements</RouterLink>
        <RouterLink to="/about">À propos du site</RouterLink>
        <RouterLink to="/archives">Archives des événements</RouterLink>
        
    </nav>
</template>

<style scoped>
    .nav-1 {
		max-width: 840px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-regular);
		text-align: center;
		margin: 0 auto;
	}

	.nav-1 a {
		color: var(--color-white);
		display: inline-block;
		border-bottom: 1px solid #fff;
	}

	
	.nav-1 a:hover {
		color: var(--color-blue);
		border-bottom: 1px solid var(--color-blue);
	}

	.nav-1 a.router-link-exact-active {
		border: 0;
	}
</style>