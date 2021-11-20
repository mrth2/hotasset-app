import gql from "graphql-tag"
import { defineStore } from "pinia"
import { ITag } from "~/@types"

export const useTagStore = defineStore('tag', {
  state: () => ({
    popularTags: [] as ITag[]
  }),
  actions: {
    async fetchPopularTags() {
      await this.$nuxt.app.apolloProvider?.defaultClient.query<{ tags: ITag[] }>({
        query: gql`
          query POPULAR_TAGS { 
            tags (where: { is_featured: true }) {
              id
              name
              slug
            }
          }
        `
      }).then(res => {
        this.popularTags = res.data.tags
      })
    }
  }
})