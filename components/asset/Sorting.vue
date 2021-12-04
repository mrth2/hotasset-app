<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { useAssetStore } from '~/stores/asset'
import { IAssetFilter } from '~/@types/asset'
export default Vue.extend({
	props: {
		filters: {
			type: Object as PropType<IAssetFilter>,
			default() {
				return {} as IAssetFilter
			}
		}
	},
	computed: {
		sortTypes() {
			return useAssetStore().sortTypes
		},
		currentSortType(): { name: string; value: string } {
			return (
				this.sortTypes.find((sort) => sort.value === this.filters.sort) ||
				this.sortTypes[0]
			)
		}
	},
	methods: {
		selectSort(item: { name: string; value: string }) {
			this.$emit('update:sort', { sort: item.value })
		}
	}
})
</script>
<template>
	<div class="filter-views mr-10">
		<CoreFormSlideToggle :is-absolute="true" :hide-on-click-out="true">
			<template #trigger="{ toggle }">
				<span
					class="
						btn-dropdown
						active:scale-95 active:ring-0 active:ring-transparent
						hover:ring-2 hover:ring-brand
					"
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
								@click="
									selectSort(item);
									hide()
								"
								>{{ item.name }}</a
							>
						</li>
					</ul>
				</div>
			</template>
		</CoreFormSlideToggle>
	</div>
</template>
