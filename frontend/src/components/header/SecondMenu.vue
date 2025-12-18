<script setup>
import CategoriesList from '@/components/categories/CategoriesList.vue';

const icons = import.meta.glob('@/assets/icons/second-menu-icons/*.svg', { eager: true, import: 'default' });
const getIcon = name => icons[`/src/assets/icons/second-menu-icons/${name}.svg`];
</script>

<template>
    <div class="container">
        <nav class="second-menu">
            <RouterLink class="geo-map" to="/geo-map">
                <img src="/src/assets/icons/menu-icons/map-point.svg" alt="Geo Map Icon">
                Carte
            </RouterLink>
            <div class="calendar">
                <img src="/src/assets/icons/menu-icons/calendar.svg" alt="Calendar Icon">
                <a href="#">Calendrier</a>
            </div>
            
            <CategoriesList  />
            
            <div class="dots">
                <a href="#">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </a>
            </div>
        </nav>
    </div>
</template>

<style scoped>
.second-menu {
    margin: 30px auto;
    width: 100%;
    height: 100px;
    background-color: var(--color-dark-background);
    opacity: 0.7;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
}

.second-menu a {
    color: var(--color-white);
}

.geo-map, .calendar {
    margin-right: 25px;
    height: 100%;
    min-width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border: 2px solid var(--color-white);
    border-radius: 5px;
    background-color: var(--color-dark-background);
    transition: all 0.5s ease-in-out;
}

.geo-map:hover, .calendar:hover {
    background-color: var(--color-black);
}

.geo-map img, .calendar img {
    width: 30px;
    height: 30px;
}

.dots {
    margin-left: 10px;
    height: 100%;
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border: 2px solid var(--color-white);
    border-radius: 5px;
}

.dots a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.dots span {
    color: var(--color-white);
    font-size: 28px;
    line-height: 1;
}
</style>