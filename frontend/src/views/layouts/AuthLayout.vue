<script setup lang="ts">
// import ActivitiesList from '@/components/activities/ActivitiesList.vue';
// import AdditionalFilters from '@/components/AdditionalFilters.vue';
import { HeaderBar } from '@/components/header';
import { FirstFooter, SecondFooter, ThirdFooter } from '@/components/footer';

</script>

<template>
    <header>
		
		<HeaderBar />

	</header>
	<main class="auth-main">
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
.auth-main {
    padding-top: 30px;
}
</style>
