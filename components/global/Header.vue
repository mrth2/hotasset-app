<script lang="ts">
import Vue from 'vue'
import { ICategory, IUser } from '~/@types'
import { useAppStore } from '~/stores/app'
import { useHeaderStore } from '~/stores/header'

type menuColCategories = ICategory & {
	subCategories: ICategory[][]
	open: boolean
}

export default Vue.extend({
	name: 'Header',
	data() {
		const openCategoryMenu = {
			root: false
		}
		useHeaderStore().flattenCategories.forEach((item) => {
			openCategoryMenu[item.id] = false
		})
		return {
			searchKeyword: '',
			showUserNavigator: false,
			openCategoryMenu
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
					open: false,
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
			} else if (this.$route.name === 'search' && this.$route.query.category) {
				return this.$route.query.category
			}
			return null
		},
		menuOpen() {
			return useAppStore().menuOpen
		}
	},
	methods: {
		toggleMenu() {
			useAppStore().toggleMenu()
		},
		toggleCategory(id: string) {
			if (Object.prototype.hasOwnProperty.call(this.openCategoryMenu, id))
				this.openCategoryMenu[id] = !this.openCategoryMenu[id]
		},
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
	<div>
		<!-- navigator -->
		<nav id="sidebar" class="sidebar">
			<ul v-if="menuOpen" class="sidebar-menu">
				<li class="relative group">
					<a
						class="
							sidebar-menu__link
							flex
							justify-between
							items-center
							sidebar-menu__parent
						"
						:class="{ open: openCategoryMenu.root }"
						@click="toggleCategory('root')"
					>
						<span>Categories</span>
						<span class="cursor-pointer">
							<CoreIconChevron />
						</span>
					</a>
					<ul class="hidden" :class="{ '!block': openCategoryMenu.root }">
						<!-- level 1 categories -->
						<li
							v-for="parent in headerCategories"
							:key="parent.id"
							class="nav__item"
						>
							<p
								class="
									sidebar-menu__child
									flex
									justify-between
									items-center
									sidebar-menu__parent
								"
								:class="{ open: openCategoryMenu[parent.id] }"
							>
								<NuxtLink :to="`/category/${parent.slug}`">
									{{ parent.title }}
								</NuxtLink>
								<span
									v-if="parent.sub_categories && parent.sub_categories.length"
									class="cursor-pointer"
									@click="toggleCategory(parent.id)"
								>
									<CoreIconChevron />
								</span>
							</p>
							<!-- level 2 categories -->
							<ul
								v-if="parent.sub_categories && parent.sub_categories.length"
								class="hidden"
								:class="{ '!block': openCategoryMenu[parent.id] }"
							>
								<li v-for="child in parent.sub_categories" :key="child.id">
									<p
										class="
											sidebar-menu__child
											flex
											justify-between
											items-center
											sidebar-menu__parent
										"
										:class="{ open: openCategoryMenu[child.id] }"
									>
										<NuxtLink
											:to="`/category/${child.slug}`"
											class="ml-4 sidebar-menu-sub__link"
										>
											{{ child.title }}
										</NuxtLink>
										<span
											v-if="child.sub_categories && child.sub_categories.length"
											class="cursor-pointer"
											@click="toggleCategory(child.id)"
										>
											<CoreIconChevron />
										</span>
									</p>
									<ul
										v-if="child.sub_categories && parent.sub_categories.length"
										class="hidden"
										:class="{ '!block': openCategoryMenu[child.id] }"
									>
										<li
											v-for="subChild in child.sub_categories"
											:key="subChild.id"
										>
											<NuxtLink
												:to="`/category/${subChild.slug}`"
												class="ml-8 sidebar-menu-sub__link !text-sm"
											>
												{{ subChild.title }}
											</NuxtLink>
										</li>
									</ul>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li class="relative">
					<NuxtLink to="/about" class="sidebar-menu__link">About </NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/account/settings" class="sidebar-menu__link"
						>Settings
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/help" class="sidebar-menu__link">Get Help</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/terms" class="sidebar-menu__link"
						>Terms & Privacy</NuxtLink
					>
				</li>
				<li><a class="sidebar-menu__link" @click="logout">Log Out</a></li>
			</ul>
		</nav>
		<!-- header info -->
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
							<button
								type="button"
								class="btn-bar"
								aria-expanded="false"
								@click="toggleMenu"
							>
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
							<ul class="site-nav-actions">
								<li>
									<NuxtLink to="/about" class="site-nav-actions__link">
										About
									</NuxtLink>
								</li>
								<li>
									<a class="site-nav-actions__link relative">
										<CoreImage
											src="~/assets/images/icons/bell.svg"
											alt
											:width="20"
										/>
										<span class="notify-count !-right-6">7</span>
									</a>
								</li>
								<li
									id="header-user-setting"
									class="header-user-setting"
									@click="showUserNavigator = !showUserNavigator"
								>
									<Avatar />
									<CoreFormSlideToggle
										:manual-show="showUserNavigator"
										:is-absolute="true"
										:z-index="30"
										:hide-on-click-out="true"
										@hide="showUserNavigator = false"
									>
										<template #content>
											<div class="dropdown-user-setting !z-20">
												<h2>
													👋
													<span class="inline-block ml-2">
														Welcome,
														<NuxtLink :to="`/profile/${user.username}`">{{
															$displayName(user)
														}}</NuxtLink
														>!
													</span>
												</h2>
												<ul>
													<li>
														<NuxtLink to="/account/settings">
															<img
																src="~/assets/images/icons/user/Setting.svg"
																alt=""
															/>
															Settings
														</NuxtLink>
													</li>
													<li>
														<NuxtLink to="/help">
															<img
																src="~/assets/images/icons/user/Danger-Circle.svg"
																alt=""
															/>
															Get Help
														</NuxtLink>
													</li>
													<li>
														<NuxtLink to="/terms">
															<img
																src="~/assets/images/icons/user/Paper.svg"
																alt=""
															/>
															Terms & Privacy
														</NuxtLink>
													</li>
													<li>
														<a @click="logout">
															<img
																src="~/assets/images/icons/user/Logout.svg"
																alt=""
															/>
															Log Out
														</a>
													</li>
												</ul>
											</div>
										</template>
									</CoreFormSlideToggle>
								</li>
								<li>
									<NuxtLink to="/upload" class="btn-primary ml-8">
										Upload
									</NuxtLink>
								</li>
							</ul>
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
								<NuxtLink to="/signup" class="btn-primary ml-8"
									>Sign up</NuxtLink
								>
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
	</div>
</template>

<style scoped lang="postcss">
.dropdown-user-setting {
	@apply absolute text-sm z-10 -right-1/2 translate-x-1/2 mt-2  border border-gray-50 overflow-auto shadow-xl bg-white;
	top: calc(100% + 0px);
	min-width: 335px;

	h2 {
		@apply py-4 text-base text-title mx-8 border-b mt-5;
	}
	ul {
		@apply my-3;
		li {
			@apply px-8 hover:bg-gray-100;
			a {
				@apply py-3 flex items-center text-base text-paragraph hover:text-title;
			}
		}
		&:hover img {
			/* filter: grayscale(0); */
			@apply opacity-100;
		}
	}
	img {
		@apply inline-block mr-3 opacity-50;
		/* filter: grayscale(1); */
	}
}
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
/* sidebar */
.sidebar {
	@apply fixed z-10 h-full shadow-md block md:hidden;
	@apply z-40 w-full;
	top: 57px;
	transform: translateY(-140%);
}
.sidebar-menu {
	@apply bg-white h-full px-5;
}
.sidebar-menu__link {
	@apply text-lg py-3 flex;
}
.sidebar-menu__parent svg {
	@apply font-bold text-xl;
}
.sidebar-menu__parent.open svg {
	@apply transform rotate-180;
}
.sidebar-menu__child {
	@apply text-base flex py-2;
}
.sidebar-menu-sub__link {
	@apply text-gray-500 block py-1;
}
.sidebar-menu-setting {
	@apply py-4;
}
.sidebar-menu-setting img {
	@apply mr-3;
}
</style>
