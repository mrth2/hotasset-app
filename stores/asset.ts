import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { IAsset, IAssetChannel, IAssetType } from '~/@types/asset'

export const useAssetStore = defineStore('asset', {
  state: () => ({
    types: [] as IAssetType[],
    channels: [] as IAssetChannel[],
    sortTypes: [
      { name: 'Popular', value: 'title:asc' },
      { name: 'Trending', value: 'likes:desc' },
      { name: 'Latest', value: 'updatedAt:desc' },
    ]
  }),
  actions: {
    async fetchAssetMetaData() {
      await this.$nuxt.app.apolloProvider?.defaultClient.query({
        query: gql`
          query ASSET_CHANNEL {
            assetChannels (sort: "order:asc") {
              name
              value
            }
            assetTypes (sort: "order:asc") {
              name
              value
              mimes {
                mimeType
                fileExtension
              }
            }
          }
        `
      }).then(({ data }) => {
        this.types = data.assetTypes
        this.channels = data.assetChannels
      })
    },
    async fetchAssets(options: {
      channel?: string,
      type?: string,
      sort?: string,
      start?: number,
      limit?: number
    }) {
      const response = await this.$nuxt.app.apolloProvider?.defaultClient.query<{ assets: IAsset[] }>({
        query: gql`
          query ASSETS ($type: ID, $channel: ID, $tag: ID, $sort: String, $start: Int, $limit: Int) {
            assets (where: { types: $type, channels: $channel, tags: $tag}, sort: $sort, start: $start, limit: $limit) {
              id
              title
              description
              likes
              author {
                first_name
                last_name
                avatar {
                  url
                }
              }
              tags {
                name
              }
              types {
                name
              }
              channels {
                name
              }
              upvoters {
                id
              }
              resources {
                name
                mime
                ext
                size
                url
                width
                height
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { options }
      })
      if (response) {
        console.log(response.data.assets)
        return response.data.assets
      }
      return [] as IAsset[]
    }
  }
})
