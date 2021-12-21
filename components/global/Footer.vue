<script lang="ts">
import { mapState } from 'pinia'
import Vue from 'vue'
import { useHeaderStore } from '~/stores/header'
import { IFooterMenu } from '~/types'
export default Vue.extend({
	name: 'Footer',
	computed: {
		...mapState(useHeaderStore, ['socialLinks', 'footer'])
	},
	methods: {
		parseFooterLink(link: IFooterMenu['link'][0]) {
			const url = new URL(link.url)
			return url.pathname
		}
	}
})
</script>

<template>
	<footer class="footer">
		<div class="container mx-auto px-4 sm:px-6">
			<div class="footer-main-content">
				<div class="footer-info">
					<NuxtLink to="/">
						<CoreIconLogo class="footer-info__logo" />
					</NuxtLink>
					<p class="footer__desc">
						{{ footer.slogan }}
					</p>
					<div class="social">
						<a
							v-if="socialLinks.linkedin"
							:href="socialLinks.linkedin"
							class="social__link"
							target="_blank"
						>
							<FontAwesomeIcon :icon="['fab', 'linkedin']" size="lg" />
						</a>
						<a
							v-if="socialLinks.facebook"
							:href="socialLinks.facebook"
							class="social__link"
							target="_blank"
						>
							<FontAwesomeIcon :icon="['fab', 'facebook']" size="lg" />
						</a>
					</div>
				</div>
				<div v-if="footer.menu.length" class="footer-links-container">
					<div
						v-for="menu in footer.menu"
						:key="menu.id"
						class="footer-links-col"
					>
						<h5 class="text-base font-medium mb-5">{{ menu.heading }}</h5>
						<ul
							v-if="menu.link.length"
							class="list-none footer-links leading-6"
						>
							<li v-for="link in menu.link" :key="link.id" class="footer__item">
								<NuxtLink
									:to="parseFooterLink(link)"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									{{ link.title }}
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="footer-lower-content">
				<p>HotAsset {{ new Date().getFullYear() }} © All rights are reserved</p>
			</div>
		</div>
	</footer>
</template>

<style scoped lang="postcss">
.social {
	@apply gap-4;
}
.social__link {
	@apply text-paragraph border-0;
}
</style>
