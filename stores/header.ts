import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { ICategory } from '~/types'

export const HEADER_CATEGORIES_QUERY = gql`
  query HEADER_CATEGORIES {
    headerCategories: categories(where: { parent_category_null: true }) {
      id
      title
      slug
      is_new
      sub_categories {
        id
        title
        slug
        is_new
        sub_categories {
          id
          title
          slug
          is_new
        }  
      }
    }
  } 
`
export const useHeaderStore = defineStore('header', {
  state: () => {
    return {
      categories: [] as ICategory[]
    }
  },
  getters: {
    flattenCategories(state) {
      function flatten(categories: ICategory[]) {
        return categories.reduce((acc, category) => {
          acc.push(category)
          if (category.sub_categories) {
            acc = acc.concat(flatten(category.sub_categories))
          }
          return acc
        }, [] as ICategory[])
      }
      return flatten(state.categories).map(category => {
        return {
          id: category.id,
          title: category.title,
          slug: category.slug,
          is_new: category.is_new
        }
      })
    }
  },
  actions: {
    async fetchCategories() {
      await this.$nuxt.app.apolloProvider?.defaultClient.query({ query: HEADER_CATEGORIES_QUERY })
        .then((res) => {
          this.categories = res.data.headerCategories
        })
    }
  }
})