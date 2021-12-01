<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'DefaultLayout'
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
