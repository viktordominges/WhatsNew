<script setup>
const icons = import.meta.glob('@/assets/icons/second-footer-icons/*.svg', { eager: true, import: 'default' });
const getIcon = name => icons[`/src/assets/icons/second-footer-icons/${name}.svg`];
</script>

<template>
    <section class="second-footer">
        <div class="container">
            <div class="wrapper">
                <h2 class="site-name">Quoi de neuf</h2>
                <div class="useful-links">
                    <a href="#">Cookies</a>
                    <a href="#">Conditions générales</a>
                    <a href="#">Security</a>
                </div>
                <div class="social-networks">
                    <a href="#"><img :src="getIcon('fb')" alt="Facebook Icon"></a>
                    <a href="#"><img :src="getIcon('instagram')" alt="Instagram Icon"></a>
                    <a href="#"><img :src="getIcon('linkedIn')" alt="Linkedin Icon"></a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .second-footer {
        text-align: center;
        padding: 20px;
        background-color: var(--color-second-footer-background);
        color: var(--color-second-footer-text);
    }

    .wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .site-name {
        font-size: 24px;
        font-weight: 700;
        text-transform: uppercase;
    }

    .useful-links {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 60px;
    }

    .useful-links a {
        color: var(--color-second-footer-text);
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
    }

    .social-networks {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
    }

    .social-networks img {
        width: 30px;
        height: 30px;
    }
</style>