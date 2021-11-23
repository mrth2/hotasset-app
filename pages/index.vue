<script lang="ts">
import Vue from 'vue'
import { IAssetFilter } from '~/@types/asset'
import { useAssetStore } from '~/stores/asset'

export default Vue.extend({
  data() {
    return {
      // filters
      filters: {
        type: undefined,
        channel: undefined,
        sort: useAssetStore().sortTypes[0].value,
        limit: 24,
        tag: undefined,
        start: 0
      } as IAssetFilter,
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
        <AssetListing :filters="filters" :load-more="true" @update:filters="filters = $event" />
        <!-- home CTA -->
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