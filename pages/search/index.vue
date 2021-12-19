<script lang="ts">
import Vue from 'vue'
import { IAsset, IAssetFilter } from '~/types/asset'
import { useAssetStore } from '~/stores/asset'
export default Vue.extend({
	name: 'Search',
	data() {
		return {
			assets: [] as IAsset[],
			totalResults: null as number | null,
			// filters
			filters: {
				search: this.$route.query.q as string,
				type: undefined,
				channel: undefined,
				sort: useAssetStore().sortTypes[0].value,
				limit: 24,
				tag: undefined,
				category: this.$route.query.category as string,
				start: 0
			} as Partial<IAssetFilter>
		}
	},
	computed: {
		query(): string {
			return this.$route.query.q as string
		},
		category(): string {
			return this.$route.query.category as string
		}
	},
	watch: {
		query() {
			this.filters.search = this.query
		},
		category() {
			this.filters.category = this.category
		}
	}
})
</script>
<template>
	<main class="border-t relative">
		<div class="container mx-auto px-4 sm:px-6">
			<div class="text-center pt-12 flex flex-col items-center">
				<h1 class="search-heading">
					‘{{ query }}’
					<small v-if="totalResults" class="total-count">{{
						totalResults
					}}</small>
				</h1>
				<!-- <ul class="breadcrumb flex items-center justify-center space-x-2">
					<li><a href="" class="breadcrumb__link">Digital Marketing</a></li>
					<li><a href="" class="breadcrumb__link">Webpages</a></li>
					<li>Whitepaper</li>
				</ul> -->
			</div>
			<!-- asset listing query with current search -->
			<AssetListing
				:filters="filters"
				:get-count="true"
				@update:filters="filters = $event"
				@counted="totalResults = $event"
			/>
		</div>
	</main>
</template>

<style scoped lang="postcss">
.search-heading {
	@apply text-gray-900 text-2xl lg:text-5xl font-bold flex items-center capitalize;
}
.total-count {
	@apply inline-block bg-brand py-3 px-4 text-sm leading-3 rounded-3xl text-white ml-3;
}
</style>
