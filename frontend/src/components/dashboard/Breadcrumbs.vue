<!-- ============================================================================
     Breadcrumbs.vue - Хлебные крошки
     ============================================================================ -->
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
    const paths = route.path.split('/').filter(Boolean);
    const crumbs = [];
    let currentPath = '';

    const nameMap = {
        'dashboard': 'Личный кабинет',
        'organizers': 'Организаторы',
        'activities': 'События',
        'settings': 'Настройки',
        'create': 'Создание',
        'edit': 'Редактирование'
    };

    paths.forEach((path, index) => {
        currentPath += `/${path}`;
        
        // Пропускаем ID/slug в середине пути
        if (path.match(/^[0-9a-f-]+$/i) && index !== paths.length - 1) {
            return;
        }

        crumbs.push({
            name: nameMap[path] || path,
            path: currentPath,
            active: index === paths.length - 1
        });
    });

    return crumbs;
});
</script>

<template>
    <nav class="breadcrumbs">
        <router-link
            v-for="(crumb, index) in breadcrumbs"
            :key="crumb.path"
            :to="crumb.path"
            class="breadcrumb-item"
            :class="{ active: crumb.active }"
        >
            <span v-if="index > 0" class="separator">→</span>
            {{ crumb.name }}
        </router-link>
    </nav>
</template>

<style scoped>
.breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-gray-light);
    text-decoration: none;
    font-size: var(--font-size-xxs);
    transition: color 0.3s ease;
}

.breadcrumb-item:hover:not(.active) {
    color: var(--color-blue);
}

.breadcrumb-item.active {
    color: var(--color-dark-text);
    font-weight: var(--font-weight-semibold);
    pointer-events: none;
}

.separator {
    color: var(--color-gray-light);
}
</style>