<script lang="ts">
import Vue from 'vue'
import MasonryWall from '@yeger/vue2-masonry-wall'
import 'swiper/css/swiper.min.css'
import 'swiper/js/swiper'
// import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { IAsset } from '~/@types/asset'
import { useAssetStore } from '~/stores/asset'
import { IFile, IUser } from '~/@types'

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
  },
  methods: {
    async fetchAssets() {
      this.assets = await (await useAssetStore().fetchAssets(this.filters))
    },
    getAssetType(resource: IFile) {
      const { types } = useAssetStore()
      return types.find(type => {
        return !!type.mimes.find(mime => mime.mimeType === resource.mime)
      })
    },
    getAssetImages(asset: IAsset) {
      return asset.resources
        .map(resource => {
          const type = this.getAssetType(resource)
          if (type?.value === 'pdf') {
            return require('~/assets/images/icons/pdf.svg')
          }
          else if (type?.value === 'csv') {
            return require('~/assets/images/icons/csv.svg')
          }
          else if (type?.value === 'ppt') {
            return require('~/assets/images/icons/ppt.svg')
          }
          else if (type?.value === 'image') {
            return resource.url
          }
          return null
        })
        .filter(resource => resource)
    },
    getThumbnail(asset: IAsset) {
      return asset.resources.find(resource => {
        return this.getAssetType(resource)?.value === 'image'
      })?.url
    },
    getTypedAsset(asset: unknown): IAsset {
      return asset as IAsset
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
            <a class="banner__btn btn-primary" href="/signup/new">Sign up</a>
          </div>
          <div class="banner-image">
            <img srcset="~/assets/images/homepage/hero-illustration.png 2x" alt class="mx-auto" />
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
                    @click="toggle"
                  >
                    <span>{{ sortTypes[0].name }}</span>
                    <CoreIconCaretDown />
                  </span>
                </template>
                <template #content="{ hide }">
                  <div class="btn-dropdown-options">
                    <ul @click="hide">
                      <li v-for="item in sortTypes" :key="item.value">
                        <a
                          class="btn-dropdown-option__link"
                          :class="{ active: item.value === filters.sort }"
                          @click="filters.sort === item.value"
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
                <li class="inline-block">
                  <a class="filter-categories__link">Display</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Native</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Social</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Whitepaper</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Landing Page</a>
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
        <div class="shots-grid">
          <MasonryWall
            class="grid-masonry"
            :items="assets"
            :ssr-column="1"
            :column-width="300"
            :gap="16"
          >
            <template #default="{ item }">
              <div class="shot-item">
                <div class="inner">
                  <div class="shot-thumbnail group">
                    <figure>
                      <img :src="getThumbnail(item)" alt />
                    </figure>
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
                    <a class="shot-thumbnail__link" href="#"></a>
                    <div class="shot-thumbnail-overlay">
                      <div class="shot-thumbnail-overlay-content">
                        <div class="shot-title">{{ getTypedAsset(item).title }}</div>
                        <div class="shot-action">
                          <a class="like-shot" itle="Like this shot">
                            <CoreIconFavorite />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="shot-details-container">
                    <p class="shots-item__desc">{{ getTypedAsset(item).description }}</p>
                    <div class="flex items-center justify-between">
                      <div class="user-information">
                        <a href class="user-infor__avatar">
                          <img
                            :src="getTypedAsset(item).author.avatar.url"
                            alt
                            width="24"
                            height="24"
                          />
                        </a>
                        <a href class="user-info__name">{{ getTypedAsset(item).author.last_name }}</a>
                      </div>
                      <div class="shot-statistics">
                        <a>
                          <CoreIconFavorite />
                        </a>
                        <span>{{ getTypedAsset(item).likes || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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