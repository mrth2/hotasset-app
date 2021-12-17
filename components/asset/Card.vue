<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { IAsset } from '~/types/asset/index'
import { useAssetStore } from '~/stores/asset'

export default Vue.extend({
	name: 'AssetCard',
	props: {
		asset: {
			type: Object as PropType<IAsset>,
			default() {
				return {} as IAsset
			}
		},
		height: {
			type: Number as PropType<number>,
			default: null
		}
	},
	data() {
		return {
			mounted: false,
			localLiked: false
		}
	},
	computed: {
		isLiked(): boolean {
			if (this.$strapi.user) {
				return !!this.asset.upvoters.find(
					(upvoter) => upvoter.id === this.$strapi.user.id
				)
			}
			return false
		},
		figureHeight(): string {
			if (this.height) {
				return this.height + 'px'
			}
			return 'auto'
		},
		srcHeight(): number | null {
			if (this.height) {
				return this.height * 2
			}
			return null
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
	created() {
		setTimeout(() => {
			this.mounted = true
		}, 10)
	},
	mounted() {
		this.localLiked = this.isLiked
	},
	methods: {
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
					this.$emit('update:asset', {
						...this.asset,
						...updatedAsset
					})
				}
			} catch (e) {
				this.$toast.error(
					e instanceof Error
						? e.message
						: "Something went wrong, can't process your action!"
				)
				this.localLiked = currentLiked
			}
		},
		getAssetExt(asset: IAsset): string | undefined {
			return asset.resources[0].url.split('.').pop()
		}
	}
})
</script>

<template>
	<div class="shot-item" :class="{ mounted }">
		<div class="inner">
			<div class="shot-thumbnail group">
				<template v-if="asset.thumbnail.provider === 'cloudinary'">
					<figure :style="`height: ${figureHeight}`">
						<CoreImage
							:src="asset.thumbnail.url"
							:alt="`${asset.title}-${asset.resources[0].name}`"
							:height="srcHeight"
						/>
					</figure>
				</template>
				<template v-else>
					<figure
						:class="`shot-thumnail-without-container ${getAssetExt(asset)}`"
						:style="`height: ${figureHeight}`"
					>
						<div class="shot-thumnail-without-img">
							<CoreImage
								:src="asset.thumbnail.url"
								:format="asset.thumbnail.format"
								:alt="`${asset.title} - ${asset.resources[0].name}`"
								:height="srcHeight"
							/>
							<span class="text-center">
								{{ asset.title }}.{{ getAssetExt(asset) }}
							</span>
						</div>
						<CoreImage
							class="shot-thumbnail-icon"
							:src="asset.thumbnail.url"
							:format="asset.thumbnail.format"
							:alt="`${asset.title} - ${asset.resources[0].name}`"
						/>
					</figure>
				</template>
				<NuxtLink :to="`/asset/${asset.id}`" class="shot-thumbnail__link" />
				<div class="shot-thumbnail-overlay">
					<div class="shot-thumbnail-overlay-content">
						<div
							v-if="asset.thumbnail.provider === 'cloudinary'"
							class="shot-title"
						>
							{{ asset.title }}
						</div>
						<div class="shot-action ml-auto">
							<NuxtLink
								v-if="isOwner"
								v-tooltip.left-start="`Edit this post`"
								:to="`/asset/${asset.id}/edit`"
								tag="button"
								class="like-shot mb-2"
							>
								<FontAwesomeIcon icon="pen" />
							</NuxtLink>
							<button
								v-tooltip.left-start="
									`I ${localLiked ? 'unlike' : 'like'} this`
								"
								class="like-shot"
								:class="{ liked: localLiked }"
								@click="likeAsset"
							>
								<CoreIconFavorite />
							</button>
						</div>
					</div>
				</div>
				<!-- <div v-else class="swiper-container">
            <div class="swiper-wrapper">
              <div
                v-for="(image,index) in getAssetImages(item)"
                :key="index"
                class="swiper-slide"
              >
                <img :src="image" alt />
              </div>
            </div>
        </div>-->
				<!-- <Swiper v-else :options="swiperOption" class="swiper">
            <SwiperSlide
              v-for="(image,index) in getAssetImages(item)"
              :key="index"
              class="swiper-slide"
            >
              <img :src="image" alt />
            </SwiperSlide>
            <div slot="pagination" class="swiper-pagination" />
        </Swiper>-->
			</div>
			<div class="shot-details-container">
				<p class="shots-item__desc line-clamp-2">{{ asset.description }}</p>
				<div class="flex items-center justify-between">
					<div class="user-information">
						<NuxtLink
							:to="`/profile/${asset.author.username}`"
							class="user-infor__avatar flex gap-1"
						>
							<Avatar :src="asset.author.avatar ? asset.author.avatar.url : null" :size="24" />
							<span class="user-info__name">{{ asset.author.username }}</span>
						</NuxtLink>
					</div>
					<div class="shot-statistics">
						<CoreIconFavorite />
						<span>{{ asset.likes || 0 }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.shot-item {
	@apply rounded-lg;

	&.mounted {
		@apply translate-y-0;
	}

	.shot-thumbnail {
		figure:not(.shot-thumnail-without-container) {
			img {
				@apply object-cover object-center w-full h-full;
			}
		}
	}
}
</style>
