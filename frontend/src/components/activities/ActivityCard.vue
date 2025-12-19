<script setup>

import { ref, onMounted, nextTick } from 'vue';
import defaultPoster from '@/assets/images/default-card-poster.jpg';

const icons = import.meta.glob('@/assets/icons/card-icons/*.svg', { eager: true, import: 'default' });
const getIcon = name => icons[`/src/assets/icons/card-icons/${name}.svg`];


const hoverBlockRef = ref(null);
const hoverHeight = ref(0);

onMounted(async () => {
  await nextTick();
  hoverHeight.value = hoverBlockRef.value.offsetHeight;
});

console.log(hoverHeight);


</script>

<template>
    <div class="activity-card" :style="{ '--hoverHeight': hoverHeight + 'px' }">
        <div class="activity-poster">
            <img :src="defaultPoster" alt="Activity Poster">
            <div class="poster-bar">
                <div class="favorites-btn">
                    <img :src="getIcon('empty-heart')" alt="favorite icon">
                    <span>Ajouter aux favoris</span>
                </div>
                <div class="recommended-block">Recommandé</div>
            </div>
            <div class="price-block">
                <img :src="getIcon('wallet')" alt="Price Icon">
                <div class="price-value">a.p.d.<span> 100 </span>€</div>
            </div>
        </div>
        <div class="activity-info">
            <div class="activity-info-static">
                <h5 class="activity-title">Metallica. Concert de rock</h5>
                <div class="activity-date">5 décembre 2026</div>
                <div class="activity-location">
                    <img :src="getIcon('location-point-black')" alt="location icon">
                    <span>Bruxelles</span>,
                    <span>La Madeleine</span>
                </div>
            </div>
            
            <div class="card-hover-block" ref="hoverBlockRef">
                <p class="activity-description">
                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.. 
                </p>
                <button class="btn orange-btn">Savoir plus</button>
            </div>

            <div class="category-absolut-block">
                <span class="activity-category">Concerts</span>
            </div>
        </div>
    </div>
</template>

<style scoped>  
.activity-card {
    margin-bottom: 30px;
    width: 300px;
    height: 390px;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-light-gray);
    overflow: visible;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: var(--color-card-background);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
}

.activity-poster {
    position: relative;
    width: 100%;
    height: 220px;
    overflow: hidden;
    flex-shrink: 0;
}

.activity-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.poster-bar {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 25px;
    color: var(--color-light-text);
    font-size: var(--font-size-xs);
}

.favorites-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}

.favorites-btn img {
    width: 20px;
    height: 20px;
}

.favorites-btn span {
    text-transform: none;
    font-size: var(--font-size-xxs);
    font-weight: var(--font-weight-regular);
    color: var(--color-orange);
}

.recommended-block {
    padding: 2px 5px;
    background-color: var(--color-green);
    color: var(--color-dark-text);
    border-radius: var(--card-border-radius);
    font-size: var(--font-size-xxxs);
    font-weight: var(--font-weight-medium);
}

.price-block {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: var(--color-card-background);
    padding: 5px 10px;
    border-radius: 5px 0 0 0;
    font-size: var(--font-size-xxs);
    font-weight: var(--font-weight-bold);
}

.price-block img {
    width: 20px;
    height: 20px;
}

.price-value span {
    font-size: var(--font-size-xs);
}

.activity-info {
    position: relative;
    padding: 25px 25px 60px 25px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1;
    background-color: var(--color-card-background);
}

.activity-info-static {
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    z-index: 1;
}

.activity-title {
    text-transform: none;
}

.activity-date {
    font-size: var(--font-size-xxs);
    color: var(--color-gray-light);
    font-weight: var(--font-weight-medium);
}

.activity-location {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: var(--font-size-xxs);
    color: var(--color-links);
    font-weight: var(--font-weight-medium);
    text-decoration: underline;
}

.activity-location img {
    width: 20px;
    height: 20px;
}

.category-absolut-block {
    width: 300px;
    height: 50px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 3;
    background-color: var(--color-card-background);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-absolut-block span {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: var(--font-size-xxs);
    color: var(--color-dark-text);
    background-color: var(--color-blue);
    padding: 5px 20px;
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);

    z-index: 3;
}

/* .activity-category {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: var(--font-size-xxs);
    color: var(--color-dark-text);
    background-color: var(--color-blue);
    padding: 5px 20px;
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);

    z-index: 3;
} */

/* Hover block - абсолютное позиционирование */
.card-hover-block {
    position: absolute;
    left: 0;
    top: 150px;
    height: fit-content;
    padding: 0 25px 25px 25px;
    background-color: var(--color-card-background);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-20px);
    transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                visibility 0s linear 0.35s;
    z-index: 2;
}

.activity-description {
    font-size: var(--font-size-xs);
    line-height: 1.5;
    color: var(--color-dark-text);
}

/* При наведении */
.activity-card:hover {
    z-index: 10;
    transform: translateY(-4px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
}

.activity-card:hover .card-hover-block {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                visibility 0s linear 0s;
}

.activity-card:hover .category-absolut-block {
    transform: translateY(var(--hoverHeight));
}

</style>