<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { IAsset } from '~/@types/asset/index'
import { useAssetStore } from '~/stores/asset'

export default Vue.extend({
  name: 'AssetCard',
  props: {
    asset: {
      type: Object as PropType<IAsset>,
      default() {
        return {} as IAsset
      }
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
        return !!this.asset.upvoters.find(upvoter => upvoter.id === this.$strapi.user.id)
      }
      return false
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
      }
      const currentLiked = this.localLiked
      this.localLiked = !this.localLiked
      // else start liking
      const updatedAsset = await useAssetStore().likeOrUnlikeAsset(this.asset.id, currentLiked ? null : this.$strapi.user.id)
      if (updatedAsset) {
        this.$emit('update:asset', {
          ...this.asset,
          ...updatedAsset
        })
      }
    }
  }
})
</script>

<template>
  <div class="shot-item" :class="{ mounted }">
    <div class="inner">
      <div class="shot-thumbnail group">
        <template v-if="asset.thumbnail.provider === 'cloudinary'">
          <figure>
            <CoreImage
              :src="asset.thumbnail.url"
              :alt="`${asset.title}-${asset.resources[0].name}`"
            />
          </figure>
        </template>
        <template v-else>
          <figure
            :class="`shot-thumnail-without-container ${asset.resources[0].url.split('.').pop()}`"
          >
            <div class="shot-thumnail-without-img">
              <CoreImage
                :src="asset.thumbnail.url"
                :format="asset.thumbnail.format"
                :alt="`${asset.title} - ${asset.resources[0].name}`"
              />
              <span
                class="text-center"
              >{{ asset.title }}.{{ asset.resources[0].url.split('.').pop() }}</span>
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
            >{{ asset.title }}</div>
            <div class="shot-action ml-auto">
              <button
                v-tooltip.left-start="`I ${localLiked ? 'unlike' : 'like'} this`"
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
        <p class="shots-item__desc">{{ asset.description }}</p>
        <div class="flex items-center justify-between">
          <div class="user-information">
            <a href class="user-infor__avatar">
              <CoreImage :src="asset.author.avatar.url" alt width="24" height="24" />
            </a>
            <a href class="user-info__name">{{ asset.author.username }}</a>
          </div>
          <div class="shot-statistics">
            <CoreIconFavorite class="cursor-pointer" />
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
}
</style>