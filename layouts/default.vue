<script lang="ts">
import Vue from 'vue'
import { useHeaderStore } from '~/stores/header'

export default Vue.extend({
	name: 'DefaultLayout',
	async fetch() {
		const headerStore = useHeaderStore()
		await headerStore.fetchCategories()
	}
})
</script>
<template>
	<div>
		<Header />
		<Nuxt />
		<Footer />
	</div>
</template>
<style scoped lang="postcss">
:global(body) {
	@apply min-h-screen;
}
</style>