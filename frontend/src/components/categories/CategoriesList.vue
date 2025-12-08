<script setup>
import { useRouter } from 'vue-router';
import { useEventsFilterStore } from '@/stores/eventsFilterStore';
import { useHeaderStore } from '@/stores/headerStore';
import data from '@/mock-data.json';

const props = defineProps({
    variant: {
        type: String,
        default: 'menu',
        validator: (value) => ['menu', 'footer', 'grid'].includes(value)
    },
    showIcons: {
        type: Boolean,
        default: false
    },
    // Опция для использования роутинга вместо прямого изменения store
    useRouting: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();
const filterStore = useEventsFilterStore();
const headerStore = useHeaderStore();

const selectCategory = (slug) => {
    if (props.useRouting) {
        // Переход на URL с slug
        router.push(`/category/${slug}`);
    } else {
        // Прямое обновление store (для текущей реализации)
        filterStore.setCategoryBySlug(slug);
        headerStore.setCategoryBySlug(slug);
    }
};

// Динамическая загрузка иконок
const icons = props.showIcons 
    ? import.meta.glob('@/assets/icons/second-menu-icons/*.svg', { eager: true, import: 'default' })
    : {};
    
const getIcon = (name) => icons[`/src/assets/icons/second-menu-icons/${name}.svg`];
</script>

<template>
    <ul 
        :class="[
            'categories-list',
            `categories-list--${variant}`
        ]"
    >
        <li 
            v-for="category in data.categories" 
            :key="category.slug"
            @click="selectCategory(category.slug)"
            :class="{ 'active': filterStore.categorySlug === category.slug }"
        >
            <img 
                v-if="showIcons && getIcon(category.icon)" 
                :src="getIcon(category.icon)" 
                :alt="`${category.name} Icon`"
            >
            <a>{{ category.name }}</a>
        </li>
    </ul>
</template>

<style scoped>
.categories-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

/* Вариант для меню (горизонтальный с иконками) */
.categories-list--menu {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 2px solid var(--color-white);
    border-radius: 5px;
}

.categories-list--menu li {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-right: 1px solid var(--color-white);
    background-color: var(--color-dark-background);
    transition: all 0.5s ease-in-out;
    cursor: pointer;
}

.categories-list--menu li:hover {
    background-color: var(--color-orange);
}

.categories-list--menu li.active {
    background-color: var(--color-orange);
}

.categories-list--menu li img {
    width: 30px;
    height: 30px;
}

.categories-list--menu li:last-of-type {
    border-right: 0;
}

.categories-list--menu a {
    color: var(--color-white);
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
}

/* Вариант для футера (сетка 3 колонки) */
.categories-list--footer {
    margin-top: 35px;
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 20px 30px;
    justify-items: center;
    width: 100%;
}

.categories-list--footer li {
    cursor: pointer;
    transition: color 0.3s ease;
}

.categories-list--footer li:hover a {
    color: var(--color-orange);
}

.categories-list--footer a {
    color: var(--color-first-footer-text);
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    transition: color 0.3s ease;
}

/* Вариант для обычной сетки */
.categories-list--grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
}

.categories-list--grid li {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.categories-list--grid li:hover {
    background-color: #f5f5f5;
    transform: translateY(-2px);
}
</style>