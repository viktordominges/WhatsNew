<script setup>
import { ref, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categoriesStore.js'

/**
 * Props
 */
const props = defineProps({
    variant: { type: String, default: 'menu' } // menu | footer | grid
})

/**
 * Store
 */
const store = useCategoriesStore()

// Локальный реактивный массив категорий
const categories = ref([])

/**
 * Активная категория (локально)
 */
const activeCategory = ref(null)
function selectCategory(slug) {
    activeCategory.value = slug
}

/**
 * Загрузка категорий при монтировании
 */
onMounted(async () => {
    try {
        const data = await store.fetchCategories()
        categories.value = Array.isArray(data) ? data : []
    } catch (e) {
        console.error('Failed to load categories', e)
        categories.value = []
    }
})
</script>

<template>
    <!-- Рендерим список только если есть хотя бы одна категория -->
    <ul
    v-if="categories.length"
    class="categories-list"
    :class="`categories-list--${variant}`"
    >
        <li
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category.slug)"
        :class="{ active: activeCategory === category.slug }"
        >
            <img
                v-if="variant === 'menu'"
                :src="category.image"
                :alt="category.name"
            />
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