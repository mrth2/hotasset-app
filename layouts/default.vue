<script lang="ts">
import Vue from 'vue'
import { useAppStore } from '~/stores/app'

export default Vue.extend({
	name: 'DefaultLayout',
	head() {
		const classes: string[] = []
		const store = useAppStore()
		if (store.menuOpen) classes.push('toggled')
		if (store.modalOpen) classes.push('overflow-auto', 'md:overflow-hidden')
		return {
			bodyAttrs: {
				class: classes.join(' ')
			}
		}
	},
	mounted() {
		// parse hash message to toast
		const hashes = this.$route.hash.split('#').filter(hash => hash)
		const message = hashes.find(hash => hash.includes('message'))?.split('=')[1]
		if (message) this.$toast.info(decodeURIComponent(message), {
			duration: 10000,
			onComplete() {
				window.location.hash = ''
			}
		})
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
		@apply hidden;
	}
}
body.toggled {
	@apply overflow-scroll;

	.sidebar {
		@apply translate-y-0;
	}
	header {
		@apply fixed top-0 right-0 left-0;
	}
	main,
	footer {
		@apply hidden;
	}
}
</style>
