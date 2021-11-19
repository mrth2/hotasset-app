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
  <Multiselect
    v-model="propModel"
    class="form-control"
    v-bind="$attrs"
  />
</template>
<style scoped lang="postcss">
::v-deep .multiselect__tags {
	@apply border-0 border-none bg-transparent pb-0 pl-0 h-auto min-h-0;
}
::v-deep .multiselect__tag {
	@apply bg-tag text-black py-2.5;
	.multiselect__tag-icon {
		@apply hover:bg-transparent;

		&:after {
			@apply text-black;
		}
	}
}
/* ::v-deep .multiselect__option--highlight {
	@apply bg-tag;
} */
::v-deep .multiselect__tag-icon {
  @apply pt-1.5;
}
::v-deep .multiselect__input {
	@apply bg-transparent;
}
.form-control.multiselect {
	@apply py-0;
	min-height: 40px;
}
</style>