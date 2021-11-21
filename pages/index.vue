<script lang="ts">
import Vue from 'vue'
import MasonryWall from '@yeger/vue2-masonry-wall'
// import 'swiper/css/swiper.min.css'
// import 'swiper/js/swiper'
// import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { IAsset } from '~/@types/asset'
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
      filters: {
        type: undefined,
        channel: undefined,
        sort: useAssetStore().sortTypes[0].value,
        limit: 24,
        start: 0
      },
      assets: [] as IAsset[],
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
    await this.fetchAssets()
  },
  computed: {
    user() {
      return this.$strapi.user as IUser
    },
    sortTypes() {
      return useAssetStore().sortTypes
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
  methods: {
    async fetchAssets() {
      this.assets = await (await useAssetStore().fetchAssets(this.filters))
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
                <template #toggle="{ toggle }">
                  <span
                    class="btn-dropdown active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-brand"
                    @click="toggle()"
                  >
                    <span>{{ sortTypes[0].name }}</span>
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
                <li class="inline-block">
                  <a class="filter-categories__link active">All</a>
                </li>
                <li v-for="tag in popularTags" :key="tag.id" class="inline-block">
                  <a class="filter-categories__link">{{ tag.name }}</a>
                </li>
              </ul>
            </div>
            <div
              class="filter-settings active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-brand"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                class="icon filter-icon icon-14"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 6C0 5.17157 0.671573 4.5 1.5 4.5H22.5C23.3284 4.5 24 5.17157 24 6C24 6.82843 23.3284 7.5 22.5 7.5H1.5C0.671573 7.5 0 6.82843 0 6ZM3 12C3 11.1716 3.67157 10.5 4.5 10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H4.5C3.67157 13.5 3 12.8284 3 12ZM7.5 16.5C6.67157 16.5 6 17.1716 6 18C6 18.8284 6.67157 19.5 7.5 19.5H16.5C17.3284 19.5 18 18.8284 18 18C18 17.1716 17.3284 16.5 16.5 16.5H7.5Z"
                />
              </svg>
              <span class="label" title="Filters">Filters</span>
            </div>
          </div>
        </div>
        <div class="shot-filters hidden">
          <form action class="shot-filters-form">
            <fieldset class="find-shots-assets-type">
              <label for class="shot-filter-form-label">Asset Type</label>
              <select v-model="filters.type" class="shot-filter-form-control form-control-select">
                <option
                  v-for="item in assetTypes"
                  :key="item.value"
                  :value="item.value"
                >{{ item.name }}</option>
              </select>
            </fieldset>
            <fieldset class="find-shots-channel">
              <label for class="shot-filter-form-label">Channel</label>
              <select
                v-model="filters.channel"
                class="shot-filter-form-control form-control-select"
              >
                <option
                  v-for="item in assetChannels"
                  :key="item.value"
                  :value="item.value"
                >{{ item.name }}</option>
              </select>
            </fieldset>
            <fieldset class="find-shots-downloads">
              <label for class="shot-filter-form-label">Downloads</label>
              <select id name class="shot-filter-form-control form-control-select">
                <option value="yes">Yes</option>
                <option value="no">Yes</option>
              </select>
            </fieldset>
            <fieldset class="find-shots-something">
              <label for class="shot-filter-form-label">Something</label>
              <select id name class="shot-filter-form-control form-control-select">
                <option value>All</option>
              </select>
            </fieldset>
          </form>
        </div>
        <div v-if="assets.length" class="shots-grid">
          <MasonryWall
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
          <a class="btn-primary" href="/signup/new">Sign up to continue</a>
          <a href="/session/new">or sign in</a>
        </div>
      </div>
    </main>
  </div>
</template>