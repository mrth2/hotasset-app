import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { IAssetChannel, IAssetType } from '~/@types/asset'

export const useAssetStore = defineStore('asset', {
  state: () => ({
    types: [] as IAssetType[],
    channels: [] as IAssetChannel[],
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
      }).then(({data}) => {
        this.types = data.assetTypes
        this.channels = data.assetChannels
      })
    }
  }
})
