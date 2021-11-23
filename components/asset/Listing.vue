<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import MasonryWall from '@yeger/vue2-masonry-wall'
import { IAssetFilter, IAsset } from '~/@types/asset'
import { useAssetStore } from '~/stores/asset'
import { useTagStore } from '~/stores/tag'

Vue.use(MasonryWall)

export default Vue.extend({
  name: 'AssetListing',
  props: {
    filters: {
      type: Object as PropType<IAssetFilter>,
      required: true,
    },
    loadMore: {
      type: Boolean,
      default: true
    }
  },
  // emits: ['update:filters', 'reload'],
  data() {
    return {
      showFilters: false,
      fetchingAsset: true,
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
    await Promise.all([
      useAssetStore().fetchAssetMetaData(),
      this.fetchAssets()
    ])
  },
  computed: {
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
    },
    loadMoreAble(): boolean {
      return this.loadMore && !this.fetchingAsset && this.assets.length === this.filters.limit + this.filters.start
    }
  },
  created() {
    this.$watch(() => this.filters, async (newFilters) => {
      console.log(newFilters)
      await this.fetchAssets()
    }, { deep: true })
  },
  methods: {
    updateFilters(update: Partial<IAssetFilter>) {
      this.$emit('update:filters', {
        ...this.filters,
        start: 0,
        ...update
      })
    },
    selectSort(item: { name: string, value: string }) {
      this.updateFilters({ sort: item.value })
    },
    async fetchAssets() {
      this.fetchingAsset = true
      const results = await useAssetStore().fetchAssets(this.filters)
      if (this.filters.start > 0) {
        this.assets = [...this.assets, ...results]
      } else {
        this.assets = results
      }
      this.fetchingAsset = false
    },
    loadMoreAssets() {
      this.updateFilters({ start: this.filters.start + this.filters.limit })
    }
  },
})
</script>

<template>
  <div>
    <div class="filter-subnav">
      <div class="filter-subnav-inner flex flex-row items-center justify-between">
        <div class="filter-views mr-10">
          <CoreFormSlideToggle :is-absolute="true">
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
          <ul class="overflow-x-auto overflow-y-hidden whitespace-nowrap px-1 flex justify-between">
            <li v-for="tag in popularTags" :key="tag.id" class="inline-block">
              <a
                class="filter-categories__link"
                :class="{ active: tag.id === filters.tag }"
                @click="updateFilters({ tag: tag.id })"
              >{{ tag.name }}</a>
            </li>
          </ul>
        </div>
        <div
          class="filter-settings active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-brand select-none"
          @click="showFilters = !showFilters"
        >
          <CoreIconFilter />
          <span class="label" title="Filters">Filters</span>
        </div>
      </div>
    </div>
    <!-- asset filter ( types, channel, etc ) -->
    <AssetFilter :filters="filters" :show="showFilters" @update:filters="updateFilters($event)" />
    <!-- asset listing -->
    <div class="shots-grid relative min-h-[400px]">
      <div
        v-if="fetchingAsset"
        class="absolute inset-0 z-10 flex justify-center items-center bg-white bg-opacity-70"
      >
        <FontAwesomeIcon icon="fire" size="6x" class="text-brand animate-bounce" />
      </div>
      <!-- masonry style listing assets -->
      <MasonryWall
        v-if="assets.length > 0"
        class="grid-masonry"
        :items="assets"
        :ssr-column="3"
        :column-width="300"
        :gap="16"
      >
        <template #default="{ item, index }">
          <AssetCard
            :asset="item"
            :class="{ 'asset-transition': filters.start <= index && index < filters.start + filters.limit }"
          />
        </template>
      </MasonryWall>
      <!-- not found image -->
      <div v-else-if="!fetchingAsset" class="py-10 flex flex-col items-center justify-center">
        <NuxtPicture src="/no-photo.png" width="300" />
        <h3 class="mt-6">Sorry, we can not found any assets :(</h3>
      </div>
    </div>
    <!-- load more -->
    <div v-if="loadMoreAble" class="flex pt-12 pb-20 justify-center">
      <button class="btn btn-primary" @click="loadMoreAssets()">Load More</button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.asset-transition {
  @apply transition-all duration-500 ease-out -translate-y-48;
}
</style>