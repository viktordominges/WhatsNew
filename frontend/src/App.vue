<script setup>
import { RouterView } from 'vue-router';
import FirstMenu from './components/header/FirstMenu.vue';
import HeaderBar from './components/header/HeaderBar.vue';
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
	<header>
		
		<FirstMenu />
		
		<HeaderBar />

		<div class="container">
		

		
		</div>
	</header>
	<main>
		<div class="container">
			<HelloWorld msg="You did it!" />
			<RouterView />
		</div>
	</main>
	<footer>
		<div class="container">
			<p>© 2024 Your Company. All rights reserved.</p>
		</div>
	</footer>

  	
</template>

<style scoped>
	header {
		width: 100%;
		height: 715px;
		flex-shrink: 0;

		line-height: 1.5;
		padding: 30px 0;
		text-align: center;

		background: url("@/assets/images/header-bg.jpg") center/cover no-repeat;
	}

	main {
		flex: 1 0 auto;
	}

	footer {
		flex-shrink: 0;
		text-align: center;
		padding: 1rem 0;
		font-size: 16px;
		color: white;
		background-color: black;
	}


	

	

	

	/* @media (min-width: 1024px) {
		header {
			display: flex;
			place-items: center;
			padding-right: calc(var(--section-gap) / 2);
		}

		.logo {
			margin: 0 2rem 0 0;
		}

		header .wrapper {
			display: flex;
			place-items: flex-start;
			flex-wrap: wrap;
		}

		nav {
			text-align: left;
			margin-left: -1rem;
			font-size: 1rem;

			padding: 1rem 0;
			margin-top: 1rem;
		}
	} */
</style>
