<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: 'Header',
	computed: {
		headerCategories() {
			return this.$store.state.header.categories
		}
	},
	methods: {
		async logout() {
			await this.$strapi.logout()
			this.$nuxt.refresh()
		}
	}
})
</script>

<template>
	<header>
		<div class="relative bg-white">
			<div class="container mx-auto px-4 sm:px-6">
				<div class="site-nav">
					<div class="site-nav__logo">
						<a href="./index.html">
							<span class="sr-only">Workflow</span>
							<img srcset="~/assets/images/logo.png 2x" alt />
						</a>
					</div>
					<form action class="form-search">
						<div class="xl:ml-12 flex rounded-md shadow-sm">
							<button class="inline-flex items-center px-4 rounded-l-md bg-gray-100 text-gray-500 text-sm">
								<svg
									width="24"
									height="24"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									class="text-gray-400 group-focus-within:text-gray-500 transition-colors duration-150"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
							<input
								id="company-website"
								type="text"
								name="company-website"
								class="outline-none bg-gray-100 flex-1 block w-1/2 py-3 pr-4 rounded-none rounded-r-md sm:text-sm"
								placeholder="Search HotAsset..."
							/>
						</div>
					</form>
					<div class="-mr-2 -my-2 md:hidden">
						<button type="button" class="btn-bar" aria-expanded="false">
							<span class="sr-only">Open menu</span>
							<!-- Heroicon name: outline/menu -->
							<svg
								class="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
					<template v-if="$strapi.user">
						<div class="site-nav-login">
							<NuxtLink :to="`/profile/${$strapi.user.username}`">
								<img src="~/assets/images/avatar.png" alt width="36" height="36" />
							</NuxtLink>
						</div>
						<div class="site-nav-actions">
							<a href="#" class="site-nav-actions__link">About</a>
							<a class="site-nav-actions__link relative">
								<img src="~/assets/images/icons/bell.svg" alt />
								<span class="notify-count">7</span>
							</a>
							<NuxtLink :to="`/profile/${$strapi.user.username}`">
								<img src="~/assets/images/avatar.png" alt width="36" height="36" />
							</NuxtLink>
							<NuxtLink to="#" class="btn-primary ml-8">Upload</NuxtLink>
						</div>
					</template>
					<template v-else>
						<div class="site-nav-login">
							<NuxtLink to="/signup">
								<img src="~/assets/images/icons/user.svg" alt width="24" height="24" />
							</NuxtLink>
						</div>
						<div class="site-nav-actions">
							<a href="#" class="site-nav-actions__link">About</a>
							<NuxtLink to="/login" class="site-nav-actions__link">Sign in</NuxtLink>
							<NuxtLink to="/signup" class="btn-primary ml-8">Sign up</NuxtLink>
						</div>
					</template>
				</div>
				<div class="site-nav-desktop-only relative">
					<ul class="site-nav-desktop-nav">
						<li class="menu-item static group">
							<a href="#" class="navbar__link">
								Graphics &amp;
								Design
							</a>
							<div class="dropdown-menu megamenu group-hover:block">
								<div class="dropdown-menu-container">
									<div class="menu-col">
										<div class="mb-8">
											<h4 class="megamenu__title">Logo & Brand Identity</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Logo Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Brand Style Guides</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">
														Business Cards &
														Stationery
													</a>
												</li>
											</ul>
										</div>
										<div class="mb-8">
											<h4 class="megamenu__title">Gaming</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Game Art</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Graphics for Streamers</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Twitch Store</a>
												</li>
											</ul>
										</div>
										<div class="mb-8">
											<h4 class="megamenu__title">Art & Illustration</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Illustration</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Pattern Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Portraits & Caricatures</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Cartoons & Comics</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Tattoo Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Storyboards</a>
												</li>
											</ul>
										</div>
									</div>
									<div class="menu-col">
										<div class="mb-8">
											<h4 class="megamenu__title">Visual Design</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Photoshop Editing</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Presentation Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Infographic Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Vector Tracing</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Resume Design</a>
												</li>
											</ul>
										</div>
										<div class="mb-8">
											<h4 class="megamenu__title">Packaging & Labels</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Book Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Album Cover Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Podcast Cover Art</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Packaging Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Car Wraps</a>
												</li>
											</ul>
										</div>
									</div>
									<div class="menu-col">
										<div class="mb-8">
											<h4 class="megamenu__title">Web & Mobile</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Web & Mobile Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Social Media Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">AR Filters & Lenses</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Web Banners</a>
												</li>
											</ul>
										</div>
										<div class="mb-8">
											<h4 class="megamenu__title">Architecture & Building Design</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">
														Architecture & Interior
														Design
													</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Landscape Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">
														Building Information
														Modeling
													</a>
												</li>
											</ul>
										</div>
										<div class="mb-8">
											<h4 class="megamenu__title">Fashion & Merchandise</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Fashion Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">T-Shirts & Merchandise</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Jewelry Design</a>
												</li>
											</ul>
										</div>
									</div>
									<div class="menu-col">
										<div class="mb-8">
											<h4 class="megamenu__title">Print Design</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Flyer Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Brochure Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Signage Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Poster Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Catalog Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Menu Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Postcard Design</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Invitation Design</a>
												</li>
											</ul>
										</div>

										<div class="mb-8">
											<h4 class="megamenu__title">Product & Characters Design</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">
														Industrial & Product
														Design
													</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Character Modeling</a>
												</li>
												<li>
													<a href="#" class="megamenu__link">Trade Booth Design</a>
												</li>
											</ul>
										</div>
										<div class="mb-8">
											<h4 class="megamenu__title">Misc</h4>
											<ul>
												<li>
													<a href="#" class="megamenu__link">Other</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li>
							<a href="#" class="navbar__link">
								Digital
								Marketing
							</a>
						</li>
						<li>
							<a href="#" class="navbar__link">
								Writing &amp;
								Translation
							</a>
						</li>
						<li>
							<a href="#" class="navbar__link">
								Video &amp;
								Animation
							</a>
						</li>
						<li>
							<a href="#" class="navbar__link">
								Music &amp;
								Audio
							</a>
						</li>
						<li>
							<a href="#" class="navbar__link">
								Programming &amp;
								Tech
							</a>
						</li>
						<li>
							<a href="#" class="navbar__link">Data</a>
						</li>
						<li>
							<a href="#" class="navbar__link">Business</a>
						</li>
						<li>
							<a href="#" class="navbar__link">Lifestyle</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</header>
</template>

<style scoped lang="postcss">
.menu-item:hover .dropdown-menu {
	@apply block;
}
/* .site-nav-desktop-only {
	@apply overflow-hidden;
} */
</style>