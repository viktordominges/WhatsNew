<script setup>
// import { RouterLink } from 'vue-router'

const icons = import.meta.glob('@/assets/icons/second-menu-icons/*.svg', { eager: true, import: 'default' });
const getIcon = name => icons[`/src/assets/icons/second-menu-icons/${name}.svg`];

</script>

<template>
    <div class="container">
        <nav class="second-menu">
            <div class="geo-map">
                <img :src="getIcon('map-point')" alt="Geo Map Icon">
                <a href="#">Carte</a></div>
            <div class="calendar">
                <img :src="getIcon('calendar')" alt="Calendar Icon">
                <a href="#">Calendrier</a>
            </div>
            <ul class="categories-list">
                <li>
                    <img :src="getIcon('concert')" alt="Music Icon">
                    <a href="#">Concerts</a>
                </li>
                <li>
                    <img :src="getIcon('fest')" alt="Festival Icon">
                    <a href="#">Festivals</a>
                </li>
                <li>
                    <img :src="getIcon('teddy')" alt="Children Icon">
                    <a href="#">Enfants</a>
                </li>
                <li>
                    <img :src="getIcon('theatre')" alt="Theater Icon">
                    <a href="#">Théâtre</a>
                </li>
                <li>
                    <img :src="getIcon('expo')" alt="Exposition Icon">
                    <a href="#">Expositions</a>
                </li>
                <li>
                    <img :src="getIcon('cinema')" alt="Cinema Icon">
                    <a href="#">cinéma</a>
                </li>
            </ul>
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

    .geo-map , .calendar {
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

    .geo-map img , .calendar img {
        width: 30px;
        height: 30px;
    }

    .categories-list {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 2px solid var(--color-white);
        border-radius: 5px;
    }

    .categories-list li {
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
    }

    .categories-list li:hover {
        background-color: var(--color-orange);
    }

    .categories-list li img {
        width: 30px;
        height: 30px;
    }

    .categories-list li:last-of-type {
        border: 0;
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

	.nav-1 a {
		color: var(--color-white);
		display: inline-block;
		border-bottom: 1px solid #fff;
	}

	
	.nav-1 a:hover {
		color: var(--color-blue);
		border-bottom: 1px solid var(--color-blue);
	}

	/* .nav-1 a:first-of-type {
		border: 0;
	} */

	.nav-1 a.router-link-exact-active {
		border: 0;
	}
</style>