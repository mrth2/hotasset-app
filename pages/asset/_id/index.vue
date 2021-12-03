<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import SwiperClass from 'swiper'
import type { SwiperOptions } from 'swiper'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { IAsset } from '~/@types/asset'
import 'swiper/css/swiper.css'
import { useAssetStore } from '~/stores/asset'

export default Vue.extend({
	name: 'AssetDetail',
	components: {
		Swiper,
		SwiperSlide
	},
	async asyncData({ app, route }) {
		await useAssetStore().fetchAssetMetaData()
		let asset = null as IAsset | null
		await app.apolloProvider?.defaultClient
			.query<{ asset: IAsset }>({
				query: gql`
					query AssetDetail($id: ID!) {
						asset(id: $id) {
							id
							title
							description
							createdAt
							updatedAt
							tags {
								id
								name
							}
							resources {
								id
								name
								mime
								width
								height
								url
								size
								ext
							}
							likes
							author {
								username
								first_name
								last_name
								avatar {
									url
								}
							}
							upvoters {
								id
							}
						}
					}
				`,
				variables: {
					id: route.params.id
				}
			})
			.then(({ data }) => {
				asset = data.asset
				if (asset.resources.length > 0) {
					asset.resources = asset.resources.map((resource) => {
						const type = useAssetStore().getAssetType(resource)
						if (!type) return resource
						const { url, format } = app.$getAssetUrl(resource.url, type?.value)
						return {
							...resource,
							url,
							format,
							type: type.value
						}
					})
				}
			})
			.catch((err) => {
				throw err
			})
		return { asset }
	},
	data() {
		return {
			loading: true,
			asset: null as unknown as IAsset,
			sameAuthorAssets: [] as IAsset[],
			similarAssets: [] as IAsset[],
			swiper: {
				thumbnail: {
					spaceBetween: 10,
					slidesPerView: 8,
					freeMode: true,
					watchSlidesProgress: true,
					direction: 'vertical'
				},
				main: {} as SwiperOptions
			},
			localLiked: false
		}
	},
	async fetch() {
		await Promise.all([
			// fetch related assets
			this.fetchSameAuthorAssets(),
			this.fetchSimilarAssets()
		]).then(() => {
			this.loading = false
		})
	},
	computed: {
		assetId() {
			return this.$route.params.id
		},
		thumbSwiper(): SwiperClass {
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
	},
	methods: {
		async fetchSameAuthorAssets() {
			try {
				this.sameAuthorAssets = await useAssetStore().fetchAssets({
					author: this.asset.author.username,
					not_id: this.assetId,
					limit: 4
				})
			} catch (err) {
				if (err instanceof Error) {
					this.$toast.error(err.message)
				}
			}
		},
		async fetchSimilarAssets() {
			try {
				this.similarAssets = await useAssetStore().fetchAssets({
					tags: this.asset?.tags?.map((tag) => tag.id) || [],
					categories: this.asset?.categories?.map((cat) => cat.id) || [],
					not_id: this.assetId,
					limit: 4
				})
			} catch (err) {
				if (err instanceof Error) {
					this.$toast.error(err.message)
				}
			}
		},
		followAuthor() {},
		async likeAsset() {
			// direct user to login to be able to like asset
			if (!this.$strapi.user) {
				this.$router.push('/login')
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
						<Avatar :src="asset.author.avatar.url" :size="44" />
						<div class="flex flex-row items-center">
							<span class="block">{{ asset.author.username }}</span>
							<a
								v-if="$strapi.user.username !== asset.author.username"
								class="text-brand cursor-pointer hover:underline"
								@click="followAuthor"
								>Follow</a
							>
						</div>
					</div>
					<div>
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
									/>
								</div>
							</SwiperSlide>
						</Swiper>
						<div
							v-if="asset.resources.length > 1"
							class="card-img-gallery z-10"
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
						<a
							v-for="(tag, index) in asset.tags"
							:key="tag.id"
							class="indivisual-tag__item capitalize"
							:class="{ active: index === 0 }"
						>
							{{ tag.name }}
						</a>
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
		<div v-if="!loading" class="container mx-auto px-4 sm:px-6 relative">
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
			<section v-if="similarAssets.length" class="mb-4">
				<div class="flex justify-between mb-4">
					<h4 class="font-bold text-xl">Similar Assets</h4>
				</div>
				<div class="shots-grid">
					<div class="shots-grid-row grid md:grid-cols-2 xl:grid-cols-4 gap-8">
						<AssetCard
							v-for="item in similarAssets"
							:key="item.id"
							:asset="item"
							:height="250"
						/>
					</div>
				</div>
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
</style>
