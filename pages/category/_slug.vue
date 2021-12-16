<script lang="ts">
import Vue from 'vue'
import { IAssetFilter } from '~/types/asset'
import { useAssetStore } from '~/stores/asset'
import { useHeaderStore } from '~/stores/header'
export default Vue.extend({
  name: 'Category',
  data() {
    return {
      fetchingAsset: false,
      filters: {
        // category: this.$route.params.slug,
        type: undefined,
        channel: undefined,
        sort: useAssetStore().sortTypes[0].value,
        limit: 24,
        tag: undefined,
        start: 0
      } as Partial<IAssetFilter>,
    }
  },
  created() {
    const category = useHeaderStore().flattenCategories.find(cat => cat.slug === this.$route.params.slug)
    if (category) {
      const categories = [category.id]
      if (category.sub_categories && category.sub_categories.length) {
        category.sub_categories.forEach(child => {
          categories.push(child.id)
        })
      }
      this.filters.categories = categories
    }
  }
})
</script>

<template>
  <div>
    <!-- main banner with CTA -->
    <Banner />
    <main class="border-t relative">
      <div class="container mx-auto px-4 sm:px-6">
        <!-- asset main listing with all filters -->
        <AssetListing :filters="filters" @update:filters="filters = $event" />
      </div>
    </main>
  </div>
</template>