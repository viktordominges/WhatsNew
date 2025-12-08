<script setup>
import { RouterView } from 'vue-router';
import { Header } from '@/components/header';
import { FirstFooter, SecondFooter, ThirdFooter } from '@/components/footer';

</script>

<template>
	<header>
		
		<Header />

	</header>
	<main>
		<div class="container">
			
			<RouterView />

		</div>
	</main>
	<footer>

		<FirstFooter />
        <SecondFooter />
        <ThirdFooter />

	</footer>

  	
</template>

<style scoped>
	header {
		width: 100%;
		height: 715px;
		flex-shrink: 0;
		padding: 30px 0;

		background: url("@/assets/images/header-bg.jpg") center/cover no-repeat;
	}

	main {
		flex: 1 0 auto;
	}

	footer {
		flex-shrink: 0;
        width: 100%;
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
