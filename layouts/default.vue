<script lang="ts">
import Vue from 'vue'
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
    name: 'DefaultLayout',
    async fetch() {
        await this.$apollo
            .query({ query: HEADER_CATEGORIES_QUERY })
            .then(res => {
                this.$store.commit('header/setCategories', res.data.headerCategories)
            })
    },
    mounted() {
        console.log(this.$auth.$state)
    }
})
</script>
<template>
    <div>
        <Header />
        <Nuxt />
    </div>
</template>
<style scoped lang="postcss">
:global(body) {
    @apply min-h-screen;
}
</style>