<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Multiselect from 'vue-multiselect'
export default Vue.extend({
	name: 'MultiSelect',
	components: {
		Multiselect
	},
	inheritAttrs: false,
	props: {
		model: {
			type: [Array, Object] as PropType<any>,
			default: null
		},
		hideContent: {
			type: Boolean as PropType<boolean>,
			default: false
		}
	},
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
		ref="multiselect"
		v-model="propModel"
		class="form-control"
		:class="{ hideContent }"
		v-bind="$attrs"
		select-label=""
		select-group-label=""
		deselect-label=""
		deselect-group-label=""
		v-on="$listeners"
	>
		<template #noOptions>
			<p>{{ $attrs.placeholder }}</p>
		</template>
	</Multiselect>
</template>
<style scoped lang="postcss">
.multiselect ::v-deep {
	@apply py-0 w-auto;
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
		@apply leading-6 bg-transparent;
	}
	.multiselect__placeholder {
		@apply pt-0 mb-2;
	}
	.multiselect__option--highlight {
		background: #bfbfc2;
	}
}
.multiselect.hideContent ::v-deep {
	.multiselect__content-wrapper {
		display: none !important;
	}
}
</style>
