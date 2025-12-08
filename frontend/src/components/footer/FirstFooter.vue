<!-- frontend/src/components/footer/FirstFooter.vue -->
<script setup>
import { RouterLink } from 'vue-router';
import CategoriesList from '@/components/categories/CategoriesList.vue';
</script>

<template>
    <section class="footer">
        <div class="container">
            <div class="wrapper">
                <div>
                    <h3>À propos du site</h3>
                    <nav>
                        <RouterLink to="/about">À propos du projet</RouterLink>
                        <RouterLink to="/archives">Archives des événements</RouterLink>
                        <RouterLink to="/about">Questions fréquemment posées</RouterLink>
                    </nav>
                </div>

                <div>
                    <h3 class="center">Catégories</h3>
                    
                    <!-- Используем общий компонент -->
                    <CategoriesList variant="footer" :showIcons="false" />
                </div>
                
                <div>
                    <h3>Contact</h3>
                    <ul>
                        <li>Rue Paul Pastur 2B, 7500</li>
                        <li>quoideneuf@gmail.com</li>
                        <li>+32 457 77 77 77</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>  
.footer {
    width: 100%;
    min-height: 200px;
    margin-top: 100px;
    background-color: var(--color-first-footer-background);
}

.wrapper {
    padding: 50px 0;
    display: grid;
    grid-template-columns: 220px auto 220px;
    align-items: start;
    justify-items: stretch;
    gap: 50px;
    width: 100%;
    height: 100%;
}

.footer h3 {
    color: var(--color-first-footer-text);
    font-size: 16px;
    text-transform: uppercase;
}

.footer h3.center {
    text-align: center;
}

nav, ul {
    margin-top: 35px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

a, li {
    color: var(--color-first-footer-text);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
}
</style>