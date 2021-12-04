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
<style lang="postcss">
body {
	@apply min-h-screen;
}
.hide-scroller {
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
