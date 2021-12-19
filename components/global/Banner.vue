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
						:src="`/homepage/${!$strapi.user ? 'hero-' : ''}illustration.png`"
						alt
						class="mx-auto"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
