<script lang="ts">
import Vue from 'vue'
import { ICategory, IUser } from '~/@types'
import { useHeaderStore } from '~/stores/header'

type menuColCategories = ICategory & {
	subCategories: ICategory[][]
}

export default Vue.extend({
	name: 'Header',
	data() {
		return {
			searchKeyword: ''
		}
	},
	computed: {
		headerCategories(): menuColCategories[] {
			return useHeaderStore().categories.map((parent) => {
				const subCategories: ICategory[][] = []
				if (parent.sub_categories?.length) {
					parent.sub_categories.forEach((subCategory, index) => {
						const mod = index % 4
						if (!subCategories[mod]) subCategories[mod] = []
						subCategories[mod].push(subCategory)
					})
				}
				return {
					...parent,
					subCategories
				}
			})
		},
		user() {
			return this.$strapi.user as IUser
		},
		currentCategorySlug() {
			if (this.$route.name === 'category-slug') {
				return this.$route.params.slug
			}
			else if (this.$route.name === 'search' && this.$route.query.category) {
				return this.$route.query.category
			}
			return null
		}
	},
	methods: {
		async logout() {
			await this.$strapi.logout()
			this.$nuxt.refresh()
		},
		searchAsset() {
			if (this.searchKeyword !== '') {
				const params = new URLSearchParams()
				params.append('q', this.searchKeyword)
				if (this.$route.params.slug) {
					params.append('category', this.$route.params.slug)
				}
				this.$router.push(`/search?${params.toString()}`)
			}
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
						<NuxtLink to="/">
							<span class="sr-only">HotAsset</span>
							<CoreIconLogo />
						</NuxtLink>
					</div>
					<form class="form-search" @submit.prevent="searchAsset">
						<div class="xl:ml-12 flex rounded-md shadow-sm">
							<button class="form-search__btn">
								<svg
									width="24"
									height="24"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									class="
										text-gray-400
										group-focus-within:text-gray-500
										transition-colors
										duration-150
									"
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
								v-model="searchKeyword"
								type="text"
								class="form-search__input"
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
					<template v-if="user">
						<div class="site-nav-login">
							<NuxtLink :to="`/profile/${user.username}`">
								<Avatar />
							</NuxtLink>
						</div>
						<div class="site-nav-actions">
							<NuxtLink to="/about" class="site-nav-actions__link"
								>About</NuxtLink
							>
							<a class="site-nav-actions__link relative">
								<CoreImage src="~/assets/images/icons/bell.svg" alt />
								<span class="notify-count">7</span>
							</a>
							<NuxtLink :to="`/profile/${user.username}`">
								<Avatar />
							</NuxtLink>
							<NuxtLink to="/upload" class="btn-primary ml-8">Upload</NuxtLink>
						</div>
					</template>
					<template v-else>
						<div class="site-nav-login">
							<NuxtLink to="/signup">
								<CoreImage
									src="~/assets/images/icons/user.svg"
									alt
									width="24"
									height="24"
								/>
							</NuxtLink>
						</div>
						<div class="site-nav-actions">
							<NuxtLink to="/about" class="site-nav-actions__link"
								>About</NuxtLink
							>
							<NuxtLink to="/login" class="site-nav-actions__link"
								>Sign in</NuxtLink
							>
							<NuxtLink to="/signup" class="btn-primary ml-8">Sign up</NuxtLink>
						</div>
					</template>
				</div>
				<div class="site-nav-desktop-only relative">
					<ul class="site-nav-desktop-nav">
						<li
							v-for="parent in headerCategories"
							:key="parent.id"
							class="menu-item static group"
						>
							<NuxtLink
								:to="`/category/${parent.slug}`"
								class="navbar__link"
								:class="{ current: parent.slug === currentCategorySlug }"
								>{{ parent.title }}</NuxtLink
							>
							<small v-if="parent.is_new" class="badge">New</small>
							<div
								v-if="parent.sub_categories && parent.sub_categories.length"
								class="dropdown-menu megamenu group-hover:block"
							>
								<div class="dropdown-menu-container">
									<div
										v-for="(col, index) in parent.subCategories"
										:key="index"
										class="menu-col"
									>
										<div v-for="child in col" :key="child.id" class="mb-8">
											<h4 class="megamenu__title">
												<NuxtLink
													:to="`/category/${child.slug}`"
													:class="{
														current: child.slug === currentCategorySlug
													}"
													>{{ child.title }}</NuxtLink
												>
												<small v-if="child.is_new" class="badge">New</small>
											</h4>
											<ul
												v-if="
													child.sub_categories && child.sub_categories.length
												"
											>
												<li
													v-for="subChild in child.sub_categories"
													:key="subChild.id"
												>
													<NuxtLink
														:to="`/category/${subChild.slug}`"
														class="megamenu__link"
														:class="{
															current: subChild.slug === currentCategorySlug
														}"
														>{{ subChild.title }}</NuxtLink
													>
													<small v-if="subChild.is_new" class="badge"
														>New</small
													>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
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
.site-nav-desktop-nav {
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}
.megamenu__title > a.current,
.navbar__link.current:after {
	content: '';
	@apply absolute bottom-2 inset-x-0 bg-brand h-1;
}
.megamenu__link.current {
	@apply text-brand underline;
}
</style>
