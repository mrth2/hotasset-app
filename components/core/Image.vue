<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: 'CoreImage',
	inheritAttrs: false,
	computed: {
		provider(): string {
			if (this.$attrs.provider) {
				return this.$attrs.provider
			} else if (
				this.$attrs.src &&
				this.$attrs.src.includes('res.cloudinary.com')
			) {
				return 'cloudinary'
			}
			return 'ipx'
		},
		src(): string {
			if (this.provider === 'cloudinary') {
				return this.$attrs.src.replace(String(process.env.CLOUDINARY_URL), '')
			} else if (this.$attrs.src.includes('~/assets/images/')) {
				return this.$attrs.src.replace('~/assets/images/', '/')
			}
			return this.$attrs.src
		},
		modifiedAttrs() {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { src, provider, ...attrs } = this.$attrs
			return attrs
		},
		isSvg(): boolean {
			return this.$attrs.src.includes('.svg')
		},
		component() {
			if (this.isSvg) {
				return 'NuxtImg'
			}
			return 'NuxtPicture'
		}
	}
})
</script>

<template>
	<Component
		:is="component"
		v-bind="modifiedAttrs"
		:provider="provider"
		:src="src"
		v-on="$listeners"
	/>
</template>

<style lang="postcss">
picture img {
	margin: auto;
}
</style>
