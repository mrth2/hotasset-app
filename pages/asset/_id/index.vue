<script lang="ts">
import { mapActions } from 'pinia'
import Vue from 'vue'
import SwiperClass from 'swiper'
import type { SwiperOptions } from 'swiper'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { IAsset, IAssetFilter } from '~/types/asset'
import 'swiper/css/swiper.css'
import { useAssetStore } from '~/stores/asset'
import { useUserStore } from '~/stores/user'

export default Vue.extend({
	name: 'AssetDetail',
	components: {
		Swiper,
		SwiperSlide
	},
	async asyncData({ error, route, $strapi }) {
		await useAssetStore().fetchAssetMetaData()
		let asset = null as IAsset | null
		let isFollowing = false
		const checkFollowing = !!$strapi.user
		await useAssetStore()
			.fetchAssetDetail(route.params.id, $strapi.user?.id, checkFollowing)
			.then((data) => {
				if (data) {
					asset = data.asset
					isFollowing = data.isFollowing
				}
			})
		if (!asset) {
			error({ statusCode: 404, message: 'Asset not found' })
		}
		return { asset, isFollowing }
	},
	data() {
		return {
			loading: true,
			asset: null as unknown as IAsset,
			isFollowing: false,
			sameAuthorAssets: [] as IAsset[],
			swiper: {
				thumbnail: {
					spaceBetween: 8,
					slidesPerView: 2,
					direction: 'horizontal',
					breakpoints: {
						1024: {
							slidesPerView: 8
						},
						768: {
							slidesPerView: 6
						},
						640: {
							slidesPerView: 4
						},
						320: {
							slidesPerView: 3
						}
					},
					freeMode: true,
					watchSlidesProgress: true,
					shortSwipes: false,
					threshold: 10
				},
				main: {} as SwiperOptions
			},
			localLiked: false,
			requestingFollow: false
		}
	},
	async fetch() {
		// fetch related assets
		await this.fetchSameAuthorAssets()
		this.loading = false
	},
	computed: {
		assetId() {
			return this.$route.params.id
		},
		similarAssetFilter(): Partial<IAssetFilter> {
			return {
				tags: this.asset?.tags?.map((tag) => tag.id) || [],
				categories: this.asset?.categories?.map((cat) => cat.id) || [],
				not_id: this.assetId,
				limit: 24
			}
		},
		thumbSwiper(): SwiperClass & {
			changeDirection: (direction: string) => void
		} {
			return (this.$refs.thumbnailSwiper as any)?.$swiper
		},
		mainSwiper(): SwiperClass {
			return (this.$refs.mainSwiper as any)?.$swiper
		},
		isLiked(): boolean {
			if (this.$strapi.user) {
				return !!this.asset.upvoters.find(
					(upvoter) => upvoter.id === this.$strapi.user.id
				)
			}
			return false
		},
		isOwner(): boolean {
			return this.$strapi.user && this.asset.author.id === this.$strapi.user.id
		}
	},
	watch: {
		isLiked() {
			this.localLiked = this.isLiked
		}
	},
	mounted() {
		this.localLiked = this.isLiked
		const config = {
			spaceBetween: 10,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			}
		} as SwiperOptions
		if (this.thumbSwiper) {
			config.thumbs = {
				swiper: this.thumbSwiper
			}
		}
		this.swiper.main = config
		// on window resize, update swiper
		window.addEventListener('resize', this.onWindowResize)
		this.onWindowResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onWindowResize)
	},
	methods: {
		...mapActions(useAssetStore, ['isIcon']),
		onWindowResize() {
			if (window.innerWidth < 768) {
				this.swiper.thumbnail.direction = 'horizontal'
			} else {
				this.swiper.thumbnail.direction = 'vertical'
			}
			if (this.thumbSwiper) {
				this.thumbSwiper.changeDirection(this.swiper.thumbnail.direction)
			}
		},
		searchByTag(tag: string) {
			const params = new URLSearchParams()
			params.append('q', tag)
			return `/search?${params.toString()}`
		},
		async fetchSameAuthorAssets() {
			try {
				const { assets } = await useAssetStore().fetchAssets({
					author: this.asset.author.username,
					not_id: this.assetId,
					limit: 4
				})
				this.sameAuthorAssets = assets
			} catch (err) {
				if (err instanceof Error) {
					this.$toast.error(err.message)
				}
			}
		},
		async followAuthor() {
			if (this.requestingFollow || this.isFollowing) {
				return
			}
			if (!this.$strapi.user) {
				this.$router.push('/login')
				return
			}
			this.requestingFollow = true
			this.isFollowing = true
			await useUserStore()
				.followUser(this.asset.author.id)
				.then((data) => {
					if (data) {
						this.$toast.success(
							`You're now following ${this.$displayName(
								data.createUserFollower.userFollower.user
							)}.`
						)
					}
				})
				.catch((err) => {
					this.isFollowing = false
					this.$toast.error(err.message)
				})
				.finally(() => {
					this.requestingFollow = false
				})
		},
		async unFollowAuthor() {
			if (this.requestingFollow || !this.isFollowing) {
				return
			}
			if (!this.$strapi.user) {
				this.$router.push('/login')
				return
			}
			this.requestingFollow = true
			this.isFollowing = false
			await useUserStore()
				.unFollowUser(this.asset.author.id)
				.then((data) => {
					if (data) {
						this.$toast.success(
							`You have unfollowed ${this.$displayName(this.asset.author)}.`
						)
					}
				})
				.catch((err) => {
					this.isFollowing = true
					this.$toast.error(err.message)
				})
				.finally(() => {
					this.requestingFollow = false
				})
		},
		async likeAsset() {
			// direct user to login to be able to like asset
			if (!this.$strapi.user) {
				this.$router.push('/login')
				return
			}
			const currentLiked = this.localLiked
			this.localLiked = !this.localLiked
			// else start liking
			try {
				const updatedAsset = await useAssetStore().likeOrUnlikeAsset(
					this.asset.id,
					currentLiked ? null : this.$strapi.user.id
				)
				if (updatedAsset) {
					this.asset = { ...this.asset, ...updatedAsset }
				}
			} catch (e) {
				this.$toast.error(
					e instanceof Error
						? e.message
						: "Something went wrong, can't process your action!"
				)
				this.localLiked = currentLiked
			}
		}
	}
})
</script>

<template>
	<main class="border-t relative">
		<!-- author, like and follow -->
		<div class="container mx-auto px-4 sm:px-6 relative">
			<div class="back xl:absolute mt-8 left-6">
				<a
					class="text-gray-500 inline-flex items-center cursor-pointer"
					@click="$router.go(-1)"
				>
					<img
						src="~/assets/images/icons/arrow-left.svg"
						class="inline-block mr-2"
						alt=""
					/>
					Back
				</a>
			</div>
			<div class="indivisual-card">
				<div class="flex justify-between items-center py-7">
					<div class="flex space-x-3">
						<NuxtLink :to="`/profile/${asset.author.username}`">
							<Avatar :src="asset.author.avatar.url" :size="44" />
						</NuxtLink>
						<div class="flex flex-col justify-center items-start">
							<NuxtLink :to="`/profile/${asset.author.username}`" class="block">
								{{ asset.author.username }}
							</NuxtLink>
							<a
								v-if="
									$strapi.user &&
									$strapi.user.username !== asset.author.username
								"
								class="text-brand text-sm cursor-pointer hover:underline"
								@click="isFollowing ? unFollowAuthor() : followAuthor()"
							>
								{{ isFollowing ? 'Unfollow' : 'Follow' }}
							</a>
						</div>
					</div>
					<div class="flex flex-row">
						<button
							class="btn__like"
							:class="{ active: localLiked }"
							@click="likeAsset"
						>
							<CoreIconFavorite
								class="icon fill-current shot-tools-icon mr-2"
							/>
							{{ localLiked ? 'Unlike' : 'Like' }}
						</button>
						<NuxtLink
							v-if="isOwner"
							tag="button"
							class="btn__like ml-2"
							:to="`/asset/${asset.id}/edit`"
						>
							<FontAwesomeIcon icon="pen" class="mr-2" />
							Edit Post
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
		<!-- gallery -->
		<div class="container mx-auto sm:px-6 relative">
			<div class="indivisual-card">
				<div class="indivisual-card-container">
					<div
						class="indivisual-card-img relative"
						:class="{ 'lg:!mr-0': asset.resources.length === 1 }"
					>
						<Swiper
							v-if="Object.keys(swiper.main).length && asset.resources.length"
							ref="mainSwiper"
							class="card-img-large"
							:options="swiper.main"
						>
							<SwiperSlide
								v-for="resource in asset.resources"
								:key="resource.id"
								:class="{
									'shot-thumnail-without-container': resource.type !== 'image',
									[resource.type]: true
								}"
							>
								<div
									:class="{
										'shot-thumnail-without-img': resource.type !== 'image'
									}"
								>
									<CoreImage
										:src="resource.url"
										:alt="resource.name"
										class="sm:rounded-lg"
										:modifiers="{ roundCorner: 12 }"
									/>
								</div>
							</SwiperSlide>
						</Swiper>
						<div
							v-if="asset.resources.length > 1"
							class="card-img-gallery z-10 mt-5 md:mt-0"
						>
							<Swiper
								ref="thumbnailSwiper"
								class="thumbnail-gallery"
								:options="swiper.thumbnail"
							>
								<SwiperSlide
									v-for="resource in asset.resources"
									:key="resource.id"
									class="rounded-lg"
									:class="{ icon: isIcon(resource.url) }"
								>
									<CoreImage
										:src="resource.url"
										:alt="resource.name"
										class="rounded-md"
										:width="92"
										:height="65"
										fit="minInside"
									/>
								</SwiperSlide>
							</Swiper>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- tags & info -->
		<div class="container mx-auto px-4 sm:px-6 relative">
			<div class="indivisual-card">
				<div class="indivisual-card-container">
					<div class="indivisual-tag">
						<NuxtLink
							v-for="(tag, index) in asset.tags"
							:key="tag.id"
							:to="searchByTag(tag.name)"
							class="indivisual-tag__item capitalize"
							:class="{ active: index === 0 }"
						>
							{{ tag.name }}
						</NuxtLink>
					</div>
					<h1 class="indivisual__name">{{ asset.title }}</h1>
					<p class="indivisual__desc">
						{{ asset.description }}
					</p>
					<!-- <p class="indivisual__desc mt-10">
						Something something
						<a href="#" class="text-brand">www.weburl.com</a>
					</p> -->
				</div>
			</div>
		</div>
		<!-- related assets -->
		<div v-if="!loading" class="container mx-auto px-4 sm:px-6 relative min-h-[80px]">
			<!-- same author assets -->
			<section v-if="sameAuthorAssets.length" class="mb-8 mt-20">
				<div class="flex justify-between items-center mb-4">
					<h4 class="font-bold text-xl">
						More from {{ asset.author.username }}
					</h4>
					<NuxtLink :to="`/profile/${asset.author.username}`" class="text-brand"
						>View Profile</NuxtLink
					>
				</div>
				<div class="shots-grid">
					<div class="shots-grid-row grid md:grid-cols-2 xl:grid-cols-4 gap-8">
						<AssetCard
							v-for="item in sameAuthorAssets"
							:key="item.id"
							:asset="item"
							:height="250"
						/>
					</div>
				</div>
			</section>
			<!-- similar assets -->
			<section class="mb-4">
				<div class="flex justify-between mb-4">
					<h4 class="font-bold text-xl">Similar Assets</h4>
				</div>
				<AssetListing :filters="similarAssetFilter" :hide-filters="true" />
			</section>
		</div>
		<!-- loading related assets -->
		<div v-else class="relative mt-20 min-h-[500px]">
			<div
				class="
					absolute
					inset-0
					z-10
					flex
					justify-center
					items-center
					bg-white bg-opacity-70
				"
			>
				<FontAwesomeIcon
					icon="fire"
					size="6x"
					class="text-brand animate-bounce"
				/>
			</div>
		</div>
	</main>
</template>

<style scoped lang="postcss">
.shot-thumnail-without-img {
	min-height: 400px;
	img {
		max-width: 150px;
	}
}
.card-img-large .swiper-slide {
	@apply md:!h-auto md:max-h-[800px];
	height: 500px;
	> div {
		@apply h-full;
	}
	img {
		@apply rounded-lg md:rounded-xl object-contain h-full md:object-top;
	}
	.shot-thumnail-without-img {
		img {
			@apply object-center;
		}
	}
}
.thumbnail-gallery .swiper-slide {
	img {
		@apply block w-full h-full object-cover;
	}
	&.icon {
		img {
			@apply object-contain;
		}
	}
}
.thumbnail-gallery ::v-deep .swiper-wrapper {
	@apply items-center;
}
</style>
