<script lang="ts">
import Vue from 'vue'
import { IAssetFilter } from '~/@types/asset'
import { useAssetStore } from '~/stores/asset'
export default Vue.extend({
  name: 'Category',
  data() {
    return {
      fetchingAsset: false,
      filters: {
        category: this.$route.params.slug,
        type: undefined,
        channel: undefined,
        sort: useAssetStore().sortTypes[0].value,
        limit: 24,
        tag: undefined,
        start: 0
      } as Partial<IAssetFilter>,
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