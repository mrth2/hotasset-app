<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { IAssetFilter } from '~/@types/asset'
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
      localFilters: this.filters
    }
  },
  computed: {
    assetTypes() {
      return useAssetStore().types
    },
    assetChannels() {
      return useAssetStore().channels
    }
  },
  watch: {
    filters: {
      handler(newFilters: IAssetFilter) {
        this.$emit('update:filters', newFilters)
      },
      immediate: true
    }
  }
})
</script>
<template>
  <CoreFormSlideToggle v-if="show">
    <template #content>
      <div class="shot-filters">
        <form action class="shot-filters-form">
          <fieldset class="find-shots-assets-type">
            <label for class="shot-filter-form-label">Asset Type</label>
            <select
              v-model="localFilters.type"
              class="shot-filter-form-control form-control-select"
            >
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
              v-model="localFilters.channel"
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
    </template>
  </CoreFormSlideToggle>
</template>