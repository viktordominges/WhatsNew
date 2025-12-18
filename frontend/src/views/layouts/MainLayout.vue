<script setup lang="ts">
// import ActivitiesList from '@/components/activities/ActivitiesList.vue';
// import AdditionalFilters from '@/components/AdditionalFilters.vue';
import { Header } from '@/components/header';
import { FirstFooter, SecondFooter, ThirdFooter } from '@/components/footer';

</script>

<template>
    <header class="main-header">
		
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
    .main-header {
		height: 715px;
		/* padding: 30px 0; */
		background: url("@/assets/images/header-bg.jpg") center/cover no-repeat;
	}
</style>
