import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { ICategory, ISocialLinks } from '~/types'

export const APP_REQUIRED_DATA = gql`
  query APP_REQUIRED_DATA {
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
    socialLink {
      linkedin
      facebook
    }
  } 
`
export const useHeaderStore = defineStore('header', {
  state: () => {
    return {
      categories: [] as ICategory[],
      socialLinks: {} as ISocialLinks
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
      return flatten(state.categories)
    }
  },
  actions: {
    async fetchRequiredData() {
      await this.$nuxt.app.apolloProvider?.defaultClient.query({ query: APP_REQUIRED_DATA })
        .then((res) => {
          this.categories = res.data.headerCategories
          this.socialLinks = res.data.socialLink
        })
    }
  }
})