<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { IAssetChannel, IAssetFilter, IAssetType } from '~/@types/asset'
import { useAssetStore } from '~/stores/asset'

export default Vue.extend({
  props: {
    filters: {
      type: Object as PropType<IAssetFilter>,
      default() {
        return {} as IAssetFilter
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localFilters: {
        type: null as IAssetType | null,
        channel: null as IAssetChannel | null,
        download: 'Yes',
        something: null,
      }
    }
  },
  computed: {
    assetTypes() {
      return useAssetStore().types.map(t => ({
        id: t.id,
        name: t.name
      }))
    },
    assetChannels() {
      return useAssetStore().channels.map(c => ({
        id: c.id,
        name: c.name
      }))
    }
  },
  watch: {
    localFilters: {
      handler() {
        this.$emit('update:filters', {
          ...this.filters,
          type: this.localFilters.type?.id,
          channel: this.localFilters.channel?.id,
          download: this.localFilters.download === 'Yes',
        })
      },
      deep: true
    }
  }
})
</script>
<template>
  <CoreFormSlideToggle :manual-show="show">
    <template #content>
      <div class="shot-filters">
        <form action class="shot-filters-form">
          <fieldset class="find-shots-assets-type">
            <label for class="shot-filter-form-label">Asset Type</label>
            <CoreFormMultiSelect
              id="asset-type"
              :model="localFilters.type"
              placeholder="Select Asset Type"
              :searchable="false"
              :options="assetTypes"
              :multiple="false"
              track-by="id"
              label="name"
              class="shot-filter-form-control form-control-select capitalize"
              @update:model="localFilters.type = $event"
            />
          </fieldset>
          <fieldset class="find-shots-channel">
            <label for class="shot-filter-form-label">Channel</label>
            <CoreFormMultiSelect
              id="asset-channel"
              :model="localFilters.channel"
              placeholder="Select Asset Channel"
              :searchable="false"
              :options="assetChannels"
              track-by="id"
              label="name"
              class="shot-filter-form-control form-control-select capitalize"
              @update:model="localFilters.channel = $event"
            />
          </fieldset>
          <fieldset class="find-shots-downloads">
            <label for class="shot-filter-form-label">Downloads</label>
            <CoreFormMultiSelect
              id="asset-download"
              :model="localFilters.download"
              placeholder="Select Downloadable"
              :searchable="false"
              :allow-empty="false"
              :options="['Yes', 'No']"
              class="shot-filter-form-control form-control-select capitalize"
              @update:model="localFilters.download = $event"
            />
          </fieldset>
          <fieldset class="find-shots-something">
            <label for class="shot-filter-form-label">Something</label>
            <CoreFormMultiSelect
              id="asset-download"
              :model="localFilters.something"
              placeholder="Select Something"
              :searchable="false"
              :options="['All', 'One', 'Two', 'Three']"
              class="shot-filter-form-control form-control-select capitalize"
              @update:model="localFilters.something = $event"
            />
          </fieldset>
        </form>
      </div>
    </template>
  </CoreFormSlideToggle>
</template>

<style scoped lang="postcss">
::v-deep .multiselect__content-wrapper {
  @apply left-0;

  .multiselect__option {
    @apply capitalize;
  }
}
.shot-filter-form-control {
  @apply bg-white;
}
</style>