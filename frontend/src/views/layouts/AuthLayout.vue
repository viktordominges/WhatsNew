<script setup lang="ts">
// import ActivitiesList from '@/components/activities/ActivitiesList.vue';
// import AdditionalFilters from '@/components/AdditionalFilters.vue';
import { HeaderBar } from '@/components/header';
import { FirstFooter, SecondFooter, ThirdFooter } from '@/components/footer';

</script>

<template>
    <header class="auth-header">
		
		<HeaderBar />

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
