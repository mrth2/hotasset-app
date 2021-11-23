<script lang="ts">
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
export default Vue.extend({
  name: 'MultiSelect',
  components: {
    Multiselect
  },
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ['model'],
  computed: {
    propModel: {
      get(): any {
        return this.model
      },
      set(value: any): void {
        this.$emit('update:model', value)
      }
    }
  }
})
</script>
<template>
  <Multiselect v-model="propModel" class="form-control" v-bind="$attrs" v-on="$listeners" />
</template>
<style scoped lang="postcss">
.multiselect ::v-deep {
  @apply py-0;
  min-height: 40px;
  .multiselect__spinner {
    @apply bg-transparent;
  }
  .multiselect__tags {
    @apply border-0 border-none bg-transparent pb-0 pl-0 h-auto min-h-0;
  }
  .multiselect__tag {
    @apply bg-tag text-black py-2.5;
    .multiselect__tag-icon {
      @apply hover:bg-transparent;

      &:after {
        @apply text-black;
      }
    }
  }
  .multiselect__tag-icon {
    @apply pt-1.5;
  }
  .multiselect__input {
    @apply bg-transparent;
  }
  .multiselect__single {
    @apply leading-6;
  }
  .multiselect__placeholder {
    @apply pt-0 mb-2;
  }
}
</style>