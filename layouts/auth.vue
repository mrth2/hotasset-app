<script lang="ts">
import Vue from 'vue'
// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag'

const HEADER_CATEGORIES_QUERY = gql`
    query HEADER_CATEGORIES {
        headerCategories: categories(where: { parent_category_null: true }) {
            title
            slug
            is_new
            sub_categories {
                title
                slug
                is_new
                sub_categories {
                    title
                    slug
                    is_new
                }  
            }
        }
    } 
`

export default Vue.extend({
  name: 'NoFooterLayout',
  async fetch() {
    await this.$apollo
      .query({ query: HEADER_CATEGORIES_QUERY })
      .then(res => {
        this.$store.commit('header/setCategories', res.data.headerCategories)
      })
  }
})
</script>
<template>
  <div>
    <Header />
    <main class="auth-page border-t relative overflow-hidden">
      <div class="max-w-screen-xl mx-auto px-5">
        <div class="content py-10 flex justify-between relative">
          <aside class="hidden lg:block pt-12">
            <h2 class="text-4xl font-bold">
              <span class="text-gray-600 lg:block mb-2">Welcome to</span>
              <span class="text-gray-900">HotAsset</span>
            </h2>
          </aside>
          <!-- nuxt right content -->
          <Nuxt class="w-full sm:max-w-lg mx-auto lg:mr-40 self-center" />
        </div>
      </div>
      <img
        srcset="~/assets/images/social-media-instagram-digital-marketing-concept-3d-rendering.png 2x"
        alt
        class="absolute bottom-0 left-0 hidden w-3/12 lg:block xl:w-auto"
      />
    </main>
  </div>
</template>
<style scoped lang="postcss">
:global(body) {
  @apply min-h-screen;
}
</style>