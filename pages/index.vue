<script lang="ts">
import Vue from 'vue'
import MasonryWall from '@yeger/vue2-masonry-wall'
// import 'swiper/css/swiper.min.css'
// import 'swiper/js/swiper'
// import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { IAssetFilter, IAsset } from '~/@types/asset'
import { IUser } from '~/@types/user'
import { useAssetStore } from '~/stores/asset'
import { useTagStore } from '~/stores/tag'

Vue.use(MasonryWall)

export default Vue.extend({
  /* components: {
    Swiper,
    SwiperSlide,
  }, */
  data() {
    return {
      // filters
      showFilters: false,
      filters: {
        type: undefined,
        channel: undefined,
        sort: useAssetStore().sortTypes[0].value,
        limit: 24,
        tag: undefined,
        start: 0
      } as IAssetFilter,
      // asset
      assets: [] as IAsset[],
      fetchingAsset: true,
      swiperOption: {
        slidersPerView: 1,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        }
      }
    }
  },
  async fetch() {
    await useAssetStore().fetchAssetMetaData()
  },
  computed: {
    user() {
      return this.$strapi.user as IUser
    },
    sortTypes() {
      return useAssetStore().sortTypes
    },
    currentSortType(): { name: string, value: string } {
      return this.sortTypes.find(sort => sort.value === this.filters.sort) || this.sortTypes[0]
    },
    assetTypes() {
      return useAssetStore().types
    },
    assetChannels() {
      return useAssetStore().channels
    },
    popularTags() {
      return useTagStore().popularTags
    }
  },
  watch: {
    filters: {
      handler() {
        this.fetchAssets()
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    await this.fetchAssets()
  },
  methods: {
    async fetchAssets() {
      this.fetchingAsset = true
      this.assets = await useAssetStore().fetchAssets(this.filters)
      this.fetchingAsset = false
    },
    selectSort(item: { name: string, value: string }) {
      this.filters.sort = item.value;
    }
  }
})
</script>

<template>
  <div>
    <section class="banner">
      <div class="container mx-auto">
        <div class="banner-inner">
          <div class="banner-content px-4 sm:px-6">
            <h1 class="banner__title">Every Play in the Marketing & Sales Playbook</h1>
            <p class="banner__desc">
              Dribbble is the leading destination to find &amp; showcase creative work and
              home to the world's
              best
              design professionals.
            </p>
            <NuxtLink v-if="$strapi.user" class="banner__btn btn-primary" to="/upload">Upload now</NuxtLink>
            <NuxtLink v-else class="banner__btn btn-primary" to="/signup">Sign up</NuxtLink>
          </div>
          <div class="banner-image">
            <NuxtPicture
              :src="`/homepage/${!$strapi.user ? 'hero-' : ''}illustration.png`"
              alt
              class="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
    <main class="border-t relative">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="filter-subnav">
          <div class="filter-subnav-inner flex flex-row items-center justify-between">
            <div class="filter-views mr-10">
              <CoreFormSlideToggle>
                <template #trigger="{ toggle }">
                  <span
                    class="btn-dropdown active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-brand"
                    @click="toggle()"
                  >
                    <span>{{ currentSortType.name }}</span>
                    <CoreIconCaretDown />
                  </span>
                </template>
                <template #content="{ hide }">
                  <div class="btn-dropdown-options">
                    <ul>
                      <li v-for="item in sortTypes" :key="item.value">
                        <a
                          class="btn-dropdown-option__link cursor-pointer"
                          :class="{ active: item.value === filters.sort }"
                          @click="selectSort(item); hide()"
                        >{{ item.name }}</a>
                      </li>
                    </ul>
                  </div>
                </template>
              </CoreFormSlideToggle>
            </div>
            <div class="filter-categories relative text-center overflow-x-auto overflow-y-hidden">
              <ul
                class="overflow-x-auto overflow-y-hidden whitespace-nowrap px-1 flex justify-between"
              >
                <li v-for="tag in popularTags" :key="tag.id" class="inline-block">
                  <a
                    class="filter-categories__link"
                    :class="{ active: tag.id === filters.tag }"
                    @click="filters.tag = tag.id"
                  >{{ tag.name }}</a>
                </li>
              </ul>
            </div>
            <div
              class="filter-settings active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-brand"
              @click="showFilters = !showFilters"
            >
              <CoreIconFilter />
              <span class="label" title="Filters">Filters</span>
            </div>
          </div>
        </div>
        <AssetFilter :filters="filters" :show="showFilters" @update:filters="filters = $event" />
        <div v-if="assets.length" class="shots-grid">
          <div v-if="fetchingAsset" class="flex justify-center items-center h-96">
            <FontAwesomeIcon icon="fire" size="6x" class="text-brand animate-bounce" />
          </div>
          <MasonryWall
            v-else
            class="grid-masonry"
            :items="assets"
            :ssr-column="1"
            :column-width="300"
            :gap="16"
          >
            <template #default="{ item }">
              <AssetCard :asset="item" />
            </template>
          </MasonryWall>
        </div>
        <div class="infinite-login-actions">
          <template v-if="$strapi.user">
            <NuxtLink class="btn-primary" to="/upload">Upload new asset</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink class="btn-primary" to="/signup">Sign up to continue</NuxtLink>
            <NuxtLink to="/login">or sign in</NuxtLink>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>