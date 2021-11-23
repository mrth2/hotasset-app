<script lang="ts">
import Vue from 'vue'
import { useHeaderStore } from '~/stores/header'
import { useTagStore } from '~/stores/tag'

export default Vue.extend({
	name: 'DefaultLayout',
	async fetch() {
		await useHeaderStore().fetchCategories()
	},
	mounted() {
		useTagStore().fetchPopularTags()
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