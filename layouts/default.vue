<script lang="ts">
import Vue from 'vue'
import { useAppStore } from '~/stores/app'

export default Vue.extend({
	name: 'DefaultLayout',
	head() {
		return {
			bodyAttrs: {
				class: useAppStore().menuOpen ? 'toggled' : ''
			}
		}
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
