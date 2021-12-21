<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { IPage } from '~/types/page'

export default Vue.extend({
	async asyncData({ app, route, error }) {
		let page: IPage | null = null
		await app.apolloProvider?.defaultClient
			.query<{ staticPages: Array<IPage> }>({
				query: gql`
					query PAGE($page: String!) {
						staticPages(where: { slug: $page }) {
							slug
							page {
								title
								description
								cover {
									url
								}
								SEO {
									meta_title
									meta_description
								}
								content
							}
						}
					}
				`,
				variables: {
					page: route.params.page
				}
			})
			.then(({ data }) => {
				if (!data.staticPages.length) {
					error({ statusCode: 404, message: 'Page not found' })
				}
				page = data.staticPages[0]
			})
			.catch((_err) => {
				error({ statusCode: 404, message: 'Page not found' })
			})
		return {
			page
		}
	},
	data() {
		return {
			page: null as IPage | null,
			cleaned: true
		}
	},
	head() {
		let title = 'Hot Asset - Inspiration to do your best work.'
		let description =
			'Hot Asset is where sales and marketing professionals gain inspiration to do their best work through an extensive library of relevant asset examples.'
		if (this.page) {
			if (this.page.page.SEO && this.page.page.SEO.meta_title) {
				title = this.page.page.SEO.meta_title
			} else if (this.page.page.title) {
				title = this.page.page.title
			}
			if (this.page.page.SEO && this.page.page.SEO.meta_description) {
				description = this.page.page.SEO.meta_description
			} else if (this.page.page.description) {
				description = this.page.page.description
			}
		}
		return {
			title,
			meta: [{ hid: 'description', name: 'description', content: description }]
		}
	}
})
</script>

<template>
	<div v-if="page">
		<Banner :title="page.page.title" :description="page.page.description" :has-button="false" :cover="page.page.cover ? page.page.cover.url : null" />
		<main class="border-t relative">
			<div
				v-show="cleaned"
				ref="pageContent"
				class="container mx-auto py-12 px-4 sm:px-6"
				v-html="page.page.content"
			/>
		</main>
	</div>
</template>

<style scoped lang="postcss">
.container ::v-deep {
	* {
		font-family: 'Roboto', sans-serif !important;
		@apply font-normal text-base leading-6 text-paragraph !important;
	}
	h1, h1 *,
	h2, h2 *,
	h3, h3 * {
		@apply font-semibold text-lg !important;
	}
	strong, u {
		@apply font-semibold !important;
	}
	ul {
		@apply pl-4 list-disc list-inside !important;
	}
	table {
		tr {
			td {
				@apply px-3;
			}
		}
	}
}
</style>
