<script lang="ts">
import { mapState } from 'pinia'
import Vue from 'vue'
import { useHeaderStore } from '~/stores/header'
export default Vue.extend({
	name: 'Footer',
	computed: {
		...mapState(useHeaderStore, ['socialLinks'])
	}
})
</script>

<template>
	<footer class="footer">
		<div class="container mx-auto px-4 sm:px-6">
			<div class="footer-main-content">
				<div class="footer-info">
					<a href="#">
						<CoreIconLogo class="footer-info__logo" />
					</a>
					<p class="footer__desc">
						HotAsset is the world’s leading community for creatives to share,
						grow, and get hired.
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
				<div class="footer-links-container">
					<div class="footer-links-col">
						<h5 class="text-base font-medium mb-5">For designers</h5>
						<ul class="list-none footer-links leading-6">
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Go Pro!
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Explore design works
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Design blog
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Overtime podcast
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Dribbble meetups
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
									>Playoffs</a
								>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Weekly warm-ups
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Code of conduct
								</a>
							</li>
						</ul>
					</div>
					<div class="footer-links-col">
						<div class="mb-5">
							<h5 class="text-base font-medium mb-5">Hire designers</h5>
							<ul class="list-none footer-links leading-6">
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
									>
										Post a job opening
									</a>
								</li>
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
									>
										Post a freelance project
									</a>
								</li>
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
									>
										Search for designers
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h5 class="text-base font-medium mb-5">Brands</h5>
							<ul>
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
									>
										Advertise with us
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div class="footer-links-col">
						<h5 class="text-base font-medium mb-5">Company</h5>
						<ul class="list-none footer-links leading-6">
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
									>About</a
								>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
									>Careers</a
								>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Media Kit
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Dribbble shop
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
									>Testimonials</a
								>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
									>API</a
								>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Terms of service
								</a>
							</li>
							<li class="footer__item">
								<a
									href="#"
									class="
										text-gray-500
										border-b border-solid border-transparent
										hover:border-red-500 hover:text-red-500
									"
								>
									Privacy policy
								</a>
							</li>
						</ul>
					</div>
					<div class="footer-links-col">
						<div class="mb-5">
							<h5 class="text-base font-medium mb-5">Directories</h5>
							<ul class="list-none footer-links leading-6">
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
									>
										Design jobs
									</a>
								</li>
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
									>
										Designers to hire
									</a>
								</li>
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
										>Tags</a
									>
								</li>
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
										>Places</a
									>
								</li>
							</ul>
						</div>

						<div>
							<h5 class="text-base font-medium mb-5">Design assets</h5>
							<ul>
								<li class="footer__item">
									<a
										href="#"
										class="
											text-gray-500
											border-b border-solid border-transparent
											hover:border-red-500 hover:text-red-500
										"
									>
										Shop Creative Market
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="footer-lower-content">
				<p>HotAsset 2021 © All rights are reserved</p>
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
