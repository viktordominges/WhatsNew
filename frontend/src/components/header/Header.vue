<script setup>

import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHeaderStore } from '@/stores/headerStore';
import { FirstMenu, HeaderBar, SecondMenu, HeaderTitle } from '@/components/header';

const store = useHeaderStore();
const route = useRoute();

watch(
    () => route.path,
    (newPath) => {
        store.setRouteTitle(newPath);
    },
    { immediate: true }
);

</script>

<template>
		
    <FirstMenu />
    
    <HeaderBar />

    <SecondMenu />

    <HeaderTitle :title="store.currentTitle" />

</template>
