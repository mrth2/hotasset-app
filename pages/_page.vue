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
			page: null as IPage | null
		}
	},
	head() {
		let title = 'Hot Asset - Inspiration to do your best work.'
		let description =
			'Hot Asset is where sales and marketing professionals gain inspiration to do their best work through an extensive library of relevant asset examples.'
		if (this.page) {
			if (this.page.page.SEO.meta_title) {
				title = this.page.page.SEO.meta_title
			} else if (this.page.page.title) {
				title = this.page.page.title
			}
			if (this.page.page.SEO.meta_description) {
				description = this.page.page.SEO.meta_description
			} else if (this.page.page.description) {
				description = this.page.page.description
			}
		}
		return {
			title,
			meta: [{ hid: 'description', name: 'description', content: description }]
		}
	},
	computed: {
		pageContent(): string {
			return (
				this.page?.page.content.replace(/<style>(.*)<\/style>/g, '') || ''
			)
		}
	},
	mounted() {
		console.log(this.page.page)
	}
})
</script>

<template>
	<div v-if="page">
		<!-- main banner with CTA -->
		<Banner :title="page.page.title" :description="page.page.description" />
		<main class="border-t relative">
			<div class="container mx-auto py-12 px-4 sm:px-6" v-html="pageContent" />
		</main>
	</div>
</template>

<style scoped lang="postcss">
.container ::v-deep {
	* {
		font-family: 'Roboto', sans-serif !important;
		@apply font-normal text-base text-paragraph !important;
	}
}
::v-deep table {
	tr {
		td {
			@apply px-3;
		}
	}
}
</style>
