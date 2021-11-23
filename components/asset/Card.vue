<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { IAsset } from '~/@types/asset/index'
import { IUser } from '~/@types'

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
      mounted: false
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
  created() {
    setTimeout(() => {
      this.mounted = true
    }, 10)
  },
  methods: {
    likeAsset(): void {
      /* if (this.isLiked) {
        this.asset.upvoters = this.asset.upvoters.filter(upvoter => upvoter.id !== this.$strapi.user.id)
        this.asset.likes--;
      } else {
        this.asset.upvoters.push((this.$strapi.user as IUser))
        this.asset.likes++
      } */
    }
  }
})
</script>

<template>
  <div class="shot-item" :class="{ mounted }">
    <div class="inner">
      <NuxtLink class="shot-thumbnail group block" :to="`/asset/${asset.id}`">
        <template v-if="asset.thumbnail.provider === 'cloudinary'">
          <figure>
            <NuxtPicture
              :provider="asset.thumbnail.provider"
              :src="asset.thumbnail.url"
              :alt="`${asset.title}-${asset.resources[0].name}`"
            />
          </figure>
          <a class="shot-thumbnail__link" href="#"></a>
          <div class="shot-thumbnail-overlay">
            <div class="shot-thumbnail-overlay-content">
              <div class="shot-title">{{ asset.title }}</div>
              <div class="shot-action">
                <a
                  class="like-shot"
                  :class="{ liked: isLiked }"
                  :title="`${isLiked ? 'Unlike' : 'Like'} this shot`"
                  @click="likeAsset"
                >
                  <CoreIconFavorite />
                </a>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <figure
            :class="`shot-thumnail-without-container ${asset.resources[0].url.split('.').pop()}`"
          >
            <div class="shot-thumnail-without-img">
              <NuxtImg
                :src="asset.thumbnail.url"
                :format="asset.thumbnail.format"
                :alt="`${asset.title} - ${asset.resources[0].name}`"
              />
              <span
                class="text-center"
              >{{ asset.title }}.{{ asset.resources[0].url.split('.').pop() }}</span>
            </div>
            <NuxtImg
              class="shot-thumbnail-icon"
              :src="asset.thumbnail.url"
              :format="asset.thumbnail.format"
              :alt="`${asset.title} - ${asset.resources[0].name}`"
            />
          </figure>
          <NuxtLink :to="`/asset/${asset.id}`" class="shot-thumbnail__link" />
        </template>
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
      </NuxtLink>
      <div class="shot-details-container">
        <p class="shots-item__desc">{{ asset.description }}</p>
        <div class="flex items-center justify-between">
          <div class="user-information">
            <a href class="user-infor__avatar">
              <img :src="asset.author.avatar.url" alt width="24" height="24" />
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