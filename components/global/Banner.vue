<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: 'GlobalBanner',
	props: {
		title: {
			type: String,
			default: 'Every Play in the Marketing & Sales Playbook'
		},
		description: {
			type: String,
			default:
				"Dribbble is the leading destination to find &amp; showcase creative work and home to the world's best design professionals."
		},
		hasButton: {
			type: Boolean,
			default: true
		},
		cover: {
			type: String,
			default: null
		}
	}
})
</script>

<template>
	<section class="banner">
		<div class="container mx-auto">
			<div class="banner-inner">
				<div class="banner-content px-4 sm:px-6">
					<h1 class="banner__title">{{ title }}</h1>
					<p class="banner__desc">{{ description }}</p>
					<template v-if="hasButton">
						<NuxtLink
							v-if="$strapi.user"
							class="banner__btn btn-primary"
							to="/upload"
						>
							Upload now
						</NuxtLink>
						<NuxtLink v-else class="banner__btn btn-primary" to="/signup">
							Sign up
						</NuxtLink>
					</template>
				</div>
				<div class="banner-image">
					<CoreImage
						:src="
							cover ||
							`/homepage/${!$strapi.user ? 'hero-' : ''}illustration.png`
						"
						alt
						class="mx-auto"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="postcss">
/* =======+BANNER +======== */
.banner {
	background: #f8f9fd;
}
.banner-inner {
	@apply flex flex-col pt-10 items-center justify-center md:flex-row md:py-0 md:justify-between;
}
.banner-image {
	@apply self-auto;
}
.banner-content {
	@apply flex flex-col items-center py-0 mb-5 text-center md:py-10 md:items-start md:m-0 md:text-left;
	max-width: min(724px, 50%);
}
.banner__title {
	@apply text-2xl lg:text-5xl text-gray-900 font-bold w-max;
}
.banner__desc {
	@apply my-5 text-gray-500 text-base;
}
.banner__btn {
	@apply w-full md:w-auto;
}
</style>
